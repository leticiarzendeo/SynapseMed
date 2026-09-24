import React, { useState, useEffect, useMemo } from 'react';
import { ViewPath, StudyActivity, UserPreferences, SessionCompletionReport, CadernoErroItem, EvidenceRecord } from './types';
import { initialActivities, initialPreferences, initialCadernoErros, fullCurriculumHierarchy } from './data/mockData';
import { buildStudiedCurriculum } from './utils/studiedProgress';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HojeView } from './components/HojeView';
import { PlanejamentoView } from './components/PlanejamentoView';
import { CurriculoView } from './components/CurriculoView';
import { PrioridadesView } from './components/PrioridadesView';
import { DesempenhoView } from './components/DesempenhoView';
import { RevisoesView } from './components/RevisoesView';
import { ProvasSimuladosView } from './components/ProvasSimuladosView';
import { AnalisesView } from './components/AnalisesView';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { CoordenadorSessaoModal } from './components/CoordenadorSessaoModal';
import { RegistrarEstudoModal } from './components/RegistrarEstudoModal';
import { AjustarMetasModal } from './components/AjustarMetasModal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<ViewPath>('hoje');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Garantia de ambiente limpo para teste de início de estudos
  const CURRENT_STORAGE_VERSION = 'v6_clean_zero_hours';
  if (typeof window !== 'undefined') {
    const storedVersion = localStorage.getItem('synapsemed_storage_version');
    if (storedVersion !== CURRENT_STORAGE_VERSION) {
      localStorage.removeItem('synapsemed_activities');
      localStorage.removeItem('synapsemed_prefs');
      localStorage.removeItem('synapsemed_caderno_erros');
      localStorage.removeItem('synapsemed_weekly_completed_minutes');
      localStorage.setItem('synapsemed_storage_version', CURRENT_STORAGE_VERSION);
    }
  }

  const [activities, setActivities] = useState<StudyActivity[]>(() => {
    const saved = localStorage.getItem('synapsemed_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialActivities;
      }
    }
    return initialActivities;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('synapsemed_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialPreferences;
      }
    }
    return initialPreferences;
  });

  const [cadernoErros, setCadernoErros] = useState<CadernoErroItem[]>(() => {
    const saved = localStorage.getItem('synapsemed_caderno_erros');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCadernoErros;
      }
    }
    return initialCadernoErros;
  });

  // Conteúdos concluídos a partir de telas que ainda usam modelo próprio
  // (HojeView, PlanejamentoView). Elas avisam o App só com o contentId
  // ("a ponte"), sem migrar seus tipos internos.
  const [manualStudiedContentIds, setManualStudiedContentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('synapsemed_manual_studied');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  // Evidência REAL registrada manualmente (acertos/erros/cartões por sessão).
  // Alimenta os KPIs honestos do Desempenho.
  const [evidenceLog, setEvidenceLog] = useState<EvidenceRecord[]>(() => {
    const saved = localStorage.getItem('synapsemed_evidence_log');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modal controls
  const [coordinatingActivity, setCoordinatingActivity] = useState<StudyActivity | null>(null);
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);
  const [showAjustarMetasModal, setShowAjustarMetasModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('synapsemed_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('synapsemed_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('synapsemed_caderno_erros', JSON.stringify(cadernoErros));
  }, [cadernoErros]);

  useEffect(() => {
    localStorage.setItem(
      'synapsemed_manual_studied',
      JSON.stringify(manualStudiedContentIds)
    );
  }, [manualStudiedContentIds]);

  useEffect(() => {
    localStorage.setItem('synapsemed_evidence_log', JSON.stringify(evidenceLog));
  }, [evidenceLog]);

  // A PONTE: telas com modelo próprio chamam isto ao concluir uma atividade,
  // passando apenas o contentId. Assim a conclusão propaga para o currículo,
  // domínio e priorização sem migrar os tipos internos dessas telas.
  const handleContentStudied = (contentId?: string) => {
    if (!contentId) return;
    setManualStudiedContentIds((prev) =>
      prev.includes(contentId) ? prev : [...prev, contentId]
    );
  };

  // Registro manual de prova/simulado: adiciona uma evidência avulsa e,
  // se for erro, também marca o conteúdo como estudado (a questão prova contato).
  const handleAddEvidence = (record: EvidenceRecord) => {
    setEvidenceLog((prev) => [record, ...prev]);
    if (record.contentId) handleContentStudied(record.contentId);
  };

  const handleAddCadernoErro = (item: CadernoErroItem) => {
    setCadernoErros((prev) => [item, ...prev]);
  };

  // ============================================================
  // FONTE DA VERDADE DO PROGRESSO CURRICULAR
  // Sobrepõe ao currículo estático os conteúdos efetivamente
  // concluídos (via contentId das atividades). É isto que
  // "destrava" isStudied — antes preso em false para os 236
  // conteúdos — e faz a conclusão propagar para Currículo,
  // domainCalculator e priorização.
  // ============================================================
  const { curriculum: studiedCurriculum, studiedContentIds } = useMemo(
    () => buildStudiedCurriculum(fullCurriculumHierarchy, activities, manualStudiedContentIds),
    [activities, manualStudiedContentIds]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleToggleActivityStatus = (
    id: string,
    newStatus: 'pendente' | 'em_andamento' | 'concluido'
  ) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id
          ? {
              ...act,
              status: newStatus,
              completedAt:
                newStatus === 'concluido'
                  ? new Date().toISOString().split('T')[0]
                  : undefined,
            }
          : act
      )
    );
    showToast(`Atividade atualizada para "${newStatus === 'concluido' ? 'Concluída' : newStatus}"`);
  };

  const handleUpdateActivityProgress = (activityId: string, currentStep: number) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? { ...act, currentStep } : act))
    );
  };

  const handleSaveCoordinationCompletion = (report: SessionCompletionReport) => {
    // Resolve o conteúdo a partir da atividade coordenada (o report não
    // carrega contentId, mas a StudyActivity sim).
    const relatedActivity =
      coordinatingActivity && coordinatingActivity.id === report.activityId
        ? coordinatingActivity
        : activities.find((a) => a.id === report.activityId);
    const contentId = relatedActivity?.contentId;

    // 1. Mark target activity completed
    setActivities((prev) =>
      prev.map((act) =>
        act.id === report.activityId
          ? {
              ...act,
              status: 'concluido',
              completedAt: new Date().toISOString().split('T')[0],
            }
          : act
      )
    );

    // 1b. Propaga a conclusão para o currículo (destrava isStudied).
    if (contentId) handleContentStudied(contentId);

    // 1c. Registra a EVIDÊNCIA REAL da sessão (acertos/erros/cartões), que
    // alimenta os KPIs honestos do Desempenho. Sem isso, os números somem.
    if (
      contentId &&
      (report.questionsTotal || report.cardsReviewed)
    ) {
      const record: EvidenceRecord = {
        id: `ev-${Date.now()}`,
        contentId,
        date: new Date().toISOString().split('T')[0],
        kind: report.type,
        questionsTotal: report.questionsTotal,
        questionsCorrect: report.questionsCorrect,
        cardsReviewed: report.cardsReviewed,
        retentionPercent: report.retentionPercent,
        durationMinutes: report.durationMinutes,
        source: report.toolUsed,
      };
      setEvidenceLog((prev) => [record, ...prev]);
    }

    // 2. Add logged hours to weekly total
    const addedHours = report.durationMinutes / 60;
    setPreferences((prev) => ({
      ...prev,
      weeklyHoursLogged: Number((prev.weeklyHoursLogged + addedHours).toFixed(2)),
    }));

    // 3. If user logged an error note, add it to Caderno de Erros
    if (report.errorNote) {
      const newErr: CadernoErroItem = {
        id: `err-${Date.now()}`,
        topic: report.topic,
        specialty: report.specialty,
        reason: report.errorNote,
        reasonCategory: report.errorReasonCategory || 'outro',
        institutionOrContext: report.toolUsed,
        createdAt: new Date().toISOString().split('T')[0],
        examType: report.type === 'questoes' ? 'BANCO_QUESTOES' : undefined,
      };
      setCadernoErros((prev) => [newErr, ...prev]);
    }

    setCoordinatingActivity(null);

    const detail =
      report.type === 'questoes'
        ? ` (${report.accuracyPercent}% acurácia em ${report.questionsTotal} questões)`
        : report.type === 'revisao'
        ? ` (${report.cardsReviewed} cartões com ${report.retentionPercent}% retenção)`
        : ` (${report.durationMinutes} min)`;

    showToast(`Desempenho de "${report.topic}" no ${report.toolUsed}${detail} registrado! Inteligência calibrada.`);
  };

  const handleSaveEstudoAvulso = (session: {
    specialty: string;
    topic: string;
    durationMinutes: number;
    type: string;
  }) => {
    setShowRegistrarModal(false);
    const addedHours = session.durationMinutes / 60;
    setPreferences((prev) => ({
      ...prev,
      weeklyHoursLogged: Number((prev.weeklyHoursLogged + addedHours).toFixed(2)),
    }));
    showToast(`Estudo avulso de "${session.topic}" (${session.durationMinutes}min) registrado!`);
  };

  const handleSavePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    setShowAjustarMetasModal(false);
    showToast('Preferências e metas salvas com sucesso!');
  };

  const handleResetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('synapsemed_activities');
      localStorage.removeItem('synapsemed_prefs');
      localStorage.removeItem('synapsemed_caderno_erros');
      localStorage.removeItem('synapsemed_manual_studied');
      localStorage.removeItem('synapsemed_evidence_log');
      localStorage.removeItem('synapsemed_weekly_completed_minutes');
      localStorage.setItem('synapsemed_storage_version', CURRENT_STORAGE_VERSION);
    }
    setActivities(initialActivities);
    setPreferences(initialPreferences);
    setCadernoErros(initialCadernoErros);
    setManualStudiedContentIds([]);
    setEvidenceLog([]);
    setCurrentPath('hoje');
    showToast('Ambiente restaurado para o início dos estudos (0% concluído).');
  };

  const handleStartTopicFromCurriculo = (topicTitle: string) => {
    // Look for matching activity or create coordination context
    const found = activities.find((a) => a.title.toLowerCase().includes(topicTitle.toLowerCase()));
    if (found) {
      setCoordinatingActivity(found);
    } else {
      // Create a temporary coordination profile
      const tempActivity: StudyActivity = {
        id: `custom-${Date.now()}`,
        title: topicTitle,
        specialty: 'Clínica Médica',
        subspecialty: 'Especialidades',
        priority: 'media',
        priorityLabel: 'Média prioridade',
        type: 'questoes',
        typeLabel: 'Questões de provas reais',
        summaryReason: 'Treino de fixação e diagnóstico em questões de banca.',
        status: 'em_andamento',
        estimatedTime: '45 min',
        description: `Treino direcionado para ${topicTitle} com foco nos pontos de maior corte de banca.`,
        currentStep: 0,
        totalSteps: 15,
      };
      setCoordinatingActivity(tempActivity);
    }
  };

  const handleStartSRSQueue = () => {
    const dpocAct = activities.find((a) => a.id === 'dpoc-review') || activities[1];
    setCoordinatingActivity(dpocAct);
  };

  const handleSelectTopicFromSearch = (topicTitle: string) => {
    if (topicTitle.toLowerCase().includes('icc')) {
      const act = activities.find((a) => a.id === 'icc-session') || activities[0];
      setCoordinatingActivity(act);
    } else if (topicTitle.toLowerCase().includes('dpoc')) {
      const act = activities.find((a) => a.id === 'dpoc-review') || activities[1];
      setCoordinatingActivity(act);
    } else if (topicTitle.toLowerCase().includes('endocardite')) {
      const act = activities.find((a) => a.id === 'endocardite-theory') || activities[2];
      setCoordinatingActivity(act);
    } else if (topicTitle.toLowerCase().includes('simulado')) {
      setCurrentPath('provas-e-simulados');
    } else {
      setCurrentPath('curriculo');
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-on-surface text-on-primary text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-surface-container">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          preferences={preferences}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenPreferences={() => setCurrentPath('configuracoes')}
          onSelectTopic={handleSelectTopicFromSearch}
        />

        {/* View Router */}
        <main className="relative pt-16 w-full bg-background min-h-screen flex-1">
          {currentPath === 'hoje' && (
            <HojeView
              preferences={preferences}
              onNavigateToPlanejamento={() => setCurrentPath('planejamento')}
              onNavigateToCurriculo={() => setCurrentPath('curriculo')}
              onContentStudied={handleContentStudied}
              curriculum={studiedCurriculum}
            />
          )}

          {currentPath === 'planejamento' && (
            <PlanejamentoView
              preferences={preferences}
              onOpenAjustarMetas={() => setShowAjustarMetasModal(true)}
              onContentStudied={handleContentStudied}
            />
          )}

          {currentPath === 'curriculo' && (
            <CurriculoView
              onStartTopic={handleStartTopicFromCurriculo}
              curriculum={studiedCurriculum}
              studiedContentIds={studiedContentIds}
              activities={activities}
              cadernoErros={cadernoErros}
            />
          )}

          {currentPath === 'prioridades' && (
            <PrioridadesView curriculum={studiedCurriculum} />
          )}

          {currentPath === 'desempenho' && (
            <DesempenhoView
              cadernoErros={cadernoErros}
              curriculum={studiedCurriculum}
              evidenceLog={evidenceLog}
            />
          )}

          {currentPath === 'revisoes' && (
            <RevisoesView onOpenSRSCoordination={handleStartSRSQueue} />
          )}

          {currentPath === 'provas-e-simulados' && (
            <ProvasSimuladosView
              onAddEvidence={handleAddEvidence}
              onAddCadernoErro={handleAddCadernoErro}
            />
          )}

          {currentPath === 'analises' && (
            <AnalisesView cadernoErros={cadernoErros} curriculum={studiedCurriculum} />
          )}

          {currentPath === 'configuracoes' && (
            <ConfiguracoesView
              preferences={preferences}
              onSavePreferences={handleSavePreferences}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>

      {/* Coordination Modal (Orchestrates external study session in Medway, Osler, etc.) */}
      {coordinatingActivity && (
        <CoordenadorSessaoModal
          activity={coordinatingActivity}
          onClose={() => setCoordinatingActivity(null)}
          onSaveCompletion={handleSaveCoordinationCompletion}
          onUpdateProgress={handleUpdateActivityProgress}
        />
      )}

      {/* Manual Study Registration Modal */}
      {showRegistrarModal && (
        <RegistrarEstudoModal
          onClose={() => setShowRegistrarModal(false)}
          onSave={handleSaveEstudoAvulso}
        />
      )}

      {/* Goal Adjustment Modal */}
      {showAjustarMetasModal && (
        <AjustarMetasModal
          preferences={preferences}
          onClose={() => setShowAjustarMetasModal(false)}
          onSave={handleSavePreferences}
        />
      )}
    </div>
  );
}
