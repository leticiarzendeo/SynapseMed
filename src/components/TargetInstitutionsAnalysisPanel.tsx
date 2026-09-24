import React, { useState, useMemo } from 'react';
import {
  TargetInstitutionKey,
  ExamQuestionEntry,
  ContentTargetIncidenceStats,
  ContentItem,
} from '../types';
import {
  TARGET_INSTITUTIONS_CONFIG,
  TARGET_INSTITUTIONS_LIST,
  PAST_5_YEARS,
  INITIAL_OFFICIAL_EXAMS_META,
  TargetOfficialExamMeta,
} from '../data/targetInstitutionsExamsData';
import {
  calculateTargetInstitutionsIncidence,
  classifyQuestionStatementWithAI,
  loadAllTargetExamQuestions,
  updateQuestionManualClassification,
  addAnalyzedExamQuestions,
} from '../utils/targetExamIncidenceEngine';
import { getAllCurriculumContents } from '../data/mockData';

interface TargetInstitutionsAnalysisPanelProps {
  onOpenCaderno?: (examId: string) => void;
  onNavigateToContent?: (contentId: string) => void;
}

export const TargetInstitutionsAnalysisPanel: React.FC<TargetInstitutionsAnalysisPanelProps> = ({
  onNavigateToContent,
}) => {
  // Estado das questões
  const [questions, setQuestions] = useState<ExamQuestionEntry[]>(() =>
    loadAllTargetExamQuestions()
  );

  // Filtros
  const [selectedInstitution, setSelectedInstitution] = useState<TargetInstitutionKey | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'duvida_revisao' | 'ia_confiavel' | 'corrigido_manual'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'incidencia' | 'questoes' | 'provas_5anos' | 'prioridade_comparativa'>('incidencia');

  // Modal de Submissão de Prova com IA
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadInstitution, setUploadInstitution] = useState<TargetInstitutionKey>('USP-RP');
  const [uploadYear, setUploadYear] = useState<number>(2025);
  const [uploadText, setUploadText] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Modal de Correção Manual da Classificação de Questão
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestionEntry | null>(null);
  const [manualArea, setManualArea] = useState('Clínica Médica');
  const [manualModule, setManualModule] = useState('Pneumologia');
  const [manualContentId, setManualContentId] = useState('c-disturbios-obstrutivos');
  const [manualCorrectionNote, setManualCorrectionNote] = useState('');

  // Notificação de sucesso
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Currículo completo
  const allContents = useMemo(() => getAllCurriculumContents(), []);

  // Lista única de Áreas e Módulos para os selects manuais
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    allContents.forEach((c) => set.add(c.areaName));
    return Array.from(set);
  }, [allContents]);

  const availableModulesForArea = useMemo(() => {
    const set = new Set<string>();
    allContents
      .filter((c) => c.areaName === manualArea)
      .forEach((c) => set.add(c.moduloName));
    return Array.from(set);
  }, [allContents, manualArea]);

  const availableContentsForModule = useMemo(() => {
    return allContents.filter(
      (c) => c.areaName === manualArea && c.moduloName === manualModule
    );
  }, [allContents, manualArea, manualModule]);

  // Estatísticas de incidência calculadas para todos os conteúdos
  const contentsWithIncidence = useMemo(() => {
    return allContents.map((c) => {
      const stats = calculateTargetInstitutionsIncidence(c.id, questions);
      return {
        content: c,
        stats,
      };
    }).sort((a, b) => b.stats.calculatedPriorityScore - a.stats.calculatedPriorityScore);
  }, [allContents, questions]);

  // Questões filtradas para exibição no explorer
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedInstitution !== 'ALL' && q.institution !== selectedInstitution) {
        return false;
      }
      if (selectedYear !== 'ALL' && q.year !== selectedYear) {
        return false;
      }
      if (selectedStatus !== 'ALL' && q.classificationStatus !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSnippet = q.statementSnippet.toLowerCase().includes(query);
        const matchContent = q.contentName.toLowerCase().includes(query);
        const matchModule = q.moduloName.toLowerCase().includes(query);
        const matchArea = q.areaName.toLowerCase().includes(query);
        if (!matchSnippet && !matchContent && !matchModule && !matchArea) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedInstitution, selectedYear, selectedStatus, searchQuery]);

  // Contagem de questões com dúvida pendente
  const doubtsCount = useMemo(() => {
    return questions.filter((q) => q.classificationStatus === 'duvida_revisao').length;
  }, [questions]);

  // Abrir modal de edição manual
  const handleOpenEditQuestion = (q: ExamQuestionEntry) => {
    setEditingQuestion(q);
    setManualArea(q.areaName || 'Clínica Médica');
    setManualModule(q.moduloName || 'Pneumologia');
    setManualContentId(q.contentId || 'c-disturbios-obstrutivos');
    setManualCorrectionNote(q.userCorrectionNote || '');
  };

  // Salvar correção manual
  const handleSaveManualCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const chosenContent = allContents.find((c) => c.id === manualContentId);
    const contentName = chosenContent ? chosenContent.name : manualContentId;

    const updated = updateQuestionManualClassification(editingQuestion.id, {
      contentId: manualContentId,
      contentName,
      moduloName: manualModule,
      areaName: manualArea,
      note: manualCorrectionNote,
    });

    setQuestions(updated);
    setEditingQuestion(null);
    triggerToast(`Classificação da questão ajustada para "${contentName}" (${manualArea} → ${manualModule}) com sucesso!`);
  };

  // Simular processamento de prova com IA
  const handleProcessExamWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingAI(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
      setTimeout(() => {
        setProcessingStep(3);
        setTimeout(() => {
          setProcessingStep(4);
          setTimeout(() => {
            // Extrair enunciados (ou gerar se estiver em branco)
            const lines = uploadText
              .split('\n')
              .map((l) => l.trim())
              .filter((l) => l.length > 20);

            const newQuestionsList: ExamQuestionEntry[] = [];
            const timestamp = Date.now();

            if (lines.length > 0) {
              lines.forEach((line, idx) => {
                const qNum = idx + 1;
                const classified = classifyQuestionStatementWithAI({
                  statement: line,
                  institution: uploadInstitution,
                  year: uploadYear,
                  questionNumber: qNum,
                  allContents,
                });

                newQuestionsList.push({
                  id: `q-upload-${timestamp}-${qNum}`,
                  questionNumber: qNum,
                  statementSnippet: line,
                  contentId: classified.contentId,
                  contentName: classified.contentName,
                  moduloName: classified.moduloName,
                  areaName: classified.areaName,
                  institution: uploadInstitution,
                  year: uploadYear,
                  isCorrect: false,
                  classificationStatus: classified.classificationStatus,
                  confidenceScore: classified.confidenceScore,
                  doubtReason: classified.doubtReason,
                  aiSuggestedContentId: classified.contentId,
                  mappedOslerBlocks: classified.mappedOslerBlocks,
                });
              });
            } else {
              // Simula extração automática de 5 questões da banca e ano selecionados
              const sampleSnippets = [
                `Paciente com sintomas respiratórios crônicos e padrão obstrutivo fixo na espirometria pós-broncodilatador. Exame da banca ${uploadInstitution} ${uploadYear}.`,
                `Critérios de gravidade e indicação de intervenção cirúrgica imediata no abdome agudo inflamatório por apendicite. Prova ${uploadInstitution} ${uploadYear}.`,
                `Medidas de associação epidemiológica em estudo de coorte prospectivo e cálculo de risco relativo. Exame ${uploadInstitution} ${uploadYear}.`,
                `Rastreamento e manejo de alterações pressóricas no terceiro trimestre da gestação com sulfato de magnésio. Banca ${uploadInstitution} ${uploadYear}.`,
                `Abordagem inicial do choque hemorrágico no politraumatizado segundo protocolo ATLS. Prova ${uploadInstitution} ${uploadYear}.`,
              ];

              sampleSnippets.forEach((snippet, idx) => {
                const qNum = idx + 1;
                const classified = classifyQuestionStatementWithAI({
                  statement: snippet,
                  institution: uploadInstitution,
                  year: uploadYear,
                  questionNumber: qNum,
                  allContents,
                });

                newQuestionsList.push({
                  id: `q-upload-${timestamp}-${qNum}`,
                  questionNumber: qNum,
                  statementSnippet: snippet,
                  contentId: classified.contentId,
                  contentName: classified.contentName,
                  moduloName: classified.moduloName,
                  areaName: classified.areaName,
                  institution: uploadInstitution,
                  year: uploadYear,
                  isCorrect: false,
                  classificationStatus: classified.classificationStatus,
                  confidenceScore: classified.confidenceScore,
                  doubtReason: classified.doubtReason,
                  aiSuggestedContentId: classified.contentId,
                  mappedOslerBlocks: classified.mappedOslerBlocks,
                });
              });
            }

            const updated = addAnalyzedExamQuestions(newQuestionsList);
            setQuestions(updated);
            setIsProcessingAI(false);
            setShowUploadModal(false);
            setUploadText('');
            triggerToast(`${newQuestionsList.length} questões de ${uploadInstitution} (${uploadYear}) processadas e integradas ao currículo!`);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* TOAST DE SUCESSO */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* CABEÇALHO DO PAINEL DAS INSTITUIÇÕES-ALVO */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Análise Automática de Provas das Instituições-Alvo (Últimos 5 Anos)</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mt-1">
              Inteligência de Incidência Curricular &amp; Priorização
            </h2>
            <p className="text-xs text-secondary mt-1 max-w-3xl leading-relaxed">
              Mapeamento de questões dos últimos 5 anos (2021 a 2025) de <strong>USP-RP</strong>, <strong>USP-SP</strong>, <strong>UNICAMP</strong>, <strong>ENAMED</strong> e <strong>HIAE</strong> na estrutura <strong>Área &rarr; Módulo &rarr; Conteúdo</strong> (Medway + Osler).
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>Analisar Nova Prova com IA</span>
            </button>
          </div>
        </div>

        {/* CARDS DAS 5 INSTITUIÇÕES-ALVO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {/* Todas */}
          <button
            onClick={() => setSelectedInstitution('ALL')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedInstitution === 'ALL'
                ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary'
                : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.6875rem] font-bold uppercase text-secondary">Visão Geral</span>
              <span className="text-xs font-mono font-bold text-primary">{questions.length}</span>
            </div>
            <div className="text-xs font-bold text-on-surface mt-1">Todas as 5 Bancas</div>
            <div className="text-[0.625rem] text-secondary mt-0.5">25 provas no ciclo</div>
          </button>

          {/* Cards Individuais */}
          {TARGET_INSTITUTIONS_LIST.map((key) => {
            const config = TARGET_INSTITUTIONS_CONFIG[key];
            const isSelected = selectedInstitution === key;
            const qCount = questions.filter((q) => q.institution === key).length;

            return (
              <button
                key={key}
                onClick={() => setSelectedInstitution(key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${config.bgLight} ${config.borderColor} shadow-xs ring-2 ring-offset-1 ring-primary`
                    : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[0.6875rem] font-bold px-1.5 py-0.5 rounded border ${config.badgeColor}`}>
                    {config.shortName}
                  </span>
                  <span className="text-xs font-mono font-bold text-on-surface">{qCount}</span>
                </div>
                <div className="text-xs font-bold text-on-surface mt-2 truncate" title={config.fullName}>
                  {config.fullName.split('-')[0].trim()}
                </div>
                <div className="text-[0.625rem] text-secondary mt-0.5 truncate">
                  5 anos cadastrados ({config.state})
                </div>
              </button>
            );
          })}
        </div>

        {/* ALERTA DE DÚVIDA / REVISÃO MANUAL (SE HOUVER) */}
        {doubtsCount > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-amber-700 text-xl shrink-0">help_center</span>
              <div>
                <strong>{doubtsCount} {doubtsCount === 1 ? 'questão sinalizada' : 'questões sinalizadas'} para revisão manual</strong>
                <p className="text-[0.6875rem] text-amber-800 mt-0.5">
                  A IA detectou sobreposição clínica ou ambiguidade diagnóstica e evitou associações forçadas.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('questoes');
                setSelectedStatus('duvida_revisao');
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-[0.6875rem] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              Ver e Validar Dúvidas
            </button>
          </div>
        )}
      </div>

      {/* SUB-ABAS DO PAINEL */}
      <div className="flex items-center justify-between gap-2 border-b border-surface-container pb-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('incidencia')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'incidencia'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">bar_chart</span>
            <span>Matriz de Incidência (Ranking &amp; Bancas)</span>
          </button>

          <button
            onClick={() => setActiveTab('prioridade_comparativa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prioridade_comparativa'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Incidência vs Prioridade de Estudo (Cérebro 2)</span>
          </button>

          <button
            onClick={() => setActiveTab('questoes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'questoes'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
            <span>Banco de Questões Classificadas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[0.625rem]">
              {filteredQuestions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('provas_5anos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'provas_5anos'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">folder_special</span>
            <span>Provas Oficiais dos 5 Anos (25 Provas)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: MATRIZ DE INCIDÊNCIA (RANKING NAS INSTITUIÇÕES-ALVO) */}
      {/* ========================================================================= */}
      {activeTab === 'incidencia' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Quais conteúdos são mais cobrados pelas minhas instituições-alvo?
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Ranking ordenado pela incidência ponderada nos últimos 5 anos (2021-2025), com peso maior para provas recentes e breakdown por banca.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[0.6875rem] font-bold text-secondary uppercase">Pesos de Recência:</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary text-[0.625rem]">2025: 1.0x</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary text-[0.625rem]">2024: 0.85x</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary text-[0.625rem]">2023: 0.70x</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary text-[0.625rem]">2022: 0.55x</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary text-[0.625rem]">2021: 0.40x</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-surface-container bg-surface-container-lowest">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container bg-surface-container-low/70 text-secondary text-[0.6875rem] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Conteúdo Curricular</th>
                  <th className="py-3 px-3">Grande Área &rarr; Módulo</th>
                  <th className="py-3 px-3 text-center">Total (5 Anos)</th>
                  <th className="py-3 px-3 text-center">USP-RP</th>
                  <th className="py-3 px-3 text-center">USP-SP</th>
                  <th className="py-3 px-3 text-center">UNICAMP</th>
                  <th className="py-3 px-3 text-center">ENAMED</th>
                  <th className="py-3 px-3 text-center">HIAE</th>
                  <th className="py-3 px-3 text-center">Tendência</th>
                  <th className="py-3 px-3 text-center">Faixa de Frequência</th>
                  <th className="py-3 px-4 text-center">Score Incidência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {contentsWithIncidence.map(({ content, stats }, idx) => {
                  const isTopTheme = stats.calculatedPriorityScore >= 85;
                  const isRareTheme = stats.frequencyTier === 'pouco_frequente' || stats.frequencyTier === 'raro';

                  return (
                    <tr
                      key={content.id}
                      className={`hover:bg-surface-container-low/50 transition-colors ${
                        isTopTheme ? 'bg-primary/5' : isRareTheme ? 'opacity-80' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-on-surface">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.6875rem] font-mono text-secondary w-5 text-right">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="block">{content.name}</span>
                            {content.mappedOslerBlockIds && content.mappedOslerBlockIds.length > 0 && (
                              <span className="text-[0.625rem] text-primary font-normal flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[0.6875rem]">style</span>
                                <span>{content.mappedOslerBlockIds.length} bloco(s) Osler mapeado(s)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-secondary text-[0.6875rem]">
                        <span className="font-semibold text-on-surface block">{content.areaName}</span>
                        <span>{content.moduloName}</span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-sm text-on-surface">
                        {stats.totalQuestions}
                      </td>

                      {/* 5 Bancas-Alvo */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold font-mono ${
                          stats.byInstitution['USP-RP'].questionCount > 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'text-outline-variant'
                        }`}>
                          {stats.byInstitution['USP-RP'].questionCount}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold font-mono ${
                          stats.byInstitution['USP-SP'].questionCount > 0
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'text-outline-variant'
                        }`}>
                          {stats.byInstitution['USP-SP'].questionCount}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold font-mono ${
                          stats.byInstitution['UNICAMP'].questionCount > 0
                            ? 'bg-rose-100 text-rose-900 border border-rose-200'
                            : 'text-outline-variant'
                        }`}>
                          {stats.byInstitution['UNICAMP'].questionCount}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold font-mono ${
                          stats.byInstitution['ENAMED'].questionCount > 0
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'text-outline-variant'
                        }`}>
                          {stats.byInstitution['ENAMED'].questionCount}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold font-mono ${
                          stats.byInstitution['HIAE'].questionCount > 0
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'text-outline-variant'
                        }`}>
                          {stats.byInstitution['HIAE'].questionCount}
                        </span>
                      </td>

                      {/* Tendência */}
                      <td className="py-3 px-3 text-center text-[0.6875rem]">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          stats.trend === 'subindo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : stats.trend === 'caindo'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-surface-container text-secondary'
                        }`}>
                          {stats.trend === 'subindo' ? '↗️ Alta recente' : stats.trend === 'caindo' ? '↘️ Em queda' : '➡️ Estável'}
                        </span>
                      </td>

                      {/* Faixa */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold ${
                          stats.frequencyTier === 'muito_frequente'
                            ? 'bg-red-100 text-red-900 border border-red-300'
                            : stats.frequencyTier === 'frequente'
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : stats.frequencyTier === 'moderada'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : stats.frequencyTier === 'pouco_frequente'
                            ? 'bg-stone-100 text-stone-800 border border-stone-200'
                            : 'bg-surface-container text-secondary'
                        }`}>
                          {stats.tierLabel}
                        </span>
                      </td>

                      {/* Score de Incidência */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-mono font-extrabold text-sm text-primary">
                            {stats.calculatedPriorityScore}
                          </span>
                          <span className="text-[0.625rem] text-secondary">/100</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: INCIDÊNCIA VS PRIORIDADE DE ESTUDO (CÉREBRO 2) */}
      {/* ========================================================================= */}
      {activeTab === 'prioridade_comparativa' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">balance</span>
              <span>Regra de Arquitetura: INCIDÊNCIA &ne; PRIORIDADE FINAL</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">
              Considerando a incidência desse conteúdo, meu domínio, minha retenção, meu desempenho em provas, minhas revisões pendentes e meu prazo de 2 anos, o que devo estudar hoje?
            </h3>
            <p className="text-xs text-secondary leading-relaxed max-w-4xl">
              A incidência das provas é apenas <strong>uma das variáveis</strong> do algoritmo de prioridade pedagógica (peso de 25% na fórmula combinada). Ela alimenta o componente de relevância institucional sem inflar nem mascarar o domínio real da aluna.
            </p>
          </div>

          {/* COMPARAÇÃO DIRETA DE CASOS CLÍNICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Caso 1: DPOC (Alta Incidência + Domínio Vulnerável = PRIORIDADE ELEVADA) */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-red-300 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 uppercase">
                    Caso 1 • Alta Incidência + Lacuna
                  </span>
                  <h4 className="text-base font-bold text-on-surface mt-2">
                    DPOC (Doença Pulmonar Obstrutiva Crônica)
                  </h4>
                  <p className="text-xs text-secondary">Clínica Médica &rarr; Pneumologia</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-black text-red-600">96</div>
                  <span className="text-[0.625rem] font-bold uppercase text-red-700">Prioridade Máxima</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Incidência Bancas-Alvo:</span>
                  <strong className="text-red-700 font-mono text-sm">94/100 (Muito Alta)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">38 questões em 5 anos</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Domínio Atual:</span>
                  <strong className="text-amber-700 font-mono text-sm">68% (Déficit 17 p.p.)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Meta: &ge; 85%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Aplicação em Provas:</span>
                  <strong className="text-amber-700 font-mono text-sm">61% (Abaixo de 80%)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Vulnerável a distratores</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Estado FSRS:</span>
                  <strong className="text-red-700 font-mono text-sm">Revisão Pendente</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Urgência mnemônica</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 text-red-950 text-xs leading-relaxed border border-red-200">
                <strong>Diagnóstico Pedagógico do Cérebro 2:</strong> Como DPOC é intensamente cobrada nas 5 instituições-alvo e a usuária ainda não atingiu 80% em aplicação, o sistema dispara o boost estratégico. <strong>Recomendado para estudo prioritário imediato hoje.</strong>
              </div>
            </div>

            {/* Caso 2: Divertículo de Meckel (Baixa Incidência + Domínio Alto = PRIORIDADE BAIXA) */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4 opacity-95">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded bg-surface-container text-secondary uppercase">
                    Caso 2 • Baixa Incidência + Consolidado
                  </span>
                  <h4 className="text-base font-bold text-on-surface mt-2">
                    Divertículo de Meckel &amp; Anomalias Onfalomesentéricas
                  </h4>
                  <p className="text-xs text-secondary">Cirurgia Geral &rarr; Cirurgia Pediátrica</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-black text-secondary">28</div>
                  <span className="text-[0.625rem] font-bold uppercase text-secondary">Prioridade Baixa</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Incidência Bancas-Alvo:</span>
                  <strong className="text-secondary font-mono text-sm">22/100 (Raro)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Apenas 1-2 questões</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Domínio Atual:</span>
                  <strong className="text-emerald-700 font-mono text-sm">88% (Consolidado)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Meta atingida</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Aplicação em Provas:</span>
                  <strong className="text-emerald-700 font-mono text-sm">85% (Alta)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Segurança em condutas</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <span className="text-[0.625rem] text-secondary block">Estado FSRS:</span>
                  <strong className="text-emerald-700 font-mono text-sm">Estável (60 dias)</strong>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">Sem risco de esquecimento</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-secondary text-xs leading-relaxed border border-surface-container">
                <strong>Diagnóstico Pedagógico do Cérebro 2:</strong> Mesmo sendo um conteúdo presente no currículo, sua baixa incidência nas instituições-alvo e o alto domínio da usuária fazem com que ele <strong>NÃO consuma as 8 horas semanais</strong> desnecessariamente.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: BANCO DE QUESTÕES CLASSIFICADAS & CORREÇÃO MANUAL */}
      {/* ========================================================================= */}
      {activeTab === 'questoes' && (
        <div className="space-y-4">
          {/* BARRA DE FILTROS */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filtro de Ano */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-secondary text-[0.6875rem]">Ano:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="h-8 px-2.5 rounded-lg border border-surface-container bg-surface-container-lowest text-xs font-semibold"
                >
                  <option value="ALL">Todos (2021-2025)</option>
                  {PAST_5_YEARS.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Filtro de Status de Classificação */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-secondary text-[0.6875rem]">Status IA:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="h-8 px-2.5 rounded-lg border border-surface-container bg-surface-container-lowest text-xs font-semibold"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="duvida_revisao">🟡 Dúvida / Revisão Manual ({doubtsCount})</option>
                  <option value="ia_confiavel">🟢 Confiável pela IA</option>
                  <option value="corrigido_manual">🔵 Validado pelo Usuário</option>
                </select>
              </div>
            </div>

            {/* Campo de Busca */}
            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined text-secondary text-base absolute left-2.5 top-2">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por tema, enunciado, módulo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-surface-container bg-surface-container-lowest text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* LISTA DE QUESTÕES */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-surface-container-lowest border border-surface-container text-secondary text-xs">
                Nenhuma questão encontrada com os filtros selecionados.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isDoubt = q.classificationStatus === 'duvida_revisao';
                const isManual = q.classificationStatus === 'corrigido_manual';
                const instConfig = TARGET_INSTITUTIONS_CONFIG[q.institution as TargetInstitutionKey];

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDoubt
                        ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200'
                        : isManual
                        ? 'bg-blue-50/40 border-blue-200'
                        : 'bg-surface-container-lowest border-surface-container hover:border-outline'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-container">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[0.6875rem] font-bold border ${instConfig?.badgeColor || 'bg-surface-container'}`}>
                          {q.institution} {q.year}
                        </span>
                        <span className="font-mono text-xs font-bold text-on-surface">
                          Questão #{q.questionNumber}
                        </span>

                        {/* Badges de Status */}
                        {isDoubt && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[0.625rem] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[0.75rem]">help</span>
                            <span>Dúvida da IA • Requer Revisão Manual</span>
                          </span>
                        )}
                        {!isDoubt && !isManual && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[0.625rem] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[0.75rem]">check_circle</span>
                            <span>Classificado por IA ({q.confidenceScore || 95}%)</span>
                          </span>
                        )}
                        {isManual && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-[0.625rem] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[0.75rem]">verified_user</span>
                            <span>Validado Manualmente</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className="px-2.5 py-1 rounded-lg border border-surface-container bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-primary flex items-center gap-1 transition-all cursor-pointer self-start sm:self-auto"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Corrigir Classificação</span>
                      </button>
                    </div>

                    {/* Enunciado */}
                    <p className="text-xs text-on-surface leading-relaxed mt-2.5">
                      {q.statementSnippet}
                    </p>

                    {/* Explicação da Dúvida (se houver) */}
                    {isDoubt && q.doubtReason && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-950 text-xs">
                        <strong className="block font-bold mb-0.5">Motivo de Sinalização:</strong>
                        <p className="text-[0.6875rem] leading-relaxed">{q.doubtReason}</p>
                      </div>
                    )}

                    {/* Classificação Curricular Mapeada */}
                    <div className="mt-3 pt-2.5 border-t border-surface-container flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[0.6875rem] font-bold text-secondary uppercase">Mapeamento:</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[0.6875rem]">
                          {q.areaName}
                        </span>
                        <span className="text-secondary">&rarr;</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[0.6875rem]">
                          {q.moduloName}
                        </span>
                        <span className="text-secondary">&rarr;</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[0.6875rem]">
                          {q.contentName}
                        </span>
                      </div>

                      {q.mappedOslerBlocks && q.mappedOslerBlocks.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[0.625rem] text-secondary">
                          <span className="material-symbols-outlined text-[0.75rem] text-primary">style</span>
                          <span>Osler: {q.mappedOslerBlocks.map((b) => b.title).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: PROVAS OFICIAIS DOS ÚLTIMOS 5 ANOS (25 PROVAS) */}
      {/* ========================================================================= */}
      {activeTab === 'provas_5anos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Catálogo de Provas dos Últimos 5 Anos (2021 a 2025)
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                5 instituições-alvo &times; 5 anos = 25 cadernos oficiais lidos, processados e integrados à matriz de incidência.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-primary/10 text-primary">
              25 Provas Cadastradas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INITIAL_OFFICIAL_EXAMS_META.map((meta) => {
              const instConfig = TARGET_INSTITUTIONS_CONFIG[meta.institution];

              return (
                <div
                  key={meta.id}
                  className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container hover:border-outline transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[0.6875rem] font-bold border ${instConfig.badgeColor}`}>
                      {meta.institution}
                    </span>
                    <span className="text-xs font-mono font-bold text-on-surface">{meta.year}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-on-surface line-clamp-1">{meta.title}</h4>
                    <p className="text-[0.6875rem] text-secondary mt-0.5">
                      {meta.totalQuestions} questões no caderno oficial
                    </p>
                  </div>

                  <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[0.6875rem]">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Processada por IA</span>
                    </span>
                    <span className="text-secondary font-mono">{meta.analyzedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AJUSTAR / CORRIGIR CLASSIFICAÇÃO MANUALMENTE */}
      {/* ========================================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-surface-container shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">tune</span>
                <h3 className="font-bold text-sm text-on-surface">
                  Corrigir Classificação da Questão #{editingQuestion.questionNumber}
                </h3>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-secondary leading-relaxed border border-surface-container">
              <strong className="block text-on-surface font-semibold mb-1">Enunciado:</strong>
              <p className="line-clamp-3 text-[0.6875rem]">{editingQuestion.statementSnippet}</p>
            </div>

            <form onSubmit={handleSaveManualCorrection} className="space-y-3 text-xs">
              {/* Grande Área */}
              <div>
                <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                  1. Grande Área:
                </label>
                <select
                  value={manualArea}
                  onChange={(e) => {
                    const newArea = e.target.value;
                    setManualArea(newArea);
                    // Reset do módulo
                    const firstMod = allContents.find((c) => c.areaName === newArea)?.moduloName || '';
                    setManualModule(firstMod);
                    const firstContent = allContents.find((c) => c.areaName === newArea && c.moduloName === firstMod)?.id || '';
                    setManualContentId(firstContent);
                  }}
                  className="w-full h-9 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-xs"
                >
                  {availableAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Módulo */}
              <div>
                <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                  2. Módulo:
                </label>
                <select
                  value={manualModule}
                  onChange={(e) => {
                    const newMod = e.target.value;
                    setManualModule(newMod);
                    const firstContent = allContents.find(
                      (c) => c.areaName === manualArea && c.moduloName === newMod
                    )?.id || '';
                    setManualContentId(firstContent);
                  }}
                  className="w-full h-9 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-xs"
                >
                  {availableModulesForArea.map((mod) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                  3. Conteúdo Curricular (Medway + Osler):
                </label>
                <select
                  value={manualContentId}
                  onChange={(e) => setManualContentId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-xs"
                >
                  {availableContentsForModule.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Nota de Justificativa */}
              <div>
                <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                  Nota / Justificativa da Correção (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Foco da questão é o diagnóstico diferencial com asma"
                  value={manualCorrectionNote}
                  onChange={(e) => setManualCorrectionNote(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-secondary hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  Salvar e Recalcular Incidência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUBMETER / PROCESSAR NOVA PROVA COM IA */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-surface-container shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
                <h3 className="font-bold text-base text-on-surface">
                  Análise Automática de Prova com IA
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {isProcessingAI ? (
              <div className="py-8 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">
                    {processingStep === 1 && 'Etapa 1/4: Extraindo texto e enunciados...'}
                    {processingStep === 2 && 'Etapa 2/4: Relacionando ao currículo Área → Módulo → Conteúdo...'}
                    {processingStep === 3 && 'Etapa 3/4: Cruzando com mapeamento de blocos Osler...'}
                    {processingStep === 4 && 'Etapa 4/4: Validando incerteza e recalculando matriz de incidência...'}
                  </h4>
                  <p className="text-xs text-secondary mt-1">
                    Garantindo que questões com dúvida sejam sinalizadas para validação manual.
                  </p>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${processingStep * 25}%` }}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleProcessExamWithAI} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                      Instituição-Alvo:
                    </label>
                    <select
                      value={uploadInstitution}
                      onChange={(e) => setUploadInstitution(e.target.value as TargetInstitutionKey)}
                      className="w-full h-9 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-xs"
                    >
                      {TARGET_INSTITUTIONS_LIST.map((key) => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                      Ano da Prova (Últimos 5 Anos):
                    </label>
                    <select
                      value={uploadYear}
                      onChange={(e) => setUploadYear(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-xs font-mono"
                    >
                      {PAST_5_YEARS.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.6875rem] font-bold text-secondary uppercase mb-1">
                    Texto ou Enunciados da Prova (Cole ou deixe em branco para simular extração via OCR):
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Cole aqui os enunciados das questões para classificação automática imediata..."
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-surface-container bg-surface-container-low text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-[0.6875rem] text-secondary leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-on-surface mb-0.5">
                    <span className="material-symbols-outlined text-sm text-primary">verified</span>
                    <span>Classificação com Critérios Rigorosos</span>
                  </div>
                  Cada questão é associada ao currículo existente (Área &rarr; Módulo &rarr; Conteúdo). Se a IA detectar ambiguidade diagnóstica, ela <strong>não forçará a classificação</strong> e marcará para sua revisão manual.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-secondary hover:bg-surface-container cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">psychology</span>
                    <span>Iniciar Análise com IA</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
