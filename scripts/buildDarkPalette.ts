// ============================================================================
// buildDarkPalette
// ----------------------------------------------------------------------------
// Gera src/theme-dark.css a partir das cores padrão do Tailwind.
// No modo escuro, cada paleta (emerald, amber, rose...) tem a escala invertida
// (50↔950, 100↔900, ..., 400↔600): fundos claros viram tons escuros e textos
// escuros viram claros, sem precisar mexer em cada componente.
// Elementos com `text-white` (botões e toasts de fundo forte) recuperam a
// paleta original, para o fundo continuar escuro e o texto branco legível.
//
// Rodar: npx tsx scripts/buildDarkPalette.ts
// ============================================================================
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const themeCss = readFileSync(
  path.resolve('node_modules/tailwindcss/theme.css'),
  'utf8'
);

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const palettes: Record<string, Record<string, string>> = {};

for (const m of themeCss.matchAll(/--color-([a-z]+)-(\d+):\s*([^;]+);/g)) {
  const [, name, shade, value] = m;
  (palettes[name] ??= {})[shade] = value.trim();
}

// Fundos claros (50–300) descem um degrau a mais, para os avisos coloridos
// ficarem discretos no escuro; o 50 ainda é misturado ao fundo do app.
const DARK_SHADE: Record<string, (scale: Record<string, string>) => string> = {
  '50': (s) => `color-mix(in oklab, ${s['950']} 55%, #121218)`,
  '100': (s) => s['950'],
  '200': (s) => s['900'],
  '300': (s) => s['800'],
};

const inverted: string[] = [];
const original: string[] = [];
for (const [name, scale] of Object.entries(palettes)) {
  if (SHADES.some((s) => !scale[s])) continue;
  SHADES.forEach((shade, i) => {
    const mirror = SHADES[SHADES.length - 1 - i];
    inverted.push(`  --color-${name}-${shade}: ${DARK_SHADE[shade]?.(scale) ?? scale[mirror]};`);
    original.push(`  --color-${name}-${shade}: ${scale[shade]};`);
  });
}

const out = `/* Gerado por scripts/buildDarkPalette.ts — não editar à mão. */
.dark {
${inverted.join('\n')}
}

.dark .text-white {
${original.join('\n')}
}
`;

writeFileSync(path.resolve('src/theme-dark.css'), out);
console.log(`src/theme-dark.css: ${Object.keys(palettes).length} paletas`);
