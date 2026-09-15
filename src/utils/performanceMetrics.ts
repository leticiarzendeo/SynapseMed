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

import { AreaItem, ContentItem } from '../types';
import { calculateContentDomain } from './domainCalculator';

export interface KpiValue {
  /** Valor 0-100 quando há base real; null quando não há dados. */
  value: number | null;
  /** Quantas unidades de evidência sustentam o número (questões, cartões...). */
  evidenceCount: number;
}

export interface AreaPerformance {
  id: string;
  name: string;
  /** Média de domínio dos conteúdos estudados da área; null se nenhum estudado. */
  mastery: number | null;
  studiedContents: number;
  totalContents: number;
}

export interface DesempenhoMetrics {
  overallAccuracy: KpiValue;   // "Acurácia Geral"
  knowledge: KpiValue;         // 📚 Conhecimento
  application: KpiValue;       // 🎯 Aplicação em Prova
  retention: KpiValue;         // 🧠 Retenção
  confidence: {
    label: 'Alta' | 'Moderada' | 'Inicial' | 'Sem dados';
    value: number | null;      // score 0-100 quando houver base
    totalQuestions: number;    // volume real somado
    totalCards: number;        // cartões Osler reais somados
  };
  areas: AreaPerformance[];
  studiedCount: number;
  totalCount: number;
  mappedErrorTopics: number;   // nº real de temas no caderno de erros
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

/** Média simples ignorando nulos; retorna null se lista vazia. */
function avgOrNull(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10; // 1 casa decimal
}

/**
 * Constrói todas as métricas da aba Desempenho a partir do currículo já
 * sobreposto (com isStudied real) e do número de temas no caderno de erros.
 *
 * Regra central: agregamos SOMENTE sobre conteúdos estudados (isStudied),
 * e cada dimensão só entra na média quando o conteúdo tem evidência real
 * para aquela dimensão (volume > 0). Sem evidência → o KPI fica null.
 */
export function computeDesempenhoMetrics(
  curriculum: readonly AreaItem[],
  mappedErrorTopics: number
): DesempenhoMetrics {
  const allContents = flatten(curriculum);
  const totalCount = allContents.length;
  const studied = allContents.filter((c) => c.isStudied);

  const knowledgeVals: number[] = [];
  const applicationVals: number[] = [];
  const retentionVals: number[] = [];
  const overallVals: number[] = [];

  let knowledgeEvidence = 0;
  let applicationEvidence = 0;
  let retentionEvidence = 0;
  let totalQuestions = 0;
  let totalCards = 0;

  for (const content of studied) {
    const d = calculateContentDomain(content);
    const ev = d.evidenceStats;

    const knowledgeVol = ev.medwayQuestionsCount;
    const applicationVol =
      ev.realExamQuestionsCount + ev.simuladoQuestionsCount;
    const retentionVol = ev.oslerCardsReviewedCount;

    if (knowledgeVol > 0) {
      knowledgeVals.push(d.knowledgeScore);
      knowledgeEvidence += knowledgeVol;
    }
    if (applicationVol > 0) {
      applicationVals.push(d.applicationScore);
      applicationEvidence += applicationVol;
    }
    if (retentionVol > 0) {
      retentionVals.push(d.retentionScore);
      retentionEvidence += retentionVol;
    }

    // Domínio geral só entra quando há QUALQUER evidência real no conteúdo.
    if (knowledgeVol + applicationVol + retentionVol > 0) {
      overallVals.push(d.overallDomain);
    }

    totalQuestions += knowledgeVol + applicationVol;
    totalCards += retentionVol;
  }

  // Confiança: derivada do volume real total de evidência.
  const totalEvidence = totalQuestions + totalCards;
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
    confidenceValue = Math.round((totalEvidence / 600) * 100);
  }

  const areas: AreaPerformance[] = curriculum.map((area) => {
    const contents = area.modules.flatMap((m) => m.contents);
    const studiedInArea = contents.filter((c) => c.isStudied);
    const masteryVals: number[] = [];
    for (const c of studiedInArea) {
      const d = calculateContentDomain(c);
      const ev = d.evidenceStats;
      const vol =
        ev.medwayQuestionsCount +
        ev.realExamQuestionsCount +
        ev.simuladoQuestionsCount +
        ev.oslerCardsReviewedCount;
      if (vol > 0) masteryVals.push(d.overallDomain);
    }
    return {
      id: area.id,
      name: area.name,
      mastery: avgOrNull(masteryVals),
      studiedContents: studiedInArea.length,
      totalContents: contents.length,
    };
  });

  return {
    overallAccuracy: { value: avgOrNull(overallVals), evidenceCount: totalEvidence },
    knowledge: { value: avgOrNull(knowledgeVals), evidenceCount: knowledgeEvidence },
    application: { value: avgOrNull(applicationVals), evidenceCount: applicationEvidence },
    retention: { value: avgOrNull(retentionVals), evidenceCount: retentionEvidence },
    confidence: {
      label: confidenceLabel,
      value: confidenceValue,
      totalQuestions,
      totalCards,
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
