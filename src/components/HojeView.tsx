import React, { useState, useEffect } from 'react';
import { chaveDiaSemanaBR, hojeBR, segundaDaSemanaBR } from '../utils/dateBR';
import { WEEKDAY_KEYS, WeekSchedule } from '../utils/weekPlan';
import { UserPreferences, ErrorReasonType, ContentItem, AreaItem, OslerBlockRecord, DayCapacityConfig } from '../types';
import { getContentState } from '../utils/contentState';
import { buildTodayPlan, rankContentsByPriority, ContentPriority, ActivityKind } from '../utils/priorityEngine';
import { computePace } from '../utils/paceEngine';
import { getAllCurriculumContents } from '../data/mockData';
import { DominioDossieModal } from './DominioDossieModal';
import { TodoFaculdade } from './TodoFaculdade';
import { ConstanciaEstudos } from './ConstanciaEstudos';

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

/** Sessão de teoria salva sem concluir (botão "Salvar"), para continuar depois. */
interface SessionDraft {
  activity: ActivityItem;
  seconds: number;
  /** Minutos que já entraram em "Esta semana". */
  countedMinutes: number;
  theoryDone: boolean;
  didPre: boolean;
  preTotal: string;
  preCorrect: string;
  didPost: boolean;
  postTotal: string;
  postCorrect: string;
  notes: string;
  savedAt: string; // YYYY-MM-DD
}

const SESSION_DRAFTS_KEY = 'synapsemed_session_drafts';

const loadSessionDrafts = (): Record<string, SessionDraft> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_DRAFTS_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

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
  /** Blocos Osler para ligar o fator revisão no plano do dia. */
  oslerBlocks?: OslerBlockRecord[];
  /** Disponibilidade da semana (fonte central) para sugerir a fatia de hoje. */
  weekDays?: DayCapacityConfig[];
  /** Registra uma sessão de teoria (pré/pós) alimentando o domínio. */
  onRecordTheory?: (input: {
    contentId: string; contentName: string; theoryCompleted: boolean;
    preTotal?: number; preCorrect?: number; postTotal?: number; postCorrect?: number;
    durationMinutes: number; notes?: string;
  }) => void;
  /** Navegar para outra aba (ex.: levar questões/revisão à aba certa). */
  onNavigate?: (path: any) => void;
  /** 1º Osler pendente por conteúdo (criado ao concluir teoria). */
  oslerPending?: { contentId: string; dueDate: string }[];
  onNavigateToRevisoes?: () => void;
  /** Tempo escolhido para hoje (fonte no App); null = usa a sugestão da semana. */
  todayAvailableMin?: number | null;
  onChangeTodayAvailable?: (minutes: number) => void;
  /** Grade da semana guardada no App (a mesma do Planejamento). */
  weekSchedule?: WeekSchedule | null;
  /** Marca na grade a atividade do conteúdo concluído aqui. */
  onCompleteWeekContent?: (contentId: string) => void;
}

export const HojeView: React.FC<HojeViewProps> = ({
  preferences,
  onNavigateToPlanejamento,
  onNavigateToCurriculo,
  onContentStudied,
  curriculum,
  oslerBlocks = [],
  weekDays,
  onRecordTheory,
  onNavigate,
  oslerPending = [],
  onNavigateToRevisoes,
  todayAvailableMin = null,
  onChangeTodayAvailable,
  weekSchedule = null,
  onCompleteWeekContent,
}) => {
  // Fatia de hoje sugerida a partir da semana: capacidade do dia de hoje, ou
  // média dos dias com capacidade > 0 (dias de descanso não entram).
  const suggestedTodayMin = React.useMemo(() => {
    if (!weekDays || !weekDays.length) return 100;
    const todayKey = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][
      new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getDay()
    ];
    const todayCfg = weekDays.find((d) => d.key === todayKey);
    if (todayCfg && todayCfg.capacityMin > 0) return todayCfg.capacityMin;
    // fallback: média dos dias ativos
    const active = weekDays.filter((d) => d.capacityMin > 0);
    if (!active.length) return 100;
    return Math.round(active.reduce((s, d) => s + d.capacityMin, 0) / active.length);
  }, [weekDays]);
  // Cota de hoje: o tempo escolhido em "Ajustar tempo de hoje" (guardado no
  // App, vale só no dia) ou, sem escolha, a sugestão derivada da semana.
  const availableTodayMin = todayAvailableMin ?? suggestedTodayMin;

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

  // Ritmo/prazo (meta dez/2028): informa a pressão de prazo p/ o motor.
  const pace = React.useMemo(() => computePace(curriculum ?? [], preferences.weeklyHoursTarget), [curriculum, preferences.weeklyHoursTarget]);

  // Plano de hoje = o que está pendente para hoje na grade da semana (a mesma
  // do Planejamento, guardada no App). Fim de semana ou dia útil sem capacidade
  // e sem tempo escolhido: a grade não tem nada para hoje, então o Hoje sugere
  // pela prioridade.
  const recommendedPlan = React.useMemo(() => {
    const todayKey = chaveDiaSemanaBR();
    const todayCapacity = weekDays?.find((d) => d.key === todayKey)?.capacityMin ?? 0;
    const inWeekPlan = WEEKDAY_KEYS.includes(todayKey) && (todayAvailableMin != null || todayCapacity > 0);
    const plan = inWeekPlan
      ? (weekSchedule?.items ?? [])
          .filter((it) => it.day === todayKey && it.status === 'pendente')
          .map((it) => it.cp)
      : buildTodayPlan(curriculum ?? [], availableTodayMin, 2, oslerBlocks, pace.paceFactor, preferences.focoModulo);
    return planToActivities(plan);
  }, [curriculum, weekDays, weekSchedule, todayAvailableMin, availableTodayMin, oslerBlocks, pace.paceFactor, preferences.focoModulo]);

  // 1º Osler pendente cuja data já chegou -> vira atividade de revisão no topo.
  const oslerPendingActivities: ActivityItem[] = React.useMemo(() => {
    const hoje = hojeBR();
    const contents = (curriculum ?? []).flatMap((a) =>
      a.modules.flatMap((m) => m.contents.map((c) => ({ c, mod: m.name })))
    );
    return oslerPending
      .filter((p) => p.dueDate <= hoje)
      .map((p) => {
        const found = contents.find((x) => x.c.id === p.contentId);
        return {
          id: `osler-pend-${p.contentId}`,
          contentId: p.contentId,
          name: found?.c.name || 'Conteúdo',
          subType: 'Revisão / Osler',
          durationMin: 30,
          specialty: found?.mod || '',
          modulo: found?.mod || '',
          priority: 'alta' as const,
          priorityScore: 90,
          whyNow: 'Primeira revisão Osler, agendada após a teoria. Fortalece a memória.',
          whyDetails: {
            incidence: '', examScore: '', domainScore: '', targetScore: '',
            fsrsStatus: 'Primeira revisão (pós-teoria)', postExercisesCompleted: '',
          },
          recommendedDay: 'hoje', currentDay: 'hoje',
        };
      });
  }, [oslerPending, curriculum]);

  // Sessões salvas sem concluir ("Salvar"): por conteúdo, guardam o tempo e o
  // que foi preenchido para continuar depois. Concluir registra tudo e apaga.
  const [sessionDrafts, setSessionDrafts] = useState<Record<string, SessionDraft>>(loadSessionDrafts);
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_DRAFTS_KEY, JSON.stringify(sessionDrafts));
    } catch {
      // armazenamento indisponível: o rascunho vale só nesta aba
    }
  }, [sessionDrafts]);
  const draftKey = (a: ActivityItem) => a.contentId || a.id;

  // Activities for Today: oslers pendentes (no topo) + sessões salvas em
  // andamento (mesmo de outros dias) + plano recomendado.
  const buildTodayActivities = () => {
    const inPlan = new Set([...oslerPendingActivities, ...recommendedPlan].map((a) => a.contentId || a.id));
    const emAndamento = (Object.values(sessionDrafts) as SessionDraft[])
      .map((d) => d.activity)
      .filter((a) => !inPlan.has(a.contentId || a.id));
    return [...oslerPendingActivities, ...emAndamento, ...recommendedPlan];
  };
  const [activities, setActivities] = useState<ActivityItem[]>(buildTodayActivities);
  useEffect(() => {
    setActivities(buildTodayActivities());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedPlan, oslerPendingActivities, sessionDrafts]);

  // Registro de Autonomia: histórico de alterações manuais da recomendação
  const [userOverrides, setUserOverrides] = useState<UserOverrideRecord[]>([]);

  // Modal de Dossiê Completo do Domínio (Cérebro 1 & Cérebro 2)
  const [selectedContentForDossier, setSelectedContentForDossier] = useState<ContentItem | null>(null);

  // Alternativas para "Trocar atividade": próximas prioridades do motor que
  // NÃO entraram no plano de hoje (dados reais, não lista fixa).
  const alternativeActivities: ActivityItem[] = React.useMemo(() => {
    const planIds = new Set(recommendedPlan.map((a) => a.contentId));
    const rest = rankContentsByPriority(curriculum ?? [], oslerBlocks)
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
  // Campos específicos de TEORIA (pré e pós separados)
  const [theoryDone, setTheoryDone] = useState(false);
  const [didPre, setDidPre] = useState(false);
  const [preTotal, setPreTotal] = useState('');
  const [preCorrect, setPreCorrect] = useState('');
  const [didPost, setDidPost] = useState(false);
  const [postTotal, setPostTotal] = useState('');
  const [postCorrect, setPostCorrect] = useState('');

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
  // Minutos concluídos na semana, salvos junto com a segunda-feira da semana
  // (Brasília). Valor de outra semana (ou no formato antigo, só o número) zera.
  const semanaAtual = segundaDaSemanaBR();
  const [completedMinutes, setCompletedMinutes] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('synapsemed_weekly_completed_minutes') || 'null');
        if (saved?.week === semanaAtual) return Number(saved.minutes) || 0;
      } catch {
        // formato antigo ou inválido: começa a semana do zero
      }
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'synapsemed_weekly_completed_minutes',
        JSON.stringify({ week: semanaAtual, minutes: completedMinutes })
      );
    }
  }, [completedMinutes, semanaAtual]);

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
    const sub = activity.subType.toLowerCase();
    const isTheory = sub.includes('teoria') || sub.includes('exerc');
    // Tipos que têm aba própria de registro: direciona para lá (Etapa C).
    if (!isTheory) {
      if (sub.includes('quest') || sub.includes('prova')) {
        onNavigate?.('provas-e-simulados');
        showToast(`Abra "${activity.name}" em Provas & Simulados para registrar.`);
        return;
      }
      if (sub.includes('revis') || sub.includes('osler')) {
        onNavigate?.('revisoes');
        showToast(`Registre a revisão de "${activity.name}" na aba Revisões.`);
        return;
      }
    }
    // TEORIA (e exercícios): registro completo aqui mesmo. Se houver uma sessão
    // salva desse conteúdo, continua de onde parou (tempo e o que foi preenchido).
    const draft = sessionDrafts[draftKey(activity)];
    setActiveStudySession(activity);
    setSessionTimerSeconds(draft?.seconds ?? 0);
    setIsTimerRunning(true);
    setFinishTimeMinutes(activity.durationMin);
    setFinishNotes(draft?.notes ?? '');
    setTheoryDone(draft?.theoryDone ?? false);
    setDidPre(draft?.didPre ?? false); setPreTotal(draft?.preTotal ?? ''); setPreCorrect(draft?.preCorrect ?? '');
    setDidPost(draft?.didPost ?? false); setPostTotal(draft?.postTotal ?? ''); setPostCorrect(draft?.postCorrect ?? '');
    if (draft) showToast(`Continuando "${activity.name}" de onde você parou (${formatSecToMin(draft.seconds)}).`);
  };

  // "Salvar": guarda o progresso sem concluir. O tempo já estudado conta na
  // semana agora; ao concluir, só entra o que faltar.
  const handleSaveDraft = () => {
    if (!activeStudySession) return;
    const key = draftKey(activeStudySession);
    const anterior = sessionDrafts[key];
    const minutos = Math.round(sessionTimerSeconds / 60);
    setCompletedMinutes((prev) => prev + Math.max(0, minutos - (anterior?.countedMinutes ?? 0)));
    setSessionDrafts((prev) => ({
      ...prev,
      [key]: {
        activity: activeStudySession,
        seconds: sessionTimerSeconds,
        countedMinutes: Math.max(minutos, anterior?.countedMinutes ?? 0),
        theoryDone, didPre, preTotal, preCorrect, didPost, postTotal, postCorrect,
        notes: finishNotes,
        savedAt: hojeBR(),
      },
    }));
    setActiveStudySession(null);
    setIsTimerRunning(false);
    showToast(`Progresso de "${activeStudySession.name}" salvo. Clique em Continuar para retomar.`);
  };

  const handleCompleteDirect = (activity: ActivityItem) => {
    setCompletedMinutes((prev) => prev + activity.durationMin);
    setActivities((prev) => prev.filter((a) => a.id !== activity.id));
    onContentStudied?.(activity.contentId);
    if (activity.contentId) onCompleteWeekContent?.(activity.contentId);
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
    onRecordTheory?.({
      contentId: activeStudySession.contentId || '',
      contentName: activeStudySession.name,
      theoryCompleted: theoryDone,
      preTotal: didPre ? Number(preTotal) || 0 : undefined,
      preCorrect: didPre ? Number(preCorrect) || 0 : undefined,
      postTotal: didPost ? Number(postTotal) || 0 : undefined,
      postCorrect: didPost ? Number(postCorrect) || 0 : undefined,
      durationMinutes: Math.round(sessionTimerSeconds / 60) || finishTimeMinutes,
      notes: finishNotes,
    });
    // Minutos que ainda não entraram na semana (os de sessões salvas já entraram).
    const draft = sessionDrafts[draftKey(activeStudySession)];
    const totalMin = Math.round(sessionTimerSeconds / 60) || finishTimeMinutes;
    setCompletedMinutes((prev) => prev + Math.max(0, totalMin - (draft?.countedMinutes ?? 0)));
    if (draft) {
      setSessionDrafts((prev) => {
        const { [draftKey(activeStudySession)]: _concluida, ...resto } = prev;
        return resto;
      });
    }
    setActivities((prev) => prev.filter((a) => a.id !== activeStudySession.id));
    if (activeStudySession.contentId) onCompleteWeekContent?.(activeStudySession.contentId);
    setShowFinishModal(false);
    setActiveStudySession(null);
    setIsTimerRunning(false);
    showToast(`Sessão de ${activeStudySession.name} registrada! Domínio atualizado.`);
  };

  const handleSwapActivity = (oldActivityId: string, newActivity: ActivityItem) => {
    const original = activities.find((a) => a.id === oldActivityId);
    if (!original) return;

    // Constrói o registro de autonomia com os 3 impactos calculados
    const overrideRecord: UserOverrideRecord = {
      id: `override-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),
      originalActivity: original,
      chosenActivity: newActivity,
      weeklyPlanImpact: `A atividade de ${original.name} (${original.durationMin} min) sob as bancas USP/UNIFESP foi postergada para quarta-feira, mantendo a cota de ${preferences.weeklyHoursTarget}h da semana perfeitamente equilibrada.`,
      timelineTwoYearImpact: `Ritmo de 2 anos considerado (${pace.hoursPerWeekNeeded}h/semana necessárias vs ${preferences.weeklyHoursTarget}h disponíveis).`,
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
    onChangeTodayAvailable?.(min);
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
      showToast(`🟡 ${item.name} adiado para a próxima semana. O ritmo necessário é recalculado automaticamente.`);
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
    <div className="w-full px-4 sm:px-6 py-6 max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-start gap-6">
      {/* COLUNA DIREITA: To do da faculdade (bloco de notas, sem vínculo com os motores) */}
      <aside className="w-full max-w-4xl mx-auto xl:mx-0 xl:w-80 xl:max-w-none shrink-0 xl:order-last space-y-6">
        <TodoFaculdade />
        <ConstanciaEstudos />
      </aside>

    <div className="flex flex-col w-full min-w-0 max-w-4xl mx-auto xl:mx-0 xl:flex-1 space-y-6">
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
              {(() => {
                const h = Number(
                  new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false })
                );
                const saud = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
                return `${saud}, ${preferences.name.split(' ')[0] || 'Letícia'}.`;
              })()}
            </h1>
            <p className="text-xs text-secondary mt-0.5 font-medium">
              {(() => {
                const hoje = new Date().toLocaleDateString('pt-BR', {
                  timeZone: 'America/Sao_Paulo', weekday: 'long', day: 'numeric', month: 'long',
                });
                return `Hoje é ${hoje}`;
              })()}
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

      {/* Indicador de RITMO / PRAZO (meta dez/2028) */}
      <section
        className="rounded-2xl p-4 border shadow-xs flex items-start gap-3"
        style={{
          background:
            pace.status === 'atrasada' ? 'var(--color-red-50)'
            : pace.status === 'adiantada' ? 'var(--color-blue-50)'
            : pace.status === 'concluido' ? 'var(--color-green-50)'
            : 'var(--color-amber-50)',
          borderColor:
            pace.status === 'atrasada' ? 'var(--color-red-200)'
            : pace.status === 'adiantada' ? 'var(--color-blue-200)'
            : pace.status === 'concluido' ? 'var(--color-green-200)'
            : 'var(--color-amber-200)',
        }}
      >
        <span className="material-symbols-outlined"
          style={{ color:
            pace.status === 'atrasada' ? '#dc2626'
            : pace.status === 'adiantada' ? '#2563eb'
            : pace.status === 'concluido' ? '#16a34a' : '#d97706' }}>
          {pace.status === 'atrasada' ? 'warning'
            : pace.status === 'concluido' ? 'check_circle' : 'schedule'}
        </span>
        <div className="text-sm">
          <div className="font-semibold text-on-surface">
            Ritmo para dez/2028 — {pace.dominados}/{pace.totalContents} conteúdos consolidados
          </div>
          <div className="text-secondary text-xs mt-0.5">{pace.message}</div>
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
                <span className="text-secondary">Ritmo necessário (meta dez/2028):</span>
                <span className="font-code-metric font-bold text-on-surface">{pace.hoursPerWeekNeeded}h/semana</span>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[0.6875rem]"
                  style={{
                    background: pace.fitsInPlan ? 'var(--color-green-100)' : 'var(--color-amber-100)',
                    color: pace.fitsInPlan ? 'var(--color-green-800)' : 'var(--color-amber-800)',
                  }}
                >
                  <span>{pace.fitsInPlan ? '🟢' : '🟠'}</span>
                  <span>{pace.fitsInPlan ? 'Dentro da sua disponibilidade' : 'Acima da sua disponibilidade'}</span>
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
                    {sessionDrafts[draftKey(act)] && (() => {
                      const d = sessionDrafts[draftKey(act)];
                      const partes = [
                        `${formatSecToMin(d.seconds)} estudados`,
                        d.theoryDone ? 'teoria ✓' : '',
                        d.didPre && d.preTotal ? `pré ${d.preCorrect || 0}/${d.preTotal}` : '',
                        d.didPost && d.postTotal ? `pós ${d.postCorrect || 0}/${d.postTotal}` : '',
                      ].filter(Boolean);
                      return (
                        <span
                          className="px-2 py-0.5 rounded-full text-[0.625rem] font-bold bg-primary/20 text-on-surface border border-primary/40"
                          title="Sessão salva sem concluir — clique em Continuar para retomar"
                        >
                          ⏸ Em andamento · {partes.join(' · ')}
                        </span>
                      );
                    })()}
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
                  <span>{sessionDrafts[draftKey(act)] ? 'Continuar' : 'Iniciar'}</span>
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
                className="col-span-2 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>▶ Iniciar agora</span>
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
                onClick={() => {
                  setActiveStudySession(null);
                  setIsTimerRunning(false);
                }}
                className="p-1 rounded-lg text-secondary hover:bg-surface-container"
                title="Fechar sem salvar"
                aria-label="Fechar sem salvar"
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

            {/* Registro da sessão de TEORIA (tudo numa tela só) */}
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <span className="font-bold text-on-surface">✅ Concluí a teoria (videoaula/apostila)</span>
                <input type="checkbox" checked={theoryDone} onChange={(e) => setTheoryDone(e.target.checked)} className="w-5 h-5" />
              </label>

              {/* PRÉ-teoria */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-on-surface">Fiz os exercícios PRÉ-teoria</span>
                  <input type="checkbox" checked={didPre} onChange={(e) => setDidPre(e.target.checked)} className="w-5 h-5" />
                </label>
                {didPre && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-secondary">Acertei</span>
                      <input type="number" min="0" value={preCorrect} onChange={(e) => setPreCorrect(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                    </div>
                    <span className="text-secondary">de</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0" value={preTotal} onChange={(e) => setPreTotal(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                      <span className="text-secondary">questões</span>
                    </div>
                  </div>
                )}
              </div>

              {/* PÓS-teoria */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-on-surface">Fiz os exercícios PÓS-teoria</span>
                  <input type="checkbox" checked={didPost} onChange={(e) => setDidPost(e.target.checked)} className="w-5 h-5" />
                </label>
                {didPost && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-secondary">Acertei</span>
                      <input type="number" min="0" value={postCorrect} onChange={(e) => setPostCorrect(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                    </div>
                    <span className="text-secondary">de</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0" value={postTotal} onChange={(e) => setPostTotal(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                      <span className="text-secondary">questões</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Anotações */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface block mb-1">Anotações (opcional)</span>
                <textarea value={finishNotes} onChange={(e) => setFinishNotes(e.target.value)} rows={2}
                  placeholder="ex: revisar o mecanismo X; ficou dúvida em Y"
                  className="w-full p-2 bg-surface-container-lowest border border-surface-container rounded-lg text-xs" />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="space-y-2 pt-3 border-t border-surface-container">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2.5 rounded-xl border border-primary/50 bg-primary/15 hover:bg-primary/25 text-xs font-bold text-on-surface flex items-center gap-1.5 transition-all"
                  title="Guarda o tempo e o que você preencheu, sem concluir. Continue depois em Continuar."
                >
                  <span className="material-symbols-outlined text-[1rem]">save</span>
                  <span>Salvar</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveSession}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Salvar e concluir estudo</span>
                  <span>✓</span>
                </button>
              </div>
              <p className="text-[0.6875rem] text-secondary text-right">
                Salvar guarda o progresso para continuar depois. Fechar no ✕ descarta o que não foi salvo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: FINALIZANDO A SESSÃO (Sessão concluída 🎉) */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-surface-container shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-3xl">📘</span>
              <h2 className="text-lg font-black text-on-surface">Registrar estudo de teoria</h2>
              <p className="text-xs text-secondary">
                Informe o que você fez — isso alimenta seu domínio e as revisões.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Teoria concluída */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <span className="font-bold text-on-surface">✅ Concluí a teoria (videoaula/apostila)</span>
                <input type="checkbox" checked={theoryDone} onChange={(e) => setTheoryDone(e.target.checked)} className="w-5 h-5" />
              </label>

              {/* Exercícios PRÉ-teoria */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-on-surface">Fiz os exercícios PRÉ-teoria</span>
                  <input type="checkbox" checked={didPre} onChange={(e) => setDidPre(e.target.checked)} className="w-5 h-5" />
                </label>
                {didPre && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-secondary">Acertei</span>
                      <input type="number" min="0" value={preCorrect} onChange={(e) => setPreCorrect(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                    </div>
                    <span className="text-secondary">de</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0" value={preTotal} onChange={(e) => setPreTotal(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                      <span className="text-secondary">questões</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Exercícios PÓS-teoria */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-on-surface">Fiz os exercícios PÓS-teoria</span>
                  <input type="checkbox" checked={didPost} onChange={(e) => setDidPost(e.target.checked)} className="w-5 h-5" />
                </label>
                {didPost && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-secondary">Acertei</span>
                      <input type="number" min="0" value={postCorrect} onChange={(e) => setPostCorrect(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                    </div>
                    <span className="text-secondary">de</span>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0" value={postTotal} onChange={(e) => setPostTotal(e.target.value)} className="w-14 h-8 px-2 text-right bg-surface-container-lowest border border-surface-container rounded-lg font-code-metric font-bold" />
                      <span className="text-secondary">questões</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tempo estudado (do cronômetro) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface">Tempo estudado</span>
                <span className="font-code-metric font-bold text-on-surface">
                  {Math.round(sessionTimerSeconds / 60) || finishTimeMinutes} min
                </span>
              </div>

              {/* Anotações livres */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-bold text-on-surface block mb-1">Anotações (opcional)</span>
                <textarea value={finishNotes} onChange={(e) => setFinishNotes(e.target.value)} rows={2}
                  placeholder="ex: revisar o mecanismo X; ficou dúvida em Y"
                  className="w-full p-2 bg-surface-container-lowest border border-surface-container rounded-lg text-xs" />
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
                  🟡 O ritmo necessário é recalculado ao adiar atividades.
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
    </div>
  );
};
