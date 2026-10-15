import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signOutAndClear } from '../lib/cloudSync';

// Bloco "Conta" da tela de Configurações (só aparece com o Supabase configurado).
export const ContaSection: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  if (!supabase) return null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm max-w-2xl text-xs space-y-3">
      <div className="flex items-center gap-2 text-on-surface font-semibold text-sm">
        <span className="material-symbols-outlined text-primary text-base">account_circle</span>
        <span>Conta &amp; Sincronização</span>
      </div>
      <p className="text-secondary leading-relaxed">
        Conectado como <span className="font-semibold text-on-surface">{email ?? '…'}</span>. Seu progresso é
        salvo automaticamente na nuvem.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await signOutAndClear();
          } finally {
            setBusy(false);
          }
        }}
        className="px-4 py-2.5 rounded-xl border border-surface-container text-on-surface font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-sm">logout</span>
        <span>{busy ? 'Saindo…' : 'Sair'}</span>
      </button>
    </div>
  );
};
