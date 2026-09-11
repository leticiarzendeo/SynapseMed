import React, { useState } from 'react';

interface RegistrarEstudoModalProps {
  onClose: () => void;
  onSave: (session: { specialty: string; topic: string; durationMinutes: number; type: string }) => void;
}

export const RegistrarEstudoModal: React.FC<RegistrarEstudoModalProps> = ({ onClose, onSave }) => {
  const [specialty, setSpecialty] = useState('Clínica Médica');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('30');
  const [format, setFormat] = useState('questoes');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSave({
      specialty,
      topic: topic.trim(),
      durationMinutes: parseInt(duration, 10) || 30,
      type: format,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl border border-surface-container overflow-hidden">
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">add_circle</span>
            <div className="font-headline-sm text-sm font-bold text-on-surface">
              Registrar Estudo Avulso
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-secondary hover:bg-surface-container">
            <span className="material-symbols-outlined text-[1.25rem]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-secondary font-semibold mb-1">Grande Área</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Clínica Médica">Clínica Médica</option>
              <option value="Cirurgia Geral">Cirurgia Geral</option>
              <option value="Ginecologia e Obstetrícia">Ginecologia e Obstetrícia</option>
              <option value="Pediatria">Pediatria</option>
              <option value="Medicina Preventiva e Social">Medicina Preventiva e Social</option>
            </select>
          </div>

          <div>
            <label className="block text-secondary font-semibold mb-1">Tema / Assunto Estudado</label>
            <input
              type="text"
              required
              placeholder="Ex: Cetoacidose Diabética, Hérnia Inguinal..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-secondary font-semibold mb-1">Duração (minutos)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-code-metric"
              />
            </div>
            <div>
              <label className="block text-secondary font-semibold mb-1">Modalidade</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-xl border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="questoes">Questões de Prova</option>
                <option value="revisao">Revisão Espaçada / Flashcards</option>
                <option value="teoria">Teoria / Videoaula / Leitura</option>
              </select>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container/60 text-secondary leading-relaxed">
            <span className="font-semibold text-on-surface">Integração Adaptativa:</span> Esta sessão será computada na sua carga semanal e o tema passará a ter curva de repetição espaçada calculada automaticamente.
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
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
