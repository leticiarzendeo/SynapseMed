import React, { useState, useEffect } from 'react';
import { UserPreferences, ErrorReasonType, ContentItem, AreaItem } from '../types';
import { getContentState } from '../utils/contentState';
import { buildTodayPlan, rankContentsByPriority, ContentPriority, ActivityKind } from '../utils/priorityEngine';
import { getAllCurriculumContents } from '../data/mockData';
import { DominioDossieModal } from './DominioDossieModal';

export interface UserOverrideRecord {
  id: string;
  timestamp: string;
  originalActivity: ActivityItem;
  chosenActivity: ActivityItem;
  weeklyPlanImpact: string;
  timelineTwoYearImpact: string;
  displacedActivities: string[];
}

interface ActivityItem {
  id: string;
  name: string;
  contentId?: string;
  subType: string;
  durationMin: number;
  specialty: string;
  modulo: string;
  priority: 'alta' | 'media' | 'baixa';
  priorityScore?: number;
  whyNow: string;
  whyDetails: {
    incidence: string;
    examScore: string;
    domainScore: string;
    targetScore: string;
    fsrsStatus: string;
    postExercisesCompleted: string;
  };
  recommendedDay: string;
  currentDay: string;
  isMoved?: boolean;
}

interface HojeViewProps {
  preferences: UserPreferences;
  onNavigateToPlanejamento?: () => void;
  onNavigateToCurriculo?: () => void;
  /**
   * "A ponte": avisa o App (fonte da verdade) que o conteúdo de um contentId
   * foi concluído, para propagar ao currículo/domínio/priorização sem migrar
   * o modelo interno ActivityItem.
   */
  onContentStudied?: (contentId?: string) => void;
  /** Currículo sobreposto (progresso real) para o resumo de progresso. */
  curriculum?: AreaItem[];
}

export const HojeView: React.FC<HojeViewProps> = ({
  preferences,
  onNavigateToPlanejamento,
  onNavigateToCurriculo,
  onContentStudied,
  curriculum,
}) => {
  // Cota de disponibilidade diária (padrão 100 min / 1h40)
  const [availableTodayMin, setAvailableTodayMin] = useState<number>(100);

  // Converte a recomendação do motor de prioridade (ContentPriority) para o
  // formato de card usado pela tela (ActivityItem).
  const ACTIVITY_LABEL: Record<ActivityKind, string> = {
    avanco: 'Teoria Medway',
    exercicios: 'Exercícios Medway',
    questoes: 'Questões de provas reais',
    revisao: 'Revisão / Osler',
  };

  const planToActivities = (plan: ContentPriority[]): ActivityItem[] =>
    plan.map((p) => ({
      id: `act-${p.contentId}-${p.recommendedActivity}`,
      contentId: p.contentId,
      name: p.contentName,
      subType: ACTIVITY_LABEL[p.recommendedActivity],
      durationMin: p.estimatedMinutes,
      specialty: p.moduleName,
      modulo: p.moduleName,
      priority: p.priorityScore >= 50 ? 'alta' : p.priorityScore >= 25 ? 'media' : 'baixa',
      priorityScore: p.priorityScore,
      whyNow: p.reason,
      whyDetails: {
        incidence:
          p.incidence >= 1
            ? 'Alta incidência nas instituições-alvo'
            : 'Incidência de base (não prioritário Medway)',
        examScore: `Aplicação estimada: ${p.application}%`,
        domainScore: `Domínio estimado: ${p.domain}% (conhecimento ${p.knowledge}%, retenção ${p.retention}%)`,
        targetScore: 'Meta de consolidação: ≥ 85%',
        fsrsStatus:
          p.state === 'dominado'
            ? 'Conteúdo consolidado — manutenção'
            : p.state === 'em_andamento'
            ? 'Em consolidação'
            : 'Não iniciado',
        postExercisesCompleted: `Confiança da estimativa: ${p.confidence}%`,
      },
      recommendedDay: 'hoje',
      currentDay: 'hoje',
    }));

  // Plano de hoje gerado pelo motor real, a partir do currículo + tempo.
  const recommendedPlan = React.useMemo(
    () => planToActivities(buildTodayPlan(curriculum ?? [], availableTodayMin)),
    [curriculum, availableTodayMin]
  );

  // Activities for Today (derivadas do plano real; recomputam se o tempo muda).
  const [activities, setActivities] = useState<ActivityItem[]>(recommendedPlan);
  useEffect(() => {
    setActivities(recommendedPlan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedPlan]);

  // Registro de Autonomia: histórico de alterações manuais da recomendação
  const [userOverrides, setUserOverrides] = useState<UserOverrideRecord[]>([]);

  // Modal de Dossiê Completo do Domínio (Cérebro 1 & Cérebro 2)
  const [selectedContentForDossier, setSelectedContentForDossier] = useState<ContentItem | null>(null);

  // Alternativas para "Trocar atividade": próximas prioridades do motor que
  // NÃO entraram no plano de hoje (dados reais, não lista fixa).
  const alternativeActivities: ActivityItem[] = React.useMemo(() => {
    const planIds = new Set(recommendedPlan.map((a) => a.contentId));
    const rest = rankContentsByPriority(curriculum ?? [])
      .filter((c) => c.priorityScore > 0 && !planIds.has(c.contentId))
      .slice(0, 6);
    return planToActivities(rest);
  }, [curriculum, recommendedPlan]);

  // Active state modals
  const [selectedWhyActivity, setSelectedWhyActivity] = useState<ActivityItem | null>(null);
  const [showSwapModal, setShowSwapModal] = useState<ActivityItem | null>(null);
  const [activeStudySession, setActiveStudySession] = useState<ActivityItem | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState<ActivityItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer simulation for active study session
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(0); // cronômetro começa zerado
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Finish session form state
  const [finishTimeMinutes, setFinishTimeMinutes] = useState(47);
  const [finishTheoryCompleted, setFinishTheoryCompleted] = useState(true);
  const [finishExercisesDone, setFinishExercisesDone] = useState(8);
  const [finishExercisesTotal, setFinishExercisesTotal] = useState(10);
  const [finishCorrectAnswers, setFinishCorrectAnswers] = useState(7);
  const [finishDifficulty, setFinishDifficulty] = useState<'facil' | 'normal' | 'dificil'>('dificil');
  const [selectedErrorReasons, setSelectedErrorReasons] = useState<ErrorReasonType[]>(['esqueci']);
  const [finishNotes, setFinishNotes] = useState('');

  // Estados para ferramentas de setinha (recolhidos por padrão para evitar poluição visual)
  const [expandedWhyNow, setExpandedWhyNow] = useState<Record<string, boolean>>({});
  const [expandedDecisions, setExpandedDecisions] = useState<Record<string, boolean>>({});
  const [theoryVideoWatched, setTheoryVideoWatched] = useState(true);
  const [theoryApostilaRead, setTheoryApostilaRead] = useState(false);

  const toggleWhyNow = (id: string) => {
    setExpandedWhyNow((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDecision = (key: string) => {
    setExpandedDecisions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Daily & Weekly totals
  const totalPlannedMinutes = activities.reduce((acc, a) => acc + a.durationMin, 0); // 90 min (1h30)
  const [completedMinutes, setCompletedMinutes] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synapsemed_weekly_completed_minutes');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synapsemed_weekly_completed_minutes', completedMinutes.toString());
    }
  }, [completedMinutes]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStudySession && isTimerRunning) {
      interval = setInterval(() => {
        setSessionTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeStudySession, isTimerRunning]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartSession = (activity: ActivityItem) => {
    setActiveStudySession(activity);
    const isTheory = activity.subType.toLowerCase().includes('teoria');
    setSessionTimerSeconds(0); // Cronômetro inicia do zero para registro real
    setIsTimerRunning(true);
    setFinishExercisesDone(0);
    setFinishExercisesTotal(isTheory ? 10 : 20);
    setFinishCorrectAnswers(0);
    setFinishTimeMinutes(activity.durationMin);
    setFinishTheoryCompleted(false);
    setSelectedErrorReasons([]);
    setFinishNotes('');
  };

  const handleCompleteDirect = (activity: ActivityItem) => {
    setCompletedMinutes((prev) => prev + activity.durationMin);
    setActivities((prev) => prev.filter((a) => a.id !== activity.id));
    onContentStudied?.(activity.contentId);
    showToast(
      `✓ Atividade "${activity.name}" concluída! Progresso registrado.`
    );
  };

  const handleOpenFinishModal = () => {
    setShowFinishModal(true);
  };

  const toggleErrorReason = (reason: ErrorReasonType) => {
    setSelectedErrorReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleSaveSession = () => {
    if (!activeStudySession) return;
    setCompletedMinutes((prev) => prev + finishTimeMinutes);
    setActivities((prev) => prev.filter((a) => a.id !== activeStudySession.id));
    onContentStudied?.(activeStudySession.contentId);
    setShowFinishModal(false);
    setActiveStudySession(null);
    showToast(
      `Sessão de ${activeStudySession.name} concluída! Progresso registrado.`
    );
  };

  const handleSwapActivity = (oldActivityId: string, newActivity: ActivityItem) => {
    const original = activities.find((a) => a.id === oldActivityId);
    if (!original) return;

    // Constrói o registro de autonomia com os 3 impactos calculados
    const overrideRecord: UserOverrideRecord = {
      id: `override-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      originalActivity: original,
      chosenActivity: newActivity,
      weeklyPlanImpact: `A atividade de ${original.name} (${original.durationMin} min) sob as bancas USP/UNIFESP foi postergada para quarta-feira, mantendo a cota de ${preferences.weeklyHoursTarget}h da semana perfeitamente equilibrada.`,
      timelineTwoYearImpact: `Ritmo de 2 anos preservado (7h35 necessárias vs ${preferences.weeklyHoursTarget}h00 disponíveis). Deslocamento de 1 bloco de consolidação sem risco de atraso no cronograma.`,
      displacedActivities: [
        `${original.name} (${original.durationMin} min) postergado para quarta-feira`,
        `${newActivity.name} (${newActivity.durationMin} min) alocado no bloco de hoje`,
      ],
    };

    setUserOverrides((prev) => [overrideRecord, ...prev]);

    setActivities((prev) =>
      prev.map((a) =>
        a.id === oldActivityId
          ? {
              ...newActivity,
              currentDay: 'segunda',
              isMoved: true,
            }
          : a
      )
    );

    setShowSwapModal(null);
    showToast(`⚠️ Usuária alterou a recomendação: ${original.name} substituído por ${newActivity.name}. Impacto recalculado!`);
  };

  const handleRestoreRecommendation = () => {
    setActivities(recommendedPlan);
    setUserOverrides([]);
    showToast('Recomendação do algoritmo restaurada com sucesso!');
  };

  const handleOpenDossier = (contentId?: string, fallbackName?: string) => {
    const all = getAllCurriculumContents();
    let found = all.find((c) => c.id === contentId);
    if (!found && fallbackName) {
      found = all.find(
        (c) =>
          c.name.toLowerCase().includes(fallbackName.toLowerCase()) ||
          c.id.toLowerCase().includes(fallbackName.toLowerCase())
      );
    }
    if (found) {
      setSelectedContentForDossier(found);
    } else {
      showToast(`Dossiê de ${fallbackName || 'conteúdo'} carregado.`);
    }
  };

  const handleSelectAvailableTime = (min: number) => {
    setAvailableTodayMin(min);
    // O plano recomputa automaticamente (useMemo/useEffect) a partir do novo
    // tempo disponível e do currículo real — sem listas fixas.
    showToast(
      `Disponibilidade ajustada para ${
        min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? `${min % 60}min` : ''}` : `${min} min`
      }. Plano diário recalculado!`
    );
  };

  const moveActivity = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= activities.length) return;
    const newArr = [...activities];
    const temp = newArr[index];
    newArr[index] = newArr[newIdx];
    newArr[newIdx] = temp;
    setActivities(newArr);
    showToast('Ordem manual alterada. O algoritmo preservou a inteligência de prioridade das atividades.');
  };

  const handleHandleUnfinished = (action: 'reprogramar' | 'adiar' | 'remover') => {
    if (!showUnfinishedModal) return;
    const item = showUnfinishedModal;
    setActivities((prev) => prev.filter((a) => a.id !== item.id));
    setShowUnfinishedModal(null);

    if (action === 'reprogramar') {
      showToast(`🟢 ${item.name} reprogramado para amanhã às 08h. Ritmo semanal preservado.`);
    } else if (action === 'adiar') {
      showToast(`🟡 ${item.name} adiado para semana que vem. Ritmo necessário ajustado de 7h35 para 7h45/semana.`);
    } else {
      showToast(`⚠️ ${item.name} removido do ciclo imediato. A prioridade deste conteúdo será reavaliada.`);
    }
  };

  const formatSecToMin = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 max-w-md">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1.1 CABEÇALHO COM SELETOR DE DISPONIBILIDADE */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Bom dia, {preferences.name.split(' ')[0] || 'Letícia'}.
            </h1>
            <p className="text-xs text-secondary mt-0.5 font-medium">
              Hoje é segunda-feira, 7 de setembro • Cérebro de Priorização Ativo
            </p>
          </div>

          <div className="px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xl">⏱️</span>
            <div>
              <span className="text-[0.6875rem] text-secondary uppercase font-bold tracking-wider block">
                Disponibilidade Selecionada
              </span>
              <span className="font-code-metric text-sm font-extrabold text-primary">
                {availableTodayMin >= 60
                  ? `${Math.floor(availableTodayMin / 60)}h${
                      availableTodayMin % 60 ? `${availableTodayMin % 60}min` : ''
                    }`
                  : `${availableTodayMin} min`}{' '}
                disponíveis
              </span>
            </div>
          </div>
        </div>

        {/* Seletor rápido de tempo disponível hoje */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-surface-container">
          <span className="text-xs font-semibold text-secondary mr-1">Ajustar tempo de hoje:</span>
          {[
            { label: '45 min', val: 45 },
            { label: '60 min (1h)', val: 60 },
            { label: '80 min (1h20) ★ Caso Base', val: 80 },
            { label: '90 min (1h30)', val: 90 },
            { label: '120 min (2h)', val: 120 },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => handleSelectAvailableTime(btn.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                availableTodayMin === btn.val
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. INDICADOR DA SEMANA & RITMO NECESSÁRIO */}
      {(() => {
        const weeklyTargetHours = preferences.weeklyHoursTarget || 8.0;
        const weeklyTargetMin = Math.round(weeklyTargetHours * 60);
        const completedHours = Math.floor(completedMinutes / 60);
        const completedRemMin = completedMinutes % 60;
        const completedHoursStr = `${completedHours}h${completedRemMin > 0 ? completedRemMin.toString().padStart(2, '0') : '00'}`;
        const remainingMin = Math.max(0, weeklyTargetMin - completedMinutes);
        const remainingHours = Math.floor(remainingMin / 60);
        const remainingRemMin = remainingMin % 60;
        const remainingStr = `${remainingHours}h${remainingRemMin > 0 ? remainingRemMin.toString().padStart(2, '0') : '00'}`;
        const weeklyProgressPercent = Math.min(100, Math.round((completedMinutes / weeklyTargetMin) * 100));

        return (
          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface uppercase tracking-wider">Esta semana</span>
              <span className="font-code-metric text-sm font-extrabold text-on-surface">
                {completedHoursStr} <span className="text-secondary font-normal">/ {weeklyTargetHours}h00</span>
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden p-0.5 border border-surface-container-high/40">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgressPercent}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-surface-container pt-3">
              <span className="text-secondary">
                {completedMinutes === 0 ? (
                  <>Você está no <strong className="text-on-surface font-semibold">início da semana de estudos</strong> (restam {remainingStr} para a meta).</>
                ) : remainingMin === 0 ? (
                  <strong className="text-emerald-700 font-semibold">🎉 Meta de {weeklyTargetHours}h da semana atingida!</strong>
                ) : (
                  <>Restam <strong className="text-on-surface font-semibold">{remainingStr}</strong> nesta semana.</>
                )}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-secondary">Ritmo necessário:</span>
                <span className="font-code-metric font-bold text-on-surface">7h35/semana</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[0.6875rem]">
                  <span>🟢</span>
                  <span>Você está no ritmo</span>
                </span>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 2.1 BANNER DE AUTONOMIA: USUÁRIA ALTEROU A RECOMENDAÇÃO */}
      {userOverrides.length > 0 && (
        <section className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                  Usuária alterou a recomendação do algoritmo
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Decisão registrada às {userOverrides[0].timestamp}: {userOverrides[0].originalActivity.name} substituído por {userOverrides[0].chosenActivity.name}. O sistema acolheu sua escolha e recalculou automaticamente os impactos:
                </p>
              </div>
            </div>

            <button
              onClick={handleRestoreRecommendation}
              className="px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold transition-all shrink-0 self-start sm:self-auto flex items-center gap-1.5 shadow-xs"
            >
              <span>↺</span>
              <span>Restaurar recomendação do algoritmo</span>
            </button>
          </div>

          {/* 3 Cartões de Recálculo de Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white/80 rounded-xl p-3.5 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <span>📅</span>
                <span>Impacto no plano semanal</span>
              </div>
              <p className="text-[0.75rem] text-amber-900 leading-relaxed">
                {userOverrides[0].weeklyPlanImpact}
              </p>
            </div>

            <div className="bg-white/80 rounded-xl p-3.5 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <span>🎯</span>
                <span>Impacto no ritmo de 2 anos</span>
              </div>
              <p className="text-[0.75rem] text-amber-900 leading-relaxed">
                {userOverrides[0].timelineTwoYearImpact}
              </p>
            </div>

            <div className="bg-white/80 rounded-xl p-3.5 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <span>🔄</span>
                <span>Atividades deslocadas</span>
              </div>
              <ul className="text-[0.75rem] text-amber-900 space-y-0.5 list-disc list-inside">
                {userOverrides[0].displacedActivities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 3. PLANO RECOMENDADO DE HOJE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <h2 className="text-base font-extrabold text-on-surface">Plano recomendado</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[0.6875rem] text-secondary block">Total planejado</span>
            <span className="font-code-metric text-xs font-bold text-primary">
              {Math.floor(totalPlannedMinutes / 60)}h{totalPlannedMinutes % 60}min • {totalPlannedMinutes === availableTodayMin ? '100% da cota' : `${totalPlannedMinutes} min alocados`}
            </span>
          </div>
        </div>

        {/* Lista de Atividades de Hoje com Drag & Drop / Reordenação */}
        <div className="space-y-3">
          {activities.map((act, index) => (
            <div
              key={act.id}
              className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container hover:border-primary/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left: Reorder Handle + Activity info */}
              <div className="flex items-start gap-3 flex-1">
                {/* Reorder controls ☰ */}
                <div className="flex flex-col items-center gap-0.5 text-secondary shrink-0 pt-0.5">
                  <button
                    disabled={index === 0}
                    onClick={() => moveActivity(index, 'up')}
                    className="p-1 rounded hover:bg-surface-container disabled:opacity-20 text-xs"
                    title="Mover para cima"
                  >
                    ▲
                  </button>
                  <span className="material-symbols-outlined text-base cursor-grab select-none">
                    drag_indicator
                  </span>
                  <button
                    disabled={index === activities.length - 1}
                    onClick={() => moveActivity(index, 'down')}
                    className="p-1 rounded hover:bg-surface-container disabled:opacity-20 text-xs"
                    title="Mover para baixo"
                  >
                    ▼
                  </button>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-on-surface">
                      {index + 1}️⃣ {act.name} — {act.subType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-[0.6875rem] font-bold">
                      🏷️ {act.modulo}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.625rem] font-extrabold uppercase ${
                        act.priority === 'alta'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Prioridade {act.priority}
                    </span>
                  </div>

                  {/* Ferramenta de setinha para "Por que agora?" (escondida por padrão para não poluir visualmente) */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleWhyNow(act.id)}
                      className="inline-flex items-center gap-1 text-xs text-secondary hover:text-on-surface font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {expandedWhyNow[act.id] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                      <span>Por que agora?</span>
                    </button>
                    {expandedWhyNow[act.id] && (
                      <div className="mt-1 pl-3.5 text-xs text-secondary border-l-2 border-primary/30 py-0.5 animate-in fade-in leading-relaxed">
                        {act.whyNow}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Duration + Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 border-surface-container pt-3 sm:pt-0">
                <div className="text-right">
                  <span className="font-code-metric text-base font-extrabold text-on-surface block">
                    {act.durationMin} min
                  </span>
                  <button
                    onClick={() => setShowSwapModal(act)}
                    className="text-[0.6875rem] text-secondary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">sync_alt</span>
                    <span>Trocar</span>
                  </button>
                </div>

                <button
                  onClick={() => handleStartSession(act)}
                  className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>▶</span>
                  <span>Iniciar</span>
                </button>

                <button
                  onClick={() => handleCompleteDirect(act)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                  title="Marcar como concluída"
                >
                  <span>✓</span>
                  <span>Concluir</span>
                </button>

                <button
                  onClick={() => setShowUnfinishedModal(act)}
                  className="p-2 rounded-lg text-secondary hover:bg-surface-container text-xs"
                  title="Opções de adiamento/reprogramação"
                >
                  •••
                </button>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <span className="text-3xl">🎉</span>
              <h3 className="font-bold text-emerald-900 text-sm">Plano de hoje concluído com excelência!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Você estudou todos os tópicos planejados para hoje. Seus tempos foram integrados ao progresso semanal.
              </p>
            </div>
          )}
        </div>

        {/* Botão Ver outras atividades */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowSwapModal(activities[0] || alternativeActivities[0])}
            className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-xs font-bold text-on-surface transition-all inline-flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>Ver outras atividades recomendadas</span>
          </button>
        </div>
      </section>

      {/* Diagnóstico comparativo (Cérebro 2) removido: será reconstruído com dados reais do motor de prioridade. */}


      {/* 12. NO FINAL DO DIA */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">Seu dia</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-xl">event_available</span>
            </div>
            <div>
              <div className="font-code-metric text-sm font-bold text-on-surface">
                {Math.floor(totalPlannedMinutes / 60)}h{totalPlannedMinutes % 60 ? `${totalPlannedMinutes % 60}min` : '00'} planejadas • {completedMinutes > 0 ? `${completedMinutes} min realizadas` : '0 min realizadas'}
              </div>
              <div className="text-xs text-secondary mt-0.5">
                {completedMinutes >= totalPlannedMinutes && totalPlannedMinutes > 0 ? (
                  <span className="text-emerald-700 font-bold">🟢 Plano diário concluído com êxito</span>
                ) : (
                  <span>
                    Faltam {Math.max(0, totalPlannedMinutes - completedMinutes)} min para o fechamento
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPlanejamento}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface self-start sm:self-auto"
          >
            Ver grade da semana →
          </button>
        </div>
      </section>

      {/* 13. PREPARAÇÃO (MÉTRICAS DO RODAPÉ) */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <span className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
            <span>📊</span>
            <span>PREPARAÇÃO</span>
          </span>
          <button
            onClick={onNavigateToCurriculo}
            className="text-[0.6875rem] text-primary hover:underline font-bold"
          >
            Abrir Árvore Curricular →
          </button>
        </div>

        {(() => {
          const overlaidContents = (curriculum ?? []).flatMap((a) =>
            a.modules.flatMap((m) => m.contents)
          );
          const allCurriculumContents = overlaidContents.length
            ? overlaidContents
            : getAllCurriculumContents();
          const totalCurriculumCount = allCurriculumContents.length;
          // Coerente com as demais telas: estado por domínio real.
          const studiedContentsCount = allCurriculumContents.filter(
            (c) => getContentState(c) !== 'nao_iniciado'
          ).length;
          const consolidatedCount = allCurriculumContents.filter(
            (c) => getContentState(c) === 'dominado'
          ).length;
          const studiedPercentStr =
            totalCurriculumCount > 0
              ? ((studiedContentsCount / totalCurriculumCount) * 100).toFixed(1)
              : '0,0';
          const consolidatedPercentStr =
            totalCurriculumCount > 0
              ? ((consolidatedCount / totalCurriculumCount) * 100).toFixed(1)
              : '0,0';

          return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                <span className="text-[0.6875rem] text-secondary block">Conteúdos estudados</span>
                <div className="font-code-metric text-lg font-bold text-on-surface mt-0.5">
                  {studiedContentsCount} <span className="text-xs text-secondary font-normal">/ {totalCurriculumCount} ({studiedPercentStr}%)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                <span className="text-[0.6875rem] text-secondary block">Domínio ≥85% (Consolidados)</span>
                <div className="font-code-metric text-lg font-bold text-emerald-700 mt-0.5">
                  {consolidatedCount} <span className="text-xs text-secondary font-normal">/ {totalCurriculumCount} ({consolidatedPercentStr}%)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                <span className="text-[0.6875rem] text-secondary block">Revisões FSRS em dia</span>
                <div className="font-code-metric text-lg font-bold text-primary mt-0.5">
                  100% <span className="text-xs text-secondary font-normal">(Sem atrasos)</span>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* MODAL: DETALHES DA ATIVIDADE & "POR QUE ESTOU FAZENDO ISSO?" */}
      {selectedWhyActivity && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-surface-container shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold tracking-wider text-secondary">
                  Detalhes da Atividade
                </span>
                <h3 className="text-xl font-extrabold text-on-surface">
                  {selectedWhyActivity.name}
                </h3>
                <p className="text-xs text-secondary font-medium">
                  Atividade: {selectedWhyActivity.subType}
                </p>
              </div>
              <button
                onClick={() => setSelectedWhyActivity(null)}
                className="p-1 rounded-lg text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            {/* Metadados: Tempo & Prioridade */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container">
                <span className="text-[0.6875rem] text-secondary font-bold block uppercase">Tempo estimado</span>
                <span className="font-code-metric text-base font-extrabold text-on-surface">
                  {selectedWhyActivity.durationMin >= 60
                    ? `${Math.floor(selectedWhyActivity.durationMin / 60)}h${
                        selectedWhyActivity.durationMin % 60 ? `${selectedWhyActivity.durationMin % 60}min` : ''
                      }`
                    : `${selectedWhyActivity.durationMin}min`}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container">
                <span className="text-[0.6875rem] text-secondary font-bold block uppercase">Prioridade</span>
                <span className="text-sm font-extrabold text-rose-700 flex items-center gap-1">
                  <span>🔥</span>
                  <span>{selectedWhyActivity.priority === 'alta' ? 'Alta prioridade' : 'Média prioridade'}</span>
                </span>
              </div>
            </div>

            {/* Por que estou fazendo isso? */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <span className="material-symbols-outlined text-base">psychology</span>
                <span className="text-xs">Por que estou fazendo isso?</span>
              </div>
              <p className="text-on-surface font-medium leading-relaxed">
                {selectedWhyActivity.whyNow}
              </p>
            </div>

            {/* Os 3 Pilares do Domínio */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container text-xs flex items-center justify-around text-center">
              <div>
                <span className="text-[0.625rem] uppercase font-bold text-secondary block">Domínio</span>
                <span className="font-code-metric text-sm font-black text-primary">
                  {selectedWhyActivity.whyDetails.domainScore}
                </span>
              </div>
              <div className="h-6 w-px bg-surface-container" />
              <div>
                <span className="text-[0.625rem] uppercase font-bold text-secondary block">Aplicação</span>
                <span className="font-code-metric text-sm font-black text-amber-700">
                  {selectedWhyActivity.whyDetails.examScore}
                </span>
              </div>
              <div className="h-6 w-px bg-surface-container" />
              <div>
                <span className="text-[0.625rem] uppercase font-bold text-secondary block">Retenção (FSRS)</span>
                <span className="font-code-metric text-sm font-black text-emerald-700">
                  {selectedWhyActivity.whyDetails.examScore}
                </span>
              </div>
            </div>

            {/* Ações Diretas */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  const act = selectedWhyActivity;
                  setSelectedWhyActivity(null);
                  handleStartSession(act);
                }}
                className="py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>▶ Iniciar agora</span>
              </button>

              <button
                onClick={() => {
                  const act = selectedWhyActivity;
                  setSelectedWhyActivity(null);
                  handleCompleteDirect(act);
                }}
                className="py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>✓ Concluir</span>
              </button>

              <button
                onClick={() => {
                  const act = selectedWhyActivity;
                  setSelectedWhyActivity(null);
                  setShowSwapModal(act);
                }}
                className="py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-secondary transition-all"
              >
                Trocar atividade
              </button>

              <button
                onClick={() => {
                  const act = selectedWhyActivity;
                  setSelectedWhyActivity(null);
                  setShowUnfinishedModal(act);
                }}
                className="py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-secondary transition-all"
              >
                Remanejar dia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TROCAR ATIVIDADE (Recomendação ≠ Obrigação — Autonomia do Usuário) */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 border border-surface-container shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold text-secondary">
                  Autonomia do Estudante • Recomendação ≠ Obrigação
                </span>
                <h3 className="text-base font-bold text-on-surface">
                  Substituir atividade: {showSwapModal.name} ({showSwapModal.durationMin} min)
                </h3>
              </div>
              <button
                onClick={() => setShowSwapModal(null)}
                className="p-1 rounded-lg text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block text-amber-950">
                🛡️ O sistema nunca bloqueia sua escolha
              </span>
              <p className="text-[0.75rem] text-amber-900/90 leading-relaxed">
                Você tem autonomia total para escolher qualquer outro conteúdo. O aplicativo registrará com transparência: <em>&quot;Usuária alterou a recomendação&quot;</em> e recalculará automaticamente o plano semanal, o ritmo de 2 anos e as atividades deslocadas.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              <span className="text-xs font-bold text-secondary block">
                Selecione uma alternativa viável para o bloco de hoje:
              </span>
              {alternativeActivities.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-xl border border-surface-container hover:border-primary bg-surface-container-low/40 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-surface-container-low"
                  onClick={() => handleSwapActivity(showSwapModal.id, alt)}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-on-surface">
                        {alt.name} — {alt.subType}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[0.625rem] font-bold bg-surface-container text-secondary">
                        {alt.modulo}
                      </span>
                      {alt.priorityScore && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.625rem] font-extrabold ${
                            alt.priorityScore >= 85
                              ? 'bg-rose-100 text-rose-800'
                              : alt.priorityScore >= 70
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-surface-container text-secondary'
                          }`}
                        >
                          Score C2: {alt.priorityScore}
                        </span>
                      )}
                    </div>
                    <div className="text-[0.6875rem] text-secondary leading-relaxed">
                      {alt.whyNow}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-code-metric text-xs font-bold text-primary block">
                      {alt.durationMin} min
                    </span>
                    <span className="text-[0.6875rem] text-primary font-bold hover:underline">
                      Selecionar →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: SESSÃO DE ESTUDO ATIVA (Foco e Registro de Estudo) */}
      {activeStudySession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-surface-container shadow-2xl space-y-5 my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] text-primary uppercase font-bold tracking-wider">
                  Sessão de Foco Ativa
                </span>
                <h2 className="text-xl font-extrabold text-on-surface">
                  {activeStudySession.name} — {activeStudySession.subType}
                </h2>
              </div>
              <button
                onClick={() => setActiveStudySession(null)}
                className="p-1 rounded-lg text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            {/* Temporizador: ⏱️ 00:32:14 & Tempo restante: 28min */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="font-code-metric text-3xl font-black text-on-surface tracking-tight">
                    {formatSecToMin(sessionTimerSeconds)}
                  </div>
                  <span className="text-[0.6875rem] text-secondary font-semibold">
                    Tempo estimado restante: {Math.max(0, activeStudySession.durationMin - Math.floor(sessionTimerSeconds / 60))}min
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-xs font-bold text-on-surface transition-all"
                >
                  {isTimerRunning ? '⏸ Pausar' : '▶ Retomar'}
                </button>
              </div>
            </div>

            {/* Se for sessão de Teoria: Checklist de Estudo Medway */}
            {activeStudySession.subType.toLowerCase().includes('teoria') ? (
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">menu_book</span>
                    Etapas do Estudo Teórico (Medway)
                  </span>
                  <span className="text-[0.6875rem] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {activeStudySession.modulo}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container cursor-pointer hover:border-primary/40 transition-all">
                    <input
                      type="checkbox"
                      checked={theoryVideoWatched}
                      onChange={(e) => setTheoryVideoWatched(e.target.checked)}
                      className="rounded text-primary w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-on-surface block">
                        Videoaula Medway (45 min)
                      </span>
                      <span className="text-[0.6875rem] text-secondary leading-relaxed block">
                        Conceitos de GOLD 1-4, grupos A-E, espirometria (VEF1/CVF &lt; 0.70 pós-BD) e cessação do tabagismo.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container cursor-pointer hover:border-primary/40 transition-all">
                    <input
                      type="checkbox"
                      checked={theoryApostilaRead}
                      onChange={(e) => setTheoryApostilaRead(e.target.checked)}
                      className="rounded text-primary w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-on-surface block">
                        Apostila Digital / Resumo Esquematizado
                      </span>
                      <span className="text-[0.6875rem] text-secondary leading-relaxed block">
                        Revisão dos critérios de Anthonisen para exacerbação infecciosa e indicações de VNI/oxigenoterapia.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[0.6875rem] text-secondary flex items-center justify-between">
                  <span>Exercícios de fixação pós-aula:</span>
                  <span className="font-bold text-primary">5 questões recomendadas</span>
                </div>
              </div>
            ) : null}

            {/* Quantas questões você fez? / Quantas acertou? */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">
                  {activeStudySession.subType.toLowerCase().includes('teoria')
                    ? 'Questões de fixação pós-vídeo realizadas'
                    : 'Quantas questões você fez?'}
                </span>
                <div className="flex items-center gap-1.5 font-code-metric font-bold">
                  <input
                    type="number"
                    min={1}
                    value={finishExercisesDone}
                    onChange={(e) => setFinishExercisesDone(Math.max(0, Number(e.target.value)))}
                    className="w-14 h-8 px-2 text-center bg-surface-container-lowest border border-surface-container rounded-lg font-bold text-on-surface text-sm"
                  />
                  <span className="text-secondary">/</span>
                  <input
                    type="number"
                    min={1}
                    value={finishExercisesTotal}
                    onChange={(e) => setFinishExercisesTotal(Math.max(1, Number(e.target.value)))}
                    className="w-14 h-8 px-2 text-center bg-surface-container-lowest border border-surface-container rounded-lg font-bold text-on-surface text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-container/60">
                <span className="font-bold text-on-surface">Quantas acertou?</span>
                <div className="flex items-center gap-2 font-code-metric font-bold">
                  <input
                    type="number"
                    min={0}
                    max={finishExercisesDone}
                    value={finishCorrectAnswers}
                    onChange={(e) => setFinishCorrectAnswers(Math.max(0, Number(e.target.value)))}
                    className="w-14 h-8 px-2 text-center bg-surface-container-lowest border border-surface-container rounded-lg font-bold text-emerald-700 text-sm"
                  />
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {finishExercisesDone > 0 ? `${Math.round((finishCorrectAnswers / finishExercisesDone) * 100)}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Motivo dos erros? (checkboxes) */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">Motivo dos erros? (opcional)</span>
                <span className="text-[0.625rem] text-secondary">Alimenta o Caderno de Erros</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { key: 'nao_sabia', label: 'Não sabia' },
                  { key: 'esqueci', label: 'Esqueci' },
                  { key: 'interpretacao', label: 'Interpretei errado' },
                  { key: 'desatencao', label: 'Desatenção' },
                  { key: 'entre_duas', label: 'Fiquei entre duas alternativas' },
                  { key: 'raciocinio', label: 'Erro de raciocínio' },
                  { key: 'outro', label: 'Outro' },
                ].map((m) => (
                  <label
                    key={m.key}
                    className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedErrorReasons.includes(m.key as ErrorReasonType)}
                      onChange={() => toggleErrorReason(m.key as ErrorReasonType)}
                      className="rounded text-primary w-4 h-4"
                    />
                    <span className="text-[0.75rem] text-on-surface font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setActiveStudySession(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-secondary"
              >
                Pausar / Fechar
              </button>

              <button
                type="button"
                onClick={handleSaveSession}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Salvar e concluir estudo</span>
                <span>✓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: FINALIZANDO A SESSÃO (Sessão concluída 🎉) */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-surface-container shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-3xl">🎉</span>
              <h2 className="text-lg font-black text-on-surface">Sessão concluída com sucesso!</h2>
              <p className="text-xs text-secondary">
                Preencha os resultados para alimentar o domínio e recalcular o FSRS.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Tempo estudado */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface">Tempo estudado</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={finishTimeMinutes}
                    onChange={(e) => setFinishTimeMinutes(Number(e.target.value))}
                    className="w-16 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold text-on-surface"
                  />
                  <span className="font-bold text-secondary">min</span>
                </div>
              </div>

              {/* Teoria Concluída */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <span className="font-bold text-on-surface">Teoria</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={finishTheoryCompleted}
                    onChange={(e) => setFinishTheoryCompleted(e.target.checked)}
                    className="rounded text-primary w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-emerald-800">
                    {finishTheoryCompleted ? 'Concluída ☑' : 'Pendente'}
                  </span>
                </div>
              </label>

              {/* Exercícios Realizados e Acertos */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">Exercícios realizados</span>
                  <div className="flex items-center gap-1 font-code-metric font-bold">
                    <input
                      type="number"
                      value={finishExercisesDone}
                      onChange={(e) => setFinishExercisesDone(Number(e.target.value))}
                      className="w-12 h-7 px-1 text-center bg-surface-container-lowest border border-surface-container rounded font-bold"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={finishExercisesTotal}
                      onChange={(e) => setFinishExercisesTotal(Number(e.target.value))}
                      className="w-12 h-7 px-1 text-center bg-surface-container-lowest border border-surface-container rounded font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-surface-container/60">
                  <span className="font-bold text-on-surface">Acertos</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={finishCorrectAnswers}
                      onChange={(e) => setFinishCorrectAnswers(Number(e.target.value))}
                      className="w-12 h-7 px-1 text-center bg-surface-container-lowest border border-surface-container rounded font-bold"
                    />
                    <span className="font-code-metric font-bold text-emerald-700">
                      ({((finishCorrectAnswers / Math.max(1, finishExercisesDone)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Dificuldade Percebida */}
              <div className="space-y-1.5">
                <span className="font-bold text-on-surface block">Dificuldade sentida</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['facil', 'normal', 'dificil'] as const).map((dif) => (
                    <button
                      key={dif}
                      type="button"
                      onClick={() => setFinishDifficulty(dif)}
                      className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                        finishDifficulty === dif
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-low border-surface-container text-secondary hover:text-on-surface'
                      }`}
                    >
                      {dif === 'facil' ? '○ Fácil' : dif === 'normal' ? '○ Normal' : '● Difícil'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivos dos Erros (7 Categorias) */}
              <div className="space-y-2">
                <span className="font-bold text-on-surface block">
                  Motivos dos erros (obrigatório para calibragem)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { key: 'esqueci', label: 'Esqueci' },
                    { key: 'nao_sabia', label: 'Não sabia' },
                    { key: 'interpretacao', label: 'Interpretei errado' },
                    { key: 'desatencao', label: 'Desatenção' },
                    { key: 'entre_duas', label: 'Fiquei entre alternativas' },
                    { key: 'raciocinio', label: 'Erro de raciocínio' },
                    { key: 'outro', label: 'Outro' },
                  ].map((m) => (
                    <label
                      key={m.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container"
                    >
                      <input
                        type="checkbox"
                        checked={selectedErrorReasons.includes(m.key as ErrorReasonType)}
                        onChange={() => toggleErrorReason(m.key as ErrorReasonType)}
                        className="rounded text-primary w-3.5 h-3.5"
                      />
                      <span className="text-[0.6875rem] text-on-surface">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Observações Clínicas Opcionais */}
              <div className="space-y-1">
                <span className="font-bold text-on-surface block">Observações (opcional)</span>
                <textarea
                  value={finishNotes}
                  onChange={(e) => setFinishNotes(e.target.value)}
                  placeholder="Ex: Pegadinha recorrente da banca na indicação de iSGLT2 na ICFER..."
                  rows={2}
                  className="w-full p-2 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                onClick={() => setShowFinishModal(false)}
                className="px-3 py-2 rounded-xl bg-surface-container text-xs font-semibold text-secondary"
              >
                Voltar
              </button>
              <button
                onClick={handleSaveSession}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
              >
                Salvar sessão &amp; Atualizar Cérebro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: ATIVIDADE NÃO REALIZADA / ADIAR COM CÁLCULO DE IMPACTO */}
      {showUnfinishedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-surface-container shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    Gerenciar: {showUnfinishedModal.name}
                  </h3>
                  <span className="text-[0.6875rem] text-secondary">
                    {showUnfinishedModal.durationMin} min planejados
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowUnfinishedModal(null)}
                className="p-1 rounded text-secondary hover:bg-surface-container text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-secondary">
              Se você não puder realizar esta atividade hoje, escolha o destino. O sistema recalcula o impacto no ritmo de 2 anos:
            </p>

            {/* Três Opções */}
            <div className="space-y-2">
              <button
                onClick={() => handleHandleUnfinished('reprogramar')}
                className="w-full text-left p-3 rounded-xl border border-surface-container hover:border-primary bg-surface-container-low transition-all"
              >
                <div className="text-xs font-bold text-on-surface">Reprogramar para amanhã</div>
                <div className="text-[0.6875rem] text-emerald-700 font-semibold mt-0.5">
                  🟢 Sem impacto relevante na meta de 2 anos.
                </div>
              </button>

              <button
                onClick={() => handleHandleUnfinished('adiar')}
                className="w-full text-left p-3 rounded-xl border border-surface-container hover:border-amber-400 bg-surface-container-low transition-all"
              >
                <div className="text-xs font-bold text-on-surface">Adiar para a próxima semana</div>
                <div className="text-[0.6875rem] text-amber-700 font-semibold mt-0.5">
                  🟡 Ritmo necessário subirá levemente de 7h35 para 7h45/semana.
                </div>
              </button>

              <button
                onClick={() => handleHandleUnfinished('remover')}
                className="w-full text-left p-3 rounded-xl border border-surface-container hover:border-rose-400 bg-surface-container-low transition-all"
              >
                <div className="text-xs font-bold text-rose-800">Remover do ciclo imediato</div>
                <div className="text-[0.6875rem] text-secondary mt-0.5">
                  O conteúdo volta para o radar geral e será sugerido futuramente.
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DOSSIÊ DE DOMÍNIO E PRIORIZAÇÃO (CÉREBRO 1 & 2) */}
      {selectedContentForDossier && (
        <DominioDossieModal
          content={selectedContentForDossier}
          onClose={() => setSelectedContentForDossier(null)}
        />
      )}
    </div>
  );
};
