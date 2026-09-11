import React, { useState, useRef } from 'react';
import {
  mockSimulados,
  mockExamSubmissions,
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

const ERROR_REASONS_LABELS: { [key in ErrorReasonType]: string } = {
  nao_sabia: 'Não sabia (Lacuna Teórica)',
  esqueci: 'Esqueci (Memória / FSRS)',
  interpretacao: 'Falha de Interpretação',
  desatencao: 'Desatenção / Pegadinha',
  entre_duas: 'Dúvida entre Duas Alternativas',
  raciocinio: 'Falha de Raciocínio Clínico',
  outro: 'Outro Motivo / Chute',
};

const GRANDES_AREAS = [
  'TODAS',
  'CLÍNICA MÉDICA',
  'CIRURGIA GERAL',
  'PEDIATRIA',
  'GINECOLOGIA E OBSTETRÍCIA',
  'MEDICINA PREVENTIVA E SOCIAL',
] as const;

export const ProvasSimuladosView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'historico' | 'gabarito' | 'revisao' | 'evidencias'>('gabarito');
  const [activeExamType, setActiveExamType] = useState<'PROVA_REAL' | 'SIMULADO'>('PROVA_REAL');
  const [examTitle, setExamTitle] = useState('ENARE 2024 - Exame Nacional de Residência (100 Questões)');
  const [institution, setInstitution] = useState('ENARE / FGV');
  const [examYear, setExamYear] = useState(2024);

  // 100 Questões geradas e mapeadas em Grande Área -> Área -> Subárea
  const [questions, setQuestions] = useState<ExamQuestionEntry[]>(() =>
    generate100QuestionsExam('ENARE 2024', 'ENARE / FGV', 2024, 'PROVA_REAL')
  );

  // Respostas oficiais preliminares / gabarito oficial
  const [officialAnswers, setOfficialAnswers] = useState<{ [qNum: number]: string }>(() => {
    const map: { [qNum: number]: string } = {};
    // Gabarito padrão variado
    const letters = ['A', 'B', 'C', 'D', 'E'];
    for (let i = 1; i <= 100; i++) {
      map[i] = letters[(i * 3 + 7) % 5];
    }
    return map;
  });

  // Respostas marcadas pelo aluno na folha de respostas
  const [studentAnswers, setStudentAnswers] = useState<{ [qNum: number]: string }>({});
  
  // Status de correção
  const [isCorrected, setIsCorrected] = useState(false);
  const [questionErrorReasons, setQuestionErrorReasons] = useState<{ [qNum: number]: ErrorReasonType }>({});

  // Filtros na aba Gabarito
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

  // Banner de feedback
  const [successBanner, setSuccessBanner] = useState<{ title: string; desc: string } | null>(null);

  // Flat list of all contents for user manual reclassification
  const allContents = fullCurriculumHierarchy.flatMap((area) =>
    area.modules.flatMap((mod) =>
      mod.contents.map((c) => ({
        id: c.id,
        name: c.name,
        moduleName: mod.name,
        areaName: area.name,
      }))
    )
  );

  const fullContentList: ContentItem[] = fullCurriculumHierarchy.flatMap((area) =>
    area.modules.flatMap((mod) => mod.contents)
  );

  const [selectedContentId, setSelectedContentId] = useState<string>('c-dpoc');
  const selectedContent = fullContentList.find((c) => c.id === selectedContentId) || fullContentList[0];

  // Evidence Modals
  const [realExamModalContent, setRealExamModalContent] = useState<ContentItem | null>(null);
  const [simuladoModalContent, setSimuladoModalContent] = useState<ContentItem | null>(null);
  const [dominioModalContent, setDominioModalContent] = useState<ContentItem | null>(null);

  // DISPARAR SELEÇÃO DE ARQUIVO DO PC
  const handleOpenFileDialog = (type: 'PROVA_REAL' | 'SIMULADO') => {
    setPendingUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // QUANDO O USUÁRIO SELECIONA O ARQUIVO DO PC
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    setAnalyzingFileName(fileName);
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisStatusText('Carregando arquivo do computador e extraindo texto...');

    const isSimulado = pendingUploadType === 'SIMULADO';
    const guessedInstitution = fileName.toUpperCase().includes('USP')
      ? 'USP-SP'
      : fileName.toUpperCase().includes('ENARE')
      ? 'ENARE / FGV'
      : fileName.toUpperCase().includes('UNICAMP')
      ? 'UNICAMP'
      : isSimulado
      ? 'Medway Simulados'
      : 'Banca Examinadora';

    const guessedYear = 2025;
    const guessedTitle = isSimulado
      ? `Simulado Nacional ${guessedInstitution} 2025 (100 Questões)`
      : `Prova Oficial ${guessedInstitution} ${guessedYear} (100 Questões)`;

    // Etapa 1: Leitura (600ms)
    setTimeout(() => {
      setAnalysisStep(2);
      setAnalysisStatusText('IA identificando enunciados clínicos e opções A, B, C, D, E...');

      // Etapa 2: Categorização nas Grandes Áreas (1200ms)
      setTimeout(() => {
        setAnalysisStep(3);
        setAnalysisStatusText('Separando questões por Grande Área (Clínica Médica, Cirurgia, Pediatria, G.O., Preventiva)...');

        // Etapa 3: Mapeamento de Áreas e Subáreas (1800ms)
        setTimeout(() => {
          setAnalysisStep(4);
          setAnalysisStatusText('Mapeando Áreas (Pneumologia, Cardiologia, Trauma...) e Subáreas (DPOC, Asma, ICC, ATLS...) no currículo...');

          // Conclusão (2400ms)
          setTimeout(() => {
            const new100Questions = generate100QuestionsExam(
              guessedTitle,
              guessedInstitution,
              guessedYear,
              pendingUploadType
            );

            setQuestions(new100Questions);
            setActiveExamType(pendingUploadType);
            setExamTitle(guessedTitle);
            setInstitution(guessedInstitution);
            setExamYear(guessedYear);
            setIsCorrected(false);
            setStudentAnswers({});
            setQuestionErrorReasons({});
            setIsAnalyzing(false);
            setSelectedTab('gabarito');

            setSuccessBanner({
              title: `${pendingUploadType === 'PROVA_REAL' ? 'Prova' : 'Simulado'} analisada pela IA com sucesso!`,
              desc: `100 questões mapeadas em Grande Área, Área e Subárea. A folha de gabarito foi gerada para você preencher suas respostas.`,
            });

            setTimeout(() => setSuccessBanner(null), 5000);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  // MARCAR RESPOSTA NO GABARITO
  const handleSelectOption = (qNumber: number, option: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [qNumber]: option,
    }));
  };

  // PREENCHIMENTO RÁPIDO PARA TESTES
  const handleFastFillMockAnswers = (targetAccuracy: number = 82) => {
    const answers: { [qNum: number]: string } = {};
    const letters = ['A', 'B', 'C', 'D', 'E'];

    for (let i = 1; i <= 100; i++) {
      const correctOption = officialAnswers[i] || 'A';
      // probabilidade de acertar baseada em targetAccuracy
      const willHit = (i * 7) % 100 < targetAccuracy;
      if (willHit) {
        answers[i] = correctOption;
      } else {
        // Escolhe uma alternativa errada
        const wrongLetters = letters.filter((l) => l !== correctOption);
        answers[i] = wrongLetters[i % wrongLetters.length];
      }
    }

    setStudentAnswers(answers);
  };

  // LIMPAR GABARITO
  const handleClearAnswers = () => {
    setStudentAnswers({});
    setIsCorrected(false);
    setQuestionErrorReasons({});
  };

  // CORRIGIR PROVA
  const handleCorrectExam = () => {
    const updatedQuestions = questions.map((q) => {
      const studentAns = studentAnswers[q.questionNumber];
      const officialAns = officialAnswers[q.questionNumber] || 'A';
      const isCorrect = studentAns === officialAns;
      return {
        ...q,
        isCorrect,
        errorReason: isCorrect ? undefined : (questionErrorReasons[q.questionNumber] || 'entre_duas'),
      };
    });

    setQuestions(updatedQuestions);
    setIsCorrected(true);

    // Inicializa motivos padrão para os erros
    const reasonsMap: { [qNum: number]: ErrorReasonType } = {};
    updatedQuestions.forEach((q) => {
      if (!q.isCorrect) {
        reasonsMap[q.questionNumber] = questionErrorReasons[q.questionNumber] || 'entre_duas';
      }
    });
    setQuestionErrorReasons(reasonsMap);

    setSuccessBanner({
      title: 'Correção Concluída & Desempenho Diagnosticado!',
      desc: 'Veja o relatório detalhado de acurácia por Grande Área, Área e Subárea logo abaixo.',
    });

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // RETROALIMENTAÇÃO NO CURRÍCULO E CADERNO DE ERROS
  const handleFeedCurriculumAndCaderno = () => {
    // 1. Gravar erros no Caderno de Erros do localStorage
    try {
      const existingCadernoStr = localStorage.getItem('synapsemed_caderno_erros');
      const existingCaderno: CadernoErroItem[] = existingCadernoStr ? JSON.parse(existingCadernoStr) : [];

      const wrongQuestions = questions.filter((q) => !q.isCorrect);
      const newItems: CadernoErroItem[] = wrongQuestions.map((q) => ({
        id: `err-${Date.now()}-${q.questionNumber}`,
        topic: `${q.contentName} (Q${q.questionNumber})`,
        specialty: q.areaName,
        reason: q.statementSnippet,
        reasonCategory: questionErrorReasons[q.questionNumber] || 'entre_duas',
        institutionOrContext: `${institution} ${examYear} (${activeExamType === 'PROVA_REAL' ? 'Prova Real' : 'Simulado'})`,
        createdAt: new Date().toISOString().split('T')[0],
        examType: activeExamType,
      }));

      const combined = [...newItems, ...existingCaderno];
      localStorage.setItem('synapsemed_caderno_erros', JSON.stringify(combined));
    } catch (e) {
      console.error('Erro ao salvar caderno de erros:', e);
    }

    setSuccessBanner({
      title: 'Domínio Atualizado & Caderno de Erros Alimentado!',
      desc: `${questions.filter((q) => !q.isCorrect).length} questões incorretas foram enviadas ao Caderno de Erros. O domínio por subárea foi recalculado na árvore curricular.`,
    });

    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Reclassificação manual de questão
  const handleUpdateClassification = (questionId: string, newContentId: string) => {
    const targetContent = allContents.find((c) => c.id === newContentId);
    if (!targetContent) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              contentId: targetContent.id,
              contentName: targetContent.name,
              moduloName: targetContent.moduleName,
              areaName: targetContent.areaName,
            }
          : q
      )
    );
  };

  // CÁLCULOS ESTATÍSTICOS
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(studentAnswers).length;
  const correctCount = isCorrected
    ? questions.filter((q) => studentAnswers[q.questionNumber] === (officialAnswers[q.questionNumber] || 'A')).length
    : 0;
  const accuracyPercent = isCorrected ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Estatísticas por Grande Área
  const areaStats = [
    'CLÍNICA MÉDICA',
    'CIRURGIA GERAL',
    'PEDIATRIA',
    'GINECOLOGIA E OBSTETRÍCIA',
    'MEDICINA PREVENTIVA E SOCIAL',
  ].map((areaName) => {
    const areaQuestions = questions.filter((q) => q.areaName.toUpperCase() === areaName);
    const total = areaQuestions.length;
    const answered = areaQuestions.filter((q) => studentAnswers[q.questionNumber]).length;
    const hits = areaQuestions.filter(
      (q) => studentAnswers[q.questionNumber] === (officialAnswers[q.questionNumber] || 'A')
    ).length;
    const percent = total > 0 ? Math.round((hits / total) * 100) : 0;

    // Subdivisão em Áreas / Módulos desta Grande Área
    const modulesMap: { [mod: string]: { total: number; hits: number; subareas: { [sub: string]: { total: number; hits: number } } } } = {};
    areaQuestions.forEach((q) => {
      if (!modulesMap[q.moduloName]) {
        modulesMap[q.moduloName] = { total: 0, hits: 0, subareas: {} };
      }
      modulesMap[q.moduloName].total += 1;
      const isHit = studentAnswers[q.questionNumber] === (officialAnswers[q.questionNumber] || 'A');
      if (isHit) modulesMap[q.moduloName].hits += 1;

      if (!modulesMap[q.moduloName].subareas[q.contentName]) {
        modulesMap[q.moduloName].subareas[q.contentName] = { total: 0, hits: 0 };
      }
      modulesMap[q.moduloName].subareas[q.contentName].total += 1;
      if (isHit) modulesMap[q.moduloName].subareas[q.contentName].hits += 1;
    });

    return {
      areaName,
      total,
      answered,
      hits,
      percent,
      modules: modulesMap,
    };
  });

  // Filtro de questões para exibição na folha de gabarito
  const filteredQuestions = questions.filter((q) => {
    if (gabaritoAreaFilter !== 'TODAS' && q.areaName.toUpperCase() !== gabaritoAreaFilter) {
      return false;
    }
    if (gabaritoStatusFilter === 'PENDENTES' && studentAnswers[q.questionNumber]) {
      return false;
    }
    if (isCorrected) {
      const isHit = studentAnswers[q.questionNumber] === (officialAnswers[q.questionNumber] || 'A');
      if (gabaritoStatusFilter === 'ACERTOS' && !isHit) return false;
      if (gabaritoStatusFilter === 'ERROS' && isHit) return false;
    }
    return true;
  });

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

      {/* Header com os dois botões solicitados: Submeter Nova Prova & Submeter Novo Simulado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">assignment</span>
            <span>Provas Reais &amp; Simulados</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Extração Automática &amp; Gabarito</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Provas na Íntegra e Gabaritos
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            Anexe os arquivos de provas ou simulados do seu PC. A IA analisa e categoriza automaticamente as 100 questões em Grande Área, Área e Subárea.
          </p>
        </div>

        {/* BOTOES SOLICITADOS: Submeter nova prova e Submeter novo simulado */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenFileDialog('PROVA_REAL')}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
            title="Clique para abrir os arquivos do seu computador e anexar uma prova na íntegra"
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>Submeter Nova Prova</span>
          </button>

          <button
            onClick={() => handleOpenFileDialog('SIMULADO')}
            className="px-4 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
            title="Clique para abrir os arquivos do seu computador e anexar um simulado completo"
          >
            <span className="material-symbols-outlined text-base">quiz</span>
            <span>Submeter Novo Simulado</span>
          </button>
        </div>
      </div>

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
                Separando as 100 questões em <strong>Grande Área</strong> (ex: CLÍNICA MÉDICA) &rarr; <strong>Área</strong> (ex: PNEUMOLOGIA) &rarr; <strong>Subárea</strong> (ex: DPOC) com enunciados e alternativas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BANNER DE SUCESSO / NOTIFICAÇÃO */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3 shadow-xs">
          <span className="material-symbols-outlined text-emerald-700 text-xl shrink-0 mt-0.5">check_circle</span>
          <div className="text-xs space-y-0.5">
            <strong className="block font-bold text-emerald-900">{successBanner.title}</strong>
            <p className="text-emerald-800">{successBanner.desc}</p>
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO POR ABAS: HISTÓRICO, GABARITO (100Q), MAPEAMENTO, EVIDÊNCIA */}
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container w-fit flex-wrap">
        <button
          onClick={() => setSelectedTab('historico')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'historico'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          Histórico de Provas
        </button>
        <button
          onClick={() => setSelectedTab('gabarito')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedTab === 'gabarito'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm text-primary">fact_check</span>
          <span>Gabarito (100 Questões)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[0.625rem] font-bold">
            {answeredCount}/100
          </span>
        </button>
        <button
          onClick={() => setSelectedTab('revisao')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            selectedTab === 'revisao'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span>Mapeamento de Questões</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary text-[0.625rem] font-bold">
            100
          </span>
        </button>
        <button
          onClick={() => setSelectedTab('evidencias')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedTab === 'evidencias'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm text-primary">auto_stories</span>
          <span>Evidência Pedagógica</span>
        </button>
      </div>

      {/* ABA GABARITO (FOLHA DE 100 QUESTÕES & ANÁLISE DE DOMÍNIO) */}
      {selectedTab === 'gabarito' && (
        <div className="space-y-6">
          {/* Card de Controle da Folha de Respostas */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-code-metric">
                    {institution} • {examYear}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary text-[0.6875rem] font-semibold">
                    {activeExamType === 'PROVA_REAL' ? 'Prova Oficial na Íntegra' : 'Simulado Completo'}
                  </span>
                  <span className="text-xs text-secondary">• 100 Questões de Múltipla Escolha</span>
                </div>
                <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface mt-1">
                  {examTitle}
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Marque sua folha de respostas de 1 a 100. Ao concluir, clique em &ldquo;Corrigir Gabarito&rdquo; para que a IA analise seu domínio por Grande Área, Área e Subárea.
                </p>
              </div>

              {/* Ações Rápidas de Gabarito */}
              <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
                <button
                  onClick={() => handleFastFillMockAnswers(82)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5"
                  title="Preenche aleatoriamente as respostas para você testar a análise com 1 clique"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Preenchimento Rápido</span>
                </button>

                {answeredCount > 0 && (
                  <button
                    onClick={handleClearAnswers}
                    className="px-3 py-1.5 rounded-xl border border-surface-container hover:bg-surface-container-low text-xs font-semibold text-secondary transition-all"
                  >
                    Limpar
                  </button>
                )}

                <button
                  onClick={handleCorrectExam}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-98"
                >
                  <span className="material-symbols-outlined text-sm">grading</span>
                  <span>Corrigir Gabarito &amp; Analisar</span>
                </button>
              </div>
            </div>

            {/* BARRA DE PROGRESSO DO PREENCHIMENTO */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-on-surface">
                <span>Progresso do Preenchimento:</span>
                <span className="font-code-metric">
                  {answeredCount} de 100 respondidas ({Math.round((answeredCount / 100) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    answeredCount === 100 ? 'bg-emerald-700' : 'bg-primary'
                  }`}
                  style={{ width: `${(answeredCount / 100) * 100}%` }}
                />
              </div>
            </div>

            {/* RELATÓRIO DE DESEMPENHO E DOMÍNIO POR GRANDE ÁREA, ÁREA E SUBÁREA (APÓS CORREÇÃO) */}
            {isCorrected && (
              <div className="p-5 rounded-2xl bg-surface-container-low/70 border-2 border-emerald-400/40 space-y-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex flex-col items-center justify-center">
                      <span className="text-[0.5625rem] font-bold uppercase">Nota</span>
                      <span className="font-code-metric font-extrabold text-lg leading-tight">
                        {accuracyPercent}%
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface">
                          Desempenho Geral: {correctCount} de 100 Acertos
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                          {accuracyPercent >= 80 ? 'Aprovado na Nota de Corte' : 'Abaixo da Nota de Corte (Meta ≥80%)'}
                        </span>
                      </div>
                      <p className="text-xs text-secondary mt-0.5">
                        {100 - correctCount} questões incorretas catalogadas para revisão clínica e retroalimentação.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFeedCurriculumAndCaderno}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto active:scale-98"
                  >
                    <span className="material-symbols-outlined text-sm">sync</span>
                    <span>Retroalimentar Currículo &amp; Caderno de Erros</span>
                  </button>
                </div>

                {/* DOMÍNIO NAS 5 GRANDES ÁREAS */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">pie_chart</span>
                    <span>Desempenho e Domínio por Grande Área:</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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

                        {/* Detalhe de Áreas/Módulos */}
                        <div className="pt-1 text-[0.625rem] text-secondary space-y-0.5">
                          {Object.entries(item.modules).slice(0, 2).map(([modName, modData]) => (
                            <div key={modName} className="flex justify-between truncate">
                              <span className="truncate">{modName}:</span>
                              <span className="font-bold text-on-surface">
                                {modData.hits}/{modData.total}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DIAGNÓSTICO DETALHADO POR ÁREA E SUBÁREA */}
                <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2 text-xs">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                    <span>Mapeamento de Gargalos Pedagógicos por Subárea:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {questions
                      .filter((q) => !q.isCorrect)
                      .slice(0, 6)
                      .map((q) => (
                        <div
                          key={q.id}
                          className="p-2 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-950 flex items-start justify-between gap-2"
                        >
                          <div className="space-y-0.5 truncate">
                            <div className="flex items-center gap-1 text-[0.625rem] font-bold text-rose-800">
                              <span>Q{q.questionNumber}</span>
                              <span>•</span>
                              <span className="truncate">{q.areaName}</span>
                            </div>
                            <div className="font-semibold text-xs text-on-surface truncate">
                              {q.contentName}
                            </div>
                            <div className="text-[0.625rem] text-secondary truncate">
                              Área: {q.moduloName}
                            </div>
                          </div>
                          <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-bold shrink-0">
                            Erro
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* FILTROS DA FOLHA DE RESPOSTAS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              {/* Filtro por Grande Área */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-secondary font-semibold">Grande Área:</span>
                {GRANDES_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setGabaritoAreaFilter(area)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
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

              {/* Filtro de Status (se corrigida) */}
              {isCorrected && (
                <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setGabaritoStatusFilter('TODAS')}
                    className={`px-2.5 py-1 rounded-md ${
                      gabaritoStatusFilter === 'TODAS' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-secondary'
                    }`}
                  >
                    Todas (100)
                  </button>
                  <button
                    onClick={() => setGabaritoStatusFilter('ACERTOS')}
                    className={`px-2.5 py-1 rounded-md ${
                      gabaritoStatusFilter === 'ACERTOS' ? 'bg-surface-container-lowest text-emerald-800 shadow-xs' : 'text-secondary'
                    }`}
                  >
                    Acertos ({correctCount})
                  </button>
                  <button
                    onClick={() => setGabaritoStatusFilter('ERROS')}
                    className={`px-2.5 py-1 rounded-md ${
                      gabaritoStatusFilter === 'ERROS' ? 'bg-surface-container-lowest text-rose-800 shadow-xs' : 'text-secondary'
                    }`}
                  >
                    Erros ({100 - correctCount})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GRADE DE PREENCHIMENTO DAS 100 QUESTÕES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredQuestions.map((q) => {
              const selectedOpt = studentAnswers[q.questionNumber];
              const officialOpt = officialAnswers[q.questionNumber] || 'A';
              const isHit = isCorrected && selectedOpt === officialOpt;
              const isMiss = isCorrected && selectedOpt && selectedOpt !== officialOpt;

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCorrected
                      ? isHit
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : isMiss
                        ? 'bg-rose-50/50 border-rose-300'
                        : 'bg-surface-container-lowest border-surface-container'
                      : selectedOpt
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-surface-container-lowest border-surface-container'
                  }`}
                >
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
                    {isCorrected && (
                      <div className="shrink-0 text-right">
                        {isHit ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                            <span>✅ Acerto</span>
                          </span>
                        ) : isMiss ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                            <span>❌ Erro</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-surface-container text-secondary text-[0.6875rem] font-semibold">
                            Em branco
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BOLINHAS DE ALTERNATIVA (A, B, C, D, E) */}
                  <div className="mt-3 pt-2.5 border-t border-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6875rem] font-bold text-secondary mr-1">Alternativas:</span>
                      {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                        const isChosen = selectedOpt === opt;
                        const isOfficial = isCorrected && officialOpt === opt;

                        let btnClass = 'bg-surface-container text-on-surface hover:bg-surface-container-high border-surface-container';
                        if (isCorrected) {
                          if (isOfficial) {
                            btnClass = 'bg-emerald-600 text-white font-bold border-emerald-700 ring-2 ring-emerald-400';
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

                    {/* Classificação do Erro (se errou na correção) */}
                    {isMiss && (
                      <div className="flex items-center gap-1 text-[0.625rem]">
                        <span className="text-secondary font-semibold">Motivo:</span>
                        <select
                          value={questionErrorReasons[q.questionNumber] || 'entre_duas'}
                          onChange={(e) =>
                            setQuestionErrorReasons((prev) => ({
                              ...prev,
                              [q.questionNumber]: e.target.value as ErrorReasonType,
                            }))
                          }
                          className="h-6 px-1.5 bg-surface-container-lowest rounded border border-rose-300 text-rose-950 font-bold text-[0.625rem] focus:outline-none"
                        >
                          <option value="nao_sabia">Não sabia (Lacuna Teórica)</option>
                          <option value="entre_duas">Dúvida entre Duas</option>
                          <option value="interpretacao">Falha de Interpretação</option>
                          <option value="desatencao">Desatenção / Pegadinha</option>
                          <option value="esqueci">Esqueci (Memória)</option>
                          <option value="raciocinio">Raciocínio Clínico</option>
                          <option value="outro">Outro / Chute</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA HISTÓRICO DE PROVAS & SIMULADOS */}
      {selectedTab === 'historico' && (
        <div className="space-y-6">
          {/* Próximo Simulado Agendado */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-primary/40 shadow-sm ring-2 ring-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-code-metric text-xs font-bold">
                  Simulado Oficial Agendado
                </span>
                <span className="text-xs text-secondary font-medium">Atividade Extraordinária de Sábado</span>
              </div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Simulado Nacional ENARE 2025 #3 (100 Questões)
              </h2>
              <p className="text-xs text-secondary leading-relaxed">
                100 questões inéditas estilo FGV/ENARE • Sábado às 08:00 (4h de duração) • Não consome a cota regular de 8h semanais.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedTab('gabarito');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-sm cursor-pointer"
              >
                Abrir Folha de Gabarito (100q)
              </button>
            </div>
          </div>

          {/* Histórico Longitudinal */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm space-y-4">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider">
              Histórico de Provas na Íntegra e Simulados Corrigidos
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">
                      Exame Nacional de Residência - ENARE 2024
                    </span>
                    <span className="px-2 py-0.2 rounded bg-surface-container text-secondary text-[0.625rem] font-medium">
                      ENARE / FGV
                    </span>
                    <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[0.625rem] font-bold">
                      100 Questões Mapeadas
                    </span>
                  </div>
                  <div className="text-xs text-secondary">
                    Realizada • 79 de 100 questões corretas (79,0% de acurácia)
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-secondary block">Acurácia Geral</span>
                    <span className="font-code-metric text-base font-bold text-emerald-700">
                      79,0%
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTab('gabarito')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
                  >
                    Ver Gabarito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA MAPEAMENTO DE QUESTÕES (GRANDE ÁREA -> ÁREA -> SUBÁREA) */}
      {selectedTab === 'revisao' && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                  {institution} • {examYear}
                </span>
                <span className="text-xs text-secondary">• {examTitle}</span>
              </div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                Classificação das 100 Questões na Árvore Curricular
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                A IA classificou cada uma das 100 questões na hierarquia: <strong>Grande Área</strong> &rarr; <strong>Área/Módulo</strong> &rarr; <strong>Subárea/Conteúdo</strong>. Você pode ajustar se desejar.
              </p>
            </div>

            <button
              onClick={handleFeedCurriculumAndCaderno}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Confirmar &amp; Alimentar Currículo</span>
            </button>
          </div>

          {/* Lista de 100 Questões com Mapeamento Completo */}
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCorrected
                    ? q.isCorrect
                      ? 'bg-surface-container-low/40 border-surface-container'
                      : 'bg-rose-50/40 border-rose-200'
                    : 'bg-surface-container-low/30 border-surface-container'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-code-metric text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        Questão {q.questionNumber}
                      </span>
                      {isCorrected && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {q.isCorrect ? 'Acerto ✅' : 'Erro ❌'}
                        </span>
                      )}
                      <span className="text-[0.625rem] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        {q.areaName}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface font-medium leading-relaxed">
                      &ldquo;{q.statementSnippet}&rdquo;
                    </p>

                    {/* Mapeamento: Grande Área -> Área -> Subárea */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                      <span className="text-secondary text-[0.6875rem] font-semibold">
                        Hierarquia Pedagógica:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-bold text-[0.6875rem]">
                          {q.areaName}
                        </span>
                        <span className="text-secondary text-xs">&rarr;</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-secondary text-[0.6875rem]">
                          {q.moduloName}
                        </span>
                        <span className="text-secondary text-xs">&rarr;</span>
                        <select
                          value={q.contentId}
                          onChange={(e) => handleUpdateClassification(q.id, e.target.value)}
                          className="h-7 px-2 bg-surface-container-lowest rounded-lg border border-surface-container text-on-surface font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {allContents.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.moduleName})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA EVIDÊNCIA PEDAGÓGICA */}
      {selectedTab === 'evidencias' && (
        <div className="space-y-6">
          {/* Quadro Geral: Os 4 Pilares de Evidência da Plataforma */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container pb-4">
              <div>
                <span className="text-[0.6875rem] font-bold text-primary tracking-wider uppercase">
                  Arquitetura Pedagógica de Evidências
                </span>
                <h2 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
                  Como as Provas Reais e Simulados Alimentam seu Domínio e Planejamento
                </h2>
                <p className="text-xs text-secondary mt-1 max-w-3xl leading-relaxed">
                  A prova real não é apenas mais uma fonte de desempenho: ela é a evidência de aplicação mais próxima do que queremos prever na residência médica.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  4 Pilares Interligados
                </span>
              </div>
            </div>

            {/* Grid dos 4 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-blue-700">school</span>
                  <span>1. Medway</span>
                </div>
                <div className="text-[0.6875rem] text-primary font-semibold">Aprendizado Primário</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Eu aprendi este conteúdo?&rdquo;</em> Avaliado na pós-aula e reavaliações curriculares.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-purple-700">psychology</span>
                  <span>2. Osler</span>
                </div>
                <div className="text-[0.6875rem] text-purple-800 font-semibold">Retenção de Memória</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Estou conseguindo lembrar?&rdquo;</em> Flashcards e repetição espaçada FSRS a longo prazo.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5 ring-1 ring-emerald-400/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-emerald-700">history_edu</span>
                  <span>3. Provas Reais</span>
                </div>
                <div className="text-[0.6875rem] text-emerald-800 font-semibold">Aplicação Direta</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Consigo acertar na prova real?&rdquo;</em> Alta fidelidade, identidade preservada e diagnóstico de erros.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5 ring-1 ring-purple-400/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-purple-700">quiz</span>
                  <span>4. Simulados</span>
                </div>
                <div className="text-[0.6875rem] text-purple-800 font-semibold">Aplicação Integrada</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Consigo integrar sob fadiga e tempo?&rdquo;</em> Ritmo de prova, pace e evolução global.
                </p>
              </div>
            </div>
          </div>

          {/* Seletor de Conteúdo Curricular para Análise Prática */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">search</span>
                Selecione um Conteúdo para Inspecionar os Dossiês de Evidência:
              </span>
              <span className="text-[0.6875rem] text-secondary block">
                Compare as evidências de aplicação direta e integrada coletadas até o momento.
              </span>
            </div>

            <select
              value={selectedContentId}
              onChange={(e) => setSelectedContentId(e.target.value)}
              className="h-9 px-3 bg-surface-container-lowest rounded-xl border border-surface-container text-on-surface font-bold text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              {fullContentList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Domínio: {c.estimatedMastery}%)
                </option>
              ))}
            </select>
          </div>

          {/* SÍNTESE DO CÉREBRO DE DOMÍNIO PARA O CONTEÚDO SELECIONADO */}
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

                {/* As 4 Dimensões em Grid de Destaque */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-blue-800 flex items-center gap-1">
                      <span>📚</span> Conhecimento
                    </span>
                    <div className="font-code-metric text-xl font-bold text-blue-900">
                      {selectedDomainData.knowledgeScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Pós-aula Medway
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-emerald-800 flex items-center gap-1">
                      <span>🎯</span> Aplicação Direta
                    </span>
                    <div className="font-code-metric text-xl font-bold text-emerald-900">
                      {selectedDomainData.applicationScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Provas Reais
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-purple-800 flex items-center gap-1">
                      <span>🧠</span> Retenção FSRS
                    </span>
                    <div className="font-code-metric text-xl font-bold text-purple-900">
                      {selectedDomainData.retentionScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Osler
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-on-surface flex items-center gap-1">
                      <span>🛡️</span> Confiabilidade
                    </span>
                    <div className="font-code-metric text-xl font-bold text-on-surface">
                      {selectedDomainData.confidenceScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Amostra estatística
                    </div>
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
