import React, { useState, useMemo } from 'react';
import {
  fullCurriculumHierarchy,
  initialOslerBlocks,
  initialSourceMappings,
} from '../data/mockData';
import { getStudiedCurriculumTotals } from '../utils/studiedProgress';
import {
  AreaItem,
  ContentItem,
  OslerBlock,
  SourceMapping,
  QuestionAssessment,
  StudyActivity,
  CadernoErroItem,
} from '../types';
import { MapeamentoFontesModal } from './MapeamentoFontesModal';
import { MedwayTrajetoriaModal } from './MedwayTrajetoriaModal';
import { OslerEvidenceModal } from './OslerEvidenceModal';
import { RealExamEvidenceModal } from './RealExamEvidenceModal';
import { SimuladoEvidenceModal } from './SimuladoEvidenceModal';
import { DominioDossieModal } from './DominioDossieModal';
import { calculateContentDomain } from '../utils/domainCalculator';
import { RealExamQuestionRecord, ErrorReasonType } from '../types';
import { BancoRelacionalView } from './BancoRelacionalView';

interface CurriculoViewProps {
  onStartTopic: (topicTitle: string) => void;
  /**
   * Currículo já sobreposto com o progresso real (isStudied refletindo as
   * atividades concluídas). Opcional: se ausente, cai no currículo estático,
   * preservando o comportamento antigo de qualquer chamador legado.
   */
  curriculum?: AreaItem[];
  studiedContentIds?: ReadonlySet<string>;
  activities?: StudyActivity[];
  cadernoErros?: CadernoErroItem[];
}

export const CurriculoView: React.FC<CurriculoViewProps> = ({
  onStartTopic,
  curriculum,
  studiedContentIds,
  activities,
  cadernoErros,
}) => {
  // Hierarquia efetiva: overlay real quando fornecido, senão o estático.
  const curriculumHierarchy: AreaItem[] = curriculum ?? fullCurriculumHierarchy;
  const [activeTab, setActiveTab] = useState<'arvore' | 'mapeamento' | 'banco-relacional'>('arvore');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('clinica');
  const [expandedContentId, setExpandedContentId] = useState<string | null>('c-icc');
  const [searchFilter, setSearchFilter] = useState('');

  // Modal do Cérebro de Domínio (4 Dimensões: Conhecimento, Aplicação, Retenção, Confiança)
  const [dominioModalContent, setDominioModalContent] = useState<ContentItem | null>(null);

  // Estado dos Mapeamentos N:M e Catálogo Osler (com persistência local)
  const [mappings, setMappings] = useState<SourceMapping[]>(() => {
    const saved = localStorage.getItem('medway_osler_mappings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialSourceMappings.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return initialSourceMappings;
  });

  const [oslerBlocks, setOslerBlocks] = useState<OslerBlock[]>(() => {
    const saved = localStorage.getItem('osler_blocks_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialOslerBlocks.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return initialOslerBlocks;
  });

  // Modal de Mapeamento aberto para um conteúdo específico
  const [mappingModalContent, setMappingModalContent] = useState<ContentItem | null>(null);
  // Modal de Trajetória Longitudinal Medway (Pré, Pós, Reavaliações)
  const [medwayModalContent, setMedwayModalContent] = useState<ContentItem | null>(null);
  // Modal de Dossiê e Evidência de Memória Osler
  const [oslerModalContent, setOslerModalContent] = useState<ContentItem | null>(null);
  // Modal de Evidência de Aplicação: Provas Reais
  const [realExamModalContent, setRealExamModalContent] = useState<ContentItem | null>(null);
  // Modal de Evidência de Aplicação Integrada: Simulados
  const [simuladoModalContent, setSimuladoModalContent] = useState<ContentItem | null>(null);

  // Overrides locais para avaliações Medway adicionadas pelo usuário
  const [contentOverrides, setContentOverrides] = useState<Record<string, Partial<ContentItem>>>(() => {
    const saved = localStorage.getItem('medway_content_overrides');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // Salvar nova reavaliação na trajetória Medway
  const handleAddMedwayEvaluation = (contentId: string, assessment: Omit<QuestionAssessment, 'id'>) => {
    setContentOverrides((prev) => {
      const existing = prev[contentId] || {};
      const currentList: QuestionAssessment[] =
        existing.trajectoryEvaluations ||
        allContents.find((c) => c.id === contentId)?.trajectoryEvaluations ||
        [];

      const newEval: QuestionAssessment = {
        ...assessment,
        id: `eval-${contentId}-${Date.now()}`,
      };

      const updatedList = [...currentList, newEval];
      const totalQuestions = updatedList.reduce((sum, ev) => sum + ev.totalQuestions, 0);

      // Recalcula ponderação por recência
      // Avaliações mais recentes recebem peso crescente; Pré não entra no cálculo de domínio
      const postAndReav = updatedList.filter((ev) => ev.type !== 'pre');
      let weightedSum = 0;
      let totalWeight = 0;
      postAndReav.forEach((ev, idx) => {
        // Exemplo: itens mais recentes na lista ganham peso maior
        const weight = Math.min(10 + (idx + 1) * 20, 100);
        weightedSum += ev.accuracy * weight;
        totalWeight += weight;
      });

      const newWeightedAccuracy = totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(1)) : 80;

      const updatedOverrides = {
        ...prev,
        [contentId]: {
          ...existing,
          trajectoryEvaluations: updatedList,
          medwayWeightedAccuracy: newWeightedAccuracy,
          sampleConfidence: {
            level: totalQuestions >= 40 ? ('alta' as const) : totalQuestions >= 20 ? ('media' as const) : ('baixa' as const),
            totalQuestions,
            explanation: `Amostra de ${totalQuestions} questões com ${updatedList.length} avaliações longitudinais.`,
          },
        },
      };

      localStorage.setItem('medway_content_overrides', JSON.stringify(updatedOverrides));

      // Atualiza o modal se estiver aberto
      if (medwayModalContent && medwayModalContent.id === contentId) {
        setMedwayModalContent((prevModal) =>
          prevModal
            ? {
                ...prevModal,
                trajectoryEvaluations: updatedList,
                medwayWeightedAccuracy: newWeightedAccuracy,
              }
            : null
        );
      }

      return updatedOverrides;
    });
  };

  // Salvar atualizações interativas na evidência do Osler (ex: simulação de revisões)
  const handleUpdateOslerEvidence = (contentId: string, updatedSampleCards: any[]) => {
    setContentOverrides((prev) => {
      const existing = prev[contentId] || {};
      const currentEvidence =
        existing.oslerEvidence ||
        allContents.find((c) => c.id === contentId)?.oslerEvidence;

      const updatedEvidence = {
        ...(currentEvidence || {}),
        sampleCards: updatedSampleCards,
      };

      const updatedOverrides = {
        ...prev,
        [contentId]: {
          ...existing,
          oslerEvidence: updatedEvidence,
        },
      };

      localStorage.setItem('medway_content_overrides', JSON.stringify(updatedOverrides));

      if (oslerModalContent && oslerModalContent.id === contentId) {
        setOslerModalContent((prevModal) =>
          prevModal
            ? {
                ...prevModal,
                oslerEvidence: updatedEvidence as any,
              }
            : null
        );
      }

      return updatedOverrides;
    });
  };

  // Salvar nova questão de Prova Real
  const handleAddRealExamQuestion = (contentId: string, newQ: RealExamQuestionRecord) => {
    setContentOverrides((prev) => {
      const existing = prev[contentId] || {};
      const target = allContents.find((c) => c.id === contentId);
      const prevStats = existing.examStats || target?.examStats || { realExamQuestions: 0, realExamHits: 0, simuladoQuestions: 0, simuladoHits: 0 };
      const prevEvidence = existing.realExamEvidence || target?.realExamEvidence;

      const newQuestions = [newQ, ...(prevEvidence?.questions || [])];
      const newTotal = prevStats.realExamQuestions + 1;
      const newHits = prevStats.realExamHits + (newQ.isCorrect ? 1 : 0);
      const newAcc = (newHits / newTotal) * 100;

      const updatedEvidence = {
        ...(prevEvidence || {
          targetInstitutionsAccuracy: 67.5,
          recencyWeightedAccuracy: 71.8,
          confidenceLevel: 'alta' as const,
          institutionBreakdown: [],
          yearlyBreakdown: [],
          errorReasonBreakdown: {} as any,
          diagnostic: {
            deficitType: 'aplicacao' as const,
            headline: 'Déficit de Aplicação e Interpretação',
            prescribedAction: 'Priorizar questões de provas anteriores com foco em distratores.',
            isTargetDeficiency: true,
          },
        }),
        generalAccuracy: newAcc,
        totalQuestions: newTotal,
        hits: newHits,
        questions: newQuestions,
      };

      const updatedOverrides = {
        ...prev,
        [contentId]: {
          ...existing,
          examStats: {
            ...prevStats,
            realExamQuestions: newTotal,
            realExamHits: newHits,
          },
          realExamEvidence: updatedEvidence,
        },
      };

      localStorage.setItem('medway_content_overrides', JSON.stringify(updatedOverrides));

      if (realExamModalContent && realExamModalContent.id === contentId) {
        setRealExamModalContent((prevModal) =>
          prevModal
            ? {
                ...prevModal,
                examStats: {
                  ...prevModal.examStats,
                  realExamQuestions: newTotal,
                  realExamHits: newHits,
                },
                realExamEvidence: updatedEvidence,
              }
            : null
        );
      }

      return updatedOverrides;
    });
  };

  // Salvar nova questão de Simulado
  const handleAddSimuladoQuestion = (contentId: string, hit: boolean, reason?: ErrorReasonType) => {
    setContentOverrides((prev) => {
      const existing = prev[contentId] || {};
      const target = allContents.find((c) => c.id === contentId);
      const prevStats = existing.examStats || target?.examStats || { realExamQuestions: 0, realExamHits: 0, simuladoQuestions: 0, simuladoHits: 0 };
      const prevEvidence = existing.simuladoEvidence || target?.simuladoEvidence;

      const newTotal = prevStats.simuladoQuestions + 1;
      const newHits = prevStats.simuladoHits + (hit ? 1 : 0);
      const newAcc = (newHits / newTotal) * 100;

      const updatedEvidence = {
        ...(prevEvidence || {
          weightInApplication: 0.75,
          errorReasonBreakdown: {} as any,
          executionMetrics: {
            avgSecondsPerQuestion: 132,
            earlyQuestionsAccuracy: 88,
            lateQuestionsAccuracy: 64,
            fatigueDropPercent: -24,
            paceDiagnosis: 'Queda de rendimento no final da prova.',
          },
          simuladosMapped: [],
        }),
        integratedAccuracy: newAcc,
        totalQuestions: newTotal,
        hits: newHits,
      };

      const updatedOverrides = {
        ...prev,
        [contentId]: {
          ...existing,
          examStats: {
            ...prevStats,
            simuladoQuestions: newTotal,
            simuladoHits: newHits,
          },
          simuladoEvidence: updatedEvidence,
        },
      };

      localStorage.setItem('medway_content_overrides', JSON.stringify(updatedOverrides));

      if (simuladoModalContent && simuladoModalContent.id === contentId) {
        setSimuladoModalContent((prevModal) =>
          prevModal
            ? {
                ...prevModal,
                examStats: {
                  ...prevModal.examStats,
                  simuladoQuestions: newTotal,
                  simuladoHits: newHits,
                },
                simuladoEvidence: updatedEvidence,
              }
            : null
        );
      }

      return updatedOverrides;
    });
  };

  // Lista plana de todos os conteúdos para fácil consulta
  const allContents = useMemo(() => {
    const list: ContentItem[] = [];
    curriculumHierarchy.forEach((area) => {
      area.modules.forEach((mod) => {
        mod.contents.forEach((c) => {
          list.push(c);
        });
      });
    });
    return list;
  }, [curriculumHierarchy]);

  const totals = getStudiedCurriculumTotals(curriculumHierarchy);
  const activeArea =
    curriculumHierarchy.find((a) => a.id === selectedAreaId) || curriculumHierarchy[0];

  // Helper para obter métricas e blocos do Osler mapeados para um conteúdo
  const getContentOslerData = (contentId: string, contentItem?: ContentItem) => {
    const contentMappings = mappings.filter((m) => m.contentId === contentId);
    const mappedBlocks = oslerBlocks.filter((b) =>
      contentMappings.some((m) => m.oslerBlockId === b.id)
    );

    const totalsAgg = mappedBlocks.reduce(
      (acc, b) => ({
        total: acc.total + b.cardsTotal,
        facil: acc.facil + b.cardsFacil,
        normal: acc.normal + b.cardsNormal,
        dificil: acc.dificil + b.cardsDificil,
        erros: acc.erros + b.cardsErros,
      }),
      { total: 0, facil: 0, normal: 0, dificil: 0, erros: 0 }
    );

    const reviewed = totalsAgg.facil + totalsAgg.normal + totalsAgg.dificil + totalsAgg.erros;
    // Escala de Qualidade de Recuperação: Fácil=100, Normal=85, Difícil=70 (não é erro), Errado=0
    const weightedPoints =
      totalsAgg.facil * 100 + totalsAgg.normal * 85 + totalsAgg.dificil * 70 + totalsAgg.erros * 0;
    const qualityAccuracy = reviewed > 0 ? Number((weightedPoints / reviewed).toFixed(1)) : 85;

    const retentionScore = contentItem?.oslerEvidence?.retentionScore ?? qualityAccuracy;
    const stabilityLevel =
      contentItem?.oslerEvidence?.stabilityLevel ??
      (totalsAgg.erros > 6 ? 'moderada' : 'alta');
    const confidenceLevel =
      contentItem?.oslerEvidence?.confidenceLevel ??
      (reviewed >= 60 ? 'alta' : reviewed >= 25 ? 'moderada' : 'inicial');

    return {
      blocks: mappedBlocks,
      metrics: totalsAgg,
      reviewed,
      retentionScore,
      stabilityLevel,
      confidenceLevel,
      hasMappings: mappedBlocks.length > 0,
    };
  };

  // Salvar mapeamentos N:M editados
  const handleSaveMappings = (contentId: string, selectedBlockIds: string[]) => {
    setMappings((prev) => {
      // Remove mapeamentos antigos deste conteúdo
      const filtered = prev.filter((m) => m.contentId !== contentId);
      // Adiciona as novas associações
      const newEntries: SourceMapping[] = selectedBlockIds.map((blockId) => {
        const block = oslerBlocks.find((b) => b.id === blockId);
        return {
          id: `map-${contentId}-${blockId}`,
          contentId,
          source: 'osler',
          oslerBlockId: blockId,
          oslerBlockTitle: block ? block.title : blockId,
          relationType: 'associado',
          createdAt: new Date().toISOString().split('T')[0],
        };
      });
      const updated = [...filtered, ...newEntries];
      localStorage.setItem('medway_osler_mappings', JSON.stringify(updated));
      return updated;
    });
  };

  // Cadastrar novo bloco no Osler
  const handleCreateOslerBlock = (newBlockData: Omit<OslerBlock, 'id'>) => {
    const newId = `osler-block-${Date.now()}`;
    const newBlock: OslerBlock = {
      ...newBlockData,
      id: newId,
    };
    setOslerBlocks((prev) => {
      const updated = [newBlock, ...prev];
      localStorage.setItem('osler_blocks_catalog', JSON.stringify(updated));
      return updated;
    });
    return newId;
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">account_tree</span>
            <span>Currículo Central Medway &amp; Mapeamento de Fontes</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Regra Estrutural nº 1</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Currículo &amp; Evidências de Domínio
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            O currículo Medway define os conteúdos centrais; blocos do Osler são mapeados manualmente (N:M) e provas/simulados classificados por IA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tabs selector */}
          <div className="p-1 bg-surface-container-low rounded-xl border border-surface-container flex items-center gap-1">
            <button
              onClick={() => setActiveTab('arvore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'arvore'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_agenda</span>
              Árvore &amp; Dossiês
            </button>
            <button
              onClick={() => setActiveTab('mapeamento')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'mapeamento'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-sm">alt_route</span>
              Mapeamento Medway ↔ Osler
              <span className="px-1.5 py-0.2 rounded-full text-[0.625rem] bg-amber-200 text-amber-900 font-bold font-code-metric">
                N:M
              </span>
            </button>
            <button
              onClick={() => setActiveTab('banco-relacional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'banco-relacional'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-sm">database</span>
              Banco Relacional
              <span className="px-1.5 py-0.2 rounded-full text-[0.625rem] bg-indigo-200 text-indigo-900 font-bold font-code-metric">
                30 Regras
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ÁRVORE CURRICULAR & DOSSIÊS DE CONTEÚDO */}
      {activeTab === 'arvore' && (
        <div className="space-y-space-xl animate-fadeIn">
          {/* Global Curriculum Progress Banner */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">auto_stories</span>
                  <span className="font-bold text-xs uppercase tracking-wider text-primary">
                    Censo Geral do Currículo de 2 Anos
                  </span>
                </div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  {totals.studied} de {totals.total} conteúdos estudados ({totals.studiedPercent}%)
                </h2>
                <p className="text-xs text-secondary max-w-2xl leading-relaxed">
                  Distinção importante: <strong className="text-on-surface font-semibold">Concluído não é consolidado</strong>. Você tem{' '}
                  <span className="text-emerald-700 font-bold">{totals.consolidated} conteúdos consolidados (≥ 85% de domínio)</span> e{' '}
                  <span className="text-amber-700 font-bold">{totals.studied - totals.consolidated} em consolidação ativa</span> através de repetição espaçada e questões.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 bg-surface-container-low/70 p-3 rounded-xl border border-surface-container">
                <div className="text-center px-2">
                  <span className="text-[0.625rem] uppercase text-secondary font-semibold block">Estudados</span>
                  <span className="font-code-metric text-lg font-bold text-on-surface">
                    {totals.studied}/{totals.total}
                  </span>
                </div>
                <div className="h-8 w-px bg-surface-container"></div>
                <div className="text-center px-2">
                  <span className="text-[0.625rem] uppercase text-emerald-800 font-semibold block">Consolidados</span>
                  <span className="font-code-metric text-lg font-bold text-emerald-700">{totals.consolidated}</span>
                </div>
                <div className="h-8 w-px bg-surface-container"></div>
                <div className="text-center px-2">
                  <span className="text-[0.625rem] uppercase text-secondary font-semibold block">Meta Domínio</span>
                  <span className="font-code-metric text-lg font-bold text-primary">85%</span>
                </div>
              </div>
            </div>

            {/* Dual progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[0.6875rem] text-secondary">
                <span>Barra de Cobertura: Azul (Estudado) • Verde (Consolidado ≥ 85%)</span>
                <span className="font-code-metric">
                  {totals.studiedPercent}% estudado • {totals.consolidatedPercent}% consolidado
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${totals.consolidatedPercent}%` }}
                  className="h-full bg-emerald-600 rounded-l-full"
                  title={`${totals.consolidated} consolidados`}
                ></div>
                <div
                  style={{ width: `${totals.studiedPercent - totals.consolidatedPercent}%` }}
                  className="h-full bg-primary"
                  title={`${totals.studied - totals.consolidated} em consolidação`}
                ></div>
              </div>
            </div>
          </div>

          {/* Camada 1: Grandes Áreas da Residência Médica & Medway */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {curriculumHierarchy.map((area) => {
              const isSelected = area.id === selectedAreaId;
              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container border-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <span className="material-symbols-outlined text-sm">{area.icon}</span>
                    <span className="truncate">{area.name}</span>
                  </div>
                  <div className="mt-2 space-y-0.5 text-[0.6875rem]">
                    <div className="flex items-center justify-between">
                      <span className={isSelected ? 'text-on-primary-container/80' : 'text-secondary'}>
                        {area.studiedContents}/{area.totalContents} conteúdos
                      </span>
                      <span className="font-code-metric font-bold">{area.avgMastery}%</span>
                    </div>
                    <div className="text-[0.625rem] text-emerald-700 font-medium">
                      {area.consolidatedContents} consolidados
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Camada 2: Módulos da Área Selecionada */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
              <div>
                <h2 className="font-headline-md text-base font-bold text-on-surface">
                  {activeArea.name} — {activeArea.studiedContents}/{activeArea.totalContents} conteúdos concluídos
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  {activeArea.totalHours}h estimadas no ciclo • {activeArea.consolidatedContents} conteúdos com domínio ≥ 85%.
                </p>
              </div>

              <div className="w-full sm:w-72">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-2 text-secondary text-sm">search</span>
                  <input
                    type="text"
                    placeholder="Buscar conteúdo ou módulo..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 text-xs bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Modules & Contents Tree */}
            <div className="space-y-6">
              {activeArea.modules.map((modulo) => {
                const filteredContents = modulo.contents.filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    modulo.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    (c.oslerTopicsStatus && c.oslerTopicsStatus.toLowerCase().includes(searchFilter.toLowerCase())) ||
                    (c.oslerTopicsList && c.oslerTopicsList.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase())))
                );

                if (searchFilter && filteredContents.length === 0) return null;

                return (
                  <div key={modulo.id} className="space-y-3">
                    {/* Module Header */}
                    <div className="flex items-center justify-between bg-surface-container-low/70 px-4 py-2.5 rounded-xl border border-surface-container">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">folder_open</span>
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wide">
                          Módulo: {modulo.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-[0.625rem] font-code-metric font-medium">
                          {modulo.studiedContents}/{modulo.totalContents} concluídos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-secondary text-[0.6875rem]">Domínio do Módulo:</span>
                        <span className="font-code-metric font-bold text-primary">{modulo.avgMastery}%</span>
                      </div>
                    </div>

                    {/* Contents within Module */}
                    <div className="space-y-2.5 pl-2 sm:pl-4">
                      {filteredContents.map((rawContent) => {
                        const content: ContentItem = {
                          ...rawContent,
                          ...(contentOverrides[rawContent.id] || {}),
                        };

                        const isExpanded = expandedContentId === content.id;
                        const oslerData = getContentOslerData(content.id, content);

                        // CÉREBRO DE DOMÍNIO: 4 Dimensões Integradas
                        const domainData = calculateContentDomain(content);
                        const isOverTarget = domainData.overallDomain >= content.targetMastery;

                        const preAcc = content.preVideoQuestions.accuracy;
                        const postAcc = content.postVideoQuestions.accuracy;
                        const learningGain =
                          content.learningGainPP ?? Number((postAcc - preAcc).toFixed(1));
                        const weightedAcc = content.medwayWeightedAccuracy ?? postAcc;
                        const totalMedwayQuestions =
                          (content.trajectoryEvaluations?.reduce(
                            (sum, ev) => sum + ev.totalQuestions,
                            0
                          )) ??
                          (content.preVideoQuestions.completedCount +
                            content.postVideoQuestions.completedCount);

                        // Badge estilizado pelo Status do Cérebro de Domínio
                        const getStatusStyle = () => {
                          switch (domainData.status) {
                            case 'consolidado':
                              return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
                            case 'aplicacao_insuficiente':
                              return 'bg-amber-100 text-amber-950 border border-amber-300 ring-1 ring-amber-400/50';
                            case 'insuficiente':
                              return 'bg-rose-100 text-rose-900 border border-rose-300';
                            case 'nao_avaliado':
                              return 'bg-surface-container text-secondary border border-surface-container-high';
                            case 'em_consolidacao':
                            default:
                              return 'bg-amber-50 text-amber-900 border border-amber-200';
                          }
                        };

                        return (
                          <div
                            key={content.id}
                            className={`rounded-xl border transition-all ${
                              isExpanded
                                ? 'bg-surface-container-lowest border-primary/40 shadow-sm ring-1 ring-primary/10'
                                : 'bg-surface-container-low/40 border-surface-container hover:bg-surface-container-low/70'
                            }`}
                          >
                            {/* Content summary row */}
                            <div
                              onClick={() => setExpandedContentId(isExpanded ? null : content.id)}
                              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                            >
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-on-surface">{content.name}</span>
                                  {content.medwayRowNumber && (
                                    <span className="px-1.5 py-0.2 rounded font-code-metric text-[0.625rem] font-bold bg-primary/10 text-primary border border-primary/20">
                                      #{content.medwayRowNumber} Medway
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-0.2 rounded font-code-metric text-[0.625rem] font-bold ${
                                      content.incidence.generalRating === 'Muito alta'
                                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                        : content.incidence.generalRating === 'Alta'
                                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                        : 'bg-surface-container text-secondary'
                                    }`}
                                  >
                                    Incidência: {content.incidence.generalRating}
                                  </span>

                                  {/* Status do Domínio */}
                                  <span
                                    className={`px-2 py-0.2 rounded text-[0.625rem] font-bold flex items-center gap-1 ${getStatusStyle()}`}
                                  >
                                    <span>{domainData.statusLabel}</span>
                                  </span>

                                  {content.theoryCompleted && (
                                    <span className="text-[0.625rem] text-emerald-700 flex items-center gap-0.5">
                                      <span className="material-symbols-outlined text-[0.75rem]">check_circle</span>
                                      Teoria Medway ✅
                                    </span>
                                  )}

                                  {/* Selo de blocos Osler mapeados */}
                                  <span className="text-[0.625rem] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-[0.75rem]">style</span>
                                    {oslerData.blocks.length} blocos Osler ({oslerData.metrics.total} cards)
                                  </span>
                                </div>

                                {/* As 4 Dimensões em destaque na linha */}
                                <div className="flex items-center gap-3 text-[0.6875rem] text-secondary flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <span>📚 Conhecimento:</span>
                                    <strong className="text-blue-700 font-code-metric">{domainData.knowledgeScore}%</strong>
                                  </span>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-1">
                                    <span>🎯 Aplicação:</span>
                                    <strong className={`font-code-metric ${domainData.applicationScore < 72 ? 'text-amber-800' : 'text-emerald-800'}`}>
                                      {domainData.applicationScore}%
                                    </strong>
                                  </span>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-1">
                                    <span>🧠 Retenção:</span>
                                    <strong className="text-purple-800 font-code-metric">{domainData.retentionScore}%</strong>
                                  </span>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-1">
                                    <span>📊 Confiança:</span>
                                    <span
                                      className={`px-1.5 py-0.2 rounded text-[0.5625rem] font-bold uppercase font-code-metric ${
                                        domainData.confidenceLevel === 'alta'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : domainData.confidenceLevel === 'media'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-rose-100 text-rose-800'
                                      }`}
                                    >
                                      {domainData.confidenceLevel}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                                {/* Botão Dossiê do Cérebro de Domínio */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDominioModalContent(content);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors border border-surface-container-high"
                                  title="Abrir Dossiê Analítico do Cérebro de Domínio (4 Dimensões + Diagnóstico)"
                                >
                                  <span className="material-symbols-outlined text-sm text-primary">psychology</span>
                                  <span className="hidden sm:inline">Dossiê</span>
                                </button>

                                <div className="text-right">
                                  <span className="text-[0.625rem] text-secondary block">Domínio Geral</span>
                                  <div className="flex items-baseline gap-1 justify-end">
                                    <span
                                      className={`font-code-metric text-sm font-bold ${
                                        isOverTarget ? 'text-emerald-700' : 'text-amber-700'
                                      }`}
                                    >
                                      {domainData.overallDomain}%
                                    </span>
                                    <span className="text-[0.625rem] text-secondary font-code-metric">/ 85%</span>
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStartTopic(content.name);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs"
                                >
                                  Estudar
                                </button>

                                <span className="material-symbols-outlined text-secondary text-base">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </div>
                            </div>

                            {/* DOSSIÊ MULTI-FONTE DO CONTEÚDO (MEDWAY ↔ OSLER ↔ PROVAS/SIMULADOS ↔ FSRS) */}
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-2 border-t border-surface-container space-y-4 bg-surface-container-lowest/70 rounded-b-xl">
                                {/* Metadados Oficiais do Curso Medway */}
                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-code-metric text-[0.6875rem] font-bold">
                                      MEDWAY #{content.medwayRowNumber ?? '—'}
                                    </span>
                                    <span className="font-semibold text-on-surface">Recursos Oficiais:</span>
                                    <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md border border-surface-container text-on-surface text-[0.6875rem] font-medium">
                                      <span className="material-symbols-outlined text-xs text-primary">play_circle</span>
                                      {content.videoLessonsHours ?? (content.theoryDurationMin ? Math.round(content.theoryDurationMin / 60) : 1)}h Videoaulas
                                    </span>
                                    <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md border border-surface-container text-on-surface text-[0.6875rem] font-medium">
                                      <span className="material-symbols-outlined text-xs text-primary">menu_book</span>
                                      {content.theoryPdfsCount ?? 1} PDF Teórico
                                    </span>
                                    <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md border border-surface-container text-on-surface text-[0.6875rem] font-medium">
                                      <span className="material-symbols-outlined text-xs text-amber-600">assignment</span>
                                      {content.preExercisesPdfCount ?? 1} PDF Ex. Pré
                                    </span>
                                    <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md border border-surface-container text-on-surface text-[0.6875rem] font-medium">
                                      <span className="material-symbols-outlined text-xs text-emerald-600">task_alt</span>
                                      {content.postExercisesPdfCount ?? 1} PDF Ex. Pós
                                    </span>
                                  </div>
                                  {content.oslerTopicsList && content.oslerTopicsList.length > 0 ? (
                                    <div className="w-full pt-2.5 mt-1 border-t border-primary/10 flex flex-col gap-1.5 text-[0.6875rem]">
                                      <div className="flex items-center gap-1.5 text-indigo-950 font-bold">
                                        <span className="material-symbols-outlined text-xs text-indigo-600">style</span>
                                        <span>Tópicos de Flashcards Osler correspondentes ({content.oslerTopicsList.length}):</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {content.oslerTopicsList.map((top, tIdx) => (
                                          <span
                                            key={tIdx}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-[0.6875rem] font-semibold hover:bg-indigo-100 transition-colors shadow-2xs"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                                            {top}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-[0.6875rem] text-surface-variant bg-surface-container-low border border-surface-container px-2 py-0.5 rounded-md">
                                      <span className="material-symbols-outlined text-xs text-surface-variant">style</span>
                                      <span>Flashcards Osler:</span>
                                      <em className="text-secondary">{content.oslerTopicsStatus || 'a preencher'}</em>
                                    </div>
                                  )}
                                </div>

                                {/* NOVO: Bloco Síntese do Cérebro de Domínio */}
                                <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="material-symbols-outlined text-primary text-base">psychology</span>
                                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                                        Cérebro de Domínio: Diagnóstico Sintético
                                      </span>
                                      <span className={`px-2 py-0.2 rounded text-[0.625rem] font-bold ${getStatusStyle()}`}>
                                        {domainData.statusLabel}
                                      </span>
                                    </div>
                                    <p className="text-xs text-on-surface font-semibold">
                                      {domainData.diagnostic.headline}
                                    </p>
                                    <p className="text-[0.6875rem] text-secondary max-w-xl">
                                      {domainData.diagnostic.description}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => setDominioModalContent(content)}
                                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-primary/90 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">troubleshoot</span>
                                      Ver Dossiê das 4 Dimensões
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                      <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                                      Dossiê Multi-Fonte de Evidências: {content.name}
                                    </div>
                                    <p className="text-[0.6875rem] text-secondary">
                                      Evidências independentes reunidas sob a mesma entidade central de currículo.
                                    </p>
                                  </div>

                                  {/* Botão de mapeamento rápido N:M */}
                                  <button
                                    onClick={() => setMappingModalContent(content)}
                                    className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition-all"
                                  >
                                    <span className="material-symbols-outlined text-sm">alt_route</span>
                                    Gerenciar Mapeamento Osler ({oslerData.blocks.length})
                                  </button>
                                </div>

                                {/* Grade de 5 Caixas de Evidências */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {/* 1. Medway */}
                                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-primary">school</span>
                                        Medway (Conteúdo Central)
                                      </span>
                                      <button
                                        onClick={() => setMedwayModalContent(content)}
                                        className="text-[0.6875rem] text-primary hover:underline font-bold flex items-center gap-0.5"
                                        title="Ver curva longitudinal de avaliações e adicionar novas questões"
                                      >
                                        <span className="material-symbols-outlined text-xs">timeline</span>
                                        Trajetória
                                      </button>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-secondary">
                                      {/* Teoria */}
                                      <div className="flex items-center justify-between">
                                        <span>Teoria Medway:</span>
                                        <span className="font-bold text-on-surface flex items-center gap-1">
                                          {content.theoryCompleted ? '✅ Concluída' : '⏳ Pendente'} ({content.theoryDurationMin} min)
                                        </span>
                                      </div>

                                      {/* Pré-exercícios */}
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                          <span>Pré-exercícios:</span>
                                          <span className="text-[0.5625rem] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold" title="Linha de base: não penaliza média simples">
                                            Linha de base
                                          </span>
                                        </span>
                                        <span className="font-code-metric font-bold text-amber-800">
                                          {preAcc}% ({content.preVideoQuestions.correctCount}/{content.preVideoQuestions.completedCount})
                                        </span>
                                      </div>

                                      {/* Pós-exercícios */}
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                          <span>Pós-exercícios:</span>
                                          <span className="text-[0.5625rem] px-1 py-0.2 rounded bg-blue-100 text-blue-900 font-semibold">
                                            Pós-aula
                                          </span>
                                        </span>
                                        <span className="font-code-metric font-bold text-blue-900">
                                          {postAcc}% ({content.postVideoQuestions.correctCount}/{content.postVideoQuestions.completedCount})
                                        </span>
                                      </div>

                                      {/* Ganho Pós-Teoria */}
                                      <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-emerald-50/80 border border-emerald-200/60">
                                        <span className="font-semibold text-emerald-950 flex items-center gap-1 text-[0.6875rem]">
                                          <span className="material-symbols-outlined text-xs text-emerald-700">trending_up</span>
                                          Evolução (Ganho pós-teoria):
                                        </span>
                                        <span className="font-code-metric font-bold text-emerald-800 text-xs">
                                          +{learningGain > 0 ? learningGain : 0} p.p.
                                        </span>
                                      </div>

                                      {/* Desempenho Ponderado Atual */}
                                      <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[0.6875rem]">
                                        <span className="text-secondary" title="Ponderado por recência (evidências recentes pesam mais)">
                                          Desempenho Atual (recência):
                                        </span>
                                        <span className="font-code-metric font-bold text-purple-900">
                                          {weightedAcc.toFixed(1)}%
                                        </span>
                                      </div>

                                      {/* Confiança Amostral */}
                                      <div className="flex items-center justify-between text-[0.625rem] text-secondary">
                                        <span>Confiança amostral:</span>
                                        <span className="font-medium text-on-surface">
                                          {totalMedwayQuestions >= 40 ? 'Alta' : totalMedwayQuestions >= 20 ? 'Média' : 'Inicial'} ({totalMedwayQuestions}q acumuladas)
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 2. Osler (Consolidado a partir dos blocos mapeados N:M com qualidade de recuperação) */}
                                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-indigo-700">psychology</span>
                                        Osler (Memória &amp; Recuperação)
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setOslerModalContent(content)}
                                          className="text-[0.6875rem] text-indigo-700 hover:underline font-bold flex items-center gap-0.5"
                                          title="Ver análise de retenção, recência decrescente e estabilidade FSRS"
                                        >
                                          <span className="material-symbols-outlined text-xs">analytics</span>
                                          Dossiê
                                        </button>
                                        <button
                                          onClick={() => setMappingModalContent(content)}
                                          className="text-[0.6875rem] text-secondary hover:underline font-medium"
                                        >
                                          Editar N:M
                                        </button>
                                      </div>
                                    </div>

                                    {/* Métricas qualitativas de recuperação (100 / 85 / 70 / 0) */}
                                    <div className="grid grid-cols-4 gap-1 text-center text-[0.625rem]">
                                      <div className="p-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200/50">
                                        <span className="block font-bold font-code-metric text-xs">{oslerData.metrics.facil}</span>
                                        <span>🟢 Fácil (100)</span>
                                      </div>
                                      <div className="p-1 rounded bg-blue-50 text-blue-900 border border-blue-200/50">
                                        <span className="block font-bold font-code-metric text-xs">{oslerData.metrics.normal}</span>
                                        <span>🟡 Normal (85)</span>
                                      </div>
                                      <div className="p-1 rounded bg-amber-50 text-amber-900 border border-amber-200/50" title="Recuperação com esforço cognitivo. NÃO é erro!">
                                        <span className="block font-bold font-code-metric text-xs">{oslerData.metrics.dificil}</span>
                                        <span>🟠 Difícil (70)</span>
                                      </div>
                                      <div className="p-1 rounded bg-rose-50 text-rose-900 border border-rose-200/50">
                                        <span className="block font-bold font-code-metric text-xs">{oslerData.metrics.erros}</span>
                                        <span>🔴 Erro (0)</span>
                                      </div>
                                    </div>

                                    {/* Síntese do Osler: Retenção Atual + Estabilidade + Confiança */}
                                    <div className="space-y-1 text-xs text-secondary pt-0.5 border-t border-surface-container/60">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[0.6875rem]">🧠 Retenção Atual:</span>
                                        <strong className="font-code-metric text-indigo-700 font-bold">
                                          {oslerData.retentionScore.toFixed(1)}%
                                        </strong>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-[0.6875rem]">🔒 Estabilidade da Memória:</span>
                                        <span className="font-semibold capitalize text-on-surface text-[0.6875rem] flex items-center gap-1">
                                          {oslerData.stabilityLevel}
                                          <span className="text-[0.5625rem] text-secondary font-code-metric">
                                            (S = {content.fsrs.stabilityDays}d)
                                          </span>
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-[0.6875rem]">🎯 Confiança Amostral:</span>
                                        <span className="text-[0.625rem] text-secondary">
                                          {oslerData.confidenceLevel} ({oslerData.reviewed}/{oslerData.metrics.total} cartões)
                                        </span>
                                      </div>
                                    </div>

                                    {/* Lista dos títulos/blocos mapeados */}
                                    <div className="pt-0.5">
                                      <div className="text-[0.5625rem] text-secondary flex items-center justify-between mb-1">
                                        <span className="font-bold uppercase">Blocos Mapeados:</span>
                                        <span>{oslerData.blocks.length} blocos vinculados</span>
                                      </div>
                                      <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
                                        {oslerData.blocks.map((b) => (
                                          <div
                                            key={b.id}
                                            className="text-[0.625rem] text-on-surface bg-surface-container-lowest px-2 py-0.5 rounded border border-surface-container flex items-center justify-between"
                                          >
                                            <span className="truncate mr-1">• {b.title}</span>
                                            <span className="font-code-metric text-[0.5625rem] text-secondary shrink-0">
                                              {b.cardsTotal}c
                                            </span>
                                          </div>
                                        ))}
                                        {oslerData.blocks.length === 0 && (
                                          <p className="text-[0.6875rem] text-secondary italic">
                                            Nenhum bloco do Osler mapeado ainda.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 3. Provas Reais (Evidência Primária de Aplicação) */}
                                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-primary">history_edu</span>
                                        Provas Reais
                                      </span>
                                      <span className="text-[0.625rem] bg-emerald-100 text-emerald-900 border border-emerald-300/60 px-1.5 py-0.2 rounded font-semibold">
                                        Evidência de Aplicação
                                      </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-secondary">
                                      <div className="flex items-center justify-between">
                                        <span>Amostragem:</span>
                                        <strong className="text-on-surface font-code-metric">
                                          {content.examStats.realExamQuestions} questões ({content.examStats.realExamHits} certas)
                                        </strong>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-on-surface">Acurácia Geral:</span>
                                        <span className="font-code-metric font-bold text-sm text-primary">
                                          {((content.examStats.realExamHits / (content.examStats.realExamQuestions || 1)) * 100).toFixed(1)}%
                                        </span>
                                      </div>

                                      {/* Aplicação em Bancas Alvo vs Geral */}
                                      <div className="flex items-center justify-between text-[0.6875rem] pt-1 border-t border-surface-container">
                                        <span className="flex items-center gap-1">
                                          <span>Bancas-Alvo:</span>
                                          <span className="px-1 rounded bg-amber-100 text-amber-900 font-bold text-[0.5625rem]">USP/ENARE</span>
                                        </span>
                                        <span className="font-code-metric font-bold text-amber-800">
                                          {content.realExamEvidence?.targetInstitutionsAccuracy || 67.5}%
                                        </span>
                                      </div>

                                      {/* Incidência 5 anos (Entra no Planejamento, não no Domínio) */}
                                      <div className="flex items-center justify-between text-[0.6875rem] text-secondary">
                                        <span>Incidência (5 anos):</span>
                                        <span className="font-code-metric text-on-surface font-semibold">
                                          {content.realExamEvidence?.yearlyBreakdown?.reduce((acc, y) => acc + y.totalQuestions, 0) || 18}q (72% provas)
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => setRealExamModalContent(content)}
                                      className="w-full mt-1 py-1 px-2 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary text-secondary text-[0.6875rem] font-semibold flex items-center justify-center gap-1 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-xs">analytics</span>
                                      <span>Ver Dossiê de Provas Reais</span>
                                    </button>
                                  </div>

                                  {/* 4. Simulados (Aplicação Integrada) */}
                                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-purple-700">quiz</span>
                                        Simulados
                                      </span>
                                      <span className="text-[0.625rem] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-medium">
                                        Aplicação Integrada
                                      </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-secondary">
                                      <div className="flex items-center justify-between">
                                        <span>Questões Integradas:</span>
                                        <strong className="text-on-surface font-code-metric">
                                          {content.examStats.simuladoQuestions} ({content.examStats.simuladoHits} certas)
                                        </strong>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-on-surface">Acurácia Integrada:</span>
                                        <span className="font-code-metric font-bold text-sm text-purple-800">
                                          {((content.examStats.simuladoHits / (content.examStats.simuladoQuestions || 1)) * 100).toFixed(1)}%
                                        </span>
                                      </div>

                                      {/* Dimensão de Fadiga e Ritmo */}
                                      <div className="flex items-center justify-between text-[0.6875rem] pt-1 border-t border-surface-container">
                                        <span>Fadiga (Início vs Fim):</span>
                                        <span className="font-code-metric font-bold text-rose-700">
                                          {content.simuladoEvidence?.executionMetrics?.fatigueDropPercent || -24}% queda
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-[0.6875rem] text-secondary">
                                        <span>Tempo Médio / Questão:</span>
                                        <span className="font-code-metric text-on-surface font-semibold">
                                          {content.simuladoEvidence?.executionMetrics?.avgSecondsPerQuestion || 132}s (2m12s)
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => setSimuladoModalContent(content)}
                                      className="w-full mt-1 py-1 px-2 rounded-lg bg-surface-container hover:bg-purple-50 hover:text-purple-800 text-secondary text-[0.6875rem] font-semibold flex items-center justify-center gap-1 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-xs">speed</span>
                                      <span>Ver Análise de Simulados &amp; Fadiga</span>
                                    </button>
                                  </div>

                                  {/* 5. Revisão & FSRS */}
                                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-purple-700">psychology</span>
                                        Revisão FSRS
                                      </span>
                                      <span className="text-[0.625rem] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                                        🔴 Atrasada
                                      </span>
                                    </div>

                                    <div className="space-y-1 text-xs text-secondary">
                                      <div className="flex items-center justify-between">
                                        <span>Estabilidade de Memória (S):</span>
                                        <strong className="text-on-surface font-code-metric">{content.fsrs.stabilityDays} dias</strong>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Dificuldade Intrínseca (D):</span>
                                        <strong className="text-on-surface font-code-metric">{content.fsrs.difficulty}/10</strong>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Probabilidade de Recordação (R):</span>
                                        <strong className="text-purple-700 font-code-metric font-bold">{content.fsrs.retrievability}%</strong>
                                      </div>
                                      <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[0.6875rem]">
                                        <span>Status da fila:</span>
                                        <span className="text-rose-700 font-bold">Vencida há 2 dias</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 6. Matriz de Bancas Alvo */}
                                  <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-primary">account_balance</span>
                                        Incidência Bancas Alvo (5 anos)
                                      </span>
                                      <span className="text-[0.625rem] font-bold text-primary">
                                        Score {content.incidence.calculatedPriorityScore}/100
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5 text-[0.6875rem]">
                                      <div className="bg-surface-container-lowest p-1.5 rounded border border-surface-container flex justify-between">
                                        <span className="text-secondary">USP-SP:</span>
                                        <strong className="font-code-metric">{content.incidence.usp} questões</strong>
                                      </div>
                                      <div className="bg-surface-container-lowest p-1.5 rounded border border-surface-container flex justify-between">
                                        <span className="text-secondary">UNIFESP:</span>
                                        <strong className="font-code-metric">{content.incidence.unifesp} questões</strong>
                                      </div>
                                      <div className="bg-surface-container-lowest p-1.5 rounded border border-surface-container flex justify-between">
                                        <span className="text-secondary">ENARE:</span>
                                        <strong className="font-code-metric">{content.incidence.enare} questões</strong>
                                      </div>
                                      <div className="bg-surface-container-lowest p-1.5 rounded border border-surface-container flex justify-between">
                                        <span className="text-secondary">UFMG:</span>
                                        <strong className="font-code-metric">{content.incidence.ufmg} questões</strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Regra Crítica: Diagnóstico Multidimensional Anti-Mascaramento */}
                                {(() => {
                                  const realExamAcc =
                                    (content.examStats.realExamHits /
                                      (content.examStats.realExamQuestions || 1)) *
                                    100;
                                  const isMasking =
                                    content.oslerEvidence?.diagnosticAlignment?.isMaskingDeficiency ||
                                    (oslerData.retentionScore >= 75 && realExamAcc < 75);

                                  if (!isMasking) return null;

                                  return (
                                    <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 space-y-2">
                                      <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-amber-800 text-base">warning</span>
                                          <strong className="text-amber-900 uppercase text-[0.6875rem] tracking-wide">
                                            Regra Crítica: O Osler não pode mascarar deficiência em provas
                                          </strong>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-code-metric font-bold text-[0.625rem]">
                                          Domínio Geral: {content.estimatedMastery}% &lt; {content.targetMastery}% meta
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.6875rem]">
                                        <div className="p-2 rounded-lg bg-white/90 border border-amber-200">
                                          <div className="flex items-center gap-1 text-emerald-800 font-bold mb-0.5">
                                            <span className="material-symbols-outlined text-xs">psychology</span>
                                            <span>Memória &amp; Pós-Vídeo Fortes</span>
                                          </div>
                                          <p className="text-[0.625rem] text-secondary">
                                            Retenção Osler: <strong className="text-indigo-900 font-code-metric">{oslerData.retentionScore.toFixed(1)}%</strong> • Pós-vídeo: <strong className="text-emerald-900 font-code-metric">{postAcc}%</strong>. Você lembra dos conceitos e consolidou a teoria.
                                          </p>
                                        </div>

                                        <div className="p-2 rounded-lg bg-white/90 border border-amber-200">
                                          <div className="flex items-center gap-1 text-rose-800 font-bold mb-0.5">
                                            <span className="material-symbols-outlined text-xs">history_edu</span>
                                            <span>Aplicação em Provas Reais Crítica</span>
                                          </div>
                                          <p className="text-[0.625rem] text-secondary">
                                            Acurácia em Provas: <strong className="text-rose-900 font-code-metric">{realExamAcc.toFixed(1)}%</strong> ({content.examStats.realExamHits}/{content.examStats.realExamQuestions}q). Dificuldade com pegadinhas, enunciados longos e contexto de banca.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-amber-200 text-[0.6875rem]">
                                        <div className="flex items-center gap-1 text-amber-950 font-medium">
                                          <span className="material-symbols-outlined text-sm text-primary">psychology_alt</span>
                                          <span>
                                            <strong>Prescrição:</strong> Priorizar bateria de questões e bancas alvo; <em>NÃO repetir aula teórica</em>.
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => setOslerModalContent(content)}
                                          className="text-primary hover:underline font-bold text-[0.6875rem] flex items-center gap-1"
                                        >
                                          <span>Abrir Dossiê Osler &amp; Amostras</span>
                                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* Action CTA inside content */}
                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    onClick={() => onStartTopic(content.name)}
                                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm"
                                  >
                                    <span className="material-symbols-outlined text-sm">tune</span>
                                    Coordenar Sessão deste Conteúdo
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAPEAMENTO DE FONTES (MEDWAY ↔ OSLER N:M) */}
      {activeTab === 'mapeamento' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Conceptual Architecture Card */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
                <span className="material-symbols-outlined text-xl">alt_route</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-on-surface">
                  Regra Estrutural nº 1 — Mapeamento Entre Fontes (Relação Muitos-para-Muitos)
                </h2>
                <p className="text-xs text-secondary leading-relaxed max-w-3xl">
                  Não assumimos que 1 conteúdo Medway = 1 bloco Osler. O aplicativo possui um <strong>currículo central</strong>{' '}
                  definido pela Medway, enquanto o Osler possui sua própria estrutura de títulos/blocos. Você faz a associação manual{' '}
                  permanente e um bloco do Osler pode até pertencer a mais de um conteúdo Medway (N:M).
                </p>
              </div>
            </div>

            {/* The 2 Relationship Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1.5">
                <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">touch_app</span>
                  1. Mapeamento Manual (Medway ↔ Osler)
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Realizado no momento do cadastro do currículo. Você seleciona os blocos/títulos do Osler que alimentam a evidência de domínio daquele tópico (ex: 4 blocos de IC associados a ICC). Essa relação fica permanentemente salva.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1.5">
                <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  2. Classificação Automática de Questões (IA)
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Quando você importa uma prova ou simulado, a IA lê o enunciado e busca automaticamente o conteúdo central correspondente dentro do currículo Medway (ex: Questão 23 → Cardiologia → ICC).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[0.625rem] text-secondary font-semibold uppercase block">Conteúdos Medway</span>
              <span className="font-code-metric text-lg font-bold text-on-surface">{allContents.length}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[0.625rem] text-secondary font-semibold uppercase block">Títulos no Catálogo Osler</span>
              <span className="font-code-metric text-lg font-bold text-indigo-700">{oslerBlocks.length}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[0.625rem] text-secondary font-semibold uppercase block">Associações N:M Ativas</span>
              <span className="font-code-metric text-lg font-bold text-primary">{mappings.length}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[0.625rem] text-secondary font-semibold uppercase block">Total Cards Integrados</span>
              <span className="font-code-metric text-lg font-bold text-emerald-700">
                {mappings.reduce((sum, m) => {
                  const b = oslerBlocks.find((blk) => blk.id === m.oslerBlockId);
                  return sum + (b ? b.cardsTotal : 0);
                }, 0)}
              </span>
            </div>
          </div>

          {/* Mapeamentos Table / List */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  Tabela Geral de Mapeamentos (Medway ↔ Osler)
                </h3>
                <p className="text-xs text-secondary">
                  Clique em &ldquo;Gerenciar&rdquo; para adicionar ou remover blocos do Osler a qualquer conteúdo central.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMappingModalContent(allContents[0])}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">add_link</span>
                  Nova Associação
                </button>
              </div>
            </div>

            <div className="divide-y divide-surface-container rounded-xl border border-surface-container overflow-hidden bg-surface-container-lowest">
              {allContents.map((content) => {
                const oslerData = getContentOslerData(content.id);

                return (
                  <div key={content.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-surface-container-low/30 transition-colors">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface">{content.name}</span>
                        <span className="text-[0.625rem] text-secondary px-1.5 py-0.2 rounded bg-surface-container">
                          {content.moduloName}
                        </span>
                      </div>

                      {/* Chips dos blocos mapeados */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {oslerData.blocks.map((b) => (
                          <span
                            key={b.id}
                            className="text-[0.6875rem] px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/60 text-indigo-800 font-medium flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[0.75rem]">style</span>
                            <span>{b.title}</span>
                            <span className="font-code-metric text-[0.625rem] text-indigo-600">({b.cardsTotal}c)</span>
                          </span>
                        ))}
                        {oslerData.blocks.length === 0 && (
                          <span className="text-[0.6875rem] text-secondary italic">
                            Nenhum bloco Osler mapeado ainda.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      <div className="text-right">
                        <span className="text-[0.625rem] text-secondary block">Cards Vinculados</span>
                        <span className="font-code-metric font-bold text-xs text-primary">
                          {oslerData.metrics.total} cards
                        </span>
                      </div>

                      <button
                        onClick={() => setMappingModalContent(content)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container text-xs font-semibold hover:bg-surface-container text-on-surface flex items-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Mapear ({oslerData.blocks.length})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catálogo de Títulos no Osler */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  Catálogo de Títulos/Blocos Cadastrados no Osler ({oslerBlocks.length})
                </h3>
                <p className="text-xs text-secondary">
                  Estrutura independente de flashcards da plataforma Osler.
                </p>
              </div>

              <button
                onClick={() => setMappingModalContent(allContents[0])}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container text-xs font-semibold hover:bg-surface-container text-on-surface flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Cadastrar Título no Osler
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {oslerBlocks.map((block) => {
                // Conteúdos Medway aos quais este bloco está associado
                const associatedContents = mappings
                  .filter((m) => m.oslerBlockId === block.id)
                  .map((m) => allContents.find((c) => c.id === m.contentId)?.name || m.contentId);

                return (
                  <div key={block.id} className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-on-surface leading-snug">
                        {block.title}
                      </span>
                      <span className="font-code-metric text-[0.625rem] font-bold px-1.5 py-0.5 rounded bg-surface-container text-secondary shrink-0">
                        {block.cardsTotal} cards
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[0.6875rem] text-secondary">
                      <span>Fácil: {block.cardsFacil}</span>
                      <span>•</span>
                      <span>Normal: {block.cardsNormal}</span>
                      <span>•</span>
                      <span>Erros: {block.cardsErros}</span>
                    </div>

                    {/* Mostra se está associado a 1 ou mais conteúdos Medway */}
                    <div className="pt-1 border-t border-surface-container text-[0.6875rem]">
                      <span className="text-secondary block text-[0.625rem]">Associado aos Conteúdos Medway:</span>
                      {associatedContents.length > 0 ? (
                        <div className="space-y-0.5 mt-0.5">
                          {associatedContents.map((name, idx) => (
                            <span
                              key={idx}
                              className="inline-block text-[0.625rem] bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-1.5 py-0.2 rounded mr-1"
                            >
                              ✓ {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-secondary italic text-[0.625rem]">Sem vínculo ativo</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ARQUITETURA DO BANCO DE DADOS RELACIONAL (30 PRINCÍPIOS) */}
      {activeTab === 'banco-relacional' && (
        <div className="animate-fadeIn">
          <BancoRelacionalView />
        </div>
      )}

      {/* Modal de Mapeamento de Fontes N:M */}
      {mappingModalContent && (
        <MapeamentoFontesModal
          content={mappingModalContent}
          oslerBlocks={oslerBlocks}
          mappings={mappings}
          allContents={allContents}
          onSaveMappings={handleSaveMappings}
          onCreateOslerBlock={handleCreateOslerBlock}
          onClose={() => setMappingModalContent(null)}
        />
      )}

      {/* Modal de Trajetória Longitudinal Medway (Baseline, Pós e Reavaliações) */}
      {medwayModalContent && (
        <MedwayTrajetoriaModal
          content={medwayModalContent}
          onClose={() => setMedwayModalContent(null)}
          onAddEvaluation={handleAddMedwayEvaluation}
        />
      )}

      {/* Modal de Dossiê e Evidência de Memória Osler (Qualitativa + Recência + Alinhamento) */}
      {oslerModalContent && (
        <OslerEvidenceModal
          content={oslerModalContent}
          onClose={() => setOslerModalContent(null)}
          onUpdateEvidence={handleUpdateOslerEvidence}
        />
      )}

      {/* Modal de Evidência de Aplicação: Provas Reais (Bancas-alvo, Recência e Erros) */}
      {realExamModalContent && (
        <RealExamEvidenceModal
          content={realExamModalContent}
          onClose={() => setRealExamModalContent(null)}
          onAddQuestion={handleAddRealExamQuestion}
        />
      )}

      {/* Modal de Evidência de Aplicação Integrada: Simulados (Fadiga, Ritmo e Desempenho Global) */}
      {simuladoModalContent && (
        <SimuladoEvidenceModal
          content={simuladoModalContent}
          onClose={() => setSimuladoModalContent(null)}
          onAddQuestion={handleAddSimuladoQuestion}
        />
      )}

      {/* Modal do Cérebro de Domínio (4 Dimensões: Conhecimento, Aplicação, Retenção e Confiança) */}
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
            const c = dominioModalContent;
            setDominioModalContent(null);
            setOslerModalContent(c);
          }}
          onNavigateToMedway={() => {
            const c = dominioModalContent;
            setDominioModalContent(null);
            setMedwayModalContent(c);
          }}
        />
      )}
    </div>
  );
};
