import React, { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { startCloudSync, stopCloudSync } from '../lib/cloudSync';

type Status = 'loading' | 'signedOut' | 'syncing' | 'ready' | 'error';
// Sem cadastro: o acesso é restrito à conta já existente (ver supabase/schema.sql).
type Mode = 'signIn' | 'magicLink';

// Exige login (quando o Supabase está configurado) e só monta o App depois
// de baixar os dados do usuário da nuvem para o localStorage.
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? 'loading' : 'ready');
  // undefined = sessão ainda não verificada; null = sem login.
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Sem chamadas ao Supabase aqui dentro (recomendação do supabase-js);
      // o efeito abaixo reage à troca de usuário.
      setUserId(session?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || userId === undefined) return;
    if (userId === null) {
      void stopCloudSync({ clearLocal: false });
      setStatus('signedOut');
      return;
    }
    let cancelled = false;
    setStatus('syncing');
    setSyncError(null);
    startCloudSync(userId)
      .then(() => !cancelled && setStatus('ready'))
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setSyncError(err?.message ?? String(err));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [userId, retryCount]);

  if (status === 'ready') {
    // key força o App a reinicializar o estado ao trocar de conta.
    return <React.Fragment key={userId ?? 'local'}>{children}</React.Fragment>;
  }

  if (status === 'loading' || status === 'syncing') {
    return (
      <FullScreen>
        <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
        <p className="text-secondary text-sm mt-3">
          {status === 'syncing' ? 'Carregando seus dados da nuvem…' : 'Carregando…'}
        </p>
      </FullScreen>
    );
  }

  if (status === 'error') {
    return (
      <FullScreen>
        <Card>
          <h1 className="text-lg font-bold text-on-surface">Não foi possível carregar seus dados</h1>
          <p className="text-secondary text-xs mt-2 break-words">{syncError}</p>
          <button
            onClick={() => setRetryCount((n) => n + 1)}
            className="mt-4 w-full h-10 rounded-xl bg-primary text-on-primary font-bold"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => supabase?.auth.signOut()}
            className="mt-2 w-full h-10 rounded-xl border border-surface-container text-secondary font-semibold"
          >
            Sair
          </button>
        </Card>
      </FullScreen>
    );
  }

  return <LoginScreen />;
};

const FullScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">{children}</div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm">
    {children}
  </div>
);

const LoginScreen: React.FC = () => {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin, shouldCreateUser: false },
        });
        if (error) throw error;
        setInfo('Enviamos um link de acesso para o seu e-mail.');
      }
    } catch (err: any) {
      setError(translateAuthError(err?.message ?? String(err)));
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <FullScreen>
      <Card>
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">neurology</span>
          <span className="font-bold text-sm">SynapseMed</span>
        </div>
        <h1 className="text-lg font-bold text-on-surface mt-2">
          {mode === 'magicLink' ? 'Entrar com link por e-mail' : 'Entrar'}
        </h1>
        <p className="text-secondary text-xs mt-1">Acesso restrito. Seu progresso fica salvo na nuvem.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-xs">
          <div>
            <label className="block text-secondary font-semibold mb-1">E-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          {mode !== 'magicLink' && (
            <div>
              <label className="block text-secondary font-semibold mb-1">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {error && <p className="text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
          {info && <p className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-10 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-all disabled:opacity-60"
          >
            {busy ? 'Aguarde…' : mode === 'magicLink' ? 'Enviar link' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-1.5 text-xs text-center">
          {mode !== 'signIn' && (
            <button className="text-primary font-semibold" onClick={() => setMode('signIn')}>
              Entrar com senha
            </button>
          )}
          {mode !== 'magicLink' && (
            <button className="text-secondary" onClick={() => setMode('magicLink')}>
              Esqueci a senha / entrar com link por e-mail
            </button>
          )}
        </div>
      </Card>
    </FullScreen>
  );
};

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (m.includes('user already registered')) return 'Este e-mail já tem conta. Use "Entrar".';
  if (m.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (m.includes('signups not allowed for otp') || m.includes('user not found'))
    return 'Não encontramos uma conta com este e-mail.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  return message;
}
