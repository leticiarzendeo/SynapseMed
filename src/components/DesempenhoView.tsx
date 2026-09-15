import React, { useState } from 'react';
import { fullCurriculumHierarchy } from '../data/mockData';
import { AreaItem, CadernoErroItem, ContentItem } from '../types';
import { calculateContentDomain } from '../utils/domainCalculator';
import { computeDesempenhoMetrics, formatKpi } from '../utils/performanceMetrics';
import { DominioDossieModal } from './DominioDossieModal';

interface DesempenhoViewProps {
  cadernoErros?: CadernoErroItem[];
  /** Currículo com progresso real (isStudied). Cai no estático se ausente. */
  curriculum?: AreaItem[];
}

export const DesempenhoView: React.FC<DesempenhoViewProps> = ({
  cadernoErros = [],
  curriculum,
}) => {
  const [selectedModalContent, setSelectedModalContent] = useState<ContentItem | null>(null);

  const curriculumHierarchy: AreaItem[] = curriculum ?? fullCurriculumHierarchy;

  // Métricas honestas: número real quando há evidência, "—" quando não há.
  const metrics = computeDesempenhoMetrics(curriculumHierarchy, cadernoErros.length);

  // Lista plana de conteúdos para amostragem do cérebro
  const keyContents: ContentItem[] = curriculumHierarchy.flatMap((area) =>
    area.modules.flatMap((mod) => mod.contents)
  ).slice(0, 6); // Amostra de temas de alta incidência

  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">insights</span>
            <span>Cockpit de Métricas</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Cérebro de Domínio Psicométrico</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Desempenho &amp; Curva de Rendimento
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            Diagnóstico baseado nas 4 dimensões pedagógicas: Conhecimento, Aplicação, Retenção e Confiança.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-code-metric text-xs font-bold border border-emerald-200">
            Acurácia Geral: {formatKpi(metrics.overallAccuracy.value)}
          </span>
        </div>
      </div>

      {/* Main KPI Cards: 4 Dimensões Essenciais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-base">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-xs uppercase font-semibold">📚 Conhecimento</span>
            <span className="text-[0.625rem] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">Medway</span>
          </div>
          <div className="font-code-metric text-2xl font-bold text-on-surface">{formatKpi(metrics.knowledge.value)}</div>
          <div className="text-xs text-blue-700">
            {metrics.knowledge.value === null
              ? 'Sem dados ainda — faça exercícios Medway'
              : `Pós-exercícios e revisões (${metrics.knowledge.evidenceCount} questões)`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-1 ring-1 ring-amber-400/40">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-xs uppercase font-semibold">🎯 Aplicação em Prova</span>
            <span className="text-[0.625rem] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">Gargalo</span>
          </div>
          <div className="font-code-metric text-2xl font-bold text-amber-700">{formatKpi(metrics.application.value)}</div>
          <div className="text-xs text-amber-800">
            {metrics.application.value === null
              ? 'Sem dados ainda — registre provas e simulados'
              : `Provas reais e simulados (${metrics.application.evidenceCount} questões)`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-xs uppercase font-semibold">🧠 Retenção FSRS</span>
            <span className="text-[0.625rem] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">Osler</span>
          </div>
          <div className="font-code-metric text-2xl font-bold text-purple-800">{formatKpi(metrics.retention.value)}</div>
          <div className="text-xs text-emerald-700">
            {metrics.retention.value === null
              ? 'Sem dados ainda — revise cartões Osler'
              : `Cartões Osler revisados: ${metrics.retention.evidenceCount}`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-xs uppercase font-semibold">📊 Confiança Amostral</span>
            <span className="text-[0.625rem] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">{metrics.confidence.label}</span>
          </div>
          <div className="font-code-metric text-2xl font-bold text-emerald-700">{formatKpi(metrics.confidence.value)}</div>
          <div className="text-xs text-secondary">
            {metrics.confidence.totalQuestions + metrics.confidence.totalCards === 0
              ? 'Sem evidências registradas ainda'
              : `${metrics.confidence.totalQuestions} questões + ${metrics.confidence.totalCards} cartões`}
          </div>
        </div>
      </div>

      {/* CÉREBRO DE DOMÍNIO: Painel Diagnóstico de Temas de Alta Incidência */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">psychology</span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Auditoria do Cérebro de Domínio
              </span>
            </div>
            <h2 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
              Diagnóstico Cirúrgico: Conhecimento vs. Aplicação vs. Retenção
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              O sistema não esconde a realidade em uma média aritmética rasa. Ele detecta se você sabe a matéria mas erra na banca.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {keyContents.map((content) => {
            const domain = calculateContentDomain(content);
            const isGargalo = domain.status === 'aplicacao_insuficiente';

            return (
              <div
                key={content.id}
                onClick={() => setSelectedModalContent(content)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  isGargalo
                    ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/40'
                    : 'bg-surface-container-low/50 border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-on-surface hover:text-primary transition-colors">
                      {content.name}
                    </h3>
                    <span className="text-[0.625rem] text-secondary">
                      {content.areaName} &bull; {content.moduloName}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-code-metric font-extrabold text-sm text-primary">
                      {domain.overallDomain}%
                    </span>
                    <span className="text-[0.5625rem] text-secondary block">Domínio</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[0.6875rem]">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold ${
                      domain.status === 'consolidado'
                        ? 'bg-emerald-100 text-emerald-900'
                        : isGargalo
                        ? 'bg-amber-100 text-amber-950 font-extrabold'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {domain.statusLabel}
                  </span>

                  <span className="text-[0.625rem] text-secondary">
                    Confiança: <strong className="capitalize text-on-surface">{domain.confidenceLevel}</strong>
                  </span>
                </div>

                {/* 3 Pilares em Miniatura */}
                <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-surface-container text-center text-[0.625rem]">
                  <div className="p-1 rounded bg-surface-container">
                    <span className="text-secondary block">Conhec.</span>
                    <strong className="text-blue-800 font-code-metric">{domain.knowledgeScore}%</strong>
                  </div>
                  <div className={`p-1 rounded ${isGargalo ? 'bg-amber-100/70 text-amber-950' : 'bg-surface-container'}`}>
                    <span className="text-secondary block">Aplic.</span>
                    <strong className={`font-code-metric ${isGargalo ? 'text-amber-900' : 'text-emerald-800'}`}>
                      {domain.applicationScore}%
                    </strong>
                  </div>
                  <div className="p-1 rounded bg-surface-container">
                    <span className="text-secondary block">Retenção</span>
                    <strong className="text-purple-800 font-code-metric">{domain.retentionScore}%</strong>
                  </div>
                </div>

                <p className="mt-2 text-[0.625rem] text-secondary italic line-clamp-1">
                  {domain.diagnostic.headline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialty Breakdown */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm space-y-4">
        <h2 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider">
          Rendimento por Grande Área da Residência
        </h2>
        <div className="space-y-3">
          {metrics.areas.map((area) => (
            <div key={area.id} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-on-surface">{area.name}</span>
                <span className="font-code-metric font-bold text-primary">
                  {area.mastery === null
                    ? 'sem dados'
                    : `${formatKpi(area.mastery)} de domínio`}
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${area.mastery ?? 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caderno de Erros Summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-600 text-lg">error_outline</span>
            Caderno de Erros Recorrentes
          </h2>
          <span className="text-xs text-secondary">{metrics.mappedErrorTopics} temas mapeados</span>
        </div>
        <p className="text-xs text-secondary">
          Questões que você errou mais de uma vez ou marcou para revisão de raciocínio clínico:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {cadernoErros.map((err) => (
            <div
              key={err.id}
              className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-on-surface"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-primary">{err.topic}</span>
                <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  Novo
                </span>
              </div>
              <p className="text-secondary">{err.reason}</p>
            </div>
          ))}
          {cadernoErros.length === 0 && (
            <div className="col-span-full p-4 rounded-xl bg-surface-container-low/60 border border-surface-container text-secondary text-center">
              Nenhum erro registrado ainda. Ao concluir atividades e registrar
              questões erradas, seus temas recorrentes aparecerão aqui.
            </div>
          )}
        </div>
      </div>

      {/* Dossiê Analítico do Cérebro de Domínio */}
      {selectedModalContent && (
        <DominioDossieModal
          content={selectedModalContent}
          onClose={() => setSelectedModalContent(null)}
        />
      )}
    </div>
  );
};
