// ============================================================================
// Grade da semana — fonte única para as abas Hoje e Planejamento
// ----------------------------------------------------------------------------
// A grade é montada uma vez por semana e GUARDADA (App → localStorage/nuvem).
// Ela não é refeita quando você conclui uma atividade, então nada "sobe" de um
// dia para o outro sozinho. Só é refeita quando:
//   - a semana muda (nova grade);
//   - muda algo que você escolheu: tempo de hoje, capacidade dos dias ou foco
//     de módulo → refaz só o RESTANTE (de hoje em diante);
//   - você pede "Recalcular Restante" ou "Recalcular Tudo".
// Ao refazer, o que já foi concluído, o que você moveu e o que ficou em dias
// passados permanece onde está.
//
// Regras da grade:
// - Dias úteis (seg–sex) da semana atual; dias que já passaram não recebem
//   atividade nova. Sáb/dom: a semana útil acabou e a grade é a da próxima.
// - O tempo escolhido em "Ajustar tempo de hoje" substitui a capacidade de hoje.
// - O foco de módulo das Configurações vale para a semana inteira.
// ============================================================================
import { AreaItem, DayCapacityConfig, OslerBlockRecord } from '../types';
import { DIAS_SEMANA, chaveDiaSemanaBR, hojeBR, segundaDaSemanaBR, somarDiasBR } from './dateBR';
import { buildWeeklyPlan, ContentPriority } from './priorityEngine';

export const WEEKDAY_KEYS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

/** Capacidade usada quando o dia não está configurado (1h36). */
const DEFAULT_DAY_CAPACITY_MIN = 96;

export interface WeekScheduleItem {
  /** `${contentId}-${atividade}` — estável enquanto a grade existir. */
  id: string;
  cp: ContentPriority;
  /** Dia em que a atividade está agora. */
  day: string;
  /** Dia em que o algoritmo a colocou. */
  recommendedDay: string;
  status: 'pendente' | 'concluido';
  movedByUser?: boolean;
}

export interface WeekSchedule {
  /** Segunda-feira (YYYY-MM-DD) da semana da grade. */
  week: string;
  /** Escolhas que geraram a grade; se mudarem, o restante é refeito. */
  signature: string;
  items: WeekScheduleItem[];
}

export interface WeekScheduleInput {
  curriculum: readonly AreaItem[];
  weekDays: readonly DayCapacityConfig[];
  oslerBlocks?: readonly OslerBlockRecord[];
  paceFactor?: number;
  focoModulo?: string;
  /** Tempo escolhido para hoje; null/undefined usa a capacidade do dia. */
  todayMinutes?: number | null;
  hojeISO?: string;
}

/** Semana de referência: a atual (seg–sex) ou a próxima (sáb/dom). */
export function weekReference(hojeISO: string = hojeBR()) {
  const hojeKey = chaveDiaSemanaBR(hojeISO);
  const fimDeSemana = hojeKey === 'sabado' || hojeKey === 'domingo';
  const segunda = fimDeSemana ? somarDiasBR(segundaDaSemanaBR(hojeISO), 7) : segundaDaSemanaBR(hojeISO);
  const diaPassou = (key: string) =>
    !fimDeSemana && DIAS_SEMANA.indexOf(key) < DIAS_SEMANA.indexOf(hojeKey);
  return { hojeKey, fimDeSemana, segunda, diaPassou };
}

const baseCapacity = (weekDays: readonly DayCapacityConfig[], key: string) =>
  weekDays.find((d) => d.key === key)?.capacityMin ?? DEFAULT_DAY_CAPACITY_MIN;

function signatureOf(input: WeekScheduleInput): string {
  const caps = WEEKDAY_KEYS.map((k) => baseCapacity(input.weekDays, k)).join(',');
  return `${caps}|${input.focoModulo ?? ''}|${input.todayMinutes ?? ''}`;
}

/**
 * Devolve a grade desta semana a partir da anterior.
 * - 'auto': mantém a anterior se nada que você escolheu mudou (mesmo objeto);
 *   refaz o restante se mudou; monta uma nova se a semana virou.
 * - 'remaining': refaz de hoje em diante (mantém concluídas, movidas e passadas).
 * - 'all': refaz a semana toda (mantém só as concluídas).
 */
export function planWeekSchedule(
  prev: WeekSchedule | null,
  input: WeekScheduleInput,
  mode: 'auto' | 'remaining' | 'all' = 'auto'
): WeekSchedule {
  const hojeISO = input.hojeISO ?? hojeBR();
  const { hojeKey, fimDeSemana, segunda, diaPassou } = weekReference(hojeISO);
  const signature = signatureOf(input);
  const sameWeek = prev?.week === segunda;

  if (mode === 'auto') {
    if (sameWeek && prev!.signature === signature) return prev!;
    mode = sameWeek ? 'remaining' : 'all';
  }

  const previous = sameWeek ? prev!.items : [];
  const kept = previous.filter((it) =>
    mode === 'all'
      ? it.status === 'concluido'
      : it.status === 'concluido' || it.movedByUser || diaPassou(it.day)
  );

  // O que fica ocupa tempo no seu dia; o resto da capacidade é redistribuído.
  const reserved: Record<string, number> = {};
  for (const it of kept) reserved[it.day] = (reserved[it.day] ?? 0) + it.cp.estimatedMinutes;

  const caps = WEEKDAY_KEYS.map((key) => {
    let capacityMin = baseCapacity(input.weekDays, key);
    if (!fimDeSemana) {
      if (diaPassou(key)) capacityMin = 0;
      else if (key === hojeKey && input.todayMinutes != null) capacityMin = input.todayMinutes;
    }
    return { key, label: key.toUpperCase(), capacityMin: Math.max(0, capacityMin - (reserved[key] ?? 0)) };
  });

  const plan = buildWeeklyPlan(
    input.curriculum,
    caps,
    input.oslerBlocks ?? [],
    input.paceFactor ?? 0,
    input.focoModulo,
    kept.map((it) => it.cp.contentId)
  );

  const fresh: WeekScheduleItem[] = plan.flatMap((d) =>
    d.activities.map((cp) => ({
      id: `${cp.contentId}-${cp.recommendedActivity}`,
      cp,
      day: d.key,
      recommendedDay: d.key,
      status: 'pendente' as const,
    }))
  );

  return { week: segunda, signature, items: [...kept, ...fresh] };
}
