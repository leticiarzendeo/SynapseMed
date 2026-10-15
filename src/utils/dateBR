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
