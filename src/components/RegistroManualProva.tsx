import React, { useMemo, useState } from 'react';
import { fullCurriculumHierarchy } from '../data/mockData';
import {
  AreaItem,
  ContentItem,
  EvidenceRecord,
  CadernoErroItem,
  ErrorReasonType,
} from '../types';

// ============================================================================
// RegistroManualProva
// ----------------------------------------------------------------------------
// Registro MANUAL de questões de prova/simulado (sem IA).
//
// Fluxo desenhado com a usuária:
//   - Contexto fixo no topo: prova/origem + cascata área › módulo › conteúdo
//     › tópico FC Osler (Osler opcional). Definido uma vez; permanece para as
//     próximas questões até a usuária clicar em "Trocar conteúdo".
//   - Registro questão a questão:
//       Acertei → 1 clique, salva evidência de acerto (sem texto).
//       Errei   → abre enunciado + nota; vira entrada no Caderno de Erros.
//   - Tudo alimenta o evidenceLog (KPIs/domínio) e o cadernoErros já
//     existentes, via callbacks do App. Nada de IA, nada de chave de API.
//   - Ao encerrar, mostra resumo de certas × erradas por conteúdo.
// ============================================================================

interface SessionTally {
  contentId: string;
  contentName: string;
  correct: number;
  wrong: number;
}

interface RegistroManualProvaProps {
  onAddEvidence: (record: EvidenceRecord) => void;
  onAddCadernoErro: (item: CadernoErroItem) => void;
  onClose?: () => void;
}

const ERROR_REASONS: { id: ErrorReasonType; label: string }[] = [
  { id: 'nao_sabia', label: 'Não sabia o conteúdo' },
  { id: 'esqueci', label: 'Sabia, mas esqueci' },
  { id: 'interpretacao', label: 'Erro de interpretação' },
  { id: 'desatencao', label: 'Desatenção' },
  { id: 'entre_duas', label: 'Fiquei entre duas' },
  { id: 'raciocinio', label: 'Erro de raciocínio' },
  { id: 'outro', label: 'Outro' },
];

export const RegistroManualProva: React.FC<RegistroManualProvaProps> = ({
  onAddEvidence,
  onAddCadernoErro,
  onClose,
}) => {
  const hierarchy = fullCurriculumHierarchy;

  // ----- Contexto da sessão -----
  const [examTitle, setExamTitle] = useState('');
  const [examSource, setExamSource] = useState('');

  // ----- Cascata -----
  const [areaId, setAreaId] = useState<string>(hierarchy[0]?.id ?? '');
  const selectedArea: AreaItem | undefined = useMemo(
    () => hierarchy.find((a) => a.id === areaId),
    [hierarchy, areaId]
  );
  const [moduleId, setModuleId] = useState<string>(
    hierarchy[0]?.modules[0]?.id ?? ''
  );
  const selectedModule = useMemo(
    () => selectedArea?.modules.find((m) => m.id === moduleId),
    [selectedArea, moduleId]
  );
  const [contentId, setContentId] = useState<string>(
    hierarchy[0]?.modules[0]?.contents[0]?.id ?? ''
  );
  const selectedContent: ContentItem | undefined = useMemo(
    () => selectedModule?.contents.find((c) => c.id === contentId),
    [selectedModule, contentId]
  );
  const oslerTopics = selectedContent?.oslerTopicsList ?? [];
  const [oslerTopic, setOslerTopic] = useState<string>('');

  // Ao trocar de nível superior, reancorar os inferiores para valores válidos.
  const handleAreaChange = (id: string) => {
    setAreaId(id);
    const area = hierarchy.find((a) => a.id === id);
    const firstMod = area?.modules[0];
    setModuleId(firstMod?.id ?? '');
    setContentId(firstMod?.contents[0]?.id ?? '');
    setOslerTopic('');
  };
  const handleModuleChange = (id: string) => {
    setModuleId(id);
    const mod = selectedArea?.modules.find((m) => m.id === id);
    setContentId(mod?.contents[0]?.id ?? '');
    setOslerTopic('');
  };
  const handleContentChange = (id: string) => {
    setContentId(id);
    setOslerTopic('');
  };

  // ----- Estado da questão atual -----
  const [outcome, setOutcome] = useState<'acertei' | 'errei' | null>(null);
  const [statement, setStatement] = useState('');
  const [note, setNote] = useState('');
  const [reason, setReason] = useState<ErrorReasonType>('nao_sabia');
  const [formError, setFormError] = useState('');

  // ----- Contadores e resumo -----
  const [tally, setTally] = useState<SessionTally[]>([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const bumpTally = (correct: boolean) => {
    if (!selectedContent) return;
    setTally((prev) => {
      const existing = prev.find((t) => t.contentId === selectedContent.id);
      if (existing) {
        return prev.map((t) =>
          t.contentId === selectedContent.id
            ? {
                ...t,
                correct: t.correct + (correct ? 1 : 0),
                wrong: t.wrong + (correct ? 0 : 1),
              }
            : t
        );
      }
      return [
        ...prev,
        {
          contentId: selectedContent.id,
          contentName: selectedContent.name,
          correct: correct ? 1 : 0,
          wrong: correct ? 0 : 1,
        },
      ];
    });
  };

  const resetQuestionForm = () => {
    setOutcome(null);
    setStatement('');
    setNote('');
    setReason('nao_sabia');
    setFormError('');
  };

  const today = () => new Date().toISOString().split('T')[0];
  const sourceLabel = () =>
    [examTitle.trim(), examSource.trim()].filter(Boolean).join(' · ') ||
    'Registro manual';

  const handleSave = () => {
    if (!selectedContent) {
      setFormError('Selecione um conteúdo válido.');
      return;
    }
    if (outcome === null) {
      setFormError('Marque se acertou ou errou a questão.');
      return;
    }
    if (outcome === 'errei' && statement.trim().length === 0) {
      setFormError('Cole o enunciado da questão errada para revisar depois.');
      return;
    }

    const correct = outcome === 'acertei';

    // 1) Evidência (alimenta KPIs e domínio)
    const evidence: EvidenceRecord = {
      id: `ev-${Date.now()}`,
      contentId: selectedContent.id,
      date: today(),
      kind: 'questoes',
      questionsTotal: 1,
      questionsCorrect: correct ? 1 : 0,
      durationMinutes: 0,
      source: sourceLabel(),
    };
    onAddEvidence(evidence);

    // 2) Se errou, cria entrada no Caderno de Erros
    if (!correct) {
      const topicLabel = oslerTopic
        ? `${selectedContent.name} — ${oslerTopic}`
        : selectedContent.name;
      const reasonText =
        note.trim().length > 0
          ? `${statement.trim()}\n\nNota: ${note.trim()}`
          : statement.trim();
      const erro: CadernoErroItem = {
        id: `err-${Date.now()}`,
        topic: topicLabel,
        specialty: selectedArea?.name ?? '',
        reason: reasonText,
        reasonCategory: reason,
        institutionOrContext: sourceLabel(),
        createdAt: today(),
        examType: 'SIMULADO',
      };
      onAddCadernoErro(erro);
    }

    bumpTally(correct);
    setRegisteredCount((n) => n + 1);
    resetQuestionForm();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 8,
    border: '0.5px solid var(--color-outline, #cbd5e1)',
    background: 'var(--surface-container-lowest, #fff)',
    fontSize: 14,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: 'var(--secondary, #64748b)',
    display: 'block',
    marginBottom: 4,
  };

  if (showSummary) {
    const totalCorrect = tally.reduce((s, t) => s + t.correct, 0);
    const totalWrong = tally.reduce((s, t) => s + t.wrong, 0);
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
          Resumo da sessão
        </h3>
        <p style={{ fontSize: 13, color: 'var(--secondary,#64748b)', marginBottom: 16 }}>
          {sourceLabel()} — {totalCorrect} certas, {totalWrong} erradas de{' '}
          {totalCorrect + totalWrong} questões.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tally.map((t) => {
            const total = t.correct + t.wrong;
            const pct = total > 0 ? Math.round((t.correct / total) * 100) : 0;
            return (
              <div
                key={t.contentId}
                style={{
                  border: '0.5px solid var(--color-outline,#e2e8f0)',
                  borderRadius: 12,
                  padding: '10px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t.contentName}</span>
                  <span style={{ fontSize: 13, color: 'var(--primary,#2563eb)', fontWeight: 600 }}>
                    {t.correct}/{total} ({pct}%)
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--secondary,#64748b)', marginTop: 2 }}>
                  {t.wrong > 0
                    ? `${t.wrong} erro(s) enviados ao caderno de erros`
                    : 'sem erros neste conteúdo'}
                </div>
              </div>
            );
          })}
          {tally.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--secondary,#64748b)' }}>
              Nenhuma questão registrada nesta sessão.
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={() => {
              setShowSummary(false);
              setTally([]);
              setRegisteredCount(0);
              resetQuestionForm();
            }}
            style={{ ...inputStyle, width: 'auto', cursor: 'pointer', fontWeight: 500 }}
          >
            Registrar outra prova
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Contexto */}
      <div
        style={{
          border: '0.5px solid var(--color-outline,#e2e8f0)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--secondary,#64748b)', marginBottom: 10 }}>
          Contexto da sessão — defina uma vez
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Prova / simulado</label>
            <input
              style={inputStyle}
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Simulado Medway 03/2026"
            />
          </div>
          <div>
            <label style={labelStyle}>Banca / origem</label>
            <input
              style={inputStyle}
              value={examSource}
              onChange={(e) => setExamSource(e.target.value)}
              placeholder="Medway"
            />
          </div>
        </div>
      </div>

      {/* Cascata */}
      <div
        style={{
          border: '0.5px solid var(--color-outline,#e2e8f0)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--secondary,#64748b)', marginBottom: 10 }}>
          Onde essa questão se encaixa
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <div>
            <label style={labelStyle}>Área</label>
            <select style={inputStyle} value={areaId} onChange={(e) => handleAreaChange(e.target.value)}>
              {hierarchy.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Módulo</label>
            <select style={inputStyle} value={moduleId} onChange={(e) => handleModuleChange(e.target.value)}>
              {selectedArea?.modules.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Conteúdo</label>
            <select style={inputStyle} value={contentId} onChange={(e) => handleContentChange(e.target.value)}>
              {selectedModule?.contents.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Tópico FC Osler (opcional)</label>
            <select style={inputStyle} value={oslerTopic} onChange={(e) => setOslerTopic(e.target.value)}>
              <option value="">— nenhum —</option>
              {oslerTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--primary,#2563eb)' }}>
          Fica fixo para as próximas questões deste conteúdo.
        </div>
      </div>

      {/* Questão atual */}
      <div
        style={{
          border: '0.5px solid var(--color-outline,#e2e8f0)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--secondary,#64748b)' }}>
            Registrar questão
          </span>
          <span style={{ fontSize: 12, color: 'var(--secondary,#94a3b8)' }}>
            registradas: {registeredCount}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => { setOutcome('acertei'); setFormError(''); }}
            style={{
              flex: 1, padding: 10, borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 14,
              border: outcome === 'acertei' ? '2px solid #16a34a' : '0.5px solid var(--color-outline,#cbd5e1)',
              background: outcome === 'acertei' ? '#f0fdf4' : 'transparent',
              color: outcome === 'acertei' ? '#15803d' : 'inherit',
            }}
          >
            ✓ Acertei
          </button>
          <button
            onClick={() => { setOutcome('errei'); setFormError(''); }}
            style={{
              flex: 1, padding: 10, borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 14,
              border: outcome === 'errei' ? '2px solid #dc2626' : '0.5px solid var(--color-outline,#cbd5e1)',
              background: outcome === 'errei' ? '#fef2f2' : 'transparent',
              color: outcome === 'errei' ? '#b91c1c' : 'inherit',
            }}
          >
            ✕ Errei
          </button>
        </div>

        {outcome === 'errei' && (
          <div style={{ borderTop: '0.5px solid var(--color-outline,#e2e8f0)', paddingTop: 12 }}>
            <label style={labelStyle}>Enunciado da questão (para revisar depois)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
              value={statement}
              onChange={(e) => { setStatement(e.target.value); if (formError) setFormError(''); }}
              placeholder="Cole aqui o enunciado da questão errada"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              <div>
                <label style={labelStyle}>Motivo do erro</label>
                <select style={inputStyle} value={reason} onChange={(e) => setReason(e.target.value as ErrorReasonType)}>
                  {ERROR_REASONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nota rápida (opcional)</label>
                <input
                  style={inputStyle}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ex: confundi Stevenson B com C"
                />
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{formError}</div>
        )}
      </div>

      {/* Ações */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
            fontWeight: 600, fontSize: 14, border: 'none',
            background: 'var(--primary,#2563eb)', color: '#fff',
          }}
        >
          Salvar e próxima questão
        </button>
        <button
          onClick={() => setShowSummary(true)}
          style={{ ...inputStyle, width: 'auto', cursor: 'pointer', fontWeight: 500 }}
        >
          Encerrar
        </button>
      </div>
    </div>
  );
};
