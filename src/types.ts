export type ViewPath =
  | 'hoje'
  | 'planejamento'
  | 'curriculo'
  | 'desempenho'
  | 'revisoes'
  | 'provas-e-simulados'
  | 'analises'
  | 'configuracoes';

export type ErrorReasonType =
  | 'nao_sabia'
  | 'esqueci'
  | 'interpretacao'
  | 'desatencao'
  | 'entre_duas'
  | 'raciocinio'
  | 'outro';

export interface QuestionAssessment {
  id: string;
  type: 'pre' | 'pos' | 'reavaliacao';
  label: string;
  date: string;
  daysAgoText?: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number; // 0-100%
  gainPoints?: number; // p.p. ganho em relação ao baseline
  weightInCurrentMastery: number; // Peso percentual relativo na estimativa atual
}

export interface OslerBlock {
  id: string;
  title: string;
  specialtyHint?: string;
  cardsTotal: number;
  cardsFacil: number;
  cardsNormal: number;
  cardsDificil: number;
  cardsErros: number;
}

export interface SourceMapping {
  id: string;
  contentId: string; // Conteúdo do currículo Medway (ex: 'c-icc')
  source: 'osler';
  oslerBlockId: string;
  oslerBlockTitle: string;
  relationType: 'associado' | 'secundario';
  createdAt: string;
}

export interface OslerCardReview {
  rating: 'facil' | 'normal' | 'dificil' | 'errado';
  date: string;
  daysAgoText?: string;
  score: number; // 100 | 85 | 70 | 0
  weight: number; // 1.0 | 0.75 | 0.5 | 0.25
}

export interface OslerCardSample {
  id: string;
  prompt: string;
  blockTitle: string;
  reviews: OslerCardReview[];
  calculatedRetention: number; // Ponderado por recência
  stability: 'alta' | 'moderada' | 'baixa';
  lastRating: 'facil' | 'normal' | 'dificil' | 'errado';
}

export interface OslerEvidenceSummary {
  retentionScore: number; // 0-100% (Retenção atual ponderada por qualidade 100/85/70/0 e recência)
  stabilityLevel: 'alta' | 'moderada' | 'baixa';
  stabilityScore: number; // 0-100%
  confidenceLevel: 'alta' | 'moderada' | 'inicial';
  reviewedCardsCount: number;
  totalCardsAvailable: number;
  coveragePercent: number;
  cardDistribution: {
    facil: number;   // 100 pts
    normal: number;  // 85 pts
    dificil: number; // 70 pts
    erros: number;   // 0 pts
    total: number;
  };
  diagnosticAlignment: {
    knowledgeRetention: 'forte' | 'adequada' | 'fragil';
    examApplication: 'forte' | 'adequada' | 'critica';
    isMaskingDeficiency: boolean;
    prescribedAction: string;
  };
  sampleCards?: OslerCardSample[];
}

export interface OslerCardDistribution {
  facil: number;
  normal: number;
  dificil: number;
  errei: number;
  total: number;
}

export interface FSRSMemoryState {
  stabilityDays: number; // S (dias que a memória permanece estável)
  difficulty: number; // D (1 a 10)
  retrievability: number; // R (probabilidade estimada de recordar 0-100%)
  lastReviewDate?: string;
  nextReviewDate?: string;
  reps: number;
  state: 'novo' | 'aprendendo' | 'revisando' | 'reaprendendo';
}

export type IdentificationConfidenceLevel = 'CONFIRMADO' | 'PROVAVEL' | 'PRECISA_CONFIRMACAO';

export interface ExamPdfAuditReport {
  sourceFileName: string;
  fileSizeBytes?: number;
  totalCharactersExtracted: number;
  estimatedPagesCount: number;

  // 1. Identificação da Instituição
  detectedInstitution: string; // ex: 'USP-RP', 'USP-SP', 'UNICAMP', 'ENAMED', 'HIAE' ou 'NÃO CONFIRMADO'
  targetInstitutionKey?: TargetInstitutionKey;
  institutionConfidence: IdentificationConfidenceLevel;
  institutionEvidenceSnippet: string; // Trecho explícito encontrado no documento (capa, cabeçalho, rodapé, edital)
  institutionConflictDetected: boolean;
  institutionConflictDetail?: string;

  // 2. Identificação do Ano da Prova
  detectedYear: number | null;
  yearConfidence: IdentificationConfidenceLevel;
  yearEvidenceSnippet: string; // Trecho comprovando o ano de aplicação
  yearConflictDetected: boolean;
  yearConflictDetail?: string;
  yearDiscrepancyNotes?: {
    examApplicationYear?: number;
    editalPublicationYear?: number;
    academicYear?: number;
    fileUploadYearPrevented?: number;
    explanation: string;
  };

  // 3. Identificação e Numeração das Questões
  totalIdentifiedQuestions: number;
  firstQuestionNumber: number;
  lastQuestionNumber: number;
  sequenceIsComplete: boolean;
  missingQuestionNumbers: number[]; // ex: [4, 47] quando a sequência é quebrada
  unprocessedQuestionNumbers: number[]; // questões marcadas "Questão não processada — revisão necessária"
  splitQuestionsMerged: {
    questionNumber: number;
    startPage: number;
    endPage: number;
    snippet: string;
  }[];
  imageDependentQuestions: {
    questionNumber: number;
    visualType: 'ECG' | 'TC' | 'RX' | 'Fotografia' | 'Tabela' | 'Gráfico' | 'Imagem Ilustrativa' | 'Outro';
    needsVisualReview: boolean;
    description: string;
  }[];
  duplicatedDetections: {
    type: 'capa_duplicada' | 'pagina_duplicada' | 'questao_duplicada' | 'versao_repetida';
    detail: string;
    resolvedAction: string;
  }[];

  // Resumo Global antes da análise
  overallStatus: 'CONFIRMADO' | 'PRECISA_CONFIRMACAO';
  summaryBadgeText: string;
  canAddToOfficialStats: boolean;
  systemRecommendation: string;
}

export type TargetInstitutionKey = 'USP-RP' | 'USP-SP' | 'UNICAMP' | 'ENAMED' | 'HIAE';

export type IncidenceFrequencyTier =
  | 'muito_frequente'
  | 'frequente'
  | 'moderada'
  | 'pouco_frequente'
  | 'raro';

export interface InstitutionFrequencyDetail {
  institution: TargetInstitutionKey;
  questionCount: number;
  rating: 'Muito alta' | 'Alta' | 'Média' | 'Baixa' | 'Rara';
  percentage: number;
}

export interface ContentTargetIncidenceStats {
  contentId: string;
  totalQuestions: number;
  institutions: TargetInstitutionKey[];
  years: number[];
  byInstitution: Record<TargetInstitutionKey, InstitutionFrequencyDetail>;
  yearlyFrequency: Record<number, number>; // ex: { 2021: 2, 2022: 4, 2023: 5, 2024: 7, 2025: 8 }
  recencyWeightedScore: number; // 0-100 ponderado por recência dos últimos 5 anos
  trend: 'subindo' | 'estavel' | 'caindo';
  trendLabel: string; // "↗️ Alta recente", "➡️ Estável", "↘️ Em queda"
  frequencyTier: IncidenceFrequencyTier;
  tierLabel: string; // 'Muito frequente' | 'Frequente' | 'Moderadamente frequente' | 'Pouco frequente' | 'Raro / Não identificado'
  calculatedPriorityScore: number; // 0-100 para o cérebro de priorização
}

export interface ContentIncidenceBySchool {
  usp?: number; // número de questões nos últimos 5 anos
  unifesp?: number;
  ufmg?: number;
  unicamp?: number;
  enare?: number;
  // 5 Instituições-Alvo prioritárias da usuária
  usprp?: number;
  uspsp?: number;
  enamed?: number;
  hiae?: number;
  generalRating: 'Muito alta' | 'Alta' | 'Média' | 'Baixa' | 'Muito baixa';
  calculatedPriorityScore: number; // Calculado pelas bancas-alvo da usuária
  totalAppearancesLast5Years?: number; // ex: 18 aparições
  totalExamsAnalyzed?: number; // ex: 25 provas analisadas
  incidenceRatePercent?: number; // ex: 72% de incidência histórica
  architectureRole?: string; // "Entra na Prioridade/Relevância, NÃO infla o Domínio"
  targetStats?: ContentTargetIncidenceStats;
}

export interface RealExamQuestionRecord {
  id: string;
  institution: string; // ex: 'USP-RP', 'UNIFESP', 'ENARE', 'USP-SP'
  year: number; // ex: 2022, 2024, 2025, 2026
  questionNumber: number;
  statementSnippet: string;
  isCorrect: boolean;
  errorReason?: ErrorReasonType;
  userCorrectionNote?: string;
  recencyWeight: number; // ex: 1.0 (2026), 0.85 (2024), 0.70 (2022)
  isTargetInstitution: boolean;
}

export interface RealExamEvidenceSummary {
  generalAccuracy: number; // Domínio geral: todas as provas reais (ex: 78.0%)
  targetInstitutionsAccuracy: number; // Aplicação nas instituições-alvo (ex: 67.5%)
  recencyWeightedAccuracy: number; // Ponderado pela recência dos anos (detecta declínio recente)
  totalQuestions: number;
  hits: number;
  confidenceLevel: 'alta' | 'moderada' | 'inicial';
  institutionBreakdown: {
    institution: string;
    totalQuestions: number;
    hits: number;
    accuracy: number;
    isTarget: boolean;
  }[];
  yearlyBreakdown: {
    year: number;
    totalQuestions: number;
    hits: number;
    accuracy: number;
    weight: number;
  }[];
  errorReasonBreakdown: Record<ErrorReasonType, number>;
  diagnostic: {
    deficitType: 'conhecimento' | 'aplicacao' | 'atencao_interpretacao' | 'equilibrado';
    headline: string;
    prescribedAction: string;
    isTargetDeficiency: boolean;
  };
  questions: RealExamQuestionRecord[];
}

export interface SimuladoEvidenceSummary {
  integratedAccuracy: number; // Acurácia nas questões deste conteúdo em simulados (ex: 72%)
  weightInApplication: number; // Peso de ~75% da força de uma prova real
  totalQuestions: number;
  hits: number;
  errorReasonBreakdown: Record<ErrorReasonType, number>;
  executionMetrics: {
    avgSecondsPerQuestion: number; // ex: 132s = 2m12s
    earlyQuestionsAccuracy: number;
    lateQuestionsAccuracy: number;
    fatigueDropPercent: number; // ex: -14% nas últimas questões
    paceDiagnosis: string;
  };
  simuladosMapped: {
    simuladoId: string;
    simuladoTitle: string;
    date: string;
    questionsCount: number;
    hitsCount: number;
    accuracy: number;
    globalSimuladoScore: number;
  }[];
}

export interface GlobalSimuladoHistoryItem {
  id: string;
  title: string;
  institution: string;
  date: string;
  totalQuestions: number;
  hits: number;
  scorePercent: number;
  timeSpent: string;
  avgTimePerQuestion: string;
  percentile: string;
  pacingStatus: 'otimo' | 'no_limite' | 'tempo_esgotado';
  fatigueDrop: string;
}

export interface ContentItem {
  id: string;
  areaId: string;
  areaName: string;
  moduloId: string;
  moduloName: string;
  name: string; // ex: "Insuficiência Cardíaca Congestiva (ICC)"
  theoryDurationMin: number; // Duração média do vídeo/teoria Medway
  theoryCompleted: boolean;
  
  // Metadados específicos do Curso Medway
  medwayRowNumber?: number; // Linha da planilha Medway (1 a 236)
  videoLessonsHours?: number; // Videoaulas de 1h
  theoryPdfsCount?: number; // PDFs Teóricos
  preExercisesPdfCount?: number; // PDF Ex. Pré
  postExercisesPdfCount?: number; // PDF Ex. Pós
  oslerTopicsStatus?: string; // Tópicos Flashcards (Osler)
  oslerTopicsList?: string[]; // Lista estruturada de tópicos flashcards Osler correspondentes
  
  // Exercícios pré-vídeo (diagnóstico de entrada / linha de base)
  preVideoQuestions: {
    totalAvailable: number;
    completedCount: number;
    correctCount: number;
    accuracy: number; // 0-100% (Baseline - não penaliza média simples)
    date?: string;
  };

  // Exercícios pós-vídeo (fixação imediata após aula)
  postVideoQuestions: {
    totalAvailable: number;
    completedCount: number;
    correctCount: number;
    accuracy: number; // 0-100% (Consolidação inicial pós-teoria)
    completionRate: number; // 0-100% (Conclusão da atividade)
    date?: string;
  };

  // Ganho de aprendizagem pós-teoria (pontos percentuais: post - pre)
  learningGainPP?: number;

  // Trajetória temporal de avaliações (Pré -> Pós -> Reavaliações com decaimento temporal)
  trajectoryEvaluations?: QuestionAssessment[];
  medwayWeightedAccuracy?: number; // Ponderado por recência
  sampleConfidence?: {
    level: 'alta' | 'media' | 'baixa';
    totalQuestions: number;
    explanation: string;
  };

  // Flashcards Osler & Mapeamento de Fontes
  mappedOslerBlockIds?: string[];
  oslerCards?: {
    distribution: OslerCardDistribution;
    retentionRate: number; // 0-100%
  };
  oslerEvidence?: OslerEvidenceSummary;

  // FSRS Memória
  fsrs: FSRSMemoryState;

  // Provas reais e simulados (dimensão de aplicação e aplicação integrada)
  examStats: {
    realExamQuestions: number;
    realExamHits: number;
    simuladoQuestions: number;
    simuladoHits: number;
  };
  realExamEvidence?: RealExamEvidenceSummary;
  simuladoEvidence?: SimuladoEvidenceSummary;

  // Matriz de incidência nas 5 principais instituições (5 anos de dados)
  incidence: ContentIncidenceBySchool;

  // Domínio estimado pelo cérebro do sistema
  estimatedMastery: number; // 0-100% (Construído pelas evidências)
  targetMastery: number; // 85%

  // Diferenciação: Concluído (estudado) vs Consolidado (dominado >= 85%)
  isStudied: boolean;
  isConsolidated: boolean;
  status: 'Não iniciado' | 'Em consolidação' | 'Dominado' | 'Aplicação insuficiente';
  domainStatus?: DomainConsolidationStatus;
  domainBreakdown?: DomainCalculationBreakdown;
  brain2Prioritization?: Brain2Prioritization;
  lastStudiedDate?: string;
}

export type DomainConfidenceLevel = 'alta' | 'media' | 'baixa';

export type DomainConsolidationStatus =
  | 'consolidado'             // 🟢 Consolidado: Domínio >= 85% + Confiança suficiente
  | 'em_consolidacao'         // 🟡 Em consolidação: Domínio < 85%, evidências ativas
  | 'aplicacao_insuficiente'  // 🟠 Aplicação insuficiente: Conhecimento/Retenção altos, Aplicação defasada
  | 'insuficiente'            // 🔴 Insuficiente: claramente abaixo da meta
  | 'nao_avaliado';           // ⚪ Não avaliado: ainda sem dados suficientes

export type Brain2ActionType =
  | 'questoes_prova'        // Fazer questões de provas anteriores (bancas-alvo)
  | 'analise_erros'         // Analisar erros e caderno de erros
  | 'revisao_fsrs'          // Revisar cartões Osler (resgate ativo)
  | 'rever_teoria'          // Assistir teoria Medway
  | 'pos_exercicios'        // Fazer exercícios pós-aula (fixação imediata)
  | 'pre_exercicios'        // Fazer exercícios pré-aula (diagnóstico de entrada)
  | 'teoria_exercicios'     // Teoria + Exercícios de fixação
  | 'manutencao_espacada';  // Manutenção espaçada (conteúdo já consolidado)

export interface ContentActivityOption {
  type: Brain2ActionType;
  label: string; // ex: "10 Questões de Provas Anteriores (USP, UNIFESP)"
  score: number; // 0-100 (Prioridade desta atividade específica)
  urgencyLabel: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
  estimatedDurationMin: number; // ex: 40 min
  whyThisActivity: string; // Explicação de por que esta atividade resolve o gargalo
  recommendedBatchSize?: number;
}

/**
 * 🎯 CÉREBRO 2 — PRIORIZAÇÃO ("O que eu devo fazer agora?")
 * Transforma dados multidimensionais em resposta simples:
 * Prioridade = Combinação de Necessidade + Impacto + Urgência + Estratégia.
 * 
 * 6 Grandes Grupos de Fatores:
 * 1. 🧠 Déficit de domínio (dimensionado: aplicação vs retenção vs conhecimento)
 * 2. 🎯 Incidência (0-100 contínuo: Geral vs Bancas-Alvo)
 * 3. 🔄 Revisão / FSRS (distante, próxima, hoje, atrasada - sem ditar cegamente)
 * 4. 📚 Progresso curricular (novo, pendente de consolidação, base pronta com gargalo, consolidado)
 * 5. ⏰ Prazo dos 2 anos & Ritmo (semanas restantes, horas necessárias vs disponíveis, urgência progressiva)
 * 6. 📈 Estratégia (qual atividade resolve o problema com maior alavancagem)
 */
export interface Brain2Prioritization {
  score: number; // 0-100 (Score unificado de priorização no estudo)
  urgencyLabel: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
  headline: string; // ex: "🔴 DPOC — Alta prioridade (Urgente)"
  justification: string; // Explicação completa integrando todas as entradas
  prescribedAction: string; // Ação concreta prescrita
  actionType: Brain2ActionType;
  
  // Atividades internas ranqueadas com seus próprios scores
  activityRankings: ContentActivityOption[];
  
  // Entradas consideradas pelo Cérebro 2 (Os 6 Grandes Grupos de Fatores)
  factors: {
    // 🧠 1. Déficit de domínio
    domainScore: number;          // Domínio geral (ex: 71%)
    targetDomain: number;         // Meta (85%)
    domainDeficit: number;        // Max(0, 85 - domínio)
    knowledgeScore: number;       // Dimensão Conhecimento
    applicationScore: number;     // Dimensão Aplicação
    retentionScore: number;       // Dimensão Retenção
    criticalBottleneck: 'aplicacao' | 'retencao' | 'conhecimento' | 'nenhum';
    bottleneckDescription: string;
    hasApplicationEvidence: boolean; // Se há dados de prova

    // 🎯 2. Incidência & Instituições-alvo
    generalIncidenceScore: number;            // Incidência geral (0-100 contínuo)
    targetInstitutionsIncidenceScore: number; // Incidência nas instituições-alvo (0-100)
    targetInstitutionsList: string[];         // ex: ['USP-SP', 'UNIFESP', 'UNICAMP', 'ENARE']
    incidenceRating: 'Muito alta' | 'Alta' | 'Média' | 'Baixa' | 'Muito baixa';
    incidenceScore: number;                   // Pontos combinados de incidência
    isTargetDeficiency: boolean;              // Déficit na banca-alvo

    // 🔄 3. FSRS / Necessidade de Revisão
    fsrsStatus: 'distante' | 'proxima' | 'hoje' | 'atrasada';
    fsrsStatusLabel: string;
    isReviewOverdue: boolean;     // ⏰ Revisão FSRS: em atraso vs em dia
    overdueDays: number;          // Dias de atraso (ex: 2)
    nextReviewDate?: string;
    retrievability: number;       // R (0-100%)
    fsrsPriorityImpact: string;   // FSRS é ponderado, não um comando absoluto

    // 📚 4. Progresso do Conteúdo
    progressStage: 'novo' | 'pendente_consolidacao' | 'base_concluida_com_gargalo' | 'consolidado';
    theoryCompleted: boolean;
    postExercisesCompletionRate: number; // 0-100%
    isUnstudied: boolean;         // Conteúdo não estudado

    // ⏰ 5. Prazo dos 2 anos & Ritmo
    weeksRemaining: number;       // Semanas restantes (ex: 104 semanas)
    weeklyHoursTarget: number;    // Disponibilidade semanal (ex: 8h)
    weeklyHoursNeeded: number;    // Necessidade estimada (ex: 7.6h ou 9.2h)
    paceStatus: 'no_ritmo' | 'acima_planejado' | 'prazo_em_risco';
    paceStatusLabel: string;
    urgencyWeight: number;

    // 📈 6. Estratégia / Intervenção Ideal
    strategicIntervention: string;
    isBlockedBySafetyRule: boolean; // Trava de segurança ativa
    blockReason?: string;
    appliedBoosts: string[];       // Boosts estratégicos ativados
    estimatedDurationMin: number; // Duração estimada para a atividade principal
  };

  // Ponderação adaptativa usada no cálculo
  adaptiveFormulaWeights: {
    deficitWeight: number;      // base: 30%
    incidenceWeight: number;    // base: 25%
    revisionWeight: number;     // base: 20%
    progressWeight: number;     // base: 10%
    timelineWeight: number;     // base: 10%
    strategyWeight: number;     // base: 5%
    adaptationReason: string;
  };
}

export interface DomainCalculationBreakdown {
  // As quatro dimensões essenciais
  knowledgeScore: number;     // 📚 Conhecimento (0-100%) - Medway pós e reavaliações (baseline não penaliza)
  applicationScore: number;   // 🎯 Aplicação (0-100%) - Provas reais > Simulados > Medway
  retentionScore: number;     // 🧠 Retenção (0-100%) - Osler + FSRS (estabilidade, recência, qualidade)
  confidenceLevel: DomainConfidenceLevel; // 📊 Confiança (alta, media, baixa)
  confidenceScore: number;    // 0-100%
  overallDomain: number;      // Domínio geral do conteúdo (0-100%)
  
  status: DomainConsolidationStatus;
  statusLabel: string;
  isProvisional: boolean;     // true quando ainda não há provas reais suficientes

  // Ponderação dinâmica do "Cérebro"
  weights: {
    knowledgeWeight: number;   // % peso aplicado ao conhecimento
    applicationWeight: number; // % peso aplicado à aplicação
    retentionWeight: number;   // % peso aplicado à retenção
  };

  // Diagnóstico pedagógico e recomendação precisa
  diagnostic: {
    headline: string;
    description: string;
    prescribedAction: string;
    actionIcon: string;
    priorityReason: string;
  };

  // 🎯 Cérebro 2 acoplado
  brain2: Brain2Prioritization;

  // 🚨 Regra de Segurança para Consolidação (Meta 85% + Aplicação >= 80% + Retenção >= 80% + Confiança Suficiente)
  safetyRuleCheck: {
    passedOverallDomain: boolean; // Geral >= 85%
    passedApplication: boolean;   // Aplicação >= 80%
    passedRetention: boolean;     // Retenção >= 80%
    passedConfidence: boolean;    // Confiança != 'baixa'
    isConsolidated: boolean;      // Todos os 4 critérios satisfeitos
    isBlockedBySafetyRule: boolean; // Geral >= 85%, mas bloqueado por critério dimensional
    blockReason?: string;
  };

  // 📊 Os 3 Componentes da Confiança (Quantidade, Consistência temporal, Diversidade de bancas)
  confidenceComponents: {
    quantityScore: number;       // 📦 Quantidade (volume total avaliado)
    consistencyScore: number;    // 🔄 Consistência (estabilidade temporal e repetições)
    diversityScore: number;      // 🌎 Diversidade (pluralidade de bancas e anos)
    institutionsRepresented: string[]; // ex: ['USP-RP', 'UNIFESP', 'ENARE']
    sessionsCount: number;       // Número de sessões temporais distintas
    summaryPhrase: string;       // Frase humana interpretável
  };

  // 🧮 Suavização Bayesiana (Beta-Binomial) para Amostras Pequenas
  bayesianSmoothing: {
    rawObservedAccuracy: number; // Ex: 100% (2 acertos em 2 questões)
    smoothedAccuracy: number;    // Ex: 76% (encolhimento conservador com prior razoável de 70%)
    priorMean: number;           // 70%
    pseudoSampleSize: number;    // 8 questões equivalentes
    interpretation: string;      // Explicação humana
  };

  // Evidências agregadas detalhadas
  evidenceStats: {
    medwayQuestionsCount: number;
    medwayAccuracy: number;
    realExamQuestionsCount: number;
    realExamAccuracy: number;
    simuladoQuestionsCount: number;
    simuladoAccuracy: number;
    oslerCardsReviewedCount: number;
    oslerRetentionRate: number;
    fsrsStabilityDays: number;
    hasProvisionalEvidence: boolean;
  };
}

export interface ModuleItem {
  id: string;
  areaId: string;
  name: string; // ex: "Cardiologia"
  contents: ContentItem[];
  totalContents: number;
  studiedContents: number;
  consolidatedContents: number;
  avgMastery: number;
}

export interface AreaItem {
  id: string;
  name: string; // ex: "Clínica Médica"
  icon: string;
  modules: ModuleItem[];
  totalContents: number;
  studiedContents: number;
  consolidatedContents: number;
  avgMastery: number;
  totalHours: number;
}

export interface StudyActivity {
  id: string;
  title: string;
  specialty: string; // Área
  subspecialty: string; // Módulo
  contentId?: string;
  type: 'questoes' | 'revisao' | 'avanco';
  typeLabel: string;
  priority: 'alta' | 'media' | 'programada';
  priorityLabel: string;
  estimatedTime: string;
  summaryReason: string;
  description: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  currentStep?: number;
  totalSteps?: number;
  remainingMinutes?: number;
  whyThisMatters?: {
    currentMastery: number;
    targetMastery: number;
    examApplication: number;
    examApplicationStatus: string;
    examIncidence: string;
    retention: number;
    justification: string;
  };
  detailsSRS?: {
    retentionEstimated: number;
    retentionTarget: number;
    lastStudiedDaysAgo: number;
    recommendedDate: string;
    note: string;
  };
  detailsCurricular?: {
    blockInfo: string;
    nextBlockNote: string;
    cadence: string;
  };
}

export interface CadernoErroItem {
  id: string;
  topic: string;
  specialty: string;
  reason: string;
  reasonCategory: ErrorReasonType;
  institutionOrContext: string;
  createdAt: string;
  examType?: 'PROVA_REAL' | 'SIMULADO' | 'BANCO_QUESTOES';
}

export interface SessionCompletionReport {
  activityId: string;
  topic: string;
  specialty: string;
  type: 'questoes' | 'revisao' | 'avanco';
  toolUsed: string;
  questionsTotal?: number;
  questionsCorrect?: number;
  accuracyPercent?: number;
  activityCompletionPercent?: number;
  oslerDistribution?: OslerCardDistribution;
  cardsReviewed?: number;
  retentionPercent?: number;
  durationMinutes: number;
  errorNote?: string;
  errorReasonCategory?: ErrorReasonType;
  effortLevel?: 'leve' | 'moderado' | 'desafiador';
}

export interface WeeklyCapacityPlan {
  weekNumber: number;
  label: string;
  availableHours: number;
  loggedHours: number;
  status: 'concluida' | 'em_andamento' | 'planejada';
  isCustom: boolean;
  customNote?: string;
}

export interface ExamQuestionEntry {
  id: string;
  questionNumber: number;
  statementSnippet: string;
  contentId: string;
  contentName: string;
  moduloName: string;
  areaName: string;
  isCorrect: boolean;
  errorReason?: ErrorReasonType;
  userCorrectionNote?: string;
  aiSuggestedContentId: string;
  // Campos de Inteligência Curricular e IA das Bancas-Alvo
  institution?: string; // ex: 'USP-RP', 'USP-SP', 'UNICAMP', 'ENAMED', 'HIAE'
  year?: number; // ex: 2021-2025
  classificationStatus?: 'ia_confiavel' | 'duvida_revisao' | 'corrigido_manual';
  confidenceScore?: number; // 0-100%
  doubtReason?: string; // Motivo de dúvida (ex: sobreposição de condutas, sintomas mistos)
  mappedOslerBlocks?: { id: string; title: string }[];
  manualOverrideDate?: string;
  originalAiSuggestion?: {
    areaName: string;
    moduloName: string;
    contentName: string;
    contentId: string;
  };
  // Metadados de Auditoria Rigorosa de PDF (Precisão SynapseMed)
  sourceFileName?: string;
  originalQuestionNumber?: number; // Preserva numeração original da prova (ex: 21 permanece 21)
  sourcePage?: number | string; // Página no documento (ex: 10 ou "10-11")
  isSplitAcrossPages?: boolean; // Questão dividida entre páginas concatenada
  hasVisualElement?: boolean; // ECG, RX, TC, foto, gráfico, tabela
  visualType?: 'ECG' | 'TC' | 'RX' | 'Fotografia' | 'Tabela' | 'Gráfico' | 'Imagem Ilustrativa' | 'Outro';
  requiresVisualInspection?: boolean; // Se a imagem for mandatória para o assunto
  visualWarningNote?: string;
  isUnprocessed?: boolean; // "Questão não processada — revisão necessária"
  unprocessedReason?: string;
  confidenceStatus?: IdentificationConfidenceLevel; // 'CONFIRMADO' | 'PROVAVEL' | 'PRECISA_CONFIRMACAO'
  institutionConfidence?: IdentificationConfidenceLevel;
  yearConfidence?: IdentificationConfidenceLevel;
  isConfirmedForOfficialStats?: boolean; // Apenas questões confirmadas entram na incidência oficial
}

export interface ExamSubmission {
  id: string;
  title: string;
  type: 'PROVA_REAL' | 'SIMULADO';
  institution: string;
  year: number;
  dateLogged: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  questions: ExamQuestionEntry[];
}

export interface Flashcard {
  id: string;
  specialty: string;
  subspecialty: string;
  topic: string;
  front: string;
  back: string;
  nextReviewDays: number;
  retentionScore: number;
  difficulty: 'facil' | 'bom' | 'dificil' | 'errei';
}

export interface SpecialtyCurriculum {
  id: string;
  name: string;
  icon: string;
  totalHours: number;
  completedHours: number;
  coveragePercent: number;
  masteryPercent: number;
  topics: {
    id: string;
    title: string;
    incidence: 'Alta' | 'Média' | 'Baixa';
    mastery: number;
    status: 'Não iniciado' | 'Em consolidação' | 'Dominado';
    lastStudied?: string;
  }[];
}

export interface UserPreferences {
  name: string;
  weeklyHoursTarget: number;
  weeklyHoursLogged: number;
  availableTodayMinutes: number;
  targetYearTimeline: string; // "2 Anos"
  targetDeadlineDate: string; // "2028-09-07"
  targetInstitutions: string[];
  cycle: string;
}

// ==========================================
// 📅 ALGORITMO DE PLANEJAMENTO EM HORAS & HORIZONTE DE 2 ANOS
// ==========================================

export type PlanningActivityType =
  | 'teoria'               // Aula/Vídeo Medway ou leitura dirigida
  | 'exercicios_pre'       // Diagnóstico de entrada
  | 'exercicios_pos'       // Fixação imediata pós-teoria
  | 'osler'                // Flashcards com algoritmo FSRS
  | 'revisao_fsrs'         // Revisão espaçada programada
  | 'questoes_prova'       // Aplicação real de bancas (USP, UNIFESP, etc.)
  | 'analise_erros'        // Caderno de erros e correção de lacunas
  | 'recuperacao_teoria';  // Reforço pontual para queda de domínio

export type PlanningCategory =
  | 'avanco'        // 🆕 Avanço curricular (teoria, novos conteúdos)
  | 'manutencao'    // 🔄 Manutenção (FSRS, Osler, revisões espaçadas)
  | 'aplicacao'     // 🎯 Aplicação (questões de prova, simulados, análise de erros)
  | 'recuperacao';  // 🛠️ Recuperação (correção de déficits e queda de domínio)

export interface ActivityChunkInfo {
  currentChunk: number;  // ex: 1
  totalChunks: number;    // ex: 3
  chunkMinutes: number;   // ex: 45
  totalMinutes: number;   // ex: 95 (1h35)
  progressPercent: number;// ex: 47%
}

export interface PlanningActivityItem {
  id: string;
  contentId: string;
  name: string;
  subType: string;
  type: PlanningActivityType;
  category: PlanningCategory;
  durationMin: number;
  calibratedDurationMin?: number; // Ajustado ao ritmo real do estudante
  priorityScore: number;          // 0-100 (Cérebro 2)
  efficiencyPointsPerMin: number; // Score ÷ Duração (evita que tarefa longa domine)
  specialty: string;
  modulo: string;
  recommendedDay: string;         // 'segunda' | 'terca' | ...
  currentDay: string;
  isMovedByUser?: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'parcial';
  studiedMinutes?: number;        // Tempo real registrado
  incompleteNotice?: string;
  impactNotice?: string;
  
  // Dependências da atividade
  dependencies?: string[];        // ex: ['teoria_concluida']
  isBlocked?: boolean;
  blockReason?: string;
  
  // Datas ideais e limites
  idealDate?: string;
  deadlineDate?: string;
  whyNow: string;

  // Fracionamento de atividades longas (ex: 1h35 em 45m + 45m + 5m)
  chunkInfo?: ActivityChunkInfo;
}

export interface DayCapacityConfig {
  key: string;            // 'segunda', 'terca', etc.
  label: string;          // 'SEGUNDA'
  date: string;           // '07 SET'
  capacityMin: number;    // ex: 80 (1h20)
  plannedStr: string;     // '1h20'
  status: 'completo' | 'parcial' | 'nao_iniciado' | 'descanso';
  suggestedProfile: 'atividades_longas' | 'atividades_curtas' | 'misto' | 'livre';
}

export type WeekPresetType =
  | 'normal_8h'        // 8h/semana (Padrão)
  | 'ferias_15h'       // 15h/semana (Intensivo de férias)
  | 'provas_4h'        // 4h/semana (Semana de provas na faculdade)
  | 'excepcional_10h30'// 10h30/semana
  | 'customizada';     // Configuração livre por dia

export interface ThreeClocksState {
  // ⏱️ 1. Relógio Diário (Hoje)
  daily: {
    dayKey: string;
    dayLabel: string;
    availableMinutes: number;
    plannedMinutes: number;
    completedMinutes: number;
    statusText: string;
  };
  // 📅 2. Relógio Semanal (Esta Semana)
  weekly: {
    availableHours: number;
    plannedHours: number;
    completedHours: number;
    remainingHours: number;
    weeksRemainingInCycle: number;
    completionPercent: number;
  };
  // 🗓️ 3. Relógio dos 2 Anos (Horizonte de Preparação)
  twoYearsHorizon: {
    totalWeeks: number;           // 104 semanas (2 anos)
    weeksRemaining: number;       // ex: 96 semanas restantes
    totalCurriculumContents: number; // 280 conteúdos
    studiedContents: number;      // 130 conteúdos
    consolidatedContents: number; // 98 conteúdos com >= 85%
    coveragePercent: number;      // 46.4%
    consolidationPercent: number; // 35.0%
    hoursNeededRemaining: number; // ex: 600h restantes
    weeklyPaceNeededHours: number;// ex: 7.6h (7h35/semana)
    paceStatus: 'no_ritmo' | 'atencao' | 'risco';
    targetDate: string;           // "Maio/2028"
    projectedDate: string;        // "Abril/2028"
  };
}

export interface AdaptiveWeeklyBudget {
  phase: 'inicio' | 'meio' | 'final';
  phaseName: string;
  avancoHours: number;
  avancoPercent: number;
  manutencaoHours: number;
  manutencaoPercent: number;
  aplicacaoHours: number;
  aplicacaoPercent: number;
  recuperacaoHours: number;
  recuperacaoPercent: number;
  totalHours: number;
  dynamicExplanation: string;
}

export interface PlanningDeficitState {
  accumulatedDeficitHours: number;
  weeksRemaining: number;
  amortizationPerWeekMin: number;
  paceNeededHours: number;
  paceStatus: 'no_ritmo' | 'atencao' | 'risco';
  isPaceExceeded: boolean;
  delayWeeksIfFixedPace: number;
  correctiveOptions: {
    id: string;
    label: string;
    description: string;
    actionType: 'aumentar_tempo' | 'adicionar_semanas_ferias' | 'reduzir_raros';
  }[];
}

export interface FSRSLongTermLifecycleNode {
  month: number;
  label: string;
  action: string;
  domainScore: number;
  intervalDays: number;
  performance: 'Excelente' | 'Bom' | 'Queda detectada' | 'Recuperado';
  isDecayWarning?: boolean;
  notes: string;
}

/* ==========================================================================
   MODELO RELACIONAL DO BANCO DE DADOS (ESQUEMA CENTRAL BASEADO EM CONTEÚDO)
   ========================================================================== */

/**
 * 1. Usuário & Perfil de Estudo
 */
export interface UserEntity {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyProfileEntity {
  userId: string;
  targetDeadline: string; // ex: '2028-09-08' (Horizonte de 2 anos)
  weeklyHours: number; // ex: 8.0 (480 minutos)
  masteryTarget: number; // ex: 85 (85%)
  planningMode: 'semiautomatico' | 'automatico' | 'manual';
}

/**
 * 2. Instituições-Alvo
 */
export interface InstitutionEntity {
  id: string;
  name: string; // ex: 'USP', 'UNIFESP', 'ENARE'
  state: string; // ex: 'SP', 'BR'
  active: boolean;
}

export interface UserTargetInstitutionEntity {
  userId: string;
  institutionId: string;
  createdAt?: string;
}

/**
 * 3. Currículo Central (Área -> Módulo -> Conteúdo)
 * O coração do sistema: conteúdos nunca são apagados fisicamente (soft delete: active = false).
 */
export interface AreaEntity {
  id: string;
  name: string; // ex: 'Clínica Médica'
  order: number;
  active: boolean;
}

export interface ModuleEntity {
  id: string;
  areaId: string;
  name: string; // ex: 'Cardiologia'
  order: number;
  active: boolean;
}

export interface ContentEntity {
  id: string;
  moduleId: string;
  name: string; // ex: 'Insuficiência Cardíaca Congestiva'
  description?: string;
  order: number;
  active: boolean;
  isMandatory: boolean; // se é conteúdo obrigatório para o horizonte de 2 anos
}

/**
 * 4. Recursos & Exercícios Medway
 */
export type MedwayResourceType = 'THEORY' | 'PRE_EXERCISE' | 'POST_EXERCISE';

export interface MedwayResourceEntity {
  id: string;
  contentId: string;
  type: MedwayResourceType;
  title: string; // ex: 'ICC — Teoria', 'ICC — Pós-exercícios'
  estimatedMinutes: number; // ex: 60
  questionCount: number; // ex: 20
  order: number;
  sourceReference?: string;
  active: boolean;
}

export interface MedwayExerciseAttemptEntity {
  id: string;
  resourceId: string;
  userId: string;
  date: string;
  questionsCompleted: number;
  questionsCorrect: number;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

/**
 * 5. Osler & Mapeamento Muitos-para-Muitos
 */
export interface OslerBlockEntity {
  id: string;
  title: string; // ex: 'Insuficiência Cardíaca', 'Emergências Cardiológicas'
  description?: string;
  cardCount: number;
  active: boolean;
}

export interface ContentOslerMappingEntity {
  id: string;
  contentId: string; // 1 Conteúdo pode ter vários Blocos Osler
  oslerBlockId: string; // 1 Bloco Osler pode cobrir vários Conteúdos
  createdAt: string;
}

export interface OslerReviewEntity {
  id: string;
  userId: string;
  contentId: string;
  oslerBlockId: string;
  date: string;
  cardsReviewed: number;
  easyCount: number;
  normalCount: number;
  difficultCount: number;
  wrongCount: number;
  durationMinutes: number;
  notes?: string;
}

/**
 * 6. FSRS (Free Spaced Repetition Scheduler)
 */
export interface FSRSStateEntity {
  id: string;
  userId: string;
  contentId: string;
  stability: number; // S: dias que a memória permanece estável
  difficulty: number; // D: 1-10
  retrievability: number; // R: probabilidade estimada de recordar (0.0 - 1.0)
  lastReviewAt?: string;
  nextReviewAt?: string;
  reviewCount: number;
  lapseCount: number;
  algorithmVersion: string; // ex: 'FSRS-v4.5'
}

/**
 * 7. Provas, Questões e Histórico de Classificação
 */
export type ExamType = 'REAL_EXAM' | 'SIMULATION';

export interface ExamEntity {
  id: string;
  userId?: string;
  institutionId: string;
  year: number;
  type: ExamType; // REAL_EXAM vs SIMULATION
  title: string; // ex: 'USP 2025', 'Simulado Nacional Medway 03'
  fileReference?: string; // ex: 'usp_2025.pdf'
  importedAt: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
}

export interface SimulationMetadataEntity {
  examId: string;
  totalQuestions: number;
  totalDurationMinutes: number; // ex: 240min (4h)
  actualDurationMinutes: number;
  completionStatus: 'in_progress' | 'completed' | 'abandoned';
}

export interface QuestionEntity {
  id: string;
  examId: string;
  questionNumber: number;
  statement: string;
  alternatives?: { letter: string; text: string }[];
  aiContentId?: string; // Classificação sugerida pela IA
  finalContentId: string; // Classificação final validada (usada nos cálculos)
  aiConfidence?: number; // 0.0 - 1.0
  classificationStatus: 'ai_suggested' | 'user_confirmed' | 'user_corrected';
}

export interface QuestionClassificationHistoryEntity {
  id: string;
  questionId: string;
  contentId: string;
  source: 'AI' | 'USER';
  date: string;
  confidence?: number;
  changedFromContentId?: string;
}

export type QuestionErrorReasonEnum =
  | 'DID_NOT_KNOW'
  | 'FORGOT'
  | 'MISINTERPRETED'
  | 'INATTENTION'
  | 'BETWEEN_TWO_OPTIONS'
  | 'REASONING_ERROR'
  | 'OTHER';

export interface QuestionAttemptEntity {
  id: string;
  userId: string;
  questionId: string;
  date: string;
  correct: boolean;
  errorReason?: QuestionErrorReasonEnum;
  otherDescription?: string;
  durationSeconds?: number;
  notes?: string;
}

/**
 * 8. Atividades e Sessões de Estudo
 * Atividade = o que precisa ser feito (com tempo restante)
 * Sessão = o que efetivamente foi executado
 */
export type ActivityTypeEnum =
  | 'THEORY'
  | 'PRE_EXERCISE'
  | 'POST_EXERCISE'
  | 'EXAM_QUESTIONS'
  | 'OSLER'
  | 'REVIEW'
  | 'RECOVERY'
  | 'OTHER';

export type ActivityStatusEnum =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PARTIALLY_COMPLETED'
  | 'POSTPONED'
  | 'CANCELLED';

export interface ActivityEntity {
  id: string;
  userId: string;
  contentId: string;
  type: ActivityTypeEnum;
  sourceReference?: string;
  estimatedMinutes: number;
  remainingMinutes: number; // suporta conclusão parcial sem duplicar atividades
  status: ActivityStatusEnum;
  priorityScore: number;
  createdAt: string;
  completedAt?: string;
}

export interface StudySessionEntity {
  id: string;
  userId: string;
  activityId: string;
  contentId: string;
  startedAt: string;
  endedAt: string;
  activeDurationMinutes: number;
  completionPercentage: number;
  notes?: string;
}

/**
 * 9. Domínio & Avaliação de Conteúdo
 * Consolidado = domínio >= 85%, aplicação >= 80%, retenção >= 80%, confiança adequada
 */
export type ConsolidationStatusEnum =
  | 'NOT_EVALUATED'
  | 'INSUFFICIENT'
  | 'IN_CONSOLIDATION'
  | 'CONSOLIDATED';

export interface ContentAssessmentEntity {
  userId: string;
  contentId: string;
  domainScore: number; // 0-100%
  knowledgeScore: number; // Teoria e exercícios Medway
  applicationScore: number; // Provas anteriores e simulados
  retentionScore: number; // Flashcards Osler
  confidenceScore: number; // Amostra de evidências
  consolidationStatus: ConsolidationStatusEnum;
  calculatedAt: string;
}

export interface ContentAssessmentHistoryEntity {
  id: string;
  userId: string;
  contentId: string;
  domainScore: number;
  knowledgeScore: number;
  applicationScore: number;
  retentionScore: number;
  confidenceScore: number;
  date: string;
}

/**
 * 10. Prioridade Dinâmica do Algoritmo
 */
export interface ContentPriorityEntity {
  userId: string;
  contentId: string;
  score: number; // 0-100
  urgency: 'ALTA' | 'MEDIA' | 'BAIXA';
  priorityLevel: number; // rank relativo
  domainDeficit: number;
  incidenceScore: number;
  fsrsUrgency: number;
  deadlinePressure: number;
  calculatedAt: string;
}

/**
 * 11. Planejamento Semanal, Atividades Agendadas e Mudanças Manuais
 */
export type WeeklyPlanStatusEnum = 'ON_TRACK' | 'ATTENTION' | 'AT_RISK';

export interface WeeklyPlanEntity {
  id: string;
  userId: string;
  weekStart: string; // '2026-09-07'
  weekEnd: string; // '2026-09-11'
  availableMinutes: number; // ex: 480 min (8h capacidade regular)
  plannedMinutes: number; // ex: 450 min (7h30 planejado pelo algoritmo)
  completedMinutes: number; // ex: 320 min (5h20 executado)
  requiredPaceMinutes: number; // ex: 455 min (7h35 ritmo necessário)
  projectedDeadline: string; // 'Abril/2028'
  status: WeeklyPlanStatusEnum;
}

export interface PlannedActivityEntity {
  id: string;
  weeklyPlanId: string;
  activityId: string;
  date: string; // ex: '2026-09-08'
  startTime?: string; // ex: '13:30'
  plannedMinutes: number;
  position: number;
  source: 'ALGORITHM' | 'USER';
}

export type PlanningChangeActionEnum =
  | 'MOVED'
  | 'POSTPONED'
  | 'ADVANCED'
  | 'REMOVED'
  | 'ADDED';

export interface PlanningChangeEntity {
  id: string;
  weeklyPlanId: string;
  plannedActivityId: string;
  action: PlanningChangeActionEnum;
  oldDate?: string;
  newDate?: string;
  createdAt: string;
  reason?: string;
}

/**
 * 12. Disponibilidade e Regra dos 4 Conceitos de Tempo
 * 1. Capacidade (ex: 8h)
 * 2. Tempo Planejado (ex: 7h30)
 * 3. Tempo Realizado (ex: 6h45)
 * 4. Tempo Extraordinário (Simulados ficam FORA das 8h!)
 */
export interface WeeklyAvailabilityEntity {
  id: string;
  userId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Segunda, ..., 5 = Sexta
  availableMinutes: number;
}

export interface AvailabilityOverrideEntity {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  availableMinutes: number; // ex: 900 min (15h em semana de folga)
  reason?: string;
}

export interface FourTimesMetrics {
  capacityMinutes: number; // 480 min (8h)
  plannedMinutes: number; // 450 min (7h30)
  realizedMinutes: number; // 405 min (6h45)
  extraordinarySimulationMinutes: number; // 180 min (3h - SEPARADO da capacidade semanal!)
}

