import React, { useState } from 'react';
import { ContentItem, ErrorReasonType, RealExamQuestionRecord } from '../types';
import { errorReasonConfig } from '../data/mockData';

interface RealExamEvidenceModalProps {
  content: ContentItem;
  onClose: () => void;
  onAddQuestion?: (contentId: string, question: RealExamQuestionRecord) => void;
}

export const RealExamEvidenceModal: React.FC<RealExamEvidenceModalProps> = ({
  content,
  onClose,
  onAddQuestion,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'alvo' | 'erros' | 'recentes'>('todas');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new question
  const [newInstitution, setNewInstitution] = useState('USP-RP');
  const [newYear, setNewYear] = useState(2026);
  const [newQuestionNumber, setNewQuestionNumber] = useState(55);
  const [newStatement, setNewStatement] = useState('');
  const [newIsCorrect, setNewIsCorrect] = useState(true);
  const [newErrorReason, setNewErrorReason] = useState<ErrorReasonType>('interpretacao');
  const [newCorrectionNote, setNewCorrectionNote] = useState('');

  const evidence = content.realExamEvidence || {
    generalAccuracy: ((content.examStats.realExamHits / (content.examStats.realExamQuestions || 1)) * 100),
    targetInstitutionsAccuracy: 67.5,
    recencyWeightedAccuracy: 71.8,
    totalQuestions: content.examStats.realExamQuestions,
    hits: content.examStats.realExamHits,
    confidenceLevel: 'alta' as const,
    institutionBreakdown: [
      { institution: 'USP-RP', totalQuestions: 12, hits: 7, accuracy: 58.3, isTarget: true },
      { institution: 'UNIFESP', totalQuestions: 8, hits: 5, accuracy: 62.5, isTarget: true },
      { institution: 'ENARE', totalQuestions: 6, hits: 5, accuracy: 83.3, isTarget: false },
      { institution: 'USP-SP', totalQuestions: 4, hits: 4, accuracy: 100.0, isTarget: false },
    ],
    yearlyBreakdown: [
      { year: 2022, totalQuestions: 10, hits: 9, accuracy: 90.0, weight: 0.20 },
      { year: 2024, totalQuestions: 10, hits: 8, accuracy: 80.0, weight: 0.35 },
      { year: 2026, totalQuestions: 10, hits: 6, accuracy: 60.0, weight: 0.45 },
    ],
    errorReasonBreakdown: {
      interpretacao: 4,
      desatencao: 2,
      nao_sabia: 1,
      entre_duas: 0,
      esqueci: 0,
      raciocinio: 0,
      outro: 0,
    },
    diagnostic: {
      deficitType: 'aplicacao' as const,
      headline: 'Déficit de Aplicação e Interpretação de Bancas Alvo',
      prescribedAction: 'Priorizar questões de provas anteriores da USP-RP e UNIFESP com foco em distratores e pegadinhas de caso clínico. NÃO rever aula teórica.',
      isTargetDeficiency: true,
    },
    questions: [],
  };

  const questionsList = evidence.questions && evidence.questions.length > 0 ? evidence.questions : [];

  const filteredQuestions = questionsList.filter((q) => {
    if (selectedFilter === 'alvo') return q.isTargetInstitution;
    if (selectedFilter === 'erros') return !q.isCorrect;
    if (selectedFilter === 'recentes') return q.year >= 2025;
    return true;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;

    const newQ: RealExamQuestionRecord = {
      id: `q-real-${Date.now()}`,
      institution: newInstitution,
      year: newYear,
      questionNumber: newQuestionNumber,
      statementSnippet: newStatement,
      isCorrect: newIsCorrect,
      errorReason: newIsCorrect ? undefined : newErrorReason,
      userCorrectionNote: newIsCorrect ? undefined : newCorrectionNote,
      recencyWeight: newYear >= 2026 ? 1.0 : newYear >= 2024 ? 0.85 : 0.7,
      isTargetInstitution: ['USP-RP', 'UNIFESP', 'USP-SP'].includes(newInstitution),
    };

    if (onAddQuestion) {
      onAddQuestion(content.id, newQ);
    }
    setShowAddModal(false);
    setNewStatement('');
    setNewCorrectionNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-surface-container flex items-start justify-between gap-4 bg-surface-container-low/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-code-metric flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">history_edu</span>
                Evidência de Aplicação: Provas Reais
              </span>
              <span className="text-xs text-secondary">• {content.moduloName}</span>
              <span className="text-xs text-secondary">• {content.areaName}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
              {content.name}
            </h2>
            <p className="text-xs text-secondary leading-relaxed max-w-2xl">
              Cada questão resolvida funciona como evidência empírica direta de concurso. O domínio geral afere sua capacidade neutra de resolução; a instituição-alvo calibra sua prioridade no planejamento.
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

        {/* Content Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-on-surface">
          {/* 1. KPIs Principais: Separação Domínio vs Prioridade Instituição-Alvo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1: Domínio Geral */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-xs text-secondary">
                <span className="font-semibold">Aplicação Geral</span>
                <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-surface-container text-secondary">
                  Todas as Provas
                </span>
              </div>
              <div className="text-2xl font-bold font-code-metric text-primary">
                {evidence.generalAccuracy.toFixed(1)}%
              </div>
              <p className="text-[0.6875rem] text-secondary">
                Domínio neutro: {evidence.hits} acertos em {evidence.totalQuestions} questões reais.
              </p>
            </div>

            {/* KPI 2: Instituições-Alvo */}
            <div className={`p-4 rounded-2xl border space-y-1 ${
              evidence.targetInstitutionsAccuracy < evidence.generalAccuracy
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-amber-700">stars</span>
                  Bancas-Alvo
                </span>
                <span className="text-[0.625rem] px-1.5 py-0.5 rounded font-bold bg-amber-200/80 text-amber-900">
                  Prioridade
                </span>
              </div>
              <div className="text-2xl font-bold font-code-metric text-amber-900">
                {evidence.targetInstitutionsAccuracy.toFixed(1)}%
              </div>
              <p className="text-[0.6875rem] text-amber-800">
                ⚠️ {((evidence.generalAccuracy - evidence.targetInstitutionsAccuracy)).toFixed(1)} p.p. abaixo do domínio geral.
              </p>
            </div>

            {/* KPI 3: Recência Ponderada */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-xs text-secondary">
                <span className="font-semibold">Recência (2022-26)</span>
                <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-surface-container text-secondary">
                  Ponderado
                </span>
              </div>
              <div className="text-2xl font-bold font-code-metric text-purple-700">
                {evidence.recencyWeightedAccuracy.toFixed(1)}%
              </div>
              <p className="text-[0.6875rem] text-secondary">
                Provas de 2026 têm maior peso que 2022, detectando tendência recente.
              </p>
            </div>

            {/* KPI 4: Incidência 5 Anos */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-xs text-secondary">
                <span className="font-semibold">Incidência Histórica</span>
                <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  5 Anos
                </span>
              </div>
              <div className="text-2xl font-bold font-code-metric text-on-surface">
                {content.incidence.incidenceRatePercent || 72}%
              </div>
              <p className="text-[0.6875rem] text-secondary">
                Apareceu em {content.incidence.totalAppearancesLast5Years || 18} de {content.incidence.totalExamsAnalyzed || 25} provas das bancas-alvo.
              </p>
            </div>
          </div>

          {/* 2. Banner Pedagógico da Arquitetura do Sistema */}
          <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary text-base">account_tree</span>
              <span>Regra Estrutural de Arquitetura: Separação Domínio vs Prioridade</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.6875rem]">
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                <span className="font-bold text-primary block mb-0.5">1. DESEMPENHO</span>
                <span className="text-secondary text-[0.625rem]">Gera o <strong>Domínio Geral</strong> ({evidence.generalAccuracy.toFixed(1)}%). Mede sua capacidade real de aplicar o conhecimento.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                <span className="font-bold text-amber-700 block mb-0.5">2. INSTITUIÇÃO-ALVO</span>
                <span className="text-secondary text-[0.625rem]">Entra no <strong>Planejamento</strong>. Dificuldade nas bancas alvo ({evidence.targetInstitutionsAccuracy.toFixed(1)}%) eleva a urgência.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                <span className="font-bold text-indigo-700 block mb-0.5">3. INCIDÊNCIA (5 anos)</span>
                <span className="text-secondary text-[0.625rem]">Aumenta a <strong>Importância</strong> (72%). NÃO infla o domínio diretamente, orienta a alocação de tempo.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                <span className="font-bold text-emerald-700 block mb-0.5">4. FSRS &amp; PRAZO</span>
                <span className="text-secondary text-[0.625rem]">Define a <strong>Necessidade de Revisão</strong> e ritmo semanal para fechar a meta em 2 anos.</span>
              </div>
            </div>
          </div>

          {/* 3. Dois Painéis: Desempenho por Instituição + Recência Histórica por Ano */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Breakdown por Instituição */}
            <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-surface-container space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">apartment</span>
                  Desempenho por Instituição
                </h3>
                <span className="text-[0.625rem] text-secondary">Identidade preservada</span>
              </div>

              <div className="space-y-2">
                {evidence.institutionBreakdown.map((item) => (
                  <div
                    key={item.institution}
                    className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs text-on-surface font-semibold">{item.institution}</strong>
                        {item.isTarget && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[0.5625rem] font-bold">
                            Banca-Alvo
                          </span>
                        )}
                      </div>
                      <div className="text-[0.6875rem] text-secondary">
                        {item.hits} de {item.totalQuestions} questões acertadas
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-code-metric font-bold text-sm ${
                        item.accuracy >= 80
                          ? 'text-emerald-700'
                          : item.accuracy >= 65
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}>
                        {item.accuracy.toFixed(1)}%
                      </div>
                      <span className="text-[0.5625rem] text-secondary block">
                        {item.accuracy < 70 ? 'Déficit na banca' : 'Consolidado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recência por Ano (2022 vs 2024 vs 2026) */}
            <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-surface-container space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-purple-700">calendar_today</span>
                  Evolução Temporal por Ano de Prova
                </h3>
                <span className="text-[0.625rem] text-secondary">Maior peso nos anos recentes</span>
              </div>

              <div className="space-y-2">
                {evidence.yearlyBreakdown.map((y) => (
                  <div
                    key={y.year}
                    className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-code-metric font-bold text-on-surface">Provas {y.year}</strong>
                        <span className="text-[0.5625rem] text-secondary">
                          (peso {Math.round(y.weight * 100)}% na estimativa atual)
                        </span>
                      </div>
                      <span className="text-[0.6875rem] text-secondary">
                        {y.hits}/{y.totalQuestions} acertos ({y.accuracy.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="w-28 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            y.accuracy >= 80 ? 'bg-emerald-500' : y.accuracy >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${y.accuracy}%` }}
                        />
                      </div>
                      <span className="text-xs font-code-metric font-bold">{y.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[0.6875rem] text-secondary bg-surface-container-lowest p-2 rounded-lg border border-surface-container">
                💡 <strong>Diagnóstico de Recência:</strong> Queda de 90% (2022) para 60% (2026). O sistema detecta o declínio recente mesmo que a média simples fosse 76,7%.
              </p>
            </div>
          </div>

          {/* 4. Natureza e Motivo dos Erros (Conhecimento vs Aplicação vs Atenção) */}
          <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-rose-700">psychology_alt</span>
                Diagnóstico dos Motivos de Erro
              </h3>
              <span className="text-[0.625rem] text-secondary">
                {Object.values(evidence.errorReasonBreakdown).reduce((a: number, b: any) => a + (Number(b) || 0), 0)} erros categorizados
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-center">
                <span className="text-base font-bold font-code-metric text-rose-700 block">
                  {evidence.errorReasonBreakdown.interpretacao || 0}
                </span>
                <span className="text-[0.6875rem] font-bold text-on-surface block">Interpretação</span>
                <span className="text-[0.5625rem] text-secondary">Enunciado longo / pegadinha</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-center">
                <span className="text-base font-bold font-code-metric text-amber-700 block">
                  {evidence.errorReasonBreakdown.desatencao || 0}
                </span>
                <span className="text-[0.6875rem] font-bold text-on-surface block">Desatenção</span>
                <span className="text-[0.5625rem] text-secondary">Leitura rápida / distração</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-center">
                <span className="text-base font-bold font-code-metric text-blue-700 block">
                  {evidence.errorReasonBreakdown.nao_sabia || 0}
                </span>
                <span className="text-[0.6875rem] font-bold text-on-surface block">Não Sabia</span>
                <span className="text-[0.5625rem] text-secondary">Lacuna teórica pura</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-center">
                <span className="text-base font-bold font-code-metric text-purple-700 block">
                  {(evidence.errorReasonBreakdown.entre_duas || 0) + (evidence.errorReasonBreakdown.esqueci || 0)}
                </span>
                <span className="text-[0.6875rem] font-bold text-on-surface block">Entre Duas / Esqueci</span>
                <span className="text-[0.5625rem] text-secondary">Dúvida no distrator</span>
              </div>
            </div>

            {/* Prescrição do Algoritmo */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">smart_toy</span>
              <div>
                <strong className="block text-primary font-bold">Prescrição Inteligente do Sistema:</strong>
                <p className="text-secondary text-[0.6875rem] leading-relaxed mt-0.5">
                  {evidence.diagnostic.prescribedAction}
                </p>
              </div>
            </div>
          </div>

          {/* 5. Lista de Questões Reais com Identidade Preservada */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">fact_check</span>
                  Amostragem de Questões Reais Vinculadas ({filteredQuestions.length})
                </h3>
                <p className="text-[0.6875rem] text-secondary">
                  Cada questão preserva instituição, ano, acerto/erro e motivo do erro.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded-lg border border-surface-container text-[0.6875rem]">
                  <button
                    onClick={() => setSelectedFilter('todas')}
                    className={`px-2 py-1 rounded-md font-semibold transition-all ${
                      selectedFilter === 'todas' ? 'bg-surface-container-lowest shadow-xs text-on-surface' : 'text-secondary'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedFilter('alvo')}
                    className={`px-2 py-1 rounded-md font-semibold transition-all ${
                      selectedFilter === 'alvo' ? 'bg-surface-container-lowest shadow-xs text-amber-800' : 'text-secondary'
                    }`}
                  >
                    Bancas-Alvo
                  </button>
                  <button
                    onClick={() => setSelectedFilter('erros')}
                    className={`px-2 py-1 rounded-md font-semibold transition-all ${
                      selectedFilter === 'erros' ? 'bg-surface-container-lowest shadow-xs text-rose-800' : 'text-secondary'
                    }`}
                  >
                    Erros
                  </button>
                  <button
                    onClick={() => setSelectedFilter('recentes')}
                    className={`px-2 py-1 rounded-md font-semibold transition-all ${
                      selectedFilter === 'recentes' ? 'bg-surface-container-lowest shadow-xs text-purple-800' : 'text-secondary'
                    }`}
                  >
                    2025-2026
                  </button>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-[0.6875rem] font-bold hover:bg-primary-container transition-all flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  <span>Registrar Questão Real</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    q.isCorrect
                      ? 'bg-surface-container-low/40 border-surface-container'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-surface-container font-code-metric font-bold text-[0.6875rem] text-on-surface">
                          {q.institution} {q.year} • Q{q.questionNumber}
                        </span>
                        {q.isTargetInstitution && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[0.5625rem] font-bold">
                            Banca-Alvo
                          </span>
                        )}
                        <span className={`px-2 py-0.2 rounded text-[0.625rem] font-bold ${
                          q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {q.isCorrect ? 'Correta ✅' : 'Incorreta ❌'}
                        </span>
                        {!q.isCorrect && q.errorReason && (
                          <span className="text-[0.625rem] text-rose-700 font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">
                              {errorReasonConfig[q.errorReason]?.icon || 'help'}
                            </span>
                            {errorReasonConfig[q.errorReason]?.label || q.errorReason}
                          </span>
                        )}
                      </div>

                      <p className="text-[0.6875rem] text-on-surface leading-relaxed font-medium">
                        &ldquo;{q.statementSnippet}&rdquo;
                      </p>

                      {q.userCorrectionNote && (
                        <div className="p-1.5 rounded bg-white/80 border border-rose-200 text-[0.625rem] text-rose-900">
                          <strong>Anotação do Erro:</strong> {q.userCorrectionNote}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <div className="p-6 rounded-xl bg-surface-container-low text-center text-xs text-secondary italic">
                  Nenhuma questão encontrada com o filtro selecionado.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-surface-container flex items-center justify-between bg-surface-container-low/30">
          <div className="text-xs text-secondary">
            Métricas de provas reais integradas ao grafo de conhecimento do candidato.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
          >
            Concluir Análise
          </button>
        </div>
      </div>

      {/* Modal Interno para Adicionar Nova Questão de Prova Real */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-scrim/60 p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-bold text-sm text-on-surface">Registrar Nova Questão Real</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-secondary mb-1 font-semibold">Instituição</label>
                  <select
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    className="w-full h-8 px-2 bg-surface-container-low rounded-lg border border-surface-container font-medium text-xs"
                  >
                    <option value="USP-RP">USP-RP (Alvo)</option>
                    <option value="UNIFESP">UNIFESP (Alvo)</option>
                    <option value="USP-SP">USP-SP (Alvo)</option>
                    <option value="ENARE">ENARE</option>
                    <option value="UNICAMP">UNICAMP</option>
                    <option value="SUS-SP">SUS-SP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary mb-1 font-semibold">Ano</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-surface-container-low rounded-lg border border-surface-container font-medium text-xs"
                  >
                    <option value={2026}>2026 (Peso 1.0)</option>
                    <option value={2025}>2025 (Peso 0.9)</option>
                    <option value={2024}>2024 (Peso 0.85)</option>
                    <option value={2023}>2023 (Peso 0.75)</option>
                    <option value={2022}>2022 (Peso 0.70)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary mb-1 font-semibold">Nº Questão</label>
                  <input
                    type="number"
                    value={newQuestionNumber}
                    onChange={(e) => setNewQuestionNumber(Number(e.target.value))}
                    className="w-full h-8 px-2 bg-surface-container-low rounded-lg border border-surface-container font-code-metric text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-secondary mb-1 font-semibold">Enunciado ou Resumo Clínico</label>
                <textarea
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  placeholder="Ex: Paciente com IC descompensada perfil B refratário a furosemida..."
                  className="w-full p-2 bg-surface-container-low rounded-lg border border-surface-container text-xs h-16 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 font-semibold">Resultado da Questão</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewIsCorrect(true)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                      newIsCorrect ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-surface-container-low border-surface-container text-secondary'
                    }`}
                  >
                    Acerto ✅
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewIsCorrect(false)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                      !newIsCorrect ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-surface-container-low border-surface-container text-secondary'
                    }`}
                  >
                    Erro ❌
                  </button>
                </div>
              </div>

              {!newIsCorrect && (
                <div className="space-y-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div>
                    <label className="block text-rose-950 font-bold mb-1">Natureza do Erro (Diagnóstico):</label>
                    <select
                      value={newErrorReason}
                      onChange={(e) => setNewErrorReason(e.target.value as ErrorReasonType)}
                      className="w-full h-8 px-2 bg-white rounded-lg border border-rose-300 text-xs font-semibold text-rose-900"
                    >
                      <option value="interpretacao">Interpretei errado (enunciado/distrator)</option>
                      <option value="desatencao">Desatenção / pressa</option>
                      <option value="nao_sabia">Não sabia (lacuna teórica)</option>
                      <option value="esqueci">Esqueci (falha de memória)</option>
                      <option value="entre_duas">Fiquei entre duas alternativas</option>
                      <option value="raciocinio">Erro de raciocínio clínico</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newCorrectionNote}
                      onChange={(e) => setNewCorrectionNote(e.target.value)}
                      placeholder="Anotação de aprendizado com o erro..."
                      className="w-full h-8 px-2 bg-white rounded-lg border border-rose-300 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-secondary font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-sm"
                >
                  Adicionar Evidência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
