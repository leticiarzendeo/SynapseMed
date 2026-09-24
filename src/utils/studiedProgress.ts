// ============================================================================
// studiedProgress.ts
// ----------------------------------------------------------------------------
// FONTE ÚNICA DA VERDADE para "o que já foi estudado".
//
// Contexto do problema resolvido:
//   - Os 236 conteúdos de medwayCurriculum.ts nascem com `isStudied: false` e
//     NENHUM ponto do código jamais escrevia `true`. Progresso do currículo,
//     domainCalculator e priorização ficavam travados em "nada estudado".
//   - O único elo compartilhado entre os modelos de atividade paralelos
//     (StudyActivity em App.tsx, ActivityItem em HojeView, PlanningActivityItem
//     em PlanejamentoView) é o campo `contentId`.
//
// Estratégia (opção B — caminho de escrita real, sem redesenhar UI):
//   1. Derivar de `activities` o conjunto de contentIds concluídos.
//   2. Sobrepor esse conjunto ao currículo estático de forma imutável,
//      produzindo uma nova hierarquia onde os conteúdos estudados têm
//      `isStudied: true`, `theoryCompleted: true`, `lastStudiedDate` e com os
//      contadores `studiedContents` (módulo e área) recalculados.
//   3. Todos os consumidores (Currículo, domainCalculator, Home) passam a ler
//      a hierarquia sobreposta em vez da estática. Concluir uma atividade com
//      `contentId` agora propaga de ponta a ponta.
//
// Tudo aqui é puro e não muta a hierarquia original importada.
// ============================================================================

import { AreaItem, ModuleItem, ContentItem, StudyActivity } from '../types';
import { getStateTotals, getContentState } from './contentState';

/**
 * Deriva o conjunto de contentIds efetivamente concluídos a partir das
 * atividades centrais (StudyActivity[] persistidas em App.tsx).
 *
 * Uma atividade conta como "estudou o conteúdo" quando:
 *   - possui `contentId`, e
 *   - está com status 'concluido'.
 */
export function deriveStudiedContentIds(
  activities: readonly StudyActivity[]
): Set<string> {
  const studied = new Set<string>();
  for (const act of activities) {
    if (act.contentId && act.status === 'concluido') {
      studied.add(act.contentId);
    }
  }
  return studied;
}

/**
 * Mapa contentId -> data (YYYY-MM-DD) da conclusão mais recente, para popular
 * `lastStudiedDate` sem inventar valores. Atividades sem data cronológica
 * confiável simplesmente não entram no mapa (o campo fica indefinido).
 *
 * StudyActivity não carrega timestamp de conclusão hoje; então usamos, quando
 * existir, um campo opcional futuro `completedAt`. Caso não exista, deixamos a
 * data ausente em vez de forjar "hoje" (evita métricas de recência falsas).
 */
function deriveLastStudiedDates(
  activities: readonly StudyActivity[]
): Map<string, string> {
  const dates = new Map<string, string>();
  for (const act of activities) {
    if (!act.contentId || act.status !== 'concluido') continue;
    // completedAt é opcional/futuro; só usamos se presente e válido.
    const completedAt = (act as { completedAt?: string }).completedAt;
    if (completedAt) {
      const existing = dates.get(act.contentId);
      if (!existing || completedAt > existing) {
        dates.set(act.contentId, completedAt);
      }
    }
  }
  return dates;
}

/**
 * Aplica o overlay de "estudado" sobre a hierarquia do currículo, de forma
 * imutável. Retorna uma NOVA árvore; a original nunca é mutada.
 *
 * Regras:
 *   - Um conteúdo cujo `id` está em `studiedContentIds` recebe
 *     `isStudied: true` e `theoryCompleted: true`. Se houver data de conclusão
 *     conhecida, `lastStudiedDate` é preenchido; caso contrário, preserva-se o
 *     valor original.
 *   - `isConsolidated`, `estimatedMastery`, `status` etc. NÃO são forçados aqui:
 *     consolidação é responsabilidade do domainCalculator (que agora deixa de
 *     estar travado, pois passa a enxergar isStudied real).
 *   - Contadores `studiedContents` de módulo e área são recomputados a partir
 *     dos conteúdos já sobrepostos (mantém a barra de progresso coerente).
 */
export function applyStudiedOverlay(
  hierarchy: readonly AreaItem[],
  studiedContentIds: ReadonlySet<string>,
  lastStudiedDates?: ReadonlyMap<string, string>
): AreaItem[] {
  return hierarchy.map((area) => {
    const modules: ModuleItem[] = area.modules.map((mod) => {
      const contents: ContentItem[] = mod.contents.map((content) => {
        if (!studiedContentIds.has(content.id)) {
          return content;
        }
        const lastDate = lastStudiedDates?.get(content.id);
        const overlaid: ContentItem = {
          ...content,
          isStudied: true,
          theoryCompleted: true,
          lastStudiedDate: lastDate ?? content.lastStudiedDate,
        };
        return overlaid;
      });

      // Roll-ups por DOMÍNIO REAL (coerente com todas as telas):
      //   studiedContents      = iniciados (em andamento + dominado)
      //   consolidatedContents = dominados
      const studiedContents = contents.filter(
        (c) => getContentState(c) !== 'nao_iniciado'
      ).length;
      const consolidatedContents = contents.filter(
        (c) => getContentState(c) === 'dominado'
      ).length;

      const overlaidModule: ModuleItem = {
        ...mod,
        contents,
        studiedContents,
        consolidatedContents,
      };
      return overlaidModule;
    });

    const areaStudied = modules.reduce((sum, m) => sum + m.studiedContents, 0);
    const areaConsolidated = modules.reduce(
      (sum, m) => sum + m.consolidatedContents,
      0
    );

    const overlaidArea: AreaItem = {
      ...area,
      modules,
      studiedContents: areaStudied,
      consolidatedContents: areaConsolidated,
    };
    return overlaidArea;
  });
}

/**
 * Atalho: deriva o conjunto de estudados a partir das atividades e devolve a
 * hierarquia já sobreposta. É a função que App.tsx usa como fonte da verdade.
 */
export function buildStudiedCurriculum(
  baseHierarchy: readonly AreaItem[],
  activities: readonly StudyActivity[],
  extraStudiedContentIds?: readonly string[]
): { curriculum: AreaItem[]; studiedContentIds: Set<string> } {
  const studiedContentIds = deriveStudiedContentIds(activities);
  // Conteúdos marcados como concluídos por telas com modelo próprio
  // (HojeView, PlanejamentoView), que passam apenas o contentId "pela ponte".
  if (extraStudiedContentIds) {
    for (const id of extraStudiedContentIds) {
      if (id) studiedContentIds.add(id);
    }
  }
  const lastStudiedDates = deriveLastStudiedDates(activities);
  const curriculum = applyStudiedOverlay(
    baseHierarchy,
    studiedContentIds,
    lastStudiedDates
  );
  return { curriculum, studiedContentIds };
}

/**
 * Totais globais calculados a partir de uma hierarquia JÁ sobreposta.
 * Substitui getCurriculumTotals() (que lia o currículo estático travado).
 */
export function getStudiedCurriculumTotals(hierarchy: readonly AreaItem[]) {
  // Contagem baseada no DOMÍNIO REAL (3 estados), não no isStudied frouxo:
  //   studied       = iniciado (em andamento + dominado) — saiu do zero
  //   consolidated  = dominado (passou nos cortes de segurança)
  // Mantém a mesma forma de retorno para os consumidores existentes.
  const t = getStateTotals(hierarchy);
  const safeTotal = t.total || 236;
  const studied = t.iniciado;
  const consolidated = t.dominado;
  return {
    total: safeTotal,
    studied,
    consolidated,
    pending: safeTotal - studied,
    studiedPercent: Math.round((studied / safeTotal) * 100),
    consolidatedPercent: Math.round((consolidated / safeTotal) * 100),
  };
}

/**
 * Lista plana de todos os conteúdos de uma hierarquia (sobreposta ou não).
 */
export function flattenCurriculum(hierarchy: readonly AreaItem[]): ContentItem[] {
  const list: ContentItem[] = [];
  for (const area of hierarchy) {
    for (const mod of area.modules) {
      for (const c of mod.contents) {
        list.push(c);
      }
    }
  }
  return list;
}
