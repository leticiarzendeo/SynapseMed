// ============================================================================
// examImportEngine.ts
// ----------------------------------------------------------------------------
// Importa um arquivo JSON gerado por uma IA EXTERNA (ChatGPT/Claude/Gemini),
// onde a Leticia subiu o PDF da prova informando acertos/erros e a IA devolveu:
// questões transcritas + classificação (área›módulo›conteúdo + contentId) +
// acertou/errou.
//
// O app NÃO classifica nada e NÃO chama IA. Ele apenas LÊ, VALIDA e casa cada
// questão com o currículo. A qualidade fica sob controle da Leticia (que revisa
// o que a IA externa devolveu antes de subir). Isto atende à decisão dela de
// não deixar uma IA alimentar o sistema sozinha.
//
// Casamento seguro: usa o contentId; se o id não existir no currículo (a IA
// pode errar/alucinar), tenta casar pelo NOME; se nada casar, a questão fica
// marcada como "não reconhecida" para revisão manual — nunca entra errada.
// ============================================================================

import { AreaItem } from '../types';

// ---- Formato esperado do arquivo (o "contrato") ----------------------------
export interface ImportedExamQuestion {
  number: number;                       // número da questão na prova
  statement: string;                    // enunciado transcrito
  areaName?: string;                    // classificação da IA (informativo)
  moduleName?: string;                  // classificação da IA (informativo)
  contentName?: string;                 // nome do conteúdo (fallback de match)
  contentId?: string;                   // id do conteúdo (match primário)
  correct: boolean | null;              // acertou (true) / errou (false) / null = ainda não informado
  officialAnswer?: string;              // gabarito (opcional)
  userAnswer?: string;                  // alternativa marcada (opcional)
  oslerTopics?: string[];               // tópicos FC Osler (opcional)
}

export interface ImportedExamFile {
  schemaVersion?: string;               // ex: "1.0"
  institution?: string;                 // ex: "FMUSP-RP"
  year?: number;                        // ex: 2026
  examType?: 'PROVA_REAL' | 'SIMULADO';
  source?: string;                      // rótulo livre (ex: "Simulado Osler 03/2026")
  questions: ImportedExamQuestion[];
}

// ---- Resultado da importação (após validar e casar) ------------------------
export interface ResolvedQuestion extends ImportedExamQuestion {
  correct: boolean;                     // NORMALIZADO: null/undefined vira true (acerto por padrão)
  resolvedContentId: string | null;     // id válido no currículo, ou null
  resolvedContentName: string | null;
  resolvedArea: string | null;
  matchType: 'id' | 'nome' | 'nenhum';  // como casou
}

export interface ImportResult {
  ok: boolean;
  error?: string;
  institution: string;
  year: number | null;
  source: string;
  questions: ResolvedQuestion[];
  totalQuestions: number;
  matched: number;                      // casados (id ou nome)
  unmatched: number;                    // não reconhecidos
  correctCount: number;
  wrongCount: number;
}

const norm = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Lê e valida o texto JSON de um arquivo importado, casando cada questão com o
 * currículo. Nunca lança para erro de conteúdo — devolve ok:false com mensagem.
 */
export function parseAndResolveExamJson(
  jsonText: string,
  curriculum: AreaItem[]
): ImportResult {
  const empty: ImportResult = {
    ok: false,
    institution: '',
    year: null,
    source: '',
    questions: [],
    totalQuestions: 0,
    matched: 0,
    unmatched: 0,
    correctCount: 0,
    wrongCount: 0,
  };

  let data: ImportedExamFile;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return { ...empty, error: 'Arquivo não é um JSON válido. Verifique se colou o conteúdo completo.' };
  }
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    return { ...empty, error: 'O JSON não tem a lista "questions" ou está vazia.' };
  }

  // índices do currículo
  const byId = new Map<string, { id: string; name: string; area: string }>();
  const byName = new Map<string, { id: string; name: string; area: string }>();
  for (const a of curriculum)
    for (const m of a.modules)
      for (const c of m.contents) {
        const rec = { id: c.id, name: c.name, area: a.name };
        byId.set(c.id, rec);
        byName.set(norm(c.name), rec);
      }

  const questions: ResolvedQuestion[] = data.questions.map((q) => {
    let resolved: { id: string; name: string; area: string } | undefined;
    let matchType: 'id' | 'nome' | 'nenhum' = 'nenhum';

    if (q.contentId && byId.has(q.contentId)) {
      resolved = byId.get(q.contentId);
      matchType = 'id';
    } else if (q.contentName && byName.has(norm(q.contentName))) {
      resolved = byName.get(norm(q.contentName));
      matchType = 'nome';
    }

    return {
      ...q,
      // Padrão otimista: se a IA não informou (null/undefined), conta como
      // ACERTO. A Leticia depois marca os erros e o motivo na tela do sistema.
      correct: q.correct === false ? false : true,
      resolvedContentId: resolved?.id ?? null,
      resolvedContentName: resolved?.name ?? null,
      resolvedArea: resolved?.area ?? null,
      matchType,
    };
  });

  const matched = questions.filter((q) => q.resolvedContentId).length;
  const correctCount = questions.filter((q) => q.correct).length;

  return {
    ok: true,
    institution: data.institution ?? '',
    year: data.year ?? null,
    source:
      data.source ??
      [data.institution, data.year].filter(Boolean).join(' ') ??
      'Prova importada',
    questions,
    totalQuestions: questions.length,
    matched,
    unmatched: questions.length - matched,
    correctCount,
    wrongCount: questions.length - correctCount,
  };
}
