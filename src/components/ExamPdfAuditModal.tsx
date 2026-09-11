import React, { useState } from 'react';
import {
  ExamPdfAuditReport,
  IdentificationConfidenceLevel,
  TargetInstitutionKey,
} from '../types';
import { TARGET_INSTITUTIONS_CONFIG, TARGET_INSTITUTIONS_LIST } from '../data/targetInstitutionsExamsData';

interface ExamPdfAuditModalProps {
  report: ExamPdfAuditReport;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndProcess: (confirmedMetadata: {
    institution: string;
    targetKey?: TargetInstitutionKey;
    year: number;
    title: string;
    isConfirmedForOfficialStats: boolean;
  }) => void;
}

export const ExamPdfAuditModal: React.FC<ExamPdfAuditModalProps> = ({
  report,
  isOpen,
  onClose,
  onConfirmAndProcess,
}) => {
  // Estados para override manual caso a instituição ou ano precisem de confirmação
  const [selectedInstitution, setSelectedInstitution] = useState<string>(
    report.targetInstitutionKey || (report.detectedInstitution !== 'NÃO CONFIRMADO' ? report.detectedInstitution : 'USP-RP')
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    report.detectedYear || 2025
  );
  const [userConfirmedAll, setUserConfirmedAll] = useState<boolean>(
    report.overallStatus === 'CONFIRMADO'
  );
  const [activeTab, setActiveTab] = useState<'resumo' | 'instituicao' | 'ano' | 'questoes'>('resumo');

  if (!isOpen) return null;

  const isInstConfirmed = report.institutionConfidence === 'CONFIRMADO';
  const isYearConfirmed = report.yearConfidence === 'CONFIRMADO';
  const isSequenceComplete = report.sequenceIsComplete;

  // Render do badge de confiança
  const renderConfidenceBadge = (confidence: IdentificationConfidenceLevel) => {
    switch (confidence) {
      case 'CONFIRMADO':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
            <span>CONFIRMADO</span>
          </span>
        );
      case 'PROVAVEL':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-blue-700">help</span>
            <span>PROVÁVEL</span>
          </span>
        );
      case 'PRECISA_CONFIRMACAO':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber-700">warning</span>
            <span>PRECISA DE CONFIRMAÇÃO</span>
          </span>
        );
    }
  };

  const handleFinalConfirm = (addToOfficial: boolean) => {
    const isTarget = TARGET_INSTITUTIONS_LIST.includes(selectedInstitution as TargetInstitutionKey);
    const targetKey = isTarget ? (selectedInstitution as TargetInstitutionKey) : undefined;
    const title = `Prova Oficial ${selectedInstitution} ${selectedYear} (${report.totalIdentifiedQuestions || 100} Questões)`;

    onConfirmAndProcess({
      institution: selectedInstitution,
      targetKey,
      year: selectedYear,
      title,
      isConfirmedForOfficialStats: addToOfficial,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full border border-surface-container shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-base sm:text-lg text-on-surface font-bold">
                  Auditoria Pré-Análise do Arquivo
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-[0.6875rem] font-mono">
                  {report.sourceFileName}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Regra SynapseMed: <strong>Precisão dos Dados &gt; Velocidade</strong> (Sem suposições silenciosas).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors cursor-pointer"
            title="Fechar"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* NAVEGAÇÃO DE ABAS DA AUDITORIA */}
        <div className="px-6 border-b border-surface-container flex items-center gap-2 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('resumo')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'resumo'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">summarize</span>
            <span>Resumo de Confirmação</span>
          </button>

          <button
            onClick={() => setActiveTab('instituicao')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'instituicao'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">account_balance</span>
            <span>1. Instituição</span>
            {!isInstConfirmed && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ano')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ano'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>2. Ano da Prova</span>
            {!isYearConfirmed && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('questoes')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'questoes'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">format_list_numbered</span>
            <span>3. Questões &amp; Numeração</span>
            {!isSequenceComplete && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto">
          {/* ========================================================================= */}
          {/* ABA RESUMO PRINCIPAL (EXATAMENTE COMO REQUISITADO PELO USUÁRIO) */}
          {/* ========================================================================= */}
          {activeTab === 'resumo' && (
            <div className="space-y-4">
              {/* CARD OFICIAL DO RESUMO SYNAPSEMED */}
              <div className="p-5 rounded-xl border border-surface-container bg-surface-container-low/70 space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container/60">
                  <span className="text-xs text-secondary uppercase tracking-wider font-semibold font-sans">
                    Resumo do Documento Identificado
                  </span>
                  <span className="text-xs text-secondary font-sans">
                    {report.totalCharactersExtracted > 0
                      ? `${report.totalCharactersExtracted.toLocaleString()} caracteres extraídos (${report.estimatedPagesCount} pág)`
                      : 'Texto não extraível diretamente'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <span className="text-secondary font-sans text-xs">Instituição:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-on-surface text-sm">
                        {report.detectedInstitution}
                      </strong>
                      {renderConfidenceBadge(report.institutionConfidence)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <span className="text-secondary font-sans text-xs">Ano:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-on-surface text-sm">
                        {report.detectedYear !== null ? report.detectedYear : 'NÃO CONFIRMADO'}
                      </strong>
                      {renderConfidenceBadge(report.yearConfidence)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <span className="text-secondary font-sans text-xs">Questões identificadas:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-on-surface text-sm">
                        {report.totalIdentifiedQuestions > 0 ? report.totalIdentifiedQuestions : 'NENHUMA'}
                      </strong>
                      {report.sequenceIsComplete ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.625rem] font-bold">
                          Sequência 100% íntegra
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[0.625rem] font-bold">
                          {report.missingQuestionNumbers.length} ausente(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <span className="text-secondary font-sans text-xs">Status:</span>
                    <div>
                      {report.overallStatus === 'CONFIRMADO' ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold tracking-wide">
                          CONFIRMADO
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold tracking-wide">
                          PRECISA DE CONFIRMAÇÃO
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RECOMENDAÇÃO DO SISTEMA */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  report.overallStatus === 'CONFIRMADO'
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                    : 'bg-amber-50 text-amber-950 border-amber-200'
                }`}
              >
                <span className="material-symbols-outlined text-xl mt-0.5 shrink-0">
                  {report.overallStatus === 'CONFIRMADO' ? 'check_circle' : 'info'}
                </span>
                <div className="space-y-1 text-xs">
                  <strong className="text-sm font-bold block">
                    {report.overallStatus === 'CONFIRMADO'
                      ? 'Metadados Validados com Segurança'
                      : 'Atenção: Validação Manual Exigida pelo Protocolo'}
                  </strong>
                  <p className="leading-relaxed">{report.systemRecommendation}</p>
                </div>
              </div>

              {/* SEÇÃO DE CONFIRMAÇÃO MANUAL / AJUSTES ANTES DE ANALISAR */}
              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low space-y-3">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">edit_note</span>
                  <span>Confirmar ou Ajustar Metadados antes da Integração</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1">
                      Instituição Vinculada:
                    </label>
                    <select
                      value={selectedInstitution}
                      onChange={(e) => setSelectedInstitution(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-surface-container bg-surface-container-lowest text-on-surface focus:outline-primary"
                    >
                      {TARGET_INSTITUTIONS_LIST.map((key) => (
                        <option key={key} value={key}>
                          {key} — {TARGET_INSTITUTIONS_CONFIG[key].fullName}
                        </option>
                      ))}
                      <option value="UNIFESP">UNIFESP - Univ. Federal de São Paulo</option>
                      <option value="SCMSP">Santa Casa de São Paulo</option>
                      <option value="Outra Banca">Outra Instituição / Simulado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1">
                      Ano da Aplicação / Processo Seletivo:
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-surface-container bg-surface-container-lowest text-on-surface focus:outline-primary"
                    >
                      {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                        <option key={y} value={y}>
                          {y} {y === 2025 ? '(Mais recente / Peso 1.0x)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-container">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userConfirmedAll}
                      onChange={(e) => setUserConfirmedAll(e.target.checked)}
                      className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-xs text-secondary leading-relaxed">
                      Eu verifiquei o documento original e confirmo que esta prova pertence à instituição{' '}
                      <strong>{selectedInstitution}</strong> e ao ano <strong>{selectedYear}</strong>, autorizando sua inclusão nas estatísticas oficiais de incidência.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 1: AUDITORIA DA INSTITUIÇÃO */}
          {/* ========================================================================= */}
          {activeTab === 'instituicao' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div>
                  <span className="text-secondary block">Instituição Detectada:</span>
                  <strong className="text-sm text-on-surface">{report.detectedInstitution}</strong>
                </div>
                {renderConfidenceBadge(report.institutionConfidence)}
              </div>

              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest space-y-2">
                <span className="font-bold text-on-surface block text-xs">
                  Evidência Documental Encontrada no Arquivo:
                </span>
                <blockquote className="p-3 rounded-lg bg-surface-container-low border-l-4 border-primary text-secondary italic leading-relaxed">
                  "{report.institutionEvidenceSnippet}"
                </blockquote>

                {report.institutionConflictDetected && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-900 border border-rose-200 mt-2">
                    <strong>Alerta de Conflito:</strong> {report.institutionConflictDetail}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
                <span className="font-bold text-secondary text-xs uppercase tracking-wider">
                  Diretrizes de Identificação da Instituição:
                </span>
                <ul className="space-y-1.5 text-secondary list-disc pl-4 leading-relaxed">
                  <li>
                    O sistema <strong>não aceita</strong> deduzir a instituição unicamente pelo nome do arquivo (ex: "prova_2024.pdf" não comprova USP-RP).
                  </li>
                  <li>
                    Casos com menção apenas a "Universidade de São Paulo" sem discriminar FMRP (USP-RP) ou FMUSP (USP-SP) são marcados obrigatoriamente como "Precisa de Confirmação".
                  </li>
                  <li>
                    Apenas provas com evidência explícita em cabeçalho, capa, rodapé ou edital recebem status <strong>CONFIRMADO</strong>.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: AUDITORIA DO ANO DA PROVA */}
          {/* ========================================================================= */}
          {activeTab === 'ano' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div>
                  <span className="text-secondary block">Ano Detectado:</span>
                  <strong className="text-sm text-on-surface">
                    {report.detectedYear !== null ? report.detectedYear : 'NÃO CONFIRMADO'}
                  </strong>
                </div>
                {renderConfidenceBadge(report.yearConfidence)}
              </div>

              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest space-y-2">
                <span className="font-bold text-on-surface block text-xs">
                  Evidência Documental do Ano:
                </span>
                <blockquote className="p-3 rounded-lg bg-surface-container-low border-l-4 border-primary text-secondary italic leading-relaxed">
                  "{report.yearEvidenceSnippet}"
                </blockquote>

                {report.yearDiscrepancyNotes && (
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 mt-2 space-y-1">
                    <strong>Diferenciação de Datas:</strong>
                    <p>{report.yearDiscrepancyNotes.explanation}</p>
                    {report.yearDiscrepancyNotes.editalPublicationYear && (
                      <p>
                        Ano de Publicação do Edital:{' '}
                        <strong>{report.yearDiscrepancyNotes.editalPublicationYear}</strong> &rarr; Ano de Aplicação registrado:{' '}
                        <strong>{report.yearDiscrepancyNotes.examApplicationYear}</strong>.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low/60 border border-surface-container space-y-2">
                <span className="font-bold text-secondary text-xs uppercase tracking-wider">
                  Blindagens de Precisão de Ano:
                </span>
                <ul className="space-y-1.5 text-secondary list-disc pl-4 leading-relaxed">
                  <li>
                    <strong>Data de upload e modificação ignoradas:</strong> Enviar um arquivo em 2026 nunca faz o sistema inferir 2026.
                  </li>
                  <li>
                    <strong>Diferenciação de Edital vs. Aplicação:</strong> Editais publicados no final de um ano (ex: out/2023) para ingresso e prova no ano seguinte (2024) registram estritamente 2024.
                  </li>
                  <li>
                    Se o arquivo for "USP_2025.pdf" mas o texto não comprovar 2025, o status permanece <strong>PRECISA DE CONFIRMAÇÃO</strong>.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: AUDITORIA DE QUESTÕES E NUMERAÇÃO */}
          {/* ========================================================================= */}
          {activeTab === 'questoes' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="text-secondary block text-[0.6875rem]">Total Identificado</span>
                  <strong className="text-base text-on-surface">{report.totalIdentifiedQuestions}</strong>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="text-secondary block text-[0.6875rem]">Numeração Original</span>
                  <strong className="text-base text-on-surface">
                    {report.firstQuestionNumber > 0 ? `Q${report.firstQuestionNumber} a Q${report.lastQuestionNumber}` : 'N/D'}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="text-secondary block text-[0.6875rem]">Com Imagens/Tabelas</span>
                  <strong className="text-base text-purple-700">{report.imageDependentQuestions.length}</strong>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="text-secondary block text-[0.6875rem]">Divididas p/ Página</span>
                  <strong className="text-base text-blue-700">{report.splitQuestionsMerged.length}</strong>
                </div>
              </div>

              {/* QUESTÕES AUSENTES / QUEBRA DE SEQUÊNCIA */}
              {report.missingQuestionNumbers.length > 0 ? (
                <div className="p-4 rounded-xl bg-rose-50 text-rose-950 border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <span className="material-symbols-outlined text-base">warning</span>
                    <span>Quebra de Sequência Detectada: Questões Ausentes</span>
                  </div>
                  <p className="leading-relaxed">
                    As seguintes questões não foram identificadas na sequência original:{' '}
                    <strong>
                      {report.missingQuestionNumbers.map((n) => `Questão ${n}`).join(', ')}
                    </strong>
                    . O sistema <strong>não assume</strong> que as questões não existem e não deslocou a numeração subsequente.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-lg">check_circle</span>
                  <span>Sequência completa de questões validada sem lacunas de numeração.</span>
                </div>
              )}

              {/* QUESTÕES DIVIDIDAS ENTRE PÁGINAS UNIFICADAS */}
              {report.splitQuestionsMerged.length > 0 && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block text-xs">
                    Questões Divididas entre Páginas (Tratadas como Questão Única):
                  </span>
                  <p className="text-blue-950 text-xs leading-relaxed">
                    {report.splitQuestionsMerged
                      .map((s) => `Questão ${s.questionNumber} (Páginas ${s.startPage} e ${s.endPage})`)
                      .join('; ')}
                    . Não foram criadas questões duplicadas.
                  </p>
                </div>
              )}

              {/* QUESTÕES DEPENDENTES DE IMAGEM */}
              {report.imageDependentQuestions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block text-xs">
                    Elementos Visuais Detectados (ECG, TC, RX, Fotos, Tabelas):
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {report.imageDependentQuestions.slice(0, 10).map((img) => (
                      <span
                        key={img.questionNumber}
                        className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 text-[0.6875rem] font-bold"
                      >
                        Q{img.questionNumber}: {img.visualType}
                      </span>
                    ))}
                    {report.imageDependentQuestions.length > 10 && (
                      <span className="text-secondary text-xs self-center">
                        +{report.imageDependentQuestions.length - 10} outras
                      </span>
                    )}
                  </div>
                  <p className="text-purple-950 text-[0.6875rem] mt-1">
                    Regra SynapseMed: A classificação curricular dessas questões leva em conta o achado visual.
                  </p>
                </div>
              )}

              {/* QUESTÕES ILEGÍVEIS */}
              {report.unprocessedQuestionNumbers.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <strong className="block text-xs">Questões Não Processadas — Revisão Necessária:</strong>
                  <p className="text-xs">
                    Questões {report.unprocessedQuestionNumbers.join(', ')} possuem trecho ilegível ou danificado no PDF original. O conteúdo não foi inventado.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER DO MODAL COM AÇÕES */}
        <div className="bg-surface-container-low px-6 py-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-secondary">
            {userConfirmedAll ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check</span>
                Metadados confirmados para inserção na matriz oficial.
              </span>
            ) : (
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">warning</span>
                Aguardando confirmação manual para liberar estatísticas oficiais.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-surface-container bg-surface-container-lowest text-secondary hover:text-on-surface text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={() => handleFinalConfirm(false)}
              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Salva a prova para estudo, mas NÃO inclui seus dados na matriz oficial de incidência até confirmação"
            >
              <span className="material-symbols-outlined text-base">visibility_off</span>
              <span>Salvar em Revisão (Fora da Incidência)</span>
            </button>

            <button
              onClick={() => handleFinalConfirm(true)}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Confirmar e Integrar à Incidência</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
