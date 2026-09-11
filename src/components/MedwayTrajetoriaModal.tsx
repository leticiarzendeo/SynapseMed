import React, { useState } from 'react';
import { ContentItem, QuestionAssessment } from '../types';

interface MedwayTrajetoriaModalProps {
  content: ContentItem;
  onClose: () => void;
  onAddEvaluation: (contentId: string, assessment: Omit<QuestionAssessment, 'id'>) => void;
}

export const MedwayTrajetoriaModal: React.FC<MedwayTrajetoriaModalProps> = ({
  content,
  onClose,
  onAddEvaluation,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTotalQuestions, setNewTotalQuestions] = useState(20);
  const [newCorrectCount, setNewCorrectCount] = useState(17);
  const [newLabel, setNewLabel] = useState('Reavaliação no Banco Medway');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const newAccuracy = newTotalQuestions > 0 ? (newCorrectCount / newTotalQuestions) * 100 : 0;
  const preAccuracy = content.preVideoQuestions?.accuracy || 0;
  const postAccuracy = content.postVideoQuestions?.accuracy || 0;
  const learningGain = content.learningGainPP ?? Number((postAccuracy - preAccuracy).toFixed(1));

  const evaluations: QuestionAssessment[] = content.trajectoryEvaluations && content.trajectoryEvaluations.length > 0
    ? content.trajectoryEvaluations
    : [
        {
          id: 'pre-default',
          type: 'pre',
          label: 'Pré-exercícios (Diagnóstico)',
          date: content.preVideoQuestions?.date || 'Inicial',
          daysAgoText: 'Início do estudo',
          totalQuestions: content.preVideoQuestions?.completedCount || 10,
          correctCount: content.preVideoQuestions?.correctCount || 6,
          accuracy: preAccuracy,
          weightInCurrentMastery: 0,
        },
        {
          id: 'pos-default',
          type: 'pos',
          label: 'Pós-exercícios (Consolidação da Aula)',
          date: content.postVideoQuestions?.date || 'Após aula',
          daysAgoText: 'Logo após teoria',
          totalQuestions: content.postVideoQuestions?.completedCount || 15,
          correctCount: content.postVideoQuestions?.correctCount || 13,
          accuracy: postAccuracy,
          gainPoints: learningGain,
          weightInCurrentMastery: 100,
        },
      ];

  const totalEvaluatedQuestions = evaluations.reduce((acc, ev) => acc + ev.totalQuestions, 0);

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTotalQuestions <= 0 || newCorrectCount < 0 || newCorrectCount > newTotalQuestions) return;

    onAddEvaluation(content.id, {
      type: 'reavaliacao',
      label: newLabel.trim() || 'Nova Reavaliação',
      date: newDate,
      daysAgoText: 'Hoje',
      totalQuestions: Number(newTotalQuestions),
      correctCount: Number(newCorrectCount),
      accuracy: Number(newAccuracy.toFixed(1)),
      gainPoints: Number((newAccuracy - preAccuracy).toFixed(1)),
      weightInCurrentMastery: 50,
    });
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-surface-container flex items-start justify-between gap-3 bg-surface-container-low/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary-container text-on-primary-container material-symbols-outlined text-sm">
                timeline
              </span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Trajetória Longitudinal Medway
              </span>
            </div>
            <h2 className="text-base font-bold text-on-surface">{content.name}</h2>
            <p className="text-xs text-secondary">
              Modelo adaptativo de aprendizagem: Linha de Base (Pré) → Consolidação Inicial (Pós) → Ponderação por Recência &amp; Confiança Amostral.
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
          {/* Triad Metric Card: Baseline | Pós | Ganho | Desempenho Ponderado */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Pré */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[0.625rem] font-bold text-amber-900 uppercase">Pré-exercícios</span>
                <span className="text-[0.5625rem] px-1 py-0.2 rounded bg-amber-200/80 text-amber-950 font-semibold">
                  Linha de base
                </span>
              </div>
              <div className="text-lg font-bold font-code-metric text-amber-950">
                {preAccuracy.toFixed(1)}%
              </div>
              <p className="text-[0.625rem] text-amber-800 leading-tight">
                Diagnóstico de entrada. <strong>Não penaliza</strong> o domínio atual em média simples.
              </p>
            </div>

            {/* 2. Pós */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[0.625rem] font-bold text-blue-900 uppercase">Pós-exercícios</span>
                <span className="text-[0.5625rem] px-1 py-0.2 rounded bg-blue-200/80 text-blue-950 font-semibold">
                  Pós-aula
                </span>
              </div>
              <div className="text-lg font-bold font-code-metric text-blue-950">
                {postAccuracy.toFixed(1)}%
              </div>
              <p className="text-[0.625rem] text-blue-800 leading-tight">
                Consolidação pós-teoria. Cede relevância gradualmente a evidências mais recentes.
              </p>
            </div>

            {/* 3. Evolução Teórica */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[0.625rem] font-bold text-emerald-900 uppercase">Ganho pós-teoria</span>
                <span className="material-symbols-outlined text-sm text-emerald-700">trending_up</span>
              </div>
              <div className="text-lg font-bold font-code-metric text-emerald-800">
                +{learningGain > 0 ? learningGain : 0} p.p.
              </div>
              <p className="text-[0.625rem] text-emerald-800 leading-tight">
                Impacto direto e eficácia da aula teórica da Medway sobre o tema.
              </p>
            </div>

            {/* 4. Desempenho Ponderado Atual */}
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[0.625rem] font-bold text-purple-900 uppercase">Desempenho Atual</span>
                <span className="text-[0.5625rem] px-1 py-0.2 rounded bg-purple-200/80 text-purple-950 font-semibold">
                  Recência
                </span>
              </div>
              <div className="text-lg font-bold font-code-metric text-purple-950">
                {(content.medwayWeightedAccuracy || postAccuracy).toFixed(1)}%
              </div>
              <p className="text-[0.625rem] text-purple-800 leading-tight">
                Ponderado pelas baterias mais recentes e frequência de acertos observada.
              </p>
            </div>
          </div>

          {/* Confiança Estatística da Amostra */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">verified</span>
                <span className="font-bold text-xs text-on-surface">
                  Confiança da Estimativa Amostral
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full font-code-metric text-[0.625rem] font-bold ${
                  totalEvaluatedQuestions >= 40
                    ? 'bg-emerald-100 text-emerald-800'
                    : totalEvaluatedQuestions >= 20
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {totalEvaluatedQuestions >= 40 ? 'Confiança Alta' : totalEvaluatedQuestions >= 20 ? 'Confiança Média' : 'Confiança Inicial'} ({totalEvaluatedQuestions} questões totais)
              </span>
            </div>
            <p className="text-[0.6875rem] text-secondary leading-relaxed">
              <strong>Princípio Estatístico do Sistema</strong>: 90% de acerto em 5 questões tem volatilidade muito maior do que 90% em 50 questões.
              Conforme você resolve novas questões ao longo dos meses, a confiança da estimativa cresce e o peso de avaliações passadas é ajustado continuamente.
            </p>
          </div>

          {/* Trajetória Longitudinal (Linha do Tempo) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">route</span>
                <h3 className="font-bold text-xs text-on-surface">
                  Linha do Tempo de Avaliações ({evaluations.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-[0.6875rem] font-bold hover:bg-primary-container flex items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Registrar Nova Bateria
              </button>
            </div>

            {/* Formulário de Nova Bateria */}
            {showAddForm && (
              <form
                onSubmit={handleSubmitNew}
                className="p-3.5 rounded-xl bg-surface-container-low border border-primary/40 space-y-3 animate-fadeIn"
              >
                <div className="font-bold text-xs text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">add_task</span>
                  Nova Bateria de Questões Medway
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[0.625rem] font-semibold text-secondary block mb-1">
                      Identificação / Origem
                    </label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Ex: Treino Banco de Questões"
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-xs text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-semibold text-secondary block mb-1">
                      Total de Questões Feitas
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={newTotalQuestions}
                      onChange={(e) => setNewTotalQuestions(Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-xs text-on-surface font-code-metric"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-semibold text-secondary block mb-1">
                      Acertos Conquistados
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={newTotalQuestions}
                      value={newCorrectCount}
                      onChange={(e) => setNewCorrectCount(Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-surface-container text-xs text-on-surface font-code-metric"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[0.6875rem] text-secondary flex items-center gap-2">
                    <span>Resultado calculado:</span>
                    <strong className="font-code-metric text-primary font-bold">
                      {newAccuracy.toFixed(1)}% ({newCorrectCount}/{newTotalQuestions})
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1 rounded-lg text-secondary hover:bg-surface-container text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container"
                    >
                      Salvar na Trajetória
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Timeline cards */}
            <div className="space-y-2 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-surface-container">
              {evaluations.map((ev, index) => {
                const isPre = ev.type === 'pre';
                const isPos = ev.type === 'pos';

                return (
                  <div key={ev.id || index} className="flex items-start gap-3 relative pl-1">
                    {/* Bullet */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 text-[0.625rem] font-bold ${
                        isPre
                          ? 'bg-amber-200 text-amber-900 ring-2 ring-amber-400'
                          : isPos
                          ? 'bg-blue-200 text-blue-900 ring-2 ring-blue-400'
                          : 'bg-emerald-200 text-emerald-900 ring-2 ring-emerald-400'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Timeline Item Content */}
                    <div className="p-3 rounded-xl bg-surface-container-low/80 border border-surface-container flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{ev.label}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[0.5625rem] font-semibold uppercase ${
                              isPre
                                ? 'bg-amber-100 text-amber-900'
                                : isPos
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {isPre ? 'Linha de Base' : isPos ? 'Pós-Aula' : 'Reavaliação Recente'}
                          </span>
                        </div>
                        <div className="text-[0.625rem] text-secondary flex items-center gap-2">
                          <span>{ev.date}</span>
                          {ev.daysAgoText && <span>• {ev.daysAgoText}</span>}
                          <span>• {ev.correctCount}/{ev.totalQuestions} questões</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                        {ev.gainPoints !== undefined && (
                          <div className="text-right">
                            <span className="text-[0.5625rem] text-secondary block">Ganho s/ Pré</span>
                            <span className="font-code-metric font-bold text-emerald-700 text-xs">
                              +{ev.gainPoints.toFixed(1)} p.p.
                            </span>
                          </div>
                        )}

                        <div className="text-right">
                          <span className="text-[0.5625rem] text-secondary block">
                            {isPre ? 'Acurácia Basal' : 'Acurácia Observada'}
                          </span>
                          <span
                            className={`font-code-metric font-bold text-sm ${
                              ev.accuracy >= 85
                                ? 'text-emerald-700'
                                : ev.accuracy >= 70
                                ? 'text-blue-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {ev.accuracy.toFixed(1)}%
                          </span>
                        </div>

                        <div className="text-right pl-2 border-l border-surface-container">
                          <span className="text-[0.5625rem] text-secondary block">Peso Atual</span>
                          <span className="font-code-metric text-xs font-semibold text-on-surface">
                            {ev.weightInCurrentMastery}%
                          </span>
                        </div>
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
            <span className="material-symbols-outlined text-sm text-purple-700">psychology</span>
            <span>A estimativa alimenta a prioridade diária sem perder a memória longitudinal.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
