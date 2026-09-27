// ============================================================================
// paceEngine.ts
// ----------------------------------------------------------------------------
// Motor de PRAZO / RITMO do SynapseMed.
//
// Meta: concluir o currículo (todos os conteúdos DOMINADOS) até 1º/dez/2028.
// Capacidade base: 8h/semana (seg–sex), conforme a spec.
//
// "Coberto" = conteúdo DOMINADO (consolidado) — decisão da usuária.
// Se a usuária começar antes de 1º/dez/2026, está adiantando (ritmo folgado).
//
// Saídas:
//  - status de ritmo (adiantada / no ritmo / atrasada)
//  - quanto falta, quanto tempo resta, ritmo necessário vs. base
//  - fator de prazo (0..1) para o motor de prioridade (peso 10, antes "quieto")
//
// Este motor NÃO decide prioridade nem domínio — só fornece o sinal de prazo.
// ============================================================================

import { AreaItem } from '../types';
import { getStateTotals } from './contentState';

export const TARGET_DATE = new Date('2028-12-01T00:00:00');
export const REFERENCE_START = new Date('2026-12-01T00:00:00');
export const WEEKLY_HOURS = 8;            // capacidade base (seg–sex)
export const HOURS_PER_CONTENT = 2.5;     // estimativa: teoria(1h)+pós(1h)+extras

export type PaceStatus = 'adiantada' | 'no_ritmo' | 'atrasada' | 'concluido';

export interface PaceInfo {
  totalContents: number;
  dominados: number;             // "coberto"
  restantes: number;
  targetDate: string;            // YYYY-MM-DD
  weeksRemaining: number;        // até a meta
  // ritmo:
  contentsPerWeekNeeded: number; // pra terminar no prazo
  contentsPerWeekBase: number;   // o que 8h/semana comporta
  status: PaceStatus;
  paceFactor: number;            // 0..1 (pressão de prazo) p/ priorityEngine
  message: string;
}

function weeksBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return ms / (7 * 24 * 3600 * 1000);
}

export function computePace(
  hierarchy: readonly AreaItem[],
  today: Date = new Date()
): PaceInfo {
  const totals = getStateTotals(hierarchy);
  const totalContents = totals.total;
  const dominados = totals.dominado;
  const restantes = Math.max(0, totalContents - dominados);

  const weeksRemaining = Math.max(0.1, weeksBetween(today, TARGET_DATE));
  const contentsPerWeekNeeded = restantes / weeksRemaining;
  // quantos conteúdos 8h/semana comporta (cada conteúdo ~HOURS_PER_CONTENT)
  const contentsPerWeekBase = WEEKLY_HOURS / HOURS_PER_CONTENT;

  let status: PaceStatus;
  let paceFactor: number;
  let message: string;

  if (restantes === 0) {
    status = 'concluido';
    paceFactor = 0;
    message = 'Currículo concluído — todos os conteúdos consolidados. 🎉';
  } else if (today < REFERENCE_START) {
    // começou antes da data de referência: está adiantando
    status = 'adiantada';
    paceFactor = 0.2; // pressão baixa, mas não zero (mantém avanço)
    message = 'Você está adiantando os estudos antes do início previsto. Ritmo folgado.';
  } else {
    const ratio = contentsPerWeekNeeded / contentsPerWeekBase; // >1 = precisa mais que a base
    if (ratio <= 0.9) {
      status = 'no_ritmo';
      paceFactor = 0.4;
      message = 'Você está dentro do ritmo necessário para concluir até dez/2028.';
    } else if (ratio <= 1.1) {
      status = 'no_ritmo';
      paceFactor = 0.6;
      message = 'Ritmo apertado, mas ainda dentro do necessário. Mantenha a constância.';
    } else {
      status = 'atrasada';
      paceFactor = 1;
      const horasNecessarias = Math.ceil(contentsPerWeekNeeded * HOURS_PER_CONTENT);
      message =
        `Você está atrasada para a meta de dez/2028. Seria necessário cobrir ` +
        `~${contentsPerWeekNeeded.toFixed(1)} conteúdos/semana ` +
        `(≈${horasNecessarias}h/semana, acima das ${WEEKLY_HOURS}h base). ` +
        `Considere aumentar o ritmo.`;
    }
  }

  return {
    totalContents,
    dominados,
    restantes,
    targetDate: TARGET_DATE.toISOString().split('T')[0],
    weeksRemaining: Math.round(weeksRemaining),
    contentsPerWeekNeeded: Math.round(contentsPerWeekNeeded * 10) / 10,
    contentsPerWeekBase: Math.round(contentsPerWeekBase * 10) / 10,
    status,
    paceFactor,
    message,
  };
}
