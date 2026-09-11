import React, { useState, useEffect } from 'react';
import { StudyActivity, SessionCompletionReport, ErrorReasonType, OslerCardDistribution } from '../types';
import { errorReasonConfig } from '../data/mockData';

interface CoordenadorSessaoModalProps {
  activity: StudyActivity;
  onClose: () => void;
  onSaveCompletion: (report: SessionCompletionReport) => void;
  onUpdateProgress: (activityId: string, currentStep: number) => void;
}

export const CoordenadorSessaoModal: React.FC<CoordenadorSessaoModalProps> = ({
  activity,
  onClose,
  onSaveCompletion,
  onUpdateProgress,
}) => {
  const targetTool =
    activity.type === 'questoes'
      ? 'Banco de Questões (ex.: Medway / Estratégia)'
      : activity.type === 'revisao'
      ? 'App de Flashcards (ex.: Osler / Anki)'
      : 'Plataforma de Aulas / Apostila (ex.: Medway)';

  const toolShort =
    activity.type === 'questoes'
      ? 'Medway / Banco'
      : activity.type === 'revisao'
      ? 'Osler / Flashcards'
      : 'Medway / Teoria';

  const [activeTab, setActiveTab] = useState<'orientacao' | 'registro'>('orientacao');

  // Focus timer
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Progress tracking in external tool
  const [currentProgress, setCurrentProgress] = useState<number>(activity.currentStep || 0);
  const totalTarget = activity.totalSteps || (activity.type === 'questoes' ? 30 : activity.type === 'revisao' ? 24 : 1);

  // Question inputs (with partial completion support)
  const [totalAvailableQuestions, setTotalAvailableQuestions] = useState<number>(totalTarget);
  const [questionsDone, setQuestionsDone] = useState<number>(Math.min(15, totalTarget));
  const [questionsHit, setQuestionsHit] = useState<number>(13);

  // Osler detailed distribution inputs
  const [oslerCards, setOslerCards] = useState<OslerCardDistribution>({
    facil: 35,
    normal: 20,
    dificil: 8,
    errei: 7,
    total: 70,
  });

  const [durationMinutes, setDurationMinutes] = useState<number>(
    activity.type === 'questoes' ? 40 : activity.type === 'revisao' ? 30 : 20
  );
  
  // Structured error logging
  const [hasError, setHasError] = useState<boolean>(true);
  const [errorReasonCategory, setErrorReasonCategory] = useState<ErrorReasonType>('entre_duas');
  const [errorNote, setErrorNote] = useState<string>('');
  const [effortLevel, setEffortLevel] = useState<'leve' | 'moderado' | 'desafiador'>('moderado');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStepChange = (delta: number) => {
    const next = Math.max(0, Math.min(totalTarget, currentProgress + delta));
    setCurrentProgress(next);
    onUpdateProgress(activity.id, next);
  };

  // Live calculations
  const calculatedAccuracy =
    questionsDone > 0 ? Number(((questionsHit / questionsDone) * 100).toFixed(1)) : 0;
  const calculatedActivityCompletion =
    totalAvailableQuestions > 0 ? Number(((questionsDone / totalAvailableQuestions) * 100).toFixed(1)) : 0;

  const totalOslerCount =
    oslerCards.facil + oslerCards.normal + oslerCards.dificil + oslerCards.errei;
  const calculatedRetention =
    totalOslerCount > 0
      ? Math.round(((oslerCards.facil + oslerCards.normal) / totalOslerCount) * 100)
      : 85;

  const handleOslerChange = (field: keyof OslerCardDistribution, val: number) => {
    const updated = { ...oslerCards, [field]: Math.max(0, val) };
    updated.total = updated.facil + updated.normal + updated.dificil + updated.errei;
    setOslerCards(updated);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const report: SessionCompletionReport = {
      activityId: activity.id,
      topic: activity.title,
      specialty: activity.specialty,
      type: activity.type,
      toolUsed: targetTool,
      durationMinutes: durationMinutes || Math.max(5, Math.round(secondsElapsed / 60)),
      effortLevel,
      errorNote: hasError && errorNote.trim() ? errorNote.trim() : undefined,
      errorReasonCategory: hasError ? errorReasonCategory : undefined,
      ...(activity.type === 'questoes'
        ? {
            questionsTotal: questionsDone,
            questionsCorrect: questionsHit,
            accuracyPercent: calculatedAccuracy,
            activityCompletionPercent: calculatedActivityCompletion,
          }
        : {}),
      ...(activity.type === 'revisao'
        ? {
            cardsReviewed: totalOslerCount,
            retentionPercent: calculatedRetention,
            oslerDistribution: oslerCards,
          }
        : {}),
    };

    onSaveCompletion(report);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-container overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-surface-container bg-surface-container-low/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-code-metric text-[0.6875rem] font-bold flex items-center gap-1 border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Camada de Coordenação &amp; Inteligência
                </span>
                <span className="text-secondary text-xs">•</span>
                <span className="text-xs font-semibold text-secondary">
                  Execute no seu recurso: {toolShort}
                </span>
              </div>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface mt-1">
                {activity.title}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                O SynapseMed dita as diretrizes pedagógicas e registra o desempenho para retroalimentar seu domínio e o FSRS.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('orientacao')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'orientacao'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>1. Diretrizes &amp; Timer de Foco</span>
            </button>
            <button
              onClick={() => setActiveTab('registro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'registro'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              <span>2. Registrar Desempenho</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {activeTab === 'orientacao' ? (
            <>
              {/* Pedagogical Why */}
              {activity.whyThisMatters && (
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-primary font-bold">
                    <span className="material-symbols-outlined text-base">psychology</span>
                    <span>Por que estou fazendo isso hoje?</span>
                  </div>
                  <p className="text-secondary leading-relaxed">
                    {activity.whyThisMatters.justification}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[0.6875rem] text-secondary">
                    <span>Domínio atual: <strong className="text-on-surface">{activity.whyThisMatters.currentMastery}%</strong> (Meta: 85%)</span>
                    <span>•</span>
                    <span>Incidência: <strong className="text-primary">{activity.whyThisMatters.examIncidence}</strong></span>
                  </div>
                </div>
              )}

              {/* Instructions on what to configure in the external tool */}
              <div className="space-y-3">
                <h3 className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                  Como configurar no seu {toolShort}:
                </h3>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0">filter_alt</span>
                    <div>
                      <strong className="text-on-surface block font-semibold">Filtros recomendados pela inteligência:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium text-[0.6875rem]">
                          {activity.specialty}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium text-[0.6875rem]">
                          {activity.subspecialty}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold text-[0.6875rem]">
                          Bancas: USP, UNIFESP, ENARE
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0">speed</span>
                    <div>
                      <strong className="text-on-surface block font-semibold">Volume &amp; Ritmo sugerido:</strong>
                      <p className="text-secondary mt-0.5">
                        Meta de {totalTarget} itens em aproximadamente {activity.estimatedTime}. Se fizer parcialmente (ex: 15 de 30 questões), o sistema computará a acurácia e guardará o saldo pendente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Focus Timer */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div>
                  <span className="text-secondary text-[0.6875rem] font-semibold uppercase block">
                    Cronômetro de Foco na Ferramenta
                  </span>
                  <div className="font-code-metric text-2xl font-bold text-on-surface mt-0.5">
                    {formatTimer(secondsElapsed)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container text-xs font-semibold hover:bg-surface-container text-on-surface transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isTimerRunning ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{isTimerRunning ? 'Pausar' : 'Retomar'}</span>
                  </button>

                  <button
                    onClick={() => setSecondsElapsed(0)}
                    className="p-1.5 rounded-lg text-secondary hover:bg-surface-container transition-all"
                    title="Reiniciar timer"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Step counter */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between">
                <div>
                  <span className="text-secondary text-[0.6875rem] font-semibold uppercase block">
                    Contador Rápido na Sessão Externa
                  </span>
                  <div className="font-code-metric text-sm font-bold text-on-surface mt-0.5">
                    {currentProgress} de {totalTarget} concluídos
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStepChange(-1)}
                    className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center font-bold text-base transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleStepChange(1)}
                    className="w-8 h-8 rounded-lg bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center font-bold text-base transition-colors shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('registro')}
                  className="h-10 px-5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Concluir no {toolShort} &amp; Registrar</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </>
          ) : (
            /* Tab: Registro de Desempenho (Retroalimentação) */
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-secondary leading-relaxed">
                <strong className="text-on-surface font-semibold block mb-0.5">
                  Alimentação da Inteligência do SynapseMed
                </strong>
                Insira abaixo o resultado real obtido no seu <strong>{targetTool}</strong>. O sistema diferencia <span className="text-on-surface font-bold">Domínio observado (acurácia)</span> de <span className="text-on-surface font-bold">Conclusão da atividade</span>.
              </div>

              {/* EXERCÍCIOS (PRÉ OU PÓS) COM SUPORTE A REALIZAÇÃO PARCIAL */}
              {activity.type === 'questoes' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-secondary font-semibold mb-1">
                        Total Disponível no Lote
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={totalAvailableQuestions}
                        onChange={(e) => setTotalAvailableQuestions(parseInt(e.target.value) || 1)}
                        className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-code-metric font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-[0.625rem] text-secondary">Ex: 30 questões pós-aula</span>
                    </div>

                    <div>
                      <label className="block text-secondary font-semibold mb-1">
                        Realizadas Hoje (Parcial)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalAvailableQuestions}
                        value={questionsDone}
                        onChange={(e) => setQuestionsDone(parseInt(e.target.value) || 1)}
                        className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-code-metric font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-[0.625rem] text-secondary">Ex: 15 resolvidas</span>
                    </div>

                    <div>
                      <label className="block text-secondary font-semibold mb-1">
                        Acertos Obtidos
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={questionsDone}
                        value={questionsHit}
                        onChange={(e) => setQuestionsHit(parseInt(e.target.value) || 0)}
                        className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-code-metric font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-[0.625rem] text-secondary">Ex: 13 corretas</span>
                    </div>
                  </div>

                  {/* Dual metric showcase */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low/70 border border-surface-container">
                    <div className="space-y-0.5">
                      <span className="text-secondary text-[0.6875rem] uppercase font-semibold">1. Domínio Observado (Acurácia)</span>
                      <div className="font-code-metric text-lg font-bold text-emerald-800">
                        {calculatedAccuracy}% ({questionsHit} de {questionsDone} certas)
                      </div>
                      <span className="text-[0.625rem] text-emerald-700">Alimenta o domínio estimado do tema</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-secondary text-[0.6875rem] uppercase font-semibold">2. Conclusão da Atividade</span>
                      <div className="font-code-metric text-lg font-bold text-primary">
                        {calculatedActivityCompletion}% ({questionsDone} de {totalAvailableQuestions} feitas)
                      </div>
                      <span className="text-[0.625rem] text-secondary">
                        {totalAvailableQuestions - questionsDone > 0
                          ? `${totalAvailableQuestions - questionsDone} questões restantes ficam pendentes no saldo.`
                          : 'Lote 100% concluído!'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* OSLER FLASHCARDS CATEGORIZADOS (FÁCIL, NORMAL, DIFÍCIL, ERREI) */}
              {activity.type === 'revisao' && (
                <div className="space-y-3">
                  <label className="block text-secondary font-semibold">
                    Distribuição dos Flashcards no Osler:
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[0.6875rem] font-bold text-emerald-800 block">Fácil</span>
                      <input
                        type="number"
                        min="0"
                        value={oslerCards.facil}
                        onChange={(e) => handleOslerChange('facil', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 bg-white rounded-lg border border-emerald-300 font-code-metric font-bold text-xs mt-1"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-[0.6875rem] font-bold text-blue-800 block">Normal / Bom</span>
                      <input
                        type="number"
                        min="0"
                        value={oslerCards.normal}
                        onChange={(e) => handleOslerChange('normal', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 bg-white rounded-lg border border-blue-300 font-code-metric font-bold text-xs mt-1"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[0.6875rem] font-bold text-amber-800 block">Difícil</span>
                      <input
                        type="number"
                        min="0"
                        value={oslerCards.dificil}
                        onChange={(e) => handleOslerChange('dificil', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 bg-white rounded-lg border border-amber-300 font-code-metric font-bold text-xs mt-1"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-[0.6875rem] font-bold text-rose-800 block">Errei</span>
                      <input
                        type="number"
                        min="0"
                        value={oslerCards.errei}
                        onChange={(e) => handleOslerChange('errei', parseInt(e.target.value) || 0)}
                        className="w-full h-8 px-2 bg-white rounded-lg border border-rose-300 font-code-metric font-bold text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-purple-900 font-medium block">Total de Cards Revisados: {totalOslerCount}</span>
                      <span className="text-[0.6875rem] text-purple-700">Taxa de retenção para o algoritmo FSRS:</span>
                    </div>
                    <span className="font-code-metric text-lg font-bold text-purple-900">
                      {calculatedRetention}%
                    </span>
                  </div>
                </div>
              )}

              {/* Tempo investido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-secondary font-semibold mb-1">
                    Tempo Real Investido (minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-code-metric font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[0.625rem] text-secondary">
                    Deduzido da sua disponibilidade semanal de 8h
                  </span>
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-1">
                    Esforço Cognitivo Sentido
                  </label>
                  <select
                    value={effortLevel}
                    onChange={(e) => setEffortLevel(e.target.value as any)}
                    className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="leve">Leve (Fluidez alta)</option>
                    <option value="moderado">Moderado (No ritmo ideal)</option>
                    <option value="desafiador">Desafiador (Exigiu retorno à teoria)</option>
                  </select>
                </div>
              </div>

              {/* MOTIVO DO ERRO ESTRUTURADO (CADERNO DE ERROS) */}
              <div className="pt-2 space-y-2 border-t border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="has-error"
                      checked={hasError}
                      onChange={(e) => setHasError(e.target.checked)}
                      className="rounded text-primary focus:ring-primary/30"
                    />
                    <label htmlFor="has-error" className="font-bold text-on-surface cursor-pointer">
                      Houve erro ou dúvida importante nesta sessão?
                    </label>
                  </div>
                  {hasError && (
                    <span className="text-[0.6875rem] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Caderno de Erros Inteligente
                    </span>
                  )}
                </div>

                {hasError && (
                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-3">
                    <div>
                      <label className="block text-secondary font-semibold mb-1">
                        Qual foi a causa principal do erro?
                      </label>
                      <select
                        value={errorReasonCategory}
                        onChange={(e) => setErrorReasonCategory(e.target.value as ErrorReasonType)}
                        className="w-full h-9 px-3 bg-surface-container-lowest rounded-xl border border-surface-container text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {Object.entries(errorReasonConfig).map(([key, cfg]) => (
                          <option key={key} value={key}>
                            {cfg.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic clinical guidance from algorithm */}
                    <div className={`p-2.5 rounded-lg border text-[0.6875rem] flex items-start gap-2 ${errorReasonConfig[errorReasonCategory].color}`}>
                      <span className="material-symbols-outlined text-base shrink-0">
                        {errorReasonConfig[errorReasonCategory].icon}
                      </span>
                      <div>
                        <strong className="block font-bold">Conduta Pedagógica Recomendada pelo Algoritmo:</strong>
                        <p className="mt-0.5 leading-relaxed">{errorReasonConfig[errorReasonCategory].clinicalStrategy}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-secondary font-semibold mb-1">
                        Anotação / Resumo do Caso Clínico (Opcional):
                      </label>
                      <textarea
                        rows={2}
                        value={errorNote}
                        onChange={(e) => setErrorNote(e.target.value)}
                        placeholder="Ex.: Confundi o ponto de corte de Stevenson B vs C em choque cardiogênico..."
                        className="w-full p-2.5 bg-surface-container-lowest rounded-xl border border-surface-container text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('orientacao')}
                  className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container transition-colors text-xs font-semibold"
                >
                  Voltar às Diretrizes
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">cloud_done</span>
                  <span>Salvar Desempenho &amp; Atualizar Algoritmo</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
