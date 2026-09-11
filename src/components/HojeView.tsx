import React, { useState, useEffect } from 'react';
import { UserPreferences, ErrorReasonType, ContentItem } from '../types';
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
}

export const HojeView: React.FC<HojeViewProps> = ({
  preferences,
  onNavigateToPlanejamento,
  onNavigateToCurriculo,
}) => {
  // Cota de disponibilidade diária (Padrão 100 min / 1h40 conforme especificação)
  const [availableTodayMin, setAvailableTodayMin] = useState<number>(100);

  // Lista padrão recomendada pelo algoritmo Cérebro 2 para 100 min (1h40)
  const canonicalRecommendedActivities: ActivityItem[] = [
    {
      id: 'act-dpoc-teoria',
      contentId: 'c-dpoc',
      name: 'DPOC',
      subType: 'Teoria Medway',
      durationMin: 50,
      specialty: 'Clínica Médica',
      modulo: 'Pneumologia',
      priority: 'alta',
      priorityScore: 98,
      whyNow: 'Base teórica para resolução de questões de alta incidência nas bancas selecionadas.',
      whyDetails: {
        incidence: 'Incidência de 94/100 (USP: 10q, UNIFESP: 8q, ENARE: 9q)',
        examScore: 'Teoria Medway: Videoaula (45min) + Apostila GOLD',
        domainScore: 'Domínio teórico estimado C1: 72%',
        targetScore: 'Meta de consolidação: ≥ 85%',
        fsrsStatus: 'Iniciação de ciclo teórico',
        postExercisesCompleted: 'Pré-requisito para pós-exercícios',
      },
      recommendedDay: 'segunda',
      currentDay: 'segunda',
    },
    {
      id: 'act-dpoc',
      contentId: 'c-dpoc',
      name: 'DPOC',
      subType: 'questões de provas',
      durationMin: 40,
      specialty: 'Clínica Médica',
      modulo: 'Pneumologia',
      priority: 'alta',
      priorityScore: 96,
      whyNow: 'Incidência elevada nas instituições selecionadas + desempenho de aplicação abaixo da meta.',
      whyDetails: {
        incidence: 'Incidência elevada nas bancas selecionadas (USP: 10q, UNIFESP: 8q, ENARE: 9q)',
        examScore: 'Aplicação: 71% (Abaixo da meta de 85%)',
        domainScore: 'Domínio estimado Cérebro 1: 78%',
        targetScore: 'Meta de consolidação: ≥ 85%',
        fsrsStatus: 'Retenção FSRS: 84% (em consolidação ativa)',
        postExercisesCompleted: 'Exercícios pós-vídeo: 100% concluídos',
      },
      recommendedDay: 'terca',
      currentDay: 'terca',
    },
    {
      id: 'act-icc',
      contentId: 'c-icc',
      name: 'ICC',
      subType: 'revisão',
      durationMin: 30,
      specialty: 'Clínica Médica',
      modulo: 'Cardiologia',
      priority: 'alta',
      priorityScore: 90,
      whyNow: 'Revisão FSRS programada para hoje + consolidação prática em perfis Stevenson.',
      whyDetails: {
        incidence: 'Incidência de 92/100 (USP: 11q, UNIFESP: 8q, ENARE: 9q)',
        examScore: 'Desempenho em provas reais: 74%',
        domainScore: 'Domínio estimado Cérebro 1: 83%',
        targetScore: 'Meta de consolidação: ≥ 85%',
        fsrsStatus: 'Revisão FSRS agendada para hoje (estabilidade 21 dias)',
        postExercisesCompleted: 'Exercícios pós-vídeo: 100% concluídos',
      },
      recommendedDay: 'terca',
      currentDay: 'terca',
    },
    {
      id: 'act-osler-icc',
      contentId: 'c-osler-icc',
      name: 'Osler — ICC',
      subType: '10min restantes',
      durationMin: 10,
      specialty: 'Clínica Médica',
      modulo: 'Cardiologia',
      priority: 'alta',
      priorityScore: 84,
      whyNow: 'Lote rápido de cartões FSRS de altíssimo impacto por minuto para fechar os 10min finais da cota de 1h40.',
      whyDetails: {
        incidence: 'Incidência alta nas bancas selecionadas (92/100)',
        examScore: 'Desempenho em provas: 74%',
        domainScore: 'Domínio estimado: 83%',
        targetScore: 'Meta: ≥ 85%',
        fsrsStatus: 'Retrievability em 82% — intervalo ideal para retenção rápida de 10 min',
        postExercisesCompleted: 'Exercícios pós-vídeo: 100% concluídos',
      },
      recommendedDay: 'terca',
      currentDay: 'terca',
    },
  ];

  // Activities for Today
  const [activities, setActivities] = useState<ActivityItem[]>(canonicalRecommendedActivities);

  // Registro de Autonomia: histórico de alterações manuais da recomendação
  const [userOverrides, setUserOverrides] = useState<UserOverrideRecord[]>([]);

  // Modal de Dossiê Completo do Domínio (Cérebro 1 & Cérebro 2)
  const [selectedContentForDossier, setSelectedContentForDossier] = useState<ContentItem | null>(null);

  // Alternatives pool for "Trocar atividade"
  const alternativeActivities: ActivityItem[] = [
    {
      id: 'act-doenca-x',
      contentId: 'c-doenca-x',
      name: 'Doença X (Conteúdo Raro)',
      subType: 'Revisão teórica + questões',
      durationMin: 30,
      specialty: 'Clínica Médica',
      modulo: 'Nefrologia',
      priority: 'media',
      priorityScore: 50,
      whyNow: 'Domínio baixo (65%), mas incidência rara nas bancas-alvo (20/100). Prioridade secundária no Cérebro 2.',
      whyDetails: {
        incidence: 'Incidência muito baixa (20/100 — média de 0 a 1q por ano)',
        examScore: 'Desempenho em provas: 60%',
        domainScore: 'Domínio estimado: 65% (menor nota isolada)',
        targetScore: 'Meta: 85%',
        fsrsStatus: 'FSRS em dia (próxima revisão em 15 dias)',
        postExercisesCompleted: '100% concluído',
      },
      recommendedDay: 'sexta',
      currentDay: 'segunda',
    },
    {
      id: 'act-iam',
      contentId: 'c-iam',
      name: 'IAM (Infarto Agudo do Miocárdio)',
      subType: 'Manutenção periódica de prova',
      durationMin: 30,
      specialty: 'Clínica Médica',
      modulo: 'Cardiologia',
      priority: 'baixa',
      priorityScore: 30,
      whyNow: 'Domínio 89% já consolidado (≥ 85%) com retenção estável no FSRS (91%). Prioridade de manutenção.',
      whyDetails: {
        incidence: 'Incidência muito alta (90/100)',
        examScore: 'Desempenho em bancas: 89%',
        domainScore: 'Domínio estimado: 89% (🟢 Consolidado)',
        targetScore: 'Meta: 85% (Atingida)',
        fsrsStatus: 'Estabilidade S: 32 dias (revisão apenas no próximo mês)',
        postExercisesCompleted: '100% concluído',
      },
      recommendedDay: 'sábado',
      currentDay: 'segunda',
    },
    {
      id: 'act-drc',
      contentId: 'c-drc',
      name: 'DRC (Doença Renal Crônica)',
      subType: 'Exercícios comentados',
      durationMin: 35,
      specialty: 'Clínica Médica',
      modulo: 'Nefrologia',
      priority: 'alta',
      priorityScore: 84,
      whyNow: 'Saldo de 15 exercícios pendentes pós-aula + urgência dialítica.',
      whyDetails: {
        incidence: 'Alta incidência em nefrologia (84/100)',
        examScore: 'Desempenho em questões: 65%',
        domainScore: 'Domínio estimado: 68%',
        targetScore: 'Meta: 85%',
        fsrsStatus: 'Estabilidade S: 8 dias',
        postExercisesCompleted: '80% concluído',
      },
      recommendedDay: 'quarta',
      currentDay: 'segunda',
    },
    {
      id: 'act-sca',
      contentId: 'c-sca',
      name: 'SCA (Síndrome Coronariana Aguda)',
      subType: 'Exercícios de fixação',
      durationMin: 25,
      specialty: 'Clínica Médica',
      modulo: 'Cardiologia',
      priority: 'alta',
      priorityScore: 80,
      whyNow: 'Fixação de conduta e delta T em supra de ST.',
      whyDetails: {
        incidence: 'Muito alta (USP, UNICAMP, ENARE)',
        examScore: 'Desempenho: 68%',
        domainScore: 'Domínio: 70%',
        targetScore: 'Meta: 85%',
        fsrsStatus: 'Em consolidação inicial',
        postExercisesCompleted: '100% concluído',
      },
      recommendedDay: 'quinta',
      currentDay: 'segunda',
    },
    {
      id: 'act-pneumonia',
      contentId: 'c-pneumonia',
      name: 'Pneumonia Adquirida na Comunidade',
      subType: 'Teoria + diagnóstico',
      durationMin: 35,
      specialty: 'Clínica Médica',
      modulo: 'Pneumologia',
      priority: 'alta',
      priorityScore: 82,
      whyNow: 'Critérios CURB-65 e antimicrobianos empíricos.',
      whyDetails: {
        incidence: 'Muito alta em todas as bancas de SP e ENARE',
        examScore: 'Sem dados prévios',
        domainScore: 'Domínio inicial: 0%',
        targetScore: 'Meta: 85%',
        fsrsStatus: 'Conteúdo inédito',
        postExercisesCompleted: '0% concluído',
      },
      recommendedDay: 'quarta',
      currentDay: 'segunda',
    },
  ];

  // Active state modals
  const [selectedWhyActivity, setSelectedWhyActivity] = useState<ActivityItem | null>(null);
  const [showSwapModal, setShowSwapModal] = useState<ActivityItem | null>(null);
  const [activeStudySession, setActiveStudySession] = useState<ActivityItem | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showUnfinishedModal, setShowUnfinishedModal] = useState<ActivityItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer simulation for active study session
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(47 * 60); // 47 min pre-simulated
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

  // Daily totals
  const totalPlannedMinutes = activities.reduce((acc, a) => acc + a.durationMin, 0); // 90 min (1h30)
  const [completedMinutes, setCompletedMinutes] = useState(0);

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
    setSessionTimerSeconds(isTheory ? 24 * 60 + 12 : 32 * 60 + 14); // 00:24:12 para teoria
    setIsTimerRunning(true);
    setFinishExercisesDone(isTheory ? 5 : 12);
    setFinishExercisesTotal(isTheory ? 10 : 20);
    setFinishCorrectAnswers(isTheory ? 4 : 9);
    setFinishTimeMinutes(activity.durationMin);
  };

  const handleCompleteDirect = (activity: ActivityItem) => {
    setCompletedMinutes((prev) => prev + activity.durationMin);
    setActivities((prev) => prev.filter((a) => a.id !== activity.id));
    showToast(
      `✓ Atividade "${activity.name}" concluída! Domínio recalculado para 78% e FSRS reagendado.`
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
    setShowFinishModal(false);
    setActiveStudySession(null);
    showToast(
      `Sessão de ${activeStudySession.name} concluída! Domínio recalculado para 78% e FSRS reagendado para daqui a 14 dias.`
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
    setActivities(canonicalRecommendedActivities);
    setUserOverrides([]);
    showToast('Recomendação do algoritmo Cérebro 2 restaurada com sucesso!');
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
    if (min === 100) {
      setActivities(canonicalRecommendedActivities);
    } else if (min === 80) {
      setActivities([
        { ...canonicalRecommendedActivities[0], durationMin: 40 },
        canonicalRecommendedActivities[1],
        canonicalRecommendedActivities[2],
      ]);
    } else if (min === 60) {
      setActivities([
        canonicalRecommendedActivities[0], // DPOC 60 min
      ]);
    } else if (min === 45) {
      setActivities([{ ...canonicalRecommendedActivities[0], durationMin: 45 }]);
    } else if (min === 90) {
      setActivities([
        canonicalRecommendedActivities[0],
        canonicalRecommendedActivities[1],
        { ...canonicalRecommendedActivities[2], durationMin: 20 },
      ]);
    } else if (min === 120) {
      setActivities([
        canonicalRecommendedActivities[0],
        { ...canonicalRecommendedActivities[1], durationMin: 40 },
        { ...canonicalRecommendedActivities[2], durationMin: 20 },
        {
          id: 'act-drc-120min',
          contentId: 'c-drc',
          name: 'DRC',
          subType: 'Exercícios comentados',
          durationMin: 20,
          specialty: 'Clínica Médica',
          modulo: 'Nefrologia',
          priority: 'alta',
          priorityScore: 84,
          whyNow: 'Alta incidência em nefrologia (84/100) + exercícios pós-aula pendentes.',
          whyDetails: {
            incidence: 'Alta incidência (84/100)',
            examScore: '65%',
            domainScore: 'Domínio 68%',
            targetScore: '85%',
            fsrsStatus: 'Estabilidade S: 8 dias',
            postExercisesCompleted: '80% concluído',
          },
          recommendedDay: 'segunda',
          currentDay: 'segunda',
        },
      ]);
    }
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
      <section className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-on-surface uppercase tracking-wider">Esta semana</span>
          <span className="font-code-metric text-sm font-extrabold text-on-surface">
            5h20 <span className="text-secondary font-normal">/ {preferences.weeklyHoursTarget}h00</span>
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden p-0.5 border border-surface-container-high/40">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${(5.33 / preferences.weeklyHoursTarget) * 100}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-surface-container pt-3">
          <span className="text-secondary">
            Restam <strong className="text-on-surface font-semibold">2h40</strong> nesta semana.
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

        {/* Opção para teste: Iniciar a Teoria de DPOC para testar o quadro de estudo */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-lg">school</span>
            <div>
              <span className="text-xs font-bold text-on-surface block">
                Teoria: DPOC (Pneumologia • Medway)
              </span>
              <span className="text-[0.6875rem] text-secondary">
                Videoaula (45 min) + Apostila GOLD • Inicie para visualizar o quadro de estudo ativo
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              handleStartSession({
                id: 'act-dpoc-teoria',
                contentId: 'c-dpoc',
                name: 'DPOC',
                subType: 'Teoria Medway',
                durationMin: 50,
                specialty: 'Clínica Médica',
                modulo: 'Pneumologia',
                priority: 'alta',
                priorityScore: 98,
                whyNow: 'Base teórica para resolução de questões de alta incidência nas bancas USP e ENARE.',
                whyDetails: {
                  incidence: 'Incidência de 94/100 (USP: 10q, UNIFESP: 8q, ENARE: 9q)',
                  examScore: 'Videoaula + Leitura de apoio',
                  domainScore: 'Domínio teórico inicial: 72%',
                  targetScore: 'Meta: ≥ 85%',
                  fsrsStatus: 'Início de ciclo teórico',
                  postExercisesCompleted: 'Pré-requisito para pós-exercícios',
                },
                recommendedDay: 'segunda',
                currentDay: 'segunda',
              })
            }
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>▶</span>
            <span>Iniciar</span>
          </button>
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

      {/* 3.1 DIAGNÓSTICO COMPARATIVO DE PRIORIZAÇÃO (CÉREBRO 2) */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h3 className="text-base font-extrabold text-on-surface">
              Diagnóstico Comparativo de Priorização (Cérebro 2)
            </h3>
          </div>
        </div>

        {/* Matriz Comparativa de Casos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Caso 1: DPOC */}
          <div className="p-4 rounded-xl bg-surface-container-low/50 border-2 border-rose-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-on-surface">1️⃣ DPOC</span>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-surface-container text-secondary">
                  Pneumologia
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                Score: 96 • Urgente 🔴
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-[0.6875rem]">
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Domínio C1</span>
                <span className="font-bold text-on-surface">72%</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-rose-100">
                <span className="text-rose-700 font-bold block text-[0.5625rem]">Aplicação</span>
                <span className="font-bold text-rose-700">65% ⚠️</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Incidência</span>
                <span className="font-bold text-primary">94/100</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">FSRS</span>
                <span className="font-bold text-amber-700">-2 dias</span>
              </div>
            </div>

            {/* Decisão do Cérebro 2 com ferramenta de setinha */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleDecision('dpoc')}
                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-on-surface font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {expandedDecisions['dpoc'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
                <span>Decisão do Cérebro 2</span>
              </button>
              {expandedDecisions['dpoc'] && (
                <p className="text-[0.75rem] text-secondary leading-relaxed pl-3.5 border-l-2 border-primary/30 mt-1 animate-in fade-in">
                  1º da fila hoje (40 min). Gargalo crítico em questões de prova das bancas-alvo somado a revisão atrasada gera risco iminente de perda de pontos.
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => handleOpenDossier('c-dpoc', 'DPOC')}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all border border-surface-container"
              >
                <span className="material-symbols-outlined text-sm text-primary">description</span>
                <span>Ver dossiê: DPOC</span>
              </button>
            </div>
          </div>

          {/* Caso 2: ICC */}
          <div className="p-4 rounded-xl bg-surface-container-low/50 border-2 border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-on-surface">2️⃣ ICC</span>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-surface-container text-secondary">
                  Cardiologia
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                Score: 86 • Alta 🟠
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-[0.6875rem]">
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Domínio C1</span>
                <span className="font-bold text-on-surface">83%</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Aplicação</span>
                <span className="font-bold text-on-surface">74%</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Incidência</span>
                <span className="font-bold text-primary">92/100</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">FSRS</span>
                <span className="font-bold text-emerald-700">Hoje</span>
              </div>
            </div>

            {/* Decisão do Cérebro 2 com ferramenta de setinha */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleDecision('icc')}
                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-on-surface font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {expandedDecisions['icc'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
                <span>Decisão do Cérebro 2</span>
              </button>
              {expandedDecisions['icc'] && (
                <p className="text-[0.75rem] text-secondary leading-relaxed pl-3.5 border-l-2 border-primary/30 mt-1 animate-in fade-in">
                  2º da fila hoje (30 min). Conteúdo de incidência massiva em São Paulo. Foco em consolidar Stevenson B vs C e fechar os 85%.
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => handleOpenDossier('c-icc', 'ICC')}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all border border-surface-container"
              >
                <span className="material-symbols-outlined text-sm text-primary">description</span>
                <span>Ver dossiê: ICC</span>
              </button>
            </div>
          </div>

          {/* Caso 3: Doença X (Conteúdo Raro) */}
          <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-on-surface">3️⃣ Doença X</span>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-surface-container text-secondary">
                  Conteúdo Raro
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-extrabold bg-surface-container text-on-surface border border-surface-container-high">
                Score: 50 • Média 🟡
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-[0.6875rem]">
              <div className="bg-white/70 p-1.5 rounded-lg border border-amber-200">
                <span className="text-amber-800 font-bold block text-[0.5625rem]">Domínio C1</span>
                <span className="font-bold text-amber-800">65% (Menor)</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Aplicação</span>
                <span className="font-bold text-on-surface">60%</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Incidência</span>
                <span className="font-bold text-secondary">20/100 (Rara)</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">FSRS</span>
                <span className="font-bold text-emerald-700">Em dia</span>
              </div>
            </div>

            {/* Decisão do Cérebro 2 com ferramenta de setinha */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleDecision('doenca-x')}
                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-on-surface font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {expandedDecisions['doenca-x'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
                <span>Decisão do Cérebro 2</span>
              </button>
              {expandedDecisions['doenca-x'] && (
                <p className="text-[0.75rem] text-secondary leading-relaxed pl-3.5 border-l-2 border-primary/30 mt-1 animate-in fade-in">
                  Não entra no bloco de hoje. Embora tenha a menor nota isolada (65%), sua raridade nas bancas (incidência 20) daria retorno quase nulo na nota final da prova.
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => handleOpenDossier('c-doenca-x', 'Doença X')}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all border border-surface-container"
              >
                <span className="material-symbols-outlined text-sm text-primary">description</span>
                <span>Ver dossiê: Doença X</span>
              </button>
            </div>
          </div>

          {/* Caso 4: IAM */}
          <div className="p-4 rounded-xl bg-surface-container-low/50 border border-surface-container space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-on-surface">4️⃣ IAM</span>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-surface-container text-secondary">
                  Cardiologia
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Score: 30 • Baixa 🟢
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-[0.6875rem]">
              <div className="bg-white/70 p-1.5 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 font-bold block text-[0.5625rem]">Domínio C1</span>
                <span className="font-bold text-emerald-800">89% (≥85%)</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Aplicação</span>
                <span className="font-bold text-on-surface">89%</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">Incidência</span>
                <span className="font-bold text-primary">90/100</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-lg border border-surface-container">
                <span className="text-secondary block text-[0.5625rem]">FSRS</span>
                <span className="font-bold text-emerald-700">Em dia (32d)</span>
              </div>
            </div>

            {/* Decisão do Cérebro 2 com ferramenta de setinha */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toggleDecision('iam')}
                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-on-surface font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {expandedDecisions['iam'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
                <span>Decisão do Cérebro 2</span>
              </button>
              {expandedDecisions['iam'] && (
                <p className="text-[0.75rem] text-secondary leading-relaxed pl-3.5 border-l-2 border-primary/30 mt-1 animate-in fade-in">
                  Manutenção periódica. O domínio já ultrapassou a meta de 85% e a estabilidade de retenção é alta. Investir tempo agora teria retorno decrescente.
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => handleOpenDossier('c-iam', 'IAM')}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all border border-surface-container"
              >
                <span className="material-symbols-outlined text-sm text-primary">description</span>
                <span>Ver dossiê: IAM</span>
              </button>
            </div>
          </div>
        </div>
      </section>

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
                1h30 planejadas • {completedMinutes > 0 ? `${completedMinutes} min realizadas` : 'Em andamento'}
              </div>
              <div className="text-xs text-secondary mt-0.5">
                {completedMinutes >= 80 ? (
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
            <span className="text-[0.6875rem] text-secondary block">Conteúdos estudados</span>
            <div className="font-code-metric text-lg font-bold text-on-surface mt-0.5">
              124 <span className="text-xs text-secondary font-normal">/ 680 (18,2%)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
            <span className="text-[0.6875rem] text-secondary block">Domínio ≥85% (Consolidados)</span>
            <div className="font-code-metric text-lg font-bold text-emerald-700 mt-0.5">
              58 <span className="text-xs text-secondary font-normal">/ 680 (8,5%)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
            <span className="text-[0.6875rem] text-secondary block">Revisões FSRS em dia</span>
            <div className="font-code-metric text-lg font-bold text-primary mt-0.5">
              82% <span className="text-xs text-secondary font-normal">(Retenção ativa)</span>
            </div>
          </div>
        </div>
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
                  {selectedWhyActivity.id === 'act-dpoc' ? '78%' : selectedWhyActivity.id === 'act-icc' ? '83%' : '83%'}
                </span>
              </div>
              <div className="h-6 w-px bg-surface-container" />
              <div>
                <span className="text-[0.625rem] uppercase font-bold text-secondary block">Aplicação</span>
                <span className="font-code-metric text-sm font-black text-amber-700">
                  {selectedWhyActivity.id === 'act-dpoc' ? '71%' : selectedWhyActivity.id === 'act-icc' ? '74%' : '74%'}
                </span>
              </div>
              <div className="h-6 w-px bg-surface-container" />
              <div>
                <span className="text-[0.625rem] uppercase font-bold text-secondary block">Retenção (FSRS)</span>
                <span className="font-code-metric text-sm font-black text-emerald-700">
                  {selectedWhyActivity.id === 'act-dpoc' ? '84%' : selectedWhyActivity.id === 'act-icc' ? '88%' : '82%'}
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
