import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface ConfiguracoesViewProps {
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
  onResetAllData?: () => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({
  preferences,
  onSavePreferences,
  onResetAllData,
}) => {
  const [name, setName] = useState(preferences.name);
  const [weeklyHours, setWeeklyHours] = useState(preferences.weeklyHoursTarget.toString());
  const [timeline, setTimeline] = useState(preferences.targetYearTimeline);
  const [institutions, setInstitutions] = useState(preferences.targetInstitutions.join(', '));
  const [cycle, setCycle] = useState(preferences.cycle);
  const [savedToast, setSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const instArray = institutions
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    onSavePreferences({
      ...preferences,
      name,
      weeklyHoursTarget: parseFloat(weeklyHours) || 8.0,
      targetYearTimeline: timeline,
      targetInstitutions: instArray.length > 0 ? instArray : preferences.targetInstitutions,
      cycle,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-space-gutter-desktop py-space-xl max-w-max-width-content mx-auto space-y-space-xl">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-base">check</span>
          <span>Preferências e instituições salvas com sucesso!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md">
            <span className="material-symbols-outlined text-[1rem]">tune</span>
            <span>Configurações do Usuário</span>
            <span className="mx-space-2xs text-outline-variant">•</span>
            <span className="font-code-metric text-primary font-medium">Parâmetros do Sistema</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-2xs">
            Preferências &amp; Metas de Residência
          </h1>
          <p className="font-body-sm text-secondary mt-0.5">
            Personalize suas instituições-alvo, ritmo semanal e algoritmo de priorização.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm space-y-5 max-w-2xl text-xs">
        <div>
          <label className="block text-secondary font-semibold mb-1">Nome do Estudante</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-secondary font-semibold mb-1">
            Meta Curricular de Longo Prazo
          </label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="1 Ano">1 Ano (Ciclo Intensivo)</option>
            <option value="2 Anos">2 Anos (Ciclo Regular)</option>
            <option value="3 Anos">3 Anos (Ciclo Estendido)</option>
          </select>
        </div>

        <div>
          <label className="block text-secondary font-semibold mb-1">
            Carga Regular Semanal (horas)
          </label>
          <input
            type="number"
            step="0.5"
            min="2"
            max="40"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-code-metric focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-[0.6875rem] text-secondary mt-1 block">
            Atividades de simulação de sábado são extraordinárias e não entram nesta contagem.
          </span>
        </div>

        <div>
          <label className="block text-secondary font-semibold mb-1">
            Instituições-Alvo (separadas por vírgula)
          </label>
          <input
            type="text"
            value={institutions}
            onChange={(e) => setInstitutions(e.target.value)}
            className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-[0.6875rem] text-secondary mt-1 block">
            O algoritmo prioriza questões com maior incidência histórica nessas bancas.
          </span>
        </div>

        <div>
          <label className="block text-secondary font-semibold mb-1">Descrição do Ciclo</label>
          <input
            type="text"
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
            className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="pt-3 border-t border-surface-container flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-all shadow-sm"
          >
            Salvar Preferências
          </button>
        </div>
      </form>

      {/* Ambiente de Teste e Reset */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container shadow-sm max-w-2xl text-xs space-y-3">
        <div className="flex items-center gap-2 text-on-surface font-semibold text-sm">
          <span className="material-symbols-outlined text-primary text-base">restart_alt</span>
          <span>Ambiente de Teste &amp; Redefinição</span>
        </div>
        <p className="text-secondary leading-relaxed">
          Se você realizar testes, simular sessões ou cadastrar erros e quiser retornar a plataforma para o estado inicial de estudos (0% concluído, sem histórico prévio), utilize o botão abaixo.
        </p>
        <button
          type="button"
          onClick={() => {
            if (onResetAllData) {
              onResetAllData();
            }
          }}
          className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">delete_sweep</span>
          <span>Restaurar Estado Inicial de Teste (0% Concluído)</span>
        </button>
      </div>
    </div>
  );
};
