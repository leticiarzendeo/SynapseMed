import React, { useState } from 'react';
import { errorReasonConfig, initialCadernoErros, fullCurriculumHierarchy, getCurriculumTotals } from '../data/mockData';
import { ErrorReasonType } from '../types';

export const AnalisesView: React.FC = () => {
  const [selectedWeeklyHours, setSelectedWeeklyHours] = useState<number>(8);
  const [selectedErrorFilter, setSelectedErrorFilter] = useState<string>('todos');

  const totals = getCurriculumTotals();

  // Calculate dynamic 2-year timeline based on weekly hours
  // Total curriculum hours = 780h theory + 350h questions + 180h revisions = ~1310h
  const totalCurriculumHours = 830; // remaining hours needed
  const weeksNeeded = Math.ceil(totalCurriculumHours / selectedWeeklyHours);
  const monthsNeeded = (weeksNeeded / 4.33).toFixed(1);
  const isWithinTwoYears = weeksNeeded <= 104; // 104 weeks = 2 years

  // Calculate error stats by category
  const errorStats = Object.keys(errorReasonConfig).map((key) => {
    const reasonKey = key as ErrorReasonType;
    const count = initialCadernoErros.filter((e) => e.reasonCategory === reasonKey).length;
    const percentage = Math.round((count / initialCadernoErros.length) * 100);
    return {
      key: reasonKey,
      ...errorReasonConfig[reasonKey],
      count,
      percentage,
    };
  });

  const filteredErrors =
    selectedErrorFilter === 'todos'
      ? initialCadernoErros
      : initialCadernoErros.filter((e) => e.reasonCategory === selectedErrorFilter);

  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">psychology</span>
            <span>Inteligência Cognitiva</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">O Cérebro em 4 Camadas</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Análises Diagnósticas &amp; Caderno de Erros
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            Entenda a lógica matemática que orienta seus estudos e descubra onde suas notas estão escapando.
          </p>
        </div>
      </div>

      {/* 4-Layer Architecture Diagram / Showcase */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">account_tree</span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Como Funciona o Cérebro do SynapseMed (As 4 Camadas)
            </h2>
          </div>
          <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
            Arquitetura Cognitiva
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {/* Layer 1 */}
          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.625rem] font-bold uppercase text-secondary">Camada 1</span>
              <span className="material-symbols-outlined text-primary text-base">format_list_bulleted</span>
            </div>
            <h3 className="text-xs font-bold text-on-surface">Currículo Oficial</h3>
            <p className="text-[0.6875rem] text-secondary leading-relaxed">
              Área → Módulo → Conteúdo. 650 conteúdos mapeados cobrindo 100% dos editais dos últimos 5 anos.
            </p>
            <div className="font-code-metric text-[0.625rem] text-primary font-bold">
              {totals.studied}/{totals.total} estudados
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.625rem] font-bold uppercase text-secondary">Camada 2</span>
              <span className="material-symbols-outlined text-emerald-700 text-base">fact_check</span>
            </div>
            <h3 className="text-xs font-bold text-on-surface">Evidências Reais</h3>
            <p className="text-[0.6875rem] text-secondary leading-relaxed">
              Exercícios pré/pós vídeo, retenção do Osler, e acertos em provas reais e simulados alimentam o domínio.
            </p>
            <div className="font-code-metric text-[0.625rem] text-emerald-700 font-bold">
              {totals.consolidated} consolidados (≥85%)
            </div>
          </div>

          {/* Layer 3 */}
          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.625rem] font-bold uppercase text-secondary">Camada 3</span>
              <span className="material-symbols-outlined text-purple-700 text-base">memory</span>
            </div>
            <h3 className="text-xs font-bold text-on-surface">Memória FSRS</h3>
            <p className="text-[0.6875rem] text-secondary leading-relaxed">
              Estabilidade temporal (S) e Dificuldade (D). Calcula a probabilidade de esquecimento exata de cada tema.
            </p>
            <div className="font-code-metric text-[0.625rem] text-purple-700 font-bold">
              Repetição Espaçada Ativa
            </div>
          </div>

          {/* Layer 4 */}
          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.625rem] font-bold uppercase text-secondary">Camada 4</span>
              <span className="material-symbols-outlined text-amber-700 text-base">stars</span>
            </div>
            <h3 className="text-xs font-bold text-on-surface">Prioridade</h3>
            <p className="text-[0.6875rem] text-secondary leading-relaxed">
              Cruza o peso da banca (USP, ENARE), a lacuna de domínio e a data do exame para agendar o estudo de hoje.
            </p>
            <div className="font-code-metric text-[0.625rem] text-amber-700 font-bold">
              Score Ponderado de 0 a 100
            </div>
          </div>
        </div>
      </div>

      {/* Caderno de Erros Estruturado com os 7 Motivos */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-xl">bug_report</span>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Diagnóstico dos 7 Motivos de Erro
              </h2>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Errar por falta de teoria exige uma conduta oposta de errar por desatenção ou dúvida entre duas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary font-medium">Filtrar motivo:</span>
            <select
              value={selectedErrorFilter}
              onChange={(e) => setSelectedErrorFilter(e.target.value)}
              className="h-8 px-2.5 bg-surface-container-low rounded-lg border border-surface-container text-xs text-on-surface font-semibold focus:outline-none"
            >
              <option value="todos">Todos ({initialCadernoErros.length})</option>
              {Object.entries(errorReasonConfig).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 7 Reasons Visual Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {errorStats.map((stat) => (
            <button
              key={stat.key}
              onClick={() => setSelectedErrorFilter(stat.key)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedErrorFilter === stat.key
                  ? 'border-primary ring-1 ring-primary/20 bg-primary-container text-on-primary-container'
                  : 'border-surface-container bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between text-[0.6875rem]">
                <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                <span className="font-code-metric font-bold">{stat.count}</span>
              </div>
              <div className="text-[0.6875rem] font-bold mt-1 line-clamp-1">{stat.label}</div>
              <div className="text-[0.625rem] text-secondary mt-0.5">{stat.percentage}% dos erros</div>
            </button>
          ))}
        </div>

        {/* Action Strategy Alert */}
        {selectedErrorFilter !== 'todos' && errorReasonConfig[selectedErrorFilter as ErrorReasonType] && (
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${errorReasonConfig[selectedErrorFilter as ErrorReasonType].color}`}>
            <span className="material-symbols-outlined text-lg shrink-0">
              {errorReasonConfig[selectedErrorFilter as ErrorReasonType].icon}
            </span>
            <div className="space-y-0.5 text-xs">
              <strong className="font-bold block text-sm">
                Diretriz de Correção para &ldquo;{errorReasonConfig[selectedErrorFilter as ErrorReasonType].label}&rdquo;:
              </strong>
              <p className="leading-relaxed">
                {errorReasonConfig[selectedErrorFilter as ErrorReasonType].clinicalStrategy}
              </p>
            </div>
          </div>
        )}

        {/* Error Items List */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[0.6875rem] font-bold uppercase text-secondary tracking-wider">
            Ocorrências Recentes Catalogadas ({filteredErrors.length})
          </div>

          <div className="space-y-2">
            {filteredErrors.map((err) => {
              const reasonInfo = errorReasonConfig[err.reasonCategory] || errorReasonConfig.outro;
              return (
                <div
                  key={err.id}
                  className="p-3.5 rounded-xl bg-surface-container-low/50 border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-on-surface">{err.topic}</span>
                      <span className="px-2 py-0.2 rounded bg-surface-container text-secondary text-[0.625rem] font-medium">
                        {err.specialty}
                      </span>
                      <span className={`px-2 py-0.2 rounded border text-[0.625rem] font-bold ${reasonInfo.color}`}>
                        {reasonInfo.label}
                      </span>
                      {err.institutionOrContext && (
                        <span className="text-[0.625rem] text-secondary">
                          • {err.institutionOrContext}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary italic">
                      &ldquo;{err.reason}&rdquo;
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[0.625rem] text-secondary block font-code-metric">
                      {err.createdAt}
                    </span>
                    <span className="text-[0.625rem] font-semibold text-primary">
                      Revisão agendada
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic 2-Year Capacity Calculator */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">event_upcoming</span>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Simulador de Capacidade Semanal &amp; Regra dos 2 Anos
              </h2>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              O tempo semanal varia conforme o internato e plantões. Veja como seu horizonte de conclusão responde.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary font-semibold">Carga simulada:</span>
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container">
              {[6, 8, 10, 12].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setSelectedWeeklyHours(hrs)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-code-metric font-bold transition-all ${
                    selectedWeeklyHours === hrs
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {hrs}h/sem
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
            <span className="text-secondary text-xs uppercase font-semibold">Semanas para 100% de Domínio</span>
            <div className="font-code-metric text-2xl font-bold text-on-surface">
              {weeksNeeded} semanas
            </div>
            <p className="text-[0.6875rem] text-secondary">
              Aproximadamente {monthsNeeded} meses de dedicação líquida.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            isWithinTwoYears
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <span className="text-xs uppercase font-semibold block">Margem de Segurança (Prazo de 2 Anos)</span>
            <div className="font-code-metric text-2xl font-bold">
              {isWithinTwoYears ? `+${104 - weeksNeeded} semanas de folga` : `${weeksNeeded - 104} semanas acima da meta`}
            </div>
            <p className="text-[0.6875rem]">
              {isWithinTwoYears
                ? 'Conclusão com folga garantida para reta final de provas na íntegra.'
                : 'Aumente a carga para 8h ou 10h para fechar dentro do edital sem sobrecarga.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
            <span className="text-secondary text-xs uppercase font-semibold">Simulados Extras (Fim de Semana)</span>
            <div className="font-code-metric text-2xl font-bold text-primary">
              1 a cada 15 dias
            </div>
            <p className="text-[0.6875rem] text-secondary">
              Não consomem as {selectedWeeklyHours}h regulares de conteúdo diário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
