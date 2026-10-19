// ============================================================================
// Plano da semana — fonte única para as abas Hoje e Planejamento
// ----------------------------------------------------------------------------
// As duas abas chamam esta função com os mesmos dados, então o que o
// Planejamento marca para hoje é exatamente o que a aba Hoje recomenda.
// - Dias úteis (seg–sex) da semana atual; dias que já passaram ficam sem
//   atividades. Sáb/dom: a semana útil acabou e o plano é o da próxima semana.
// - O tempo escolhido em "Ajustar tempo de hoje" substitui a capacidade de hoje.
// - O foco de módulo das Configurações vale para a semana inteira.
// ============================================================================
import { AreaItem, DayCapacityConfig, OslerBlockRecord } from '../types';
import { DIAS_SEMANA, chaveDiaSemanaBR, hojeBR } from './dateBR';
import { buildWeeklyPlan, WeekDayPlan } from './priorityEngine';

export const WEEKDAY_KEYS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

/** Capacidade usada quando o dia não está configurado (1h36). */
const DEFAULT_DAY_CAPACITY_MIN = 96;

export interface CurrentWeekPlanInput {
  curriculum: readonly AreaItem[];
  weekDays: readonly DayCapacityConfig[];
  oslerBlocks?: readonly OslerBlockRecord[];
  paceFactor?: number;
  focoModulo?: string;
  /** Tempo escolhido para hoje; null/undefined usa a capacidade do dia. */
  todayMinutes?: number | null;
  hojeISO?: string;
}

export function buildCurrentWeekPlan({
  curriculum,
  weekDays,
  oslerBlocks = [],
  paceFactor = 0,
  focoModulo,
  todayMinutes,
  hojeISO = hojeBR(),
}: CurrentWeekPlanInput): WeekDayPlan[] {
  const hojeKey = chaveDiaSemanaBR(hojeISO);
  const fimDeSemana = hojeKey === 'sabado' || hojeKey === 'domingo';

  const caps = WEEKDAY_KEYS.map((key) => {
    let capacityMin = weekDays.find((d) => d.key === key)?.capacityMin ?? DEFAULT_DAY_CAPACITY_MIN;
    if (!fimDeSemana) {
      if (DIAS_SEMANA.indexOf(key) < DIAS_SEMANA.indexOf(hojeKey)) capacityMin = 0;
      else if (key === hojeKey && todayMinutes != null) capacityMin = todayMinutes;
    }
    return { key, label: key.toUpperCase(), capacityMin };
  });

  return buildWeeklyPlan(curriculum, caps, oslerBlocks, paceFactor, focoModulo);
}
