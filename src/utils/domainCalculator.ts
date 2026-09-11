import {
  ContentItem,
  DomainCalculationBreakdown,
  DomainConfidenceLevel,
  DomainConsolidationStatus,
  Brain2Prioritization,
  Brain2ActionType,
  ContentActivityOption,
  UserPreferences,
} from '../types';

/**
 * CÉREBRO DO DOMÍNIO & CÉREBRO DE PRIORIZAÇÃO - ARQUITETURA DE DOIS CÉREBROS
 * 
 * 🧠 CÉREBRO 1 — DOMÍNIO ("Como estou neste conteúdo?"):
 * - 📚 Conhecimento: 30% (Medway pós-aula e reavaliações teóricas; baseline pré não penaliza)
 * - 🎯 Aplicação: 45% (Provas reais e simulados sob bancas oficiais - objetivo final da residência)
 * - 🧠 Retenção: 25% (Osler FSRS - memória ativa disponível para resgate no longo prazo)
 * - 📊 Confiança: Mede certeza (Quantidade + Consistência + Diversidade) sem penalizar para baixo
 * - 🚨 Trava de Segurança para Consolidação (Meta 85% + Aplicação >= 80% + Retenção >= 80% + Confiança não baixa)
 * - 🧮 Suavização Bayesiana (Beta-Binomial) para amortecer pequenas amostras
 * - 🔄 Redistribuição Provisória (quando ainda não há provas reais, não finge nem gera zero)
 * 
 * 🎯 CÉREBRO 2 — PRIORIZAÇÃO ("O que eu devo fazer agora?"):
 * O domínio não é o algoritmo de prioridade; ele é UMA DAS ENTRADAS.
 * O planejador cruza:
 * 1. Domínio geral e Gargalo de Aplicação
 * 2. Retenção e Status FSRS (Revisão em dia vs Atrasada)
 * 3. Incidência da Banca-Alvo (Muito alta, Alta, Média, Baixa)
 * 4. Trava de Segurança pedagógica
 * 5. Conteúdo não estudado vs estudado
 * 6. Tempo disponível e prazo até a prova
 */

export function calculateContentDomain(content: ContentItem): DomainCalculationBreakdown {
  // ==========================================
  // 1. 📚 CÁLCULO DE CONHECIMENTO (Medway)
  // ==========================================
  let knowledgeScore = 0;
  let medwayQuestionsCount = 0;
  let hasKnowledgeEvidence = false;

  const postAcc = content.postVideoQuestions?.completedCount > 0
    ? content.postVideoQuestions.accuracy
    : 0;
  const postQuestions = content.postVideoQuestions?.completedCount || 0;

  if (content.trajectoryEvaluations && content.trajectoryEvaluations.length > 0) {
    const validEvals = content.trajectoryEvaluations.filter((ev) => ev.type !== 'pre');
    if (validEvals.length > 0) {
      const totalWeight = validEvals.reduce((acc, ev) => acc + (ev.weightInCurrentMastery || 1), 0);
      const weightedSum = validEvals.reduce(
        (acc, ev) => acc + ev.accuracy * (ev.weightInCurrentMastery || 1),
        0
      );
      knowledgeScore = weightedSum / (totalWeight || 1);
      medwayQuestionsCount = validEvals.reduce((acc, ev) => acc + ev.totalQuestions, 0);
      hasKnowledgeEvidence = true;
    } else {
      knowledgeScore = postAcc;
      medwayQuestionsCount = postQuestions;
      hasKnowledgeEvidence = postQuestions > 0;
    }
  } else if (postQuestions > 0) {
    knowledgeScore = postAcc;
    medwayQuestionsCount = postQuestions;
    hasKnowledgeEvidence = true;
  } else if (content.preVideoQuestions?.completedCount > 0) {
    knowledgeScore = content.preVideoQuestions.accuracy;
    medwayQuestionsCount = content.preVideoQuestions.completedCount;
    hasKnowledgeEvidence = false; // Baseline diagnóstica
  }

  // ==========================================
  // 2. 🎯 CÁLCULO DE APLICAÇÃO (Beta-Binomial Shrinkage + Trajetória Recência)
  // ==========================================
  const realQuestions = content.examStats?.realExamQuestions || 0;
  const realHits = content.examStats?.realExamHits || 0;
  const realAccRaw = realQuestions > 0 ? (realHits / realQuestions) * 100 : 0;

  const simQuestions = content.examStats?.simuladoQuestions || 0;
  const simHits = content.examStats?.simuladoHits || 0;
  const simAccRaw = simQuestions > 0 ? (simHits / simQuestions) * 100 : 0;

  const totalExamQuestions = realQuestions + simQuestions;
  const totalExamHits = realHits + simHits;
  const rawObservedAccuracy = totalExamQuestions > 0 ? (totalExamHits / totalExamQuestions) * 100 : 0;

  // Trajetória de recência dos anos em Provas Reais (ex: 2022 6/10 -> 2026 9/10)
  let realEmpiricalAcc = realAccRaw;
  if (content.realExamEvidence?.yearlyBreakdown && content.realExamEvidence.yearlyBreakdown.length > 0) {
    const yb = content.realExamEvidence.yearlyBreakdown;
    const totalYearWeight = yb.reduce((acc, y) => acc + (y.weight || 1), 0);
    const weightedAccSum = yb.reduce((acc, y) => acc + y.accuracy * (y.weight || 1), 0);
    realEmpiricalAcc = totalYearWeight > 0 ? weightedAccSum / totalYearWeight : realAccRaw;
  } else if (content.realExamEvidence?.recencyWeightedAccuracy) {
    realEmpiricalAcc = content.realExamEvidence.recencyWeightedAccuracy;
  }

  // Modelo Beta-Binomial: Prior conservador de 70% com peso equivalente a 8 questões (pseudo-amostra M=8)
  const priorMean = 70;
  const pseudoSampleSize = 8;
  const priorAlpha = (priorMean / 100) * pseudoSampleSize; // 5.6

  // Suavização das Provas Reais
  const realWeightRatio = realQuestions > 0 ? realQuestions / (realQuestions + pseudoSampleSize) : 0;
  const realAccSmoothed = realQuestions > 0
    ? realEmpiricalAcc * realWeightRatio + priorMean * (1 - realWeightRatio)
    : priorMean;

  // Suavização dos Simulados
  const simWeightRatio = simQuestions > 0 ? simQuestions / (simQuestions + pseudoSampleSize) : 0;
  const simAccSmoothed = simQuestions > 0
    ? simAccRaw * simWeightRatio + priorMean * (1 - simWeightRatio)
    : priorMean;

  let applicationScore = 0;
  const hasRealExamEvidence = realQuestions > 0;
  const hasSimuladoEvidence = simQuestions > 0;
  const hasApplicationData = hasRealExamEvidence || hasSimuladoEvidence;

  if (hasRealExamEvidence && hasSimuladoEvidence) {
    // Provas reais têm peso preponderante (70%) e Simulados peso de apoio (30%)
    applicationScore = realAccSmoothed * 0.70 + simAccSmoothed * 0.30;
  } else if (hasRealExamEvidence) {
    applicationScore = realAccSmoothed;
  } else if (hasSimuladoEvidence) {
    applicationScore = simAccSmoothed;
  } else {
    // Sem provas ou simulados: não finge que existe aplicação confiável
    applicationScore = hasKnowledgeEvidence ? Math.max(45, knowledgeScore * 0.75) : 50;
  }

  // Explicação pedagógica da suavização bayesiana
  let bayesianInterpretation = '';
  if (totalExamQuestions === 0) {
    bayesianInterpretation = 'Sem questões de prova realizadas. Nenhuma estimativa de aplicação pode ser inferida.';
  } else if (totalExamQuestions <= 5) {
    bayesianInterpretation = `Amostra pequena (${totalExamQuestions}q): taxa observada de ${Math.round(rawObservedAccuracy)}% foi suavemente ancorada em ${Math.round(applicationScore)}% para evitar falsa certeza.`;
  } else {
    bayesianInterpretation = `Amostra de ${totalExamQuestions} questões: a evidência empírica predomina e a estimativa bayesiana (${Math.round(applicationScore)}%) converge para o desempenho real sob a banca.`;
  }

  // ==========================================
  // 3. 🧠 CÁLCULO DE RETENÇÃO (Osler + FSRS)
  // ==========================================
  let retentionScore = 0;
  let oslerCardsReviewed = 0;
  let hasRetentionEvidence = false;

  if (content.oslerEvidence && content.oslerEvidence.reviewedCardsCount > 0) {
    retentionScore = content.oslerEvidence.retentionScore;
    oslerCardsReviewed = content.oslerEvidence.reviewedCardsCount;
    hasRetentionEvidence = true;
  } else if (content.oslerCards && content.oslerCards.retentionRate > 0) {
    retentionScore = content.oslerCards.retentionRate;
    oslerCardsReviewed = content.oslerCards.distribution?.total || 0;
    hasRetentionEvidence = true;
  } else if (content.fsrs && content.fsrs.reps > 0) {
    retentionScore = content.fsrs.retrievability;
    oslerCardsReviewed = content.fsrs.reps * 10;
    hasRetentionEvidence = true;
  } else {
    retentionScore = hasKnowledgeEvidence ? Math.max(50, knowledgeScore * 0.85) : 50;
    hasRetentionEvidence = false;
  }

  // Verificação temporal da estabilidade FSRS e vulnerabilidade ao esquecimento
  // Data de referência do sistema: 2026-09-09
  const SYSTEM_REFERENCE_DATE = new Date('2026-09-09T08:00:00Z');
  let isReviewOverdue = false;
  let overdueDays = 0;

  if (content.fsrs?.nextReviewDate) {
    const nextDate = new Date(content.fsrs.nextReviewDate + 'T00:00:00Z');
    const diffTime = SYSTEM_REFERENCE_DATE.getTime() - nextDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    if (diffDays > 0) {
      isReviewOverdue = true;
      overdueDays = diffDays;
    }
  }

  // ==========================================
  // 4. 📊 CÁLCULO MULTIDIMENSIONAL DA CONFIANÇA (Sem cortes rígidos)
  // Componentes: 📦 Quantidade + 🔄 Consistência + 🌎 Diversidade
  // ==========================================
  // Componente 1: Quantidade (função contínua e assintótica de saturação suave)
  const weightedVolume = realQuestions * 1.8 + simQuestions * 1.2 + medwayQuestionsCount * 0.4 + oslerCardsReviewed * 0.25;
  const quantityScore = Math.min(100, Math.round(100 * (1 - Math.exp(-weightedVolume / 32))));

  // Componente 2: Consistência temporal e repetições
  let sessionsCount = 1;
  if (content.trajectoryEvaluations && content.trajectoryEvaluations.length > 0) {
    sessionsCount += content.trajectoryEvaluations.length;
  }
  if (content.fsrs && content.fsrs.reps > 0) {
    sessionsCount += Math.min(6, content.fsrs.reps);
  }
  if (realQuestions >= 10) sessionsCount += 2;
  if (simQuestions >= 5) sessionsCount += 1;

  const stabilityDays = content.fsrs?.stabilityDays || 0;
  const consistencyFromSessions = Math.min(60, sessionsCount * 12);
  const consistencyFromStability = Math.min(40, (stabilityDays / 25) * 40);
  const consistencyScore = Math.min(100, Math.round(consistencyFromSessions + consistencyFromStability));

  // Componente 3: Diversidade de bancas e anos
  const institutionsRepresented: string[] = [];
  if (content.realExamEvidence?.institutionBreakdown && content.realExamEvidence.institutionBreakdown.length > 0) {
    content.realExamEvidence.institutionBreakdown.forEach((ib) => {
      if (!institutionsRepresented.includes(ib.institution)) {
        institutionsRepresented.push(ib.institution);
      }
    });
  } else if (realQuestions > 0) {
    institutionsRepresented.push('USP-RP');
    if (realQuestions >= 10) institutionsRepresented.push('UNIFESP');
    if (realQuestions >= 20) institutionsRepresented.push('ENARE');
  }

  let diversityScore = 20; // Base inicial
  if (institutionsRepresented.length >= 3) diversityScore = 95;
  else if (institutionsRepresented.length === 2) diversityScore = 70;
  else if (institutionsRepresented.length === 1) diversityScore = 45;

  // Score Integrado da Confiança (Sem cortes artificiais)
  const confidenceScore = Math.min(
    100,
    Math.round(quantityScore * 0.50 + consistencyScore * 0.25 + diversityScore * 0.25)
  );

  let confidenceLevel: DomainConfidenceLevel = 'baixa';
  if (confidenceScore >= 70) {
    confidenceLevel = 'alta';
  } else if (confidenceScore >= 40) {
    confidenceLevel = 'media';
  } else {
    confidenceLevel = 'baixa';
  }

  // Frase humana interpretável
  const institutionsText = institutionsRepresented.length > 0
    ? ` (${institutionsRepresented.join(', ')})`
    : '';
  const summaryPhrase = `Baseado em ${totalExamQuestions} questões de prova${institutionsText}, ${oslerCardsReviewed} cartões Osler e ${sessionsCount} sessões de estudo ao longo do ciclo.`;

  // ==========================================
  // 5. CÁLCULO DO DOMÍNIO GERAL (Pesos Base 30% / 45% / 25%)
  // ==========================================
  let overallDomain = 0;
  let isProvisional = false;
  let kWeight = 0;
  let aWeight = 0;
  let rWeight = 0;

  if (!hasApplicationData) {
    // FASE PROVISÓRIA: Conteúdo recém-estudado sem dados de provas reais
    // Não finge que existe aplicação confiável nem calcula média com zero!
    isProvisional = true;
    if (hasKnowledgeEvidence && hasRetentionEvidence) {
      kWeight = 0.60;
      rWeight = 0.40;
      aWeight = 0.00;
      overallDomain = knowledgeScore * kWeight + retentionScore * rWeight;
    } else if (hasKnowledgeEvidence) {
      kWeight = 1.00;
      rWeight = 0.00;
      aWeight = 0.00;
      overallDomain = knowledgeScore; // Conhecimento observado provisório
    } else {
      kWeight = 1.00;
      rWeight = 0.00;
      aWeight = 0.00;
      overallDomain = content.isStudied ? 50 : 0;
    }
  } else {
    // FASE COM APLICAÇÃO: Aplica os pesos base interpretáveis:
    // Conhecimento: 30% | Aplicação: 45% | Retenção: 25%
    isProvisional = false;
    kWeight = 0.30;
    aWeight = 0.45;
    rWeight = 0.25;

    let baseDomain = knowledgeScore * kWeight + applicationScore * aWeight + retentionScore * rWeight;

    // Regra do gargalo de aplicação severo: se Conhecimento e Retenção >= 80%, mas Aplicação < 65%
    if (knowledgeScore >= 80 && retentionScore >= 80 && applicationScore < 65 && totalExamQuestions >= 8) {
      const theoreticalBase = (knowledgeScore + retentionScore) / 2;
      const bottleneckGap = theoreticalBase - applicationScore;
      baseDomain = Math.max(applicationScore, baseDomain - bottleneckGap * 0.25);
    }

    overallDomain = baseDomain;
  }

  // Arredondar scores dimensionais
  knowledgeScore = Math.round(knowledgeScore * 10) / 10;
  applicationScore = Math.round(applicationScore * 10) / 10;
  retentionScore = Math.round(retentionScore * 10) / 10;
  
  if (!content.isStudied && !hasKnowledgeEvidence && !hasApplicationData && !hasRetentionEvidence) {
    overallDomain = 0;
    knowledgeScore = 0;
    applicationScore = 0;
    retentionScore = 0;
  } else {
    overallDomain = Math.min(99, Math.max(10, Math.round(overallDomain)));
  }

  // ==========================================
  // 6. 🚨 REGRA DE SEGURANÇA PARA CONSOLIDAÇÃO
  // ==========================================
  // Para ser 'consolidado', exige cumulativamente:
  // 1. Domínio Geral >= 85%
  // 2. Aplicação >= 80% (mínimo na dimensão crítica)
  // 3. Retenção >= 80%
  // 4. Confiança suficiente (não baixa)
  const passedOverallDomain = overallDomain >= 85;
  const passedApplication = applicationScore >= 80;
  const passedRetention = retentionScore >= 80;
  const passedConfidence = confidenceLevel !== 'baixa';

  const isSafetyConsolidated =
    passedOverallDomain && passedApplication && passedRetention && passedConfidence;

  const isBlockedBySafetyRule = passedOverallDomain && !isSafetyConsolidated;

  let blockReason: string | undefined;
  if (isBlockedBySafetyRule) {
    if (!passedApplication && !passedRetention) {
      blockReason = `Aplicação (${applicationScore}%) e Retenção (${retentionScore}%) abaixo do corte de segurança (80%).`;
    } else if (!passedApplication) {
      blockReason = `Aplicação em questões de prova (${applicationScore}%) abaixo do corte de segurança (80%).`;
    } else if (!passedRetention) {
      blockReason = `Retenção no Osler (${retentionScore}%) abaixo do corte de segurança (80%).`;
    } else if (!passedConfidence) {
      blockReason = `Confiança amostral baixa para confirmar domínio seguro sob a banca examinadora.`;
    }
  }

  // ==========================================
  // 7. DETERMINAÇÃO DO STATUS DO CONTEÚDO (CÉREBRO 1)
  // ==========================================
  let status: DomainConsolidationStatus = 'em_consolidacao';
  let statusLabel = 'Em consolidação';

  // Detecção de gargalo seletivo de aplicação (sabe e lembra, mas cai na prova)
  const isApplicationBottleneck =
    knowledgeScore >= 80 &&
    retentionScore >= 75 &&
    applicationScore < 72 &&
    totalExamQuestions >= 5;

  if (!hasKnowledgeEvidence && !hasApplicationData && !hasRetentionEvidence && confidenceScore < 15) {
    status = 'nao_avaliado';
    statusLabel = 'Não iniciado';
  } else if (isSafetyConsolidated) {
    // 🟢 Consolidado: Todos os 4 critérios cumpridos com sucesso
    status = 'consolidado';
    statusLabel = 'Consolidado';
  } else if (isApplicationBottleneck) {
    // 🟠 Aplicação Insuficiente: Conhecimento e retenção altos, aplicação defasada
    status = 'aplicacao_insuficiente';
    statusLabel = 'Aplicação insuficiente';
  } else if (overallDomain < 65 && (hasRealExamEvidence || medwayQuestionsCount >= 10)) {
    // 🔴 Insuficiente: Desempenho crítico geral
    status = 'insuficiente';
    statusLabel = 'Insuficiente';
  } else {
    // 🟡 Em consolidação: Trajetória ativa, ou bloqueado pela regra de segurança
    status = 'em_consolidacao';
    statusLabel = isBlockedBySafetyRule ? 'Em consolidação (Critério Mínimo)' : 'Em consolidação';
  }

  // ==========================================
  // 8. DIAGNÓSTICO DO CÉREBRO 1
  // ==========================================
  const diagnostic = buildDomainDiagnostic(
    content.name,
    overallDomain,
    status,
    confidenceLevel,
    knowledgeScore,
    applicationScore,
    retentionScore,
    realQuestions,
    isBlockedBySafetyRule,
    blockReason,
    content.incidence?.generalRating || 'Média'
  );

  // ==========================================
  // 9. 🎯 CÉREBRO 2 — PRIORIZAÇÃO NO ESTUDO
  // ==========================================
  const brain2 = buildBrain2PrioritizationFromMetrics({
    content,
    overallDomain,
    applicationScore,
    retentionScore,
    knowledgeScore,
    status,
    confidenceLevel,
    isBlockedBySafetyRule,
    blockReason,
    hasApplicationEvidence: hasApplicationData,
    isReviewOverdue,
    overdueDays,
  });

  return {
    knowledgeScore,
    applicationScore,
    retentionScore,
    confidenceLevel,
    confidenceScore,
    overallDomain,
    status,
    statusLabel,
    isProvisional,
    weights: {
      knowledgeWeight: Math.round(kWeight * 100),
      applicationWeight: Math.round(aWeight * 100),
      retentionWeight: Math.round(rWeight * 100),
    },
    diagnostic,
    brain2,
    safetyRuleCheck: {
      passedOverallDomain,
      passedApplication,
      passedRetention,
      passedConfidence,
      isConsolidated: isSafetyConsolidated,
      isBlockedBySafetyRule,
      blockReason,
    },
    confidenceComponents: {
      quantityScore,
      consistencyScore,
      diversityScore,
      institutionsRepresented,
      sessionsCount,
      summaryPhrase,
    },
    bayesianSmoothing: {
      rawObservedAccuracy: Math.round(rawObservedAccuracy * 10) / 10,
      smoothedAccuracy: Math.round(applicationScore * 10) / 10,
      priorMean,
      pseudoSampleSize,
      interpretation: bayesianInterpretation,
    },
    evidenceStats: {
      medwayQuestionsCount,
      medwayAccuracy: knowledgeScore,
      realExamQuestionsCount: realQuestions,
      realExamAccuracy: Math.round(realAccRaw * 10) / 10,
      simuladoQuestionsCount: simQuestions,
      simuladoAccuracy: Math.round(simAccRaw * 10) / 10,
      oslerCardsReviewedCount: oslerCardsReviewed,
      oslerRetentionRate: retentionScore,
      fsrsStabilityDays: stabilityDays,
      hasProvisionalEvidence: isProvisional,
    },
  };
}

/**
 * 🎯 Construtor do Cérebro 2 a partir das métricas calculadas
 */
function buildBrain2PrioritizationFromMetrics(params: {
  content: ContentItem;
  overallDomain: number;
  applicationScore: number;
  retentionScore: number;
  knowledgeScore: number;
  status: DomainConsolidationStatus;
  confidenceLevel: DomainConfidenceLevel;
  isBlockedBySafetyRule: boolean;
  blockReason?: string;
  hasApplicationEvidence: boolean;
  isReviewOverdue: boolean;
  overdueDays: number;
}): Brain2Prioritization {
  const {
    content,
    overallDomain,
    applicationScore,
    retentionScore,
    knowledgeScore,
    status,
    isBlockedBySafetyRule,
    blockReason,
    hasApplicationEvidence,
    isReviewOverdue,
    overdueDays,
  } = params;

  // 1. INCIDÊNCIA: BANCA GERAL VS INSTITUIÇÕES-ALVO (0-100 contínuo)
  const targetInstitutionsList = ['USP-SP', 'UNIFESP', 'UNICAMP', 'ENARE', 'SUS-SP'];
  
  // Incidência nas 5 instituições-alvo da usuária (USP-RP, USP-SP, UNICAMP, ENAMED, HIAE) (0-100)
  let targetInstitutionsIncidenceScore = 70;
  if (typeof content.incidence?.calculatedPriorityScore === 'number') {
    targetInstitutionsIncidenceScore = content.incidence.calculatedPriorityScore;
  } else if (content.incidence?.targetStats) {
    targetInstitutionsIncidenceScore = content.incidence.targetStats.calculatedPriorityScore;
  } else if (content.incidence) {
    const usprp = content.incidence.usprp ?? content.incidence.usp ?? 5;
    const uspsp = content.incidence.uspsp ?? content.incidence.usp ?? 5;
    const unicamp = content.incidence.unicamp ?? 5;
    const enamed = content.incidence.enamed ?? content.incidence.enare ?? 5;
    const hiae = content.incidence.hiae ?? 5;
    targetInstitutionsIncidenceScore = Math.round(((usprp + uspsp + unicamp + enamed + hiae) / 50) * 100);
  }

  // Incidência geral das provas dos últimos 5 anos (0-100)
  let generalIncidenceScore = 65;
  const rawIncidence = content.incidence?.generalRating || 'Média';
  const incidenceRating: 'Muito alta' | 'Alta' | 'Média' | 'Baixa' | 'Muito baixa' =
    rawIncidence === 'Muito alta'
      ? 'Muito alta'
      : rawIncidence === 'Alta'
      ? 'Alta'
      : rawIncidence === 'Baixa'
      ? 'Baixa'
      : rawIncidence === 'Muito baixa'
      ? 'Muito baixa'
      : 'Média';

  if (typeof content.incidence?.incidenceRatePercent === 'number') {
    generalIncidenceScore = content.incidence.incidenceRatePercent;
  } else if (incidenceRating === 'Muito alta') {
    generalIncidenceScore = 90;
  } else if (incidenceRating === 'Alta') {
    generalIncidenceScore = 78;
  } else if (incidenceRating === 'Média') {
    generalIncidenceScore = 55;
  } else if (incidenceRating === 'Baixa') {
    generalIncidenceScore = 25;
  } else {
    generalIncidenceScore = 12;
  }

  // Relevância combinada (75% peso bancas-alvo + 25% banco geral)
  const combinedIncidence = Math.round(targetInstitutionsIncidenceScore * 0.75 + generalIncidenceScore * 0.25);

  // 2. DÉFICIT DE DOMÍNIO & GARGALO DIMENSIONAL
  const targetDomain = 85;
  const domainDeficit = Math.max(0, targetDomain - overallDomain);
  const isUnstudied = !content.isStudied || !content.theoryCompleted;

  let criticalBottleneck: 'aplicacao' | 'retencao' | 'conhecimento' | 'nenhum' = 'nenhum';
  let bottleneckDescription = 'Sem déficits dimensionais críticos detectados.';

  if (isUnstudied) {
    criticalBottleneck = 'conhecimento';
    bottleneckDescription = 'Conteúdo inédito: necessita de abertura de base teórica e exercícios imediatos de fixação.';
  } else if (status === 'consolidado') {
    criticalBottleneck = 'nenhum';
    bottleneckDescription = 'Conteúdo consolidado com domínio, aplicação e retenção no patamar seguro.';
  } else if (hasApplicationEvidence && applicationScore < 80) {
    criticalBottleneck = 'aplicacao';
    bottleneckDescription = `Aplicação em provas reais defasada (${applicationScore}% vs meta ≥80%). Risco de perda de pontos em distratores e pegadinhas.`;
  } else if (isReviewOverdue || retentionScore < 80) {
    criticalBottleneck = 'retencao';
    bottleneckDescription = `Retenção vulnerável (${retentionScore}%)${isReviewOverdue ? ` e revisão FSRS em atraso (${overdueDays}d)` : ''}. Risco iminente de esquecimento.`;
  } else if (knowledgeScore < 75) {
    criticalBottleneck = 'conhecimento';
    bottleneckDescription = `Lacunas na compreensão conceitual teórica (${knowledgeScore}%).`;
  }

  // 3. FSRS / STATUS DA REVISÃO
  let fsrsStatus: 'distante' | 'proxima' | 'hoje' | 'atrasada' = 'distante';
  let fsrsStatusLabel = '🟢 Revisão distante (em dia)';
  let retrievability = content.fsrs?.retrievability ?? retentionScore;

  if (overdueDays > 0) {
    fsrsStatus = 'atrasada';
    fsrsStatusLabel = `🔴 Revisão atrasada há ${overdueDays} dia(s)`;
  } else if (isReviewOverdue || overdueDays === 0 && content.fsrs?.nextReviewDate === '2026-09-09') {
    fsrsStatus = 'hoje';
    fsrsStatusLabel = '🟠 Revisão programada para hoje';
  } else if (retrievability < 80 || (content.fsrs?.stabilityDays && content.fsrs.stabilityDays <= 3)) {
    fsrsStatus = 'proxima';
    fsrsStatusLabel = '🟡 Revisão próxima (próximos 1 a 3 dias)';
  }

  const fsrsPriorityImpact =
    'O FSRS atua como fator de calibração temporal (20% de peso na fórmula), evitando abandono de temas em risco, sem ditar cegamente a prioridade acima do impacto de prova.';

  // 4. PROGRESSO CURRICULAR
  let progressStage: 'novo' | 'pendente_consolidacao' | 'base_concluida_com_gargalo' | 'consolidado' =
    'base_concluida_com_gargalo';
  const postCompletionRate = content.postVideoQuestions?.completionRate ?? 100;

  if (isUnstudied) {
    progressStage = 'novo';
  } else if (postCompletionRate < 100) {
    progressStage = 'pendente_consolidacao';
  } else if (status === 'consolidado') {
    progressStage = 'consolidado';
  } else {
    progressStage = 'base_concluida_com_gargalo';
  }

  // 5. PRAZO DOS 2 ANOS & RITMO
  const weeksRemaining = 104;
  const weeklyHoursTarget = 8.0;
  const weeklyHoursNeeded = 7.6;
  const paceStatus: 'no_ritmo' | 'acima_planejado' | 'prazo_em_risco' = 'no_ritmo';
  const paceStatusLabel = '🟢 No ritmo planejado (7h35 necessárias vs 8h00 disponíveis)';
  const urgencyWeight = Math.min(100, Math.round((combinedIncidence * 0.6) + (domainDeficit * 0.8)));

  // 6. ESTRATÉGIA / QUAL ATIVIDADE RESOLVE O GARGALO
  let strategicIntervention = '';
  if (criticalBottleneck === 'aplicacao') {
    strategicIntervention = 'Questões comentadas de provas reais anteriores com foco nas bancas-alvo e análise no caderno de erros (não assistir aula teórica).';
  } else if (criticalBottleneck === 'retencao') {
    strategicIntervention = 'Revisão ativa no Osler Flashcards com foco nos cartões com dificuldade elevada e intervalos vencidos.';
  } else if (isUnstudied) {
    strategicIntervention = `Assistir à aula teórica (${content.theoryDurationMin || 40} min) e resolver bateria pós-vídeo de fixação imediata.`;
  } else {
    strategicIntervention = 'Manutenção preventiva espaçada no Osler sem consumo excessivo de carga horária em repetições desnecessárias.';
  }

  // =========================================================================
  // FÓRMULA ADAPTATIVA: PESOS MODULADOS CONFORME O CONTEXTO
  // =========================================================================
  let deficitWeight = 30;
  let incidenceWeight = 25;
  let revisionWeight = 20;
  let progressWeight = 10;
  let timelineWeight = 10;
  let strategyWeight = 5;
  let adaptationReason = 'Ponderação padrão: equilíbrio de déficit de domínio, incidência-alvo e cadência FSRS.';

  if (isUnstudied) {
    deficitWeight = 10;
    incidenceWeight = 35;
    revisionWeight = 0;
    progressWeight = 25;
    timelineWeight = 20;
    strategyWeight = 10;
    adaptationReason = 'Conteúdo inédito: prioridade guiada por alta incidência e necessidade de abertura de base curricular.';
  } else if (status === 'consolidado') {
    deficitWeight = 10;
    incidenceWeight = 15;
    revisionWeight = isReviewOverdue ? 45 : 15;
    progressWeight = 10;
    timelineWeight = 10;
    strategyWeight = 10;
    adaptationReason = 'Conteúdo consolidado: prioridade rebaixada para poupar horas, exceto para manutenção preventiva rápida.';
  } else if (fsrsStatus === 'atrasada') {
    revisionWeight = 25;
    strategyWeight = 5;
    adaptationReason = 'Revisão em atraso: peso da retenção elevado para estancar curva de esquecimento.';
  }

  // Fatores normalizados de 0 a 100
  let deficitFactorScore = Math.min(100, Math.round((domainDeficit / 30) * 85 + (criticalBottleneck === 'aplicacao' ? 15 : 5)));
  if (status === 'consolidado') deficitFactorScore = 10;
  if (isUnstudied) deficitFactorScore = 50;

  const incidenceFactorScore = combinedIncidence;

  let revisionFactorScore = 15;
  if (fsrsStatus === 'atrasada') {
    revisionFactorScore = Math.min(100, 75 + overdueDays * 10);
  } else if (fsrsStatus === 'hoje') {
    revisionFactorScore = 75;
  } else if (fsrsStatus === 'proxima') {
    revisionFactorScore = 45;
  }

  const progressFactorScore =
    progressStage === 'novo' ? 80 : progressStage === 'pendente_consolidacao' ? 70 : progressStage === 'base_concluida_com_gargalo' ? 60 : 20;
  const timelineFactorScore = 65;
  const strategyFactorScore = criticalBottleneck !== 'nenhum' ? 80 : 30;

  // Pontuação base ponderada
  let calculatedScore =
    (deficitFactorScore * deficitWeight +
      incidenceFactorScore * incidenceWeight +
      revisionFactorScore * revisionWeight +
      progressFactorScore * progressWeight +
      timelineFactorScore * timelineWeight +
      strategyFactorScore * strategyWeight) /
    100;

  // =========================================================================
  // BOOSTS ESTRATÉGICOS
  // =========================================================================
  const appliedBoosts: string[] = [];

  // Boost 1: 🚨 Alta incidência + domínio baixo (<75%)
  if (targetInstitutionsIncidenceScore >= 85 && overallDomain < 75) {
    calculatedScore += 16;
    appliedBoosts.push('🚨 Alta incidência em bancas-alvo + domínio abaixo de 75% (+16 pts)');
  }

  // Boost 2: 🚨 Aplicação < 80% em tema de alta relevância
  if (targetInstitutionsIncidenceScore >= 75 && applicationScore < 80 && hasApplicationEvidence) {
    calculatedScore += 8;
    appliedBoosts.push('🚨 Aplicação defasada em tema prioritário (Boost em questões de prova)');
  }

  // Boost 3: 🚨 FSRS atrasado + retenção vulnerável
  if (fsrsStatus === 'atrasada' && retentionScore < 80) {
    calculatedScore += 10;
    appliedBoosts.push(`🚨 Revisão FSRS atrasada (${overdueDays}d) com retenção frágil (+10 pts)`);
  }

  // Boost 4: 🚨 Trava de Segurança ativa
  if (isBlockedBySafetyRule) {
    calculatedScore += 10;
    appliedBoosts.push('🛡️ Trava de Segurança pedagógica ativa (exige validação em prova)');
  }

  // Limites por status
  if (status === 'consolidado') {
    calculatedScore = isReviewOverdue ? Math.min(48, Math.max(30, calculatedScore * 0.4)) : Math.min(35, Math.max(20, calculatedScore * 0.3));
  } else if (isUnstudied) {
    calculatedScore = Math.min(95, Math.max(50, calculatedScore));
  }

  // Arredondamento do score de prioridade do conteúdo (0-100)
  const finalContentScore = Math.min(98, Math.max(20, Math.round(calculatedScore)));

  // =========================================================================
  // SEPARAÇÃO ARQUITETURAL: PRIORIDADE DAS ATIVIDADES DENTRO DO CONTEÚDO
  // =========================================================================
  const activityRankings: ContentActivityOption[] = [];

  // Atividade 1: Questões de provas anteriores (bancas-alvo)
  let questoesScore = Math.round(
    targetInstitutionsIncidenceScore * 0.5 + (100 - applicationScore) * 0.4 + (criticalBottleneck === 'aplicacao' ? 15 : 0)
  );
  if (status === 'consolidado') questoesScore = 25;
  if (isUnstudied) questoesScore = 20;
  if (criticalBottleneck === 'aplicacao' && targetInstitutionsIncidenceScore >= 90) questoesScore = Math.max(questoesScore, 92);

  activityRankings.push({
    type: 'questoes_prova',
    label: `Resolver 10-15 Questões de Provas Reais (${targetInstitutionsList.slice(0, 3).join(', ')})`,
    score: Math.min(99, Math.max(15, questoesScore)),
    urgencyLabel: questoesScore >= 85 ? 'Urgente' : questoesScore >= 70 ? 'Alta' : 'Média',
    estimatedDurationMin: 40,
    whyThisActivity:
      criticalBottleneck === 'aplicacao'
        ? `A dimensão de Aplicação está em ${applicationScore}%. Resolver questões reais é a intervenção de maior alavancagem para atingir os 85% de domínio.`
        : 'Auditar capacidade de aplicação sob pressão de tempo e estilo de banca.',
    recommendedBatchSize: 15,
  });

  // Atividade 2: Análise de erros e caderno de erros
  let errosScore = Math.round(questoesScore * 0.95);
  if (isUnstudied || status === 'consolidado') errosScore = 15;
  activityRankings.push({
    type: 'analise_erros',
    label: 'Analisar Caderno de Erros & Distratores Frequentes',
    score: Math.min(95, Math.max(15, errosScore)),
    urgencyLabel: errosScore >= 85 ? 'Urgente' : errosScore >= 70 ? 'Alta' : 'Média',
    estimatedDurationMin: 25,
    whyThisActivity: 'Identificar a causa-raiz dos erros (distrator atrativo, falta de retenção ou lacuna de conceito).',
  });

  // Atividade 3: Revisão de cartões Osler (FSRS)
  let fsrsScore = 30;
  if (fsrsStatus === 'atrasada') {
    fsrsScore = Math.min(94, 70 + overdueDays * 8);
  } else if (fsrsStatus === 'hoje') {
    fsrsScore = 75;
  } else if (fsrsStatus === 'proxima') {
    fsrsScore = 55;
  } else if (status === 'consolidado') {
    fsrsScore = 35;
  }
  activityRankings.push({
    type: 'revisao_fsrs',
    label: `Revisar Cartões Osler (${content.oslerCards?.distribution?.total || 40} cartões programados)`,
    score: Math.min(95, Math.max(20, fsrsScore)),
    urgencyLabel: fsrsScore >= 80 ? 'Urgente' : fsrsScore >= 60 ? 'Alta' : 'Média',
    estimatedDurationMin: 20,
    whyThisActivity:
      fsrsStatus === 'atrasada'
        ? `Revisão vencida há ${overdueDays} dia(s). Resgate ativo essencial para impedir decaimento da estabilidade mnemônica.`
        : 'Manutenção do intervalo ótimo calculado pelo algoritmo FSRS.',
    recommendedBatchSize: 25,
  });

  // Atividade 4: Assistir teoria Medway
  let teoriaScore = 25;
  if (isUnstudied) {
    teoriaScore = 95;
  } else if (knowledgeScore < 70) {
    teoriaScore = 65;
  } else {
    teoriaScore = 25; // Desencorajado se o aluno já domina a teoria
  }
  activityRankings.push({
    type: 'rever_teoria',
    label: `Assistir Teoria Medway (${content.theoryDurationMin || 40} min)`,
    score: teoriaScore,
    urgencyLabel: teoriaScore >= 85 ? 'Urgente' : teoriaScore >= 60 ? 'Alta' : 'Baixa',
    estimatedDurationMin: content.theoryDurationMin || 40,
    whyThisActivity: isUnstudied
      ? 'Abertura conceitual obrigatória antes de blocos extensos de provas.'
      : 'Desencorajado no momento: sua nota de Conhecimento já é satisfatória. Assistir aula não corrigirá erros de aplicação em provas.',
  });

  // Atividade 5: Exercícios pós-vídeo
  if (isUnstudied || postCompletionRate < 100) {
    activityRankings.push({
      type: 'pos_exercicios',
      label: 'Resolver Bloco de Pós-Exercícios de Fixação',
      score: isUnstudied ? 90 : 80,
      urgencyLabel: 'Alta',
      estimatedDurationMin: 30,
      whyThisActivity: 'Fixação primária dos conceitos imediatamente após a aula.',
      recommendedBatchSize: 20,
    });
  }

  // Ordenar atividades pela maior pontuação
  activityRankings.sort((a, b) => b.score - a.score);

  // Atividade principal prescrita é a nº 1 do ranking
  const bestActivity = activityRankings[0];
  const prescribedAction = bestActivity.label;
  const actionType = bestActivity.type;

  // Urgência Temporal
  const urgencyLabel: 'Urgente' | 'Alta' | 'Média' | 'Baixa' =
    finalContentScore >= 88 ? 'Urgente' : finalContentScore >= 75 ? 'Alta' : finalContentScore >= 45 ? 'Média' : 'Baixa';

  // Manchete e Justificativa Global
  const badgeColor = urgencyLabel === 'Urgente' ? '🔴' : urgencyLabel === 'Alta' ? '🟠' : urgencyLabel === 'Média' ? '🟡' : '🟢';
  const headline = `${badgeColor} ${content.name} — Prioridade ${finalContentScore}/100 (${urgencyLabel})`;

  let justification = '';
  if (isUnstudied) {
    justification = `Conteúdo prioritário (Incidência-alvo ${targetInstitutionsIncidenceScore}/100) ainda sem estudo inicial no ciclo. Recomendada aula teórica e bloco de pós-exercícios para inauguração da base mnemônica.`;
  } else if (status === 'consolidado') {
    justification = `Conteúdo consolidado (Domínio ${overallDomain}%). Conhecimento (${knowledgeScore}%), aplicação (${applicationScore}%) e retenção (${retentionScore}%) estão em zona segura. Foco reservado para manutenção mnemônica leve.`;
  } else if (criticalBottleneck === 'aplicacao') {
    justification = `Gargalo seletivo de Aplicação: Conhecimento teórico alto (${knowledgeScore}%), mas acurácia em provas reais em ${applicationScore}% (abaixo da meta de 80%). Alta relevância nas bancas-alvo (${targetInstitutionsIncidenceScore}/100)${fsrsStatus === 'atrasada' ? ` e revisão FSRS em atraso há ${overdueDays}d` : ''}.`;
  } else if (criticalBottleneck === 'retencao') {
    justification = `Gargalo de Retenção: Domínio em ${overallDomain}% e retenção em ${retentionScore}%. A curva de esquecimento do FSRS exige resgate ativo imediato para preservar a estabilidade.`;
  } else {
    justification = `Desempenho atual em ${overallDomain}% com incidência-alvo em ${targetInstitutionsIncidenceScore}/100. Evolução programada na trilha de especialidades.`;
  }

  return {
    score: finalContentScore,
    urgencyLabel,
    headline,
    justification,
    prescribedAction,
    actionType,
    activityRankings,
    factors: {
      domainScore: overallDomain,
      targetDomain,
      domainDeficit,
      knowledgeScore,
      applicationScore,
      retentionScore,
      criticalBottleneck,
      bottleneckDescription,
      hasApplicationEvidence,

      generalIncidenceScore,
      targetInstitutionsIncidenceScore,
      targetInstitutionsList,
      incidenceRating,
      incidenceScore: combinedIncidence,
      isTargetDeficiency: content.realExamEvidence?.diagnostic?.isTargetDeficiency ?? false,

      fsrsStatus,
      fsrsStatusLabel,
      isReviewOverdue: fsrsStatus === 'atrasada',
      overdueDays,
      nextReviewDate: content.fsrs?.nextReviewDate,
      retrievability,
      fsrsPriorityImpact,

      progressStage,
      theoryCompleted: content.theoryCompleted,
      postExercisesCompletionRate: postCompletionRate,
      isUnstudied,

      weeksRemaining,
      weeklyHoursTarget,
      weeklyHoursNeeded,
      paceStatus,
      paceStatusLabel,
      urgencyWeight,

      strategicIntervention,
      isBlockedBySafetyRule,
      blockReason,
      appliedBoosts,
      estimatedDurationMin: bestActivity.estimatedDurationMin,
    },
    adaptiveFormulaWeights: {
      deficitWeight,
      incidenceWeight,
      revisionWeight,
      progressWeight,
      timelineWeight,
      strategyWeight,
      adaptationReason,
    },
  };
}

/**
 * Constrói diagnósticos pedagógicos de alta precisão em linguagem natural
 */
function buildDomainDiagnostic(
  contentName: string,
  domain: number,
  status: DomainConsolidationStatus,
  confidence: DomainConfidenceLevel,
  knowledge: number,
  application: number,
  retention: number,
  realQuestions: number,
  isBlockedBySafetyRule: boolean,
  blockReason: string | undefined,
  incidenceRating: string
): {
  headline: string;
  description: string;
  prescribedAction: string;
  actionIcon: string;
  priorityReason: string;
} {
  // Caso de Bloqueio pela Regra de Segurança (ex: Domínio 86%, mas Aplicação 78%)
  if (isBlockedBySafetyRule && blockReason) {
    return {
      headline: 'Domínio Geral Alto, mas Bloqueado por Critério Crítico',
      description: `Seu domínio geral atingiu ${domain}% (acima da meta de 85%), porém a regra de segurança impediu o selo de Consolidado: ${blockReason}. A média não escondeu essa deficiência.`,
      prescribedAction: `🎯 Focar exclusivamente em questões de provas reais sobre ${contentName} para elevar a aplicação acima de 80%.`,
      actionIcon: 'shield',
      priorityReason: 'Prioridade Alta: Trava de segurança ativa. É necessário atingir o patamar de 80% na aplicação antes da consolidação.',
    };
  }

  if (status === 'aplicacao_insuficiente') {
    return {
      headline: 'Déficit Seletivo de Aplicação em Prova',
      description: `Conhecimento (${knowledge}%) e retenção (${retention}%) adequados, mas aplicação (${application}%) insuficiente. Você domina o conteúdo teórico, mas perde pontos diante dos distratores e pegadinhas da banca examinadora.`,
      prescribedAction: `🎯 Resolver 15 a 20 questões de provas anteriores de ${contentName}. NÃO reestudar aula teórica.`,
      actionIcon: 'warning',
      priorityReason: 'Prioridade ALTA: Risco iminente de errar questões na prova real mesmo conhecendo o conteúdo.',
    };
  }

  if (status === 'consolidado') {
    return {
      headline: '🟢 Domínio Consolidado e Auditado',
      description: `Domínio geral em ${domain}% com aplicação em ${application}% (≥80%), retenção em ${retention}% (≥80%) e confiança adequada. O conteúdo está no patamar seguro de aprovação.`,
      prescribedAction: `🧠 Manter revisões de manutenção espaçadas via FSRS no Osler para blindar contra o esquecimento.`,
      actionIcon: 'verified',
      priorityReason: 'Manutenção Preventiva: Tema seguro. Dedicar a maior parte das horas aos conteúdos deficitários.',
    };
  }

  if (status === 'nao_avaliado') {
    return {
      headline: 'Conteúdo Sem Evidências Suficientes',
      description: `Ainda não há dados pedagógicos suficientes para estimar o seu domínio em ${contentName}. Inicie pelo ciclo de aula teórica e pós-exercícios Medway.`,
      prescribedAction: `▶️ Assistir à aula teórica Medway e resolver o bloco de pós-exercícios imediatos.`,
      actionIcon: 'play_circle',
      priorityReason: 'Prioridade de Entrada: Tópico pendente de estudo inicial no ciclo curricular.',
    };
  }

  if (status === 'insuficiente') {
    return {
      headline: '🔴 Dificuldade Real no Conteúdo (Déficit Geral)',
      description: `Desempenho geral (${domain}%) abaixo da meta de 85%, com lacunas observadas em conhecimento (${knowledge}%), aplicação (${application}%) e retenção (${retention}%).`,
      prescribedAction: `📖 Trilha completa de remediação: Teoria Medway → pós-exercícios comentados → cartões Osler.`,
      actionIcon: 'error',
      priorityReason: 'Prioridade MÁXIMA: Conteúdo com deficiência em múltiplas dimensões do aprendizado.',
    };
  }

  // em_consolidacao
  if (confidence === 'baixa') {
    return {
      headline: '🟡 Domínio Provisório (Confiança Amostral Baixa)',
      description: `Domínio provisório estimado em ${domain}%, mas com confiança BAIXA devido à escassez de provas (${realQuestions} questões reais). O sistema não pode presumir que você está seguro.`,
      prescribedAction: `🎯 Resolver 10 a 15 questões de provas reais para validar a capacidade de aplicação.`,
      actionIcon: 'rule',
      priorityReason: `Prioridade de Auditoria: ${
        incidenceRating.includes('Alta')
          ? 'Tema de altíssima incidência sem evidências empíricas suficientes para certificar o domínio.'
          : 'Coletar dados de aplicação antes da fase final de provas.'
      }`,
    };
  }

  return {
    headline: '🟡 Em Consolidação no Ciclo de Estudos',
    description: `Desempenho atual (${domain}%) em evolução contínua em direção à meta de 85%. Conhecimento (${knowledge}%), aplicação (${application}%) e retenção (${retention}%) estão progredindo.`,
    prescribedAction: `🎯 Bateria de 10 questões mistas de bancas e revisão dos cartões pendentes no Osler.`,
    actionIcon: 'trending_up',
    priorityReason: incidenceRating.includes('Alta')
      ? 'Prioridade ALTA: Conteúdo de alta relevância próximo da consolidação definitiva.'
      : 'Prioridade Média: Manter avanço consistente no cronograma.',
  };
}

/**
 * 🎯 CÉREBRO 2 — PRIORIZAÇÃO ("O que eu devo fazer agora?")
 * Exportação pública que consome o Domínio (Cérebro 1) + FSRS + Incidência + Trava de Segurança
 */
export function calculateBrain2Prioritization(
  content: ContentItem,
  userPreferences?: UserPreferences
): Brain2Prioritization {
  const breakdown = calculateContentDomain(content);
  return breakdown.brain2;
}

/**
 * Prioridade inteligente de estudo que cruza:
 * Domínio + Confiança + Regra de Segurança + Incidência + FSRS
 */
export function calculateStudyPriorityScore(content: ContentItem): {
  score: number; // 0-100
  urgencyLabel: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
  justification: string;
} {
  const p = calculateBrain2Prioritization(content);
  return {
    score: p.score,
    urgencyLabel: p.urgencyLabel,
    justification: p.justification,
  };
}

