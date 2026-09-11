import React, { useState } from 'react';
import { ContentItem, ErrorReasonType, SimuladoEvidenceSummary } from '../types';
import { errorReasonConfig, mockGlobalSimuladosHistory } from '../data/mockData';

interface SimuladoEvidenceModalProps {
  content: ContentItem;
  onClose: () => void;
  onAddSimuladoQuestion?: (contentId: string, hit: boolean, reason?: ErrorReasonType) => void;
}

export const SimuladoEvidenceModal: React.FC<SimuladoEvidenceModalProps> = ({
  content,
  onClose,
  onAddSimuladoQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'conteudo' | 'global' | 'fadiga'>('conteudo');
  const [showSimulateAction, setShowSimulateAction] = useState(false);
  const [simHit, setSimHit] = useState(true);
  const [simReason, setSimReason] = useState<ErrorReasonType>('desatencao');

  const simuladoEvidence: SimuladoEvidenceSummary = content.simuladoEvidence || {
    integratedAccuracy: ((content.examStats.simuladoHits / (content.examStats.simuladoQuestions || 1)) * 100),
    weightInApplication: 0.75,
    totalQuestions: content.examStats.simuladoQuestions,
    hits: content.examStats.simuladoHits,
    errorReasonBreakdown: {
      desatencao: 2,
      interpretacao: 1,
      entre_duas: 1,
      nao_sabia: 0,
      esqueci: 0,
      raciocinio: 0,
      outro: 0,
    },
    executionMetrics: {
      avgSecondsPerQuestion: 132,
      earlyQuestionsAccuracy: 88.0,
      lateQuestionsAccuracy: 64.0,
      fatigueDropPercent: -24.0,
      paceDiagnosis: 'Queda de acurácia após 3h de prova. Erros concentrados na fadiga cognitiva e tempo, e não em lacuna teórica.',
    },
    simuladosMapped: [
      {
        simuladoId: 'sim-2026-3',
        simuladoTitle: 'Simulado Nacional ENARE 2025 #3',
        date: '28/08/2026',
        questionsCount: 5,
        hitsCount: 4,
        accuracy: 80.0,
        globalSimuladoScore: 78.0,
      },
      {
        simuladoId: 'sim-2026-2',
        simuladoTitle: 'Simulado Geral Medway Ciclo 2',
        date: '10/08/2026',
        questionsCount: 5,
        hitsCount: 4,
        accuracy: 80.0,
        globalSimuladoScore: 75.0,
      },
      {
        simuladoId: 'sim-2026-1',
        simuladoTitle: 'Simulado Diagnóstico Integrado #1',
        date: '15/07/2026',
        questionsCount: 5,
        hitsCount: 3,
        accuracy: 60.0,
        globalSimuladoScore: 68.0,
      },
    ],
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddSimuladoQuestion) {
      onAddSimuladoQuestion(content.id, simHit, simHit ? undefined : simReason);
    }
    setShowSimulateAction(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-surface-container flex items-start justify-between gap-4 bg-surface-container-low/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold font-code-metric flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">tune</span>
                Evidência de Aplicação Integrada: Simulados
              </span>
              <span className="text-xs text-secondary">• Peso 75% na aplicação</span>
              <span className="text-xs text-secondary">• Contexto Real de Prova</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
              {content.name}
            </h2>
            <p className="text-xs text-secondary leading-relaxed max-w-2xl">
              Avalia a capacidade de integrar conteúdos sob restrição de tempo, mudança abrupta de especialidades e fadiga acumulada em provas de 100 questões.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
            title="Fechar"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-surface-container bg-surface-container-lowest text-xs font-semibold">
          <button
            onClick={() => setActiveTab('conteudo')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'conteudo'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">target</span>
            Desempenho no Conteúdo ({simuladoEvidence.integratedAccuracy.toFixed(1)}%)
          </button>

          <button
            onClick={() => setActiveTab('fadiga')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'fadiga'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">timer</span>
            Tempo, Ritmo &amp; Fadiga Cognitiva
          </button>

          <button
            onClick={() => setActiveTab('global')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'global'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">trending_up</span>
            Evolução Global dos Simulados (68% → 81%)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-on-surface">
          {/* TAB 1: Desempenho no Conteúdo */}
          {activeTab === 'conteudo' && (
            <div className="space-y-6">
              {/* KPIs de Simulado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-teal-900">
                    <span className="font-semibold">Aplicação Integrada</span>
                    <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-teal-200/80 font-bold">
                      75% da Força
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-code-metric text-teal-900">
                    {simuladoEvidence.integratedAccuracy.toFixed(1)}%
                  </div>
                  <p className="text-[0.6875rem] text-teal-800">
                    {simuladoEvidence.hits} acertos em {simuladoEvidence.totalQuestions} questões em simulados nacionais.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <span className="font-semibold">Tempo Médio / Questão</span>
                    <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-surface-container font-code-metric">
                      Alvo: 2m24s
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-code-metric text-on-surface">
                    {Math.floor(simuladoEvidence.executionMetrics.avgSecondsPerQuestion / 60)}m{' '}
                    {simuladoEvidence.executionMetrics.avgSecondsPerQuestion % 60}s
                  </div>
                  <p className="text-[0.6875rem] text-emerald-700 font-semibold">
                    ✓ 12s mais rápido que o teto regulamentar (2m24s).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <span className="font-semibold">Regra FSRS</span>
                    <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      Proteção
                    </span>
                  </div>
                  <div className="text-xs font-bold text-on-surface mt-1 leading-snug">
                    Erro isolado em simulado NÃO reseta FSRS automaticamente
                  </div>
                  <p className="text-[0.625rem] text-secondary">
                    Se Osler e Medway forem altos e erro for desatenção, não há reset de estabilidade.
                  </p>
                </div>
              </div>

              {/* Matriz Diagnóstica: O que fazer diante das evidências */}
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-teal-700">compare_arrows</span>
                    Alinhamento Cruzado das Fontes para {content.name}
                  </h3>
                  <span className="text-[0.625rem] text-secondary">Interpretação Integrada</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <span className="text-[0.6875rem] text-secondary block">Medway (Aula)</span>
                    <strong className="text-base font-bold font-code-metric text-emerald-800">86.7%</strong>
                    <span className="text-[0.625rem] text-emerald-700 block mt-0.5 font-medium">✓ Aprendizado OK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <span className="text-[0.6875rem] text-secondary block">Osler (Memória)</span>
                    <strong className="text-base font-bold font-code-metric text-indigo-700">89.2%</strong>
                    <span className="text-[0.625rem] text-indigo-700 block mt-0.5 font-medium">✓ Retenção OK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <span className="text-[0.6875rem] text-secondary block">Simulados</span>
                    <strong className="text-base font-bold font-code-metric text-teal-800">
                      {simuladoEvidence.integratedAccuracy.toFixed(1)}%
                    </strong>
                    <span className="text-[0.625rem] text-teal-700 block mt-0.5 font-medium">Aplicação Integrada</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300">
                    <span className="text-[0.6875rem] text-amber-900 block font-semibold">Provas Reais</span>
                    <strong className="text-base font-bold font-code-metric text-rose-800">58.3%</strong>
                    <span className="text-[0.625rem] text-rose-700 block mt-0.5 font-bold">⚠️ Gargalo em Bancas</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs space-y-1">
                  <div className="font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                    <span>Diagnóstico Clínico do Sistema:</span>
                  </div>
                  <p className="text-[0.6875rem] text-secondary leading-relaxed">
                    Você aprendeu bem a teoria (Medway 86,7%), lembra perfeitamente dos conceitos clínicos (Osler 89,2%) e mantém bom raciocínio em simulados com tempo controlado (73,3%). Seu déficit é <strong>específico de estilo de banca e pegadinhas em provas reais (USP-RP 58,3%)</strong>.
                  </p>
                  <div className="pt-1 text-[0.6875rem] text-primary font-bold">
                    → Ação: Resolver baterias exclusivas da banca USP-RP com estudo reverso das justificativas. Proibido reassistir à aula de ICC.
                  </div>
                </div>
              </div>

              {/* Simulados Mapeados com Questoes deste Conteúdo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-teal-700">assignment</span>
                    Simulados Mapeados com Questões deste Conteúdo ({simuladoEvidence.simuladosMapped.length})
                  </h3>
                  <button
                    onClick={() => setShowSimulateAction(true)}
                    className="px-2.5 py-1 rounded-lg bg-teal-800 text-white text-[0.6875rem] font-bold hover:bg-teal-900 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    Registrar Questão de Simulado
                  </button>
                </div>

                <div className="space-y-2">
                  {simuladoEvidence.simuladosMapped.map((sim) => (
                    <div
                      key={sim.simuladoId}
                      className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-on-surface">{sim.simuladoTitle}</strong>
                          <span className="text-[0.625rem] text-secondary">{sim.date}</span>
                        </div>
                        <div className="text-[0.6875rem] text-secondary">
                          Score Geral do Simulado: <strong className="font-code-metric text-on-surface">{sim.globalSimuladoScore}%</strong> • {sim.questionsCount} questões de {content.name}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-code-metric font-bold text-teal-800 block">
                          {sim.hitsCount}/{sim.questionsCount} ({sim.accuracy.toFixed(0)}%)
                        </span>
                        <span className="text-[0.5625rem] text-secondary">
                          acurácia no tema
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Tempo, Ritmo e Fadiga Cognitiva */}
          {activeTab === 'fadiga' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-teal-700">hourglass_top</span>
                      Degradação por Fadiga Cognitiva ao Longo da Prova
                    </h3>
                    <p className="text-[0.6875rem] text-secondary mt-0.5">
                      Compara a acurácia no início da prova (questões 1-50) versus no final da prova (questões 51-100).
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-code-metric font-bold text-xs">
                    {simuladoEvidence.executionMetrics.fatigueDropPercent}% no terço final
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">wb_sunny</span>
                        Início da Prova (Fresco)
                      </span>
                      <strong className="text-lg font-bold font-code-metric text-emerald-900">
                        {simuladoEvidence.executionMetrics.earlyQuestionsAccuracy}%
                      </strong>
                    </div>
                    <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${simuladoEvidence.executionMetrics.earlyQuestionsAccuracy}%` }}
                      />
                    </div>
                    <p className="text-[0.625rem] text-emerald-800">
                      Raciocínio clínico lúcido, atenção a detalhes e distratores sem pressa.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-950 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">battery_alert</span>
                        Final da Prova (Fadiga Acumulada)
                      </span>
                      <strong className="text-lg font-bold font-code-metric text-rose-900">
                        {simuladoEvidence.executionMetrics.lateQuestionsAccuracy}%
                      </strong>
                    </div>
                    <div className="h-2 bg-rose-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-600 rounded-full"
                        style={{ width: `${simuladoEvidence.executionMetrics.lateQuestionsAccuracy}%` }}
                      />
                    </div>
                    <p className="text-[0.625rem] text-rose-800">
                      Leitura apressada, impulsividade na marcação e perda de pontos fáceis por cansaço.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-800 text-sm">psychology_alt</span>
                    <span>Diagnóstico de Execução de Prova:</span>
                  </div>
                  <p className="text-[0.6875rem] text-amber-900 leading-relaxed">
                    {simuladoEvidence.executionMetrics.paceDiagnosis}
                  </p>
                  <p className="text-[0.6875rem] text-amber-900 font-semibold pt-1">
                    💡 Intervenção estratégica: Treinar pausas de 45 segundos para hidratação a cada 30 questões e inverter ordem das especialidades para não deixar Cardiologia/ICC no final.
                  </p>
                </div>
              </div>

              {/* Motivos de Erro em Simulados */}
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container space-y-3">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                  Distribuição de Erros em Simulados
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <strong className="text-lg font-bold font-code-metric text-amber-700 block">
                      {simuladoEvidence.errorReasonBreakdown.desatencao || 2}
                    </strong>
                    <span className="text-[0.6875rem] font-bold text-on-surface">Desatenção</span>
                    <span className="text-[0.5625rem] text-secondary block">Pressa/fadiga</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <strong className="text-lg font-bold font-code-metric text-rose-700 block">
                      {simuladoEvidence.errorReasonBreakdown.interpretacao || 1}
                    </strong>
                    <span className="text-[0.6875rem] font-bold text-on-surface">Interpretação</span>
                    <span className="text-[0.5625rem] text-secondary block">Distrator confuso</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <strong className="text-lg font-bold font-code-metric text-purple-700 block">
                      {simuladoEvidence.errorReasonBreakdown.entre_duas || 1}
                    </strong>
                    <span className="text-[0.6875rem] font-bold text-on-surface">Entre Duas</span>
                    <span className="text-[0.5625rem] text-secondary block">Insegurança</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <strong className="text-lg font-bold font-code-metric text-emerald-700 block">
                      {simuladoEvidence.errorReasonBreakdown.nao_sabia || 0}
                    </strong>
                    <span className="text-[0.6875rem] font-bold text-on-surface">Não Sabia</span>
                    <span className="text-[0.5625rem] text-secondary block">Zero lacunas puras</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Evolução Global dos Simulados */}
          {activeTab === 'global' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-teal-700">timeline</span>
                      Trajetória Global do Candidato em Simulados (100 questões)
                    </h3>
                    <p className="text-[0.6875rem] text-secondary mt-0.5">
                      Mostra se você está evoluindo como concorrente de residência: <strong>68% → 72% → 75% → 78% → 81%</strong>.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-code-metric font-bold text-xs">
                    +13 p.p. de Ganho Global
                  </span>
                </div>

                <div className="space-y-2.5">
                  {mockGlobalSimuladosHistory.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-surface-container font-code-metric font-bold text-[0.6875rem]">
                            #{mockGlobalSimuladosHistory.length - idx} • {item.date}
                          </span>
                          <strong className="text-xs text-on-surface">{item.title}</strong>
                          <span className="text-[0.625rem] text-secondary">({item.institution})</span>
                        </div>
                        <div className="text-[0.6875rem] text-secondary flex items-center gap-3">
                          <span>⏱️ {item.timeSpent} ({item.avgTimePerQuestion}/q)</span>
                          <span>🏆 {item.percentile}</span>
                          <span className="text-secondary">• {item.fatigueDrop}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-bold font-code-metric text-primary block">
                          {item.scorePercent.toFixed(1)}%
                        </span>
                        <span className="text-[0.5625rem] text-secondary">
                          {item.hits}/{item.totalQuestions} acertos
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-surface-container flex items-center justify-between bg-surface-container-low/30">
          <div className="text-xs text-secondary">
            Simulados integram resistência psicológica, velocidade e acurácia.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 transition-all"
          >
            Fechar Análise
          </button>
        </div>
      </div>

      {/* Modal Interno para Registrar Questão de Simulado */}
      {showSimulateAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-scrim/60 p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-sm text-on-surface">Registrar Questão de Simulado</h3>
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-secondary mb-1">Resultado na Questão</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSimHit(true)}
                    className={`flex-1 py-2 rounded-lg font-bold border ${
                      simHit ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-surface-container-low border-surface-container text-secondary'
                    }`}
                  >
                    Acerto ✅
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimHit(false)}
                    className={`flex-1 py-2 rounded-lg font-bold border ${
                      !simHit ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-surface-container-low border-surface-container text-secondary'
                    }`}
                  >
                    Erro ❌
                  </button>
                </div>
              </div>

              {!simHit && (
                <div>
                  <label className="block text-secondary mb-1">Motivo do Erro</label>
                  <select
                    value={simReason}
                    onChange={(e) => setSimReason(e.target.value as ErrorReasonType)}
                    className="w-full h-8 px-2 bg-surface-container-low rounded-lg border border-surface-container text-xs"
                  >
                    <option value="desatencao">Desatenção (pressa/fadiga)</option>
                    <option value="interpretacao">Interpretei errado</option>
                    <option value="entre_duas">Fiquei entre duas alternativas</option>
                    <option value="nao_sabia">Não sabia a teoria</option>
                    <option value="esqueci">Esqueci da conduta</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowSimulateAction(false)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-800 text-white font-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
