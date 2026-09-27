// ============================================================================
// priorityEngine.ts
// ----------------------------------------------------------------------------
// MOTOR DE PRIORIDADE DE ESTUDO do SynapseMed.
//
// Responde: "dado meu domínio, memória, incidência, progresso e prazo, qual
// conteúdo merece atenção AGORA?" — mantendo cada conceito separado, conforme a
// especificação oficial de prioridades.
//
// MODELO (aprovado): incidência MODULA o déficit (não soma), no modo SUAVIZADO
// (incidência sempre contribui um mínimo, para que conteúdo de alta incidência
// permaneça no radar mesmo quando já dominado — manutenção).
//
//   déficit      = quanto falta para a meta de domínio (85%)
//   incidência   = relevância externa nas instituições-alvo (0..1)
//   núcleo       = incidência × (BASE + (1-BASE) × déficit)      [SUAVIZADO]
//
//   prioridade   = núcleo × 60
//                + necessidadeRevisão × 20     (FSRS — "quieto" por ora: 0)
//                + progressoCurricular × 10
//                + prazoRitmo × 10             ("quieto" por ora: 0)
//                + oportunidade × 5            (reservado: 0 por ora)
//
// Os fatores "quietos" (revisão, prazo) entram com 0 até o FSRS e o rastreio de
// prazo/ritmo de 2 anos existirem — então "ligam" sem retrabalho.
//
// A prioridade é do CONTEÚDO. A atividade recomendada é decidida à parte
// (recommendActivity), olhando qual dimensão está mais deficiente.
// ============================================================================

import { ContentItem, AreaItem, OslerBlockRecord } from '../types';
import { calculateContentDomain } from './domainCalculator';
import { isMedwayPriority } from './medwayPriorityEngine';
import { getContentState, ContentState } from './contentState';
import { contentReviewNeed } from './retentionEngine';

const META_DOMINIO = 85;
const INCID_BASE = 0.35;          // piso do modo SUAVIZADO
const INCID_ALTA = 1.0;           // conteúdo é foco prioritário Medway
const INCID_BAIXA = 0.2;          // sem incidência registrada (piso baixo)

// Pesos dos reforços (mesma escala da spec: 30 déficit + 25 incid ≈ núcleo 60).
const W_NUCLEO = 60;
const W_REVISAO = 20;   // quieto
const W_PROGRESSO = 10;
const W_PRAZO = 10;     // quieto
const W_OPORTUNIDADE = 5; // reservado

export type ActivityKind =
  | 'avanco'      // novo conteúdo / teoria (avanço curricular)
  | 'questoes'    // questões de provas reais (aplicação)
  | 'revisao'     // revisão / Osler (retenção)
  | 'exercicios'; // exercícios Medway (consolidação de conhecimento)

export interface ContentPriority {
  contentId: string;
  contentName: string;
  moduleName: string;
  // números mantidos SEPARADOS (nunca misturados):
  domain: number;              // 0..100
  knowledge: number;
  application: number;
  retention: number;
  confidence: number;          // 0..100
  state: ContentState;
  incidence: number;           // 0..1 (relevância externa)
  deficit: number;             // 0..1 (quanto falta p/ meta)
  priorityScore: number;       // 0..100 (resultado)
  // recomendação de atividade + motivo legível:
  recommendedActivity: ActivityKind;
  reason: string;
  estimatedMinutes: number;
}

function incidenceOf(contentId: string): number {
  return isMedwayPriority(contentId) ? INCID_ALTA : INCID_BAIXA;
}

// Duração inicial por tipo de atividade (spec item 17).
const DURATION: Record<ActivityKind, number> = {
  avanco: 60,
  exercicios: 60,     // pós-teoria 1h (pré 30 é caso à parte)
  questoes: 60,
  revisao: 60,
};

// Decide a atividade mais adequada olhando a dimensão mais deficiente.
// (Prioridade é do conteúdo; a atividade é o "como".)
function recommendActivity(p: {
  state: ContentState;
  knowledge: number;
  application: number;
  retention: number;
}): { kind: ActivityKind; reason: string } {
  // Conteúdo não iniciado -> avançar (teoria).
  if (p.state === 'nao_iniciado') {
    return { kind: 'avanco', reason: 'Conteúdo ainda não estudado — avanço curricular.' };
  }
  // Descobre a dimensão mais abaixo da própria meta.
  const gaps = [
    { dim: 'knowledge', gap: 85 - p.knowledge },
    { dim: 'application', gap: 80 - p.application },
    { dim: 'retention', gap: 80 - p.retention },
  ].sort((a, b) => b.gap - a.gap);
  const worst = gaps[0];
  if (worst.gap <= 0) {
    // tudo acima da meta -> manutenção via revisão espaçada
    return { kind: 'revisao', reason: 'Conteúdo dominado — manutenção por revisão espaçada.' };
  }
  if (worst.dim === 'application') {
    return { kind: 'questoes', reason: 'Aplicação abaixo da meta — questões de provas reais.' };
  }
  if (worst.dim === 'retention') {
    return { kind: 'revisao', reason: 'Retenção abaixo da meta — revisão (Osler/FSRS).' };
  }
  return { kind: 'exercicios', reason: 'Conhecimento abaixo da meta — exercícios Medway.' };
}

/** Calcula a prioridade de UM conteúdo. */
export function calculateContentPriority(
  content: ContentItem,
  moduleName: string,
  opts?: { revisao?: number; progresso?: number; prazo?: number; oportunidade?: number }
): ContentPriority {
  const d = calculateContentDomain(content);
  const state = getContentState(content);
  const incidence = incidenceOf(content.id);
  const deficit = Math.max(0, (META_DOMINIO - d.overallDomain) / META_DOMINIO);

  // núcleo SUAVIZADO
  const nucleo = incidence * (INCID_BASE + (1 - INCID_BASE) * deficit);

  // reforços (revisao e prazo "quietos" = 0 até existirem)
  const revisao = opts?.revisao ?? 0;
  const prazo = opts?.prazo ?? 0;
  const oportunidade = opts?.oportunidade ?? 0;
  // progresso curricular: conteúdo não iniciado empurra; iniciado empurra menos
  const progresso = opts?.progresso ?? (state === 'nao_iniciado' ? 1 : 0);

  const priorityScore = Math.round(
    (nucleo * W_NUCLEO +
      revisao * W_REVISAO +
      progresso * W_PROGRESSO +
      prazo * W_PRAZO +
      oportunidade * W_OPORTUNIDADE) * 10
  ) / 10;

  const act = recommendActivity({
    state,
    knowledge: d.knowledgeScore,
    application: d.applicationScore,
    retention: d.retentionScore,
  });

  return {
    contentId: content.id,
    contentName: content.name,
    moduleName,
    domain: Math.round(d.overallDomain),
    knowledge: Math.round(d.knowledgeScore),
    application: Math.round(d.applicationScore),
    retention: Math.round(d.retentionScore),
    confidence: Math.round(d.confidenceScore),
    state,
    incidence,
    deficit: Math.round(deficit * 100) / 100,
    priorityScore,
    recommendedActivity: act.kind,
    reason: act.reason,
    estimatedMinutes: DURATION[act.kind],
  };
}

/** Prioridade de todos os conteúdos de uma hierarquia, ordenada desc.
 *  oslerBlocks (opcional) "liga" o fator revisão por conteúdo. */
export function rankContentsByPriority(
  hierarchy: readonly AreaItem[],
  oslerBlocks: readonly OslerBlockRecord[] = [],
  paceFactor = 0
): ContentPriority[] {
  // agrupa blocos por conteúdo para calcular necessidade de revisão
  const blocksByContent = new Map<string, OslerBlockRecord[]>();
  for (const b of oslerBlocks) {
    if (!blocksByContent.has(b.contentId)) blocksByContent.set(b.contentId, []);
    blocksByContent.get(b.contentId)!.push(b);
  }
  const out: ContentPriority[] = [];
  for (const area of hierarchy)
    for (const mod of area.modules)
      for (const c of mod.contents) {
        const blocks = blocksByContent.get(c.id) ?? [];
        const revisao = blocks.length ? contentReviewNeed(blocks) : 0;
        // prazo empurra especialmente o AVANÇO curricular (conteúdo não iniciado)
        const st = getContentState(c);
        const prazo = st === 'nao_iniciado' ? paceFactor : paceFactor * 0.3;
        out.push(calculateContentPriority(c, mod.name, { revisao, prazo }));
      }
  out.sort((a, b) => b.priorityScore - a.priorityScore);
  return out;
}

/**
 * PLANO SEMANAL: distribui as prioridades reais pelos dias (seg–sex por padrão),
 * respeitando a capacidade de cada dia. Espalha entre módulos (variedade) e não
 * fragmenta. Retorna, por dia, a lista de atividades que cabem.
 *
 * days: capacidade (minutos) de cada dia, na ordem desejada.
 */
export interface WeekDayPlan {
  key: string;
  label: string;
  capacityMin: number;
  activities: ContentPriority[];
  usedMin: number;
}

export function buildWeeklyPlan(
  hierarchy: readonly AreaItem[],
  days: { key: string; label: string; capacityMin: number }[],
  oslerBlocks: readonly OslerBlockRecord[] = [],
  paceFactor = 0
): WeekDayPlan[] {
  const ranked = rankContentsByPriority(hierarchy, oslerBlocks, paceFactor)
    .filter((c) => c.priorityScore > 0);

  const plan: WeekDayPlan[] = days.map((d) => ({
    key: d.key, label: d.label, capacityMin: d.capacityMin, activities: [], usedMin: 0,
  }));

  const usedContentIds = new Set<string>();
  const moduleCountWeek: Record<string, number> = {};
  // distribui em rodadas: em cada rodada, tenta pôr 1 atividade por dia.
  // Na escolha, entre os candidatos que cabem e respeitam variedade no dia,
  // prefere o de módulo MENOS usado na semana (espalha os módulos), e só então
  // por prioridade — assim não concentra tudo num módulo quando há empate.
  let progress = true;
  while (progress) {
    progress = false;
    for (const day of plan) {
      const modsInDay = new Set(day.activities.map((a) => a.moduleName));
      const viable = ranked.filter(
        (c) =>
          !usedContentIds.has(c.contentId) &&
          day.usedMin + c.estimatedMinutes <= day.capacityMin &&
          !modsInDay.has(c.moduleName)
      );
      if (!viable.length) continue;
      // ordena por (módulo menos usado na semana) e depois por prioridade desc
      viable.sort((a, b) => {
        const ma = moduleCountWeek[a.moduleName] ?? 0;
        const mb = moduleCountWeek[b.moduleName] ?? 0;
        if (ma !== mb) return ma - mb;
        return b.priorityScore - a.priorityScore;
      });
      const candidate = viable[0];
      day.activities.push(candidate);
      day.usedMin += candidate.estimatedMinutes;
      usedContentIds.add(candidate.contentId);
      moduleCountWeek[candidate.moduleName] = (moduleCountWeek[candidate.moduleName] ?? 0) + 1;
      progress = true;
    }
  }
  // 2ª passada: preenche folgas mesmo repetindo módulo, se ainda couber
  for (const day of plan) {
    for (const c of ranked) {
      if (usedContentIds.has(c.contentId)) continue;
      if (day.usedMin + c.estimatedMinutes > day.capacityMin) continue;
      day.activities.push(c);
      day.usedMin += c.estimatedMinutes;
      usedContentIds.add(c.contentId);
    }
  }
  return plan;
}

/**
 * Monta o PLANO DE HOJE.
 * Regras (definidas com a usuária):
 *  - 1 a 2 atividades por dia (foco), nunca fragmentar em pedaços pequenos.
 *  - Espalhar entre módulos diferentes quando há empate (variedade no dia).
 *  - Respeitar o tempo disponível, mas sem forçar preencher tudo.
 * Ordena por prioridade; no empate, dá preferência a módulos ainda não usados
 * no plano do dia; para no limite de 2 atividades ou quando não cabe mais.
 */
export function buildTodayPlan(
  hierarchy: readonly AreaItem[],
  availableMinutes: number,
  maxActivities = 2,
  oslerBlocks: readonly OslerBlockRecord[] = [],
  paceFactor = 0
): ContentPriority[] {
  const ranked = rankContentsByPriority(hierarchy, oslerBlocks, paceFactor).filter((c) => c.priorityScore > 0);
  const plan: ContentPriority[] = [];
  const usedModules = new Set<string>();
  let used = 0;

  // 1ª passada: pega os de maior prioridade priorizando MÓDULOS diferentes.
  for (const c of ranked) {
    if (plan.length >= maxActivities) break;
    if (used + c.estimatedMinutes > availableMinutes) continue;
    if (usedModules.has(c.moduleName)) continue; // variedade: 1 por módulo nesta passada
    plan.push(c);
    usedModules.add(c.moduleName);
    used += c.estimatedMinutes;
  }
  // 2ª passada: se ainda cabe e sobrou vaga, completa mesmo repetindo módulo.
  if (plan.length < maxActivities) {
    for (const c of ranked) {
      if (plan.length >= maxActivities) break;
      if (plan.some((p) => p.contentId === c.contentId)) continue;
      if (used + c.estimatedMinutes > availableMinutes) continue;
      plan.push(c);
      used += c.estimatedMinutes;
    }
  }
  return plan;
}

// ----------------------------------------------------------------------------
