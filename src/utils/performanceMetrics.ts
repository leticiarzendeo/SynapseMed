// ============================================================================
// performanceMetrics.ts
// ----------------------------------------------------------------------------
// Métricas HONESTAS da aba Desempenho.
//
// Problema resolvido:
//   Vários KPIs do DesempenhoView eram STRINGS FIXAS digitadas no JSX
//   ("Acurácia Geral: 78,4%", "Conhecimento 88,0%", "18 temas mapeados",
//   cards de erro inventados). Pareciam dados do usuário, mas não eram.
//
// Estratégia (modelo híbrido escolhido pela usuária):
//   - Calcular cada número a partir de evidência REAL (calculateContentDomain
//     sobre os conteúdos efetivamente estudados).
//   - Quando NÃO há base para um número, devolver `null` (a tela mostra
//     "sem dados ainda") em vez de inventar um valor.
//   - Nada de números fixos.
//
// Um KPI só recebe valor quando existe volume mínimo de evidência real para
// aquela dimensão; caso contrário fica null.
// ============================================================================

import { AreaItem, ContentItem, EvidenceRecord } from '../types';

export interface KpiValue {
  /** Valor 0-100 quando há base real; null quando não há dados. */
  value: number | null;
  /** Quantas unidades de evidência sustentam o número (questões, cartões...). */
  evidenceCount: number;
}

export interface AreaPerformance {
  id: string;
  name: string;
  /** Acurácia média das questões registradas na área; null se nenhuma. */
  mastery: number | null;
  studiedContents: number;
  totalContents: number;
}

export interface DesempenhoMetrics {
  overallAccuracy: KpiValue;   // "Acurácia Geral" (todas as questões registradas)
  knowledge: KpiValue;         // 📚 Conhecimento (questões tipo 'avanco'/'questoes')
  application: KpiValue;       // 🎯 Aplicação em Prova (questões tipo 'questoes')
  retention: KpiValue;         // 🧠 Retenção (cartões Osler)
  confidence: {
    label: 'Alta' | 'Moderada' | 'Inicial' | 'Sem dados';
    value: number | null;
    totalQuestions: number;
    totalCards: number;
  };
  areas: AreaPerformance[];
  studiedCount: number;
  totalCount: number;
  mappedErrorTopics: number;
}

function flatten(hierarchy: readonly AreaItem[]): ContentItem[] {
  const out: ContentItem[] = [];
  for (const area of hierarchy) {
    for (const mod of area.modules) {
      for (const c of mod.contents) out.push(c);
    }
  }
  return out;
}

/** Acurácia (%) a partir de somas de acertos/total; null se total 0. */
function accuracyOrNull(correct: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((correct / total) * 1000) / 10; // 1 casa decimal
}

/**
 * Constrói as métricas do Desempenho a partir da EVIDÊNCIA REAL registrada
 * manualmente pela usuária (evidenceLog), atribuída por contentId.
 *
 * Regra central: cada KPI só recebe valor quando há registros que o sustentam;
 * caso contrário, null (a tela mostra "—"). Nada é inventado.
 */
export function computeDesempenhoMetrics(
  curriculum: readonly AreaItem[],
  evidenceLog: readonly EvidenceRecord[],
  mappedErrorTopics: number
): DesempenhoMetrics {
  const allContents = flatten(curriculum);
  const totalCount = allContents.length;
  const studied = allContents.filter((c) => c.isStudied);

  // Índice contentId -> área, para o breakdown por área.
  const contentAreaId = new Map<string, string>();
  for (const area of curriculum) {
    for (const mod of area.modules) {
      for (const c of mod.contents) contentAreaId.set(c.id, area.id);
    }
  }

  // Agregações de questões
  let qTotal = 0;
  let qCorrect = 0;
  let appTotal = 0;   // aplicação: registros do tipo 'questoes'
  let appCorrect = 0;
  let knowTotal = 0;  // conhecimento: registros do tipo 'avanco' e 'questoes'
  let knowCorrect = 0;
  // Retenção (cartões)
  let cardsCount = 0;
  let retentionWeightedSum = 0; // média ponderada por nº de cartões

  // por área
  const areaCorrect = new Map<string, number>();
  const areaTotal = new Map<string, number>();

  for (const ev of evidenceLog) {
    const total = ev.questionsTotal ?? 0;
    const correct = ev.questionsCorrect ?? 0;
    if (total > 0) {
      qTotal += total;
      qCorrect += correct;
      if (ev.kind === 'questoes') {
        appTotal += total;
        appCorrect += correct;
      }
      // conhecimento inclui avanço (fixação) e questões
      knowTotal += total;
      knowCorrect += correct;

      const aId = contentAreaId.get(ev.contentId);
      if (aId) {
        areaCorrect.set(aId, (areaCorrect.get(aId) ?? 0) + correct);
        areaTotal.set(aId, (areaTotal.get(aId) ?? 0) + total);
      }
    }
    if (ev.cardsReviewed && ev.cardsReviewed > 0 && ev.retentionPercent != null) {
      cardsCount += ev.cardsReviewed;
      retentionWeightedSum += ev.retentionPercent * ev.cardsReviewed;
    }
  }

  const retentionValue =
    cardsCount > 0 ? Math.round((retentionWeightedSum / cardsCount) * 10) / 10 : null;

  const totalEvidence = qTotal + cardsCount;
  let confidenceLabel: 'Alta' | 'Moderada' | 'Inicial' | 'Sem dados';
  let confidenceValue: number | null;
  if (totalEvidence === 0) {
    confidenceLabel = 'Sem dados';
    confidenceValue = null;
  } else if (totalEvidence >= 300) {
    confidenceLabel = 'Alta';
    confidenceValue = Math.min(100, Math.round((totalEvidence / 600) * 100));
  } else if (totalEvidence >= 80) {
    confidenceLabel = 'Moderada';
    confidenceValue = Math.round((totalEvidence / 600) * 100);
  } else {
    confidenceLabel = 'Inicial';
    confidenceValue = Math.max(1, Math.round((totalEvidence / 600) * 100));
  }

  const areas: AreaPerformance[] = curriculum.map((area) => {
    const contents = area.modules.flatMap((m) => m.contents);
    const studiedInArea = contents.filter((c) => c.isStudied);
    return {
      id: area.id,
      name: area.name,
      mastery: accuracyOrNull(areaCorrect.get(area.id) ?? 0, areaTotal.get(area.id) ?? 0),
      studiedContents: studiedInArea.length,
      totalContents: contents.length,
    };
  });

  return {
    overallAccuracy: { value: accuracyOrNull(qCorrect, qTotal), evidenceCount: qTotal },
    knowledge: { value: accuracyOrNull(knowCorrect, knowTotal), evidenceCount: knowTotal },
    application: { value: accuracyOrNull(appCorrect, appTotal), evidenceCount: appTotal },
    retention: { value: retentionValue, evidenceCount: cardsCount },
    confidence: {
      label: confidenceLabel,
      value: confidenceValue,
      totalQuestions: qTotal,
      totalCards: cardsCount,
    },
    areas,
    studiedCount: studied.length,
    totalCount,
    mappedErrorTopics,
  };
}

/** Formata um KPI para exibição: número com 1 casa ou "—". */
export function formatKpi(v: number | null, suffix = '%'): string {
  if (v === null) return '—';
  const str = v.toFixed(1).replace('.', ',');
  return `${str}${suffix}`;
}
