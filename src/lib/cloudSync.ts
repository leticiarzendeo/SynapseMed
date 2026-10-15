import { supabase } from './supabase';

// Sincronização localStorage <-> Supabase (tabela public.user_storage).
//
// O app inteiro já persiste o estado em chaves do localStorage. Em vez de
// reescrever cada tela, esta camada:
//  1. ao fazer login, baixa as chaves do usuário para o localStorage
//     (antes do App montar, então os useState iniciais já leem os dados da nuvem);
//  2. intercepta localStorage.setItem/removeItem das chaves do app e envia
//     as mudanças para o Supabase em lote (debounce).

const TABLE = 'user_storage';
const OWNER_KEY = '__synapsemed_owner'; // id do usuário dono dos dados locais (não sincronizado)
const FLUSH_DELAY_MS = 800;
const RETRY_DELAY_MS = 5000;

export const isSyncedKey = (key: string) => /^(synapsemed_|medway_|osler_)/.test(key);

const originalSetItem = Storage.prototype.setItem;
const originalRemoveItem = Storage.prototype.removeItem;

let currentUserId: string | null = null;
let pending = new Map<string, string | null>(); // null = apagar
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing: Promise<void> | null = null;

const localSyncedKeys = () => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && isSyncedKey(k)) keys.push(k);
  }
  return keys;
};

const clearLocalSyncedKeys = () => {
  localSyncedKeys().forEach((k) => originalRemoveItem.call(localStorage, k));
};

const scheduleFlush = (delay = FLUSH_DELAY_MS) => {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushPending();
  }, delay);
};

export async function flushPending(): Promise<void> {
  if (flushing) await flushing;
  if (!supabase || !currentUserId || pending.size === 0) return;

  const userId = currentUserId;
  const batch = pending;
  pending = new Map();

  const now = new Date().toISOString();
  const upserts: { user_id: string; key: string; value: string; updated_at: string }[] = [];
  const deletes: string[] = [];
  batch.forEach((value, key) => {
    if (value === null) deletes.push(key);
    else upserts.push({ user_id: userId, key, value, updated_at: now });
  });

  flushing = (async () => {
    try {
      if (upserts.length) {
        const { error } = await supabase.from(TABLE).upsert(upserts, { onConflict: 'user_id,key' });
        if (error) throw error;
      }
      if (deletes.length) {
        const { error } = await supabase.from(TABLE).delete().eq('user_id', userId).in('key', deletes);
        if (error) throw error;
      }
    } catch (err) {
      console.warn('[SynapseMed] Falha ao sincronizar com a nuvem; nova tentativa em breve.', err);
      // Devolve à fila sem sobrescrever mudanças mais novas.
      batch.forEach((value, key) => {
        if (!pending.has(key)) pending.set(key, value);
      });
      scheduleFlush(RETRY_DELAY_MS);
    }
  })();

  try {
    await flushing;
  } finally {
    flushing = null;
  }
}

const queue = (key: string, value: string | null) => {
  pending.set(key, value);
  scheduleFlush();
};

const flushOnHide = () => {
  if (document.visibilityState === 'hidden') void flushPending();
};

function installInterceptor() {
  Storage.prototype.setItem = function (key: string, value: string) {
    if (this === localStorage && currentUserId && isSyncedKey(key)) {
      const unchanged = localStorage.getItem(key) === String(value);
      originalSetItem.call(this, key, value);
      if (!unchanged) queue(key, String(value));
      return;
    }
    originalSetItem.call(this, key, value);
  };
  Storage.prototype.removeItem = function (key: string) {
    if (this === localStorage && currentUserId && isSyncedKey(key)) {
      const existed = localStorage.getItem(key) !== null;
      originalRemoveItem.call(this, key);
      if (existed) queue(key, null);
      return;
    }
    originalRemoveItem.call(this, key);
  };
  document.addEventListener('visibilitychange', flushOnHide);
}

function uninstallInterceptor() {
  Storage.prototype.setItem = originalSetItem;
  Storage.prototype.removeItem = originalRemoveItem;
  document.removeEventListener('visibilitychange', flushOnHide);
}

/**
 * Baixa os dados do usuário para o localStorage e passa a espelhar as
 * alterações na nuvem. Deve terminar antes de o App montar.
 */
export async function startCloudSync(userId: string): Promise<void> {
  if (!supabase) return;
  if (currentUserId === userId) return;
  if (currentUserId) await stopCloudSync({ clearLocal: true });

  const { data, error } = await supabase.from(TABLE).select('key, value').eq('user_id', userId);
  if (error) throw error;

  const owner = localStorage.getItem(OWNER_KEY);
  const rows = data ?? [];

  if (rows.length > 0) {
    // A nuvem é a fonte da verdade.
    clearLocalSyncedKeys();
    rows.forEach((r) => originalSetItem.call(localStorage, r.key, r.value));
  } else if (owner && owner !== userId) {
    // Dados locais pertencem a outra conta: não vazar para esta.
    clearLocalSyncedKeys();
  } else {
    // Primeira vez na nuvem: envia o que já existe neste navegador
    // (preserva o progresso de quem usava o app antes do login).
    localSyncedKeys().forEach((k) => pending.set(k, localStorage.getItem(k)));
  }

  originalSetItem.call(localStorage, OWNER_KEY, userId);
  currentUserId = userId;
  installInterceptor();
  if (pending.size) await flushPending();
}

export async function stopCloudSync({ clearLocal }: { clearLocal: boolean }): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  await flushPending();
  uninstallInterceptor();
  currentUserId = null;
  pending = new Map();
  if (clearLocal) {
    clearLocalSyncedKeys();
    originalRemoveItem.call(localStorage, OWNER_KEY);
  }
}

/** Envia o que falta, encerra a sessão e limpa os dados locais. */
export async function signOutAndClear(): Promise<void> {
  if (!supabase) return;
  await stopCloudSync({ clearLocal: true });
  await supabase.auth.signOut();
}
