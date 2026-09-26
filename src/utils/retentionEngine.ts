// ============================================================================
// retentionEngine.ts
// ----------------------------------------------------------------------------
// Motor de RETENÇÃO / REVISÃO do SynapseMed (versão simplificada aprovada).
//
// Arquitetura (decisão da usuária): o Osler é o especialista em flashcards. O
// SynapseMed NÃO reproduz o histórico cartão a cartão — ele recebe o AGREGADO
// por bloco/tópico (quantos Fácil/Normal/Difícil/Errei), estima a retenção do
// bloco, agenda a próxima revisão (regra simples) e agrega os blocos para formar
// a RETENÇÃO do CONTEÚDO, que alimenta o domínio e a prioridade.
//
// FSRS-6 matemático NÃO é usado nesta fase (a lógica é a "Opção 1": estado atual
// define o intervalo). O histórico é preservado para evoluir para intervalos
// crescentes (Opção 2) no futuro, sem retrabalho.
//
// Este motor NÃO decide prioridade, domínio geral nem planejamento — só entrega:
// retenção do bloco/conteúdo + necessidade e data de revisão.
// ============================================================================

import { OslerBlockRecord } from '../types';

// Pesos das categorias (definidos com a usuária).
export const CARD_WEIGHTS = { easy: 100, normal: 80, hard: 50, wrong: 20 };

// Limiares de retenção (spec: consolidação exige retenção >= 80).
export const RETENTION_ALTA = 80;
export const RETENTION_MEDIA = 60;

// Intervalos da regra simples (dias), por faixa de retenção.
export const REVIEW_INTERVAL_DAYS = { baixa: 3, media: 7, alta: 21 };

export type RetentionLevel = 'alta' | 'media' | 'baixa';

/** Retenção 0-100 de um bloco a partir da distribuição de cartões. */
export function blockRetention(d: {
  easy: number; normal: number; hard: number; wrong: number;
}): number {
  const total = d.easy + d.normal + d.hard + d.wrong;
  if (total <= 0) return 0;
  const soma =
    d.easy * CARD_WEIGHTS.easy +
    d.normal * CARD_WEIGHTS.normal +
    d.hard * CARD_WEIGHTS.hard +
    d.wrong * CARD_WEIGHTS.wrong;
  return Math.round((soma / total) * 10) / 10;
}

export function retentionLevel(retention: number): RetentionLevel {
  if (retention >= RETENTION_ALTA) return 'alta';
  if (retention >= RETENTION_MEDIA) return 'media';
  return 'baixa';
}

/** Próxima revisão (YYYY-MM-DD) a partir da retenção atual e da data informada. */
export function scheduleNextReview(retention: number, fromDate: Date = new Date()): string {
  const level = retentionLevel(retention);
  const days = REVIEW_INTERVAL_DAYS[level];
  const next = new Date(fromDate);
  next.setDate(next.getDate() + days);
  return next.toISOString().split('T')[0];
}

/** Cria/atualiza o registro de um bloco a partir de uma nova informação. */
export function upsertBlockRecord(
  existing: OslerBlockRecord | undefined,
  input: {
    contentId: string; blockName: string;
    totalCards: number; easy: number; normal: number; hard: number; wrong: number;
  }
): OslerBlockRecord {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const retention = blockRetention(input);
  const historyEntry = {
    date: todayStr,
    easy: input.easy, normal: input.normal, hard: input.hard, wrong: input.wrong,
    retention,
  };
  return {
    id: existing?.id ?? `osler-${input.contentId}-${slug(input.blockName)}-${Date.now()}`,
    contentId: input.contentId,
    blockName: input.blockName,
    totalCards: input.totalCards,
    easy: input.easy, normal: input.normal, hard: input.hard, wrong: input.wrong,
    retention,
    lastInformedDate: todayStr,
    nextReviewDate: scheduleNextReview(retention, today),
    history: [...(existing?.history ?? []), historyEntry], // nunca apaga histórico
  };
}

function slug(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ----------------------------------------------------------------------------
// Agregação: blocos -> retenção do CONTEÚDO.
// Regra da spec: NÃO deixar um bloco forte esconder vários fracos. Por isso
// usamos média ponderada pelo nº de cartões, mas com PENALIDADE por blocos
// fracos (puxa a retenção do conteúdo para baixo quando há blocos frágeis).
// ----------------------------------------------------------------------------
export function contentRetention(blocks: OslerBlockRecord[]): number | null {
  if (!blocks.length) return null;
  const totalCards = blocks.reduce((s, b) => s + b.totalCards, 0);
  if (totalCards <= 0) return null;
  // média ponderada por cartões
  const weighted =
    blocks.reduce((s, b) => s + b.retention * b.totalCards, 0) / totalCards;
  // penalidade: quanto mais blocos abaixo da meta, mais puxa para baixo
  const fracos = blocks.filter((b) => b.retention < RETENTION_ALTA).length;
  const fracaoFraca = fracos / blocks.length;
  const penalidade = fracaoFraca * 0.15; // até -15%
  return Math.round(weighted * (1 - penalidade) * 10) / 10;
}

export type ReviewStatus = 'vencida' | 'hoje' | 'proxima' | 'futura' | 'sem_dados';

export function reviewStatus(block: OslerBlockRecord, today: Date = new Date()): ReviewStatus {
  const t = today.toISOString().split('T')[0];
  if (!block.nextReviewDate) return 'sem_dados';
  if (block.nextReviewDate < t) return 'vencida';
  if (block.nextReviewDate === t) return 'hoje';
  // "próxima" = dentro de 3 dias
  const diff =
    (new Date(block.nextReviewDate).getTime() - new Date(t).getTime()) / 86400000;
  return diff <= 3 ? 'proxima' : 'futura';
}

/**
 * Necessidade de revisão do CONTEÚDO (0..1) para o motor de prioridade.
 * Vencida/hoje puxa forte; próxima puxa moderado; futura/sem dados = 0.
 * É a saída que "liga" o fator revisão (peso 20) do priorityEngine.
 */
export function contentReviewNeed(blocks: OslerBlockRecord[], today: Date = new Date()): number {
  if (!blocks.length) return 0;
  let need = 0;
  for (const b of blocks) {
    const st = reviewStatus(b, today);
    if (st === 'vencida') need = Math.max(need, 1);
    else if (st === 'hoje') need = Math.max(need, 0.9);
    else if (st === 'proxima') need = Math.max(need, 0.5);
  }
  return need;
}
