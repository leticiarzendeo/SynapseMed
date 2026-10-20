import React, { useEffect, useRef, useState } from 'react';

// Bloco "To do da faculdade" da tela Hoje.
// É só um bloco de notas: não conversa com nenhum motor do app.
// Fica salvo no localStorage (chave synapsemed_*, então também vai para a nuvem
// junto com o resto dos dados da conta).

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'synapsemed_todo_faculdade';

const loadTodos = (): TodoItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((t) => t && typeof t.text === 'string') : [];
  } catch {
    return [];
  }
};

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const TodoFaculdade: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [todos]);

  const addTodo = () => {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: newId(), text, done: false, createdAt: new Date().toISOString() }]);
    setDraft('');
    inputRef.current?.focus();
  };

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (t: TodoItem) => {
    setEditingId(t.id);
    setEditText(t.text);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const text = editText.trim();
    setTodos((prev) =>
      text ? prev.map((t) => (t.id === editingId ? { ...t, text } : t)) : prev.filter((t) => t.id !== editingId)
    );
    setEditingId(null);
  };

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);
  const ordered = [...pending, ...done];
  const progress = todos.length ? Math.round((done.length / todos.length) * 100) : 0;

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs overflow-hidden">
      {/* Faixa de cor no topo, estilo post-it */}
      <div className="h-1.5" style={{ background: 'var(--color-primary)' }} />

      <div className="p-5 space-y-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/25 border border-primary/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-[1.2rem]">checklist</span>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-on-surface tracking-tight leading-tight">
                To do da faculdade
              </h2>
              <p className="text-[0.6875rem] text-secondary leading-tight mt-0.5">
                Antes de começar os estudos do app
              </p>
            </div>
          </div>
          {todos.length > 0 && (
            <span className="font-code-metric text-xs font-bold text-on-surface bg-surface-container-low border border-surface-container rounded-lg px-2 py-1 shrink-0">
              {done.length}/{todos.length}
            </span>
          )}
        </div>

        {/* Progresso */}
        {todos.length > 0 && (
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-fixed-dim h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Campo para adicionar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="flex items-center gap-2 bg-surface-container-low border border-surface-container rounded-xl pl-3 pr-1.5 py-1.5 focus-within:border-primary-fixed-dim transition-colors"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Adicionar tarefa…"
            className="flex-1 min-w-0 bg-transparent text-sm text-on-surface placeholder:text-secondary/70 outline-none py-1"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            title="Adicionar"
            className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs transition-all hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[1.15rem]">add</span>
          </button>
        </form>

        {/* Lista */}
        {todos.length === 0 ? (
          <div className="text-center py-6 px-3 rounded-xl border border-dashed border-surface-container-high">
            <span className="material-symbols-outlined text-secondary/60 text-3xl">edit_note</span>
            <p className="text-xs text-secondary mt-1">
              Anote aqui o que precisa fazer da faculdade — trabalhos, leituras, provas.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5 max-h-[26rem] overflow-y-auto -mx-1 px-1">
            {ordered.map((t) => (
              <li
                key={t.id}
                className={`group flex items-start gap-2.5 rounded-xl px-2.5 py-2 border transition-colors ${
                  t.done
                    ? 'bg-transparent border-transparent'
                    : 'bg-surface-container-low/60 border-surface-container hover:border-surface-container-high'
                }`}
              >
                <button
                  onClick={() => toggle(t.id)}
                  title={t.done ? 'Desmarcar' : 'Concluir'}
                  className={`mt-0.5 w-[1.125rem] h-[1.125rem] rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                    t.done
                      ? 'bg-primary border-primary-fixed-dim'
                      : 'border-surface-container-highest hover:border-primary-fixed-dim bg-surface-container-lowest'
                  }`}
                >
                  {t.done && (
                    <span className="material-symbols-outlined text-on-primary text-[0.85rem] font-bold">check</span>
                  )}
                </button>

                {editingId === t.id ? (
                  <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    maxLength={200}
                    className="flex-1 min-w-0 bg-surface-container-lowest border border-primary-fixed-dim rounded-md px-1.5 py-0.5 text-sm text-on-surface outline-none"
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEdit(t)}
                    title="Clique duas vezes para editar"
                    className={`flex-1 min-w-0 text-sm leading-snug break-words cursor-text select-text ${
                      t.done ? 'line-through text-secondary/70' : 'text-on-surface'
                    }`}
                  >
                    {t.text}
                  </span>
                )}

                {editingId !== t.id && (
                  <button
                    onClick={() => remove(t.id)}
                    title="Apagar"
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-secondary hover:text-red-600 transition-opacity shrink-0"
                  >
                    <span className="material-symbols-outlined text-[1.05rem]">close</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Rodapé */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-surface-container text-[0.6875rem]">
            <span className="text-secondary">
              {pending.length === 0
                ? 'Tudo feito! Bora estudar 🎉'
                : `${pending.length} pendente${pending.length > 1 ? 's' : ''}`}
            </span>
            {done.length > 0 && (
              <button onClick={clearDone} className="font-semibold text-secondary hover:text-on-surface transition-colors">
                Limpar concluídas
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
