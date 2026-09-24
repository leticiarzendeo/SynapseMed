// ============================================================================
// contentState.ts
// ----------------------------------------------------------------------------
// FONTE ÚNICA da classificação de estado de um conteúdo, usada por TODAS as
// telas (Prioridades, Currículo, Desempenho, Hoje) para não haver comportamento
// divergente entre abas.
//
// Três estados, derivados do domínio REAL (calculateContentDomain), e NÃO do
// isStudied binário/frouxo:
//   - 'nao_iniciado' : sem evidência real de estudo
//   - 'em_andamento' : já teve contato, mas não consolidou (domínio insuficiente)
//   - 'dominado'     : consolidado (domínio>=85, aplicação>=80, retenção>=80,
//                      confiança suficiente) — os mesmos cortes de segurança que
//                      o app já usava internamente.
//
// Assim, "fiz 1 questão e acertei" NUNCA vira 'dominado' — vira 'em_andamento'.
// ============================================================================

import { AreaItem, ContentItem } from '../types';
import { calculateContentDomain } from './domainCalculator';

export type ContentState = 'nao_iniciado' | 'em_andamento' | 'dominado';

/** Classifica um conteúdo nos 3 estados, a partir do domínio calculado. */
export function getContentState(content: ContentItem | undefined): ContentState {
  if (!content) return 'nao_iniciado';
  const d = calculateContentDomain(content);
  if (d.status === 'consolidado') return 'dominado';
  if (d.status === 'nao_avaliado') return 'nao_iniciado';
  return 'em_andamento';
}

export interface StateTotals {
  total: number;
  naoIniciado: number;
  emAndamento: number;
  dominado: number;
  /** iniciados = em andamento + dominado (tudo que saiu do zero) */
  iniciado: number;
  dominadoPercent: number;
  iniciadoPercent: number;
}

/** Totais por estado de uma hierarquia inteira. */
export function getStateTotals(hierarchy: readonly AreaItem[]): StateTotals {
  let total = 0;
  let naoIniciado = 0;
  let emAndamento = 0;
  let dominado = 0;
  for (const area of hierarchy)
    for (const mod of area.modules)
      for (const c of mod.contents) {
        total += 1;
        const st = getContentState(c);
        if (st === 'dominado') dominado += 1;
        else if (st === 'em_andamento') emAndamento += 1;
        else naoIniciado += 1;
      }
  const safeTotal = total || 1;
  const iniciado = emAndamento + dominado;
  return {
    total,
    naoIniciado,
    emAndamento,
    dominado,
    iniciado,
    dominadoPercent: Math.round((dominado / safeTotal) * 100),
    iniciadoPercent: Math.round((iniciado / safeTotal) * 100),
  };
}

/** Totais por estado de uma única área. */
export function getAreaStateTotals(area: AreaItem): StateTotals {
  return getStateTotals([area]);
}

/** Rótulos e cores padronizados dos 3 estados (usar em todas as telas). */
export const CONTENT_STATE_UI: Record<
  ContentState,
  { label: string; icon: string; color: string }
> = {
  nao_iniciado: { label: 'Não iniciado', icon: 'radio_button_unchecked', color: 'var(--secondary,#94a3b8)' },
  em_andamento: { label: 'Em andamento', icon: 'pending', color: '#d97706' },
  dominado: { label: 'Dominado', icon: 'check_circle', color: '#16a34a' },
};
