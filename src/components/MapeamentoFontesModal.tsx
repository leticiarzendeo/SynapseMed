import React, { useState, useMemo } from 'react';
import { ContentItem, OslerBlock, SourceMapping } from '../types';

interface MapeamentoFontesModalProps {
  content: ContentItem;
  oslerBlocks: OslerBlock[];
  mappings: SourceMapping[];
  allContents: ContentItem[];
  onSaveMappings: (contentId: string, selectedBlockIds: string[]) => void;
  onCreateOslerBlock: (newBlock: Omit<OslerBlock, 'id'>) => string; // returns created block ID
  onClose: () => void;
}

export const MapeamentoFontesModal: React.FC<MapeamentoFontesModalProps> = ({
  content,
  oslerBlocks,
  mappings,
  allContents,
  onSaveMappings,
  onCreateOslerBlock,
  onClose,
}) => {
  // Inicializa com os IDs já mapeados para este conteúdo
  const currentlyMappedIds = useMemo(() => {
    return mappings
      .filter((m) => m.contentId === content.id)
      .map((m) => m.oslerBlockId);
  }, [mappings, content.id]);

  const [selectedIds, setSelectedIds] = useState<string[]>(currentlyMappedIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBlockForm, setShowNewBlockForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCardsCount, setNewCardsCount] = useState('20');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtra blocos Osler pela busca
  const filteredBlocks = useMemo(() => {
    if (!searchTerm.trim()) return oslerBlocks;
    const term = searchTerm.toLowerCase();
    return oslerBlocks.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        (b.specialtyHint && b.specialtyHint.toLowerCase().includes(term))
    );
  }, [oslerBlocks, searchTerm]);

  // Calcula soma em tempo real dos blocos selecionados
  const selectedMetrics = useMemo(() => {
    const selected = oslerBlocks.filter((b) => selectedIds.includes(b.id));
    return selected.reduce(
      (acc, b) => ({
        total: acc.total + b.cardsTotal,
        facil: acc.facil + b.cardsFacil,
        normal: acc.normal + b.cardsNormal,
        dificil: acc.dificil + b.cardsDificil,
        erros: acc.erros + b.cardsErros,
      }),
      { total: 0, facil: 0, normal: 0, dificil: 0, erros: 0 }
    );
  }, [oslerBlocks, selectedIds]);

  // Helper para identificar se um bloco está associado também a OUTROS conteúdos (relação N:M)
  const getOtherContentsForBlock = (blockId: string) => {
    const otherMappings = mappings.filter(
      (m) => m.oslerBlockId === blockId && m.contentId !== content.id
    );
    return otherMappings.map((m) => {
      const found = allContents.find((c) => c.id === m.contentId);
      return found ? found.name : m.contentId;
    });
  };

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSaveMappings(content.id, selectedIds);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const total = parseInt(newCardsCount, 10) || 15;
    const facil = Math.round(total * 0.45);
    const normal = Math.round(total * 0.35);
    const dificil = Math.round(total * 0.15);
    const erros = total - facil - normal - dificil;

    const newId = onCreateOslerBlock({
      title: newTitle.trim(),
      specialtyHint: content.moduloName,
      cardsTotal: total,
      cardsFacil: facil,
      cardsNormal: normal,
      cardsDificil: dificil,
      cardsErros: Math.max(0, erros),
    });

    // Já auto-seleciona o bloco recém-criado
    setSelectedIds((prev) => [...prev, newId]);
    setNewTitle('');
    setShowNewBlockForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-surface-container flex items-start justify-between bg-surface-container-low/40">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
              <span className="material-symbols-outlined text-base">alt_route</span>
              <span>Mapeamento de Fontes • Relação Muitos-para-Muitos (N:M)</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">
              Associar Blocos do Osler a &ldquo;{content.name}&rdquo;
            </h2>
            <div className="flex items-center gap-2 text-xs text-secondary mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-surface-container font-medium text-[0.6875rem]">
                {content.areaName}
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-medium text-[0.6875rem]">
                {content.moduloName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Informative Rule Card */}
        <div className="p-4 bg-primary-container/20 border-b border-surface-container text-xs text-secondary leading-relaxed">
          <p>
            <strong className="text-on-surface">Regra estrutural nº 1:</strong> O currículo Medway define o conteúdo central,
            enquanto o Osler possui sua própria taxonomia em blocos/títulos. Selecione todos os blocos do Osler que constituem
            a evidência de domínio para este conteúdo. Relações 1:N e N:M são plenamente suportadas.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[58vh] overflow-y-auto">
          {/* Real-time aggregation counter */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">style</span>
                Evidência Osler Consolidada ({selectedIds.length} blocos vinculados)
              </div>
              <span className="font-code-metric font-bold text-sm text-primary">
                {selectedMetrics.total} cards vinculados
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2.5 text-center text-[0.6875rem]">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <span className="font-code-metric font-bold text-sm block">{selectedMetrics.facil}</span>
                <span>Fácil</span>
              </div>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/60">
                <span className="font-code-metric font-bold text-sm block">{selectedMetrics.normal}</span>
                <span>Normal</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60">
                <span className="font-code-metric font-bold text-sm block">{selectedMetrics.dificil}</span>
                <span>Difícil</span>
              </div>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/60">
                <span className="font-code-metric font-bold text-sm block">{selectedMetrics.erros}</span>
                <span>Erros</span>
              </div>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-secondary text-sm">search</span>
              <input
                type="text"
                placeholder="Buscar títulos ou blocos no Osler..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowNewBlockForm(!showNewBlockForm)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container text-xs font-semibold hover:bg-surface-container text-on-surface flex items-center justify-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Cadastrar Bloco no Osler
            </button>
          </div>

          {/* New Block Inline Form */}
          {showNewBlockForm && (
            <form onSubmit={handleCreateBlock} className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-3 animate-fadeIn">
              <div className="text-xs font-bold text-on-surface">Novo Título/Bloco no Catálogo Osler</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="text-[0.625rem] text-secondary font-semibold uppercase block mb-1">
                    Título exato no Osler
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Insuficiência cardíaca — tratamento"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-surface-container-lowest rounded-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-[0.625rem] text-secondary font-semibold uppercase block mb-1">
                    Qtd. de Cards
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCardsCount}
                    onChange={(e) => setNewCardsCount(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-surface-container-lowest rounded-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewBlockForm(false)}
                  className="px-3 py-1 rounded text-xs text-secondary hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-primary text-on-primary text-xs font-bold hover:bg-primary-container"
                >
                  Adicionar ao Catálogo
                </button>
              </div>
            </form>
          )}

          {/* Checklist of Osler Blocks */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center justify-between">
              <span>Selecione os blocos relacionados:</span>
              <span className="text-[0.6875rem] font-medium font-code-metric">
                {selectedIds.length} selecionados
              </span>
            </div>

            <div className="divide-y divide-surface-container rounded-xl border border-surface-container overflow-hidden bg-surface-container-lowest">
              {filteredBlocks.length === 0 ? (
                <div className="p-6 text-center text-xs text-secondary">
                  Nenhum bloco encontrado com o termo &ldquo;{searchTerm}&rdquo;.
                </div>
              ) : (
                filteredBlocks.map((block) => {
                  const isChecked = selectedIds.includes(block.id);
                  const otherContents = getOtherContentsForBlock(block.id);

                  return (
                    <label
                      key={block.id}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                        isChecked ? 'bg-primary-container/15' : 'hover:bg-surface-container-low/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(block.id)}
                        className="mt-1 h-4 w-4 rounded border-surface-container text-primary focus:ring-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-on-surface">{block.title}</span>
                          <span className="px-2 py-0.2 rounded font-code-metric text-[0.625rem] bg-surface-container text-secondary font-semibold">
                            {block.cardsTotal} cards
                          </span>
                          {block.specialtyHint && (
                            <span className="text-[0.625rem] text-secondary">
                              ({block.specialtyHint})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[0.6875rem] text-secondary mt-1">
                          <span className="text-emerald-700 font-medium">Fácil: {block.cardsFacil}</span>
                          <span>•</span>
                          <span className="text-blue-700 font-medium">Normal: {block.cardsNormal}</span>
                          <span>•</span>
                          <span className="text-amber-700 font-medium">Difícil: {block.cardsDificil}</span>
                          <span>•</span>
                          <span className="text-rose-700 font-medium">Erros: {block.cardsErros}</span>
                        </div>

                        {/* Indicador de Relação Muitos-para-Muitos com outros conteúdos */}
                        {otherContents.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-1 text-[0.625rem] text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded w-fit">
                            <span className="material-symbols-outlined text-[0.75rem]">share</span>
                            <span>Também associado a: {otherContents.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/30 flex items-center justify-between">
          <div className="text-xs text-secondary">
            {saveSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Associação salva com sucesso!
              </span>
            ) : (
              <span>Essa associação fica salva permanentemente para o conteúdo {content.name}.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-surface-container text-xs font-semibold hover:bg-surface-container text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveSuccess}
              className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Salvar Associação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
