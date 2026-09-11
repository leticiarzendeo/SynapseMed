import React, { useState } from 'react';
import { ContentItem, OslerCardSample, OslerCardReview } from '../types';

interface OslerEvidenceModalProps {
  content: ContentItem;
  onClose: () => void;
  onUpdateEvidence?: (contentId: string, updatedSampleCards: OslerCardSample[]) => void;
}

export const OslerEvidenceModal: React.FC<OslerEvidenceModalProps> = ({
  content,
  onClose,
  onUpdateEvidence,
}) => {
  const oslerData = content.oslerEvidence || {
    retentionScore: 88.5,
    stabilityLevel: 'alta' as const,
    stabilityScore: 82,
    confidenceLevel: 'alta' as const,
    reviewedCardsCount: content.oslerCards?.distribution.total || 50,
    totalCardsAvailable: content.oslerCards?.distribution.total || 50,
    coveragePercent: 85,
    cardDistribution: {
      facil: content.oslerCards?.distribution.facil || 25,
      normal: content.oslerCards?.distribution.normal || 15,
      dificil: content.oslerCards?.distribution.dificil || 7,
      erros: content.oslerCards?.distribution.errei || 3,
      total: content.oslerCards?.distribution.total || 50,
    },
    diagnosticAlignment: {
      knowledgeRetention: 'forte' as const,
      examApplication: 'critica' as const,
      isMaskingDeficiency: true,
      prescribedAction:
        'Excelente retenção conceitual (Osler 89%), mas acurácia em provas reais abaixo da meta (58,3%). Recomendação: priorizar questões de provas e simulados, sem repetir teoria.',
    },
    sampleCards: [],
  };

  const defaultSampleCards: OslerCardSample[] = [
    {
      id: 'sample-card-1',
      prompt: 'Critérios Maiores e Menores de Framingham para diagnóstico clínico de ICC',
      blockTitle: 'Insuficiência cardíaca — diagnóstico',
      calculatedRetention: 96.3,
      stability: 'alta',
      lastRating: 'facil',
      reviews: [
        { rating: 'facil', score: 100, weight: 1.0, date: '04/09/2026', daysAgoText: '4 dias atrás' },
        { rating: 'facil', score: 100, weight: 0.75, date: '20/08/2026', daysAgoText: '19 dias atrás' },
        { rating: 'normal', score: 85, weight: 0.5, date: '01/08/2026', daysAgoText: '38 dias atrás' },
        { rating: 'facil', score: 100, weight: 0.25, date: '15/07/2026', daysAgoText: '55 dias atrás' },
      ],
    },
    {
      id: 'sample-card-2',
      prompt: 'Quádrupla terapia modificadora de prognóstico na ICFER (IECA/BRA/INRA + BB + ARM + iSGLT2)',
      blockTitle: 'Insuficiência cardíaca — tratamento',
      calculatedRetention: 67.5,
      stability: 'baixa',
      lastRating: 'normal',
      reviews: [
        { rating: 'normal', score: 85, weight: 1.0, date: '02/09/2026', daysAgoText: '6 dias atrás' },
        { rating: 'dificil', score: 70, weight: 0.75, date: '18/08/2026', daysAgoText: '21 dias atrás' },
        { rating: 'errado', score: 0, weight: 0.5, date: '02/08/2026', daysAgoText: '37 dias atrás' },
        { rating: 'errado', score: 0, weight: 0.25, date: '16/07/2026', daysAgoText: '54 dias atrás' },
      ],
    },
    {
      id: 'sample-card-3',
      prompt: 'Perfil Hemodinâmico de Stevenson em IC Descompensada (Quente/Frio, Seco/Úmido) e conduta',
      blockTitle: 'IC descompensada',
      calculatedRetention: 79.5,
      stability: 'moderada',
      lastRating: 'dificil',
      reviews: [
        { rating: 'dificil', score: 70, weight: 1.0, date: '01/09/2026', daysAgoText: '7 dias atrás' },
        { rating: 'normal', score: 85, weight: 0.75, date: '15/08/2026', daysAgoText: '24 dias atrás' },
        { rating: 'facil', score: 100, weight: 0.5, date: '28/07/2026', daysAgoText: '42 dias atrás' },
        { rating: 'facil', score: 100, weight: 0.25, date: '15/07/2026', daysAgoText: '55 dias atrás' },
      ],
    },
  ];

  const [sampleCards, setSampleCards] = useState<OslerCardSample[]>(
    oslerData.sampleCards && oslerData.sampleCards.length > 0
      ? oslerData.sampleCards
      : defaultSampleCards
  );

  // Simular uma nova resposta em um cartão
  const handleSimulateReview = (
    cardId: string,
    rating: 'facil' | 'normal' | 'dificil' | 'errado'
  ) => {
    const scoreMap = { facil: 100, normal: 85, dificil: 70, errado: 0 };
    const score = scoreMap[rating];

    setSampleCards((prev) => {
      return prev.map((card) => {
        if (card.id !== cardId) return card;

        const newReview: OslerCardReview = {
          rating,
          score,
          weight: 1.0,
          date: new Date().toISOString().split('T')[0],
          daysAgoText: 'Hoje',
        };

        // Reajusta pesos decrescentes das revisões antigas
        const weights = [0.75, 0.5, 0.25];
        const updatedPreviousReviews = card.reviews.slice(0, 3).map((r, i) => ({
          ...r,
          weight: weights[i] || 0.25,
        }));

        const allReviews = [newReview, ...updatedPreviousReviews];

        // Média ponderada por recência
        const weightedSum = allReviews.reduce((sum, r) => sum + r.score * r.weight, 0);
        const totalWeights = allReviews.reduce((sum, r) => sum + r.weight, 0);
        const newRetention = Number((weightedSum / totalWeights).toFixed(1));

        // Estabilidade baseada no padrão
        const hadErrorsRecently = allReviews.slice(0, 2).some((r) => r.rating === 'errado');
        const hasDifficulties = allReviews.filter((r) => r.rating === 'dificil').length >= 2;
        const stability: 'alta' | 'moderada' | 'baixa' =
          hadErrorsRecently
            ? 'baixa'
            : hasDifficulties || newRetention < 80
            ? 'moderada'
            : 'alta';

        return {
          ...card,
          reviews: allReviews,
          calculatedRetention: newRetention,
          stability,
          lastRating: rating,
        };
      });
    });
  };

  const realExamAccuracy =
    content.examStats.realExamQuestions > 0
      ? (content.examStats.realExamHits / content.examStats.realExamQuestions) * 100
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-surface-container flex items-start justify-between gap-3 bg-surface-container-low/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800 material-symbols-outlined text-sm">
                psychology
              </span>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Modelo de Evidência de Memória &amp; Recuperação (Osler)
              </span>
            </div>
            <h2 className="text-base font-bold text-on-surface">
              {content.name} — Cartões Osler &amp; Estabilidade
            </h2>
            <p className="text-xs text-secondary leading-relaxed">
              O Osler não é mero percentual de acertos: a classificação representa a <strong>facilidade de recuperação do conhecimento</strong>, ponderada por <strong>histórico, recência decrescente e FSRS</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:bg-surface-container text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Métricas Principais: Retenção Atual | Estabilidade | Confiança | Cobertura */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Retenção Atual */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/70 space-y-1">
              <span className="text-[0.625rem] font-bold text-indigo-900 uppercase block">
                🧠 Retenção Atual
              </span>
              <div className="text-xl font-bold font-code-metric text-indigo-950">
                {oslerData.retentionScore.toFixed(1)}%
              </div>
              <p className="text-[0.625rem] text-indigo-800 leading-tight">
                Média ponderada pela escala qualitativa (100 / 85 / 70 / 0) e peso de recência.
              </p>
            </div>

            {/* 2. Estabilidade */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/70 space-y-1">
              <span className="text-[0.625rem] font-bold text-purple-900 uppercase block">
                🔒 Estabilidade da Memória
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-purple-950 capitalize">
                  {oslerData.stabilityLevel}
                </span>
                <span className="text-[0.6875rem] font-code-metric text-purple-800">
                  (S = {content.fsrs.stabilityDays} dias)
                </span>
              </div>
              <p className="text-[0.625rem] text-purple-800 leading-tight">
                Consistência das respostas no tempo. Pouca probabilidade de esquecimento súbito.
              </p>
            </div>

            {/* 3. Confiança Amostral */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-1">
              <span className="text-[0.625rem] font-bold text-blue-900 uppercase block">
                🎯 Confiança da Estimativa
              </span>
              <div className="text-sm font-bold text-blue-950 capitalize">
                {oslerData.confidenceLevel}
              </div>
              <p className="text-[0.625rem] text-blue-800 leading-tight">
                {oslerData.reviewedCardsCount} de {oslerData.totalCardsAvailable} cartões já revisados ({oslerData.coveragePercent.toFixed(0)}% cobertura).
              </p>
            </div>

            {/* 4. Estado FSRS */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
              <span className="text-[0.625rem] font-bold text-secondary uppercase block">
                ⏱️ Próxima Revisão FSRS
              </span>
              <div className="text-sm font-bold text-rose-700 flex items-center gap-1">
                <span>🔴 Atrasada</span>
              </div>
              <p className="text-[0.625rem] text-secondary leading-tight">
                R = {content.fsrs.retrievability}% de lembrança. Vencida há 2 dias.
              </p>
            </div>
          </div>

          {/* REGRA ESSENCIAL: OSLER NÃO PODE MASCARAR DEFICIÊNCIA EM PROVAS */}
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-lg bg-amber-200 text-amber-900 material-symbols-outlined text-base shrink-0 mt-0.5">
                warning
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Regra Crítica: O Osler não mascara deficiência em provas!
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[0.5625rem] bg-rose-100 text-rose-900 font-bold font-code-metric">
                    Domínio Geral: {content.estimatedMastery}% &lt; 85%
                  </span>
                </div>
                <p className="text-[0.6875rem] text-amber-900 leading-relaxed">
                  Mesmo com excelente retenção nos cartões ({oslerData.retentionScore.toFixed(1)}%) e boa assimilação da aula Medway (86,7%), o sistema <strong>NÃO</strong> declara este conteúdo como dominado porque o desempenho em questões de prova ainda está em <strong>{realExamAccuracy.toFixed(1)}%</strong>.
                </p>
              </div>
            </div>

            {/* Matriz Lado a Lado: Conhecimento/Memória vs. Aplicação em Prova */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-amber-200/60">
              <div className="p-2.5 rounded-lg bg-white/70 border border-amber-200 text-[0.6875rem] space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-emerald-700">psychology</span>
                  🧠 Conhecimento &amp; Retenção: FORTE
                </span>
                <p className="text-secondary">
                  Osler: <strong>{oslerData.retentionScore.toFixed(1)}%</strong> • Medway Pós: <strong>{content.postVideoQuestions.accuracy}%</strong>. Você lembra os conceitos e as diretrizes clínicas.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/70 border border-amber-200 text-[0.6875rem] space-y-1">
                <span className="font-bold text-rose-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-rose-700">cancel</span>
                  🎯 Aplicação em Prova: FRACA / ABAIXO DA META
                </span>
                <p className="text-secondary">
                  Provas Reais: <strong>{realExamAccuracy.toFixed(1)}%</strong> (7/12) • Simulados: <strong>75,0%</strong>. Dificuldade em casos clínicos e pegadinhas de bancas.
                </p>
              </div>
            </div>

            {/* Ação Prescrita */}
            <div className="p-2 rounded-lg bg-amber-100/70 text-[0.6875rem] text-amber-950 flex items-center gap-2">
              <span className="font-bold">📋 Prescrição do Sistema:</span>
              <span>Priorizar bateria de questões e bancas alvo (USP, UNIFESP, ENARE). <strong>NÃO repetir a aula teórica</strong>.</span>
            </div>
          </div>

          {/* A Escala Qualitativa de Recuperação */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">tune</span>
                Escala de Pontuação &amp; Qualidade da Recuperação
              </h3>
              <span className="text-[0.625rem] text-secondary">
                Padrão adaptativo do sistema
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-center gap-1 text-emerald-900 font-bold">
                  <span>🟢 Fácil</span>
                  <span className="font-code-metric text-xs">(100 pts)</span>
                </div>
                <span className="text-[0.625rem] text-emerald-800 block mt-0.5">
                  Recuperação muito segura
                </span>
                <span className="font-code-metric font-bold text-xs text-emerald-950 mt-1 block">
                  {oslerData.cardDistribution.facil} cartões
                </span>
              </div>

              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-center gap-1 text-blue-900 font-bold">
                  <span>🟡 Normal</span>
                  <span className="font-code-metric text-xs">(85 pts)</span>
                </div>
                <span className="text-[0.625rem] text-blue-800 block mt-0.5">
                  Recuperação adequada (meta)
                </span>
                <span className="font-code-metric font-bold text-xs text-blue-950 mt-1 block">
                  {oslerData.cardDistribution.normal} cartões
                </span>
              </div>

              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-center gap-1 text-amber-900 font-bold">
                  <span>🟠 Difícil</span>
                  <span className="font-code-metric text-xs">(70 pts)</span>
                </div>
                <span className="text-[0.625rem] text-amber-800 block mt-0.5">
                  Presente, mas frágil (não é erro!)
                </span>
                <span className="font-code-metric font-bold text-xs text-amber-950 mt-1 block">
                  {oslerData.cardDistribution.dificil} cartões
                </span>
              </div>

              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-center gap-1 text-rose-900 font-bold">
                  <span>🔴 Errado</span>
                  <span className="font-code-metric text-xs">(0 pts)</span>
                </div>
                <span className="text-[0.625rem] text-rose-800 block mt-0.5">
                  Falha de recuperação
                </span>
                <span className="font-code-metric font-bold text-xs text-rose-950 mt-1 block">
                  {oslerData.cardDistribution.erros} cartões
                </span>
              </div>
            </div>

            <div className="text-[0.6875rem] text-secondary flex items-center justify-between pt-1">
              <span>Pesos decrescentes por recência:</span>
              <span className="font-code-metric text-primary font-bold">
                Mais recente (1.00) → Anterior (0.75) → Anterior (0.50) → Mais antiga (0.25)
              </span>
            </div>
          </div>

          {/* Amostragem de Cartões e Histórico Longitudinal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-indigo-700">style</span>
                  Cartões em Destaque &amp; Histórico Longitudinal ({sampleCards.length})
                </h3>
                <p className="text-[0.625rem] text-secondary">
                  Demonstração da influência do histórico e recência em cada cartão.
                </p>
              </div>

              <span className="text-[0.625rem] text-secondary bg-surface-container px-2 py-0.5 rounded">
                Simulador de Resposta Interativo
              </span>
            </div>

            <div className="space-y-3">
              {sampleCards.map((card) => {
                return (
                  <div
                    key={card.id}
                    className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[0.625rem] text-secondary uppercase tracking-wider font-semibold block">
                          Bloco: {card.blockTitle}
                        </span>
                        <h4 className="text-xs font-bold text-on-surface leading-snug">
                          {card.prompt}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-[0.5625rem] text-secondary block">Estabilidade</span>
                          <span
                            className={`text-xs font-bold uppercase font-code-metric ${
                              card.stability === 'alta'
                                ? 'text-emerald-700'
                                : card.stability === 'moderada'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {card.stability}
                          </span>
                        </div>

                        <div className="text-right pl-2 border-l border-surface-container">
                          <span className="text-[0.5625rem] text-secondary block">Retenção Atual</span>
                          <span className="font-code-metric font-bold text-sm text-indigo-700">
                            {card.calculatedRetention.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Histórico Visual de Respostas (Trajetória) */}
                    <div className="p-2 rounded-lg bg-surface-container-lowest border border-surface-container space-y-1">
                      <span className="text-[0.5625rem] font-bold text-secondary uppercase block">
                        Trajetória de Revisões (Mais recente → Mais antiga):
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {card.reviews.map((rev, idx) => {
                          const badgeColor =
                            rev.rating === 'facil'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                              : rev.rating === 'normal'
                              ? 'bg-blue-100 text-blue-900 border-blue-200'
                              : rev.rating === 'dificil'
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : 'bg-rose-100 text-rose-900 border-rose-200';

                          return (
                            <div
                              key={idx}
                              className={`px-2 py-0.5 rounded border text-[0.625rem] flex items-center gap-1 ${badgeColor}`}
                            >
                              <span className="font-bold capitalize">{rev.rating}</span>
                              <span className="font-code-metric text-[0.5625rem] opacity-75">
                                ({rev.score}pts • p={rev.weight})
                              </span>
                              {idx < card.reviews.length - 1 && (
                                <span className="opacity-40 text-[0.6875rem]">←</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Simulador de Nova Resposta neste cartão */}
                    <div className="flex items-center justify-between pt-1 border-t border-surface-container">
                      <span className="text-[0.625rem] text-secondary">
                        Simular resposta hoje:
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSimulateReview(card.id, 'facil')}
                          className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[0.625rem] transition-colors"
                        >
                          🟢 Fácil
                        </button>
                        <button
                          onClick={() => handleSimulateReview(card.id, 'normal')}
                          className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-[0.625rem] transition-colors"
                        >
                          🟡 Normal
                        </button>
                        <button
                          onClick={() => handleSimulateReview(card.id, 'dificil')}
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[0.625rem] transition-colors"
                        >
                          🟠 Difícil
                        </button>
                        <button
                          onClick={() => handleSimulateReview(card.id, 'errado')}
                          className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-[0.625rem] transition-colors"
                        >
                          🔴 Errado
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container flex items-center justify-between bg-surface-container-low/40">
          <div className="text-[0.6875rem] text-secondary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-indigo-700">verified</span>
            <span>A retenção do Osler alimenta o diagnóstico de memória sem mascarar o desempenho em provas.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container"
          >
            Fechar Dossiê Osler
          </button>
        </div>
      </div>
    </div>
  );
};
