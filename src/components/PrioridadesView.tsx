import React, { useMemo, useState } from 'react';
import { AreaItem, ContentItem } from '../types';
import { fullCurriculumHierarchy } from '../data/mockData';
import {
  groupPriorityByArea,
  medwayInstitutionTotals,
  medwayTotalPriorityFocos,
} from '../utils/medwayPriorityEngine';
import { getContentState, CONTENT_STATE_UI, ContentState } from '../utils/contentState';

// ============================================================================
// PrioridadesView
// ----------------------------------------------------------------------------
// Focos PRIORITÁRIOS da Medway com o ESTADO REAL de cada conteúdo, em 3 níveis,
// usando calculateContentDomain (NÃO o isStudied frouxo):
//   - "não iniciado": sem evidência real
//   - "em andamento": tem contato, mas não atingiu domínio seguro
//   - "dominado": consolidado (domínio>=85, aplicação>=80, retenção>=80,
//     confiança suficiente). Uma questão acertada NÃO conta como dominado.
// ============================================================================

interface PrioridadesViewProps {
  curriculum?: AreaItem[];
}




export const PrioridadesView: React.FC<PrioridadesViewProps> = ({ curriculum }) => {
  const hierarchy = curriculum ?? fullCurriculumHierarchy;
  const groups = useMemo(() => groupPriorityByArea(), []);
  const [openArea, setOpenArea] = useState<string | null>(groups[0]?.area ?? null);

  const contentById = useMemo(() => {
    const map = new Map<string, ContentItem>();
    for (const a of hierarchy)
      for (const m of a.modules)
        for (const c of m.contents) map.set(c.id, c);
    return map;
  }, [hierarchy]);

  const estadoPorContent = useMemo(() => {
    const map = new Map<string, ContentState>();
    for (const g of groups)
      for (const t of g.temas)
        for (const f of t.focos)
          if (!map.has(f.contentId))
            map.set(f.contentId, getContentState(contentById.get(f.contentId)));
    return map;
  }, [groups, contentById]);

  const contagem = useMemo(() => {
    let dominado = 0;
    let andamento = 0;
    let naoIniciado = 0;
    for (const g of groups)
      for (const t of g.temas)
        for (const f of t.focos) {
          const e = estadoPorContent.get(f.contentId) ?? 'nao_iniciado';
          if (e === 'dominado') dominado++;
          else if (e === 'em_andamento') andamento++;
          else naoIniciado++;
        }
    return { dominado, andamento, naoIniciado };
  }, [groups, estadoPorContent]);

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-secondary text-xs">
          <span className="material-symbols-outlined text-base">flag</span>
          <span>Prioridades Medway</span>
          <span className="text-outline-variant">•</span>
          <span className="text-primary font-medium">Incidência das instituições-alvo</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mt-1">Focos Prioritários</h1>
        <p className="text-sm text-secondary mt-1">
          {medwayTotalPriorityFocos} focos classificados como <strong>Prioritário</strong> pela
          Medway (todas as suas instituições-alvo). O estado de cada foco reflete seu{' '}
          <strong>domínio real</strong> — “dominado” exige consolidação (teoria, questões,
          retenção e confiança), não apenas uma questão feita.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Resumo valor={medwayTotalPriorityFocos} rotulo="focos prioritários" cor="var(--primary,#2563eb)" />
        <Resumo valor={contagem.dominado} rotulo="dominados" cor="#16a34a" />
        <Resumo valor={contagem.andamento} rotulo="em andamento" cor="#d97706" />
        <Resumo valor={contagem.naoIniciado} rotulo="não iniciados" cor="#94a3b8" />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-secondary">
        {(['dominado', 'em_andamento', 'nao_iniciado'] as ContentState[]).map((e) => (
          <span key={e} className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base" style={{ color: CONTENT_STATE_UI[e].color }}>
              {CONTENT_STATE_UI[e].icon}
            </span>
            {CONTENT_STATE_UI[e].label}
          </span>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low/50">
        <div className="text-xs font-semibold text-on-surface mb-2">
          Focos prioritários por instituição
        </div>
        <div className="flex flex-wrap gap-2">
          {medwayInstitutionTotals.map((i) => (
            <span key={i.sigla} className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface">
              <strong>{i.sigla}</strong>: {i.focos}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {groups.map((g) => {
          const open = openArea === g.area;
          const dominadosArea = g.temas.reduce(
            (s, t) => s + t.focos.filter((f) => estadoPorContent.get(f.contentId) === 'dominado').length,
            0
          );
          return (
            <div key={g.area} className="rounded-xl border border-surface-container bg-surface-container-lowest overflow-hidden">
              <button
                onClick={() => setOpenArea(open ? null : g.area)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <span className="font-semibold text-on-surface">{g.area}</span>
                  <span className="ml-2 text-xs text-secondary">
                    {g.totalFocos} focos • {dominadosArea} dominados
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
                          const estado = estadoPorContent.get(f.contentId) ?? 'nao_iniciado';
                          const ui = CONTENT_STATE_UI[estado];
                          return (
                            <div key={f.foco + f.contentId} className="flex items-center gap-2 text-sm">
                              <span className="material-symbols-outlined text-base" style={{ color: ui.color }}>
                                {ui.icon}
                              </span>
                              <span className={estado === 'dominado' ? 'text-secondary line-through' : 'text-on-surface'}>
                                {f.foco}
                              </span>
                              {estado === 'em_andamento' && (
                                <span className="text-[0.625rem] text-amber-600">• em andamento</span>
                              )}
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
        “Dominado” usa os mesmos critérios de consolidação do app (domínio ≥ 85%, aplicação ≥ 80%,
        retenção ≥ 80% e confiança suficiente). Fazer poucas questões deixa o foco em “em andamento”.
      </p>
    </div>
  );
};

const Resumo: React.FC<{ valor: number; rotulo: string; cor: string }> = ({ valor, rotulo, cor }) => (
  <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
    <div className="text-2xl font-bold" style={{ color: cor }}>{valor}</div>
    <div className="text-xs text-secondary">{rotulo}</div>
  </div>
);
