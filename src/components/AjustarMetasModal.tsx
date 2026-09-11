import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface AjustarMetasModalProps {
  preferences: UserPreferences;
  onClose: () => void;
  onSave: (updated: UserPreferences) => void;
}

export const AjustarMetasModal: React.FC<AjustarMetasModalProps> = ({
  preferences,
  onClose,
  onSave,
}) => {
  const [weeklyHours, setWeeklyHours] = useState(preferences.weeklyHoursTarget.toString());
  const [timeline, setTimeline] = useState(preferences.targetYearTimeline);
  const [institutions, setInstitutions] = useState(preferences.targetInstitutions.join(', '));
  const [availableToday, setAvailableToday] = useState(preferences.availableTodayMinutes.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const instArray = institutions
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    onSave({
      ...preferences,
      weeklyHoursTarget: parseFloat(weeklyHours) || 8.0,
      targetYearTimeline: timeline,
      availableTodayMinutes: parseInt(availableToday, 10) || 90,
      targetInstitutions: instArray.length > 0 ? instArray : preferences.targetInstitutions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl border border-surface-container overflow-hidden">
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">tune</span>
            <div className="font-headline-sm text-sm font-bold text-on-surface">
              Ajustar Metas e Cronograma
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-secondary hover:bg-surface-container">
            <span className="material-symbols-outlined text-[1.25rem]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-secondary font-semibold mb-1">
              Carga Semanal Regular de Estudos (horas)
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
            <span className="text-[0.6875rem] text-secondary mt-0.5 block">
              Simulados extraordinários de fim de semana não consomem esta carga.
            </span>
          </div>

          <div>
            <label className="block text-secondary font-semibold mb-1">
              Tempo Disponível Hoje (minutos)
            </label>
            <input
              type="number"
              min="15"
              max="360"
              step="15"
              value={availableToday}
              onChange={(e) => setAvailableToday(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-code-metric focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-secondary font-semibold mb-1">
              Prazo da Meta Curricular
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="1 Ano">1 Ano (Ciclo Intensivo / R-Mais)</option>
              <option value="2 Anos">2 Anos (Ciclo Regular Padrão)</option>
              <option value="3 Anos">3 Anos (Ciclo Gradual Internato)</option>
            </select>
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
              placeholder="USP-SP, UNIFESP, UNICAMP, ENARE, SUS-SP"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
