import React, { useState } from 'react';
import { ContentItem } from '../types';
import { calculateContentDomain, calculateStudyPriorityScore } from '../utils/domainCalculator';

interface DominioDossieModalProps {
  content: ContentItem;
  onClose: () => void;
  onNavigateToRealExams?: () => void;
  onNavigateToOsler?: () => void;
  onNavigateToMedway?: () => void;
}

export const DominioDossieModal: React.FC<DominioDossieModalProps> = ({
  content,
  onClose,
  onNavigateToRealExams,
  onNavigateToOsler,
  onNavigateToMedway,
}) => {
  // Simulador interativo local para demonstrar o cérebro dinâmico
  const [simulatedRealHitsBonus, setSimulatedRealHitsBonus] = useState<number>(0);
  const [simulatedRealTotalBonus, setSimulatedRealTotalBonus] = useState<number>(0);

  // Criar clone com dados simulados caso o usuário use os controles
  const activeContent: ContentItem = {
    ...content,
    examStats: {
      ...content.examStats,
      realExamQuestions: (content.examStats?.realExamQuestions || 0) + simulatedRealTotalBonus,
      realExamHits: (content.examStats?.realExamHits || 0) + simulatedRealHitsBonus,
    },
  };

  const domainData = calculateContentDomain(activeContent);
  const priorityData = calculateStudyPriorityScore(activeContent);

  // Obter cores do status
  const getStatusBadge = () => {
    switch (domainData.status) {
      case 'consolidado':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: 'verified',
          label: '🟢 Consolidado',
          tag: 'Meta de 85% Atingida com Confiança',
        };
      case 'aplicacao_insuficiente':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/40',
          icon: 'warning',
          label: '🟠 Aplicação Insuficiente',
          tag: 'Conhecimento Alto, Aplicação Defasada',
        };
      case 'insuficiente':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: 'error',
          label: '🔴 Insuficiente',
          tag: 'Déficit Acentuado (< 65%)',
        };
      case 'nao_avaliado':
        return {
          bg: 'bg-surface-container text-secondary border-surface-container-high',
          icon: 'help',
          label: '⚪ Não Avaliado',
          tag: 'Sem Evidências Suficientes',
        };
      case 'em_consolidacao':
      default:
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: 'trending_up',
          label: '🟡 Em Consolidação',
          tag: 'Trajetória Ativa de Aprendizagem',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl border border-surface-container shadow-2xl overflow-hidden my-6">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-surface-container bg-surface-container-low/60 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap text-xs text-secondary font-medium">
              <span className="px-2 py-0.5 rounded-md bg-surface-container font-semibold text-on-surface">
                {content.areaName}
              </span>
              <span>&bull;</span>
              <span>{content.moduloName}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-primary font-semibold">
                <span className="material-symbols-outlined text-xs">analytics</span>
                Incidência: {content.incidence?.generalRating || 'Alta'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-headline-sm text-on-surface flex items-center gap-2">
              <span>{content.name}</span>
              {domainData.isProvisional && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-semibold">
                  Domínio Provisório
                </span>
              )}
            </h1>

            <p className="text-xs text-secondary max-w-2xl">
              Dossiê analítico do &ldquo;Cérebro de Domínio&rdquo; da plataforma: decomposição das 4 dimensões pedagógicas, diagnóstico do gargalo e prioridade no planejamento.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-secondary hover:text-on-surface hover:bg-surface-container rounded-full transition-colors shrink-0"
            title="Fechar Dossiê"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Corpo Principal com Scroll */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Card Principal: Domínio Geral + Status + Diagnóstico Cirúrgico */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container pb-5">
              <div className="flex items-center gap-4">
                {/* Gauge / Valor do Domínio Geral */}
                <div className="relative w-20 h-20 rounded-2xl bg-surface-container-lowest border-2 border-primary/20 flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[0.625rem] font-bold text-secondary tracking-wider uppercase">
                    Domínio
                  </span>
                  <span className="font-code-metric font-extrabold text-2xl text-primary">
                    {domainData.overallDomain}%
                  </span>
                  <span className="text-[0.5625rem] text-secondary font-medium">Meta: 85%</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}
                    >
                      <span className="material-symbols-outlined text-sm">{statusBadge.icon}</span>
                      <span>{statusBadge.label}</span>
                    </span>
                    <span className="text-xs text-secondary hidden sm:inline">&bull; {statusBadge.tag}</span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface">
                    {domainData.diagnostic.headline}
                  </h3>

                  <p className="text-xs text-secondary leading-relaxed max-w-xl">
                    {domainData.diagnostic.description}
                  </p>
                </div>
              </div>

              {/* Box de Ação Prescrita */}
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container shrink-0 md:w-72 space-y-2">
                <span className="text-[0.6875rem] font-bold text-primary tracking-wider uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">{domainData.diagnostic.actionIcon}</span>
                  Próxima Ação Sugerida
                </span>
                <p className="text-xs font-semibold text-on-surface leading-snug">
                  {domainData.diagnostic.prescribedAction}
                </p>
              </div>
            </div>

            {/* As 4 Dimensões Essenciais (Não um único número escondendo tudo) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface uppercase tracking-wider text-[0.6875rem]">
                  Os 4 Componentes do Domínio
                </span>
                <span className="text-secondary text-[0.6875rem]">
                  Pesos Base: 📚 Conhecimento {domainData.weights.knowledgeWeight}% &bull; 🎯 Aplicação{' '}
                  {domainData.weights.applicationWeight}% &bull; 🧠 Retenção {domainData.weights.retentionWeight}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. 📚 Conhecimento */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📚</span>
                      <span className="text-xs font-bold text-on-surface">Conhecimento</span>
                    </div>
                    <span className="font-code-metric font-extrabold text-base text-blue-700">
                      {domainData.knowledgeScore}%
                    </span>
                  </div>

                  <p className="text-[0.6875rem] text-secondary italic leading-tight">
                    &ldquo;Eu aprendi e consigo resolver questões de aprendizagem?&rdquo;
                  </p>

                  <div className="space-y-1 pt-1 border-t border-surface-container text-[0.6875rem] text-secondary">
                    <div className="flex justify-between">
                      <span>Pós-Aula Medway:</span>
                      <strong className="text-on-surface font-code-metric">
                        {content.postVideoQuestions?.accuracy || 0}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Baseline (Pré):</span>
                      <span className="text-secondary font-code-metric">
                        {content.preVideoQuestions?.accuracy || 0}% (não penaliza)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amostragem:</span>
                      <span className="text-on-surface font-medium">
                        {domainData.evidenceStats.medwayQuestionsCount} questões
                      </span>
                    </div>
                  </div>

                  {onNavigateToMedway && (
                    <button
                      onClick={onNavigateToMedway}
                      className="w-full mt-1 py-1 rounded-lg bg-surface-container hover:bg-blue-50 hover:text-blue-800 text-secondary text-[0.6875rem] font-semibold transition-colors"
                    >
                      Ver Trajetória Medway
                    </button>
                  )}
                </div>

                {/* 2. 🎯 Aplicação */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2.5 ring-1 ring-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🎯</span>
                      <span className="text-xs font-bold text-on-surface">Aplicação</span>
                    </div>
                    <span
                      className={`font-code-metric font-extrabold text-base ${
                        domainData.applicationScore < 72 ? 'text-amber-800' : 'text-emerald-800'
                      }`}
                    >
                      {domainData.applicationScore}%
                    </span>
                  </div>

                  <p className="text-[0.6875rem] text-secondary italic leading-tight">
                    &ldquo;Consigo usar esse conhecimento em questões de prova?&rdquo;
                  </p>

                  <div className="space-y-1 pt-1 border-t border-surface-container text-[0.6875rem] text-secondary">
                    <div className="flex justify-between">
                      <span>Provas Reais:</span>
                      <strong className="text-emerald-800 font-code-metric">
                        {domainData.evidenceStats.realExamAccuracy}% ({domainData.evidenceStats.realExamQuestionsCount}q)
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Simulados:</span>
                      <strong className="text-purple-800 font-code-metric">
                        {domainData.evidenceStats.simuladoAccuracy}% ({domainData.evidenceStats.simuladoQuestionsCount}q)
                      </strong>
                    </div>
                    <div className="flex justify-between text-[0.625rem] text-secondary">
                      <span>Suavização:</span>
                      <span className="text-primary font-medium">Beta-Binomial (M=8)</span>
                    </div>
                  </div>

                  {onNavigateToRealExams && (
                    <button
                      onClick={onNavigateToRealExams}
                      className="w-full mt-1 py-1 rounded-lg bg-surface-container hover:bg-emerald-50 hover:text-emerald-800 text-secondary text-[0.6875rem] font-semibold transition-colors"
                    >
                      Dossiê Provas Reais
                    </button>
                  )}
                </div>

                {/* 3. 🧠 Retenção */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🧠</span>
                      <span className="text-xs font-bold text-on-surface">Retenção</span>
                    </div>
                    <span className="font-code-metric font-extrabold text-base text-purple-800">
                      {domainData.retentionScore}%
                    </span>
                  </div>

                  <p className="text-[0.6875rem] text-secondary italic leading-tight">
                    &ldquo;Consigo recuperar esse conhecimento ao longo do tempo?&rdquo;
                  </p>

                  <div className="space-y-1 pt-1 border-t border-surface-container text-[0.6875rem] text-secondary">
                    <div className="flex justify-between">
                      <span>Osler FSRS:</span>
                      <strong className="text-purple-800 font-code-metric">
                        {domainData.evidenceStats.oslerRetentionRate}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estabilidade:</span>
                      <span className="text-on-surface font-semibold">
                        {domainData.evidenceStats.fsrsStabilityDays} dias
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cartões Revisados:</span>
                      <span className="text-on-surface font-medium">
                        {domainData.evidenceStats.oslerCardsReviewedCount} cartões
                      </span>
                    </div>
                  </div>

                  {onNavigateToOsler && (
                    <button
                      onClick={onNavigateToOsler}
                      className="w-full mt-1 py-1 rounded-lg bg-surface-container hover:bg-purple-50 hover:text-purple-800 text-secondary text-[0.6875rem] font-semibold transition-colors"
                    >
                      Dossiê Osler &amp; FSRS
                    </button>
                  )}
                </div>

                {/* 4. 📊 Confiança */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📊</span>
                      <span className="text-xs font-bold text-on-surface">Confiança</span>
                    </div>
                    <span
                      className={`font-code-metric font-extrabold text-base capitalize ${
                        domainData.confidenceLevel === 'alta'
                          ? 'text-emerald-800'
                          : domainData.confidenceLevel === 'media'
                          ? 'text-amber-800'
                          : 'text-rose-700'
                      }`}
                    >
                      {domainData.confidenceLevel}
                    </span>
                  </div>

                  <p className="text-[0.6875rem] text-secondary italic leading-tight">
                    &ldquo;Quanto podemos confiar nessa estimativa?&rdquo;
                  </p>

                  {/* Barra de Confiança */}
                  <div className="space-y-1 pt-1 border-t border-surface-container">
                    <div className="flex justify-between text-[0.6875rem] text-secondary">
                      <span>Nível Global:</span>
                      <span className="font-bold text-on-surface">{domainData.confidenceScore}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          domainData.confidenceLevel === 'alta'
                            ? 'bg-emerald-600'
                            : domainData.confidenceLevel === 'media'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${domainData.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-[0.5625rem] text-secondary block mt-1 leading-tight">
                      Mede a certeza amostral (nunca penaliza a nota do domínio).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 🚨 TRAVA DE SEGURANÇA PARA CONSOLIDAÇÃO & SUAVIZAÇÃO BAYESIANA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Painel da Regra de Segurança */}
              <div
                className={`p-4 rounded-xl border ${
                  domainData.safetyRuleCheck?.isBlockedBySafetyRule
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
                    : domainData.safetyRuleCheck?.isConsolidated
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-surface-container-lowest border-surface-container'
                } space-y-2.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">security</span>
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Regra de Segurança para &ldquo;Consolidado&rdquo;
                    </h4>
                  </div>
                  {domainData.safetyRuleCheck?.isBlockedBySafetyRule && (
                    <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                      TRAVA ATIVA
                    </span>
                  )}
                  {domainData.safetyRuleCheck?.isConsolidated && (
                    <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                      AUDITADO 🟢
                    </span>
                  )}
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                  Para ser <strong>Consolidado</strong>, não basta o Domínio Geral atingir a meta. Todas as dimensões críticas devem ultrapassar o corte mínimo de segurança:
                </p>

                {/* 4 Critérios de Auditoria */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-lg border flex items-center justify-between ${
                      domainData.safetyRuleCheck?.passedOverallDomain
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-surface-container text-secondary border-surface-container-high'
                    }`}
                  >
                    <span>Domínio Geral ≥ 85%:</span>
                    <strong className="font-code-metric">
                      {domainData.overallDomain}% {domainData.safetyRuleCheck?.passedOverallDomain ? '✓' : '✗'}
                    </strong>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center justify-between ${
                      domainData.safetyRuleCheck?.passedApplication
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                    }`}
                  >
                    <span>Aplicação ≥ 80%:</span>
                    <strong className="font-code-metric">
                      {domainData.applicationScore}% {domainData.safetyRuleCheck?.passedApplication ? '✓' : '✗'}
                    </strong>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center justify-between ${
                      domainData.safetyRuleCheck?.passedRetention
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                    }`}
                  >
                    <span>Retenção ≥ 80%:</span>
                    <strong className="font-code-metric">
                      {domainData.retentionScore}% {domainData.safetyRuleCheck?.passedRetention ? '✓' : '✗'}
                    </strong>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center justify-between ${
                      domainData.safetyRuleCheck?.passedConfidence
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-surface-container text-secondary border-surface-container-high'
                    }`}
                  >
                    <span>Confiança não baixa:</span>
                    <strong className="capitalize">
                      {domainData.confidenceLevel} {domainData.safetyRuleCheck?.passedConfidence ? '✓' : '✗'}
                    </strong>
                  </div>
                </div>

                {domainData.safetyRuleCheck?.isBlockedBySafetyRule && (
                  <div className="p-2.5 rounded-lg bg-amber-100/90 text-amber-950 border border-amber-300 text-xs font-medium">
                    ⚠️ <strong>Bloqueio Pedagógico:</strong> {domainData.safetyRuleCheck.blockReason}
                  </div>
                )}
              </div>

              {/* Painel da Suavização Bayesiana & Confiança Multidimensional */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">ssid_chart</span>
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Suavização Estatística (Beta-Binomial)
                  </h4>
                </div>

                <div className="text-xs text-secondary leading-relaxed">
                  {domainData.bayesianSmoothing?.interpretation}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container text-xs">
                  <div>
                    <span className="text-secondary">Taxa Observada Bruta:</span>{' '}
                    <strong className="text-on-surface font-code-metric">
                      {domainData.bayesianSmoothing?.rawObservedAccuracy}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-secondary">Estimativa Suavizada:</span>{' '}
                    <strong className="text-primary font-code-metric">
                      {domainData.bayesianSmoothing?.smoothedAccuracy}%
                    </strong>
                  </div>
                </div>

                {/* 3 Componentes da Confiança */}
                <div className="pt-2 border-t border-surface-container space-y-1.5">
                  <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-wider block">
                    Componentes da Confiança (Sem Cortes Bruscos)
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-md bg-surface-container text-[0.6875rem]">
                      <span className="text-secondary block">📦 Quantidade</span>
                      <strong className="text-on-surface font-code-metric">
                        {domainData.confidenceComponents?.quantityScore}%
                      </strong>
                    </div>
                    <div className="p-1.5 rounded-md bg-surface-container text-[0.6875rem]">
                      <span className="text-secondary block">🔄 Consistência</span>
                      <strong className="text-on-surface font-code-metric">
                        {domainData.confidenceComponents?.consistencyScore}%
                      </strong>
                    </div>
                    <div className="p-1.5 rounded-md bg-surface-container text-[0.6875rem]">
                      <span className="text-secondary block">🌎 Diversidade</span>
                      <strong className="text-on-surface font-code-metric">
                        {domainData.confidenceComponents?.diversityScore}%
                      </strong>
                    </div>
                  </div>

                  <p className="text-[0.6875rem] text-secondary italic leading-tight pt-1">
                    {domainData.confidenceComponents?.summaryPhrase}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raciocínio Pedagógico: Por que o Domínio não é uma Média Ingênua? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: O Princípio do Gargalo de Aplicação */}
            <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">psychology_alt</span>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Por que não fazemos Conhecimento × 33% + Aplicação × 33% + Retenção × 33%?
                </h4>
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                Imagine um aluno com: <br />
                <strong className="text-on-surface">Conhecimento = 95%</strong>,{' '}
                <strong className="text-on-surface">Retenção = 95%</strong>, mas{' '}
                <strong className="text-rose-800">Aplicação = 50%</strong>. <br />
                Uma média aritmética simples apontaria <strong className="text-on-surface">80%</strong>. Porém, para a prova de residência médica, esse número seria uma ilusão perigosa: você sabe o conteúdo, lembra dos detalhes, mas é reprovado na prova porque não consegue resolver a questão real sob a banca.
              </p>

              <div className="p-2.5 rounded-lg bg-surface-container text-xs text-on-surface border border-surface-container-high font-medium">
                🛡️ <strong>Regra do Cérebro:</strong> O Domínio Geral reflete preponderantemente a aplicação quando já houver evidência de provas, alertando para o <em>gargalo seletivo de aplicação</em>.
              </div>
            </div>

            {/* Box 2: Cérebro 2 — Priorização no Estudo */}
            <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">psychology</span>
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    🎯 Cérebro 2: O que eu devo fazer agora?
                  </h4>
                </div>
                <span
                  className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full border ${
                    domainData.brain2?.urgencyLabel === 'Urgente'
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : domainData.brain2?.urgencyLabel === 'Alta'
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : domainData.brain2?.urgencyLabel === 'Média'
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  Urgência: {domainData.brain2?.urgencyLabel} ({domainData.brain2?.score}/100)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container space-y-1.5">
                  <div className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                    <span>{domainData.brain2?.headline}</span>
                  </div>
                  <p className="text-[0.6875rem] text-secondary leading-relaxed">
                    {domainData.brain2?.justification}
                  </p>
                </div>

                {/* Prescrição Direta */}
                <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[0.625rem] uppercase font-bold text-primary tracking-wider block">
                      Ação Prescrita pelo Algoritmo:
                    </span>
                    <span className="text-xs font-semibold text-on-surface">
                      {domainData.brain2?.prescribedAction}
                    </span>
                  </div>

                  {domainData.brain2?.actionType === 'questoes_prova' && onNavigateToRealExams && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToRealExams();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-colors shrink-0"
                    >
                      Ir para Provas
                    </button>
                  )}

                  {domainData.brain2?.actionType === 'revisao_fsrs' && onNavigateToOsler && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToOsler();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-colors shrink-0"
                    >
                      Revisar Osler
                    </button>
                  )}

                  {domainData.brain2?.actionType === 'teoria_exercicios' && onNavigateToMedway && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToMedway();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-colors shrink-0"
                    >
                      Assistir Aula
                    </button>
                  )}
                </div>

                {/* Fatores Ponderados pelo Cérebro 2 - Os 6 Grupos de Fatores */}
                <div className="space-y-2 pt-1 border-t border-surface-container">
                  <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-wider block">
                    Matriz dos 6 Fatores de Priorização (Cérebro 2)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[0.6875rem]">
                    {/* Fator 1: Déficit */}
                    <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/60 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-medium">🧠 Déficit</span>
                        <span className="font-bold text-on-surface font-code-metric">
                          {domainData.brain2?.factors?.domainDeficit ?? 15} pts
                        </span>
                      </div>
                      <p className="text-[0.625rem] text-secondary leading-tight truncate">
                        Gargalo: <strong className="text-rose-700 capitalize">{domainData.brain2?.factors?.criticalBottleneck || 'Aplicação'}</strong>
                      </p>
                    </div>

                    {/* Fator 2: Incidência */}
                    <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/60 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-medium">🎯 Incidência</span>
                        <span className="font-bold text-primary font-code-metric">
                          {domainData.brain2?.factors?.targetInstitutionsIncidenceScore ?? 75}/100
                        </span>
                      </div>
                      <p className="text-[0.625rem] text-secondary leading-tight truncate">
                        Alvo: {domainData.brain2?.factors?.targetInstitutionsIncidenceScore ?? 75} • Geral: {domainData.brain2?.factors?.generalIncidenceScore ?? 65}
                      </p>
                    </div>

                    {/* Fator 3: Revisão */}
                    <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/60 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-medium">🔄 Revisão</span>
                        <span className={`font-bold font-code-metric ${
                          domainData.brain2?.factors?.isReviewOverdue ? 'text-rose-700' : 'text-emerald-700'
                        }`}>
                          {domainData.brain2?.factors?.isReviewOverdue ? `-${domainData.brain2.factors.overdueDays}d` : 'Em dia'}
                        </span>
                      </div>
                      <p className="text-[0.625rem] text-secondary leading-tight truncate">
                        FSRS: {domainData.brain2?.factors?.retrievability ?? 85}% retrievability
                      </p>
                    </div>

                    {/* Fator 4: Progresso */}
                    <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/60 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-medium">📚 Progresso</span>
                        <span className="font-bold text-on-surface font-code-metric">
                          {domainData.brain2?.factors?.postExercisesCompletionRate ?? 100}%
                        </span>
                      </div>
                      <p className="text-[0.625rem] text-secondary leading-tight truncate capitalize">
                        {domainData.brain2?.factors?.progressStage?.replace('_', ' ') ?? 'Consolidando'}
                      </p>
                    </div>

                    {/* Fator 5: Prazo & Ritmo */}
                    <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/60 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-medium">⏰ Prazo & Ritmo</span>
                        <span className="font-bold text-emerald-700 font-code-metric">
                          {domainData.brain2?.factors?.weeklyHoursNeeded ?? 7.6}h/sem
                        </span>
                      </div>
                      <p className="text-[0.625rem] text-secondary leading-tight truncate">
                        {domainData.brain2?.factors?.weeksRemaining ?? 104} sem. • Disp: {domainData.brain2?.factors?.weeklyHoursTarget ?? 8}h/sem
                      </p>
                    </div>

                    {/* Fator 6: Estratégia */}
                    <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/60 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-medium">📈 Estratégia</span>
                        <span className="font-bold text-primary font-code-metric">
                          {domainData.brain2?.factors?.incidenceScore ?? 80}/100
                        </span>
                      </div>
                      <p className="text-[0.625rem] text-secondary leading-tight truncate">
                        Ação: {domainData.brain2?.actionType ?? 'questões'}
                      </p>
                    </div>
                  </div>

                  {/* Boosts Ativos */}
                  {domainData.brain2?.factors?.appliedBoosts && domainData.brain2.factors.appliedBoosts.length > 0 && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                      <span className="text-[0.625rem] font-bold text-amber-900 uppercase tracking-wider block">
                        ⚡ Modificadores & Boosts de Alavancagem:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {domainData.brain2.factors.appliedBoosts.map((boost, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[0.625rem] font-semibold border border-amber-300"
                          >
                            {boost}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fórmula Ponderada Adaptativa */}
                  {domainData.brain2?.adaptiveFormulaWeights && (
                    <div className="p-2 rounded-lg bg-surface-container text-[0.625rem] text-secondary space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface">Pesos da Fórmula Adaptativa:</span>
                        <span className="italic text-[0.5625rem]">Soma: 100%</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center font-code-metric">
                        <div className="bg-surface-container-lowest p-1 rounded">
                          Déficit: <strong className="text-on-surface">{Math.round(domainData.brain2.adaptiveFormulaWeights.deficitWeight * 100)}%</strong>
                        </div>
                        <div className="bg-surface-container-lowest p-1 rounded">
                          Incid.: <strong className="text-on-surface">{Math.round(domainData.brain2.adaptiveFormulaWeights.incidenceWeight * 100)}%</strong>
                        </div>
                        <div className="bg-surface-container-lowest p-1 rounded">
                          Revisão: <strong className="text-on-surface">{Math.round(domainData.brain2.adaptiveFormulaWeights.revisionWeight * 100)}%</strong>
                        </div>
                        <div className="bg-surface-container-lowest p-1 rounded">
                          Progresso: <strong className="text-on-surface">{Math.round(domainData.brain2.adaptiveFormulaWeights.progressWeight * 100)}%</strong>
                        </div>
                        <div className="bg-surface-container-lowest p-1 rounded">
                          Prazo: <strong className="text-on-surface">{Math.round(domainData.brain2.adaptiveFormulaWeights.timelineWeight * 100)}%</strong>
                        </div>
                        <div className="bg-surface-container-lowest p-1 rounded">
                          Estratég.: <strong className="text-on-surface">{Math.round(domainData.brain2.adaptiveFormulaWeights.strategyWeight * 100)}%</strong>
                        </div>
                      </div>
                      <p className="text-[0.625rem] text-secondary italic pt-0.5">
                        💡 {domainData.brain2.adaptiveFormulaWeights.adaptationReason}
                      </p>
                    </div>
                  )}

                  {/* Ranking de Atividades Disponíveis para este Conteúdo */}
                  {domainData.brain2?.activityRankings && domainData.brain2.activityRankings.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.6875rem] font-bold text-on-surface uppercase tracking-wider">
                          Ranqueamento Interno de Atividades (Cérebro 2)
                        </span>
                        <span className="text-[0.625rem] text-secondary">
                          Da maior para menor alavancagem
                        </span>
                      </div>

                      <div className="space-y-1">
                        {domainData.brain2.activityRankings.map((opt, i) => (
                          <div
                            key={opt.type}
                            className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-colors ${
                              i === 0
                                ? 'bg-primary/10 border-primary/40 text-on-surface font-medium'
                                : 'bg-surface-container-lowest border-surface-container text-secondary'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.625rem] font-bold shrink-0 ${
                                  i === 0
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container-high text-secondary'
                                }`}
                              >
                                {i + 1}
                              </span>
                              <div className="truncate">
                                <span className="font-semibold text-on-surface block text-xs truncate">
                                  {opt.label}
                                </span>
                                <span className="text-[0.625rem] text-secondary block truncate">
                                  {opt.whyThisActivity}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[0.625rem] text-secondary font-code-metric">
                                ⏱️ {opt.estimatedDurationMin} min
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold font-code-metric ${
                                  i === 0
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container text-secondary'
                                }`}
                              >
                                {opt.score} pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Simulador Interativo do Cérebro de Domínio */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-2.5">
              <div>
                <span className="text-[0.6875rem] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">tune</span>
                  Simulador de Evidências em Tempo Real
                </span>
                <h4 className="text-xs font-bold text-on-surface">
                  Veja como a adição de Provas Reais move o Domínio e a Confiança:
                </h4>
              </div>

              <button
                onClick={() => {
                  setSimulatedRealHitsBonus(0);
                  setSimulatedRealTotalBonus(0);
                }}
                className="text-[0.6875rem] text-secondary hover:text-on-surface underline font-medium self-start sm:self-auto"
              >
                Resetar Simulação
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSimulatedRealTotalBonus((prev) => prev + 10);
                  setSimulatedRealHitsBonus((prev) => prev + 9);
                }}
                className="p-2.5 rounded-xl bg-surface-container hover:bg-emerald-50 hover:border-emerald-300 border border-surface-container text-left transition-colors space-y-1"
              >
                <div className="text-xs font-bold text-emerald-800">+10 Questões de Prova Real (9 acertos - 90%)</div>
                <div className="text-[0.625rem] text-secondary">
                  Aumenta a Aplicação e eleva a Confiança Amostral.
                </div>
              </button>

              <button
                onClick={() => {
                  setSimulatedRealTotalBonus((prev) => prev + 10);
                  setSimulatedRealHitsBonus((prev) => prev + 4);
                }}
                className="p-2.5 rounded-xl bg-surface-container hover:bg-amber-50 hover:border-amber-300 border border-surface-container text-left transition-colors space-y-1"
              >
                <div className="text-xs font-bold text-amber-800">+10 Questões de Prova Real (4 acertos - 40%)</div>
                <div className="text-[0.625rem] text-secondary">
                  Demonstra o gargalo de aplicação puxando o domínio para baixo.
                </div>
              </button>

              <button
                onClick={() => {
                  setSimulatedRealTotalBonus((prev) => prev + 25);
                  setSimulatedRealHitsBonus((prev) => prev + 23);
                }}
                className="p-2.5 rounded-xl bg-surface-container hover:bg-purple-50 hover:border-purple-300 border border-surface-container text-left transition-colors space-y-1"
              >
                <div className="text-xs font-bold text-purple-800">+25 Questões de Provas (23 acertos - 92%)</div>
                <div className="text-[0.625rem] text-secondary">
                  Dispara a transição para Domínio Consolidado (≥85%).
                </div>
              </button>
            </div>

            {simulatedRealTotalBonus > 0 && (
              <div className="p-2 rounded-lg bg-blue-50 text-blue-950 text-xs flex items-center justify-between">
                <span>
                  Simulação ativa: <strong>+{simulatedRealTotalBonus} questões</strong> ({simulatedRealHitsBonus} acertos adicionados).
                </span>
                <span className="font-bold text-primary">
                  Novo Domínio: {domainData.overallDomain}% (Confiança {domainData.confidenceLevel})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 border-t border-surface-container bg-surface-container-low/60 flex items-center justify-between">
          <div className="text-xs text-secondary">
            <span>Classificação: </span>
            <strong className="text-on-surface">{domainData.statusLabel}</strong>
            <span className="hidden sm:inline"> &bull; Meta de Aprovação Residência: 85%</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
