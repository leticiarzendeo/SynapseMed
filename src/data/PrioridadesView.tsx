import React, { useMemo, useState } from 'react';
import { AreaItem } from '../types';
import { fullCurriculumHierarchy } from '../data/mockData';
import {
  groupPriorityByArea,
  medwayInstitutionTotals,
  medwayTotalPriorityFocos,
  isMedwayPriority,
} from '../utils/medwayPriorityEngine';

// ============================================================================
// PrioridadesView
// ----------------------------------------------------------------------------
// Mostra os focos PRIORITÁRIOS da Medway (nível Prioritário, todas as
// instituições-alvo) que foram importados do app da Medway. Serve de consulta
// e deixa explícito que o algoritmo de estudos usa essa prioridade.
//
// Recebe opcionalmente o currículo sobreposto (com isStudied real) para marcar
// quais focos prioritários você já estudou.
// ============================================================================

interface PrioridadesViewProps {
  curriculum?: AreaItem[];
}

export const PrioridadesView: React.FC<PrioridadesViewProps> = ({ curriculum }) => {
  const hierarchy = curriculum ?? fullCurriculumHierarchy;
  const groups = useMemo(() => groupPriorityByArea(), []);
  const [openArea, setOpenArea] = useState<string | null>(groups[0]?.area ?? null);

  // conjunto de contentIds já estudados (para mostrar progresso nos focos)
  const studied = useMemo(() => {
    const s = new Set<string>();
    for (const a of hierarchy)
      for (const m of a.modules)
        for (const c of m.contents) if (c.isStudied) s.add(c.id);
    return s;
  }, [hierarchy]);

  const studiedPriority = useMemo(() => {
    let n = 0;
    for (const g of groups)
      for (const t of g.temas)
        for (const f of t.focos) if (studied.has(f.contentId)) n++;
    return n;
  }, [groups, studied]);

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 text-secondary text-xs">
          <span className="material-symbols-outlined text-base">flag</span>
          <span>Prioridades Medway</span>
          <span className="text-outline-variant">•</span>
          <span className="text-primary font-medium">Incidência das instituições-alvo</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mt-1">
          Focos Prioritários
        </h1>
        <p className="text-sm text-secondary mt-1">
          {medwayTotalPriorityFocos} focos classificados como <strong>Prioritário</strong> pela
          Medway, considerando todas as suas instituições-alvo (USP-RP, USP-SP, UNICAMP, ENAMED e
          Einstein). O algoritmo de estudos usa esta lista para priorizar seu cronograma e suas
          revisões.
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
          <div className="text-2xl font-bold text-primary">{medwayTotalPriorityFocos}</div>
          <div className="text-xs text-secondary">focos prioritários</div>
        </div>
        <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
          <div className="text-2xl font-bold text-emerald-700">{studiedPriority}</div>
          <div className="text-xs text-secondary">já estudados</div>
        </div>
        <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
          <div className="text-2xl font-bold text-on-surface">
            {medwayTotalPriorityFocos - studiedPriority}
          </div>
          <div className="text-xs text-secondary">a estudar</div>
        </div>
        <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
          <div className="text-2xl font-bold text-on-surface">
            {Math.round((studiedPriority / medwayTotalPriorityFocos) * 100)}%
          </div>
          <div className="text-xs text-secondary">do prioritário</div>
        </div>
      </div>

      {/* Totais por instituição (informativo) */}
      <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low/50">
        <div className="text-xs font-semibold text-on-surface mb-2">
          Focos prioritários por instituição
        </div>
        <div className="flex flex-wrap gap-2">
          {medwayInstitutionTotals.map((i) => (
            <span
              key={i.sigla}
              className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface"
            >
              <strong>{i.sigla}</strong>: {i.focos}
            </span>
          ))}
        </div>
        <p className="text-[0.6875rem] text-secondary mt-2">
          Esta aba lista o consolidado <em>Todas as instituições</em>. Os totais por instituição
          acima são informativos; a priorização usa a lista consolidada.
        </p>
      </div>

      {/* Lista por área > tema > foco */}
      <div className="space-y-3">
        {groups.map((g) => {
          const open = openArea === g.area;
          const studiedInArea = g.temas.reduce(
            (s, t) => s + t.focos.filter((f) => studied.has(f.contentId)).length,
            0
          );
          return (
            <div
              key={g.area}
              className="rounded-xl border border-surface-container bg-surface-container-lowest overflow-hidden"
            >
              <button
                onClick={() => setOpenArea(open ? null : g.area)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <span className="font-semibold text-on-surface">{g.area}</span>
                  <span className="ml-2 text-xs text-secondary">
                    {g.totalFocos} focos prioritários • {studiedInArea} estudados
                  </span>
                </div>
                <span className="material-symbols-outlined text-secondary">
                  {open ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {open && (
                <div className="px-4 pb-4 space-y-3">
                  {g.temas.map((t) => (
                    <div key={t.tema}>
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                        {t.tema}
                      </div>
                      <div className="space-y-1">
                        {t.focos.map((f) => {
                          const done = studied.has(f.contentId);
                          return (
                            <div
                              key={f.foco + f.contentId}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span
                                className={`material-symbols-outlined text-base ${
                                  done ? 'text-emerald-600' : 'text-outline-variant'
                                }`}
                              >
                                {done ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span
                                className={done ? 'text-secondary line-through' : 'text-on-surface'}
                              >
                                {f.foco}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-secondary">
        Importado do app da Medway em seu último dia de acesso. Estes dados de incidência não mudam
        sozinhos; se um dia você tiver novas listas, elas podem ser adicionadas.
      </p>
    </div>
  );
};
