import {
  PlanningActivityItem,
  DayCapacityConfig,
  WeekPresetType,
  ThreeClocksState,
  AdaptiveWeeklyBudget,
  PlanningDeficitState,
  FSRSLongTermLifecycleNode,
} from '../types';

/**
 * 📅 MOTOR DO ALGORITMO DE PLANEJAMENTO EM HORAS & HORIZONTE DE 2 ANOS
 * 
 * Regras Centrais:
 * 1. O algoritmo não preenche 100% do tempo com qualquer coisa: usa o tempo de forma ótima.
 * 2. Os 3 Relógios (Diário, Semanal, 2 Anos) conversam continuamente.
 * 3. Atividades têm dependências (Teoria -> Exercícios pós -> Revisão -> Questões).
 * 4. Fila por Eficiência (Benefício ÷ Tempo) sem canibalizar teorias longas (orçamento por blocos).
 * 5. Orçamento semanal balanceia: 🆕 Avanço, 🔄 Manutenção, 🎯 Aplicação, 🛠️ Recuperação.
 * 6. Redistribuição gradual de déficit (anti-bola-de-neve) com transparência se ultrapassar capacidade.
 * 7. Fracionamento inteligente de tarefas longas (ex: 1h35 em 45m + 45m + 5m).
 * 8. Horizonte de 2 Anos: NENHUM CONTEÚDO É APOSENTADO. Entra em manutenção espaçada FSRS.
 */

// ==========================================
// 1. CAPACIDADE DIÁRIA PADRÃO (TOTAL = 8h00)
// ==========================================
export const DEFAULT_WEEK_DAYS: DayCapacityConfig[] = [
  { key: 'segunda', label: 'SEGUNDA', date: '07 SET', capacityMin: 80, plannedStr: '1h20', status: 'nao_iniciado', suggestedProfile: 'misto' },
  { key: 'terca', label: 'TERÇA', date: '08 SET', capacityMin: 100, plannedStr: '1h40', status: 'nao_iniciado', suggestedProfile: 'atividades_longas' },
  { key: 'quarta', label: 'QUARTA', date: '09 SET', capacityMin: 60, plannedStr: '1h00', status: 'nao_iniciado', suggestedProfile: 'misto' },
  { key: 'quinta', label: 'QUINTA', date: '10 SET', capacityMin: 40, plannedStr: '0h40', status: 'nao_iniciado', suggestedProfile: 'atividades_curtas' },
  { key: 'sexta', label: 'SEXTA', date: '11 SET', capacityMin: 60, plannedStr: '1h00', status: 'nao_iniciado', suggestedProfile: 'misto' },
  { key: 'sabado', label: 'SÁBADO', date: '12 SET', capacityMin: 80, plannedStr: '1h20', status: 'nao_iniciado', suggestedProfile: 'atividades_longas' },
  { key: 'domingo', label: 'DOMINGO', date: '13 SET', capacityMin: 60, plannedStr: '1h00', status: 'nao_iniciado', suggestedProfile: 'atividades_curtas' },
];

export const WEEK_PRESETS: Record<
  WeekPresetType,
  { label: string; description: string; totalHours: number; days: { key: string; capacityMin: number; plannedStr: string }[] }
> = {
  normal_8h: {
    label: 'Semana Normal (8h)',
    description: 'Rotina balanceada de 8h/semana dividida ao longo dos 7 dias com foco em consistência.',
    totalHours: 8,
    days: [
      { key: 'segunda', capacityMin: 80, plannedStr: '1h20' },
      { key: 'terca', capacityMin: 100, plannedStr: '1h40' },
      { key: 'quarta', capacityMin: 60, plannedStr: '1h00' },
      { key: 'quinta', capacityMin: 40, plannedStr: '0h40' },
      { key: 'sexta', capacityMin: 60, plannedStr: '1h00' },
      { key: 'sabado', capacityMin: 80, plannedStr: '1h20' },
      { key: 'domingo', capacityMin: 60, plannedStr: '1h00' },
    ],
  },
  ferias_15h: {
    label: 'Semana de Férias (15h)',
    description: 'Intensivo com 15h semanais (2h a 2h30/dia) para acelerar avanço curricular ou recuperar margem.',
    totalHours: 15,
    days: [
      { key: 'segunda', capacityMin: 150, plannedStr: '2h30' },
      { key: 'terca', capacityMin: 150, plannedStr: '2h30' },
      { key: 'quarta', capacityMin: 120, plannedStr: '2h00' },
      { key: 'quinta', capacityMin: 120, plannedStr: '2h00' },
      { key: 'sexta', capacityMin: 120, plannedStr: '2h00' },
      { key: 'sabado', capacityMin: 150, plannedStr: '2h30' },
      { key: 'domingo', capacityMin: 90, plannedStr: '1h30' },
    ],
  },
  provas_4h: {
    label: 'Semana de Provas Faculdade (4h)',
    description: 'Carga reduzida de 4h (30 a 40 min/dia) para preservar revisões FSRS críticas sem sobrecarga.',
    totalHours: 4,
    days: [
      { key: 'segunda', capacityMin: 40, plannedStr: '0h40' },
      { key: 'terca', capacityMin: 40, plannedStr: '0h40' },
      { key: 'quarta', capacityMin: 30, plannedStr: '0h30' },
      { key: 'quinta', capacityMin: 30, plannedStr: '0h30' },
      { key: 'sexta', capacityMin: 30, plannedStr: '0h30' },
      { key: 'sabado', capacityMin: 40, plannedStr: '0h40' },
      { key: 'domingo', capacityMin: 30, plannedStr: '0h30' },
    ],
  },
  excepcional_10h30: {
    label: 'Semana Excepcional (10h30)',
    description: '10h30 disponíveis para amortizar atrasos ou realizar bloco denso de provas de residência.',
    totalHours: 10.5,
    days: [
      { key: 'segunda', capacityMin: 100, plannedStr: '1h40' },
      { key: 'terca', capacityMin: 120, plannedStr: '2h00' },
      { key: 'quarta', capacityMin: 90, plannedStr: '1h30' },
      { key: 'quinta', capacityMin: 60, plannedStr: '1h00' },
      { key: 'sexta', capacityMin: 90, plannedStr: '1h30' },
      { key: 'sabado', capacityMin: 100, plannedStr: '1h40' },
      { key: 'domingo', capacityMin: 70, plannedStr: '1h10' },
    ],
  },
  customizada: {
    label: 'Personalizada',
    description: 'Ajuste manual da capacidade de cada dia da semana conforme seus plantões e rotina.',
    totalHours: 8,
    days: [],
  },
};

// ==========================================
// 2. ORÇAMENTO SEMANAL ADAPTATIVO (4 CATEGORIAS)
// ==========================================
export const getAdaptiveWeeklyBudget = (
  totalHours: number,
  phaseOverride?: 'inicio' | 'meio' | 'final'
): AdaptiveWeeklyBudget => {
  // Fase padrão: início da preparação (0% concluído, começando agora os estudos)
  const phase = phaseOverride || 'inicio';

  if (phase === 'inicio') {
    return {
      phase: 'inicio',
      phaseName: 'Fase Inicial (Avanço Primário & Base Teórica)',
      avancoHours: Number((totalHours * 0.6).toFixed(1)),
      avancoPercent: 60,
      manutencaoHours: Number((totalHours * 0.25).toFixed(1)),
      manutencaoPercent: 25,
      aplicacaoHours: Number((totalHours * 0.15).toFixed(1)),
      aplicacaoPercent: 15,
      recuperacaoHours: 0,
      recuperacaoPercent: 0,
      totalHours,
      dynamicExplanation:
        'Foco primário em fazer o currículo andar (teoria + exercícios pré/pós), com primeiros cartões Osler e revisões iniciais.',
    };
  }

  if (phase === 'final') {
    return {
      phase: 'final',
      phaseName: 'Fase Final (Provas Reais, Simulados & Manutenção)',
      avancoHours: Number((totalHours * 0.15).toFixed(1)),
      avancoPercent: 15,
      manutencaoHours: Number((totalHours * 0.4).toFixed(1)),
      manutencaoPercent: 40,
      aplicacaoHours: Number((totalHours * 0.45).toFixed(1)),
      aplicacaoPercent: 45,
      recuperacaoHours: Number((totalHours * 0.1).toFixed(1)),
      recuperacaoPercent: 10,
      totalHours,
      dynamicExplanation:
        'Intensivo em aplicação real (provas completas, bancas-alvo), manutenção espaçada FSRS dos consolidados e ajuste de déficits finos.',
    };
  }

  // Meio
  return {
    phase: 'meio',
    phaseName: 'Fase Intermediária (Equilíbrio Dinâmico)',
    avancoHours: Number((totalHours * 0.4).toFixed(1)),
    avancoPercent: 40,
    manutencaoHours: Number((totalHours * 0.3).toFixed(1)),
    manutencaoPercent: 30,
    aplicacaoHours: Number((totalHours * 0.25).toFixed(1)),
    aplicacaoPercent: 25,
    recuperacaoHours: Number((totalHours * 0.05).toFixed(1)),
    recuperacaoPercent: 5,
    totalHours,
    dynamicExplanation:
      'Equilíbrio ótimo: 40% avanço em novos conteúdos essenciais, 30% manutenção FSRS contínua, 25% questões de bancas paulistas e 5% recuperação de lacunas.',
  };
};

// ==========================================
// 3. FILA CANÔNICA DE ATIVIDADES DESTA SEMANA (SEMANA 1 - INÍCIO DOS ESTUDOS)
// ==========================================
export const CANONICAL_PLANNING_ACTIVITIES: PlanningActivityItem[] = [
  // SEGUNDA (Total: 80 min / 1h20)
  {
    id: 'act-icc-teoria-sem1',
    contentId: 'c-icc',
    name: 'Insuficiência Cardíaca Congestiva (ICC)',
    subType: 'Teoria Medway (Bloco 1/2)',
    type: 'teoria',
    category: 'avanco',
    durationMin: 50,
    calibratedDurationMin: 50,
    priorityScore: 98,
    efficiencyPointsPerMin: 1.96,
    specialty: 'Clínica Médica',
    modulo: 'Cardiologia',
    recommendedDay: 'segunda',
    currentDay: 'segunda',
    status: 'pendente',
    idealDate: '07/09',
    deadlineDate: '10/09',
    whyNow: 'Top 1 de recorrência na USP-RP e principais bancas paulistas. Início da base teórica de Cardiologia.',
  },
  {
    id: 'act-icc-pos-sem1',
    contentId: 'c-icc',
    name: 'Insuficiência Cardíaca Congestiva (ICC)',
    subType: 'Exercícios pós-aula imediatos',
    type: 'exercicios_pos',
    category: 'avanco',
    durationMin: 30,
    calibratedDurationMin: 30,
    priorityScore: 92,
    efficiencyPointsPerMin: 3.06,
    specialty: 'Clínica Médica',
    modulo: 'Cardiologia',
    recommendedDay: 'segunda',
    currentDay: 'segunda',
    status: 'pendente',
    idealDate: '07/09',
    deadlineDate: '08/09',
    whyNow: 'Fixação imediata dos critérios de Framingham, perfis de Stevenson e drogas modificadoras de mortalidade.',
    dependencies: ['act-icc-teoria-sem1'],
  },

  // TERÇA (Total: 100 min / 1h40 - Dia de Bloco Denso)
  {
    id: 'act-dpoc-teoria-sem1',
    contentId: 'c-dpoc',
    name: 'Doença Pulmonar Obstrutiva Crônica (DPOC)',
    subType: 'Teoria Medway (Bloco Completo)',
    type: 'teoria',
    category: 'avanco',
    durationMin: 50,
    calibratedDurationMin: 50,
    priorityScore: 94,
    efficiencyPointsPerMin: 1.88,
    specialty: 'Clínica Médica',
    modulo: 'Pneumologia',
    recommendedDay: 'terca',
    currentDay: 'terca',
    status: 'pendente',
    idealDate: '08/09',
    deadlineDate: '11/09',
    whyNow: 'Avanço do módulo de Pneumologia. Conceitos de espirometria pós-BD e diretriz GOLD 2024.',
  },
  {
    id: 'act-dpoc-pos-sem1',
    contentId: 'c-dpoc',
    name: 'Doença Pulmonar Obstrutiva Crônica (DPOC)',
    subType: 'Exercícios pós-aula comentados',
    type: 'exercicios_pos',
    category: 'avanco',
    durationMin: 25,
    calibratedDurationMin: 25,
    priorityScore: 88,
    efficiencyPointsPerMin: 3.52,
    specialty: 'Clínica Médica',
    modulo: 'Pneumologia',
    recommendedDay: 'terca',
    currentDay: 'terca',
    status: 'pendente',
    idealDate: '08/09',
    deadlineDate: '09/09',
    whyNow: 'Treino de fixação para diferenciar Grupo A, B e E e critérios de oxigenoterapia.',
    dependencies: ['act-dpoc-teoria-sem1'],
  },
  {
    id: 'act-osler-primeiro-lote',
    contentId: 'c-icc',
    name: 'Primeiro Lote de Flashcards Osler',
    subType: 'Ativação inicial do algoritmo FSRS',
    type: 'osler',
    category: 'manutencao',
    durationMin: 25,
    calibratedDurationMin: 25,
    priorityScore: 85,
    efficiencyPointsPerMin: 3.4,
    specialty: 'Clínica Médica',
    modulo: 'Cardiologia & Pneumologia',
    recommendedDay: 'terca',
    currentDay: 'terca',
    status: 'pendente',
    idealDate: '08/09',
    deadlineDate: '09/09',
    whyNow: 'Inauguração do espaçamento FSRS para os conceitos vistos em ICC e DPOC.',
  },

  // QUARTA (Total: 60 min / 1h00)
  {
    id: 'act-atls-teoria-sem1',
    contentId: 'c-trauma-atls',
    name: 'ATLS 10ª Ed — Choque no Trauma & ABCDE',
    subType: 'Teoria Medway + Protocolos',
    type: 'teoria',
    category: 'avanco',
    durationMin: 40,
    calibratedDurationMin: 40,
    priorityScore: 90,
    efficiencyPointsPerMin: 2.25,
    specialty: 'Cirurgia Geral',
    modulo: 'Trauma & Urgências Cirúrgicas',
    recommendedDay: 'quarta',
    currentDay: 'quarta',
    status: 'pendente',
    idealDate: '09/09',
    deadlineDate: '12/09',
    whyNow: 'Abertura de Cirurgia Geral pelo tema com maior incidência estatística no internato e residência.',
  },
  {
    id: 'act-atls-pos-sem1',
    contentId: 'c-trauma-atls',
    name: 'ATLS 10ª Ed — Choque no Trauma & ABCDE',
    subType: 'Exercícios de fixação de classes de choque',
    type: 'exercicios_pos',
    category: 'avanco',
    durationMin: 20,
    calibratedDurationMin: 20,
    priorityScore: 86,
    efficiencyPointsPerMin: 4.3,
    specialty: 'Cirurgia Geral',
    modulo: 'Trauma & Urgências Cirúrgicas',
    recommendedDay: 'quarta',
    currentDay: 'quarta',
    status: 'pendente',
    idealDate: '09/09',
    deadlineDate: '10/09',
    whyNow: 'Fixação das condutas de choque hemorrágico classes I a IV.',
    dependencies: ['act-atls-teoria-sem1'],
  },

  // QUINTA (Total: 40 min / 0h40 - Dia Curto: Atividades Rápidas)
  {
    id: 'act-fixacao-quinta',
    contentId: 'c-icc',
    name: 'Bateria Rápida de Fixação (Cardio + Pneumo)',
    subType: '15 questões de raciocínio direto',
    type: 'questoes_prova',
    category: 'aplicacao',
    durationMin: 40,
    calibratedDurationMin: 40,
    priorityScore: 82,
    efficiencyPointsPerMin: 2.05,
    specialty: 'Clínica Médica',
    modulo: 'Cardiologia & Pneumologia',
    recommendedDay: 'quinta',
    currentDay: 'quinta',
    status: 'pendente',
    idealDate: '10/09',
    deadlineDate: '11/09',
    whyNow: 'Custo-benefício otimizado para dia com menor tempo disponível (40 min).',
  },

  // SEXTA (Total: 60 min / 1h00)
  {
    id: 'act-dheg-teoria-sem1',
    contentId: 'c-dheg',
    name: 'Síndromes Hipertensivas na Gestação & Pré-Eclâmpsia',
    subType: 'Teoria Medway + Critérios de Gravidade',
    type: 'teoria',
    category: 'avanco',
    durationMin: 35,
    calibratedDurationMin: 35,
    priorityScore: 89,
    efficiencyPointsPerMin: 2.54,
    specialty: 'Ginecologia e Obstetrícia',
    modulo: 'Obstetrícia Geral & Alto Risco',
    recommendedDay: 'sexta',
    currentDay: 'sexta',
    status: 'pendente',
    idealDate: '11/09',
    deadlineDate: '14/09',
    whyNow: 'Abertura de GO com foco no tema com maior índice de questões nas bancas paulistas.',
  },
  {
    id: 'act-dheg-pos-sem1',
    contentId: 'c-dheg',
    name: 'Síndromes Hipertensivas na Gestação & Pré-Eclâmpsia',
    subType: 'Exercícios de sulfato de magnésio e condutas',
    type: 'exercicios_pos',
    category: 'avanco',
    durationMin: 25,
    calibratedDurationMin: 25,
    priorityScore: 84,
    efficiencyPointsPerMin: 3.36,
    specialty: 'Ginecologia e Obstetrícia',
    modulo: 'Obstetrícia Geral & Alto Risco',
    recommendedDay: 'sexta',
    currentDay: 'sexta',
    status: 'pendente',
    idealDate: '11/09',
    deadlineDate: '12/09',
    whyNow: 'Diferenciação de esquema Pritchard vs Zuspan e conduta na eclâmpsia.',
    dependencies: ['act-dheg-teoria-sem1'],
  },

  // SÁBADO (Total: 80 min / 1h20 - Aplicação em Provas Reais)
  {
    id: 'act-provas-iniciais-bloco',
    contentId: 'c-provas-bloco',
    name: 'Primeiro Bloco de Questões de Banca Real',
    subType: '20 questões selecionadas das bancas prioritárias',
    type: 'questoes_prova',
    category: 'aplicacao',
    durationMin: 50,
    calibratedDurationMin: 50,
    priorityScore: 92,
    efficiencyPointsPerMin: 1.84,
    specialty: 'Multidisciplinar',
    modulo: 'Provas Reais',
    recommendedDay: 'sabado',
    currentDay: 'sabado',
    status: 'pendente',
    idealDate: '12/09',
    deadlineDate: '12/09',
    whyNow: 'Primeiro contato com o estilo de cobrança das bancas selecionadas nos temas estudados na semana.',
  },
  {
    id: 'act-inauguracao-caderno-erros',
    contentId: 'c-provas-bloco',
    name: 'Inauguração do Caderno de Erros Estruturado',
    subType: 'Classificação da causa raiz (Cérebro 1 vs Cérebro 2)',
    type: 'analise_erros',
    category: 'recuperacao',
    durationMin: 30,
    calibratedDurationMin: 30,
    priorityScore: 88,
    efficiencyPointsPerMin: 2.93,
    specialty: 'Multidisciplinar',
    modulo: 'Provas Reais',
    recommendedDay: 'sabado',
    currentDay: 'sabado',
    status: 'pendente',
    idealDate: '12/09',
    deadlineDate: '13/09',
    whyNow: 'Catalogar os primeiros erros para calibrar as 4 dimensões de domínio.',
    dependencies: ['act-provas-iniciais-bloco'],
  },

  // DOMINGO (Total: 60 min / 1h00 - Leitura de Diretrizes & Fechamento)
  {
    id: 'act-consolidacao-domingo',
    contentId: 'c-consolidacao-sem1',
    name: 'Consolidação Curricular da Semana 1',
    subType: 'Leitura de fluxogramas e síntese dos módulos',
    type: 'teoria',
    category: 'avanco',
    durationMin: 60,
    calibratedDurationMin: 60,
    priorityScore: 78,
    efficiencyPointsPerMin: 1.3,
    specialty: 'Multidisciplinar',
    modulo: 'Consolidação Semanal',
    recommendedDay: 'domingo',
    currentDay: 'domingo',
    status: 'pendente',
    idealDate: '13/09',
    deadlineDate: '13/09',
    whyNow: 'Fechamento da meta semanal de 8 horas com 100% de aderência.',
  },
];

// ==========================================
// 4. CICLO DE VIDA DE 2 ANOS: "NENHUM CONTEÚDO É APOSENTADO"
// (Exemplo Canônico de Insuficiência Cardíaca - ICC)
// ==========================================
export const ICC_TWO_YEAR_FSRS_LADDER: FSRSLongTermLifecycleNode[] = [
  {
    month: 1,
    label: 'Mês 1 (Aquisição Inicial)',
    action: 'Teoria Medway (40m) + Exercícios pós (25m) + Primeiros Osler (15m)',
    domainScore: 74,
    intervalDays: 3,
    performance: 'Bom',
    notes: 'Exposição inicial e fixação de fisiopatologia básica. Primeira revisão FSRS programada para 3 dias.',
  },
  {
    month: 2,
    label: 'Mês 2 (Primeira Consolidação)',
    action: 'Revisão FSRS + 10 Questões de fixação',
    domainScore: 82,
    intervalDays: 14,
    performance: 'Excelente',
    notes: 'Bom desempenho comprovado na recuperação ativa. O FSRS aumenta o intervalo para 14 dias.',
  },
  {
    month: 4,
    label: 'Mês 4 (Entrada na Meta de 85%)',
    action: 'Revisão espaçada de perfis hemodinâmicos + Osler',
    domainScore: 88,
    intervalDays: 45,
    performance: 'Excelente',
    notes: 'Domínio atingiu 88% (≥85%). Conteúdo migra de "Aprendizado" para "Manutenção Adaptativa". O intervalo aumenta para 45 dias.',
  },
  {
    month: 8,
    label: 'Mês 8 (Detecção de Queda de Domínio)',
    action: 'Simulado identificou erro em Stevenson C e queda na retenção de doses',
    domainScore: 79,
    intervalDays: 7,
    performance: 'Queda detectada',
    isDecayWarning: true,
    notes: '⚠️ QUEDA DE DOMÍNIO (88% → 79%): O sistema NÃO aposentou o conteúdo! Ao detectar retrievabilidade de 79%, reintroduz na grade com revisão prioritária e questões em 7 dias.',
  },
  {
    month: 9,
    label: 'Mês 9 (Resgate & Re-consolidação)',
    action: 'Intervenção direcionada: Revisão de Stevenson + 15 questões USP',
    domainScore: 91,
    intervalDays: 60,
    performance: 'Recuperado',
    notes: 'Resgate bem-sucedido! Domínio sobe para 91%. O intervalo de manutenção volta a crescer de forma adaptativa para 60 dias.',
  },
  {
    month: 14,
    label: 'Mês 14 (Manutenção Profunda)',
    action: 'Revisão rápida de flashcards (10m)',
    domainScore: 92,
    intervalDays: 120,
    performance: 'Excelente',
    notes: 'Recuperação com custo mínimo de tempo: gasta-se cada vez menos minutos mantendo o conhecimento que já está sólido.',
  },
  {
    month: 20,
    label: 'Mês 20 (Reta Final & Provas Reais)',
    action: 'Bloco de provas reais da residência (questões mistas)',
    domainScore: 94,
    intervalDays: 45,
    performance: 'Excelente',
    notes: 'Manutenção ativa e viva até o dia da prova. 100% dos conteúdos consolidados e testados em condições de exame.',
  },
];

// ==========================================
// 5. CASO DE HONESTIDADE EM EVIDÊNCIA RECENTE
// ==========================================
export const PROVISIONAL_EVIDENCE_CASE = {
  contentName: 'Endocardite em Usuários de Drogas Injetáveis',
  studiedDaysBeforeDeadline: 10,
  rawScorePercent: 90,
  isProvisional: true,
  headline: '🟡 Domínio provisório: 90% • Confiança: Baixa',
  badges: [
    { label: 'Domínio Provisório: 90%', color: 'amber' },
    { label: 'Confiança: Baixa', color: 'amber' },
    { label: 'Aplicação: Não avaliada em provas', color: 'secondary' },
    { label: 'Retenção: Em avaliação FSRS', color: 'secondary' },
  ],
  explanation:
    'Você estudou este conteúdo há 10 dias e acertou 90% dos exercícios de fixação imediata. O algoritmo NUNCA declara "Domínio Comprovado de 90%" prematuramente: a retenção no tempo e o teste em provas reais de residência ainda não foram submetidos a ciclos de espaçamento suficientes.',
};

// ==========================================
// 6. MOTOR DE AMORTIZAÇÃO DE DÉFICIT
// ==========================================
export const calculateDeficitImpact = (
  deficitHours: number,
  weeklyCapacityHours: number = 8,
  weeksRemaining: number = 96
): PlanningDeficitState => {
  // Se déficit é pequeno (ex: 3h em 96 semanas)
  const isLargeDeficit = deficitHours >= 30; // ex: 40h de déficit (5 semanas perdidas)

  const amortizationPerWeekMin = Math.round((deficitHours * 60) / weeksRemaining);
  const paceNeededHours = Number((weeklyCapacityHours + deficitHours / weeksRemaining).toFixed(2));

  if (!isLargeDeficit) {
    return {
      accumulatedDeficitHours: deficitHours,
      weeksRemaining,
      amortizationPerWeekMin: Math.max(3, amortizationPerWeekMin),
      paceNeededHours,
      paceStatus: 'no_ritmo',
      isPaceExceeded: false,
      delayWeeksIfFixedPace: 0,
      correctiveOptions: [],
    };
  }

  // Déficit grande (ex: 40h de déficit = 5 semanas inteiras sem estudar)
  const delayedWeeks = Math.ceil(deficitHours / weeklyCapacityHours); // 40h / 8h = 5 a 6 semanas

  return {
    accumulatedDeficitHours: deficitHours,
    weeksRemaining,
    amortizationPerWeekMin,
    paceNeededHours: Number((weeklyCapacityHours + 0.75).toFixed(2)), // 8h45
    paceStatus: 'risco',
    isPaceExceeded: true,
    delayWeeksIfFixedPace: delayedWeeks,
    correctiveOptions: [
      {
        id: 'opt-aumentar-tempo',
        label: `Aumentar +45 min/semana (Total: 8h45/semana)`,
        description: 'Compensa as 40h diluídas ao longo das 96 semanas restantes sem estresse diário.',
        actionType: 'aumentar_tempo',
      },
      {
        id: 'opt-adicionar-ferias',
        label: `Adicionar 3 semanas de férias com 15h/semana`,
        description: 'Concentra a recuperação em períodos de menor demanda acadêmica/internato.',
        actionType: 'adicionar_semanas_ferias',
      },
      {
        id: 'opt-reduzir-raros',
        label: `Despriorizar conteúdos raros (Incidência < 20)`,
        description: 'Mantém o prazo em 8h00 preservando 100% dos conteúdos com incidência média e alta.',
        actionType: 'reduzir_raros',
      },
    ],
  };
};

// ==========================================
// 7. CALIBRAÇÃO DE DURAÇÃO ESTIMADA PELO RITMO REAL
// ==========================================
export const DURATION_CALIBRATION_FACTORS = {
  teoria: {
    baseEstimatedMin: 40,
    userLoggedAverageMin: 50,
    factor: 1.25,
    phrase: 'Você costuma levar 50 min em teorias estimadas em 40 min (+25% no ritmo real).',
  },
  questoes_prova: {
    baseEstimatedMin: 30, // para 20 questões
    userLoggedAverageMin: 42,
    factor: 1.4,
    phrase: 'Seu histórico mostra 42 min para blocos de 20 questões com leitura atenta de comentários.',
  },
  osler: {
    baseEstimatedMin: 15,
    userLoggedAverageMin: 14,
    factor: 0.93,
    phrase: 'Ritmo rápido e preciso em resgate de flashcards Osler.',
  },
};
