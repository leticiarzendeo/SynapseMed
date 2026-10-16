// ============================================================================
// dateBR.ts — datas no fuso de Brasília (America/Sao_Paulo).
// ----------------------------------------------------------------------------
// O app todo deve usar a data/hora real de Brasília. Usar new Date().toISOString()
// pega UTC (~3h à frente), o que vira o dia seguinte entre ~21h e meia-noite.
// Estas funções garantem a data correta no fuso de Brasília.
// ============================================================================

/** Data de "hoje" em Brasília, no formato YYYY-MM-DD. */
export function hojeBR(): string {
  // en-CA produz YYYY-MM-DD; timeZone fixa o fuso de Brasília.
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

/** Soma (ou subtrai) dias a uma data YYYY-MM-DD, sem depender do fuso. */
export function somarDiasBR(dataISO: string, dias: number): string {
  // Meio-dia UTC evita qualquer virada de dia por fuso/horário de verão.
  const d = new Date(`${dataISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Diferença em dias inteiros (b - a) entre duas datas YYYY-MM-DD. */
export function diferencaDiasBR(a: string, b: string): number {
  const ms = new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime();
  return Math.round(ms / 86400000);
}

/** Objeto Date "agora" ajustado para o horário de Brasília. */
export function agoraBR(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

/** Hora atual (0-23) em Brasília. */
export function horaBR(): number {
  return Number(
    new Date().toLocaleString('en-US', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      hour12: false,
    })
  );
}
