// ============================================================================
// paceEngine.ts
// ----------------------------------------------------------------------------
// Motor de PRAZO / RITMO do SynapseMed — FONTE ÚNICA usada por TODAS as abas.
//
// Regra (decisão da usuária):
//  - Janela FIXA: 1º/dez/2026 → 1º/dez/2028 = exatos 2 anos = 104 semanas.
//    (Independe de quando a usuária está olhando; ignora o progresso atual —
//     o que for feito antes de dez/2026 é considerado insignificante.)
//  - Conta por HORAS REAIS: horas do currículo ÷ 104 semanas = ritmo necessário.
//  - Se ritmo necessário ≤ 8h/semana → dá para terminar no plano normal.
//  - Se > 8h/semana → avisa e informa QUANTAS horas/semana são necessárias.
//
// As horas do currículo vêm das videoaulas reais de cada conteúdo + prática.
// Este motor NÃO decide prioridade nem domínio — só fornece o sinal de prazo,
// e o mesmo número é usado na aba Hoje, Planejamento e Análises.
// ============================================================================

import { AreaItem } from '../types';

export const TARGET_DATE = new Date('2028-12-01T00:00:00');
export const REFERENCE_START = new Date('2026-12-01T00:00:00');
export const TOTAL_WEEKS = 104;           // 2 anos fixos (dez/2026 → dez/2028)
export const WEEKLY_HOURS = 8;            // capacidade base (seg–sex)
// Estimativa de prática por conteúdo (questões + revisão), somada às videoaulas.
export const PRACTICE_HOURS_PER_CONTENT = 1.5;

export type PaceStatus = 'no_ritmo' | 'atrasada' | 'concluido';

export interface PaceInfo {
  totalContents: number;
  dominados: number;
  restantes: number;
  targetDate: string;
  totalWeeks: number;             // janela fixa (104)
  // horas:
  totalCurriculumHours: number;   // horas reais de TODO o currículo
  hoursPerWeekNeeded: number;     // ritmo necessário p/ caber em 104 semanas
  weeklyHoursBase: number;        // 8h
  fitsInPlan: boolean;            // ritmo necessário <= 8h?
  // compat (algumas telas ainda usam):
  weeksRemaining: number;         // = TOTAL_WEEKS (janela fixa)
  contentsPerWeekNeeded: number;
  contentsPerWeekBase: number;
  status: PaceStatus;
  paceFactor: number;             // 0..1 p/ o motor de prioridade
  message: string;
}

/** Soma as horas reais do currículo: videoaulas + prática por conteúdo. */
export function curriculumTotalHours(hierarchy: readonly AreaItem[]): number {
  let theory = 0;
  let count = 0;
  for (const a of hierarchy)
    for (const m of a.modules)
      for (const c of m.contents) {
        theory += c.videoLessonsHours || 0;
        count += 1;
      }
  return theory + count * PRACTICE_HOURS_PER_CONTENT;
}

export function computePace(hierarchy: readonly AreaItem[]): PaceInfo {
  let totalContents = 0;
  let dominados = 0;
  for (const a of hierarchy)
    for (const m of a.modules)
      for (const c of m.contents) {
        totalContents += 1;
        if (c.isConsolidated) dominados += 1;
      }
  const restantes = Math.max(0, totalContents - dominados);

  // HORAS: sempre sobre TODO o currículo (ignora progresso atual, por decisão).
  const totalCurriculumHours = Math.round(curriculumTotalHours(hierarchy));
  const hoursPerWeekNeeded = Math.round((totalCurriculumHours / TOTAL_WEEKS) * 10) / 10;
  const fitsInPlan = hoursPerWeekNeeded <= WEEKLY_HOURS;

  const contentsPerWeekBase = Math.round((totalContents / TOTAL_WEEKS) * 10) / 10;
  const contentsPerWeekNeeded = contentsPerWeekBase; // janela fixa, todo o currículo

  let status: PaceStatus;
  let paceFactor: number;
  let message: string;

  if (restantes === 0) {
    status = 'concluido';
    paceFactor = 0;
    message = 'Currículo concluído — todos os conteúdos consolidados. 🎉';
  } else if (fitsInPlan) {
    status = 'no_ritmo';
    paceFactor = 0.4;
    message =
      `No ritmo: cobrir todo o currículo (${totalCurriculumHours}h) em 104 semanas ` +
      `exige ~${hoursPerWeekNeeded}h/semana, dentro das ${WEEKLY_HOURS}h planejadas.`;
  } else {
    status = 'atrasada';
    // quanto acima da base, proporcionalmente (limitado a 1)
    paceFactor = Math.min(1, hoursPerWeekNeeded / WEEKLY_HOURS - 1 + 0.6);
    message =
      `Para concluir todo o currículo (${totalCurriculumHours}h) até 1º/dez/2028, ` +
      `são necessárias ~${hoursPerWeekNeeded}h/semana — acima das ${WEEKLY_HOURS}h planejadas. ` +
      `Aumente o ritmo ou priorize os focos de maior incidência.`;
  }

  return {
    totalContents,
    dominados,
    restantes,
    targetDate: TARGET_DATE.toISOString().split('T')[0],
    totalWeeks: TOTAL_WEEKS,
    totalCurriculumHours,
    hoursPerWeekNeeded,
    weeklyHoursBase: WEEKLY_HOURS,
    fitsInPlan,
    weeksRemaining: TOTAL_WEEKS,
    contentsPerWeekNeeded,
    contentsPerWeekBase,
    status,
    paceFactor,
    message,
  };
}
