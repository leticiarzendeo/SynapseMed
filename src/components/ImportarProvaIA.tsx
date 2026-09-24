import React, { useState } from 'react';
import { AreaItem, EvidenceRecord, CadernoErroItem } from '../types';
import { fullCurriculumHierarchy } from '../data/mockData';
import {
  parseAndResolveExamJson,
  ImportResult,
} from '../utils/examImportEngine';

// ============================================================================
// ImportarProvaIA
// ----------------------------------------------------------------------------
// Importa o JSON que a IA externa devolveu (questões + classificação + acerto).
// Fluxo: colar/subir JSON -> validar e casar com currículo -> revisar -> salvar.
// Salvar: cada questão casada vira evidência; as erradas vão ao caderno de erros.
// Questões não reconhecidas (id/nome fora do currículo) ficam de fora e são
// sinalizadas para a usuária resolver no registro manual, se quiser.
// ============================================================================

interface ImportarProvaIAProps {
  curriculum?: AreaItem[];
  onFinish: () => void;
  onAddEvidence?: (r: EvidenceRecord) => void;
  onAddCadernoErro?: (i: CadernoErroItem) => void;
  /** Cria o registro da prova na lista (para consulta posterior). */
  onCreateExam?: (result: ImportResult) => void;
}

export const ImportarProvaIA: React.FC<ImportarProvaIAProps> = ({
  curriculum,
  onFinish,
  onAddEvidence,
  onAddCadernoErro,
  onCreateExam,
}) => {
  const hierarchy = curriculum ?? fullCurriculumHierarchy;
  const [jsonText, setJsonText] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [saved, setSaved] = useState<{ evid: number; erros: number } | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setJsonText(text);
    setResult(parseAndResolveExamJson(text, hierarchy));
  };

  const handleParse = () => {
    setResult(parseAndResolveExamJson(jsonText, hierarchy));
  };

  const today = () => new Date().toISOString().split('T')[0];

  const handleSave = () => {
    if (!result || !result.ok) return;
    // NÃO empurra evidência/caderno aqui. Apenas cria a prova na lista (via
    // onCreateExam). A Leticia corrige acertos/erros e motivos na tela da prova
    // e então usa "Salvar no Desempenho" — escrita única, sem contagem dupla.
    const matched = result.questions.filter((q) => q.resolvedContentId).length;
    onCreateExam?.(result);
    setSaved({ evid: matched, erros: 0 });
  };

  const box: React.CSSProperties = {
    width: '100%',
    minHeight: 140,
    padding: 10,
    borderRadius: 8,
    border: '0.5px solid var(--color-outline,#cbd5e1)',
    fontFamily: 'monospace',
    fontSize: 12,
  };
  const btn = (primary = false): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: 8,
    border: primary ? 'none' : '0.5px solid #cbd5e1',
    background: primary ? 'var(--primary,#2563eb)' : 'transparent',
    color: primary ? '#fff' : 'inherit',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  });

  if (saved) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 40 }}>✅</div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Prova adicionada à lista!</h3>
        <p style={{ fontSize: 14, color: 'var(--secondary,#64748b)', marginTop: 8 }}>
          {saved.evid} questões reconhecidas. Abra a prova na lista, marque os
          erros e os motivos, e clique em <strong>“Salvar no Desempenho”</strong>{' '}
          para alimentar o cronograma e o caderno de erros. Por padrão, tudo
          entra como acerto até você marcar o contrário.
        </p>
        <button onClick={onFinish} style={{ ...btn(true), marginTop: 20 }}>Concluir</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Importar resultado da IA</h3>
      <p style={{ fontSize: 13, color: 'var(--secondary,#64748b)', marginBottom: 12 }}>
        Cole aqui o JSON que a IA gerou (ou suba o arquivo). O app vai casar cada
        questão com o seu currículo e mostrar o que reconheceu antes de salvar.
      </p>

      {!result && (
        <>
          <textarea
            style={box}
            placeholder='Cole o JSON aqui, começando com {  "schemaVersion": "1.0", ...'
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
            <button onClick={handleParse} style={btn(true)} disabled={!jsonText.trim()}>
              Validar JSON
            </button>
            <label style={{ ...btn(false), display: 'inline-block' }}>
              Subir arquivo .json
              <input type="file" accept=".json,application/json" onChange={handleFile} style={{ display: 'none' }} />
            </label>
            <button onClick={onFinish} style={btn(false)}>Cancelar</button>
          </div>
        </>
      )}

      {result && !result.ok && (
        <div style={{ padding: 12, borderRadius: 8, background: '#fef2f2', border: '0.5px solid #fecaca', color: '#b91c1c', fontSize: 14 }}>
          {result.error}
          <div style={{ marginTop: 10 }}>
            <button onClick={() => setResult(null)} style={btn(false)}>Tentar de novo</button>
          </div>
        </div>
      )}

      {result && result.ok && (
        <div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <Badge label="Prova" value={result.source || '—'} />
            <Badge label="Questões" value={String(result.totalQuestions)} />
            <Badge label="Reconhecidas" value={`${result.matched}`} good />
            <Badge label="Não reconhecidas" value={`${result.unmatched}`} warn={result.unmatched > 0} />
            <Badge label="Acertos" value={`${result.correctCount}`} />
            <Badge label="Erros" value={`${result.wrongCount}`} />
          </div>

          {result.unmatched > 0 && (
            <div style={{ padding: 10, borderRadius: 8, background: '#fffbeb', border: '0.5px solid #fde68a', fontSize: 12, color: '#92400e', marginBottom: 12 }}>
              ⚠️ {result.unmatched} questão(ões) não casaram com nenhum conteúdo do
              currículo (a IA pode ter usado um id/nome fora da lista). Elas NÃO serão
              salvas — se quiser, registre-as depois no registro manual.
            </div>
          )}

          <div style={{ maxHeight: 340, overflowY: 'auto', border: '0.5px solid #e2e8f0', borderRadius: 8 }}>
            {result.questions.map((q) => (
              <div
                key={q.number}
                style={{
                  padding: '8px 12px',
                  borderBottom: '0.5px solid #f1f5f9',
                  fontSize: 13,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  background: q.resolvedContentId ? 'transparent' : '#fff7ed',
                }}
              >
                <span>
                  <strong>Q{q.number}</strong>{' '}
                  {q.resolvedContentId ? (
                    <span style={{ color: '#475569' }}>
                      → {q.resolvedArea} › {q.resolvedContentName}
                      <span style={{ color: '#94a3b8' }}> ({q.matchType})</span>
                    </span>
                  ) : (
                    <span style={{ color: '#b45309' }}>
                      não reconhecida ({q.contentName || 'sem conteúdo'})
                    </span>
                  )}
                </span>
                <span style={{ color: q.correct ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                  {q.correct ? '✓ acertou' : '✕ errou'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={handleSave} style={btn(true)} disabled={result.matched === 0}>
              Salvar {result.matched} questão(ões) reconhecida(s)
            </button>
            <button onClick={() => setResult(null)} style={btn(false)}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Badge: React.FC<{ label: string; value: string; good?: boolean; warn?: boolean }> = ({
  label,
  value,
  good,
  warn,
}) => (
  <div
    style={{
      padding: '8px 12px',
      borderRadius: 10,
      border: '0.5px solid #e2e8f0',
      minWidth: 90,
    }}
  >
    <div
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: warn ? '#b45309' : good ? '#15803d' : '#0f172a',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
  </div>
);
