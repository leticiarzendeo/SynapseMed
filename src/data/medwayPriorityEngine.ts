// ============================================================================
// medwayPriorityEngine.ts
// ----------------------------------------------------------------------------
// Transforma os focos PRIORITÁRIOS da Medway (medwayPriorities.ts) em sinais
// que o algoritmo de priorização, revisão e cronograma do app consome.
//
// Ideia central: um conteúdo marcado como "prioritário" pela Medway (com base
// na incidência histórica das instituições-alvo) deve subir na fila de estudos.
// Este módulo NÃO decide sozinho a ordem — ele fornece um "peso de prioridade"
// e um conjunto de contentIds prioritários, que o motor de planejamento usa
// junto com os outros fatores (domínio, revisão espaçada, erros).
//
// Mantém-se de propósito simples e desacoplado: se amanhã você capturar os
// níveis Alta/Média/Baixa, basta estender medwayPriorities.ts; a lógica aqui
// continua valendo.
// ============================================================================

import {
  medwayPriorityFocos,
  medwayPriorityContentIds,
  MedwayPriorityFoco,
} from '../data/medwayPriorities';

/** Peso aplicado a um conteúdo prioritário Medway na ordenação de estudos. */
export const MEDWAY_PRIORITY_WEIGHT = 100;

/**
 * Retorna true se o conteúdo é foco PRIORITÁRIO da Medway (todas instituições).
 */
export function isMedwayPriority(contentId?: string): boolean {
  if (!contentId) return false;
  return medwayPriorityContentIds.has(contentId);
}

/**
 * Peso de prioridade Medway para um conteúdo (0 se não for prioritário).
 * O motor de planejamento soma este peso aos seus próprios critérios.
 */
export function medwayPriorityBoost(contentId?: string): number {
  return isMedwayPriority(contentId) ? MEDWAY_PRIORITY_WEIGHT : 0;
}

/**
 * Ordena uma lista de contentIds colocando os focos prioritários Medway na
 * frente, preservando a ordem original dentro de cada grupo (estável).
 * Útil para o cronograma sugerir primeiro o que mais cai nas provas.
 */
export function sortByMedwayPriority<T>(
  items: T[],
  getContentId: (item: T) => string | undefined
): T[] {
  return [...items].sort((a, b) => {
    const pa = isMedwayPriority(getContentId(a)) ? 1 : 0;
    const pb = isMedwayPriority(getContentId(b)) ? 1 : 0;
    return pb - pa; // prioritários primeiro
  });
}

/** Agrupa os focos prioritários por área -> tema, para exibição na aba. */
export interface PriorityAreaGroup {
  area: string;
  temas: { tema: string; focos: MedwayPriorityFoco[] }[];
  totalFocos: number;
}

export function groupPriorityByArea(): PriorityAreaGroup[] {
  const areaMap = new Map<string, Map<string, MedwayPriorityFoco[]>>();
  for (const f of medwayPriorityFocos) {
    if (!areaMap.has(f.area)) areaMap.set(f.area, new Map());
    const temaMap = areaMap.get(f.area)!;
    if (!temaMap.has(f.tema)) temaMap.set(f.tema, []);
    temaMap.get(f.tema)!.push(f);
  }
  const groups: PriorityAreaGroup[] = [];
  for (const [area, temaMap] of areaMap) {
    const temas = [...temaMap.entries()].map(([tema, focos]) => ({ tema, focos }));
    const totalFocos = temas.reduce((s, t) => s + t.focos.length, 0);
    groups.push({ area, temas, totalFocos });
  }
  // ordena áreas por nº de focos prioritários (mais prioritárias primeiro)
  groups.sort((a, b) => b.totalFocos - a.totalFocos);
  return groups;
}

/** Totais prioritários por instituição (da tela Medway, informativo). */
export const medwayInstitutionTotals: { sigla: string; focos: number }[] = [
  { sigla: 'UNICAMP', focos: 77 },
  { sigla: 'USP-RP', focos: 75 },
  { sigla: 'USP-SP', focos: 68 },
  { sigla: 'Einstein', focos: 67 },
  { sigla: 'ENAMED', focos: 52 },
];

/** Total geral de focos prioritários (todas instituições). */
export const medwayTotalPriorityFocos = medwayPriorityFocos.length; // 131
