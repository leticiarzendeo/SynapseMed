import React, { useState } from 'react';
import { ViewPath } from '../types';

interface BottomNavProps {
  currentPath: ViewPath;
  onNavigate: (path: ViewPath) => void;
  onOpenRegistrar: () => void;
  onOpenQuickReview: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPath,
  onNavigate,
  onOpenRegistrar,
  onOpenQuickReview,
}) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems: { path: ViewPath; label: string; icon: string }[] = [
    { path: 'hoje', label: 'Hoje', icon: 'calendar_today' },
    { path: 'planejamento', label: 'Planejamento', icon: 'view_week' },
    { path: 'curriculo', label: 'Currículo', icon: 'account_tree' },
    { path: 'desempenho', label: 'Desempenho', icon: 'insights' },
  ];

  const moreItems: { path: ViewPath; label: string; icon: string; desc: string }[] = [
    { path: 'revisoes', label: 'Revisões (FSRS)', icon: 'replay', desc: 'Fila inteligente e retenção espaçada' },
    { path: 'provas-e-simulados', label: 'Provas & Simulados', icon: 'assignment', desc: 'Bancas reais e retroalimentação' },
    { path: 'analises', label: 'Análises & Erros', icon: 'psychology', desc: 'Diagnóstico cognitivo e pontos fracos' },
    { path: 'configuracoes', label: 'Configurações', icon: 'tune', desc: 'Horizonte de 2 anos e instituições' },
  ];

  const isMoreActive = moreItems.some((item) => item.path === currentPath);

  return (
    <>
      {/* Plus Menu Backdrop & Modal */}
      {showPlusMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center pb-24 sm:pb-20 p-4"
          onClick={() => setShowPlusMenu(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 border border-surface-container shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Ações Rápidas
              </span>
              <button
                onClick={() => setShowPlusMenu(false)}
                className="text-secondary hover:text-on-surface text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onOpenRegistrar();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">edit_calendar</span>
                </div>
                <div>
                  <span className="font-bold text-on-surface text-sm block">Registrar Estudo</span>
                  <span className="text-[0.6875rem] text-secondary">
                    Horas, questões feitas, acertos e motivo dos erros
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onNavigate('provas-e-simulados');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">post_add</span>
                </div>
                <div>
                  <span className="font-bold text-on-surface text-sm block">Adicionar Prova ou Simulado</span>
                  <span className="text-[0.6875rem] text-secondary">
                    Inserir gabarito de banca real (USP, ENARE, etc.)
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onOpenQuickReview();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">replay</span>
                </div>
                <div>
                  <span className="font-bold text-on-surface text-sm block">Revisão Rápida FSRS</span>
                  <span className="text-[0.6875rem] text-secondary">
                    Praticar cartões pendentes de alta retenção
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onNavigate('planejamento');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">add_task</span>
                </div>
                <div>
                  <span className="font-bold text-on-surface text-sm block">Adicionar Atividade Manual</span>
                  <span className="text-[0.6875rem] text-secondary">
                    Inserir bloco de estudos na grade semanal
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Mais" Menu Backdrop & Modal */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center pb-20 p-4 lg:hidden"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 border border-surface-container shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Mais Áreas do SynapseMed
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="text-secondary hover:text-on-surface text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {moreItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <span className="font-bold block text-sm">{item.label}</span>
                      <span className="text-[0.6875rem] opacity-75">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) on Desktop */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className="h-14 px-5 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-xl hover:bg-primary-container hover:shadow-2xl transition-all flex items-center gap-2.5 active:scale-95"
          aria-label="Ações Rápidas"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <span>Ação Rápida</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile / small screens) */}
      <nav
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container z-40 px-3 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      >
        {/* Item 1: Hoje */}
        <button
          onClick={() => onNavigate('hoje')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentPath === 'hoje' ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-xl">calendar_today</span>
          <span className="text-[0.6875rem] mt-0.5">Hoje</span>
        </button>

        {/* Item 2: Planejamento */}
        <button
          onClick={() => onNavigate('planejamento')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentPath === 'planejamento' ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-xl">view_week</span>
          <span className="text-[0.6875rem] mt-0.5">Plano</span>
        </button>

        {/* Central Plus Button */}
        <div className="flex items-center justify-center px-1">
          <button
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-95 hover:bg-primary-container transition-all"
            aria-label="Adicionar / Ações Rápidas"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
        </div>

        {/* Item 3: Currículo */}
        <button
          onClick={() => onNavigate('curriculo')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentPath === 'curriculo' ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-xl">account_tree</span>
          <span className="text-[0.6875rem] mt-0.5">Currículo</span>
        </button>

        {/* Item 4: Desempenho ou Mais */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isMoreActive ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-xl">more_horiz</span>
          <span className="text-[0.6875rem] mt-0.5">Mais</span>
        </button>
      </nav>
    </>
  );
};
