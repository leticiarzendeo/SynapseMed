import React, { useMemo, useState } from 'react';
import { EvidenceRecord, OslerBlockRecord, AreaItem } from '../types';
import { fullCurriculumHierarchy } from '../data/mockData';

// ============================================================================
// HistoricoView — acompanhamento do que foi feito ao longo do ano.
// ----------------------------------------------------------------------------
// Fonte 100% real: evidenceLog (teoria/questões, com acertos) e os blocos Osler
// informados (revisões). Mostra um resumo no topo e uma linha do tempo agrupada
// por data. Nada inventado — reflete o que a usuária registrou.
// ============================================================================

interface HistoricoViewProps {
  evidenceLog?: EvidenceRecord[];
  oslerBlocks?: OslerBlockRecord[];
  curriculum?: AreaItem[];
  /** Desfaz o registro: devolve o conteúdo ao cronograma (como não feito). */
  onUndoContent?: (contentId: string) => void;
}

type TipoFiltro = 'todos' | 'teoria' | 'questoes' | 'revisao';

interface HistItem {
  id: string;
  date: string;             // YYYY-MM-DD
  tipo: 'teoria' | 'questoes' | 'revisao';
  contentId: string;
  contentName: string;
  detail: string;           // ex.: "pré 7/10 · pós 9/10" ou "retenção 85%"
  minutes: number;
  questionsTotal?: number;
  questionsCorrect?: number;
}

const TIPO_UI: Record<HistItem['tipo'], { label: string; icon: string; color: string }> = {
  teoria: { label: 'Teoria', icon: 'menu_book', color: '#2563eb' },
  questoes: { label: 'Questões', icon: 'quiz', color: '#9333ea' },
  revisao: { label: 'Revisão', icon: 'replay', color: '#16a34a' },
};

export const HistoricoView: React.FC<HistoricoViewProps> = ({
  evidenceLog = [],
  oslerBlocks = [],
  curriculum,
  onUndoContent,
}) => {
  const hierarchy = curriculum ?? fullCurriculumHierarchy;
  const [filtro, setFiltro] = useState<TipoFiltro>('todos');

  const nameOf = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of hierarchy)
      for (const m of a.modules)
        for (const c of m.contents) map.set(c.id, c.name);
    return (id: string) => map.get(id) || id;
  }, [hierarchy]);

  // Monta os itens do histórico a partir das fontes reais.
  const items: HistItem[] = useMemo(() => {
    const out: HistItem[] = [];

    // Agrupa evidências por conteúdo+data para juntar pré e pós na mesma linha.
    const evByKey = new Map<string, EvidenceRecord[]>();
    for (const ev of evidenceLog) {
      const isTheory = ev.source?.toLowerCase().includes('teoria');
      const key = `${ev.contentId}|${ev.date}|${isTheory ? 'teoria' : 'questoes'}`;
      if (!evByKey.has(key)) evByKey.set(key, []);
      evByKey.get(key)!.push(ev);
    }
    for (const [key, evs] of evByKey) {
      const [contentId, date] = key.split('|');
      const isTheory = key.endsWith('teoria');
      const pre = evs.find((e) => e.source?.toLowerCase().includes('pré'));
      const post = evs.find((e) => e.source?.toLowerCase().includes('pós'));
      const totalQ = evs.reduce((s, e) => s + (e.questionsTotal ?? 0), 0);
      const correctQ = evs.reduce((s, e) => s + (e.questionsCorrect ?? 0), 0);
      const minutes = evs.reduce((s, e) => s + (e.durationMinutes ?? 0), 0);
      let detail = '';
      if (isTheory) {
        const parts: string[] = [];
        if (pre) parts.push(`pré ${pre.questionsCorrect ?? 0}/${pre.questionsTotal ?? 0}`);
        if (post) parts.push(`pós ${post.questionsCorrect ?? 0}/${post.questionsTotal ?? 0}`);
        detail = parts.join(' · ') || 'teoria concluída';
      } else {
        detail = `${correctQ}/${totalQ} acertos`;
      }
      out.push({
        id: key,
        date,
        tipo: isTheory ? 'teoria' : 'questoes',
        contentId,
        contentName: nameOf(contentId),
        detail,
        minutes,
        questionsTotal: totalQ,
        questionsCorrect: correctQ,
      });
    }

    // Revisões: cada entrada do histórico dos blocos Osler.
    for (const b of oslerBlocks) {
      for (const h of b.history || []) {
        out.push({
          id: `osler-${b.id}-${h.date}`,
          date: h.date,
          tipo: 'revisao',
          contentId: b.contentId,
          contentName: nameOf(b.contentId),
          detail: `${b.blockName} · retenção ${h.retention}%`,
          minutes: 0,
        });
      }
    }

    // ordena por data desc
    out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return out;
  }, [evidenceLog, oslerBlocks, nameOf]);

  const filtered = filtro === 'todos' ? items : items.filter((i) => i.tipo === filtro);

  // Resumo
  const resumo = useMemo(() => {
    const totalMin = items.reduce((s, i) => s + i.minutes, 0);
    const totalQ = items.reduce((s, i) => s + (i.questionsTotal ?? 0), 0);
    const totalC = items.reduce((s, i) => s + (i.questionsCorrect ?? 0), 0);
    return {
      atividades: items.length,
      horas: Math.round((totalMin / 60) * 10) / 10,
      questoes: totalQ,
      acerto: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : null,
    };
  }, [items]);

  // agrupa por data pra exibir
  const porData = useMemo(() => {
    const map = new Map<string, HistItem[]>();
    for (const i of filtered) {
      if (!map.has(i.date)) map.set(i.date, []);
      map.get(i.date)!.push(i);
    }
    return [...map.entries()];
  }, [filtered]);

  const fmtData = (d: string) => {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
    } catch { return d; }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-secondary text-xs">
          <span className="material-symbols-outlined text-base">history</span>
          <span>Histórico de estudos</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mt-1">Seu percurso</h1>
        <p className="text-sm text-secondary mt-1">
          Tudo que você registrou — teoria, questões e revisões — ao longo da sua
          preparação, do mais recente ao mais antigo.
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card v={String(resumo.atividades)} l="atividades" c="#2563eb" />
        <Card v={`${resumo.horas}h`} l="horas estudadas" c="var(--color-on-surface)" />
        <Card v={String(resumo.questoes)} l="questões feitas" c="#9333ea" />
        <Card v={resumo.acerto !== null ? `${resumo.acerto}%` : '—'} l="acerto geral" c="#16a34a" />
      </div>

      {/* Filtro */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          { k: 'todos', label: 'Todos' },
          { k: 'teoria', label: 'Teoria' },
          { k: 'questoes', label: 'Questões' },
          { k: 'revisao', label: 'Revisões' },
        ] as { k: TipoFiltro; label: string }[]).map((f) => (
          <button
            key={f.k}
            onClick={() => setFiltro(f.k)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              filtro === f.k
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-secondary hover:text-on-surface border border-surface-container'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Linha do tempo */}
      {filtered.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-surface-container text-secondary text-sm">
          Nada registrado ainda. Conforme você estuda (teoria na aba Hoje, provas,
          revisões), suas atividades aparecem aqui como uma linha do tempo.
        </div>
      ) : (
        <div className="space-y-5">
          {porData.map(([date, dayItems]) => (
            <div key={date}>
              <div className="text-xs font-bold text-secondary uppercase tracking-wide mb-2 capitalize">
                {fmtData(date)}
              </div>
              <div className="space-y-2">
                {dayItems.map((it) => {
                  const ui = TIPO_UI[it.tipo];
                  return (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-surface-container bg-surface-container-lowest"
                    >
                      <span
                        className="material-symbols-outlined text-base shrink-0"
                        style={{ color: ui.color }}
                      >
                        {ui.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-on-surface truncate">
                          {it.contentName}
                        </div>
                        <div className="text-xs text-secondary">
                          {ui.label} · {it.detail}
                          {it.minutes > 0 ? ` · ${it.minutes} min` : ''}
                        </div>
                      </div>
                      {onUndoContent && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Devolver "${it.contentName}" para o cronograma? O registro será desfeito e a atividade volta para ser feita do zero.`
                              )
                            ) {
                              onUndoContent(it.contentId);
                            }
                          }}
                          title="Voltar para o Hoje (desfazer registro)"
                          className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-secondary hover:text-on-surface border border-surface-container hover:bg-surface-container flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">undo</span>
                          <span className="hidden sm:inline">Voltar p/ Hoje</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Card: React.FC<{ v: string; l: string; c: string }> = ({ v, l, c }) => (
  <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
    <div className="text-2xl font-bold" style={{ color: c }}>{v}</div>
    <div className="text-xs text-secondary">{l}</div>
  </div>
);
