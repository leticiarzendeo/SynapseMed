import React, { useState } from 'react';
import { db } from '../data/relationalDatabase';
import { QuestionErrorReasonEnum } from '../types';

export const BancoRelacionalView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<
    | 'contents'
    | 'medway_resources'
    | 'content_osler_mapping'
    | 'questions'
    | 'question_attempts'
    | 'fsrs_states'
    | 'content_assessments'
    | 'activities'
    | 'study_sessions'
    | 'weekly_plans'
  >('contents');

  const [simulatingContentId, setSimulatingContentId] = useState<string>('c-disturbios-obstrutivos');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const fourTimes = db.getFourTimesMetrics();

  // Executa o ciclo de feedback adaptativo (Princípio 29 do usuário)
  const handleRunFeedbackCycle = () => {
    const logs: string[] = [];
    logs.push(`▶ 1. Usuária iniciou 20 questões de prova para "${simulatingContentId.toUpperCase()}".`);
    
    // Registra tentativa com erro por desatenção
    const attempt = db.recordQuestionAttempt({
      userId: 'usr-leticia-01',
      questionId: 'q-usp-42',
      correct: false,
      errorReason: 'INATTENTION',
      otherDescription: 'Pegadinha de corte no critério GOLD',
      durationSeconds: 115,
      notes: 'Erro registrado no Caderno de Erros estruturado.',
    });
    logs.push(`✓ 2. Questão registrada no question_attempts (id: ${attempt.id}). Motivo: INATTENTION.`);

    // Registra sessão de estudo
    const session = db.recordStudySession({
      userId: 'usr-leticia-01',
      activityId: 'act-dpoc-questoes',
      contentId: simulatingContentId,
      activeDurationMinutes: 60,
      completionPercentage: 100,
      notes: 'Sessão concluída com 13/20 acertos (65%).',
    });
    logs.push(`✓ 3. Sessão gravada no study_sessions (60 min). Atividade marcada como COMPLETED.`);

    // Recálculo do Domínio e Consolidação
    const assessment = db.recalculateContentAssessment(simulatingContentId);
    logs.push(
      `✓ 4. Domínio recalculado para ${assessment.domainScore}% (Conhecimento: ${assessment.knowledgeScore}% | Aplicação: ${assessment.applicationScore}% | Retenção: ${assessment.retentionScore}%). Status: ${assessment.consolidationStatus}.`
    );

    // Recálculo da Prioridade
    const priority = db.recalculateContentPriority(simulatingContentId);
    logs.push(
      `✓ 5. Prioridade dinâmica recalculada: Score ${priority.score} (${priority.urgency}). Déficit: ${priority.domainDeficit} p.p., Incidência: ${priority.incidenceScore}.`
    );

    logs.push(`🎯 6. Ciclo concluído: Você estuda → o sistema aprende → o plano semanal se adapta!`);
    setSimulationLog(logs);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Filosofia Arquitetural */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">database</span>
              <span>Estrutura do Banco de Dados Relacional</span>
              <span className="text-secondary">•</span>
              <span className="text-secondary font-medium">30 Princípios Estruturais</span>
            </div>
            <h2 className="text-xl font-extrabold text-on-surface mt-1">
              O Conteúdo como o Coração do Sistema
            </h2>
            <p className="text-xs text-secondary mt-1 max-w-3xl leading-relaxed">
              Tudo gira em torno do Conteúdo (ex: <span className="font-semibold text-on-surface">Clínica Médica → Cardiologia → ICC</span>).
              Medway e Osler não são o currículo, mas fontes associadas. O conteúdo é o ponto de convergência de recursos, flashcards, provas, FSRS, domínio, prioridade e sessões.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold font-code-metric">
              3 Áreas Curriculares Base
            </span>
          </div>
        </div>

        {/* Diagrama de Fluxo Central */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container text-xs space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-[0.6875rem] uppercase tracking-wider">
            <span className="material-symbols-outlined text-xs">schema</span>
            <span>Ciclo Central de Dados &amp; Decisão Algorítmica</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-center font-semibold text-secondary text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface">
              CURRÍCULO (Área → Módulo → Conteúdo)
            </span>
            <span className="text-primary font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface">
              FONTES (Medway + Osler N:M + Provas)
            </span>
            <span className="text-primary font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface">
              AVALIAÇÃO DE DOMÍNIO + FSRS + INCIDÊNCIA
            </span>
            <span className="text-primary font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface">
              PRIORIDADE DINÂMICA
            </span>
            <span className="text-primary font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold">
              PLANEJADOR SEMANAL (8h Regulares)
            </span>
          </div>
        </div>
      </div>

      {/* Grid de 4 Cards: Os 4 Conceitos Fundamentais de Tempo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary font-semibold">
            <span>1. Capacidade Regular</span>
            <span className="material-symbols-outlined text-xs text-primary">schedule</span>
          </div>
          <div className="font-code-metric text-2xl font-black text-on-surface">
            {Math.floor(fourTimes.capacityMinutes / 60)}h{fourTimes.capacityMinutes % 60 ? `${fourTimes.capacityMinutes % 60}m` : '00'}
          </div>
          <span className="text-[0.6875rem] text-secondary block">
            Segunda a Sexta (ex: 8h semanais)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary font-semibold">
            <span>2. Tempo Planejado</span>
            <span className="material-symbols-outlined text-xs text-indigo-600">event_note</span>
          </div>
          <div className="font-code-metric text-2xl font-black text-indigo-700">
            {Math.floor(fourTimes.plannedMinutes / 60)}h{fourTimes.plannedMinutes % 60 ? `${fourTimes.plannedMinutes % 60}m` : '00'}
          </div>
          <span className="text-[0.6875rem] text-secondary block">
            Alocado pelo algoritmo no calendário
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary font-semibold">
            <span>3. Tempo Realizado</span>
            <span className="material-symbols-outlined text-xs text-emerald-600">check_circle</span>
          </div>
          <div className="font-code-metric text-2xl font-black text-emerald-700">
            {Math.floor(fourTimes.realizedMinutes / 60)}h{fourTimes.realizedMinutes % 60 ? `${fourTimes.realizedMinutes % 60}m` : '00'}
          </div>
          <span className="text-[0.6875rem] text-secondary block">
            Executado via sessões de estudo
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
          <div className="flex items-center justify-between text-xs text-purple-900 font-semibold">
            <span>4. Tempo Extraordinário</span>
            <span className="material-symbols-outlined text-xs text-purple-700">quiz</span>
          </div>
          <div className="font-code-metric text-2xl font-black text-purple-800">
            {Math.floor(fourTimes.extraordinarySimulationMinutes / 60)}h00
          </div>
          <span className="text-[0.6875rem] text-purple-700 block font-medium">
            Simulados ficam FORA das 8h!
          </span>
        </div>
      </div>

      {/* Seletor de Tabelas Relacionais */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">table_chart</span>
            <span>Explorador de Tabelas do Banco em Memória</span>
          </h3>
          <span className="text-xs text-secondary">
            Dados sincronizados com o núcleo relacional
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { key: 'contents', label: 'contents', count: db.contents.length },
            { key: 'medway_resources', label: 'medway_resources', count: db.medwayResources.length },
            { key: 'content_osler_mapping', label: 'content_osler_mapping (N:M)', count: db.contentOslerMappings.length },
            { key: 'questions', label: 'questions (IA vs Usuária)', count: db.questions.length },
            { key: 'question_attempts', label: 'question_attempts', count: db.questionAttempts.length },
            { key: 'fsrs_states', label: 'fsrs_states', count: db.fsrsStates.length },
            { key: 'content_assessments', label: 'content_assessments', count: db.contentAssessments.length },
            { key: 'activities', label: 'activities', count: db.activities.length },
            { key: 'study_sessions', label: 'study_sessions', count: db.studySessions.length },
            { key: 'weekly_plans', label: 'weekly_plans', count: db.weeklyPlans.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTable(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedTable === tab.key
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[0.625rem] font-code-metric ${
                  selectedTable === tab.key ? 'bg-white/20 text-white' : 'bg-surface-container text-secondary'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Visualização da Tabela Selecionada */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs overflow-hidden">
          {/* 1. CONTENTS */}
          {selectedTable === 'contents' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">id</th>
                    <th className="p-3">module_id</th>
                    <th className="p-3">nome</th>
                    <th className="p-3">ordem</th>
                    <th className="p-3">obrigatório</th>
                    <th className="p-3">ativo (soft delete)</th>
                    <th className="p-3">regra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.contents.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric font-bold text-primary">{c.id}</td>
                      <td className="p-3 font-code-metric text-secondary">{c.moduleId}</td>
                      <td className="p-3 font-bold text-on-surface">{c.name}</td>
                      <td className="p-3 font-code-metric text-secondary">{c.order}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                          {c.isMandatory ? 'Sim (2 Anos)' : 'Opcional'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[0.6875rem] font-bold">
                          {c.active ? 'Ativo' : 'Desativado'}
                        </span>
                      </td>
                      <td className="p-3 text-secondary text-[0.6875rem]">
                        Permanente (nunca deletado fisicamente para preservar histórico)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. MEDWAY_RESOURCES */}
          {selectedTable === 'medway_resources' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">id</th>
                    <th className="p-3">content_id</th>
                    <th className="p-3">tipo</th>
                    <th className="p-3">título</th>
                    <th className="p-3">duração est.</th>
                    <th className="p-3">questões</th>
                    <th className="p-3">fonte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.medwayResources.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric font-bold text-primary">{r.id}</td>
                      <td className="p-3 font-code-metric text-secondary">{r.contentId}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[0.6875rem] font-bold ${
                            r.type === 'THEORY'
                              ? 'bg-blue-100 text-blue-800'
                              : r.type === 'PRE_EXERCISE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {r.type}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-on-surface">{r.title}</td>
                      <td className="p-3 font-code-metric text-on-surface">{r.estimatedMinutes} min</td>
                      <td className="p-3 font-code-metric text-secondary">{r.questionCount} q</td>
                      <td className="p-3 text-secondary">{r.sourceReference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. CONTENT_OSLER_MAPPING (N:M) */}
          {selectedTable === 'content_osler_mapping' && (
            <div className="space-y-3 p-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                <span>
                  <strong>Princípio 9 do Banco:</strong> Mapeamento muitos-para-muitos explícito. 1 conteúdo (ex: ICC) conecta-se a múltiplos blocos Osler, e 1 bloco Osler pode cobrir múltiplos conteúdos (ex: DPOC + Asma).
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                    <tr>
                      <th className="p-3">id</th>
                      <th className="p-3">content_id</th>
                      <th className="p-3">osler_block_id</th>
                      <th className="p-3">bloco osler correspondente</th>
                      <th className="p-3">data mapeamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {db.contentOslerMappings.map((m) => {
                      const block = db.oslerBlocks.find((b) => b.id === m.oslerBlockId);
                      return (
                        <tr key={m.id} className="hover:bg-surface-container-low/40">
                          <td className="p-3 font-code-metric text-secondary">{m.id}</td>
                          <td className="p-3 font-code-metric font-bold text-primary">{m.contentId}</td>
                          <td className="p-3 font-code-metric text-secondary">{m.oslerBlockId}</td>
                          <td className="p-3 font-bold text-on-surface">{block?.title}</td>
                          <td className="p-3 font-code-metric text-secondary">{m.createdAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. QUESTIONS (IA vs Usuária) */}
          {selectedTable === 'questions' && (
            <div className="space-y-3 p-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">psychology</span>
                <span>
                  <strong>Princípio 12 do Banco:</strong> A IA não manda no currículo. Guardamos <code>ai_content_id</code> (sugestão original) e <code>final_content_id</code> (validado pela usuária) para medir acurácia da IA.
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                    <tr>
                      <th className="p-3">id</th>
                      <th className="p-3">prova</th>
                      <th className="p-3">nº</th>
                      <th className="p-3">sugestão ia</th>
                      <th className="p-3">conteúdo final</th>
                      <th className="p-3">confiança ia</th>
                      <th className="p-3">status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {db.questions.map((q) => (
                      <tr key={q.id} className="hover:bg-surface-container-low/40">
                        <td className="p-3 font-code-metric text-secondary">{q.id}</td>
                        <td className="p-3 font-code-metric text-on-surface">{q.examId}</td>
                        <td className="p-3 font-bold font-code-metric text-on-surface">Q{q.questionNumber}</td>
                        <td className="p-3 font-code-metric text-secondary">{q.aiContentId}</td>
                        <td className="p-3 font-code-metric font-bold text-emerald-700">{q.finalContentId}</td>
                        <td className="p-3 font-code-metric font-bold text-primary">
                          {Math.round((q.aiConfidence || 0) * 100)}%
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                            {q.classificationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. QUESTION_ATTEMPTS */}
          {selectedTable === 'question_attempts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">id</th>
                    <th className="p-3">questão</th>
                    <th className="p-3">resultado</th>
                    <th className="p-3">motivo do erro (7 canônicos)</th>
                    <th className="p-3">tempo</th>
                    <th className="p-3">detalhe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.questionAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric text-secondary">{att.id}</td>
                      <td className="p-3 font-code-metric font-bold text-on-surface">{att.questionId}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[0.6875rem] font-bold ${
                            att.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.correct ? 'Acertou ✓' : 'Errou ✕'}
                        </span>
                      </td>
                      <td className="p-3">
                        {att.errorReason ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold font-code-metric text-[0.6875rem]">
                            {att.errorReason}
                          </span>
                        ) : (
                          <span className="text-secondary">—</span>
                        )}
                      </td>
                      <td className="p-3 font-code-metric text-secondary">{att.durationSeconds}s</td>
                      <td className="p-3 text-secondary text-[0.6875rem]">
                        {att.otherDescription || att.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. FSRS_STATES */}
          {selectedTable === 'fsrs_states' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">content_id</th>
                    <th className="p-3">estabilidade (S)</th>
                    <th className="p-3">dificuldade (D)</th>
                    <th className="p-3">retrievability (R)</th>
                    <th className="p-3">última revisão</th>
                    <th className="p-3">próxima revisão</th>
                    <th className="p-3">versão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.fsrsStates.map((f) => (
                    <tr key={f.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric font-bold text-primary">{f.contentId}</td>
                      <td className="p-3 font-code-metric text-on-surface font-bold">{f.stability} dias</td>
                      <td className="p-3 font-code-metric text-secondary">{f.difficulty} / 10</td>
                      <td className="p-3 font-code-metric font-extrabold text-emerald-700">
                        {Math.round(f.retrievability * 100)}%
                      </td>
                      <td className="p-3 font-code-metric text-secondary">{f.lastReviewAt?.split('T')[0]}</td>
                      <td className="p-3 font-code-metric font-bold text-rose-700">{f.nextReviewAt?.split('T')[0]}</td>
                      <td className="p-3 font-code-metric text-secondary">{f.algorithmVersion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. CONTENT_ASSESSMENTS */}
          {selectedTable === 'content_assessments' && (
            <div className="space-y-3 p-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>
                  <strong>Princípio 20 &amp; 21:</strong> Domínio não é um número fixo. É calculado pela tríade (Conhecimento Medway, Aplicação em Provas e Retenção Osler). Consolidado se domínio ≥ 85%, aplicação ≥ 80% e retenção ≥ 80%.
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                    <tr>
                      <th className="p-3">content_id</th>
                      <th className="p-3">domínio</th>
                      <th className="p-3">conhecimento</th>
                      <th className="p-3">aplicação</th>
                      <th className="p-3">retenção</th>
                      <th className="p-3">confiança</th>
                      <th className="p-3">status de consolidação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {db.contentAssessments.map((a) => (
                      <tr key={a.contentId} className="hover:bg-surface-container-low/40">
                        <td className="p-3 font-code-metric font-bold text-primary">{a.contentId}</td>
                        <td className="p-3 font-code-metric text-lg font-black text-on-surface">
                          {a.domainScore}%
                        </td>
                        <td className="p-3 font-code-metric text-secondary">{a.knowledgeScore}%</td>
                        <td className="p-3 font-code-metric text-secondary">{a.applicationScore}%</td>
                        <td className="p-3 font-code-metric text-secondary">{a.retentionScore}%</td>
                        <td className="p-3 font-code-metric text-secondary">{a.confidenceScore}%</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold ${
                              a.consolidationStatus === 'CONSOLIDATED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {a.consolidationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. ACTIVITIES */}
          {selectedTable === 'activities' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">id</th>
                    <th className="p-3">content_id</th>
                    <th className="p-3">tipo</th>
                    <th className="p-3">estimado</th>
                    <th className="p-3">restante</th>
                    <th className="p-3">status</th>
                    <th className="p-3">prioridade score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.activities.map((act) => (
                    <tr key={act.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric text-secondary">{act.id}</td>
                      <td className="p-3 font-code-metric font-bold text-primary">{act.contentId}</td>
                      <td className="p-3 font-bold text-on-surface">{act.type}</td>
                      <td className="p-3 font-code-metric text-secondary">{act.estimatedMinutes} min</td>
                      <td className="p-3 font-code-metric font-bold text-on-surface">{act.remainingMinutes} min</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[0.6875rem] font-bold">
                          {act.status}
                        </span>
                      </td>
                      <td className="p-3 font-code-metric font-extrabold text-rose-700">{act.priorityScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 9. STUDY_SESSIONS */}
          {selectedTable === 'study_sessions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">id</th>
                    <th className="p-3">activity_id</th>
                    <th className="p-3">content_id</th>
                    <th className="p-3">duração efetiva</th>
                    <th className="p-3">conclusão %</th>
                    <th className="p-3">início / fim</th>
                    <th className="p-3">notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.studySessions.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric text-secondary">{s.id}</td>
                      <td className="p-3 font-code-metric text-secondary">{s.activityId}</td>
                      <td className="p-3 font-code-metric font-bold text-primary">{s.contentId}</td>
                      <td className="p-3 font-code-metric font-bold text-on-surface">
                        {s.activeDurationMinutes} min
                      </td>
                      <td className="p-3 font-code-metric text-emerald-700 font-bold">{s.completionPercentage}%</td>
                      <td className="p-3 font-code-metric text-secondary text-[0.6875rem]">
                        {s.startedAt.split('T')[1].slice(0, 5)} - {s.endedAt.split('T')[1].slice(0, 5)}
                      </td>
                      <td className="p-3 text-secondary text-[0.6875rem]">{s.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 10. WEEKLY_PLANS */}
          {selectedTable === 'weekly_plans' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[0.625rem] border-b border-surface-container">
                  <tr>
                    <th className="p-3">id</th>
                    <th className="p-3">semana</th>
                    <th className="p-3">disponível (capacidade)</th>
                    <th className="p-3">planejado</th>
                    <th className="p-3">realizado</th>
                    <th className="p-3">ritmo necessário (2 anos)</th>
                    <th className="p-3">status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {db.weeklyPlans.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/40">
                      <td className="p-3 font-code-metric text-secondary">{p.id}</td>
                      <td className="p-3 font-code-metric text-on-surface">
                        {p.weekStart} a {p.weekEnd}
                      </td>
                      <td className="p-3 font-code-metric font-bold text-on-surface">
                        {p.availableMinutes} min (8h)
                      </td>
                      <td className="p-3 font-code-metric text-indigo-700 font-bold">
                        {p.plannedMinutes} min (7h30)
                      </td>
                      <td className="p-3 font-code-metric text-emerald-700 font-bold">
                        {p.completedMinutes} min ({Math.floor(p.completedMinutes / 60)}h{(p.completedMinutes % 60).toString().padStart(2, '0')})
                      </td>
                      <td className="p-3 font-code-metric text-secondary">{p.requiredPaceMinutes} min (7h35)</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Simulador Interativo do Ciclo de Aprendizado (Princípio 29) */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-primary">
              Princípio 29 em Ação
            </span>
            <h3 className="font-bold text-sm text-on-surface mt-0.5">
              Simulador do Ciclo: Você estuda → o sistema aprende → o plano muda
            </h3>
            <p className="text-xs text-secondary">
              Dispare um ciclo de estudo em DPOC para ver o recálculo imediato de Aplicação, Domínio, FSRS e Prioridade.
            </p>
          </div>

          <button
            onClick={handleRunFeedbackCycle}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span>Executar Ciclo em DPOC</span>
          </button>
        </div>

        {simulationLog.length > 0 && (
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2 text-xs font-code-metric animate-fadeIn">
            <span className="text-[0.6875rem] uppercase font-bold text-secondary tracking-wider block">
              Log de Execução do Banco Relacional:
            </span>
            <div className="space-y-1">
              {simulationLog.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    line.startsWith('🎯')
                      ? 'text-emerald-800 font-bold pt-1'
                      : line.startsWith('✓')
                      ? 'text-on-surface'
                      : 'text-primary font-semibold'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
