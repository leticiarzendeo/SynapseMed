import { TargetInstitutionKey, ExamSubmission, ExamQuestionEntry } from '../types';

export interface TargetInstitutionMetadata {
  key: TargetInstitutionKey;
  shortName: string;
  fullName: string;
  state: string;
  badgeColor: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  description: string;
  totalExamsAvailable: number;
}

export const TARGET_INSTITUTIONS_LIST: TargetInstitutionKey[] = [
  'USP-RP',
  'USP-SP',
  'UNICAMP',
  'ENAMED',
  'HIAE',
];

export const TARGET_INSTITUTIONS_CONFIG: Record<TargetInstitutionKey, TargetInstitutionMetadata> = {
  'USP-RP': {
    key: 'USP-RP',
    shortName: 'USP-RP',
    fullName: 'Universidade de São Paulo - Ribeirão Preto (FMRP-USP)',
    state: 'SP',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    bgLight: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    description: 'Banca tradicional com casos clínicos extensos, raciocínio fisiopatológico e propedêutica detalhada.',
    totalExamsAvailable: 5,
  },
  'USP-SP': {
    key: 'USP-SP',
    shortName: 'USP-SP',
    fullName: 'Universidade de São Paulo - São Paulo (FMUSP)',
    state: 'SP',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    bgLight: 'bg-blue-50/70',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    description: 'Referência nacional com foco em diretrizes atualizadas, exames de imagem e condutas terciárias.',
    totalExamsAvailable: 5,
  },
  'UNICAMP': {
    key: 'UNICAMP',
    shortName: 'UNICAMP',
    fullName: 'Universidade Estadual de Campinas',
    state: 'SP',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    bgLight: 'bg-rose-50/70',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800',
    description: 'Forte presença de trauma cirúrgico, saúde coletiva/SUS, medicina de família e raciocínio epidemiológico.',
    totalExamsAvailable: 5,
  },
  'ENAMED': {
    key: 'ENAMED',
    shortName: 'ENAMED',
    fullName: 'Exame Nacional de Residência Médica (ENAMED / ENARE / FGV)',
    state: 'BR',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    bgLight: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    description: 'Prova unificada nacional com divisão estrita de 20 questões por Grande Área e ênfase em atenção primária e urgências.',
    totalExamsAvailable: 5,
  },
  'HIAE': {
    key: 'HIAE',
    shortName: 'HIAE',
    fullName: 'Hospital Israelita Albert Einstein',
    state: 'SP',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    bgLight: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    description: 'Centro de excelência hospitalar com questões de terapia intensiva, segurança do paciente, ética e oncologia.',
    totalExamsAvailable: 5,
  },
};

export const PAST_5_YEARS = [2025, 2024, 2023, 2022, 2021] as const;

export const RECENCY_WEIGHTS: Record<number, number> = {
  2025: 1.00, // Ano corrente / mais recente (peso máximo)
  2024: 0.85,
  2023: 0.70,
  2022: 0.55,
  2021: 0.40, // Mais distante no ciclo de 5 anos
};

/**
 * 25 Provas Oficiais Cadastradas (5 anos x 5 instituições-alvo)
 */
export interface TargetOfficialExamMeta {
  id: string;
  institution: TargetInstitutionKey;
  year: number;
  title: string;
  totalQuestions: number;
  analyzedDate: string;
  status: 'processada' | 'revisao_pendente';
  doubtsCount: number;
}

export const INITIAL_OFFICIAL_EXAMS_META: TargetOfficialExamMeta[] = [
  // 2025
  { id: 'exam-usp-rp-2025', institution: 'USP-RP', year: 2025, title: 'FMRP-USP 2025 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-15', status: 'processada', doubtsCount: 1 },
  { id: 'exam-usp-sp-2025', institution: 'USP-SP', year: 2025, title: 'FMUSP 2025 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-16', status: 'processada', doubtsCount: 2 },
  { id: 'exam-unicamp-2025', institution: 'UNICAMP', year: 2025, title: 'UNICAMP 2025 — Residência Médica', totalQuestions: 80, analyzedDate: '2026-08-18', status: 'revisao_pendente', doubtsCount: 2 },
  { id: 'exam-enamed-2025', institution: 'ENAMED', year: 2025, title: 'ENAMED / ENARE 2025 — Prova Nacional', totalQuestions: 100, analyzedDate: '2026-08-20', status: 'processada', doubtsCount: 1 },
  { id: 'exam-hiae-2025', institution: 'HIAE', year: 2025, title: 'Albert Einstein 2025 — Acesso Direto', totalQuestions: 75, analyzedDate: '2026-08-22', status: 'processada', doubtsCount: 1 },

  // 2024
  { id: 'exam-usp-rp-2024', institution: 'USP-RP', year: 2024, title: 'FMRP-USP 2024 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-10', status: 'processada', doubtsCount: 0 },
  { id: 'exam-usp-sp-2024', institution: 'USP-SP', year: 2024, title: 'FMUSP 2024 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-10', status: 'processada', doubtsCount: 1 },
  { id: 'exam-unicamp-2024', institution: 'UNICAMP', year: 2024, title: 'UNICAMP 2024 — Residência Médica', totalQuestions: 80, analyzedDate: '2026-08-11', status: 'processada', doubtsCount: 0 },
  { id: 'exam-enamed-2024', institution: 'ENAMED', year: 2024, title: 'ENAMED / ENARE 2024 — Prova Nacional', totalQuestions: 100, analyzedDate: '2026-08-11', status: 'processada', doubtsCount: 0 },
  { id: 'exam-hiae-2024', institution: 'HIAE', year: 2024, title: 'Albert Einstein 2024 — Acesso Direto', totalQuestions: 75, analyzedDate: '2026-08-12', status: 'processada', doubtsCount: 1 },

  // 2023
  { id: 'exam-usp-rp-2023', institution: 'USP-RP', year: 2023, title: 'FMRP-USP 2023 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-05', status: 'processada', doubtsCount: 0 },
  { id: 'exam-usp-sp-2023', institution: 'USP-SP', year: 2023, title: 'FMUSP 2023 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-05', status: 'processada', doubtsCount: 0 },
  { id: 'exam-unicamp-2023', institution: 'UNICAMP', year: 2023, title: 'UNICAMP 2023 — Residência Médica', totalQuestions: 80, analyzedDate: '2026-08-06', status: 'processada', doubtsCount: 0 },
  { id: 'exam-enamed-2023', institution: 'ENAMED', year: 2023, title: 'ENAMED / ENARE 2023 — Prova Nacional', totalQuestions: 100, analyzedDate: '2026-08-06', status: 'processada', doubtsCount: 0 },
  { id: 'exam-hiae-2023', institution: 'HIAE', year: 2023, title: 'Albert Einstein 2023 — Acesso Direto', totalQuestions: 75, analyzedDate: '2026-08-07', status: 'processada', doubtsCount: 0 },

  // 2022
  { id: 'exam-usp-rp-2022', institution: 'USP-RP', year: 2022, title: 'FMRP-USP 2022 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-01', status: 'processada', doubtsCount: 0 },
  { id: 'exam-usp-sp-2022', institution: 'USP-SP', year: 2022, title: 'FMUSP 2022 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-08-01', status: 'processada', doubtsCount: 0 },
  { id: 'exam-unicamp-2022', institution: 'UNICAMP', year: 2022, title: 'UNICAMP 2022 — Residência Médica', totalQuestions: 80, analyzedDate: '2026-08-02', status: 'processada', doubtsCount: 0 },
  { id: 'exam-enamed-2022', institution: 'ENAMED', year: 2022, title: 'ENAMED / ENARE 2022 — Prova Nacional', totalQuestions: 100, analyzedDate: '2026-08-02', status: 'processada', doubtsCount: 0 },
  { id: 'exam-hiae-2022', institution: 'HIAE', year: 2022, title: 'Albert Einstein 2022 — Acesso Direto', totalQuestions: 75, analyzedDate: '2026-08-03', status: 'processada', doubtsCount: 0 },

  // 2021
  { id: 'exam-usp-rp-2021', institution: 'USP-RP', year: 2021, title: 'FMRP-USP 2021 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-07-28', status: 'processada', doubtsCount: 0 },
  { id: 'exam-usp-sp-2021', institution: 'USP-SP', year: 2021, title: 'FMUSP 2021 — Acesso Direto', totalQuestions: 100, analyzedDate: '2026-07-28', status: 'processada', doubtsCount: 0 },
  { id: 'exam-unicamp-2021', institution: 'UNICAMP', year: 2021, title: 'UNICAMP 2021 — Residência Médica', totalQuestions: 80, analyzedDate: '2026-07-29', status: 'processada', doubtsCount: 0 },
  { id: 'exam-enamed-2021', institution: 'ENAMED', year: 2021, title: 'ENAMED / ENARE 2021 — Prova Nacional', totalQuestions: 100, analyzedDate: '2026-07-29', status: 'processada', doubtsCount: 0 },
  { id: 'exam-hiae-2021', institution: 'HIAE', year: 2021, title: 'Albert Einstein 2021 — Acesso Direto', totalQuestions: 75, analyzedDate: '2026-07-30', status: 'processada', doubtsCount: 0 },
];
