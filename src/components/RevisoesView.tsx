import React from 'react';
import { dpocFlashcards } from '../data/mockData';

interface RevisoesViewProps {
  onOpenSRSCoordination: () => void;
}

export const RevisoesView: React.FC<RevisoesViewProps> = ({ onOpenSRSCoordination }) => {
  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">replay</span>
            <span>Sistema de Repetição Espaçada (SRS)</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Coordenação com Osler / Anki</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Fila de Revisões Inteligentes
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            O SynapseMed calcula os intervalos ideais e instrui sua sessão de revisão no Osler ou aplicativo de SRS favorito.
          </p>
        </div>

        <button
          onClick={onOpenSRSCoordination}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          <span>Coordenar Fila de Hoje ({dpocFlashcards.length} cartões no Osler)</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-base">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
          <span className="text-secondary text-xs uppercase font-semibold">Pendentes para Hoje</span>
          <div className="mt-1 font-code-metric text-2xl font-bold text-amber-700">24</div>
          <div className="mt-1 text-xs text-secondary">DPOC, ICC e Duke (Endocardite)</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
          <span className="text-secondary text-xs uppercase font-semibold">Amanhã</span>
          <div className="mt-1 font-code-metric text-2xl font-bold text-primary">18</div>
          <div className="mt-1 text-xs text-secondary">Cirurgia e Ginecologia</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
          <span className="text-secondary text-xs uppercase font-semibold">Taxa de Retenção Média</span>
          <div className="mt-1 font-code-metric text-2xl font-bold text-emerald-700">89%</div>
          <div className="mt-1 text-xs text-emerald-800">Acima da meta mínima (80%)</div>
        </div>
      </div>

      {/* Deck Preview */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm space-y-3">
        <h2 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider">
          Cartões Programados para Hoje
        </h2>
        <div className="space-y-2">
          {dpocFlashcards.map((card, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-primary/10 text-primary">
                  {card.topic} • {card.subspecialty}
                </span>
                <p className="text-xs font-medium text-on-surface line-clamp-1">{card.front}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-code-metric text-xs text-secondary">
                  Retenção: {card.retentionScore}%
                </span>
                <button
                  onClick={onOpenSRSCoordination}
                  className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface"
                >
                  Coordenar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
