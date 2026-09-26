import React, { useMemo, useState } from 'react';
import { AreaItem, ContentItem, OslerBlockRecord } from '../types';
import { fullCurriculumHierarchy } from '../data/mockData';
import {
  blockRetention,
  retentionLevel,
  reviewStatus,
  contentRetention,
  RetentionLevel,
} from '../utils/retentionEngine';

// ============================================================================
// RevisoesView — Revisão / Retenção (memória)
// ----------------------------------------------------------------------------
// A usuária informa, por bloco/tópico Osler, o desempenho agregado que o Osler
// já calcula (quantos Fácil/Normal/Difícil/Errei). O app estima a retenção do
// bloco, agenda a próxima revisão (regra simples) e mostra o que está devido.
// Não reproduz flashcards; usa o agregado do Osler.
// ============================================================================

interface RevisoesViewProps {
  curriculum?: AreaItem[];
  oslerBlocks?: OslerBlockRecord[];
  onSaveOslerBlock?: (input: {
    contentId: string; blockName: string;
    totalCards: number; easy: number; normal: number; hard: number; wrong: number;
  }) => void;
}

const LEVEL_UI: Record<RetentionLevel, { label: string; color: string }> = {
  alta: { label: 'Alta', color: '#16a34a' },
  media: { label: 'Média', color: '#d97706' },
  baixa: { label: 'Baixa', color: '#dc2626' },
};

const STATUS_UI: Record<string, { label: string; color: string }> = {
  vencida: { label: 'Revisão vencida', color: '#dc2626' },
  hoje: { label: 'Revisão hoje', color: '#d97706' },
  proxima: { label: 'Revisão próxima', color: '#2563eb' },
  futura: { label: 'Revisão futura', color: '#64748b' },
  sem_dados: { label: 'Sem dados', color: '#94a3b8' },
};

export const RevisoesView: React.FC<RevisoesViewProps> = ({
  curriculum,
  oslerBlocks = [],
  onSaveOslerBlock,
}) => {
  const hierarchy = curriculum ?? fullCurriculumHierarchy;

  const allContents: ContentItem[] = useMemo(
    () => hierarchy.flatMap((a) => a.modules.flatMap((m) => m.contents)),
    [hierarchy]
  );

  // form
  const [contentId, setContentId] = useState<string>(allContents[0]?.id ?? '');
  const [blockName, setBlockName] = useState('');
  const [total, setTotal] = useState('');
  const [easy, setEasy] = useState('');
  const [normal, setNormal] = useState('');
  const [hard, setHard] = useState('');
  const [wrong, setWrong] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const selectedContent = allContents.find((c) => c.id === contentId);

  // preview da retenção enquanto preenche
  const previewRet = useMemo(() => {
    const e = +easy || 0, n = +normal || 0, h = +hard || 0, w = +wrong || 0;
    if (e + n + h + w === 0) return null;
    return blockRetention({ easy: e, normal: n, hard: h, wrong: w });
  }, [easy, normal, hard, wrong]);

  const handleSave = () => {
    const e = +easy || 0, n = +normal || 0, h = +hard || 0, w = +wrong || 0;
    if (!contentId || !blockName.trim() || e + n + h + w === 0) return;
    onSaveOslerBlock?.({
      contentId,
      blockName: blockName.trim(),
      totalCards: +total || e + n + h + w,
      easy: e, normal: n, hard: h, wrong: w,
    });
    setBlockName(''); setTotal(''); setEasy(''); setNormal(''); setHard(''); setWrong('');
    setFormOpen(false);
  };

  // agrupa blocos por conteúdo, para exibição
  const byContent = useMemo(() => {
    const map = new Map<string, OslerBlockRecord[]>();
    for (const b of oslerBlocks) {
      if (!map.has(b.contentId)) map.set(b.contentId, []);
      map.get(b.contentId)!.push(b);
    }
    return map;
  }, [oslerBlocks]);

  const nameOf = (cid: string) => allContents.find((c) => c.id === cid)?.name ?? cid;

  const due = oslerBlocks.filter((b) => ['vencida', 'hoje'].includes(reviewStatus(b)));

  const inputStyle: React.CSSProperties = {
    padding: '8px 10px', borderRadius: 8, border: '0.5px solid #cbd5e1',
    fontSize: 14, width: '100%',
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 py-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs">
            <span className="material-symbols-outlined text-base">replay</span>
            <span>Revisão &amp; Retenção</span>
            <span className="text-outline-variant">•</span>
            <span className="text-primary font-medium">Memória (dados do Osler)</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mt-1">Revisões</h1>
          <p className="text-sm text-secondary mt-1">
            Informe o desempenho dos seus blocos no Osler. O app estima a retenção
            e agenda as revisões — blocos mais frágeis voltam antes.
          </p>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm whitespace-nowrap"
        >
          {formOpen ? 'Fechar' : '+ Informar bloco Osler'}
        </button>
      </div>

      {/* Resumo de devidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card v={oslerBlocks.length} l="blocos informados" c="#2563eb" />
        <Card v={due.length} l="revisões devidas" c="#d97706" />
        <Card v={oslerBlocks.filter((b) => retentionLevel(b.retention) === 'baixa').length} l="retenção baixa" c="#dc2626" />
        <Card v={byContent.size} l="conteúdos com dados" c="#16a34a" />
      </div>

      {/* Formulário */}
      {formOpen && (
        <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-secondary">Conteúdo</label>
              <select style={inputStyle} value={contentId} onChange={(e) => setContentId(e.target.value)}>
                {allContents.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-secondary">Bloco / Tópico Osler</label>
              <input style={inputStyle} value={blockName} onChange={(e) => setBlockName(e.target.value)}
                placeholder="ex: ICC — Tratamento" list="osler-topics" />
              <datalist id="osler-topics">
                {(selectedContent?.oslerTopicsList ?? []).map((t) => <option key={t} value={t} />)}
              </datalist>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <NumIn label="Total cartões" v={total} set={setTotal} />
            <NumIn label="Fácil" v={easy} set={setEasy} />
            <NumIn label="Normal" v={normal} set={setNormal} />
            <NumIn label="Difícil" v={hard} set={setHard} />
            <NumIn label="Errei" v={wrong} set={setWrong} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary">
              {previewRet !== null ? (
                <>Retenção estimada: <strong style={{ color: LEVEL_UI[retentionLevel(previewRet)].color }}>
                  {previewRet}% ({LEVEL_UI[retentionLevel(previewRet)].label})
                </strong></>
              ) : 'Preencha a distribuição dos cartões'}
            </span>
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm">
              Salvar bloco
            </button>
          </div>
        </div>
      )}

      {/* Lista por conteúdo */}
      {oslerBlocks.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-surface-container text-secondary text-sm">
          Nenhum bloco informado ainda. Use “+ Informar bloco Osler” para registrar
          o desempenho dos seus tópicos e o app começar a agendar revisões.
        </div>
      ) : (
        <div className="space-y-4">
          {[...byContent.entries()].map(([cid, blocks]) => {
            const ret = contentRetention(blocks);
            return (
              <div key={cid} className="rounded-xl border border-surface-container bg-surface-container-lowest p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-on-surface">{nameOf(cid)}</span>
                  {ret !== null && (
                    <span className="text-xs" style={{ color: LEVEL_UI[retentionLevel(ret)].color }}>
                      Retenção do conteúdo: <strong>{ret}% ({LEVEL_UI[retentionLevel(ret)].label})</strong>
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {blocks.map((b) => {
                    const st = reviewStatus(b);
                    return (
                      <div key={b.id} className="flex items-center justify-between text-sm py-1 border-t border-surface-container/50">
                        <span className="text-on-surface">{b.blockName}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span style={{ color: LEVEL_UI[retentionLevel(b.retention)].color }}>
                            {b.retention}%
                          </span>
                          <span className="text-secondary">próx: {b.nextReviewDate}</span>
                          <span style={{ color: STATUS_UI[st].color }}>{STATUS_UI[st].label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Card: React.FC<{ v: number; l: string; c: string }> = ({ v, l, c }) => (
  <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
    <div className="text-2xl font-bold" style={{ color: c }}>{v}</div>
    <div className="text-xs text-secondary">{l}</div>
  </div>
);

const NumIn: React.FC<{ label: string; v: string; set: (s: string) => void }> = ({ label, v, set }) => (
  <div>
    <label className="text-xs text-secondary">{label}</label>
    <input
      type="number" min="0" value={v} onChange={(e) => set(e.target.value)}
      style={{ padding: '8px 10px', borderRadius: 8, border: '0.5px solid #cbd5e1', fontSize: 14, width: '100%' }}
    />
  </div>
);
