import {
  ActivityEntity,
  ActivityStatusEnum,
  ActivityTypeEnum,
  AreaEntity,
  AvailabilityOverrideEntity,
  ConsolidationStatusEnum,
  ContentAssessmentEntity,
  ContentAssessmentHistoryEntity,
  ContentEntity,
  ContentOslerMappingEntity,
  ContentPriorityEntity,
  ExamEntity,
  FourTimesMetrics,
  FSRSStateEntity,
  InstitutionEntity,
  MedwayExerciseAttemptEntity,
  MedwayResourceEntity,
  ModuleEntity,
  OslerBlockEntity,
  OslerReviewEntity,
  PlannedActivityEntity,
  PlanningChangeActionEnum,
  PlanningChangeEntity,
  QuestionAttemptEntity,
  QuestionClassificationHistoryEntity,
  QuestionEntity,
  QuestionErrorReasonEnum,
  SimulationMetadataEntity,
  StudyProfileEntity,
  StudySessionEntity,
  UserEntity,
  UserTargetInstitutionEntity,
  WeeklyAvailabilityEntity,
  WeeklyPlanEntity,
} from '../types';

/**
 * ============================================================================
 * BANCO DE DADOS RELACIONAL EM MEMÓRIA (CENTRALIZADO EM CONTEÚDO)
 * ============================================================================
 * Implementa a arquitetura dos 30 princípios:
 * - Área → Módulo → Conteúdo (conteúdos nunca deletados fisicamente)
 * - Recursos Medway (Teoria, Pré, Pós) e Tentativas separadas
 * - Mapeamento Muitos-para-Muitos Conteúdo ↔ Osler
 * - Provas Reais vs Simulados (com metadados de simulação)
 * - Questões com histórico de classificação IA vs Usuária
 * - Respostas/Tentativas com enum de 7 motivos de erro
 * - Atividades (o que precisa ser feito) vs Sessões (o que foi feito)
 * - FSRS e Domínio separados (Estado de Memória vs Tríade de Avaliação)
 * - Prioridade dinâmica recalculável
 * - Planejamento semanal com fontes (ALGORITHM vs USER) e histórico de mudanças
 * - Regra de Ouro dos 4 tempos (Capacidade, Planejado, Realizado e Simulado Extraordinário)
 */

export class SynapseRelationalDatabase {
  // 1. Usuário & Perfil
  users: UserEntity[] = [];
  studyProfiles: StudyProfileEntity[] = [];

  // 2. Instituições-Alvo
  institutions: InstitutionEntity[] = [];
  userTargetInstitutions: UserTargetInstitutionEntity[] = [];

  // 3. Currículo (Área → Módulo → Conteúdo)
  areas: AreaEntity[] = [];
  modules: ModuleEntity[] = [];
  contents: ContentEntity[] = [];

  // 4. Recursos & Tentativas Medway
  medwayResources: MedwayResourceEntity[] = [];
  medwayExerciseAttempts: MedwayExerciseAttemptEntity[] = [];

  // 5. Osler & Mapeamento Muitos-para-Muitos
  oslerBlocks: OslerBlockEntity[] = [];
  contentOslerMappings: ContentOslerMappingEntity[] = [];
  oslerReviews: OslerReviewEntity[] = [];

  // 6. FSRS (Estado de Memória Espaçada)
  fsrsStates: FSRSStateEntity[] = [];

  // 7. Provas, Questões e Tentativas
  exams: ExamEntity[] = [];
  simulationMetadata: SimulationMetadataEntity[] = [];
  questions: QuestionEntity[] = [];
  questionClassificationHistory: QuestionClassificationHistoryEntity[] = [];
  questionAttempts: QuestionAttemptEntity[] = [];

  // 8. Atividades & Sessões de Estudo
  activities: ActivityEntity[] = [];
  studySessions: StudySessionEntity[] = [];

  // 9. Avaliação de Domínio & Histórico
  contentAssessments: ContentAssessmentEntity[] = [];
  contentAssessmentHistory: ContentAssessmentHistoryEntity[] = [];

  // 10. Prioridade Dinâmica & Snapshots
  contentPriorities: ContentPriorityEntity[] = [];

  // 11. Planejamento Semanal & Mudanças Manuais
  weeklyPlans: WeeklyPlanEntity[] = [];
  plannedActivities: PlannedActivityEntity[] = [];
  planningChanges: PlanningChangeEntity[] = [];

  // 12. Disponibilidade & 4 Tempos
  weeklyAvailability: WeeklyAvailabilityEntity[] = [];
  availabilityOverrides: AvailabilityOverrideEntity[] = [];

  constructor() {
    this.seedDatabase();
  }

  /**
   * Povoamento inicial com dados de alta fidelidade
   */
  private seedDatabase() {
    const userId = 'usr-leticia-01';

    // 1. Usuário & Perfil
    this.users.push({
      id: userId,
      name: 'Letícia Rezende',
      email: 'leticiarzende.o@gmail.com',
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-09-08T00:00:00Z',
    });

    this.studyProfiles.push({
      userId,
      targetDeadline: '2028-09-08',
      weeklyHours: 8.0, // 480 min
      masteryTarget: 85, // 85%
      planningMode: 'semiautomatico',
    });

    // 2. Instituições
    this.institutions = [
      { id: 'inst-usp', name: 'USP-SP', state: 'SP', active: true },
      { id: 'inst-unifesp', name: 'UNIFESP', state: 'SP', active: true },
      { id: 'inst-unicamp', name: 'UNICAMP', state: 'SP', active: true },
      { id: 'inst-enare', name: 'ENARE', state: 'BR', active: true },
      { id: 'inst-sussp', name: 'SUS-SP', state: 'SP', active: true },
    ];

    this.userTargetInstitutions = this.institutions.map((i) => ({
      userId,
      institutionId: i.id,
      createdAt: '2026-08-01T00:00:00Z',
    }));

    // 3. Currículo (Área → Módulo → Conteúdo)
    this.areas = [
      { id: 'area-clinica', name: 'Clínica Médica', order: 1, active: true },
      { id: 'area-cirurgia', name: 'Cirurgia Geral', order: 2, active: true },
      { id: 'area-go', name: 'Ginecologia e Obstetrícia', order: 3, active: true },
      { id: 'area-pediatria', name: 'Pediatria', order: 4, active: true },
      { id: 'area-preventiva', name: 'Medicina Preventiva', order: 5, active: true },
    ];

    this.modules = [
      { id: 'mod-cardio', areaId: 'area-clinica', name: 'Cardiologia', order: 1, active: true },
      { id: 'mod-pneumo', areaId: 'area-clinica', name: 'Pneumologia', order: 2, active: true },
      { id: 'mod-nefro', areaId: 'area-clinica', name: 'Nefrologia', order: 3, active: true },
      { id: 'mod-trauma', areaId: 'area-cirurgia', name: 'Trauma & ATLS', order: 1, active: true },
      { id: 'mod-obstetricia', areaId: 'area-go', name: 'Obstetrícia Geral', order: 1, active: true },
      { id: 'mod-neonatologia', areaId: 'area-pediatria', name: 'Neonatologia', order: 1, active: true },
      { id: 'mod-epidemiologia', areaId: 'area-preventiva', name: 'Epidemiologia e SUS', order: 1, active: true },
    ];

    this.contents = [
      {
        id: 'c-icc',
        moduleId: 'mod-cardio',
        name: 'Insuficiência Cardíaca Congestiva (ICC)',
        description: 'Diagnóstico clínico, ecocardiograma, classificação NYHA/ACC/AHA e terapia quádrupla otimizada.',
        order: 1,
        active: true,
        isMandatory: true,
      },
      {
        id: 'c-dpoc',
        moduleId: 'mod-pneumo',
        name: 'Doença Pulmonar Obstrutiva Crônica (DPOC)',
        description: 'Espirometria pós-BD, classificação GOLD ABE, tratamento inalatório e manejo da exacerbação infecciosa.',
        order: 1,
        active: true,
        isMandatory: true,
      },
      {
        id: 'c-has',
        moduleId: 'mod-cardio',
        name: 'Hipertensão Arterial Sistêmica (HAS)',
        description: 'Diretrizes SBC/ESH, metas pressóricas, terapia combinada e rastreio de lesão em órgão-alvo.',
        order: 2,
        active: true,
        isMandatory: true,
      },
      {
        id: 'c-asma',
        moduleId: 'mod-pneumo',
        name: 'Asma Brônquica',
        description: 'Diagnóstico funcional, etapas GINA 2024, corticoide inalatório + formoterol de alívio e crises graves.',
        order: 2,
        active: true,
        isMandatory: true,
      },
      {
        id: 'c-drc',
        moduleId: 'mod-nefro',
        name: 'Doença Renal Crônica (DRC)',
        description: 'Classificação KDIGO, estadiamento por TFGe e albuminúria, controle de fósforo/PTH e diálise.',
        order: 1,
        active: true,
        isMandatory: true,
      },
    ];

    // 4. Recursos Medway (THEORY, PRE_EXERCISE, POST_EXERCISE)
    this.medwayResources = [
      {
        id: 'med-icc-th',
        contentId: 'c-icc',
        type: 'THEORY',
        title: 'ICC — Teoria Completa & Fisiopatologia',
        estimatedMinutes: 60,
        questionCount: 0,
        order: 1,
        sourceReference: 'Medway Extensivo 2026',
        active: true,
      },
      {
        id: 'med-icc-pre',
        contentId: 'c-icc',
        type: 'PRE_EXERCISE',
        title: 'ICC — Pré-exercícios diagnósticos',
        estimatedMinutes: 30,
        questionCount: 10,
        order: 2,
        sourceReference: 'Medway Questões',
        active: true,
      },
      {
        id: 'med-icc-post',
        contentId: 'c-icc',
        type: 'POST_EXERCISE',
        title: 'ICC — Pós-exercícios de fixação',
        estimatedMinutes: 60,
        questionCount: 20,
        order: 3,
        sourceReference: 'Medway Questões',
        active: true,
      },
      {
        id: 'med-dpoc-th',
        contentId: 'c-dpoc',
        type: 'THEORY',
        title: 'DPOC — Teoria e Diretriz GOLD',
        estimatedMinutes: 50,
        questionCount: 0,
        order: 1,
        sourceReference: 'Medway Extensivo 2026',
        active: true,
      },
      {
        id: 'med-dpoc-pre',
        contentId: 'c-dpoc',
        type: 'PRE_EXERCISE',
        title: 'DPOC — Pré-exercícios diagnósticos',
        estimatedMinutes: 25,
        questionCount: 10,
        order: 2,
        sourceReference: 'Medway Questões',
        active: true,
      },
      {
        id: 'med-dpoc-post',
        contentId: 'c-dpoc',
        type: 'POST_EXERCISE',
        title: 'DPOC — Pós-exercícios de fixação',
        estimatedMinutes: 55,
        questionCount: 20,
        order: 3,
        sourceReference: 'Medway Questões',
        active: true,
      },
    ];

    this.medwayExerciseAttempts = [
      {
        id: 'att-icc-pre-01',
        resourceId: 'med-icc-pre',
        userId,
        date: '2026-08-10',
        questionsCompleted: 10,
        questionsCorrect: 7,
        durationMinutes: 28,
        completed: true,
        notes: 'Baseline de entrada: 70% de acerto',
      },
      {
        id: 'att-icc-post-01',
        resourceId: 'med-icc-post',
        userId,
        date: '2026-08-12',
        questionsCompleted: 20,
        questionsCorrect: 17,
        durationMinutes: 58,
        completed: true,
        notes: 'Fixação pós-teoria: 85% de acerto (+15 p.p. de ganho)',
      },
      {
        id: 'att-dpoc-pre-01',
        resourceId: 'med-dpoc-pre',
        userId,
        date: '2026-08-15',
        questionsCompleted: 10,
        questionsCorrect: 6,
        durationMinutes: 25,
        completed: true,
        notes: 'Dúvidas em critérios espirométricos',
      },
      {
        id: 'att-dpoc-post-01',
        resourceId: 'med-dpoc-post',
        userId,
        date: '2026-08-18',
        questionsCompleted: 20,
        questionsCorrect: 15,
        durationMinutes: 52,
        completed: true,
        notes: 'Aproveitamento 75%',
      },
    ];

    // 5. Osler & Mapeamento Muitos-para-Muitos
    this.oslerBlocks = [
      { id: 'osler-b1', title: 'Osler: Insuficiência Cardíaca', cardCount: 42, active: true },
      { id: 'osler-b2', title: 'Osler: Síndromes Cardiovasculares', cardCount: 58, active: true },
      { id: 'osler-b3', title: 'Osler: Emergências Cardiológicas', cardCount: 34, active: true },
      { id: 'osler-b4', title: 'Osler: DPOC & Asma Brônquica', cardCount: 48, active: true },
      { id: 'osler-b5', title: 'Osler: Nefropatias & Distúrbios Hidroeletrolíticos', cardCount: 50, active: true },
    ];

    // Relação muitos-para-muitos (1 conteúdo pode ter vários blocos, e 1 bloco pode cobrir múltiplos conteúdos)
    this.contentOslerMappings = [
      { id: 'map-1', contentId: 'c-icc', oslerBlockId: 'osler-b1', createdAt: '2026-08-01' },
      { id: 'map-2', contentId: 'c-icc', oslerBlockId: 'osler-b2', createdAt: '2026-08-01' },
      { id: 'map-3', contentId: 'c-icc', oslerBlockId: 'osler-b3', createdAt: '2026-08-01' },
      { id: 'map-4', contentId: 'c-dpoc', oslerBlockId: 'osler-b4', createdAt: '2026-08-01' },
      { id: 'map-5', contentId: 'c-asma', oslerBlockId: 'osler-b4', createdAt: '2026-08-01' }, // Bloco b4 cobre tanto DPOC quanto Asma
      { id: 'map-6', contentId: 'c-drc', oslerBlockId: 'osler-b5', createdAt: '2026-08-01' },
    ];

    this.oslerReviews = [
      {
        id: 'rev-icc-01',
        userId,
        contentId: 'c-icc',
        oslerBlockId: 'osler-b1',
        date: '2026-08-25',
        cardsReviewed: 38,
        easyCount: 22,
        normalCount: 11,
        difficultCount: 4,
        wrongCount: 1,
        durationMinutes: 18,
        notes: 'Boa retenção das doses de betabloqueador e espironolactona',
      },
      {
        id: 'rev-dpoc-01',
        userId,
        contentId: 'c-dpoc',
        oslerBlockId: 'osler-b4',
        date: '2026-09-01',
        cardsReviewed: 32,
        easyCount: 16,
        normalCount: 9,
        difficultCount: 5,
        wrongCount: 2,
        durationMinutes: 15,
        notes: 'Lapsos na indicação de oxigenoterapia domiciliar prolongada',
      },
    ];

    // 6. FSRS States (Estabilidade, Dificuldade, Retrievabilidade)
    this.fsrsStates = [
      {
        id: 'fsrs-icc-01',
        userId,
        contentId: 'c-icc',
        stability: 14.2, // Estabilidade de ~14 dias
        difficulty: 4.8,
        retrievability: 0.84, // 84% de retenção estimada hoje
        lastReviewAt: '2026-08-25T14:30:00Z',
        nextReviewAt: '2026-09-08T14:30:00Z', // Vence HOJE!
        reviewCount: 3,
        lapseCount: 0,
        algorithmVersion: 'FSRS-v4.5',
      },
      {
        id: 'fsrs-dpoc-01',
        userId,
        contentId: 'c-dpoc',
        stability: 8.5,
        difficulty: 5.6,
        retrievability: 0.79, // Retenção em declínio
        lastReviewAt: '2026-09-01T10:00:00Z',
        nextReviewAt: '2026-09-12T10:00:00Z',
        reviewCount: 2,
        lapseCount: 1,
        algorithmVersion: 'FSRS-v4.5',
      },
    ];

    // 7. Provas & Simulados
    this.exams = [
      {
        id: 'exam-usp-2025',
        userId,
        institutionId: 'inst-usp',
        year: 2025,
        type: 'REAL_EXAM',
        title: 'USP 2025 — Acesso Direto',
        fileReference: 'provas/usp_2025.pdf',
        importedAt: '2026-08-05T12:00:00Z',
        processingStatus: 'completed',
      },
      {
        id: 'exam-unifesp-2025',
        userId,
        institutionId: 'inst-unifesp',
        year: 2025,
        type: 'REAL_EXAM',
        title: 'UNIFESP 2025 — Acesso Direto',
        fileReference: 'provas/unifesp_2025.pdf',
        importedAt: '2026-08-10T12:00:00Z',
        processingStatus: 'completed',
      },
      {
        id: 'exam-sim-nac-03',
        userId,
        institutionId: 'inst-usp',
        year: 2026,
        type: 'SIMULATION', // SIMULADO (fora da carga regular)
        title: 'Simulado Nacional Medway 03',
        importedAt: '2026-08-20T18:00:00Z',
        processingStatus: 'completed',
      },
    ];

    this.simulationMetadata = [
      {
        examId: 'exam-sim-nac-03',
        totalQuestions: 100,
        totalDurationMinutes: 240, // 4h
        actualDurationMinutes: 218,
        completionStatus: 'completed',
      },
    ];

    // Questões de Provas
    this.questions = [
      {
        id: 'q-usp-37',
        examId: 'exam-usp-2025',
        questionNumber: 37,
        statement: 'Paciente de 64 anos, hipertenso, procura PS com dispneia paroxística noturna e estertores bibasais. Qual a conduta?',
        aiContentId: 'c-icc',
        finalContentId: 'c-icc',
        aiConfidence: 0.96,
        classificationStatus: 'user_confirmed',
      },
      {
        id: 'q-unifesp-22',
        examId: 'exam-unifesp-2025',
        questionNumber: 22,
        statement: 'Homem de 68 anos, tabagista 50 anos-maço, espirometria VEF1/CVF 0.58 com exacerbação infecciosa recente. Qual esquema?',
        aiContentId: 'c-dpoc',
        finalContentId: 'c-dpoc',
        aiConfidence: 0.94,
        classificationStatus: 'user_confirmed',
      },
      {
        id: 'q-usp-42',
        examId: 'exam-usp-2025',
        questionNumber: 42,
        statement: 'Paciente com DPOC avançado e hipoxemia crônica. Critérios para O2 domiciliar.',
        aiContentId: 'c-dpoc',
        finalContentId: 'c-dpoc',
        aiConfidence: 0.91,
        classificationStatus: 'user_confirmed',
      },
    ];

    this.questionClassificationHistory = [
      {
        id: 'cl-hist-1',
        questionId: 'q-usp-37',
        contentId: 'c-icc',
        source: 'AI',
        date: '2026-08-05T12:05:00Z',
        confidence: 0.96,
      },
    ];

    this.questionAttempts = [
      {
        id: 'att-q-37',
        userId,
        questionId: 'q-usp-37',
        date: '2026-08-28',
        correct: true,
        durationSeconds: 98,
        notes: 'Acertou indicação de furosemida EV e IECA',
      },
      {
        id: 'att-q-22',
        userId,
        questionId: 'q-unifesp-22',
        date: '2026-08-29',
        correct: false,
        errorReason: 'BETWEEN_TWO_OPTIONS',
        otherDescription: 'Ficou em dúvida entre LABA+LAMA e LABA+CI',
        durationSeconds: 145,
      },
      {
        id: 'att-q-42',
        userId,
        questionId: 'q-usp-42',
        date: '2026-08-30',
        correct: false,
        errorReason: 'INATTENTION',
        otherDescription: 'Esqueceu o critério de cor pulmonale para PaO2 56-59',
        durationSeconds: 110,
      },
    ];

    // 8. Atividades (o que precisa ser feito)
    this.activities = [
      {
        id: 'act-dpoc-questoes',
        userId,
        contentId: 'c-dpoc',
        type: 'EXAM_QUESTIONS',
        sourceReference: 'Questões USP & UNIFESP',
        estimatedMinutes: 60,
        remainingMinutes: 60,
        status: 'PENDING',
        priorityScore: 94,
        createdAt: '2026-09-08T07:00:00Z',
      },
      {
        id: 'act-icc-revisao',
        userId,
        contentId: 'c-icc',
        type: 'REVIEW',
        sourceReference: 'Revisão FSRS 14 dias',
        estimatedMinutes: 30,
        remainingMinutes: 30,
        status: 'PENDING',
        priorityScore: 89,
        createdAt: '2026-09-08T07:00:00Z',
      },
      {
        id: 'act-osler-icc',
        userId,
        contentId: 'c-icc',
        type: 'OSLER',
        sourceReference: 'Osler Flashcards ICC',
        estimatedMinutes: 10,
        remainingMinutes: 10,
        status: 'PENDING',
        priorityScore: 85,
        createdAt: '2026-09-08T07:00:00Z',
      },
    ];

    // Sessões de Estudo Anteriores
    this.studySessions = [
      {
        id: 'ses-1',
        userId,
        activityId: 'act-hist-01',
        contentId: 'c-icc',
        startedAt: '2026-09-07T14:00:00Z',
        endedAt: '2026-09-07T14:57:00Z',
        activeDurationMinutes: 57,
        completionPercentage: 100,
        notes: 'Revisão teórica concluída com 10 questões.',
      },
    ];

    // 9. Avaliação de Domínio & Histórico
    this.contentAssessments = [
      {
        userId,
        contentId: 'c-icc',
        domainScore: 78,
        knowledgeScore: 86,
        applicationScore: 72,
        retentionScore: 84,
        confidenceScore: 85,
        consolidationStatus: 'IN_CONSOLIDATION',
        calculatedAt: '2026-09-08T06:00:00Z',
      },
      {
        userId,
        contentId: 'c-dpoc',
        domainScore: 71,
        knowledgeScore: 78,
        applicationScore: 65,
        retentionScore: 79,
        confidenceScore: 80,
        consolidationStatus: 'IN_CONSOLIDATION',
        calculatedAt: '2026-09-08T06:00:00Z',
      },
      {
        userId,
        contentId: 'c-has',
        domainScore: 88,
        knowledgeScore: 90,
        applicationScore: 86,
        retentionScore: 89,
        confidenceScore: 92,
        consolidationStatus: 'CONSOLIDATED', // >= 85% domínio e >= 80% app/ret
        calculatedAt: '2026-09-08T06:00:00Z',
      },
    ];

    this.contentAssessmentHistory = [
      {
        id: 'cah-icc-1',
        userId,
        contentId: 'c-icc',
        domainScore: 64,
        knowledgeScore: 70,
        applicationScore: 60,
        retentionScore: 65,
        confidenceScore: 50,
        date: '2026-06-15',
      },
      {
        id: 'cah-icc-2',
        userId,
        contentId: 'c-icc',
        domainScore: 72,
        knowledgeScore: 80,
        applicationScore: 66,
        retentionScore: 76,
        confidenceScore: 70,
        date: '2026-07-20',
      },
      {
        id: 'cah-icc-3',
        userId,
        contentId: 'c-icc',
        domainScore: 81,
        knowledgeScore: 88,
        applicationScore: 75,
        retentionScore: 86,
        confidenceScore: 82,
        date: '2026-08-20',
      },
      {
        id: 'cah-icc-4',
        userId,
        contentId: 'c-icc',
        domainScore: 78,
        knowledgeScore: 86,
        applicationScore: 72,
        retentionScore: 84,
        confidenceScore: 85,
        date: '2026-09-08',
      },
    ];

    // 10. Prioridade Dinâmica do Algoritmo
    this.contentPriorities = [
      {
        userId,
        contentId: 'c-dpoc',
        score: 94,
        urgency: 'ALTA',
        priorityLevel: 1,
        domainDeficit: 14,
        incidenceScore: 88,
        fsrsUrgency: 82,
        deadlinePressure: 75,
        calculatedAt: '2026-09-08T06:00:00Z',
      },
      {
        userId,
        contentId: 'c-icc',
        score: 89,
        urgency: 'ALTA',
        priorityLevel: 2,
        domainDeficit: 7,
        incidenceScore: 92,
        fsrsUrgency: 95,
        deadlinePressure: 70,
        calculatedAt: '2026-09-08T06:00:00Z',
      },
    ];

    // 11. Planejamento Semanal (Semana de 07/09 a 11/09)
    const weekPlanId = 'wp-2026-w37';
    this.weeklyPlans.push({
      id: weekPlanId,
      userId,
      weekStart: '2026-09-07',
      weekEnd: '2026-09-11',
      availableMinutes: 480, // 8h capacidade regular
      plannedMinutes: 450, // 7h30 planejado pelo algoritmo
      completedMinutes: 0, // Início limpo de estudos (0 min executados)
      requiredPaceMinutes: 455, // 7h35 ritmo necessário para 2 anos
      projectedDeadline: 'Abril/2028',
      status: 'ON_TRACK',
    });

    this.plannedActivities = [
      {
        id: 'pa-1',
        weeklyPlanId: weekPlanId,
        activityId: 'act-dpoc-questoes',
        date: '2026-09-08', // Hoje (Terça)
        startTime: '13:00',
        plannedMinutes: 60,
        position: 1,
        source: 'ALGORITHM',
      },
      {
        id: 'pa-2',
        weeklyPlanId: weekPlanId,
        activityId: 'act-icc-revisao',
        date: '2026-09-08',
        startTime: '14:00',
        plannedMinutes: 30,
        position: 2,
        source: 'ALGORITHM',
      },
      {
        id: 'pa-3',
        weeklyPlanId: weekPlanId,
        activityId: 'act-osler-icc',
        date: '2026-09-08',
        startTime: '14:30',
        plannedMinutes: 10,
        position: 3,
        source: 'ALGORITHM',
      },
    ];

    // 12. Disponibilidade Semanal (Segunda a Sexta = 8h / 480 min)
    this.weeklyAvailability = [
      { id: 'av-seg', userId, dayOfWeek: 1, availableMinutes: 90 }, // Seg: 1h30
      { id: 'av-ter', userId, dayOfWeek: 2, availableMinutes: 120 }, // Ter: 2h00 (ou 100min base)
      { id: 'av-qua', userId, dayOfWeek: 3, availableMinutes: 60 }, // Qua: 1h00
      { id: 'av-qui', userId, dayOfWeek: 4, availableMinutes: 90 }, // Qui: 1h30
      { id: 'av-sex', userId, dayOfWeek: 5, availableMinutes: 120 }, // Sex: 2h00
    ];
  }

  // ==========================================================================
  // CONSULTAS & OPERAÇÕES DO NÚCLEO RELACIONAL
  // ==========================================================================

  /**
   * Obtém a árvore hierárquica curricular (Área → Módulo → Conteúdos)
   */
  getCurriculumHierarchy() {
    return this.areas
      .filter((a) => a.active)
      .sort((a, b) => a.order - b.order)
      .map((area) => {
        const areaModules = this.modules
          .filter((m) => m.areaId === area.id && m.active)
          .sort((a, b) => a.order - b.order)
          .map((module) => {
            const moduleContents = this.contents
              .filter((c) => c.moduleId === module.id && c.active)
              .sort((a, b) => a.order - b.order);
            return {
              ...module,
              contents: moduleContents,
            };
          });
        return {
          ...area,
          modules: areaModules,
        };
      });
  }

  /**
   * Obtém os detalhes completos conectados a um determinado Conteúdo
   */
  getContentDetails(contentId: string) {
    const content = this.contents.find((c) => c.id === contentId);
    if (!content) return null;

    const module = this.modules.find((m) => m.id === content.moduleId);
    const area = module ? this.areas.find((a) => a.id === module.areaId) : undefined;

    // Recursos Medway do conteúdo
    const resources = this.medwayResources.filter((r) => r.contentId === contentId && r.active);

    // Blocos Osler mapeados (muitos-para-muitos)
    const mappings = this.contentOslerMappings.filter((m) => m.contentId === contentId);
    const oslerBlocksMapped = mappings
      .map((m) => this.oslerBlocks.find((b) => b.id === m.oslerBlockId))
      .filter(Boolean) as OslerBlockEntity[];

    // Questões de provas com finalContentId associado
    const examQuestions = this.questions.filter((q) => q.finalContentId === contentId);

    // FSRS State
    const fsrs = this.fsrsStates.find((f) => f.contentId === contentId);

    // Assessment de Domínio atual
    const assessment = this.contentAssessments.find((a) => a.contentId === contentId);

    // Prioridade calculada
    const priority = this.contentPriorities.find((p) => p.contentId === contentId);

    // Incidência calculada dinamicamente nas bancas
    const incidence = this.calculateIncidence(contentId);

    return {
      content,
      module,
      area,
      resources,
      oslerBlocksMapped,
      examQuestions,
      fsrs,
      assessment,
      priority,
      incidence,
    };
  }

  /**
   * Calcula a incidência real de um conteúdo nas bancas a partir das questões classificadas
   */
  calculateIncidence(contentId: string) {
    const relatedQuestions = this.questions.filter((q) => q.finalContentId === contentId);
    const countsByInstitution: Record<string, number> = {};

    relatedQuestions.forEach((q) => {
      const exam = this.exams.find((e) => e.id === q.examId);
      if (exam) {
        const inst = this.institutions.find((i) => i.id === exam.institutionId);
        const name = inst?.name || exam.institutionId;
        countsByInstitution[name] = (countsByInstitution[name] || 0) + 1;
      }
    });

    const totalAppearances = relatedQuestions.length;
    return {
      contentId,
      totalAppearances,
      countsByInstitution,
      rating: totalAppearances >= 10 ? 'Muito alta' : totalAppearances >= 5 ? 'Alta' : 'Média',
    };
  }

  /**
   * Recalcula o domínio de um conteúdo a partir da tríade (Teoria, Aplicação e Retenção)
   * Regra de Consolidação:
   * Consolidado se domínio >= 85%, aplicação >= 80%, retenção >= 80% e confiança adequada
   */
  recalculateContentAssessment(contentId: string): ContentAssessmentEntity {
    const existing = this.contentAssessments.find((a) => a.contentId === contentId);
    const fsrs = this.fsrsStates.find((f) => f.contentId === contentId);

    // 1. Conhecimento (Medway Teoria + Exercícios)
    const attempts = this.medwayExerciseAttempts.filter((att) => {
      const res = this.medwayResources.find((r) => r.id === att.resourceId);
      return res?.contentId === contentId;
    });
    const totalMedwayQuestions = attempts.reduce((acc, att) => acc + att.questionsCompleted, 0);
    const correctMedwayQuestions = attempts.reduce((acc, att) => acc + att.questionsCorrect, 0);
    const knowledgeScore = totalMedwayQuestions > 0 ? Math.round((correctMedwayQuestions / totalMedwayQuestions) * 100) : 70;

    // 2. Aplicação (Questões de Provas anteriores e simulados)
    const qRelated = this.questions.filter((q) => q.finalContentId === contentId);
    const qAttempts = this.questionAttempts.filter((qa) => qRelated.some((q) => q.id === qa.questionId));
    const totalAppQuestions = qAttempts.length;
    const correctAppQuestions = qAttempts.filter((qa) => qa.correct).length;
    const applicationScore = totalAppQuestions > 0 ? Math.round((correctAppQuestions / totalAppQuestions) * 100) : 68;

    // 3. Retenção (Osler & FSRS retrievability)
    const retentionScore = fsrs ? Math.round(fsrs.retrievability * 100) : 80;

    // Domínio Composto Ponderado: Conhecimento (25%) + Aplicação (45%) + Retenção (30%)
    const domainScore = Math.round(knowledgeScore * 0.25 + applicationScore * 0.45 + retentionScore * 0.3);

    // Confiança na estimativa
    const confidenceScore = Math.min(100, (totalMedwayQuestions + totalAppQuestions * 2) * 3 + 40);

    // Status de Consolidação
    let consolidationStatus: ConsolidationStatusEnum = 'IN_CONSOLIDATION';
    if (confidenceScore < 40) {
      consolidationStatus = 'NOT_EVALUATED';
    } else if (domainScore >= 85 && applicationScore >= 80 && retentionScore >= 80) {
      consolidationStatus = 'CONSOLIDATED';
    } else if (applicationScore < 65) {
      consolidationStatus = 'INSUFFICIENT';
    }

    const updated: ContentAssessmentEntity = {
      userId: existing?.userId || 'usr-leticia-01',
      contentId,
      domainScore,
      knowledgeScore,
      applicationScore,
      retentionScore,
      confidenceScore,
      consolidationStatus,
      calculatedAt: new Date().toISOString(),
    };

    // Atualiza ou insere
    const idx = this.contentAssessments.findIndex((a) => a.contentId === contentId);
    if (idx >= 0) {
      this.contentAssessments[idx] = updated;
    } else {
      this.contentAssessments.push(updated);
    }

    // Registra no histórico
    this.contentAssessmentHistory.push({
      id: `cah-${Date.now()}`,
      userId: updated.userId,
      contentId,
      domainScore,
      knowledgeScore,
      applicationScore,
      retentionScore,
      confidenceScore,
      date: new Date().toISOString().split('T')[0],
    });

    return updated;
  }

  /**
   * Recalcula a prioridade dinâmica de um conteúdo
   */
  recalculateContentPriority(contentId: string): ContentPriorityEntity {
    const assessment = this.contentAssessments.find((a) => a.contentId === contentId);
    const fsrs = this.fsrsStates.find((f) => f.contentId === contentId);
    const incidence = this.calculateIncidence(contentId);

    const domainDeficit = Math.max(0, 85 - (assessment?.domainScore || 60));
    const incidenceScore = Math.min(100, incidence.totalAppearances * 15 + 40);
    const fsrsUrgency = fsrs && fsrs.nextReviewAt && new Date(fsrs.nextReviewAt) <= new Date() ? 95 : 60;
    const deadlinePressure = 75; // Ritmo necessário de 2 anos

    // Fórmula da Prioridade: 35% déficit + 30% incidência + 25% FSRS + 10% pressão de prazo
    const score = Math.round(domainDeficit * 0.35 + incidenceScore * 0.3 + fsrsUrgency * 0.25 + deadlinePressure * 0.1);
    const urgency = score >= 85 ? 'ALTA' : score >= 70 ? 'MEDIA' : 'BAIXA';

    const priority: ContentPriorityEntity = {
      userId: 'usr-leticia-01',
      contentId,
      score,
      urgency,
      priorityLevel: score >= 85 ? 1 : 2,
      domainDeficit,
      incidenceScore,
      fsrsUrgency,
      deadlinePressure,
      calculatedAt: new Date().toISOString(),
    };

    const idx = this.contentPriorities.findIndex((p) => p.contentId === contentId);
    if (idx >= 0) {
      this.contentPriorities[idx] = priority;
    } else {
      this.contentPriorities.push(priority);
    }

    return priority;
  }

  /**
   * Registra uma sessão de estudo executada e atualiza o estado da atividade
   */
  recordStudySession(params: {
    userId: string;
    activityId: string;
    contentId: string;
    activeDurationMinutes: number;
    completionPercentage: number;
    notes?: string;
  }): StudySessionEntity {
    const session: StudySessionEntity = {
      id: `ses-${Date.now()}`,
      userId: params.userId,
      activityId: params.activityId,
      contentId: params.contentId,
      startedAt: new Date(Date.now() - params.activeDurationMinutes * 60000).toISOString(),
      endedAt: new Date().toISOString(),
      activeDurationMinutes: params.activeDurationMinutes,
      completionPercentage: params.completionPercentage,
      notes: params.notes,
    };

    this.studySessions.push(session);

    // Atualiza a atividade
    const act = this.activities.find((a) => a.id === params.activityId);
    if (act) {
      act.remainingMinutes = Math.max(0, act.remainingMinutes - params.activeDurationMinutes);
      if (act.remainingMinutes === 0 || params.completionPercentage >= 100) {
        act.status = 'COMPLETED';
        act.completedAt = session.endedAt;
      } else {
        act.status = 'PARTIALLY_COMPLETED';
      }
    }

    // Atualiza o progresso no plano semanal ativo
    const plan = this.weeklyPlans[0];
    if (plan) {
      plan.completedMinutes += params.activeDurationMinutes;
    }

    // Recalcula domínio e prioridade
    this.recalculateContentAssessment(params.contentId);
    this.recalculateContentPriority(params.contentId);

    return session;
  }

  /**
   * Registra uma resposta de questão de prova ou simulado
   */
  recordQuestionAttempt(params: {
    userId: string;
    questionId: string;
    correct: boolean;
    errorReason?: QuestionErrorReasonEnum;
    otherDescription?: string;
    durationSeconds?: number;
    notes?: string;
  }): QuestionAttemptEntity {
    const attempt: QuestionAttemptEntity = {
      id: `q-att-${Date.now()}`,
      userId: params.userId,
      questionId: params.questionId,
      date: new Date().toISOString().split('T')[0],
      correct: params.correct,
      errorReason: params.errorReason,
      otherDescription: params.otherDescription,
      durationSeconds: params.durationSeconds,
      notes: params.notes,
    };

    this.questionAttempts.push(attempt);

    // Localiza o conteúdo da questão e recalcula avaliação
    const question = this.questions.find((q) => q.id === params.questionId);
    if (question) {
      this.recalculateContentAssessment(question.finalContentId);
      this.recalculateContentPriority(question.finalContentId);
    }

    return attempt;
  }

  /**
   * Move uma atividade planejada para outro dia/posição, registrando auditoria
   */
  movePlannedActivity(params: {
    plannedActivityId: string;
    newDate: string;
    newStartTime?: string;
    reason?: string;
  }): PlanningChangeEntity | null {
    const pa = this.plannedActivities.find((p) => p.id === params.plannedActivityId);
    if (!pa) return null;

    const oldDate = pa.date;
    pa.date = params.newDate;
    if (params.newStartTime) pa.startTime = params.newStartTime;
    pa.source = 'USER'; // Marca que foi alterada pela usuária

    const change: PlanningChangeEntity = {
      id: `change-${Date.now()}`,
      weeklyPlanId: pa.weeklyPlanId,
      plannedActivityId: pa.id,
      action: 'MOVED',
      oldDate,
      newDate: params.newDate,
      createdAt: new Date().toISOString(),
      reason: params.reason || 'Usuária reorganizou o cronograma semanal',
    };

    this.planningChanges.push(change);
    return change;
  }

  /**
   * Retorna os 4 conceitos fundamentais de tempo:
   * 1. Capacidade (ex: 8h)
   * 2. Tempo Planejado (ex: 7h30)
   * 3. Tempo Realizado (início 0h, incrementado com sessões)
   * 4. Tempo Extraordinário (Simulados - FORA da capacidade regular de 8h!)
   */
  getFourTimesMetrics(): FourTimesMetrics {
    const plan = this.weeklyPlans[0];
    const capacityMinutes = plan?.availableMinutes || 480; // 8h
    const plannedMinutes = plan?.plannedMinutes || 450; // 7h30
    const realizedMinutes = plan?.completedMinutes ?? 0; // Início do zero (0 min)

    // Simulação realizada fora da carga regular (ex: Simulado Nacional 03 = 180 min / 3h)
    const extraordinarySimulationMinutes = 180;

    return {
      capacityMinutes,
      plannedMinutes,
      realizedMinutes,
      extraordinarySimulationMinutes,
    };
  }
}

// Instância singleton do banco relacional
export const db = new SynapseRelationalDatabase();
