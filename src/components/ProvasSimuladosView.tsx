import React, { useState, useRef, useEffect } from 'react';
import {
  fullCurriculumHierarchy,
} from '../data/mockData';
import {
  ExamQuestionEntry,
  ErrorReasonType,
  ContentItem,
  CadernoErroItem,
} from '../types';
import { RealExamEvidenceModal } from './RealExamEvidenceModal';
import { SimuladoEvidenceModal } from './SimuladoEvidenceModal';
import { DominioDossieModal } from './DominioDossieModal';
import { calculateContentDomain } from '../utils/domainCalculator';
import { generate100QuestionsExam } from '../data/examQuestionsGenerator';

export interface DownloadedExam {
  id: string;
  title: string;
  institution: string;
  year: number;
  type: 'PROVA_REAL' | 'SIMULADO';
  totalQuestions: number;
  officialAnswers: { [qNum: number]: string };
  studentAnswers: { [qNum: number]: string };
  isCorrected: boolean;
  questionErrorReasons: { [qNum: number]: ErrorReasonType };
  questions: ExamQuestionEntry[];
  downloadedAt: string;
}

export const CLASSIFICACAO_ERROS_OPTIONS: {
  id: ErrorReasonType;
  label: string;
  shortLabel: string;
  badgeColor: string;
}[] = [
  {
    id: 'nao_sabia',
    label: 'Errei e não sabia (Lacuna de conteúdo)',
    shortLabel: 'Não sabia',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
  },
  {
    id: 'desatencao',
    label: 'Errei por desatenção (Pegadinha / Distrator)',
    shortLabel: 'Desatenção',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'entre_duas',
    label: 'Fiquei entre duas alternativas',
    shortLabel: 'Entre duas',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  {
    id: 'interpretacao',
    label: 'Falha de interpretação do enunciado',
    shortLabel: 'Interpretação',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    id: 'esqueci',
    label: 'Esqueci (Falha de memória / FSRS)',
    shortLabel: 'Esqueci',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'raciocinio',
    label: 'Falha de raciocínio clínico',
    shortLabel: 'Raciocínio',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  {
    id: 'outro',
    label: 'Chute / Falta de tempo',
    shortLabel: 'Chute / Tempo',
    badgeColor: 'bg-stone-100 text-stone-900 border-stone-300',
  },
];

const GRANDES_AREAS = [
  'TODAS',
  'CLÍNICA MÉDICA',
  'CIRURGIA GERAL',
  'PEDIATRIA',
  'GINECOLOGIA E OBSTETRÍCIA',
  'MEDICINA PREVENTIVA E SOCIAL',
] as const;

// Gerador de provas iniciais para preencher o armazenamento inicial
function getInitialDownloadedExams(): DownloadedExam[] {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const errorReasonTypes: ErrorReasonType[] = [
    'nao_sabia',
    'desatencao',
    'entre_duas',
    'interpretacao',
    'esqueci',
    'raciocinio',
    'outro',
  ];

  // 1. ENARE 2024 (100 questões, 79 acertos, 21 erros)
  const enareQ = generate100QuestionsExam('ENARE 2024', 'ENARE / FGV', 2024, 'PROVA_REAL');
  const enareOfficial: { [q: number]: string } = {};
  const enareStudent: { [q: number]: string } = {};
  const enareReasons: { [q: number]: ErrorReasonType } = {};

  enareQ.forEach((q, idx) => {
    const off = letters[(q.questionNumber * 3 + 7) % 5];
    enareOfficial[q.questionNumber] = off;
    const isHit = (q.questionNumber * 7) % 100 < 79;
    if (isHit) {
      enareStudent[q.questionNumber] = off;
    } else {
      const wrong = letters.filter((l) => l !== off);
      enareStudent[q.questionNumber] = wrong[idx % wrong.length];
      enareReasons[q.questionNumber] = errorReasonTypes[idx % errorReasonTypes.length];
    }
  });

  const enareExam: DownloadedExam = {
    id: 'exam-enare-2024',
    title: 'ENARE 2024 - Exame Nacional de Residência (100 Questões)',
    institution: 'ENARE / FGV',
    year: 2024,
    type: 'PROVA_REAL',
    totalQuestions: 100,
    officialAnswers: enareOfficial,
    studentAnswers: enareStudent,
    isCorrected: true,
    questionErrorReasons: enareReasons,
    questions: enareQ.map((q) => {
      const isCorrect = enareStudent[q.questionNumber] === enareOfficial[q.questionNumber];
      return {
        ...q,
        isCorrect,
        errorReason: isCorrect ? undefined : enareReasons[q.questionNumber],
      };
    }),
    downloadedAt: '2024-11-15',
  };

  // 2. Simulado Nacional Medway 2025 #1 (100 questões, 82 acertos, 18 erros)
  const medwayQ = generate100QuestionsExam(
    'Simulado Nacional Medway 2025 #1',
    'Medway Simulados',
    2025,
    'SIMULADO'
  );
  const medwayOfficial: { [q: number]: string } = {};
  const medwayStudent: { [q: number]: string } = {};
  const medwayReasons: { [q: number]: ErrorReasonType } = {};

  medwayQ.forEach((q, idx) => {
    const off = letters[(q.questionNumber * 2 + 3) % 5];
    medwayOfficial[q.questionNumber] = off;
    const isHit = (q.questionNumber * 13) % 100 < 82;
    if (isHit) {
      medwayStudent[q.questionNumber] = off;
    } else {
      const wrong = letters.filter((l) => l !== off);
      medwayStudent[q.questionNumber] = wrong[idx % wrong.length];
      medwayReasons[q.questionNumber] = errorReasonTypes[(idx + 2) % errorReasonTypes.length];
    }
  });

  const medwayExam: DownloadedExam = {
    id: 'exam-simulado-medway-2025',
    title: 'Simulado Nacional Medway 2025 #1 (100 Questões)',
    institution: 'Medway Simulados',
    year: 2025,
    type: 'SIMULADO',
    totalQuestions: 100,
    officialAnswers: medwayOfficial,
    studentAnswers: medwayStudent,
    isCorrected: true,
    questionErrorReasons: medwayReasons,
    questions: medwayQ.map((q) => {
      const isCorrect = medwayStudent[q.questionNumber] === medwayOfficial[q.questionNumber];
      return {
        ...q,
        isCorrect,
        errorReason: isCorrect ? undefined : medwayReasons[q.questionNumber],
      };
    }),
    downloadedAt: '2025-02-10',
  };

  // 3. USP-SP 2025 (Pendente de preenchimento, 0 acertos, 0 erros)
  const uspQ = generate100QuestionsExam('USP-SP 2025', 'USP-SP / FUVEST', 2025, 'PROVA_REAL');
  const uspOfficial: { [q: number]: string } = {};
  uspQ.forEach((q) => {
    uspOfficial[q.questionNumber] = letters[(q.questionNumber * 4 + 1) % 5];
  });

  const uspExam: DownloadedExam = {
    id: 'exam-usp-2025',
    title: 'USP-SP 2025 - Prova de Acesso Direto (100 Questões)',
    institution: 'USP-SP / FUVEST',
    year: 2025,
    type: 'PROVA_REAL',
    totalQuestions: 100,
    officialAnswers: uspOfficial,
    studentAnswers: {},
    isCorrected: false,
    questionErrorReasons: {},
    questions: uspQ,
    downloadedAt: '2025-01-20',
  };

  return [enareExam, medwayExam, uspExam];
}

export const ProvasSimuladosView: React.FC = () => {
  // Lista de simulados/provas baixados
  const [downloadedExams, setDownloadedExams] = useState<DownloadedExam[]>(() => {
    try {
      const saved = localStorage.getItem('synapsemed_downloaded_exams');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Falha ao carregar simulados salvos:', e);
    }
    const initial = getInitialDownloadedExams();
    localStorage.setItem('synapsemed_downloaded_exams', JSON.stringify(initial));
    return initial;
  });

  // Salvar no localStorage sempre que downloadedExams mudar
  useEffect(() => {
    try {
      localStorage.setItem('synapsemed_downloaded_exams', JSON.stringify(downloadedExams));
    } catch (e) {
      console.error('Falha ao sincronizar simulados salvos:', e);
    }
  }, [downloadedExams]);

  // Modo de visualização:
  // 'lista' = página principal com as provas baixadas e informações principais
  // 'questoes' = visualização detalhada das 100 questões da prova selecionada
  // 'evidencias' = evidências pedagógicas
  const [viewMode, setViewMode] = useState<'lista' | 'questoes' | 'evidencias'>('lista');

  // ID da prova atualmente selecionada para ver questões
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Prova ativa
  const currentExam = downloadedExams.find((ex) => ex.id === selectedExamId) || downloadedExams[0];

  // Filtros na visualização de questões
  const [gabaritoAreaFilter, setGabaritoAreaFilter] = useState<string>('TODAS');
  const [gabaritoStatusFilter, setGabaritoStatusFilter] = useState<'TODAS' | 'PENDENTES' | 'ACERTOS' | 'ERROS'>('TODAS');

  // Input de arquivo nativo (abre janela do computador)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadType, setPendingUploadType] = useState<'PROVA_REAL' | 'SIMULADO'>('PROVA_REAL');

  // Estados de processamento por IA
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState('');
  const [analysisStep, setAnalysisStep] = useState(1);
  const [analysisStatusText, setAnalysisStatusText] = useState('');

  // Modal de adicionar simulado manualmente
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualInstitution, setManualInstitution] = useState('');
  const [manualYear, setManualYear] = useState<number>(2025);
  const [manualType, setManualType] = useState<'PROVA_REAL' | 'SIMULADO'>('SIMULADO');

  // Modal de confirmação para exclusão
  const [examToDelete, setExamToDelete] = useState<DownloadedExam | null>(null);

  // Banner de feedback
  const [successBanner, setSuccessBanner] = useState<{ title: string; desc: string } | null>(null);

  // Evidências e dossiês
  const fullContentList: ContentItem[] = fullCurriculumHierarchy.flatMap((area) =>
    area.modules.flatMap((mod) => mod.contents)
  );
  const [selectedContentId, setSelectedContentId] = useState<string>('c-dpoc');
  const selectedContent = fullContentList.find((c) => c.id === selectedContentId) || fullContentList[0];
  const [realExamModalContent, setRealExamModalContent] = useState<ContentItem | null>(null);
  const [simuladoModalContent, setSimuladoModalContent] = useState<ContentItem | null>(null);
  const [dominioModalContent, setDominioModalContent] = useState<ContentItem | null>(null);

  // NOTIFICAÇÃO RÁPIDA
  const notifySuccess = (title: string, desc: string) => {
    setSuccessBanner({ title, desc });
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // DISPARAR SELEÇÃO DE ARQUIVO DO PC
  const handleOpenFileDialog = (type: 'PROVA_REAL' | 'SIMULADO') => {
    setPendingUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // QUANDO O USUÁRIO SELECIONA O ARQUIVO DO COMPUTADOR
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    setAnalyzingFileName(fileName);
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisStatusText('Carregando arquivo do computador e extraindo enunciados...');

    const isSimulado = pendingUploadType === 'SIMULADO';
    const guessedInstitution = fileName.toUpperCase().includes('USP')
      ? 'USP-SP'
      : fileName.toUpperCase().includes('ENARE')
      ? 'ENARE / FGV'
      : fileName.toUpperCase().includes('UNICAMP')
      ? 'UNICAMP'
      : fileName.toUpperCase().includes('UNIFESP')
      ? 'UNIFESP'
      : isSimulado
      ? 'Medway Simulados'
      : 'Banca Examinadora';

    const guessedYear = 2025;
    const guessedTitle = isSimulado
      ? `Simulado Nacional ${guessedInstitution} ${guessedYear} (100 Questões)`
      : `Prova Oficial ${guessedInstitution} ${guessedYear} (100 Questões)`;

    setTimeout(() => {
      setAnalysisStep(2);
      setAnalysisStatusText('IA identificando enunciados clínicos e opções A, B, C, D, E...');

      setTimeout(() => {
        setAnalysisStep(3);
        setAnalysisStatusText('Separando questões por Grande Área (Clínica, Cirurgia, Pediatria, G.O., Preventiva)...');

        setTimeout(() => {
          setAnalysisStep(4);
          setAnalysisStatusText('Mapeando Áreas e Subáreas no currículo de residência...');

          setTimeout(() => {
            const new100Questions = generate100QuestionsExam(
              guessedTitle,
              guessedInstitution,
              guessedYear,
              pendingUploadType
            );

            const letters = ['A', 'B', 'C', 'D', 'E'];
            const newOfficial: { [q: number]: string } = {};
            new100Questions.forEach((q) => {
              newOfficial[q.questionNumber] = letters[(q.questionNumber * 3 + 5) % 5];
            });

            const newExam: DownloadedExam = {
              id: `exam-${Date.now()}`,
              title: guessedTitle,
              institution: guessedInstitution,
              year: guessedYear,
              type: pendingUploadType,
              totalQuestions: 100,
              officialAnswers: newOfficial,
              studentAnswers: {},
              isCorrected: false,
              questionErrorReasons: {},
              questions: new100Questions,
              downloadedAt: new Date().toISOString().split('T')[0],
            };

            setDownloadedExams((prev) => [newExam, ...prev]);
            setIsAnalyzing(false);

            notifySuccess(
              `${pendingUploadType === 'PROVA_REAL' ? 'Prova' : 'Simulado'} adicionado com sucesso!`,
              `"${guessedTitle}" foi analisado e inserido na sua lista de simulados baixados.`
            );
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  // ADICIONAR SIMULADO MANUALMENTE
  const handleAddManualExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInstitution.trim()) return;

    const title =
      manualTitle.trim() ||
      `${manualType === 'SIMULADO' ? 'Simulado Nacional' : 'Prova Oficial'} ${manualInstitution.trim()} ${manualYear} (100 Questões)`;

    const new100Questions = generate100QuestionsExam(
      title,
      manualInstitution.trim(),
      manualYear,
      manualType
    );

    const letters = ['A', 'B', 'C', 'D', 'E'];
    const newOfficial: { [q: number]: string } = {};
    new100Questions.forEach((q) => {
      newOfficial[q.questionNumber] = letters[(q.questionNumber * 2 + 7) % 5];
    });

    const newExam: DownloadedExam = {
      id: `exam-${Date.now()}`,
      title,
      institution: manualInstitution.trim(),
      year: manualYear,
      type: manualType,
      totalQuestions: 100,
      officialAnswers: newOfficial,
      studentAnswers: {},
      isCorrected: false,
      questionErrorReasons: {},
      questions: new100Questions,
      downloadedAt: new Date().toISOString().split('T')[0],
    };

    setDownloadedExams((prev) => [newExam, ...prev]);
    setShowAddManualModal(false);
    setManualTitle('');
    setManualInstitution('');

    notifySuccess(
      'Simulado adicionado à sua lista!',
      `"${title}" pronto para você preencher o gabarito e analisar o desempenho.`
    );
  };

  // REMOVER SIMULADO DA LISTA
  const handleConfirmDeleteExam = () => {
    if (!examToDelete) return;
    const deletedTitle = examToDelete.title;

    setDownloadedExams((prev) => prev.filter((ex) => ex.id !== examToDelete.id));

    // Se estava visualizando as questões desta prova, volta para a lista
    if (selectedExamId === examToDelete.id) {
      setSelectedExamId(null);
      setViewMode('lista');
    }

    setExamToDelete(null);
    notifySuccess('Simulado removido', `O simulado "${deletedTitle}" foi excluído da lista.`);
  };

  // LIMPAR RESPOSTAS / GABARITO DE UMA PROVA
  const handleClearExamAnswers = (examId: string) => {
    setDownloadedExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== examId) return ex;
        return {
          ...ex,
          studentAnswers: {},
          isCorrected: false,
          questionErrorReasons: {},
          questions: ex.questions.map((q) => ({
            ...q,
            isCorrect: undefined,
            errorReason: undefined,
          })),
        };
      })
    );

    notifySuccess('Gabarito limpo', 'Todas as respostas marcadas desta prova foram resetadas.');
  };

  // CORRIGIR GABARITO E ANALISAR UMA PROVA
  const handleCorrectExam = (examId: string) => {
    setDownloadedExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== examId) return ex;

        // Se o usuário ainda não respondeu nada, preenche um padrão para análise
        const currentAnswers = { ...ex.studentAnswers };
        const hasAnswers = Object.keys(currentAnswers).length > 0;
        const letters = ['A', 'B', 'C', 'D', 'E'];

        if (!hasAnswers) {
          for (let i = 1; i <= 100; i++) {
            const correctOpt = ex.officialAnswers[i] || 'A';
            const willHit = (i * 7) % 100 < 80;
            if (willHit) {
              currentAnswers[i] = correctOpt;
            } else {
              const wrong = letters.filter((l) => l !== correctOpt);
              currentAnswers[i] = wrong[i % wrong.length];
            }
          }
        }

        const defaultReasons: { [q: number]: ErrorReasonType } = { ...ex.questionErrorReasons };

        const updatedQuestions = ex.questions.map((q) => {
          const studentAns = currentAnswers[q.questionNumber];
          const officialAns = ex.officialAnswers[q.questionNumber] || 'A';
          const isHit = studentAns === officialAns;
          if (!isHit && !defaultReasons[q.questionNumber]) {
            defaultReasons[q.questionNumber] = 'entre_duas';
          }
          return {
            ...q,
            isCorrect: isHit,
            errorReason: isHit ? undefined : defaultReasons[q.questionNumber],
          };
        });

        return {
          ...ex,
          studentAnswers: currentAnswers,
          isCorrected: true,
          questionErrorReasons: defaultReasons,
          questions: updatedQuestions,
        };
      })
    );

    notifySuccess(
      'Gabarito corrigido e analisado!',
      'Relatório de acurácia, domínio por área e classificação de erros gerados.'
    );
  };

  // MARCAR ALTERNATIVA NA PROVA SELECIONADA
  const handleSelectOption = (qNum: number, option: string) => {
    if (!selectedExamId) return;

    setDownloadedExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== selectedExamId) return ex;
        const newAns = { ...ex.studentAnswers, [qNum]: option };
        return {
          ...ex,
          studentAnswers: newAns,
        };
      })
    );
  };

  // CLASSIFICAR MOTIVO DO ERRO NA QUESTÃO
  const handleSetQuestionErrorReason = (qNum: number, reason: ErrorReasonType) => {
    if (!selectedExamId) return;

    setDownloadedExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== selectedExamId) return ex;
        const newReasons = { ...ex.questionErrorReasons, [qNum]: reason };
        const updatedQuestions = ex.questions.map((q) =>
          q.questionNumber === qNum ? { ...q, errorReason: reason } : q
        );
        return {
          ...ex,
          questionErrorReasons: newReasons,
          questions: updatedQuestions,
        };
      })
    );
  };

  // PREENCHIMENTO RÁPIDO PARA TESTE NA PROVA ABERTA
  const handleFastFillMockAnswers = (targetAccuracy: number = 82) => {
    if (!selectedExamId) return;

    setDownloadedExams((prev) =>
      prev.map((ex) => {
        if (ex.id !== selectedExamId) return ex;
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const answers: { [q: number]: string } = {};

        for (let i = 1; i <= 100; i++) {
          const correctOpt = ex.officialAnswers[i] || 'A';
          const willHit = (i * 7) % 100 < targetAccuracy;
          if (willHit) {
            answers[i] = correctOpt;
          } else {
            const wrong = letters.filter((l) => l !== correctOpt);
            answers[i] = wrong[i % wrong.length];
          }
        }

        return {
          ...ex,
          studentAnswers: answers,
        };
      })
    );

    notifySuccess('Folha preenchida rapidamente', 'Você pode agora clicar em "Corrigir Gabarito e Analisar".');
  };

  // RETROALIMENTAR CADERNO DE ERROS E CURRÍCULO
  const handleFeedCurriculumAndCaderno = (exam: DownloadedExam) => {
    try {
      const existingCadernoStr = localStorage.getItem('synapsemed_caderno_erros');
      const existingCaderno: CadernoErroItem[] = existingCadernoStr ? JSON.parse(existingCadernoStr) : [];

      const wrongQuestions = exam.questions.filter((q) => !q.isCorrect);
      const newItems: CadernoErroItem[] = wrongQuestions.map((q) => {
        const cat = exam.questionErrorReasons[q.questionNumber] || 'entre_duas';
        return {
          id: `err-${Date.now()}-${q.questionNumber}`,
          topic: `${q.contentName} (Q${q.questionNumber})`,
          specialty: q.areaName,
          reason: q.statementSnippet,
          reasonCategory: cat,
          institutionOrContext: `${exam.institution} ${exam.year} (${exam.type === 'PROVA_REAL' ? 'Prova Real' : 'Simulado'})`,
          createdAt: new Date().toISOString().split('T')[0],
          examType: exam.type,
        };
      });

      const combined = [...newItems, ...existingCaderno];
      localStorage.setItem('synapsemed_caderno_erros', JSON.stringify(combined));

      notifySuccess(
        'Caderno de Erros Alimentado!',
        `${wrongQuestions.length} questões com motivos classificados foram registradas para revisão clínica.`
      );
    } catch (e) {
      console.error('Erro ao retroalimentar:', e);
    }
  };

  // ABRIR QUESTÕES DE UM SIMULADO
  const handleOpenQuestions = (examId: string) => {
    setSelectedExamId(examId);
    setViewMode('questoes');
    setGabaritoAreaFilter('TODAS');
    setGabaritoStatusFilter('TODAS');
  };

  // CÁLCULOS DO EXAME ABERTO
  const activeExam = currentExam;
  const totalQ = activeExam ? activeExam.questions.length : 100;
  const answeredQ = activeExam ? Object.keys(activeExam.studentAnswers).length : 0;
  const hitsQ = activeExam && activeExam.isCorrected
    ? activeExam.questions.filter(
        (q) => activeExam.studentAnswers[q.questionNumber] === (activeExam.officialAnswers[q.questionNumber] || 'A')
      ).length
    : 0;
  const missesQ = activeExam && activeExam.isCorrected ? totalQ - hitsQ : 0;
  const accuracyPct = totalQ > 0 ? Math.round((hitsQ / totalQ) * 100) : 0;

  // Estatísticas por Grande Área para o exame aberto
  const areaStats = [
    'CLÍNICA MÉDICA',
    'CIRURGIA GERAL',
    'PEDIATRIA',
    'GINECOLOGIA E OBSTETRÍCIA',
    'MEDICINA PREVENTIVA E SOCIAL',
  ].map((areaName) => {
    const areaQuestions = activeExam ? activeExam.questions.filter((q) => q.areaName.toUpperCase() === areaName) : [];
    const total = areaQuestions.length;
    const hits = activeExam
      ? areaQuestions.filter(
          (q) => activeExam.studentAnswers[q.questionNumber] === (activeExam.officialAnswers[q.questionNumber] || 'A')
        ).length
      : 0;
    const percent = total > 0 ? Math.round((hits / total) * 100) : 0;
    return { areaName, total, hits, percent };
  });

  // Filtro de questões da folha
  const filteredQuestions = activeExam
    ? activeExam.questions.filter((q) => {
        if (gabaritoAreaFilter !== 'TODAS' && q.areaName.toUpperCase() !== gabaritoAreaFilter) {
          return false;
        }
        if (gabaritoStatusFilter === 'PENDENTES' && activeExam.studentAnswers[q.questionNumber]) {
          return false;
        }
        if (activeExam.isCorrected) {
          const isHit =
            activeExam.studentAnswers[q.questionNumber] ===
            (activeExam.officialAnswers[q.questionNumber] || 'A');
          if (gabaritoStatusFilter === 'ACERTOS' && !isHit) return false;
          if (gabaritoStatusFilter === 'ERROS' && isHit) return false;
        }
        return true;
      })
    : [];

  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {/* INPUT NATIVO OCULTO PARA SELEÇÃO DE ARQUIVOS DO COMPUTADOR */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.csv"
        className="hidden"
      />

      {/* HEADER DA PÁGINA: "Provas e Simulados" */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">assignment</span>
            <span>Provas &amp; Simulados</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Gestão, Gabarito e Diagnóstico</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Provas e Simulados
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            Gerencie suas provas e simulados baixados, preencha folhas de gabarito oficiais e diagnostique erros por Grande Área e subárea clínica.
          </p>
        </div>

        {/* FERRAMENTAS DE ADICIONAR SIMULADOS / PROVAS BAIXADAS */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenFileDialog('PROVA_REAL')}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            title="Abre a janela do seu computador para anexar uma prova oficial na íntegra"
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>Submeter Nova Prova</span>
          </button>

          <button
            onClick={() => handleOpenFileDialog('SIMULADO')}
            className="px-3.5 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            title="Abre a janela do seu computador para anexar um simulado completo"
          >
            <span className="material-symbols-outlined text-base">quiz</span>
            <span>Submeter Novo Simulado</span>
          </button>

          <button
            onClick={() => setShowAddManualModal(true)}
            className="px-3 py-2 rounded-xl border border-surface-container bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Adicionar um simulado ou prova digitando as informações"
          >
            <span className="material-symbols-outlined text-base text-secondary">add_circle</span>
            <span>Adicionar Manual</span>
          </button>
        </div>
      </div>

      {/* BANNER DE NOTIFICAÇÃO / SUCESSO */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3 shadow-xs animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-700 text-xl shrink-0 mt-0.5">check_circle</span>
          <div className="text-xs space-y-0.5">
            <strong className="block font-bold text-emerald-900">{successBanner.title}</strong>
            <p className="text-emerald-800">{successBanner.desc}</p>
          </div>
        </div>
      )}

      {/* MODAL DE PROCESSAMENTO POR INTELIGÊNCIA ARTIFICIAL */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-surface-container shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl animate-spin">smart_toy</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  IA Analisando Caderno de Questões
                </h3>
                <p className="text-xs text-secondary font-mono truncate max-w-xs">{analyzingFileName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-on-surface">
                <span>{analysisStatusText}</span>
                <span className="text-primary font-code-metric">{analysisStep * 25}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${analysisStep * 25}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1.5 text-xs text-secondary">
              <div className="flex items-center gap-2 text-on-surface font-semibold">
                <span className="material-symbols-outlined text-emerald-700 text-sm">check_circle</span>
                <span>Classificação Hierárquica Automática</span>
              </div>
              <p className="text-[0.6875rem] leading-relaxed">
                Separando as 100 questões em <strong>Grande Área</strong> &rarr; <strong>Área</strong> &rarr; <strong>Subárea</strong> com enunciados e alternativas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ADIÇÃO MANUAL DE SIMULADO / PROVA */}
      {showAddManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-surface-container shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">playlist_add</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Adicionar Simulado ou Prova
                </h3>
              </div>
              <button
                onClick={() => setShowAddManualModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddManualExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Tipo de Atividade:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualType('PROVA_REAL')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      manualType === 'PROVA_REAL'
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-secondary border-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">description</span>
                    <span>Prova Real</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualType('SIMULADO')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      manualType === 'SIMULADO'
                        ? 'bg-purple-700 text-white border-purple-700'
                        : 'bg-surface-container-low text-secondary border-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">quiz</span>
                    <span>Simulado</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Nome da Instituição / Banca:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: USP-SP, ENARE, UNICAMP, Medway"
                  value={manualInstitution}
                  onChange={(e) => setManualInstitution(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Ano:
                </label>
                <input
                  type="number"
                  min={2018}
                  max={2026}
                  required
                  value={manualYear}
                  onChange={(e) => setManualYear(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Título Personalizado (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Simulado Nacional ENARE 2025 #2 (100 Questões)"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-[0.6875rem] text-secondary">
                Ao salvar, o sistema gera o caderno de 100 questões distribuídas nas 5 Grandes Áreas com folha de gabarito interativa.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowAddManualModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-secondary hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90"
                >
                  Cadastrar Simulado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-surface-container shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">delete</span>
              </div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Remover Simulado Baixado?
              </h3>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Você tem certeza que deseja remover <strong>{examToDelete.title}</strong>? Esta ação removerá a folha de respostas e histórico deste caderno.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                onClick={() => setExamToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-secondary hover:bg-surface-container cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteExam}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO DE TOPO */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-surface-container pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'lista'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">folder_open</span>
            <span>Provas &amp; Simulados Baixados</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[0.625rem]">
              {downloadedExams.length}
            </span>
          </button>

          {viewMode === 'questoes' && activeExam && (
            <button
              onClick={() => setViewMode('questoes')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-primary text-on-primary shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">fact_check</span>
              <span>Caderno &amp; Gabarito: {activeExam.institution}</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('evidencias')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'evidencias'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span>Evidência Pedagógica</span>
          </button>
        </div>

        {viewMode === 'questoes' && (
          <button
            onClick={() => setViewMode('lista')}
            className="px-3 py-1.5 rounded-xl border border-surface-container bg-surface-container-lowest hover:bg-surface-container-low text-xs font-bold text-secondary hover:text-on-surface flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Voltar para Lista de Provas</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PÁGINA PRINCIPAL: SOMENTE AS PROVAS BAIXADAS E SUAS PRINCIPAIS INFORMAÇÕES */}
      {/* ========================================================================= */}
      {viewMode === 'lista' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">library_books</span>
                <span>Provas e Simulados Cadastrados ({downloadedExams.length})</span>
              </h2>
              <p className="text-xs text-secondary">
                Visualize as informações essenciais de cada prova. Clique em <strong>&ldquo;Ver Questões&rdquo;</strong> para inspecionar os enunciados, preencher alternativas e classificar seus erros.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Prova Real
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span> Simulado
              </span>
            </div>
          </div>

          {downloadedExams.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border-2 border-dashed border-surface-container space-y-4">
              <span className="material-symbols-outlined text-5xl text-secondary">assignment_late</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Nenhum simulado ou prova na lista
              </h3>
              <p className="text-xs text-secondary max-w-md mx-auto">
                Utilize os botões acima para submeter arquivos de provas oficiais, simulados em PDF ou adicionar manualmente.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenFileDialog('PROVA_REAL')}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90"
                >
                  Submeter Prova
                </button>
                <button
                  onClick={() => handleOpenFileDialog('SIMULADO')}
                  className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800"
                >
                  Submeter Simulado
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {downloadedExams.map((exam) => {
                const total = exam.totalQuestions || 100;
                const answered = Object.keys(exam.studentAnswers).length;
                const hits = exam.isCorrected
                  ? exam.questions.filter(
                      (q) =>
                        exam.studentAnswers[q.questionNumber] ===
                        (exam.officialAnswers[q.questionNumber] || 'A')
                    ).length
                  : 0;
                const misses = exam.isCorrected ? total - hits : 0;
                const pct = total > 0 ? Math.round((hits / total) * 100) : 0;

                return (
                  <div
                    key={exam.id}
                    className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-primary/40 shadow-xs hover:shadow-sm transition-all space-y-4"
                  >
                    {/* Linha Superior: Nome da Instituição, Ano, Tipo, Acurácia */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-code-metric ${
                              exam.type === 'PROVA_REAL'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-purple-100 text-purple-900 border border-purple-200'
                            }`}
                          >
                            {exam.type === 'PROVA_REAL' ? 'Prova Real' : 'Simulado'}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                            {exam.institution}
                          </span>

                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-[0.6875rem] font-semibold">
                            Ano: {exam.year}
                          </span>

                          <span className="text-[0.6875rem] text-secondary">
                            Baixado em: {exam.downloadedAt}
                          </span>
                        </div>

                        <h3 className="font-headline-sm text-base font-bold text-on-surface">
                          {exam.title}
                        </h3>
                      </div>

                      {/* Indicador de Desempenho / Correção */}
                      <div className="flex items-center gap-3 shrink-0">
                        {exam.isCorrected ? (
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="text-right">
                              <span className="text-[0.625rem] font-bold text-emerald-800 uppercase block">
                                Aproveitamento
                              </span>
                              <span className="font-code-metric text-lg font-extrabold text-emerald-700 leading-none">
                                {pct}%
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-emerald-600 text-xl">
                              verified
                            </span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-xl bg-surface-container text-secondary text-xs font-semibold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                            <span>{answered > 0 ? `${answered}/100 preenchidas` : 'Pendente'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Principais Informações: Quantidade de Acertos, Quantidade de Erros e Total */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container">
                      <div className="space-y-0.5">
                        <span className="text-[0.6875rem] text-secondary font-medium block">
                          Instituição
                        </span>
                        <span className="text-xs font-bold text-on-surface truncate block" title={exam.institution}>
                          {exam.institution}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[0.6875rem] text-secondary font-medium block">
                          Ano de Realização
                        </span>
                        <span className="text-xs font-bold text-on-surface font-code-metric block">
                          {exam.year}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[0.6875rem] text-emerald-800 font-bold block flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Quantidade de Acertos
                        </span>
                        <span className="text-sm font-extrabold text-emerald-700 font-code-metric block">
                          {exam.isCorrected ? `${hits} acertos` : '0 acertos'}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[0.6875rem] text-rose-800 font-bold block flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">cancel</span>
                          Quantidade de Erros
                        </span>
                        <span className="text-sm font-extrabold text-rose-700 font-code-metric block">
                          {exam.isCorrected ? `${misses} erros` : '0 erros'}
                        </span>
                      </div>
                    </div>

                    {/* Botões Solicitados: Ver Questões, Corrigir Gabarito e Analisar, Limpar e Remover */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-surface-container/60">
                      {/* Botão Ver Questões em Destaque */}
                      <button
                        onClick={() => handleOpenQuestions(exam.id)}
                        className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                        title="Abre a folha de 100 questões com alternativas e classificação de erros"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        <span>Ver Questões (100)</span>
                      </button>

                      {/* Ações Rápidas: Corrigir, Limpar e Remover */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleCorrectExam(exam.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Corrigir o gabarito e diagnosticar o desempenho"
                        >
                          <span className="material-symbols-outlined text-sm">grading</span>
                          <span>Corrigir Gabarito e Analisar</span>
                        </button>

                        <button
                          onClick={() => handleClearExamAnswers(exam.id)}
                          className="px-3 py-1.5 rounded-xl border border-surface-container bg-surface-container-lowest hover:bg-surface-container-low text-xs font-semibold text-secondary hover:text-on-surface transition-all flex items-center gap-1 cursor-pointer"
                          title="Limpar as alternativas marcadas nesta prova"
                        >
                          <span className="material-symbols-outlined text-sm">restart_alt</span>
                          <span>Limpar</span>
                        </button>

                        <button
                          onClick={() => setExamToDelete(exam)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                          title="Remover este simulado da lista"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISUALIZAÇÃO DE QUESTÕES (SOMENTE AO CLICAR EM 'VER QUESTÕES') */}
      {/* ========================================================================= */}
      {viewMode === 'questoes' && activeExam && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Card de Controle da Prova Selecionada */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-code-metric">
                    {activeExam.institution} • {activeExam.year}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary text-[0.6875rem] font-semibold">
                    {activeExam.type === 'PROVA_REAL' ? 'Prova Oficial na Íntegra' : 'Simulado Completo'}
                  </span>
                  <span className="text-xs text-secondary">• 100 Questões de Múltipla Escolha</span>
                </div>
                <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface mt-1">
                  {activeExam.title}
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Marque sua folha de respostas de 1 a 100. Ao clicar em <strong>&ldquo;Corrigir Gabarito e Analisar&rdquo;</strong>, você poderá classificar o motivo dos erros com as opções padronizadas.
                </p>
              </div>

              {/* Ações da Folha */}
              <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
                <button
                  onClick={() => handleFastFillMockAnswers(82)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Preenche alternativas para testar a correção com 1 clique"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Preenchimento Rápido</span>
                </button>

                {answeredQ > 0 && (
                  <button
                    onClick={() => handleClearExamAnswers(activeExam.id)}
                    className="px-3 py-1.5 rounded-xl border border-surface-container hover:bg-surface-container-low text-xs font-semibold text-secondary transition-all cursor-pointer"
                  >
                    Limpar
                  </button>
                )}

                <button
                  onClick={() => handleCorrectExam(activeExam.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">grading</span>
                  <span>Corrigir Gabarito e Analisar</span>
                </button>
              </div>
            </div>

            {/* BARRA DE PROGRESSO DO PREENCHIMENTO */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-on-surface">
                <span>Progresso da Folha de Respostas:</span>
                <span className="font-code-metric">
                  {answeredQ} de 100 respondidas ({Math.round((answeredQ / 100) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    answeredQ === 100 ? 'bg-emerald-700' : 'bg-primary'
                  }`}
                  style={{ width: `${(answeredQ / 100) * 100}%` }}
                />
              </div>
            </div>

            {/* PAINEL DE DIAGNÓSTICO (APÓS CORREÇÃO) */}
            {activeExam.isCorrected && (
              <div className="p-5 rounded-2xl bg-surface-container-low/70 border-2 border-emerald-400/40 space-y-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex flex-col items-center justify-center">
                      <span className="text-[0.5625rem] font-bold uppercase">Nota</span>
                      <span className="font-code-metric font-extrabold text-lg leading-tight">
                        {accuracyPct}%
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">
                          Desempenho Geral: {hitsQ} Acertos • {missesQ} Erros
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                          {accuracyPct >= 80 ? 'Aprovado na Nota de Corte' : 'Abaixo da Meta (Meta ≥80%)'}
                        </span>
                      </div>
                      <p className="text-xs text-secondary mt-0.5">
                        Classifique abaixo as {missesQ} questões que você errou para calibrar suas revisões.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFeedCurriculumAndCaderno(activeExam)}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto active:scale-98 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">sync</span>
                    <span>Retroalimentar Currículo &amp; Caderno de Erros</span>
                  </button>
                </div>

                {/* Domínio nas 5 Grandes Áreas */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">pie_chart</span>
                    <span>Desempenho por Grande Área:</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {areaStats.map((item) => (
                      <div
                        key={item.areaName}
                        className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2 shadow-xs"
                      >
                        <div className="text-[0.6875rem] font-bold text-on-surface truncate" title={item.areaName}>
                          {item.areaName}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-code-metric text-lg font-extrabold text-on-surface">
                            {item.percent}%
                          </span>
                          <span className="text-[0.6875rem] text-secondary font-code-metric">
                            {item.hits}/{item.total}q
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.percent >= 80
                                ? 'bg-emerald-700'
                                : item.percent >= 70
                                ? 'bg-amber-600'
                                : 'bg-rose-700'
                            }`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FILTROS DA FOLHA DE RESPOSTAS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-secondary font-semibold">Grande Área:</span>
                {GRANDES_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setGabaritoAreaFilter(area)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      gabaritoAreaFilter === area
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    {area === 'TODAS'
                      ? 'Todas (100)'
                      : area === 'CLÍNICA MÉDICA'
                      ? 'Clínica'
                      : area === 'CIRURGIA GERAL'
                      ? 'Cirurgia'
                      : area === 'PEDIATRIA'
                      ? 'Pediatria'
                      : area === 'GINECOLOGIA E OBSTETRÍCIA'
                      ? 'G.O.'
                      : 'Preventiva'}
                  </button>
                ))}
              </div>

              {activeExam.isCorrected && (
                <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setGabaritoStatusFilter('TODAS')}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${
                      gabaritoStatusFilter === 'TODAS'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-secondary'
                    }`}
                  >
                    Todas ({totalQ})
                  </button>
                  <button
                    onClick={() => setGabaritoStatusFilter('ACERTOS')}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${
                      gabaritoStatusFilter === 'ACERTOS'
                        ? 'bg-surface-container-lowest text-emerald-800 shadow-xs'
                        : 'text-secondary'
                    }`}
                  >
                    Acertos ({hitsQ})
                  </button>
                  <button
                    onClick={() => setGabaritoStatusFilter('ERROS')}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${
                      gabaritoStatusFilter === 'ERROS'
                        ? 'bg-surface-container-lowest text-rose-800 shadow-xs'
                        : 'text-secondary'
                    }`}
                  >
                    Erros ({missesQ})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GRADE DAS QUESTÕES COM CLASSIFICAÇÃO DOS ERROS SOLICITADA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredQuestions.map((q) => {
              const selectedOpt = activeExam.studentAnswers[q.questionNumber];
              const officialOpt = activeExam.officialAnswers[q.questionNumber] || 'A';
              const isHit = activeExam.isCorrected && selectedOpt === officialOpt;
              const isMiss = activeExam.isCorrected && selectedOpt && selectedOpt !== officialOpt;
              const isBlank = activeExam.isCorrected && !selectedOpt;
              const currentReason = activeExam.questionErrorReasons[q.questionNumber] || 'entre_duas';

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    activeExam.isCorrected
                      ? isHit
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : isMiss || isBlank
                        ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-surface-container-lowest border-surface-container'
                      : selectedOpt
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-surface-container-lowest border-surface-container'
                  }`}
                >
                  {/* Cabeçalho da Questão */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-code-metric text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                          Q{q.questionNumber.toString().padStart(2, '0')}
                        </span>
                        <span className="px-2 py-0.2 rounded bg-primary/10 text-primary text-[0.625rem] font-bold">
                          {q.areaName}
                        </span>
                        <span className="text-[0.625rem] text-secondary">
                          &rarr; {q.moduloName} &rarr; <strong>{q.contentName}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-on-surface font-medium line-clamp-2 leading-relaxed">
                        {q.statementSnippet}
                      </p>
                    </div>

                    {/* Status de Correção */}
                    {activeExam.isCorrected && (
                      <div className="shrink-0 text-right">
                        {isHit ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1">
                            <span>✅ Acerto</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1">
                            <span>❌ Erro</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BOLINHAS DE ALTERNATIVAS (A, B, C, D, E) */}
                  <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[0.6875rem] font-bold text-secondary mr-1">Alternativas:</span>
                      {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                        const isChosen = selectedOpt === opt;
                        const isOfficial = activeExam.isCorrected && officialOpt === opt;

                        let btnClass =
                          'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container';
                        if (activeExam.isCorrected) {
                          if (isOfficial) {
                            btnClass =
                              'bg-emerald-600 text-white font-bold border-emerald-700 ring-2 ring-emerald-400';
                          } else if (isChosen && !isHit) {
                            btnClass = 'bg-rose-600 text-white font-bold border-rose-700';
                          } else {
                            btnClass = 'bg-surface-container-low text-secondary/60 border-surface-container';
                          }
                        } else if (isChosen) {
                          btnClass = 'bg-primary text-on-primary font-bold border-primary shadow-xs scale-105';
                        }

                        return (
                          <button
                            key={opt}
                            onClick={() => handleSelectOption(q.questionNumber, opt)}
                            className={`w-7 h-7 rounded-full text-xs font-code-metric border flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                            title={`Marcar alternativa ${opt}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {activeExam.isCorrected && (
                      <div className="text-[0.6875rem] text-secondary">
                        Gabarito Oficial: <strong className="text-emerald-700 font-code-metric">{officialOpt}</strong>
                      </div>
                    )}
                  </div>

                  {/* =================================================================== */}
                  {/* OPÇÕES SOLICITADAS: CLASSIFICAR ERROS NA QUESTÃO QUE O ALUNO ERROU */}
                  {/* =================================================================== */}
                  {activeExam.isCorrected && (isMiss || isBlank) && (
                    <div className="pt-2.5 border-t border-rose-200/80 bg-rose-50/70 p-2.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-rose-600">psychology_alt</span>
                          <span>Como você classifica este erro?</span>
                        </span>
                        <span className="text-[0.625rem] text-rose-800 font-medium">
                          Selecione o motivo:
                        </span>
                      </div>

                      {/* Chips / Botões de Classificação dos Erros */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {CLASSIFICACAO_ERROS_OPTIONS.map((opt) => {
                          const isSelected = currentReason === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSetQuestionErrorReason(q.questionNumber, opt.id)}
                              className={`px-2.5 py-1 rounded-lg text-[0.6875rem] font-bold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-700 text-white border-rose-800 shadow-xs ring-1 ring-rose-500 scale-102'
                                  : 'bg-surface-container-lowest text-on-surface hover:bg-rose-100/50 border-rose-200'
                              }`}
                              title={opt.label}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA EVIDÊNCIA PEDAGÓGICA (DOSSIÊS DAS 4 DIMENSÕES E ANÁLISE) */}
      {/* ========================================================================= */}
      {viewMode === 'evidencias' && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">auto_stories</span>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Dossiês de Aplicação Pedagógica
              </h2>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Diferenciação clara entre <strong>Provas Reais</strong> (fidelidade de banca, estilo de questão e raciocínio direto) e <strong>Simulados</strong> (integração interdisciplinar, pace de 4-5 horas e resistência sob fadiga).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <span className="material-symbols-outlined text-base">description</span>
                  <span>Provas Reais na Íntegra</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Avaliação da capacidade de acertar em condições idênticas às bancas oficiais (ENARE, USP, UNIFESP, UNICAMP). Identifica padrões de recorrência e pegadinhas clássicas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
                  <span className="material-symbols-outlined text-base">quiz</span>
                  <span>Simulados Periódicos</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Treino de gestão de tempo (2 a 3 minutos por questão), estratégia de preenchimento de gabarito e resistência cognitiva nas 100 questões sem queima prematura.
                </p>
              </div>
            </div>
          </div>

          {/* Seleção de Conteúdo para Inspeção */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">search</span>
                Selecione um Conteúdo Curricular para Inspecionar os Dossiês:
              </span>
              <span className="text-[0.6875rem] text-secondary block">
                Compare as evidências de aplicação direta e integrada coletadas até o momento.
              </span>
            </div>

            <select
              value={selectedContentId}
              onChange={(e) => setSelectedContentId(e.target.value)}
              className="h-9 px-3 bg-surface-container-lowest rounded-xl border border-surface-container text-on-surface font-bold text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-xs cursor-pointer"
            >
              {fullContentList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Domínio: {c.estimatedMastery}%)
                </option>
              ))}
            </select>
          </div>

          {/* Síntese do Conteúdo Selecionado */}
          {(() => {
            const selectedDomainData = calculateContentDomain(selectedContent);
            const isConsolidado = selectedDomainData.status === 'consolidado';
            const isGargalo = selectedDomainData.status === 'aplicacao_insuficiente';

            return (
              <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex flex-col items-center justify-center">
                      <span className="text-[0.5625rem] font-bold uppercase">Domínio</span>
                      <span className="font-code-metric font-extrabold text-lg leading-tight">
                        {selectedDomainData.overallDomain}%
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">
                          {selectedContent.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                            isConsolidado
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : isGargalo
                              ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/40'
                              : 'bg-surface-container text-on-surface border-surface-container-high'
                          }`}
                        >
                          {selectedDomainData.statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-secondary font-medium">
                        {selectedDomainData.diagnostic.headline}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDominioModalContent(selectedContent)}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>Abrir Dossiê do Cérebro</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-blue-800 flex items-center gap-1">
                      <span>📚</span> Conhecimento
                    </span>
                    <div className="font-code-metric text-xl font-bold text-blue-900">
                      {selectedDomainData.knowledgeScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">Pós-aula Medway</div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-emerald-800 flex items-center gap-1">
                      <span>🎯</span> Aplicação Direta
                    </span>
                    <div className="font-code-metric text-xl font-bold text-emerald-900">
                      {selectedDomainData.applicationScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">Provas Reais</div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-purple-800 flex items-center gap-1">
                      <span>🧠</span> Retenção FSRS
                    </span>
                    <div className="font-code-metric text-xl font-bold text-purple-900">
                      {selectedDomainData.retentionScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">Osler</div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-on-surface flex items-center gap-1">
                      <span>🛡️</span> Confiabilidade
                    </span>
                    <div className="font-code-metric text-xl font-bold text-on-surface">
                      {selectedDomainData.confidenceScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">Amostra estatística</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL DE EVIDÊNCIA DE PROVAS REAIS */}
      {realExamModalContent && (
        <RealExamEvidenceModal
          content={realExamModalContent}
          onClose={() => setRealExamModalContent(null)}
          onAddQuestion={() => {
            setRealExamModalContent((prev) => (prev ? { ...prev } : null));
          }}
        />
      )}

      {/* MODAL DE EVIDÊNCIA DE SIMULADOS */}
      {simuladoModalContent && (
        <SimuladoEvidenceModal
          content={simuladoModalContent}
          onClose={() => setSimuladoModalContent(null)}
          onAddQuestion={() => {
            setSimuladoModalContent((prev) => (prev ? { ...prev } : null));
          }}
        />
      )}

      {/* MODAL DO DOSSIÊ DO CÉREBRO DE DOMÍNIO */}
      {dominioModalContent && (
        <DominioDossieModal
          content={dominioModalContent}
          onClose={() => setDominioModalContent(null)}
          onNavigateToRealExams={() => {
            const c = dominioModalContent;
            setDominioModalContent(null);
            setRealExamModalContent(c);
          }}
          onNavigateToOsler={() => {
            setDominioModalContent(null);
          }}
        />
      )}
    </div>
  );
};
