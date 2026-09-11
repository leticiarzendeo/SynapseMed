import React from 'react';
import { ViewPath } from '../types';

interface SidebarProps {
  currentPath: ViewPath;
  onNavigate: (path: ViewPath) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: { path: ViewPath; label: string; icon: string }[] = [
  { path: 'hoje', label: 'Hoje', icon: 'calendar_today' },
  { path: 'planejamento', label: 'Planejamento', icon: 'view_week' },
  { path: 'curriculo', label: 'Currículo', icon: 'account_tree' },
  { path: 'desempenho', label: 'Desempenho', icon: 'insights' },
  { path: 'revisoes', label: 'Revisões', icon: 'replay' },
  { path: 'provas-e-simulados', label: 'Provas e Simulados', icon: 'assignment' },
  { path: 'analises', label: 'Análises', icon: 'psychology' },
  { path: 'configuracoes', label: 'Configurações', icon: 'tune' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 bottom-0 w-64 bg-surface-container-lowest z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-space-base flex items-center justify-between gap-space-sm border-b border-surface-container/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[1.25rem]">neurology</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-base font-bold text-on-surface tracking-tight leading-none">
                Synapse<span className="text-primary">Med</span>
              </span>
              <span className="font-label-sm text-[0.625rem] text-secondary tracking-wider uppercase font-semibold">
                Residência OS
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg text-secondary hover:bg-surface-container"
            aria-label="Fechar menu"
          >
            <span className="material-symbols-outlined text-[1.25rem]">close</span>
          </button>
        </div>

        {/* Active Target Pill */}
        <div className="px-space-base py-space-xs my-1">
          <div className="rounded-xl bg-surface-container-low p-space-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Meta Ativa
              </span>
              <span className="font-body-sm text-body-sm font-headline-sm text-on-surface font-semibold truncate">
                Currículo Residência
              </span>
            </div>
            <span className="font-code-metric text-label-sm px-space-xs py-space-2xs rounded bg-primary text-on-primary font-medium">
              2 Anos
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          className="flex-1 px-space-sm py-space-sm space-y-space-2xs overflow-y-auto"
          aria-label="Menu principal"
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                id={`nav-link-${item.path}`}
                onClick={() => {
                  onNavigate(item.path);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-space-sm px-space-base py-space-sm rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_1px_2px_rgba(37,99,235,0.2)]'
                    : 'font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[1.25rem]">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System Engine Indicator */}
        <div className="p-space-base bg-surface-container-lowest border-t border-surface-container/50">
          <div className="rounded-xl bg-surface-container-low p-space-sm flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Algoritmo Priorização
              </span>
            </div>
            <span className="font-code-metric text-label-sm text-primary font-medium">
              Adaptativo Ativo
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
