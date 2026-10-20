import React, { useEffect, useMemo, useState } from 'react';
import { hojeBR, somarDiasBR, segundaDaSemanaBR } from '../utils/dateBR';

// Bloco "Constância" da tela Hoje, logo abaixo do To do da faculdade.
// Quadradinhos por dia: a usuária marca os dias em que estudou e vê a sequência.
// Salvo no localStorage (chave synapsemed_*, então também vai para a nuvem).

const STORAGE_KEY = 'synapsemed_dias_estudados';
const SEMANAS_VISIVEIS = 8;
const LETRAS_DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const loadDias = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) : [];
  } catch {
    return [];
  }
};

const formatarData = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${Number(d)} ${MESES[Number(m) - 1]}`;
};

/** Dias seguidos até hoje. Se hoje ainda não foi marcado, conta até ontem (a sequência segue viva). */
const sequenciaAtual = (dias: Set<string>, hoje: string): number => {
  let cursor = dias.has(hoje) ? hoje : somarDiasBR(hoje, -1);
  let n = 0;
  while (dias.has(cursor)) {
    n += 1;
    cursor = somarDiasBR(cursor, -1);
  }
  return n;
};

const maiorSequencia = (diasOrdenados: string[]): number => {
  let melhor = 0;
  let atual = 0;
  let anterior: string | null = null;
  for (const d of diasOrdenados) {
    atual = anterior && somarDiasBR(anterior, 1) === d ? atual + 1 : 1;
    melhor = Math.max(melhor, atual);
    anterior = d;
  }
  return melhor;
};

export const ConstanciaEstudos: React.FC = () => {
  const [dias, setDias] = useState<string[]>(loadDias);
  const hoje = hojeBR();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dias));
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [dias]);

  const conjunto = useMemo(() => new Set(dias), [dias]);
  const ordenados = useMemo(() => [...dias].sort(), [dias]);
  const sequencia = sequenciaAtual(conjunto, hoje);
  const recorde = maiorSequencia(ordenados);
  const estudouHoje = conjunto.has(hoje);

  // Grade: 8 semanas (segunda a domingo), terminando na semana atual.
  const inicio = somarDiasBR(segundaDaSemanaBR(hoje), -7 * (SEMANAS_VISIVEIS - 1));
  const semanas = Array.from({ length: SEMANAS_VISIVEIS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => somarDiasBR(inicio, w * 7 + d))
  );
  const diasNaGrade = semanas.flat().filter((d) => d <= hoje);
  const estudadosNaGrade = diasNaGrade.filter((d) => conjunto.has(d)).length;

  const alternar = (dia: string) => {
    if (dia > hoje) return;
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs overflow-hidden">
      <div className="h-1.5 bg-emerald-500" />

      <div className="p-5 space-y-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-[1.2rem]">local_fire_department</span>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-on-surface tracking-tight leading-tight">Constância</h2>
              <p className="text-[0.6875rem] text-secondary leading-tight mt-0.5">Marque os dias em que estudou</p>
            </div>
          </div>
        </div>

        {/* Números */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-surface-container-low border border-surface-container px-2 py-2 text-center">
            <div className="font-code-metric text-xl font-extrabold text-on-surface leading-none">{sequencia}</div>
            <div className="text-[0.625rem] text-secondary mt-1 leading-tight">
              {sequencia === 1 ? 'dia seguido' : 'dias seguidos'}
            </div>
          </div>
          <div className="rounded-xl bg-surface-container-low border border-surface-container px-2 py-2 text-center">
            <div className="font-code-metric text-xl font-extrabold text-on-surface leading-none">{recorde}</div>
            <div className="text-[0.625rem] text-secondary mt-1 leading-tight">recorde</div>
          </div>
          <div className="rounded-xl bg-surface-container-low border border-surface-container px-2 py-2 text-center">
            <div className="font-code-metric text-xl font-extrabold text-on-surface leading-none">
              {estudadosNaGrade}
              <span className="text-xs text-secondary font-bold">/{diasNaGrade.length}</span>
            </div>
            <div className="text-[0.625rem] text-secondary mt-1 leading-tight">em 8 semanas</div>
          </div>
        </div>

        {/* Quadradinhos */}
        <div className="max-w-xs mx-auto w-full">
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {LETRAS_DIAS.map((l, i) => (
              <div key={i} className="text-center text-[0.625rem] font-bold text-secondary">
                {l}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {semanas.flat().map((dia) => {
              const futuro = dia > hoje;
              const marcado = conjunto.has(dia);
              const ehHoje = dia === hoje;
              return (
                <button
                  key={dia}
                  type="button"
                  disabled={futuro}
                  onClick={() => alternar(dia)}
                  title={futuro ? formatarData(dia) : `${formatarData(dia)} · ${marcado ? 'estudou (clique para desmarcar)' : 'clique para marcar'}`}
                  className={`aspect-square rounded-md text-[0.625rem] font-bold flex items-center justify-center transition-all ${
                    futuro
                      ? 'bg-surface-container/40 text-transparent cursor-default'
                      : marcado
                      ? 'bg-emerald-500 text-white hover:brightness-95'
                      : 'bg-surface-container text-secondary/70 hover:bg-surface-container-high'
                  } ${ehHoje ? 'ring-2 ring-offset-1 ring-emerald-500 ring-offset-surface-container-lowest' : ''}`}
                >
                  {Number(dia.slice(8))}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ação de hoje */}
        <button
          type="button"
          onClick={() => alternar(hoje)}
          className={`w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            estudouHoje
              ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/40 hover:bg-emerald-500/25'
              : 'bg-emerald-500 text-white shadow-xs hover:brightness-95'
          }`}
        >
          <span className="material-symbols-outlined text-[1.1rem]">{estudouHoje ? 'task_alt' : 'add_task'}</span>
          {estudouHoje ? 'Hoje já está marcado' : 'Estudei hoje'}
        </button>

        <p className="text-[0.6875rem] text-secondary text-center leading-snug">
          {estudouHoje
            ? sequencia > 1
              ? `Boa! ${sequencia} dias seguidos.`
              : 'Primeiro dia da sequência. Volte amanhã!'
            : sequencia > 0
            ? `Marque hoje para chegar a ${sequencia + 1} dias seguidos.`
            : 'Toque em um quadradinho para marcar um dia que já passou.'}
        </p>
      </div>
    </section>
  );
};
