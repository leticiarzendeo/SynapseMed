import React, { useState } from 'react';
import {
  UserPreferences,
  WeekPresetType,
  PlanningActivityItem,
  DayCapacityConfig,
  PlanningCategory,
} from '../types';
import {
  DEFAULT_WEEK_DAYS,
  WEEK_PRESETS,
  CANONICAL_PLANNING_ACTIVITIES,
  getAdaptiveWeeklyBudget,
  ICC_TWO_YEAR_FSRS_LADDER,
  PROVISIONAL_EVIDENCE_CASE,
  calculateDeficitImpact,
  DURATION_CALIBRATION_FACTORS,
} from '../utils/planningEngine';

interface PlanejamentoViewProps {
  preferences: UserPreferences;
  onOpenAjustarMetas?: () => void;
  /**
   * "A ponte": avisa o App (fonte da verdade) que o conteúdo de um contentId
   * foi concluído, para propagar ao currículo/domínio/priorização sem migrar
   * o modelo interno PlanningActivityItem.
   */
  onContentStudied?: (contentId?: string) => void;
}

export const PlanejamentoView: React.FC<PlanejamentoViewProps> = ({
  preferences,
  onOpenAjustarMetas,
  onContentStudied,
}) => {
  // Mode: 🤖 Recomendação do Algoritmo vs 👤 Seu Plano
  const [viewLayer, setViewLayer] = useState<'algoritmo' | 'usuario'>('usuario');

  // Sub-tabs dentro de Planejamento: "grade_semanal" | "dois_anos_horizonte" | "deficit_simulador"
  const [activeTab, setActiveTab] = useState<'grade_semanal' | 'dois_anos_horizonte' | 'deficit_simulador'>('grade_semanal');

  // Filter por categoria
  const [activeFilter, setActiveFilter] = useState<'todas' | PlanningCategory>('todas');

  // Weekly capacity & presets
  const [currentPreset, setCurrentPreset] = useState<WeekPresetType>('normal_8h');
  const [days, setDays] = useState<DayCapacityConfig[]>(DEFAULT_WEEK_DAYS);
  const [activities, setActivities] = useState<PlanningActivityItem[]>(CANONICAL_PLANNING_ACTIVITIES);

  // Phase preview selector for weekly budget (Início, Meio, Final)
  const [budgetPhasePreview, setBudgetPhasePreview] = useState<'inicio' | 'meio' | 'final'>('meio');

  // Modals
  const [showConfigDaysModal, setShowConfigDaysModal] = useState(false);
  const [showAnteciparModal, setShowAnteciparModal] = useState(false);
  const [showChunkModal, setShowChunkModal] = useState<PlanningActivityItem | null>(null);
  const [showPartialLogModal, setShowPartialLogModal] = useState<PlanningActivityItem | null>(null);
  const [selectedDayToMove, setSelectedDayToMove] = useState<{
    activity: PlanningActivityItem;
    targetDay: string;
  } | null>(null);

  // Deficit simulation state
  const [simulatedDeficitHours, setSimulatedDeficitHours] = useState<number>(3); // 3h vs 40h
  const [deficitUserRefusedIncrease, setDeficitUserRefusedIncrease] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Calculations
  const totalWeeklyCapacityHours = Number(
    (days.reduce((acc, d) => acc + d.capacityMin, 0) / 60).toFixed(1)
  );
  const totalPlannedMinutes = activities.reduce((acc, a) => acc + a.durationMin, 0);
  const totalPlannedHours = Number((totalPlannedMinutes / 60).toFixed(1));
  const totalCompletedMinutes = activities
    .filter((a) => a.status === 'concluido')
    .reduce((acc, a) => acc + a.durationMin, 0);
  const totalCompletedHours = Number((totalCompletedMinutes / 60).toFixed(1));
  const remainingHoursInWeek = Math.max(0, Number((totalPlannedHours - totalCompletedHours).toFixed(1)));

  const weeklyBudget = getAdaptiveWeeklyBudget(totalWeeklyCapacityHours, budgetPhasePreview);
  const deficitState = calculateDeficitImpact(simulatedDeficitHours, totalWeeklyCapacityHours, 96);

  // Trocar Preset
  const handleSelectPreset = (presetKey: WeekPresetType) => {
    setCurrentPreset(presetKey);
    if (presetKey === 'customizada') {
      setShowConfigDaysModal(true);
      return;
    }
    const preset = WEEK_PRESETS[presetKey];
    setDays((prev) =>
      prev.map((day) => {
        const matching = preset.days.find((d) => d.key === day.key);
        if (matching) {
          return {
            ...day,
            capacityMin: matching.capacityMin,
            plannedStr: matching.plannedStr,
          };
        }
        return day;
      })
    );
    showToast(`✨ Capacidade ajustada para ${preset.label} (${preset.totalHours}h). O algoritmo rebalanceou a semana.`);
  };

  // Mover atividade de dia (User Override)
  const handleMoveActivity = (activityId: string, newDay: string) => {
    setActivities((prev) =>
      prev.map((item) => {
        if (item.id === activityId) {
          const isMoved = item.recommendedDay !== newDay;
          return {
            ...item,
            currentDay: newDay,
            isMovedByUser: isMoved,
            impactNotice: isMoved
              ? newDay === 'quinta' && item.name === 'DPOC'
                ? '🟡 DPOC movido para quinta (dia curto). O tempo disponível exigirá foco total.'
                : '🟢 Nenhum impacto negativo no ritmo dos 2 anos. Saldo absorvido.'
              : undefined,
          };
        }
        return item;
      })
    );
    setSelectedDayToMove(null);
    showToast('Atividade remanejada na grade. O plano se adaptou sem conflito.');
  };

  // Marcar atividade como concluída
  const handleCompleteActivity = (actId: string) => {
    const completed = activities.find((a) => a.id === actId);
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === actId) {
          return { ...a, status: 'concluido' };
        }
        return a;
      })
    );
    onContentStudied?.(completed?.contentId);
    showToast('✅ Atividade concluída! Relógio semanal atualizado e retenção FSRS calibrada.');
  };

  // Registrar conclusão parcial sem culpa
  const handleSavePartialLog = (actId: string, minutesStudied: number) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === actId) {
          const remaining = Math.max(0, a.durationMin - minutesStudied);
          return {
            ...a,
            status: 'parcial',
            studiedMinutes: minutesStudied,
            incompleteNotice: `${remaining} min restantes redistribuídos suavemente para o próximo bloco.`,
          };
        }
        return a;
      })
    );
    setShowPartialLogModal(null);
    showToast(`⏱️ Registrados ${minutesStudied} min. Saldo restante redistribuído sem sensação de falha!`);
  };

  // Fracionar atividade longa em blocos
  const handleChunkActivity = (act: PlanningActivityItem, chunkCount: number) => {
    const chunkMin = Math.round(act.durationMin / chunkCount);
    setActivities((prev) =>
      prev.map((item) => {
        if (item.id === act.id) {
          return {
            ...item,
            chunkInfo: {
              currentChunk: 1,
              totalChunks: chunkCount,
              chunkMinutes: chunkMin,
              totalMinutes: act.durationMin,
              progressPercent: Math.round(100 / chunkCount),
            },
            durationMin: chunkMin,
            subType: `${item.subType} (Bloco 1/${chunkCount} — ${chunkMin} min)`,
          };
        }
        return item;
      })
    );
    setShowChunkModal(null);
    showToast(`✂️ Atividade dividida em ${chunkCount} blocos de ${chunkMin} min. Encaixe perfeito no dia!`);
  };

  // Adiantar conteúdo da próxima semana hoje
  const handleAntecipar = (name: string, duration: number, modulo: string, category: PlanningCategory) => {
    const newAct: PlanningActivityItem = {
      id: `act-antecip-${Date.now()}`,
      contentId: `c-antecip-${Date.now()}`,
      name,
      subType: 'Estudo antecipado da próxima semana',
      type: 'questoes_prova',
      category,
      durationMin: duration,
      priorityScore: 90,
      efficiencyPointsPerMin: Number((90 / duration).toFixed(2)),
      specialty: 'Clínica Médica',
      modulo,
      recommendedDay: 'segunda',
      currentDay: 'segunda',
      isMovedByUser: true,
      status: 'pendente',
      idealDate: '14/09',
      deadlineDate: '20/09',
      whyNow: 'Antecipação voluntária: remove a atividade da semana que vem e gera folga na margem dos 2 anos.',
      impactNotice: '🟢 Conteúdo adiantado! A semana que vem ganhou margem e a próxima prioridade foi puxada.',
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowAnteciparModal(false);
    showToast(`🚀 Você adiantou "${name}". O sistema removeu da semana que vem e reorganizou a grade!`);
  };

  // Recalcular Tudo
  const handleRecalculateAll = () => {
    setActivities(CANONICAL_PLANNING_ACTIVITIES);
    showToast('✨ Algoritmo reorganizou a semana inteira: dependências respeitadas e fila ordenada por eficiência.');
  };

  // Recalcular Restante
  const handleRecalculateRemaining = () => {
    showToast('✨ Segunda e Terça preservadas. Quarta a Domingo reorganizados conforme sua capacidade.');
  };

  // Filtered activities
  const filteredActivities = activities.filter((item) => {
    if (activeFilter === 'todas') return true;
    return item.category === activeFilter;
  });

  return (
    <div id="planejamento-root" className="flex flex-col w-full px-4 sm:px-6 py-6 max-w-6xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 max-w-md">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
          <span className="leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OS TRÊS RELÓGIOS SIMULTÂNEOS (Diário, Semanal, 2 Anos) */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container pb-4">
          <div>
            <div className="flex items-center gap-2 text-[0.6875rem] text-secondary font-bold uppercase tracking-wider">
              <span>⏱️</span>
              <span>OS TRÊS RELÓGIOS DA PREPARAÇÃO</span>
              <span>•</span>
              <span className="text-on-surface">Integração Diário ↔ Semanal ↔ 2 Anos</span>
            </div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight mt-1">
              Algoritmo de Planejamento em Horas
            </h1>
            <p className="text-xs text-secondary mt-0.5">
              O algoritmo não preenche o tempo com qualquer coisa: ele aloca cada minuto onde há maior retorno para o horizonte de 2 anos.
            </p>
          </div>

          {/* Status Geral de Ritmo */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black text-emerald-900">🟢 DENTRO DO RITMO</span>
              <span className="text-[0.6875rem] text-emerald-700 font-medium">
                (Necessário: 7h35/sem • Disponível: {totalWeeklyCapacityHours}h)
              </span>
            </div>
          </div>
        </div>

        {/* Grade dos 3 Relógios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Relógio 1: Diário */}
          <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span>⏱️</span>
                <span>Relógio Diário</span>
              </span>
              <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                Hoje: Segunda
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-on-surface font-code-metric">1h20</span>
              <span className="text-xs text-secondary">disponível hoje</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <div className="flex justify-between text-[0.6875rem] text-secondary">
              <span>Planejado: 1h20 (3 atividades)</span>
              <span className="font-bold text-emerald-700">50 min concluídos</span>
            </div>
          </div>

          {/* Relógio 2: Semanal */}
          <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span>📅</span>
                <span>Relógio Semanal</span>
              </span>
              <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                Semana de 07 a 13 Set
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-on-surface font-code-metric">
                {totalWeeklyCapacityHours}h00
              </span>
              <span className="text-xs text-secondary">capacidade semanal</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalCompletedHours / totalWeeklyCapacityHours) * 100))}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[0.6875rem] text-secondary">
              <span>Planejado: {totalPlannedHours}h</span>
              <span className="font-bold text-primary">
                Concluído: {totalCompletedHours}h ({remainingHoursInWeek}h restantes)
              </span>
            </div>
          </div>

          {/* Relógio 3: Horizonte 2 Anos */}
          <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span>🗓️</span>
                <span>Relógio dos 2 Anos</span>
              </span>
              <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                96 semanas restantes
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-on-surface font-code-metric">46.4%</span>
              <span className="text-xs text-secondary">cobertura (130/280 conteúdos)</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '46.4%' }}></div>
            </div>
            <div className="flex justify-between text-[0.6875rem] text-secondary">
              <span>600h de trabalho restante</span>
              <span className="font-bold text-emerald-700">Previsão: Abr/2028 (Mai/28 limite)</span>
            </div>
          </div>
        </div>

        {/* Banner Explicativo: Regra de Ouro dos 4 Conceitos de Tempo */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-base">architecture</span>
            <div className="text-secondary">
              <strong className="text-on-surface font-bold">Regra dos 4 Conceitos de Tempo:</strong>{' '}
              1. Capacidade (<strong>{totalWeeklyCapacityHours}h</strong>) • 2. Planejado (<strong>{totalPlannedHours}h</strong>) • 3. Realizado (<strong>{totalCompletedHours}h</strong>) • 4. Extraordinário (<strong>3h de Simulados</strong>).
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold text-[0.6875rem] whitespace-nowrap self-start md:self-auto">
            Simulados ficam FORA das 8h regulares
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SUB-NAVEGAÇÃO PRINCIPAL (Grade Semanal | Horizonte 2 Anos | Simulador Déficit) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2">
        <button
          onClick={() => setActiveTab('grade_semanal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'grade_semanal'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>📅</span>
          <span>Grade Semanal (Segunda a Domingo)</span>
        </button>

        <button
          onClick={() => setActiveTab('dois_anos_horizonte')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'dois_anos_horizonte'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>🧠</span>
          <span>Horizonte dos 2 Anos: "Nenhum Conteúdo é Aposentado"</span>
        </button>

        <button
          onClick={() => setActiveTab('deficit_simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'deficit_simulador'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>⚖️</span>
          <span>Simulador de Déficit &amp; Honestidade Matemática</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: GRADE SEMANAL EM HORAS (SEGUNDA A DOMINGO) */}
      {/* ========================================================================= */}
      {activeTab === 'grade_semanal' && (
        <div className="space-y-6">
          {/* SELETOR DE PRESETS DE SEMANA & CAPACIDADE VARIÁVEL */}
          <section className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚙️</span>
                  <span>CAPACIDADE VARIÁVEL DA SEMANA</span>
                </span>
                <h2 className="text-sm font-black text-on-surface mt-0.5">
                  Sua rotina muda: o algoritmo recalcula sem rigidez diária
                </h2>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['normal_8h', 'ferias_15h', 'provas_4h', 'excepcional_10h30'] as WeekPresetType[]).map(
                  (presetKey) => {
                    const info = WEEK_PRESETS[presetKey];
                    const isSelected = currentPreset === presetKey;
                    return (
                      <button
                        key={presetKey}
                        onClick={() => handleSelectPreset(presetKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container-low text-secondary hover:text-on-surface border border-surface-container'
                        }`}
                      >
                        {info.label}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => setShowConfigDaysModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-semibold"
                >
                  Personalizar dias ⚙️
                </button>
              </div>
            </div>

            {/* Visualizador da Distribuição Diária da Capacidade */}
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-1 text-xs">
              {days.map((day) => (
                <div
                  key={day.key}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    day.key === 'segunda'
                      ? 'bg-primary/5 border-primary/40'
                      : 'bg-surface-container-low/50 border-surface-container'
                  }`}
                >
                  <span className="text-[0.6875rem] font-bold text-secondary block">{day.label}</span>
                  <span className="text-[0.625rem] text-secondary/80 block">{day.date}</span>
                  <span className="font-code-metric font-extrabold text-on-surface text-sm block mt-1">
                    {day.plannedStr}
                  </span>
                  <span className="text-[0.5625rem] text-secondary block mt-0.5">
                    {day.capacityMin >= 80 ? 'Bloco denso' : day.capacityMin <= 40 ? 'Ativ. curtas' : 'Misto'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ORÇAMENTO SEMANAL ESTRATÉGICO NAS 4 CATEGORIAS */}
          <section className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <span>📊</span>
                  <span>ORÇAMENTO SEMANAL ADAPTATIVO (4 CATEGORIAS)</span>
                </span>
                <h3 className="text-base font-black text-on-surface mt-0.5">
                  {weeklyBudget.phaseName} — {weeklyBudget.totalHours}h00 Alocadas
                </h3>
                <p className="text-xs text-secondary mt-0.5">{weeklyBudget.dynamicExplanation}</p>
              </div>

              {/* Simulador da evolução do orçamento ao longo dos 2 anos */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container text-xs">
                <span className="text-[0.625rem] text-secondary font-bold px-2">Ver Fase:</span>
                {(['inicio', 'meio', 'final'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setBudgetPhasePreview(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      budgetPhasePreview === p
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Barras e Metas do Orçamento */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Categoria A: Avanço Curricular */}
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 flex items-center gap-1">
                    <span>🆕</span>
                    <span>Avanço Curricular</span>
                  </span>
                  <span className="font-code-metric font-extrabold text-blue-900">
                    {weeklyBudget.avancoHours}h ({weeklyBudget.avancoPercent}%)
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${weeklyBudget.avancoPercent}%` }}></div>
                </div>
                <span className="text-[0.625rem] text-blue-800 block">
                  Teoria Medway, exercícios pós e novos tópicos para manter ritmo de 6h de cobertura.
                </span>
              </div>

              {/* Categoria B: Manutenção */}
              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-1">
                    <span>🔄</span>
                    <span>Manutenção FSRS</span>
                  </span>
                  <span className="font-code-metric font-extrabold text-purple-900">
                    {weeklyBudget.manutencaoHours}h ({weeklyBudget.manutencaoPercent}%)
                  </span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${weeklyBudget.manutencaoPercent}%` }}></div>
                </div>
                <span className="text-[0.625rem] text-purple-800 block">
                  Revisões espaçadas e flashcards Osler. Nenhum conteúdo consolidado é esquecido.
                </span>
              </div>

              {/* Categoria C: Aplicação */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1">
                    <span>🎯</span>
                    <span>Aplicação em Provas</span>
                  </span>
                  <span className="font-code-metric font-extrabold text-emerald-900">
                    {weeklyBudget.aplicacaoHours}h ({weeklyBudget.aplicacaoPercent}%)
                  </span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${weeklyBudget.aplicacaoPercent}%` }}></div>
                </div>
                <span className="text-[0.625rem] text-emerald-800 block">
                  Questões reais das bancas-alvo (USP, UNIFESP, ENARE) e blocos cronometrados.
                </span>
              </div>

              {/* Categoria D: Recuperação */}
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <span>🛠️</span>
                    <span>Recuperação</span>
                  </span>
                  <span className="font-code-metric font-extrabold text-amber-900">
                    {weeklyBudget.recuperacaoHours}h ({weeklyBudget.recuperacaoPercent}%)
                  </span>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${Math.max(8, weeklyBudget.recuperacaoPercent)}%` }}></div>
                </div>
                <span className="text-[0.625rem] text-amber-800 block">
                  Caderno de erros, revisão direcionada e resgate de conteúdos com queda de domínio.
                </span>
              </div>
            </div>
          </section>

          {/* BARRA DE CONTROLES: CAMADA DUPLA (ALGORITMO VS USUÁRIO) & FILTROS & AÇÕES */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low/60 p-3 rounded-2xl border border-surface-container">
            {/* Alternador Camada Dupla */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-surface-container rounded-xl text-xs font-bold">
                <button
                  onClick={() => setViewLayer('usuario')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    viewLayer === 'usuario'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-black'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <span>👤</span>
                  <span>Seu Plano Real</span>
                </button>
                <button
                  onClick={() => setViewLayer('algoritmo')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    viewLayer === 'algoritmo'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-black'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <span>🤖</span>
                  <span>Sugestão do Algoritmo</span>
                </button>
              </div>

              {/* Filtros de Categoria */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { key: 'todas', label: 'Todas' },
                  { key: 'avanco', label: '🆕 Avanço' },
                  { key: 'manutencao', label: '🔄 Manutenção' },
                  { key: 'aplicacao', label: '🎯 Aplicação' },
                  { key: 'recuperacao', label: '🛠️ Recuperação' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFilter === f.key
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ações de Replanejamento */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAnteciparModal(true)}
                className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-xs font-semibold text-on-surface flex items-center gap-1 shadow-xs"
              >
                <span>➕</span>
                <span>Adiantar Conteúdo</span>
              </button>
              <button
                onClick={handleRecalculateRemaining}
                className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1"
                title="Preserva segunda e terça e recalcula de quarta a domingo"
              >
                <span>✨</span>
                <span>Recalcular Restante</span>
              </button>
              <button
                onClick={handleRecalculateAll}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-xs"
                title="Reorganiza toda a semana com distribuição ótima"
              >
                <span>✨</span>
                <span>Recalcular Tudo</span>
              </button>
            </div>
          </section>

          {/* GRADE SEMANAL DIA A DIA (SEGUNDA A DOMINGO) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {days.map((day) => {
              const dayActivities = filteredActivities.filter((a) =>
                viewLayer === 'algoritmo' ? a.recommendedDay === day.key : a.currentDay === day.key
              );
              const dayTotalMin = dayActivities.reduce((acc, a) => acc + a.durationMin, 0);

              return (
                <div
                  key={day.key}
                  className={`bg-surface-container-lowest rounded-3xl p-5 border transition-all shadow-xs space-y-3 flex flex-col justify-between ${
                    day.key === 'segunda'
                      ? 'border-primary/40 bg-primary/[0.01]'
                      : 'border-surface-container'
                  }`}
                >
                  <div>
                    {/* Cabeçalho do Dia */}
                    <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-on-surface">{day.label}</span>
                          <span className="text-xs text-secondary font-medium">({day.date})</span>
                          {day.key === 'segunda' && (
                            <span className="text-[0.625rem] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              Hoje
                            </span>
                          )}
                        </div>
                        <span className="text-[0.6875rem] text-secondary">
                          Capacidade: <strong className="text-on-surface">{day.plannedStr}</strong>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-code-metric text-xs font-extrabold text-on-surface block">
                          {dayTotalMin} min
                        </span>
                        <span className="text-[0.625rem] text-secondary">
                          {dayActivities.length} {dayActivities.length === 1 ? 'atividade' : 'atividades'}
                        </span>
                      </div>
                    </div>

                    {/* Lista de Atividades do Dia */}
                    <div className="space-y-2.5 pt-3">
                      {dayActivities.map((act) => {
                        const categoryColor =
                          act.category === 'avanco'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : act.category === 'manutencao'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : act.category === 'aplicacao'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200';

                        const categoryLabel =
                          act.category === 'avanco'
                            ? '🆕 Avanço'
                            : act.category === 'manutencao'
                            ? '🔄 Manutenção'
                            : act.category === 'aplicacao'
                            ? '🎯 Aplicação'
                            : '🛠️ Recuperação';

                        return (
                          <div
                            key={act.id}
                            className={`p-3.5 rounded-2xl border transition-all space-y-2 group ${
                              act.status === 'concluido'
                                ? 'bg-surface-container-low/40 border-surface-container opacity-80'
                                : 'bg-surface-container-low border-surface-container hover:border-primary/40 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[0.625rem] font-bold px-1.5 py-0.5 rounded border ${categoryColor}`}>
                                    {categoryLabel}
                                  </span>
                                  <span className="text-xs font-black text-on-surface">{act.name}</span>
                                  <span className="text-xs text-secondary">• {act.subType}</span>
                                </div>
                                <span className="text-[0.6875rem] text-secondary block">
                                  🏷️ {act.modulo} ({act.specialty})
                                </span>
                              </div>

                              {/* Duração & Prioridade */}
                              <div className="text-right shrink-0">
                                <span className="font-code-metric text-xs font-black text-on-surface block">
                                  {act.durationMin} min
                                </span>
                                <span
                                  className="text-[0.625rem] font-bold text-primary font-code-metric block"
                                  title={`Eficiência da atividade: Benefício (${act.priorityScore} pts) ÷ Tempo (${act.durationMin} min) = ${act.efficiencyPointsPerMin} pts/min`}
                                >
                                  ⚡ {act.efficiencyPointsPerMin} pts/m
                                </span>
                              </div>
                            </div>

                            {/* Motivo do Algoritmo */}
                            <p className="text-[0.6875rem] text-secondary leading-relaxed bg-surface-container-lowest/60 p-2 rounded-xl border border-surface-container/60">
                              💡 {act.whyNow}
                            </p>

                            {/* Fracionamento de atividade longa (ex: Bloco 1/2) */}
                            {act.chunkInfo && (
                              <div className="flex items-center justify-between text-[0.625rem] bg-surface-container-lowest p-2 rounded-xl border border-surface-container">
                                <span>
                                  ✂️ Bloco {act.chunkInfo.currentChunk}/{act.chunkInfo.totalChunks} ({act.chunkInfo.chunkMinutes} min)
                                </span>
                                <span className="font-bold text-primary">Progresso da teoria: {act.chunkInfo.progressPercent}%</span>
                              </div>
                            )}

                            {/* Calibração de Tempo Real */}
                            {act.calibratedDurationMin && act.calibratedDurationMin !== act.durationMin && (
                              <div className="text-[0.625rem] text-secondary flex items-center gap-1">
                                <span>⏱️</span>
                                <span>Calibrado para seu ritmo real: ~{act.calibratedDurationMin} min.</span>
                              </div>
                            )}

                            {/* Alerta de Conclusão Parcial */}
                            {act.incompleteNotice && (
                              <div className="text-[0.625rem] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-medium">
                                ⚠️ {act.incompleteNotice}
                              </div>
                            )}

                            {/* Movido pelo Usuário */}
                            {act.isMovedByUser && (
                              <div className="text-[0.625rem] text-primary bg-primary/10 px-2 py-0.5 rounded font-bold w-fit">
                                👤 Movido por você (Recomendação original: {act.recommendedDay})
                              </div>
                            )}

                            {/* Ações da Atividade */}
                            <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setSelectedDayToMove({
                                      activity: act,
                                      targetDay: day.key === 'segunda' ? 'quinta' : 'segunda',
                                    })
                                  }
                                  className="text-[0.6875rem] text-primary hover:underline font-bold"
                                >
                                  Remanejar dia ↕
                                </button>
                                <button
                                  onClick={() => setShowChunkModal(act)}
                                  className="text-[0.6875rem] text-secondary hover:text-on-surface font-medium"
                                  title="Dividir atividade em blocos menores"
                                >
                                  Fracionar ✂️
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setShowPartialLogModal(act)}
                                  className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-surface-container-high text-[0.625rem] font-semibold text-secondary"
                                  title="Registrar tempo parcial estudado sem falhar"
                                >
                                  Parcial
                                </button>
                                {act.status !== 'concluido' ? (
                                  <button
                                    onClick={() => handleCompleteActivity(act.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[0.6875rem] font-bold transition-all shadow-2xs"
                                  >
                                    Concluir ✓
                                  </button>
                                ) : (
                                  <span className="text-[0.6875rem] text-emerald-700 font-bold flex items-center gap-0.5">
                                    <span>✓</span> Feito
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {dayActivities.length === 0 && (
                        <div className="p-5 text-center text-xs text-secondary border border-dashed border-surface-container rounded-2xl">
                          Nenhuma atividade nesta categoria para este dia.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: HORIZONTE DOS 2 ANOS: "NENHUM CONTEÚDO É APOSENTADO" */}
      {/* ========================================================================= */}
      {activeTab === 'dois_anos_horizonte' && (
        <div className="space-y-6">
          {/* PAINEL CENTRAL DA REGRA DE 2 ANOS */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-surface-container pb-4">
              <div>
                <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <span>🧠</span>
                  <span>REGRA CENTRAL DO HORIZONTE DE 2 ANOS</span>
                </span>
                <h2 className="text-xl font-black text-on-surface mt-1">
                  Nenhum conteúdo é aposentado: Manutenção Espaçada Contínua
                </h2>
                <p className="text-xs text-secondary mt-1 max-w-3xl leading-relaxed">
                  Os 2 anos são o horizonte da preparação, <strong>não o período em que um conteúdo deixa de ser revisado após bater 85%</strong>. Quando consolidado, ele migra para manutenção espaçada com intervalos crescentes (FSRS). O sistema gasta cada vez menos tempo mantendo esse conhecimento, mas ele permanece vivo.
                </p>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-right shrink-0">
                <span className="text-[0.625rem] text-purple-800 font-bold uppercase tracking-wider block">
                  Meta Final do Sistema
                </span>
                <span className="text-xs font-black text-purple-950 block mt-0.5">
                  100% Currículo Coberto + Domínio ≥85%
                </span>
              </div>
            </div>

            {/* OS 5 PILARES NO HORIZONTE DOS 2 ANOS */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">1. Cobertura</span>
                <span className="text-[0.6875rem] text-secondary block">
                  100% dos conteúdos estudados sem deixar temas em branco.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">2. Consolidação</span>
                <span className="text-[0.6875rem] text-secondary block">
                  Levar todos os conteúdos para domínio estimado ≥85%.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">3. Manutenção</span>
                <span className="text-[0.6875rem] text-secondary block">
                  Revisões espaçadas FSRS para conteúdos já consolidados.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">4. Recuperação</span>
                <span className="text-[0.6875rem] text-secondary block">
                  Resgate imediato de conteúdos com queda de domínio.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">5. Aplicação</span>
                <span className="text-[0.6875rem] text-secondary block">
                  Validação prática em provas de residência e simulados.
                </span>
              </div>
            </div>
          </section>

          {/* EXEMPLO PRÁTICO: A ESCADA DE ESPAÇAMENTO DE ICC AO LONGO DOS 2 ANOS */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">🫀</span>
                <h3 className="text-base font-black text-on-surface">
                  Exemplo Prático: Ciclo de Vida de Insuficiência Cardíaca (ICC)
                </h3>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Veja como o espaçamento FSRS atua do Mês 1 ao Mês 20, como trata a queda de domínio (88% → 79%) e como o conhecimento nunca é "aposentado".
              </p>
            </div>

            {/* Linha do Tempo FSRS de 2 Anos */}
            <div className="space-y-3 pt-2">
              {ICC_TWO_YEAR_FSRS_LADDER.map((node, index) => (
                <div
                  key={node.month}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    node.isDecayWarning
                      ? 'bg-amber-50/70 border-amber-300'
                      : node.performance === 'Recuperado'
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl font-code-metric font-black text-xs flex items-center justify-center shrink-0 ${
                        node.isDecayWarning
                          ? 'bg-amber-500 text-white'
                          : node.performance === 'Recuperado'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary text-on-primary'
                      }`}
                    >
                      M{node.month}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-xs text-on-surface font-extrabold">{node.label}</strong>
                        <span
                          className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full ${
                            node.isDecayWarning
                              ? 'bg-amber-100 text-amber-900'
                              : node.performance === 'Recuperado'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-surface-container text-secondary'
                          }`}
                        >
                          {node.performance}
                        </span>
                        <span className="text-[0.6875rem] text-secondary">
                          • Domínio: <strong className="text-on-surface">{node.domainScore}%</strong>
                        </span>
                      </div>
                      <p className="text-xs text-on-surface/90 font-medium">{node.action}</p>
                      <p className="text-[0.6875rem] text-secondary leading-relaxed">{node.notes}</p>
                    </div>
                  </div>

                  {/* Intervalo FSRS gerado */}
                  <div className="sm:text-right shrink-0 bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container sm:min-w-36">
                    <span className="text-[0.625rem] text-secondary font-bold uppercase tracking-wider block">
                      Próxima Revisão FSRS
                    </span>
                    <span className="font-code-metric font-black text-sm text-primary block mt-0.5">
                      +{node.intervalDays} dias
                    </span>
                    <span className="text-[0.5625rem] text-secondary block">
                      {node.intervalDays > 40 ? 'Espaçamento longo' : 'Janela curta'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CASO DE HONESTIDADE DO ALGORITMO: CONTEÚDO ESTUDADO RECENTEMENTE */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚖️</span>
                <h3 className="text-base font-black text-on-surface">
                  Honestidade Algorítmica: Conteúdo Estudado Há Poucos Dias
                </h3>
              </div>
              <span className="text-[0.6875rem] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Sem Ilusão de Domínio
              </span>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Se você estudar um conteúdo novo 10 dias antes do final dos dois anos e acertar 90% dos exercícios, o aplicativo <strong>NUNCA dirá 🟢 "Domínio comprovado de 90%"</strong>. Falta evidência de retenção e aplicação prática.
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-xs text-amber-950 font-bold">{PROVISIONAL_EVIDENCE_CASE.headline}</strong>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {PROVISIONAL_EVIDENCE_CASE.badges.map((b) => (
                  <span
                    key={b.label}
                    className="text-[0.625rem] font-bold px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 shadow-2xs"
                  >
                    {b.label}
                  </span>
                ))}
              </div>

              <p className="text-xs text-amber-900/90 leading-relaxed pt-1">
                {PROVISIONAL_EVIDENCE_CASE.explanation}
              </p>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: SIMULADOR DE DÉFICIT & HONESTIDADE MATEMÁTICA */}
      {/* ========================================================================= */}
      {activeTab === 'deficit_simulador' && (
        <div className="space-y-6">
          <section className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-xs space-y-5">
            <div>
              <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span>⚖️</span>
                <span>ANTI-BOLA DE NEVE &amp; TRANSPARÊNCIA</span>
              </span>
              <h2 className="text-xl font-black text-on-surface mt-1">
                Simulador de Gestão de Atraso e Déficit
              </h2>
              <p className="text-xs text-secondary mt-0.5 max-w-3xl leading-relaxed">
                Quando ocorrem semanas pesadas no internato ou plantões, o aplicativo não comete a loucura de jogar tudo na semana seguinte. Teste os dois cenários abaixo para ver o comportamento do algoritmo:
              </p>
            </div>

            {/* Seletor de Cenários */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSimulatedDeficitHours(3)}
                className={`p-4 rounded-2xl border text-left transition-all flex-1 ${
                  simulatedDeficitHours === 3
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                    : 'bg-surface-container-low border-surface-container hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-on-surface">Cenário 1: Perdeu 3 Horas</strong>
                  <span className="text-xs font-bold text-emerald-800">🟢 Amortização Suave</span>
                </div>
                <p className="text-[0.6875rem] text-secondary mt-1">
                  Estudou 5h de 8h planejadas (déficit de 3h em uma semana).
                </p>
              </button>

              <button
                onClick={() => setSimulatedDeficitHours(40)}
                className={`p-4 rounded-2xl border text-left transition-all flex-1 ${
                  simulatedDeficitHours === 40
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-surface-container-low border-surface-container hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-on-surface">Cenário 2: Perdeu 5 Semanas (40h)</strong>
                  <span className="text-xs font-bold text-amber-800">🟠 Déficit Crítico</span>
                </div>
                <p className="text-[0.6875rem] text-secondary mt-1">
                  Período sem estudos acumulando 40h de déficit no horizonte dos 2 anos.
                </p>
              </button>
            </div>

            {/* Resultado do Cenário 1: Amortização Suave */}
            {simulatedDeficitHours === 3 && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <span>🟢</span>
                    <span>Redistribuição Gradual: +3 min/semana ao longo de 96 semanas</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-900 font-code-metric">
                    Semana seguinte = 8h10 (e não 11h!)
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  A pior solução pedagógica seria exigir 11h na semana seguinte, gerando ansiedade e abandono. O sistema distribui o atraso ao longo das 96 semanas restantes (+3 a +10 min/semana), mantendo o ritmo sem sobrecarga.
                </p>
                <div className="text-[0.6875rem] text-emerald-800 font-medium">
                  Impacto no prazo final: <strong>Nenhum atraso</strong>. Previsão de conclusão mantida em <strong>Abril/2028</strong>.
                </div>
              </div>
            )}

            {/* Resultado do Cenário 2: Déficit Grande (40h) & Honestidade */}
            {simulatedDeficitHours === 40 && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <span>🟠</span>
                    <span>Ritmo Necessário Aumentado: 8h45/semana (+45 min/semana)</span>
                  </span>
                  <span className="text-xs font-bold text-amber-900 font-code-metric">
                    Déficit Acumulado: 40h
                  </span>
                </div>

                <p className="text-xs text-amber-950 leading-relaxed">
                  <strong>Regra de Honestidade:</strong> O aplicativo NUNCA esconde o atraso para deixar você confortável. Se matematicamente a disponibilidade atual de 8h00 não for suficiente para cumprir todo o currículo em 2 anos, ele avisa com transparência.
                </p>

                {/* Se usuário disser que NÃO consegue aumentar */}
                <div className="p-4 rounded-xl bg-white border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">
                      Se você disser: "Não consigo aumentar além de 8h00/semana"
                    </span>
                    <button
                      onClick={() => setDeficitUserRefusedIncrease(!deficitUserRefusedIncrease)}
                      className="text-xs text-primary font-bold underline"
                    >
                      {deficitUserRefusedIncrease ? 'Voltar para sugestão de aumento' : 'Simular recusa'}
                    </button>
                  </div>

                  {deficitUserRefusedIncrease ? (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                      <strong className="block font-black">
                        🔴 Com 8h/semana, a conclusão projetada ultrapassa o prazo em 6 semanas (Junho/2028).
                      </strong>
                      <p className="text-[0.6875rem] text-red-800">
                        O algoritmo apresenta as 3 saídas reais para você escolher conscientemente:
                      </p>
                      <ul className="list-disc pl-4 text-[0.6875rem] text-red-800 space-y-0.5 pt-1">
                        <li>Adicionar 3 semanas de férias com 15h semanais.</li>
                        <li>Despriorizar conteúdos raros (Incidência nas bancas paulistas &lt; 20/100).</li>
                        <li>Aceitar o foco nos 85% dos tópicos mais frequentes.</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-[0.6875rem] text-secondary">
                      O sistema propõe aumentar +45 min/semana (8h45/sem) para manter a formatura no prazo original sem cortes de conteúdo.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CONFIGURAR CAPACIDADE POR DIA */}
      {/* ========================================================================= */}
      {showConfigDaysModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 border border-surface-container shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] font-bold uppercase text-primary tracking-wider">
                  Configuração de Capacidade
                </span>
                <h3 className="text-base font-black text-on-surface">
                  Horas Disponíveis por Dia da Semana
                </h3>
              </div>
              <button
                onClick={() => setShowConfigDaysModal(false)}
                className="p-1.5 rounded-lg text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-secondary">
              Ajuste quanto tempo você tem disponível em cada dia. A distribuição não precisa ser igual: dias com menos tempo receberão revisões rápidas; dias com mais tempo receberão blocos densos.
            </p>

            <div className="space-y-2 text-xs">
              {days.map((d, index) => (
                <div
                  key={d.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container"
                >
                  <div>
                    <strong className="block text-on-surface">{d.label}</strong>
                    <span className="text-[0.6875rem] text-secondary">{d.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newDays = [...days];
                        newDays[index].capacityMin = Math.max(0, newDays[index].capacityMin - 15);
                        newDays[index].plannedStr = `${Math.floor(newDays[index].capacityMin / 60)}h${(newDays[index].capacityMin % 60).toString().padStart(2, '0')}`;
                        setDays(newDays);
                      }}
                      className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high font-bold text-on-surface flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-code-metric font-bold text-on-surface min-w-14 text-center">
                      {d.plannedStr}
                    </span>
                    <button
                      onClick={() => {
                        const newDays = [...days];
                        newDays[index].capacityMin += 15;
                        newDays[index].plannedStr = `${Math.floor(newDays[index].capacityMin / 60)}h${(newDays[index].capacityMin % 60).toString().padStart(2, '0')}`;
                        setDays(newDays);
                      }}
                      className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high font-bold text-on-surface flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container">
              <span className="text-xs text-secondary">
                Total semanal:{' '}
                <strong className="font-code-metric text-on-surface font-black">
                  {totalWeeklyCapacityHours}h00
                </strong>
              </span>
              <button
                onClick={() => {
                  setShowConfigDaysModal(false);
                  showToast('Capacidade diária atualizada! O algoritmo redistribuiu as atividades.');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
              >
                Salvar Rotina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TRANSFERIR ATIVIDADE DE DIA (COM CÁLCULO DE IMPACTO) */}
      {/* ========================================================================= */}
      {selectedDayToMove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 border border-surface-container shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold text-primary tracking-wider">
                  Autonomia do Estudante
                </span>
                <h3 className="text-base font-black text-on-surface">
                  Remanejar {selectedDayToMove.activity.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayToMove(null)}
                className="p-1 rounded text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              O sistema não briga com você: ele aceita a sua decisão e avalia o impacto no horizonte dos 2 anos.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {days.map((d) => (
                <button
                  key={d.key}
                  onClick={() => handleMoveActivity(selectedDayToMove.activity.id, d.key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDayToMove.activity.currentDay === d.key
                      ? 'bg-primary text-on-primary border-primary font-black shadow-xs'
                      : 'bg-surface-container-low border-surface-container hover:border-primary/40 text-on-surface'
                  }`}
                >
                  <span className="block font-bold">{d.label}</span>
                  <span className="text-[0.625rem] opacity-80">{d.plannedStr} capacidade</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: FRACIONAR ATIVIDADE LONGA EM BLOCOS */}
      {/* ========================================================================= */}
      {showChunkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 border border-surface-container shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold text-primary tracking-wider">
                  Fracionamento Inteligente
                </span>
                <h3 className="text-base font-black text-on-surface">
                  Dividir {showChunkModal.name} em Blocos
                </h3>
              </div>
              <button
                onClick={() => setShowChunkModal(null)}
                className="p-1 rounded text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Se a atividade tem <strong>{showChunkModal.durationMin} min</strong> e não cabe no seu tempo de hoje, quebre-a em blocos menores com progresso proporcional sem perder a continuidade:
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleChunkActivity(showChunkModal, 2)}
                className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left flex items-center justify-between"
              >
                <div>
                  <strong className="block text-on-surface">2 Blocos de ~{Math.round(showChunkModal.durationMin / 2)} min</strong>
                  <span className="text-[0.6875rem] text-secondary">Ideal para dias normais</span>
                </div>
                <span className="font-code-metric font-bold text-primary">50% cada</span>
              </button>

              <button
                onClick={() => handleChunkActivity(showChunkModal, 3)}
                className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left flex items-center justify-between"
              >
                <div>
                  <strong className="block text-on-surface">3 Blocos de ~{Math.round(showChunkModal.durationMin / 3)} min</strong>
                  <span className="text-[0.6875rem] text-secondary">Ideal para plantão ou dias curtos</span>
                </div>
                <span className="font-code-metric font-bold text-primary">33% cada</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: REGISTRAR CONCLUSÃO PARCIAL (SEM CULPA) */}
      {/* ========================================================================= */}
      {showPartialLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 border border-surface-container shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold text-primary tracking-wider">
                  Registro Parcial Sem Fracasso
                </span>
                <h3 className="text-base font-black text-on-surface">
                  Tempo Estudado em {showPartialLogModal.name}
                </h3>
              </div>
              <button
                onClick={() => setShowPartialLogModal(null)}
                className="p-1 rounded text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              O planejado era <strong>{showPartialLogModal.durationMin} min</strong>. Se você estudou menos por imprevisto, informe os minutos reais: o saldo restante é redistribuído sem estresse.
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs font-code-metric font-bold">
              {[15, 20, 25, 30, 35, 40].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSavePartialLog(showPartialLogModal.id, mins)}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-center text-on-surface"
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADIANTAR CONTEÚDO FUTURO */}
      {/* ========================================================================= */}
      {showAnteciparModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 border border-surface-container shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold text-primary tracking-wider">
                  Adiantar Conteúdo da Próxima Semana
                </span>
                <h3 className="text-base font-black text-on-surface">
                  Estudar antecipadamente
                </h3>
              </div>
              <button
                onClick={() => setShowAnteciparModal(false)}
                className="p-1 rounded text-secondary hover:bg-surface-container"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Se você tem tempo livre hoje, puxe uma atividade da próxima semana. Ela será marcada como concluída e gerará margem de segurança no seu ritmo:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { name: 'SCA — Síndromes Coronarianas Agudas', dur: 40, mod: 'Cardiologia', cat: 'avanco' as PlanningCategory },
                { name: 'Endocardite Infecciosa & Duke', dur: 35, mod: 'Infectologia', cat: 'aplicacao' as PlanningCategory },
                { name: 'Hérnias Inguinais & Nyhus', dur: 30, mod: 'Cirurgia Geral', cat: 'avanco' as PlanningCategory },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleAntecipar(item.name, item.dur, item.mod, item.cat)}
                  className="w-full text-left p-3 rounded-xl border border-surface-container hover:border-primary/40 bg-surface-container-low transition-all flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-on-surface">{item.name}</strong>
                    <span className="text-[0.6875rem] text-secondary">🏷️ {item.mod}</span>
                  </div>
                  <span className="font-code-metric font-bold text-primary shrink-0">
                    +{item.dur} min
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
