// ============================================================================
// Tema claro/escuro
// ----------------------------------------------------------------------------
// A escolha fica no localStorage ('synapsemed_theme'). Sem escolha salva, segue
// o tema do sistema. O script inline em index.html aplica a classe .dark antes
// do React carregar, para não piscar o tema claro.
// ============================================================================
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'synapsemed_theme';

const readStoredTheme = (): Theme | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
};

const systemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.add('theme-transition');
  root.classList.toggle('dark', theme === 'dark');
  window.setTimeout(() => root.classList.remove('theme-transition'), 250);
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? systemTheme());

  // Sem escolha salva, acompanha mudanças do tema do sistema.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!readStoredTheme()) {
        const next = systemTheme();
        setTheme(next);
        applyTheme(next);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem localStorage: a troca vale só nesta aba.
    }
  };

  return { theme, toggleTheme };
};
