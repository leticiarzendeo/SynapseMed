import {
  AreaItem,
  ContentItem,
  ErrorReasonType,
  ExamSubmission,
  Flashcard,
  GlobalSimuladoHistoryItem,
  OslerBlock,
  SourceMapping,
  StudyActivity,
  UserPreferences,
  WeeklyCapacityPlan,
} from '../types';
import { medwayCurriculumHierarchy } from './medwayCurriculum';
import { defaultOslerBlocks, defaultSourceMappings } from './oslerCatalogData';

export const initialPreferences: UserPreferences = {
  name: 'Letícia Rezende',
  weeklyHoursTarget: 8.0,
  weeklyHoursLogged: 0, // 0h estudadas - Início de estudos
  availableTodayMinutes: 90, // 1h30
  targetYearTimeline: '2 Anos',
  targetDeadlineDate: '2028-09-07',
  targetInstitutions: ['USP-SP', 'UNIFESP', 'UNICAMP', 'ENARE', 'SUS-SP'],
  cycle: 'Ciclo Regular • 8h semanais',
};

export const errorReasonConfig: Record<
  ErrorReasonType,
  { label: string; icon: string; description: string; clinicalStrategy: string; color: string }
> = {
  nao_sabia: {
    label: 'Não sabia (lacuna teórica)',
    icon: 'menu_book',
    description: 'Conceito, classificação ou diretriz nunca vistos ou não aprendidos.',
    clinicalStrategy: 'Retorno focado à teoria e mapa conceitual da Medway antes de insistir em questões.',
    color: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  esqueci: {
    label: 'Esqueci (falha de memória)',
    icon: 'history_toggle_off',
    description: 'Conteúdo já estudado, mas esquecido pela curva de esquecimento.',
    clinicalStrategy: 'Ajuste de intervalo no algoritmo FSRS e inclusão prioritária no lote de flashcards Osler.',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  interpretacao: {
    label: 'Interpretei a questão errado',
    icon: 'troubleshoot',
    description: 'Compreendeu mal o caso clínico, queixa principal ou a conduta exata pedida.',
    clinicalStrategy: 'Treino de leitura diagnóstica estruturada e sublinhado de pistas clínicas no enunciado.',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  desatencao: {
    label: 'Desatenção / Pegadinha',
    icon: 'visibility_off',
    description: 'Passou batido por palavras-chave ("incorreta", "exceto", "urgência") ou unidades.',
    clinicalStrategy: 'Leitura reversa de opções e pausa tática de 5 segundos antes de assinalar o gabarito.',
    color: 'text-orange-700 bg-orange-50 border-orange-200',
  },
  entre_duas: {
    label: 'Fiquei entre duas alternativas',
    icon: 'compare_arrows',
    description: 'Eliminou as absurdas, mas hesitou entre a conduta ideal e a alternativa limítrofe.',
    clinicalStrategy: 'Construção de tabela comparativa de diagnósticos diferenciais e critérios de corte.',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  raciocinio: {
    label: 'Erro de raciocínio clínico',
    icon: 'psychology',
    description: 'Seguiu uma linha fisiopatológica lógica, mas escolheu conduta não preconizada.',
    clinicalStrategy: 'Revisão dos fluxogramas oficiais de conduta terapêutica da SBC, SBPT ou MS.',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  outro: {
    label: 'Outro motivo',
    icon: 'edit_note',
    description: 'Fadiga, falta de tempo ou ambiguidade no gabarito da banca.',
    clinicalStrategy: 'Registro qualitativo individual no Caderno de Erros para acompanhamento.',
    color: 'text-secondary bg-surface-container border-surface-container-high',
  },
};

// Matriz completa da Árvore de Currículo (Área → Módulo → Conteúdo → Recursos/Atividades)
// Integrada com o Currículo Oficial da Medway (236 conteúdos)
export const fullCurriculumHierarchy: AreaItem[] = medwayCurriculumHierarchy;

// Helper: Retorna todos os conteúdos cadastrados de forma linear
export function getAllCurriculumContents(): ContentItem[] {
  const all: ContentItem[] = [];
  for (const area of fullCurriculumHierarchy) {
    for (const mod of area.modules) {
      for (const c of mod.contents) {
        all.push(c);
      }
    }
  }
  return all;
}

// Helper: Totais globais baseados nos 236 conteúdos oficiais da Medway
export function getCurriculumTotals() {
  const all = getAllCurriculumContents();
  const total = all.length || 236;
  const studied = all.filter((c) => c.isStudied).length;
  const consolidated = all.filter((c) => c.isConsolidated).length;
  const pending = total - studied;
  return {
    total,
    studied,
    consolidated,
    pending,
    studiedPercent: Math.round((studied / total) * 100),
    consolidatedPercent: Math.round((consolidated / total) * 100),
  };
}

// Planejamento Semanal com Capacidade Flexível (Regra dos 2 anos)
export const initialWeeklyPlans: WeeklyCapacityPlan[] = [
  { weekNumber: 1, label: 'Semana 1 (Atual)', availableHours: 8.0, loggedHours: 0, status: 'em_andamento', isCustom: false },
  { weekNumber: 2, label: 'Semana 2', availableHours: 8.0, loggedHours: 0, status: 'planejada', isCustom: false },
  { weekNumber: 3, label: 'Semana 3', availableHours: 8.0, loggedHours: 0, status: 'planejada', isCustom: false },
  { weekNumber: 4, label: 'Semana 4 (Provas Faculdade)', availableHours: 4.0, loggedHours: 0, status: 'planejada', isCustom: true, customNote: 'Internato e provas curriculares — algoritmo reduziu carga sem penalidade.' },
  { weekNumber: 5, label: 'Semana 5', availableHours: 8.0, loggedHours: 0, status: 'planejada', isCustom: false },
  { weekNumber: 6, label: 'Semana 6 (Recesso / Férias)', availableHours: 15.0, loggedHours: 0, status: 'planejada', isCustom: true, customNote: 'Férias de internato — janela estendida para adiantar clínica médica.' },
  { weekNumber: 7, label: 'Semana 7', availableHours: 8.0, loggedHours: 0, status: 'planejada', isCustom: false },
  { weekNumber: 8, label: 'Semana 8', availableHours: 8.0, loggedHours: 0, status: 'planejada', isCustom: false },
];

export const initialActivities: StudyActivity[] = [
  {
    id: 'icc-theory-session',
    contentId: 'c-icc',
    title: 'ICC — Insuficiência Cardíaca Congestiva',
    specialty: 'Clínica Médica',
    subspecialty: 'Cardiologia',
    type: 'avanco',
    typeLabel: 'Teoria Medway (Avanço Curricular)',
    priority: 'alta',
    priorityLabel: 'Alta prioridade',
    estimatedTime: '50 min',
    summaryReason: 'Top 1 em incidência nas bancas selecionadas (USP-RP, USP-SP, ENARE). Início do ciclo curricular.',
    description: 'Videoaula Medway + Fisiopatologia, classificação funcional NYHA e perfis clínicos de Stevenson.',
    status: 'pendente',
    currentStep: 0,
    totalSteps: 20,
    remainingMinutes: 50,
    whyThisMatters: {
      currentMastery: 0,
      targetMastery: 85,
      examApplication: 0,
      examApplicationStatus: 'Não iniciado',
      examIncidence: 'Top 1 nas bancas selecionadas (USP-RP: 19q, USP-SP, ENARE)',
      retention: 0,
      justification: 'Início de ciclo: abertura teórica obrigatória para o tema mais recorrente em Cardiologia nas provas de residência.',
    },
  },
  {
    id: 'dpoc-theory-session',
    contentId: 'c-dpoc',
    title: 'DPOC — Doença Pulmonar Obstrutiva Crônica',
    specialty: 'Clínica Médica',
    subspecialty: 'Pneumologia',
    type: 'avanco',
    typeLabel: 'Teoria Medway (Avanço Curricular)',
    priority: 'alta',
    priorityLabel: 'Alta prioridade',
    estimatedTime: '40 min',
    summaryReason: 'Alta incidência nas bancas paulistas e nacionais. Base diagnóstica e espirometria.',
    description: 'Videoaula Medway + critérios GOLD 2024, espirometria (VEF1/CVF pós-BD) e oxigenoterapia domiciliar.',
    status: 'pendente',
    currentStep: 0,
    totalSteps: 20,
    remainingMinutes: 40,
    whyThisMatters: {
      currentMastery: 0,
      targetMastery: 85,
      examApplication: 0,
      examApplicationStatus: 'Não iniciado',
      examIncidence: 'Alta (8 a 10 questões/ciclo)',
      retention: 0,
      justification: 'Início do módulo de Pneumologia: base conceitual antes do primeiro lote de pós-exercícios.',
    },
  },
  {
    id: 'atls-theory-session',
    contentId: 'c-trauma-atls',
    title: 'ATLS 10ª Ed — Atendimento Inicial & Choque no Trauma',
    specialty: 'Cirurgia Geral',
    subspecialty: 'Trauma & Urgências',
    type: 'avanco',
    typeLabel: 'Teoria Medway (Avanço Curricular)',
    priority: 'alta',
    priorityLabel: 'Alta prioridade',
    estimatedTime: '35 min',
    summaryReason: 'Maior peso estatístico de Cirurgia Geral nas provas de acesso direto.',
    description: 'Sistematização ABCDE do trauma, classes de choque hipovolêmico e ressuscitação hemostática.',
    status: 'pendente',
    currentStep: 0,
    totalSteps: 15,
    remainingMinutes: 35,
    whyThisMatters: {
      currentMastery: 0,
      targetMastery: 85,
      examApplication: 0,
      examApplicationStatus: 'Não iniciado',
      examIncidence: 'Altíssima incidência em todas as bancas de SP e ENARE',
      retention: 0,
      justification: 'Abertura de Cirurgia Geral pelo conteúdo com maior probabilidade matemática de acerto em prova.',
    },
  },
];

// Caderno de Erros Inicial com Motivo Estruturado
export const initialCadernoErros: {
  id: string;
  topic: string;
  specialty: string;
  reason: string;
  reasonCategory: ErrorReasonType;
  institutionOrContext: string;
  createdAt: string;
  examType: 'PROVA_REAL' | 'SIMULADO';
}[] = [];

// Provas Reais e Simulados com questões mapeadas à Árvore de Conteúdos
export const initialExamSubmissions: ExamSubmission[] = [];

export const dpocFlashcards: Flashcard[] = [
  {
    id: 'f1',
    specialty: 'Clínica Médica',
    subspecialty: 'Pneumologia',
    topic: 'DPOC',
    front: 'Qual o critério espirométrico diagnóstico mandatório para confirmar limitação crônica ao fluxo aéreo na DPOC?',
    back: 'Relação VEF1/CVF < 0,70 (ou < Limite Inferior da Normalidade - LIN) após uso de broncodilatador inalatório.',
    nextReviewDays: 14,
    retentionScore: 88,
    difficulty: 'bom',
  },
  {
    id: 'f2',
    specialty: 'Clínica Médica',
    subspecialty: 'Pneumologia',
    topic: 'DPOC',
    front: 'Quais são as duas intervenções comprovadamente capazes de reduzir a mortalidade em pacientes com DPOC avançada?',
    back: '1. Cessação do tabagismo.\n2. Oxigenoterapia domiciliar prolongada (≥ 15h/dia) quando PaO2 ≤ 55 mmHg (ou SatO2 ≤ 88%) em repouso.',
    nextReviewDays: 21,
    retentionScore: 92,
    difficulty: 'facil',
  },
  {
    id: 'f3',
    specialty: 'Clínica Médica',
    subspecialty: 'Pneumologia',
    topic: 'DPOC',
    front: 'Na classificação GOLD 2024 (Grupo A, B, E), quem são os pacientes classificados no Grupo E?',
    back: 'Pacientes exacerbadores frequentes: com histórico de ≥ 2 exacerbações moderadas no ano anterior OU ≥ 1 exacerbação que levou à internação hospitalar (independentemente dos sintomas CAT/mMRC). Conduta inicial: LABA + LAMA (ou LABA + LAMA + CI se eosinófilos ≥ 300).',
    nextReviewDays: 5,
    retentionScore: 68,
    difficulty: 'dificil',
  },
];

// Compatibilidade para componentes legados que importavam curriculumAreas
export const curriculumAreas = fullCurriculumHierarchy.map((area) => ({
  id: area.id,
  name: area.name,
  icon: area.icon,
  totalHours: area.totalHours,
  completedHours: Math.round(area.totalHours * (area.studiedContents / area.totalContents)),
  coveragePercent: Math.round((area.studiedContents / area.totalContents) * 100),
  masteryPercent: area.avgMastery,
  topics: area.modules.flatMap((m) =>
    m.contents.map((c) => ({
      id: c.id,
      title: c.name,
      incidence: c.incidence.generalRating === 'Muito alta' || c.incidence.generalRating === 'Alta' ? 'Alta' as const : 'Média' as const,
      mastery: c.estimatedMastery,
      status: c.status,
      lastStudied: c.lastStudiedDate || 'Pendente',
    }))
  ),
}));

export const mockExamSubmissions: ExamSubmission[] = [
  {
    id: 'sub-enare-2024',
    title: 'Exame Nacional de Residência - ENARE 2024 (Acesso Direto)',
    type: 'PROVA_REAL',
    institution: 'ENARE / FGV',
    year: 2024,
    dateLogged: '2026-08-28',
    totalQuestions: 100,
    correctCount: 79,
    scorePercent: 79,
    questions: [
      {
        id: 'q-enare-14',
        questionNumber: 14,
        statementSnippet: 'Paciente de 68 anos com ICFER classe III NYHA e ritmo sinusal mantendo sintomas com IECA e Betabloqueador em dose máxima tolerada...',
        contentId: 'c-icc',
        contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
        moduloName: 'Cardiologia',
        areaName: 'Clínica Médica',
        isCorrect: true,
        aiSuggestedContentId: 'c-icc',
      },
      {
        id: 'q-enare-22',
        questionNumber: 22,
        statementSnippet: 'Homem de 54 anos em investigação de hipertensão refratária com clearance de creatinina estimado em 24 ml/min/1,73m²...',
        contentId: 'c-drc',
        contentName: 'Doença Renal Crônica (DRC) e Síndromes Urêmicas',
        moduloName: 'Nefrologia',
        areaName: 'Clínica Médica',
        isCorrect: false,
        errorReason: 'entre_duas',
        userCorrectionNote: 'Fiquei na dúvida entre início de iSGLT2 e ajuste dietético para hiperfosfatemia.',
        aiSuggestedContentId: 'c-drc',
      },
      {
        id: 'q-39',
        questionNumber: 39,
        statementSnippet: 'Vítima de colisão auto x anteparo fixo trazida com hipotensão, murmúrio vesicular abolido à esquerda e turgência jugular patológica...',
        contentId: 'c-atls',
        contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)',
        moduloName: 'Trauma & Urgências Cirúrgicas',
        areaName: 'Cirurgia Geral',
        isCorrect: true,
        aiSuggestedContentId: 'c-atls',
      },
      {
        id: 'q-58',
        questionNumber: 58,
        statementSnippet: 'Primigesta de 32 semanas admitida com PA 165x110 mmHg, cefaleia refratária e escotomas cintilantes...',
        contentId: 'c-dheg',
        contentName: 'Síndromes Hipertensivas na Gestação & Pré-Eclâmpsia',
        moduloName: 'Obstetrícia Geral & Alto Risco',
        areaName: 'Ginecologia e Obstetrícia',
        isCorrect: true,
        aiSuggestedContentId: 'c-dheg',
      },
      {
        id: 'q-74',
        questionNumber: 74,
        statementSnippet: 'Lactente de 4 meses com tosse paroxística, coriza hialina e cianose perioral desencadeada por acessos respiratórios...',
        contentId: 'c-bronquiolite',
        contentName: 'Infecções Respiratórias Agudas & Bronquiolite',
        moduloName: 'Pneumopediatria & Neonatologia',
        areaName: 'Pediatria',
        isCorrect: false,
        errorReason: 'interpretacao',
        userCorrectionNote: 'Interpretei como coqueluche quando o quadro era compatível com bronquiolite viral.',
        aiSuggestedContentId: 'c-bronquiolite',
      },
      {
        id: 'q-91',
        questionNumber: 91,
        statementSnippet: 'Cálculo de Sensibilidade, Especificidade e Valor Preditivo Positivo em teste de triagem de câncer colorretal...',
        contentId: 'c-estudos',
        contentName: 'Delineamento de Estudos & Testes Diagnósticos',
        moduloName: 'Epidemiologia Clínica & Bioestatística',
        areaName: 'Medicina Preventiva e Social',
        isCorrect: true,
        aiSuggestedContentId: 'c-estudos',
      },
    ],
  },
];

export const mockSimulados = [
  {
    id: 'sim-1',
    title: 'Simulado Nacional ENARE 2025 #3',
    institution: 'ENARE / FGV',
    questionsCount: 100,
    scheduledDate: 'Próximo Sábado, 14/09 às 08:00',
    duration: '4h00',
    status: 'agendado',
    type: 'SIMULADO',
    targetScore: '82%',
  },
];

// Histórico Longitudinal de Simulados (Vazio ao iniciar estudos)
export const mockGlobalSimuladosHistory: GlobalSimuladoHistoryItem[] = [];

// Regra Estrutural nº 1: Catálogo de Títulos/Blocos cadastrados no Osler (332 blocos vinculados ao currículo Medway)
export const initialOslerBlocks: OslerBlock[] = defaultOslerBlocks;

// Regra Estrutural nº 1: Entidade intermediária "Mapeamento de Fontes" (Relação N:M Medway ↔ Osler - 339 mapeamentos oficiais)
export const initialSourceMappings: SourceMapping[] = defaultSourceMappings;


