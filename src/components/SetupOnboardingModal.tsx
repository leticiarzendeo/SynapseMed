import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface SetupOnboardingModalProps {
  preferences: UserPreferences;
  onClose: () => void;
  onSave: (updated: UserPreferences) => void;
}

export const SetupOnboardingModal: React.FC<SetupOnboardingModalProps> = ({
  preferences,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [name, setName] = useState(preferences.name || 'Letícia');
  const [weeklyHours, setWeeklyHours] = useState(preferences.weeklyHoursTarget || 8);
  const [timeline, setTimeline] = useState(preferences.targetYearTimeline || '2 Anos');
  const [deadlineDate, setDeadlineDate] = useState(preferences.targetDeadlineDate || '2028-09-07');
  const [institutions, setInstitutions] = useState<string[]>(
    preferences.targetInstitutions || ['USP-SP', 'UNIFESP', 'UNICAMP', 'ENARE']
  );
  const [medwayIntegrated, setMedwayIntegrated] = useState(true);
  const [oslerIntegrated, setOslerIntegrated] = useState(true);

  const availableInstitutions = [
    { id: 'USP-SP', name: 'USP-SP', region: 'São Paulo', weight: 'Alta' },
    { id: 'UNIFESP', name: 'UNIFESP', region: 'São Paulo', weight: 'Alta' },
    { id: 'UNICAMP', name: 'UNICAMP', region: 'Campinas', weight: 'Alta' },
    { id: 'ENARE', name: 'ENARE (Nacional)', region: 'Federal', weight: 'Alta' },
    { id: 'USP-RP', name: 'USP Ribeirão Preto', region: 'Interior SP', weight: 'Média' },
    { id: 'SCMSP', name: 'Santa Casa de SP', region: 'São Paulo', weight: 'Média' },
    { id: 'UFRJ', name: 'UFRJ', region: 'Rio de Janeiro', weight: 'Média' },
    { id: 'SUS-SP', name: 'SUS-SP', region: 'São Paulo', weight: 'Média' },
  ];

  const toggleInstitution = (instId: string) => {
    setInstitutions((prev) =>
      prev.includes(instId) ? prev.filter((i) => i !== instId) : [...prev, instId]
    );
  };

  const handleFinish = () => {
    onSave({
      ...preferences,
      name,
      weeklyHoursTarget: weeklyHours,
      targetYearTimeline: timeline,
      targetDeadlineDate: deadlineDate,
      targetInstitutions: institutions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-surface-container shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
              {step}/{totalSteps}
            </div>
            <div>
              <span className="text-[0.625rem] text-secondary font-bold uppercase tracking-wider block">
                Assistente de Calibração
              </span>
              <h2 className="text-base font-extrabold text-on-surface">
                {step === 1 && '1. Perfil & Horizonte de 2 Anos'}
                {step === 2 && '2. Carga Horária & Ritmo Semanal'}
                {step === 3 && '3. Instituições-Alvo Prioritárias'}
                {step === 4 && '4. Integrações de Conteúdo & FSRS'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:bg-surface-container"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Horizonte de 2 Anos */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <p className="text-secondary leading-relaxed">
              O objetivo do sistema é garantir que, até o final dos <strong>2 anos</strong>, todos os 620 conteúdos do currículo tenham sido estudados e submetidos a ciclos de consolidação suficientes para que o domínio estimado seja <strong>≥85%</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-secondary font-bold mb-1">Como você prefere ser chamada(o)?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex: Letícia"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-secondary font-bold mb-1">Horizonte de Preparação</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-semibold"
                  >
                    <option value="2 Anos">2 Anos (Padrão Ouro — 104 sem)</option>
                    <option value="1 Ano">1 Ano (Intensivo R1 — 52 sem)</option>
                    <option value="3 Anos">3 Anos (Ciclo Estendido)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-secondary font-bold mb-1">Data-Alvo da Prova</label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[0.75rem] leading-relaxed">
              💡 <strong>Regra Fundamental:</strong> Mesmo depois que um conteúdo atinge 85% de domínio, ele <strong>não é aposentado</strong>. As revisões continuam ativas, ficando progressivamente mais espaçadas conforme o FSRS comprova estabilidade.
            </div>
          </div>
        )}

        {/* Step 2: Carga Horária */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <p className="text-secondary leading-relaxed">
              Defina sua cota semanal de estudo. O algoritmo não tenta encher todas as horas com qualquer tarefa; ele usa seu tempo de forma ótima, com <strong>margem de reserva</strong> para absorver imprevistos.
            </p>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface text-sm">Carga Semanal Recomendada</span>
                <span className="font-code-metric text-lg font-black text-primary">
                  {weeklyHours}h / semana
                </span>
              </div>

              <input
                type="range"
                min={4}
                max={20}
                step={0.5}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />

              <div className="flex justify-between text-[0.6875rem] text-secondary">
                <span>4h (Mínimo sustentável)</span>
                <span>8h (Recomendado / Caso Base)</span>
                <span>15h+ (Férias / Intensivo)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[0.75rem]">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">🛡️ Vagas Protegidas de Avanço</span>
                <span className="text-secondary block">
                  ~6h/semana dedicadas a avançar o currículo para garantir a conclusão em 2 anos.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-bold text-on-surface block">⏱️ Margem de Reserva</span>
                <span className="text-secondary block">
                  30 min de folga planejada para absorver atrasos sem sobrecarregar a semana seguinte.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Instituições-Alvo */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <p className="text-secondary leading-relaxed">
              O algoritmo prioriza temas com base na <strong>incidência real</strong> das suas bancas preferidas. Selecione as instituições que você mais deseja:
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {availableInstitutions.map((inst) => {
                const isSelected = institutions.includes(inst.id);
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => toggleInstitution(inst.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-on-surface shadow-xs'
                        : 'bg-surface-container-low border-surface-container text-secondary hover:bg-surface-container'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-on-surface block">{inst.name}</span>
                      <span className="text-[0.625rem] text-secondary">{inst.region}</span>
                    </div>
                    <span className="text-base">{isSelected ? '☑' : '☐'}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[0.75rem] text-secondary">
              {institutions.length} instituição(ões) selecionada(s). O peso de incidência de questões será ponderado por essas bancas.
            </div>
          </div>
        )}

        {/* Step 4: Integrações & FSRS */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <p className="text-secondary leading-relaxed">
              O SynapseMed atua como o <strong>Cérebro Orquestrador</strong>, cruzando dados de conteúdo e repetição espaçada:
            </p>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <span>📘 Medway (Aulas, Resumos &amp; Banco de Questões)</span>
                  </div>
                  <div className="text-[0.6875rem] text-secondary">
                    Alimenta as dimensões de Conhecimento e Aplicação em Prova.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={medwayIntegrated}
                  onChange={(e) => setMedwayIntegrated(e.target.checked)}
                  className="rounded text-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <span>🧠 Osler / Anki (Repetição Espaçada com FSRS)</span>
                  </div>
                  <div className="text-[0.6875rem] text-secondary">
                    Alimenta a dimensão de Retenção e calcula intervalos adaptativos.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={oslerIntegrated}
                  onChange={(e) => setOslerIntegrated(e.target.checked)}
                  className="rounded text-primary w-4 h-4"
                />
              </label>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[0.75rem]">
              ✨ <strong>Tudo pronto:</strong> O algoritmo montará seu plano de hoje baseado na sua disponibilidade e calculará o impacto por minuto de cada atividade.
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-surface-container pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-all"
            >
              ← Voltar
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Avançar</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Concluir e Iniciar Estudos</span>
              <span>✓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
