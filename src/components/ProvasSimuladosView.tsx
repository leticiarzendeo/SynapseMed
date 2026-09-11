import React, { useState } from 'react';
import {
  mockSimulados,
  mockExamSubmissions,
  fullCurriculumHierarchy,
  mockGlobalSimuladosHistory,
} from '../data/mockData';
import {
  ExamQuestionEntry,
  ErrorReasonType,
  ContentItem,
  RealExamQuestionRecord,
} from '../types';
import { RealExamEvidenceModal } from './RealExamEvidenceModal';
import { SimuladoEvidenceModal } from './SimuladoEvidenceModal';
import { DominioDossieModal } from './DominioDossieModal';
import { calculateContentDomain } from '../utils/domainCalculator';

export const ProvasSimuladosView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'historico' | 'evidencias' | 'revisao' | 'upload'>('historico');
  const [activeSubmission] = useState(mockExamSubmissions[0]);
  const [questions, setQuestions] = useState<ExamQuestionEntry[]>(mockExamSubmissions[0].questions);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Flat list of all contents for user manual reclassification
  const allContents = fullCurriculumHierarchy.flatMap((area) =>
    area.modules.flatMap((mod) =>
      mod.contents.map((c) => ({
        id: c.id,
        name: c.name,
        moduleName: mod.name,
        areaName: area.name,
      }))
    )
  );

  const fullContentList: ContentItem[] = fullCurriculumHierarchy.flatMap((area) =>
    area.modules.flatMap((mod) => mod.contents)
  );

  const [selectedContentId, setSelectedContentId] = useState<string>('c-icc');
  const selectedContent = fullContentList.find((c) => c.id === selectedContentId) || fullContentList[0];

  // Evidence Modals
  const [realExamModalContent, setRealExamModalContent] = useState<ContentItem | null>(null);
  const [simuladoModalContent, setSimuladoModalContent] = useState<ContentItem | null>(null);
  const [dominioModalContent, setDominioModalContent] = useState<ContentItem | null>(null);

  const handleUpdateClassification = (questionId: string, newContentId: string) => {
    const targetContent = allContents.find((c) => c.id === newContentId);
    if (!targetContent) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              contentId: targetContent.id,
              contentName: targetContent.name,
              moduloName: targetContent.moduleName,
              areaName: targetContent.areaName,
            }
          : q
      )
    );
  };

  const handleUpdateResult = (questionId: string, isCorrect: boolean) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              isCorrect,
              errorReason: isCorrect ? undefined : (q.errorReason || 'entre_duas'),
            }
          : q
      )
    );
  };

  const handleConfirmFeedCurriculum = () => {
    setShowSuccessBanner(true);
    setTimeout(() => {
      setShowSuccessBanner(false);
      setSelectedTab('historico');
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">assignment</span>
            <span>Provas Reais &amp; Simulados</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Extração &amp; Retroalimentação</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Provas na Íntegra e Gabaritos
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            Faça upload do PDF da prova ou gabarito para alimentar seu domínio real nos 650 conteúdos do currículo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTab('upload')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>Submeter Nova Prova (PDF)</span>
          </button>
        </div>
      </div>

      {showSuccessBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-700 text-xl">check_circle</span>
          <div className="text-xs">
            <strong className="block font-bold">Domínio do Currículo Atualizado com Sucesso!</strong>
            Os acertos e erros desta prova foram mapeados na árvore de conteúdos e as próximas revisões FSRS foram recalculadas.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container w-fit">
        <button
          onClick={() => setSelectedTab('historico')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'historico'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          Histórico de Provas
        </button>
        <button
          onClick={() => setSelectedTab('evidencias')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedTab === 'evidencias'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm text-primary">auto_stories</span>
          <span>Evidência Pedagógica (Provas &amp; Simulados)</span>
        </button>
        <button
          onClick={() => setSelectedTab('revisao')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            selectedTab === 'revisao'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          <span>Mapeamento de Questões</span>
          <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[0.625rem] font-bold">
            {questions.length}
          </span>
        </button>
        <button
          onClick={() => setSelectedTab('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'upload'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          Upload de Arquivo
        </button>
      </div>

      {/* Tab Content: Upload */}
      {selectedTab === 'upload' && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm space-y-5">
          <div>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Upload de Prova na Íntegra ou Gabarito
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Envie o caderno de questões ou o extrato de respostas do seu curso preparatório.
            </p>
          </div>

          <div className="border-2 border-dashed border-surface-container hover:border-primary/50 rounded-2xl p-8 text-center space-y-3 transition-colors bg-surface-container-low/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">cloud_upload</span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface">Arraste seu PDF ou clique para selecionar</div>
              <div className="text-[0.6875rem] text-secondary mt-0.5">
                Formatos suportados: PDF oficial da prova, gabarito digitalizado ou relatório Medway/Estratégia.
              </div>
            </div>
            <button
              onClick={() => setSelectedTab('revisao')}
              className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-surface-container hover:bg-surface-container text-xs font-semibold text-on-surface shadow-xs inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">attach_file</span>
              Carregar Prova Exemplo (ENARE 2024 - 100 Questões)
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Revisão de Mapeamento Pedagógico */}
      {selectedTab === 'revisao' && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold">
                  {activeSubmission.institution} • {activeSubmission.year}
                </span>
                <span className="text-xs text-secondary">• {activeSubmission.title}</span>
              </div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                Classificação das Questões na Árvore Curricular
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                A inteligência classificou cada questão em Área → Módulo → Conteúdo. Você pode reclassificar se discordar do foco clínico.
              </p>
            </div>

            <button
              onClick={handleConfirmFeedCurriculum}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Confirmar &amp; Alimentar Currículo</span>
            </button>
          </div>

          {/* List of mapped questions */}
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  q.isCorrect
                    ? 'bg-surface-container-low/40 border-surface-container'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-code-metric text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        Questão {q.questionNumber}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          q.isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {q.isCorrect ? 'Acerto ✅' : 'Erro ❌'}
                      </span>
                      {q.contentId !== q.aiSuggestedContentId && (
                        <span className="text-[0.625rem] text-primary font-bold">
                          Reclassificado por você
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-on-surface font-medium leading-relaxed">
                      &ldquo;{q.statementSnippet}&rdquo;
                    </p>

                    {/* Hierarchy Selector for User Manual Correction */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                      <span className="text-secondary text-[0.6875rem] font-semibold">
                        Mapeado para:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-secondary text-[0.6875rem]">
                          {q.areaName}
                        </span>
                        <span className="text-secondary text-xs">→</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-secondary text-[0.6875rem]">
                          {q.moduloName}
                        </span>
                        <span className="text-secondary text-xs">→</span>
                        <select
                          value={q.contentId}
                          onChange={(e) => handleUpdateClassification(q.id, e.target.value)}
                          className="h-7 px-2 bg-surface-container-lowest rounded-lg border border-surface-container text-on-surface font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {allContents.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.moduleName})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this question */}
                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdateResult(q.id, !q.isCorrect)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[0.6875rem] font-semibold text-secondary"
                    >
                      Inverter p/ {q.isCorrect ? 'Erro' : 'Acerto'}
                    </button>
                    {!q.isCorrect && (
                      <span className="text-[0.625rem] text-rose-700 font-bold">
                        Motivo: {q.errorReason || 'entre_duas'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Histórico */}
      {selectedTab === 'historico' && (
        <>
          {/* Featured Next Mock Exam */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-primary/40 shadow-sm ring-2 ring-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-code-metric text-xs font-bold">
                  Próximo Simulado Agendado
                </span>
                <span className="text-xs text-secondary font-medium">Atividade Extraordinária</span>
              </div>
              <h2 className="font-headline-sm text-base font-bold text-on-surface">
                Simulado Nacional ENARE 2025 #3
              </h2>
              <p className="text-xs text-secondary leading-relaxed">
                100 questões inéditas estilo FGV/ENARE • Sábado às 08:00 (4h de duração) • Não consome a cota regular de 8h semanais.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedTab('upload')}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
              >
                Submeter Gabarito Deste Simulado
              </button>
            </div>
          </div>

          {/* List of Previous Exams */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm space-y-4">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider">
              Histórico de Provas na Íntegra e Simulados
            </h2>
            {mockSimulados.slice(1).length === 0 ? (
              <div className="p-8 rounded-xl bg-surface-container-low/40 border border-dashed border-surface-container text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-secondary">history_edu</span>
                <p className="text-xs font-semibold text-on-surface">Nenhuma prova ou simulado concluído ainda</p>
                <p className="text-[0.6875rem] text-secondary max-w-md mx-auto">
                  Ao submeter o gabarito das provas na íntegra ou simulados de sábado, seu histórico detalhado, acurácia e caderno de erros aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockSimulados.slice(1).map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface">{item.title}</span>
                        <span className="px-2 py-0.2 rounded bg-surface-container text-secondary text-[0.625rem] font-medium">
                          {item.institution}
                        </span>
                      </div>
                      <div className="text-xs text-secondary">
                        {item.scheduledDate} • {item.hits || 0} de {item.questionsCount} questões corretas
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-secondary block">Acurácia</span>
                        <span className="font-code-metric text-base font-bold text-emerald-700">
                          {item.score || '0%'}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedTab('revisao')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface"
                      >
                        Ver Mapeamento de Questões
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab Content: Evidência Pedagógica (Provas Reais & Simulados) */}
      {selectedTab === 'evidencias' && (
        <div className="space-y-6">
          {/* Quadro Geral: Os 4 Pilares de Evidência da Plataforma */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container pb-4">
              <div>
                <span className="text-[0.6875rem] font-bold text-primary tracking-wider uppercase">
                  Arquitetura Pedagógica de Evidências
                </span>
                <h2 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
                  Como as Provas Reais e Simulados Alimentam seu Domínio e Planejamento
                </h2>
                <p className="text-xs text-secondary mt-1 max-w-3xl leading-relaxed">
                  A prova real não é apenas mais uma fonte de desempenho: ela é a evidência de aplicação mais próxima do que queremos prever na residência médica.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  4 Pilares Interligados
                </span>
              </div>
            </div>

            {/* Grid dos 4 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-blue-700">school</span>
                  <span>1. Medway</span>
                </div>
                <div className="text-[0.6875rem] text-primary font-semibold">Aprendizado Primário</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Eu aprendi este conteúdo?&rdquo;</em> Avaliado na pós-aula e reavaliações curriculares.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-purple-700">psychology</span>
                  <span>2. Osler</span>
                </div>
                <div className="text-[0.6875rem] text-purple-800 font-semibold">Retenção de Memória</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Estou conseguindo lembrar?&rdquo;</em> Flashcards e repetição espaçada FSRS a longo prazo.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5 ring-1 ring-emerald-400/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-emerald-700">history_edu</span>
                  <span>3. Provas Reais</span>
                </div>
                <div className="text-[0.6875rem] text-emerald-800 font-semibold">Aplicação Direta</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Consigo acertar na prova real?&rdquo;</em> Alta fidelidade, identidade preservada e diagnóstico de erros.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1.5 ring-1 ring-purple-400/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-purple-700">quiz</span>
                  <span>4. Simulados</span>
                </div>
                <div className="text-[0.6875rem] text-purple-800 font-semibold">Aplicação Integrada</div>
                <p className="text-[0.6875rem] text-secondary leading-normal">
                  Responde a: <em>&ldquo;Consigo integrar sob fadiga e tempo?&rdquo;</em> Ritmo de prova, pace e evolução global.
                </p>
              </div>
            </div>

            {/* Princípios de Decisão Curricular */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
              <strong className="block font-bold text-amber-900 uppercase text-[0.6875rem] tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-amber-800">rule</span>
                Regras Críticas da Engenharia Pedagógica
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[0.6875rem] text-amber-900 leading-relaxed">
                <div className="p-2 bg-amber-100/50 rounded-lg">
                  <strong className="block font-bold text-amber-950">Instituição-Alvo ≠ Domínio Geral</strong>
                  Seu desempenho na USP-SP direciona a <strong>prioridade no planejamento</strong>, mas não infla nem distorce o domínio geral do conteúdo.
                </div>
                <div className="p-2 bg-amber-100/50 rounded-lg">
                  <strong className="block font-bold text-amber-950">Incidência (5 Anos) = Importância</strong>
                  Cair 18 vezes em 25 provas não aumenta o seu domínio; eleva a <strong>urgência de consolidar</strong> antes da prova final.
                </div>
                <div className="p-2 bg-amber-100/50 rounded-lg">
                  <strong className="block font-bold text-amber-950">Simulado ≠ Reset Cego de FSRS</strong>
                  Errar uma questão de ICC em um simulado por fadiga no final de 4h NÃO reseta o FSRS se seu Osler e pós-aula estiverem consolidados.
                </div>
              </div>
            </div>
          </div>

          {/* Seletor de Conteúdo Curricular para Análise Prática */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">search</span>
                Selecione um Conteúdo para Inspecionar os Dossiês de Evidência:
              </span>
              <span className="text-[0.6875rem] text-secondary block">
                Compare as evidências de aplicação direta e integrada coletadas até o momento.
              </span>
            </div>

            <select
              value={selectedContentId}
              onChange={(e) => setSelectedContentId(e.target.value)}
              className="h-9 px-3 bg-surface-container-lowest rounded-xl border border-surface-container text-on-surface font-bold text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              {fullContentList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Domínio: {c.estimatedMastery}%)
                </option>
              ))}
            </select>
          </div>

          {/* SÍNTESE DO CÉREBRO DE DOMÍNIO PARA O CONTEÚDO SELECIONADO */}
          {(() => {
            const selectedDomainData = calculateContentDomain(selectedContent);
            const isConsolidado = selectedDomainData.status === 'consolidado';
            const isGargalo = selectedDomainData.status === 'aplicacao_insuficiente';

            return (
              <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex flex-col items-center justify-center">
                      <span className="text-[0.5625rem] font-bold uppercase">Domínio</span>
                      <span className="font-code-metric font-extrabold text-lg leading-tight">
                        {selectedDomainData.overallDomain}%
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">
                          {selectedContent.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                            isConsolidado
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : isGargalo
                              ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/40'
                              : 'bg-surface-container text-on-surface border-surface-container-high'
                          }`}
                        >
                          {selectedDomainData.statusLabel}
                        </span>
                        {selectedDomainData.isProvisional && (
                          <span className="text-[0.625rem] px-2 py-0.2 rounded-md bg-blue-100 text-blue-900 font-semibold">
                            Provisório (Sem Provas)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary font-medium">
                        {selectedDomainData.diagnostic.headline}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDominioModalContent(selectedContent)}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>Abrir Dossiê do Cérebro</span>
                  </button>
                </div>

                {/* As 4 Dimensões em Grid de Destaque */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-blue-800 flex items-center gap-1">
                      <span>📚</span> Conhecimento
                    </span>
                    <div className="font-code-metric text-xl font-bold text-blue-900">
                      {selectedDomainData.knowledgeScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Pós-aula Medway ({selectedDomainData.evidenceStats.medwayQuestionsCount}q)
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isGargalo ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400/50' : 'bg-surface-container-low/70 border-surface-container'
                  }`}>
                    <span className="text-[0.6875rem] font-bold text-emerald-800 flex items-center gap-1">
                      <span>🎯</span> Aplicação
                    </span>
                    <div className={`font-code-metric text-xl font-bold ${isGargalo ? 'text-amber-900' : 'text-emerald-900'}`}>
                      {selectedDomainData.applicationScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Provas ({selectedDomainData.evidenceStats.realExamAccuracy}%) + Simulados ({selectedDomainData.evidenceStats.simuladoAccuracy}%)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-purple-800 flex items-center gap-1">
                      <span>🧠</span> Retenção
                    </span>
                    <div className="font-code-metric text-xl font-bold text-purple-900">
                      {selectedDomainData.retentionScore}%
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Osler FSRS ({selectedDomainData.evidenceStats.fsrsStabilityDays}d estabilidade)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container space-y-1">
                    <span className="text-[0.6875rem] font-bold text-secondary flex items-center gap-1">
                      <span>📊</span> Confiança Amostral
                    </span>
                    <div className={`font-code-metric text-xl font-bold capitalize ${
                      selectedDomainData.confidenceLevel === 'alta' ? 'text-emerald-800' : selectedDomainData.confidenceLevel === 'media' ? 'text-amber-800' : 'text-rose-700'
                    }`}>
                      {selectedDomainData.confidenceLevel}
                    </div>
                    <div className="text-[0.625rem] text-secondary">
                      Score: {selectedDomainData.confidenceScore}% do volume alvo
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">
                      {selectedDomainData.diagnostic.actionIcon}
                    </span>
                    <span>
                      <strong>Próximo Passo Recomendado:</strong> {selectedDomainData.diagnostic.prescribedAction}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Comparativo dos Dois Pilares de Aplicação para o Conteúdo Selecionado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Coluna 1: Provas Reais (Aplicação Direta) */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-emerald-500/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">history_edu</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Provas Reais de Residência</h3>
                    <span className="text-[0.6875rem] text-secondary block">Evidência Primária de Aplicação</span>
                  </div>
                </div>

                <button
                  onClick={() => setRealExamModalContent(selectedContent)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Abrir Dossiê</span>
                </button>
              </div>

              {/* Indicadores Chave da Prova Real */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Amostragem</span>
                  <span className="font-code-metric font-bold text-sm text-on-surface">
                    {selectedContent.examStats.realExamQuestions} questões
                  </span>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">
                    ({selectedContent.examStats.realExamHits} acertos na íntegra)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Acurácia Geral</span>
                  <span className="font-code-metric font-bold text-sm text-primary">
                    {((selectedContent.examStats.realExamHits / (selectedContent.examStats.realExamQuestions || 1)) * 100).toFixed(1)}%
                  </span>
                  <span className="text-[0.625rem] text-emerald-800 font-semibold block mt-0.5">
                    Confiança Alta (N &ge; 25)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[0.6875rem] text-amber-900 block font-medium">Bancas-Alvo (USP/ENARE)</span>
                  <span className="font-code-metric font-bold text-sm text-amber-800">
                    {selectedContent.realExamEvidence?.targetInstitutionsAccuracy || 67.5}%
                  </span>
                  <span className="text-[0.625rem] text-rose-700 font-bold block mt-0.5">
                    -9.2 p.p. vs média geral
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Incidência 5 Anos</span>
                  <span className="font-code-metric font-bold text-sm text-on-surface">
                    18 em 25 provas
                  </span>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">
                    72% de recorrência
                  </span>
                </div>
              </div>

              {/* Recência e Alerta Temporal */}
              <div className="p-3 rounded-xl bg-surface-container-low/50 border border-surface-container space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-bold text-on-surface">Evolução Temporal Recente:</span>
                  <span className="text-[0.625rem] text-rose-700 font-bold">⚠️ Queda recente em 2026</span>
                </div>
                <div className="flex items-center justify-between text-[0.6875rem]">
                  <span className="text-secondary">2022: <strong className="text-emerald-700 font-code-metric">90%</strong></span>
                  <span className="text-secondary">2024: <strong className="text-emerald-700 font-code-metric">80%</strong></span>
                  <span className="text-secondary">2026: <strong className="text-rose-700 font-code-metric">60%</strong></span>
                </div>
              </div>

              {/* Diagnóstico de Erros */}
              <div className="p-3 rounded-xl bg-surface-container-low/50 border border-surface-container text-xs space-y-1">
                <div className="text-[0.6875rem] font-bold text-on-surface">Distribuição dos Motivos de Erro:</div>
                <div className="flex items-center gap-2 flex-wrap text-[0.6875rem]">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-rose-900 font-medium">
                    Interpretação/Distrator: <strong>4</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-amber-900 font-medium">
                    Desatenção: <strong>2</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-medium">
                    Lacuna Teórica: <strong>1</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna 2: Simulados (Aplicação Integrada) */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-purple-500/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">quiz</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Simulados Completos</h3>
                    <span className="text-[0.6875rem] text-secondary block">Aplicação Integrada sob Pressão</span>
                  </div>
                </div>

                <button
                  onClick={() => setSimuladoModalContent(selectedContent)}
                  className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">speed</span>
                  <span>Análise de Fadiga</span>
                </button>
              </div>

              {/* Indicadores Chave de Simulado */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Acurácia Integrada</span>
                  <span className="font-code-metric font-bold text-sm text-purple-800">
                    {((selectedContent.examStats.simuladoHits / (selectedContent.examStats.simuladoQuestions || 1)) * 100).toFixed(1)}%
                  </span>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">
                    (Peso 0.75 em relação à prova real)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Fadiga Cognitiva</span>
                  <span className="font-code-metric font-bold text-sm text-rose-700">
                    -24% no terço final
                  </span>
                  <span className="text-[0.625rem] text-secondary block mt-0.5">
                    (88% início &rarr; 64% final)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Tempo Médio / Questão</span>
                  <span className="font-code-metric font-bold text-sm text-on-surface">
                    132 segundos
                  </span>
                  <span className="text-[0.625rem] text-emerald-800 font-semibold block mt-0.5">
                    Ritmo adequado (meta &le; 150s)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-surface-container">
                  <span className="text-[0.6875rem] text-secondary block">Evolução Global</span>
                  <span className="font-code-metric font-bold text-sm text-emerald-700">
                    68% &rarr; 81%
                  </span>
                  <span className="text-[0.625rem] text-emerald-800 font-semibold block mt-0.5">
                    +13 p.p. em 5 simulados
                  </span>
                </div>
              </div>

              {/* Regra Anti-Reset FSRS */}
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1">
                <div className="flex items-center gap-1 font-bold text-[0.6875rem] text-purple-900">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  Proteção Pedagógica FSRS:
                </div>
                <p className="text-[0.6875rem] leading-relaxed text-purple-900">
                  Erros de simulado ocorridos após 3 horas de prova decorrentes de esgotamento atencional não devem destruir a estabilidade de memória calculada pelo Osler. O sistema cataloga a falha como <em>fadiga de execução</em> em vez de <em>esquecimento conceitual</em>.
                </p>
              </div>

              {/* Histórico Recente de Simulados */}
              <div className="p-3 rounded-xl bg-surface-container-low/50 border border-surface-container text-xs space-y-1.5">
                <div className="text-[0.6875rem] font-bold text-on-surface">Presença em Simulados Nacionais:</div>
                <div className="space-y-1 text-[0.6875rem] text-secondary">
                  <div className="flex justify-between">
                    <span>Simulado Nacional ENARE #2:</span>
                    <strong className="text-emerald-700 font-code-metric">Acerto (Q34 - 110s)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Simulado Medway SP #1:</span>
                    <strong className="text-rose-700 font-code-metric">Erro Q88 (Fadiga)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Evidência de Provas Reais */}
      {realExamModalContent && (
        <RealExamEvidenceModal
          content={realExamModalContent}
          onClose={() => setRealExamModalContent(null)}
          onAddQuestion={(contentId, newQ) => {
            // Atualização local de prova real
            setRealExamModalContent((prev) =>
              prev ? { ...prev } : null
            );
          }}
        />
      )}

      {/* Modal de Evidência de Simulados */}
      {simuladoModalContent && (
        <SimuladoEvidenceModal
          content={simuladoModalContent}
          onClose={() => setSimuladoModalContent(null)}
          onAddQuestion={(contentId, hit, reason) => {
            // Atualização local de simulado
            setSimuladoModalContent((prev) =>
              prev ? { ...prev } : null
            );
          }}
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
            setDominioModalContent(null);
          }}
        />
      )}
    </div>
  );
};
