import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface HeaderProps {
  preferences: UserPreferences;
  onOpenMobileMenu: () => void;
  onOpenPreferences: () => void;
  onSelectTopic: (topicTitle: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onOpenMobileMenu,
  onOpenPreferences,
  onSelectTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchableItems = [
    { title: 'ICC — Insuficiência Cardíaca Congestiva', category: 'Clínica Médica > Cardiologia', type: 'Questões' },
    { title: 'DPOC — Doença Pulmonar Obstrutiva Crônica', category: 'Clínica Médica > Pneumologia', type: 'Revisão' },
    { title: 'Endocardite Infecciosa', category: 'Clínica Médica > Cardiologia', type: 'Teoria' },
    { title: 'Pré-Natal e Síndromes Hipertensivas', category: 'Ginecologia e Obstetrícia', type: 'Resumo' },
    { title: 'Trauma — Atendimento Inicial (ATLS)', category: 'Cirurgia Geral', type: 'Protocolo' },
    { title: 'Puericultura e Marcos do Desenvolvimento', category: 'Pediatria', type: 'Flashcard' },
    { title: 'Princípios e Leis do SUS (8.080 / 8.142)', category: 'Medicina Preventiva', type: 'Questões' },
    { title: 'Simulado Nacional ENARE 2025', category: 'Provas e Simulados', type: 'Simulado' },
  ];

  const filteredItems = searchQuery.trim()
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header
      id="app-header"
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 px-4 sm:px-space-xl flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container/40"
    >
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-secondary hover:bg-surface-container"
          aria-label="Abrir menu lateral"
        >
          <span className="material-symbols-outlined text-[1.5rem]">menu</span>
        </button>

        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[1.25rem]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full h-9 pl-10 pr-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Buscar temas, diretrizes, questões ou revisões..."
            type="text"
          />

          {/* Quick Search Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-11 left-0 right-0 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container p-2 z-50">
              <div className="flex items-center justify-between px-2 py-1 text-[0.75rem] font-semibold text-secondary uppercase tracking-wider">
                <span>Resultados encontrados ({filteredItems.length})</span>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-secondary hover:text-on-surface text-[0.75rem]"
                >
                  Fechar
                </button>
              </div>
              {filteredItems.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectTopic(item.title);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-headline-sm text-xs font-semibold text-on-surface group-hover:text-primary">
                          {item.title}
                        </div>
                        <div className="text-[0.6875rem] text-secondary">{item.category}</div>
                      </div>
                      <span className="text-[0.6875rem] px-2 py-0.5 rounded bg-surface-container font-code-metric text-secondary">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-secondary">
                  Nenhum resultado para "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Bar only - Target institutions removed as requested */}
      </div>

      {/* Right: Notifications & User Info */}
      <div className="flex items-center gap-space-base">
        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            type="button"
            aria-label="Notificações do sistema"
          >
            <span className="material-symbols-outlined text-[1.375rem]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-3 z-50 space-y-2">
              <div className="flex items-center justify-between border-b border-surface-container pb-2">
                <span className="font-semibold text-xs text-on-surface">Notificações Inteligentes</span>
                <span className="text-[0.6875rem] text-primary font-medium">Novas</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-surface-container-low border border-surface-container/60">
                  <div className="font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-sm">rocket_launch</span>
                    Bem-vindo ao SynapseMed!
                  </div>
                  <p className="text-[0.7rem] text-secondary mt-0.5">
                    Seu cronograma de 2 anos está pronto com base nas bancas-alvo. Carga semanal inicial calibrada para 8 horas.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low border border-surface-container/60">
                  <div className="font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">play_circle</span>
                    Primeira Atividade Recomendada
                  </div>
                  <p className="text-[0.7rem] text-secondary mt-0.5">
                    Inicie pela teoria de Insuficiência Cardíaca Congestiva (ICC), o tema de maior incidência histórica.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <button
          onClick={onOpenPreferences}
          className="flex items-center gap-space-sm pl-space-sm rounded-xl hover:bg-surface-container-low p-1 transition-colors text-left"
          title="Configurações e preferências"
        >
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
              {preferences.name}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
              {preferences.cycle}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
            LR
          </div>
        </button>
      </div>
    </header>
  );
};
