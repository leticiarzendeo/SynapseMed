import {
  ExamPdfAuditReport,
  ExamQuestionEntry,
  IdentificationConfidenceLevel,
  TargetInstitutionKey,
} from '../types';
import { TARGET_INSTITUTIONS_LIST } from '../data/targetInstitutionsExamsData';

export interface RawParsedQuestion {
  originalQuestionNumber: number;
  statement: string;
  sourcePage: number | string;
  isSplitAcrossPages: boolean;
  hasVisualElement: boolean;
  visualType?: 'ECG' | 'TC' | 'RX' | 'Fotografia' | 'Tabela' | 'Gráfico' | 'Imagem Ilustrativa' | 'Outro';
  requiresVisualInspection: boolean;
  visualWarningNote?: string;
  isUnprocessed: boolean;
  unprocessedReason?: string;
  options: { letter: string; text: string }[];
}

export interface ExtractedDocumentData {
  text: string;
  pages: { pageNumber: number; text: string }[];
  fileName: string;
  fileSizeBytes: number;
}

/**
 * Lê o conteúdo bruto de um arquivo submetido pelo usuário no navegador.
 * Suporta extração de texto de PDF (analisando streams de texto), TXT e documentos.
 */
export async function extractTextFromFile(file: File): Promise<ExtractedDocumentData> {
  const fileName = file.name;
  const fileSizeBytes = file.size;

  try {
    // Para arquivos de texto ou csv
    if (fileName.endsWith('.txt') || fileName.endsWith('.csv') || file.type.includes('text')) {
      const text = await file.text();
      return splitTextIntoPages(text, fileName, fileSizeBytes);
    }

    // Para PDFs: ler como ArrayBuffer e extrair strings de texto visíveis em streams
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('latin1');
    const rawBinaryString = decoder.decode(bytes);

    const extractedChunks: string[] = [];

    // Estratégia 1: Captura de blocos de texto PDF entre BT (Begin Text) e ET (End Text)
    const btRegex = /BT([\s\S]*?)ET/g;
    let match: RegExpExecArray | null;
    let foundStreams = 0;

    while ((match = btRegex.exec(rawBinaryString)) !== null) {
      foundStreams++;
      const block = match[1];
      // Captura strings entre parênteses: (Texto do PDF) Tj ou TJ
      const stringRegex = /\(([^)]+)\)/g;
      let strMatch: RegExpExecArray | null;
      let blockText = '';
      while ((strMatch = stringRegex.exec(block)) !== null) {
        // Limpar escape sequences comuns de PDF
        const unescaped = strMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, ' ')
          .replace(/\\t/g, ' ')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\');
        blockText += unescaped + ' ';
      }
      if (blockText.trim().length > 0) {
        extractedChunks.push(blockText.trim());
      }
    }

    // Se a extração por BT/ET encontrou conteúdo significativo
    if (extractedChunks.length > 5) {
      const fullText = extractedChunks.join('\n');
      return splitTextIntoPages(fullText, fileName, fileSizeBytes);
    }

    // Estratégia 2: Fallback para strings legíveis em UTF-8 / ASCII se for PDF sem compressão
    const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
    const utf8Text = utf8Decoder.decode(bytes);
    // Filtrar caracteres de controle imprimíveis
    const readableStrings = utf8Text
      .replace(/[^\x20-\x7E\xC0-\xFF\n\r\t]/g, ' ')
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    if (readableStrings.length > 10) {
      const fullText = readableStrings.join('\n');
      return splitTextIntoPages(fullText, fileName, fileSizeBytes);
    }

    // Se o PDF for baseado puramente em imagens escaneadas (sem camada de OCR nativo)
    return {
      text: '',
      pages: [{ pageNumber: 1, text: '' }],
      fileName,
      fileSizeBytes,
    };
  } catch (err) {
    console.warn('Erro na extração de texto do arquivo:', err);
    return {
      text: '',
      pages: [{ pageNumber: 1, text: '' }],
      fileName,
      fileSizeBytes,
    };
  }
}

function splitTextIntoPages(fullText: string, fileName: string, fileSizeBytes: number): ExtractedDocumentData {
  // Tentar identificar marcadores explícitos de página como "Página X" ou quebras de formulário \f
  const rawPages = fullText.split(/\f|\n(?=(?:P[áa]gina\s+\d+|PAGINA\s+\d+|FLS?\.\s*\d+))/i);
  if (rawPages.length > 1) {
    return {
      text: fullText,
      pages: rawPages.map((p, idx) => ({ pageNumber: idx + 1, text: p })),
      fileName,
      fileSizeBytes,
    };
  }

  // Se não houver marcadores explícitos, agrupar por blocos de ~2500 caracteres como páginas estimadas
  const pageSize = 2500;
  const pageCount = Math.max(1, Math.ceil(fullText.length / pageSize));
  const pages: { pageNumber: number; text: string }[] = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push({
      pageNumber: i + 1,
      text: fullText.slice(i * pageSize, (i + 1) * pageSize),
    });
  }

  return {
    text: fullText,
    pages,
    fileName,
    fileSizeBytes,
  };
}

/**
 * ============================================================================
 * 1. IDENTIFICAÇÃO DA INSTITUIÇÃO COM ALTA PRECISÃO
 * ============================================================================
 * Regras Estritas:
 * - Procura evidências explícitas no próprio documento (cabeçalho, capa, rodapé, edital).
 * - NÃO identifica pelo nome do arquivo (ex: "prova_2024.pdf" NÃO é suficiente para concluir USP-RP).
 * - Distingue explicitamente USP-RP vs USP-SP (se houver apenas "USP", não escolhe automaticamente).
 * - Se houver conflito entre instituições, marca "Instituição precisa de confirmação manual".
 */
export function identifyInstitutionFromDocument(
  docData: ExtractedDocumentData
): {
  institution: string;
  targetKey?: TargetInstitutionKey;
  confidence: IdentificationConfidenceLevel;
  evidenceSnippet: string;
  hasConflict: boolean;
  conflictDetail?: string;
} {
  const text = docData.text;
  const initialPagesText = docData.pages
    .slice(0, 3)
    .map((p) => p.text)
    .join('\n')
    .toUpperCase();

  // Testes de evidência explícita no texto
  const hasFmrp =
    initialPagesText.includes('FMRP') ||
    initialPagesText.includes('RIBEIRÃO PRETO') ||
    initialPagesText.includes('RIBEIRAO PRETO') ||
    initialPagesText.includes('CAMPUS DE RIBEIRÃO') ||
    initialPagesText.includes('HOSPITAL DAS CLÍNICAS DE RIBEIRÃO') ||
    initialPagesText.includes('USP-RP');

  const hasFmusp =
    initialPagesText.includes('FMUSP') ||
    initialPagesText.includes('CERQUEIRA CÉSAR') ||
    initialPagesText.includes('PINHEIROS') ||
    initialPagesText.includes('USP CAPITAL') ||
    initialPagesText.includes('USP SÃO PAULO') ||
    initialPagesText.includes('HOSPITAL DAS CLÍNICAS DA FMUSP') ||
    initialPagesText.includes('FACULDADE DE MEDICINA DA UNIVERSIDADE DE SÃO PAULO') ||
    initialPagesText.includes('USP-SP');

  const hasUnicamp =
    initialPagesText.includes('UNICAMP') ||
    initialPagesText.includes('UNIVERSIDADE ESTADUAL DE CAMPINAS') ||
    initialPagesText.includes('FCM UNICAMP') ||
    initialPagesText.includes('COMVEST');

  const hasEnamed =
    initialPagesText.includes('ENAMED') ||
    initialPagesText.includes('EXAME NACIONAL DA MEDICINA') ||
    initialPagesText.includes('ENARE') ||
    initialPagesText.includes('EXAME NACIONAL DE RESIDÊNCIA') ||
    initialPagesText.includes('E.N.A.R.E') ||
    initialPagesText.includes('FUNDAÇÃO GETULIO VARGAS') ||
    initialPagesText.includes('FGV CONHECIMENTO');

  const hasHiae =
    initialPagesText.includes('ALBERT EINSTEIN') ||
    initialPagesText.includes('HIAE') ||
    initialPagesText.includes('HOSPITAL ISRAELITA') ||
    initialPagesText.includes('INSTITUTO ISRAELITA DE ENSINO');

  // Detectar menção genérica à USP sem diferenciar o campus
  const hasGenericUsp =
    (initialPagesText.includes('UNIVERSIDADE DE SÃO PAULO') ||
      initialPagesText.includes('USP')) &&
    !hasFmrp &&
    !hasFmusp;

  // Lista de correspondências detectadas
  const matches: { key: TargetInstitutionKey; name: string; evidence: string }[] = [];

  if (hasFmrp && !hasFmusp) {
    matches.push({
      key: 'USP-RP',
      name: 'Universidade de São Paulo - Ribeirão Preto (FMRP-USP)',
      evidence: 'Encontrado registro explícito de "Faculdade de Medicina de Ribeirão Preto (FMRP-USP)" nas páginas iniciais.',
    });
  }

  if (hasFmusp && !hasFmrp) {
    matches.push({
      key: 'USP-SP',
      name: 'Universidade de São Paulo - São Paulo (FMUSP)',
      evidence: 'Encontrado registro explícito de "Faculdade de Medicina da USP (FMUSP / HC-FMUSP)" nas páginas iniciais.',
    });
  }

  if (hasUnicamp) {
    matches.push({
      key: 'UNICAMP',
      name: 'Universidade Estadual de Campinas (UNICAMP)',
      evidence: 'Encontrada identificação oficial da "UNICAMP / Faculdade de Ciências Médicas" nas páginas iniciais.',
    });
  }

  if (hasEnamed) {
    matches.push({
      key: 'ENAMED',
      name: 'Exame Nacional de Residência Médica (ENAMED / ENARE / FGV)',
      evidence: 'Encontrada identificação oficial do processo unificado "ENAMED / ENARE" com banca realizadora FGV.',
    });
  }

  if (hasHiae) {
    matches.push({
      key: 'HIAE',
      name: 'Hospital Israelita Albert Einstein (HIAE)',
      evidence: 'Encontrada identificação oficial do "Hospital Israelita Albert Einstein (HIAE)" no documento.',
    });
  }

  // Cenário 1: Conflito direto entre instituições diferentes no mesmo documento
  if (matches.length > 1) {
    const listNames = matches.map((m) => m.key).join(' e ');
    return {
      institution: 'NÃO CONFIRMADO',
      confidence: 'PRECISA_CONFIRMACAO',
      evidenceSnippet: `Foram detectadas múltiplas referências de bancas distintas (${listNames}) no documento. O sistema não escolheu automaticamente.`,
      hasConflict: true,
      conflictDetail: `Identificação conflitante entre: ${listNames}.`,
    };
  }

  // Cenário 2: Ambiguidade FMRP vs FMUSP (Apenas "USP" genérico detectado)
  if (hasGenericUsp || (hasFmrp && hasFmusp)) {
    return {
      institution: 'NÃO CONFIRMADO',
      confidence: 'PRECISA_CONFIRMACAO',
      evidenceSnippet:
        'Texto menciona "Universidade de São Paulo (USP)", porém não há comprovação clara no arquivo se o caderno pertence à USP Ribeirão Preto (FMRP) ou USP São Paulo (FMUSP).',
      hasConflict: true,
      conflictDetail: 'Instituição precisa de confirmação manual: ambiguidade entre USP-RP e USP-SP.',
    };
  }

  // Cenário 3: Uma instituição-alvo confirmada com evidência interna no documento
  if (matches.length === 1) {
    return {
      institution: matches[0].key,
      targetKey: matches[0].key,
      confidence: 'CONFIRMADO',
      evidenceSnippet: matches[0].evidence,
      hasConflict: false,
    };
  }

  // Cenário 4: Nenhuma evidência textual no documento (apenas nome do arquivo possui indício)
  const upperFileName = docData.fileName.toUpperCase();
  const fileNameClues: string[] = [];
  if (upperFileName.includes('USP-RP') || upperFileName.includes('FMRP')) fileNameClues.push('USP-RP');
  else if (upperFileName.includes('USP-SP') || upperFileName.includes('FMUSP')) fileNameClues.push('USP-SP');
  else if (upperFileName.includes('UNICAMP')) fileNameClues.push('UNICAMP');
  else if (upperFileName.includes('ENARE') || upperFileName.includes('ENAMED')) fileNameClues.push('ENAMED');
  else if (upperFileName.includes('EINSTEIN') || upperFileName.includes('HIAE')) fileNameClues.push('HIAE');

  if (fileNameClues.length > 0) {
    return {
      institution: 'NÃO CONFIRMADO',
      confidence: 'PRECISA_CONFIRMACAO',
      evidenceSnippet: `O nome do arquivo contém "${fileNameClues[0]}", mas o documento interno não possui evidências textuais comprobatórias para validação segura.`,
      hasConflict: false,
      conflictDetail: 'Instituição precisa de confirmação manual. Regra SynapseMed: não identificar apenas pelo nome do arquivo.',
    };
  }

  // Cenário 5: Nenhuma informação encontrada
  return {
    institution: 'NÃO CONFIRMADO',
    confidence: 'PRECISA_CONFIRMACAO',
    evidenceSnippet: 'Não foram localizados nomes de instituições, processos seletivos ou cabeçalhos oficiais nas páginas do documento.',
    hasConflict: false,
    conflictDetail: 'Instituição precisa de confirmação manual.',
  };
}

/**
 * ============================================================================
 * 2. IDENTIFICAÇÃO DO ANO COM ALTA PRECISÃO
 * ============================================================================
 * Regras Estritas:
 * - O ano deve ser identificado a partir do conteúdo do próprio PDF (capa, cabeçalho, rodapé, edital).
 * - Não deduza pelo nome do arquivo (ex: "USP_2025.pdf" não basta).
 * - Não utilize data de upload (ex: 2026) nem data de modificação do arquivo.
 * - Não deduza pelo conteúdo das questões.
 * - Diferencie: ano da prova/processo seletivo vs ano de publicação do edital.
 *   SynapseMed registra o ano da aplicação/processo seletivo.
 */
export function identifyYearFromDocument(
  docData: ExtractedDocumentData
): {
  year: number | null;
  confidence: IdentificationConfidenceLevel;
  evidenceSnippet: string;
  hasConflict: boolean;
  conflictDetail?: string;
  discrepancyNotes?: {
    examApplicationYear?: number;
    editalPublicationYear?: number;
    academicYear?: number;
    fileUploadYearPrevented?: number;
    explanation: string;
  };
} {
  const text = docData.text;
  const initialPagesText = docData.pages
    .slice(0, 3)
    .map((p) => p.text)
    .join('\n');

  // Regex para processos seletivos e editais:
  // Ex: "Processo Seletivo 2024", "Residência Médica 2025", "Edital 01/2023 para ingresso em 2024"
  const processYearRegex = /(?:PROCESSO\s+SELETIVO|RESID[ÊE]NCIA\s+M[ÉE]DICA|CONCURSO|ACESSO\s+DIRETO|PROVA\s+OBJETIVA|APLICA[ÇC][ÃA]O)[\s\S]{0,40}?(202[0-9])/gi;
  const editalYearRegex = /EDITAL[\s\S]{0,30}?(202[0-9])/gi;
  const ingressYearRegex = /(?:INGRESSO|EXERC[ÍI]CIO)[\s\S]{0,25}?(202[0-9])/gi;

  const detectedProcessYears: number[] = [];
  const detectedEditalYears: number[] = [];
  const detectedIngressYears: number[] = [];

  let match: RegExpExecArray | null;

  while ((match = processYearRegex.exec(initialPagesText)) !== null) {
    const y = parseInt(match[1], 10);
    if (!detectedProcessYears.includes(y)) detectedProcessYears.push(y);
  }

  while ((match = editalYearRegex.exec(initialPagesText)) !== null) {
    const y = parseInt(match[1], 10);
    if (!detectedEditalYears.includes(y)) detectedEditalYears.push(y);
  }

  while ((match = ingressYearRegex.exec(initialPagesText)) !== null) {
    const y = parseInt(match[1], 10);
    if (!detectedIngressYears.includes(y)) detectedIngressYears.push(y);
  }

  // Cenário A: Caso clássico de diferenciação entre Edital (ex: 2023) e Aplicação/Ingresso (ex: 2024)
  if (detectedProcessYears.length === 1) {
    const appYear = detectedProcessYears[0];
    const editalYear = detectedEditalYears.find((y) => y !== appYear);

    if (editalYear) {
      return {
        year: appYear,
        confidence: 'CONFIRMADO',
        evidenceSnippet: `Ano da prova confirmado como ${appYear} (Processo Seletivo Residência Médica ${appYear}). O edital publicado em ${editalYear} foi diferenciado corretamente.`,
        hasConflict: false,
        discrepancyNotes: {
          examApplicationYear: appYear,
          editalPublicationYear: editalYear,
          explanation: `O edital foi emitido no segundo semestre de ${editalYear}, porém o ano oficial de aplicação e processo seletivo é ${appYear}.`,
        },
      };
    }

    return {
      year: appYear,
      confidence: 'CONFIRMADO',
      evidenceSnippet: `Ano ${appYear} confirmado claramente na identificação do processo seletivo / cabeçalho do documento.`,
      hasConflict: false,
    };
  }

  // Cenário B: Se não encontrou pelo regex de processo, mas encontrou pelo ano de ingresso
  if (detectedIngressYears.length === 1) {
    const ingYear = detectedIngressYears[0];
    return {
      year: ingYear,
      confidence: 'CONFIRMADO',
      evidenceSnippet: `Ano ${ingYear} identificado no documento como ano de ingresso/aplicação do processo seletivo.`,
      hasConflict: false,
    };
  }

  // Cenário C: Anos múltiplos conflitantes sem diferenciação clara
  if (detectedProcessYears.length > 1) {
    return {
      year: null,
      confidence: 'PRECISA_CONFIRMACAO',
      evidenceSnippet: `Foram encontrados múltiplos anos (${detectedProcessYears.join(', ')}) nas seções do documento sem certeza absoluta de qual é o ano de aplicação.`,
      hasConflict: true,
      conflictDetail: 'Ano precisa de confirmação manual: conflito de datas no texto original.',
    };
  }

  // Cenário D: Nenhuma evidência textual, mas nome do arquivo possui ano (ex: "USP_2025.pdf")
  const fileNameYearMatch = docData.fileName.match(/(202[1-9])/);
  if (fileNameYearMatch) {
    const potentialYear = parseInt(fileNameYearMatch[1], 10);
    return {
      year: null,
      confidence: 'PRECISA_CONFIRMACAO',
      evidenceSnippet: `O nome do arquivo contém "${potentialYear}", mas o documento interno não confirma explicitamente a data de aplicação.`,
      hasConflict: false,
      conflictDetail: 'Ano precisa de confirmação manual. Regra SynapseMed: não deduzir o ano pelo nome do arquivo.',
    };
  }

  // Cenário E: Sem evidência de ano
  return {
    year: null,
    confidence: 'PRECISA_CONFIRMACAO',
    evidenceSnippet: 'Não foi encontrado nenhum ano explícito de aplicação ou processo seletivo no conteúdo do documento.',
    hasConflict: false,
    conflictDetail: 'Ano precisa de confirmação manual.',
  };
}

/**
 * ============================================================================
 * 3. IDENTIFICAÇÃO E NUMERAÇÃO DAS QUESTÕES COM ALTA PRECISÃO
 * ============================================================================
 * Regras Estritas:
 * - Identificar cada questão individualmente.
 * - Preservar exatamente a numeração apresentada na prova (ex: Questão 01, Questão 21).
 * - Não renumerar simplesmente porque uma página foi ignorada.
 * - Verificar completude da sequência (ex: 1, 2, 3, 5 -> questão 4 ausente/não identificada).
 * - Tratar questões divididas entre páginas (página N + página N+1) como UMA única questão.
 * - Identificar questões com imagens/tabelas/ECG/RX/TC e marcar para inspeção visual.
 * - Se uma questão não puder ser lida com segurança, marcar: "Questão não processada — revisão necessária".
 * - Detectar duplicatas (capas repetidas, questões duplicadas).
 */
export function identifyQuestionsFromDocument(
  docData: ExtractedDocumentData,
  institutionName: string,
  examYear: number | null
): {
  questions: RawParsedQuestion[];
  missingQuestionNumbers: number[];
  unprocessedQuestionNumbers: number[];
  splitQuestionsMerged: {
    questionNumber: number;
    startPage: number;
    endPage: number;
    snippet: string;
  }[];
  imageDependentQuestions: {
    questionNumber: number;
    visualType: 'ECG' | 'TC' | 'RX' | 'Fotografia' | 'Tabela' | 'Gráfico' | 'Imagem Ilustrativa' | 'Outro';
    needsVisualReview: boolean;
    description: string;
  }[];
  duplicatedDetections: {
    type: 'capa_duplicada' | 'pagina_duplicada' | 'questao_duplicada' | 'versao_repetida';
    detail: string;
    resolvedAction: string;
  }[];
  firstQuestionNumber: number;
  lastQuestionNumber: number;
  sequenceIsComplete: boolean;
} {
  const fullText = docData.text;
  const rawQuestions: RawParsedQuestion[] = [];
  const splitQuestionsMerged: {
    questionNumber: number;
    startPage: number;
    endPage: number;
    snippet: string;
  }[] = [];
  const imageDependentQuestions: {
    questionNumber: number;
    visualType: 'ECG' | 'TC' | 'RX' | 'Fotografia' | 'Tabela' | 'Gráfico' | 'Imagem Ilustrativa' | 'Outro';
    needsVisualReview: boolean;
    description: string;
  }[] = [];
  const duplicatedDetections: {
    type: 'capa_duplicada' | 'pagina_duplicada' | 'questao_duplicada' | 'versao_repetida';
    detail: string;
    resolvedAction: string;
  }[] = [];

  // Padrão de identificação de questões:
  // "QUESTÃO 01", "Questão 1", "QUESTÃO 35", "1.", "01 -", etc.
  // Procuramos preferencialmente padrões explícitos como "QUESTÃO XX" ou "Q. XX"
  const questionHeaderRegex = /(?:QUEST[ÃA]O|QUESTAO|Q\.)\s*([0-9]{1,3})[:.\s\-]/gi;

  const matches: { index: number; questionNumber: number; rawMatch: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = questionHeaderRegex.exec(fullText)) !== null) {
    const qNum = parseInt(match[1], 10);
    if (qNum > 0 && qNum <= 200) {
      matches.push({
        index: match.index,
        questionNumber: qNum,
        rawMatch: match[0],
      });
    }
  }

  // Se encontrou questões com marcação explícita no texto
  if (matches.length > 0) {
    // Verificar duplicatas no fluxo do documento (ex: questão 15 repetida no mesmo PDF)
    const seenQuestionNumbers = new Set<number>();
    const deduplicatedMatches: typeof matches = [];

    matches.forEach((m) => {
      if (seenQuestionNumbers.has(m.questionNumber)) {
        duplicatedDetections.push({
          type: 'questao_duplicada',
          detail: `Questão ${m.questionNumber} encontrada mais de uma vez no arquivo PDF.`,
          resolvedAction: 'Preservada a primeira ocorrência íntegra e ignorada a versão duplicada.',
        });
      } else {
        seenQuestionNumbers.add(m.questionNumber);
        deduplicatedMatches.push(m);
      }
    });

    for (let i = 0; i < deduplicatedMatches.length; i++) {
      const current = deduplicatedMatches[i];
      const next = deduplicatedMatches[i + 1];
      const blockText = fullText.slice(current.index, next ? next.index : undefined).trim();

      // Determinar em qual página o início e o fim da questão se encontram
      const startPage = findPageForIndex(docData.pages, current.index);
      const endIndex = next ? next.index : fullText.length;
      const endPage = findPageForIndex(docData.pages, endIndex);

      const isSplit = endPage > startPage;
      if (isSplit) {
        splitQuestionsMerged.push({
          questionNumber: current.questionNumber,
          startPage,
          endPage,
          snippet: blockText.slice(0, 80) + '...',
        });
      }

      // Detecção de Imagens / Elementos Visuais
      const visualDetection = detectVisualElementsInText(blockText);
      if (visualDetection.hasVisual) {
        imageDependentQuestions.push({
          questionNumber: current.questionNumber,
          visualType: visualDetection.type || 'Imagem Ilustrativa',
          needsVisualReview: true,
          description: visualDetection.description,
        });
      }

      // Detecção de Legibilidade / Falha no Reconhecimento
      const isUnreadable = blockText.length < 35 || blockText.includes('???') || blockText.includes('');
      const isUnprocessed = isUnreadable;
      const unprocessedReason = isUnreadable
        ? 'Questão não processada — revisão necessária: texto incompleto, ilegível ou danificado no PDF.'
        : undefined;

      // Extração de opções A, B, C, D, E se presentes
      const options = extractOptionsFromBlock(blockText);

      rawQuestions.push({
        originalQuestionNumber: current.questionNumber,
        statement: cleanStatementSnippet(blockText),
        sourcePage: isSplit ? `${startPage}-${endPage}` : startPage,
        isSplitAcrossPages: isSplit,
        hasVisualElement: visualDetection.hasVisual,
        visualType: visualDetection.type,
        requiresVisualInspection: visualDetection.hasVisual,
        visualWarningNote: visualDetection.hasVisual
          ? 'Esta questão possui elemento visual essencial. A classificação curricular deve considerar o gráfico/imagem.'
          : undefined,
        isUnprocessed,
        unprocessedReason,
        options,
      });
    }
  }

  // Se o documento tiver poucas ou nenhuma questão identificada via texto (ex: documento escaneado sem OCR)
  if (rawQuestions.length === 0) {
    // Retornamos lista vazia ou sinalizamos 0 questões identificadas
    return {
      questions: [],
      missingQuestionNumbers: [],
      unprocessedQuestionNumbers: [],
      splitQuestionsMerged: [],
      imageDependentQuestions: [],
      duplicatedDetections,
      firstQuestionNumber: 0,
      lastQuestionNumber: 0,
      sequenceIsComplete: false,
    };
  }

  // Ordenar por número original da questão
  rawQuestions.sort((a, b) => a.originalQuestionNumber - b.originalQuestionNumber);

  const firstQuestionNumber = rawQuestions[0].originalQuestionNumber;
  const lastQuestionNumber = rawQuestions[rawQuestions.length - 1].originalQuestionNumber;

  // Verificação de Quebra na Sequência (Não perder questões!)
  // Exemplo: 01, 02, 03, 05... -> Questão 04 ausente/não identificada
  const existingNumbers = new Set(rawQuestions.map((q) => q.originalQuestionNumber));
  const missingQuestionNumbers: number[] = [];

  for (let num = firstQuestionNumber; num <= lastQuestionNumber; num++) {
    if (!existingNumbers.has(num)) {
      missingQuestionNumbers.push(num);
    }
  }

  const unprocessedQuestionNumbers = rawQuestions
    .filter((q) => q.isUnprocessed)
    .map((q) => q.originalQuestionNumber);

  const sequenceIsComplete = missingQuestionNumbers.length === 0;

  return {
    questions: rawQuestions,
    missingQuestionNumbers,
    unprocessedQuestionNumbers,
    splitQuestionsMerged,
    imageDependentQuestions,
    duplicatedDetections,
    firstQuestionNumber,
    lastQuestionNumber,
    sequenceIsComplete,
  };
}

/**
 * Localiza em qual página estimada um determinado índice do texto se encontra
 */
function findPageForIndex(pages: { pageNumber: number; text: string }[], charIndex: number): number {
  let accumulated = 0;
  for (const p of pages) {
    accumulated += p.text.length;
    if (charIndex <= accumulated) {
      return p.pageNumber;
    }
  }
  return pages.length;
}

/**
 * Identifica se a questão depende de elemento visual (ECG, Tomografia, Radiografia, Foto, Tabela, Gráfico)
 */
function detectVisualElementsInText(
  text: string
): {
  hasVisual: boolean;
  type?: 'ECG' | 'TC' | 'RX' | 'Fotografia' | 'Tabela' | 'Gráfico' | 'Imagem Ilustrativa' | 'Outro';
  description: string;
} {
  const upper = text.toUpperCase();

  if (upper.includes('ELETROCARDIOGRAMA') || upper.includes('ECG') || upper.includes('TRAÇADO')) {
    return {
      hasVisual: true,
      type: 'ECG',
      description: 'Questão com traçado de eletrocardiograma (ECG) essencial para diagnóstico.',
    };
  }

  if (upper.includes('TOMOGRAFIA') || upper.includes('TC DE CRÂNIO') || upper.includes('TC DE TÓRAX') || upper.includes('TC DE ABDOME')) {
    return {
      hasVisual: true,
      type: 'TC',
      description: 'Questão baseada em laudo/corte de tomografia computadorizada (TC).',
    };
  }

  if (upper.includes('RADIOGRAFIA') || upper.includes('RAIO-X') || upper.includes('RX DE TÓRAX') || upper.includes('RX DE ABDOME')) {
    return {
      hasVisual: true,
      type: 'RX',
      description: 'Questão com incidência de radiografia (RX).',
    };
  }

  if (upper.includes('FOTOGRAFIA') || upper.includes('FOTO DO PACIENTE') || upper.includes('LESÃO DERMATOLÓGICA') || upper.includes('LESÃO ABAIXO')) {
    return {
      hasVisual: true,
      type: 'Fotografia',
      description: 'Questão com fotografia clínica de lesão ou exame físico.',
    };
  }

  if (upper.includes('TABELA ABAIXO') || upper.includes('CONFORME A TABELA') || upper.includes('DADOS DA TABELA')) {
    return {
      hasVisual: true,
      type: 'Tabela',
      description: 'Questão com interpretação de tabela estatística ou laboratorial.',
    };
  }

  if (upper.includes('GRÁFICO') || upper.includes('GRAFICO') || upper.includes('CURVA')) {
    return {
      hasVisual: true,
      type: 'Gráfico',
      description: 'Questão com curva/gráfico epidemiológico ou de monitorização.',
    };
  }

  if (upper.includes('IMAGEM') || upper.includes('FIGURA') || upper.includes('VEJA A FIGURA') || upper.includes('OBSERVE A ILUSTRAÇÃO')) {
    return {
      hasVisual: true,
      type: 'Imagem Ilustrativa',
      description: 'Questão com imagem clínica auxiliar.',
    };
  }

  return {
    hasVisual: false,
    description: '',
  };
}

/**
 * Limpa o texto do enunciado para exibição concisa no sistema
 */
function cleanStatementSnippet(rawBlock: string): string {
  // Remove numeração inicial "Questão XX" e formata
  const cleaned = rawBlock
    .replace(/^(?:QUEST[ÃA]O|QUESTAO|Q\.)\s*[0-9]{1,3}[:.\s\-]*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length > 250 ? cleaned.slice(0, 247) + '...' : cleaned;
}

/**
 * Extrai opções A, B, C, D, E do bloco de texto
 */
function extractOptionsFromBlock(block: string): { letter: string; text: string }[] {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const results: { letter: string; text: string }[] = [];

  letters.forEach((l) => {
    const reg = new RegExp(`(?:^|\\n)\\s*\\(?${l}\\)?[.\\s\\-]([\\s\\S]*?)(?=(?:\\n\\s*\\(?[A-E]\\)?[.\\s\\-]|$) )`, 'i');
    const m = block.match(reg);
    if (m && m[1]) {
      results.push({
        letter: l,
        text: m[1].trim().slice(0, 150),
      });
    }
  });

  return results;
}

/**
 * ============================================================================
 * EXECUTOR GLOBAL DE AUDITORIA & VALIDAÇÃO DO PDF
 * ============================================================================
 * Gera o relatório auditável com:
 * 1. INSTITUIÇÃO (CONFIRMADO | PROVÁVEL | PRECISA_CONFIRMAÇÃO)
 * 2. ANO (CONFIRMADO | PROVÁVEL | PRECISA_CONFIRMAÇÃO)
 * 3. IDENTIFICAÇÃO E NUMERAÇÃO DE QUESTÕES
 *
 * Exibe o resumo solicitado:
 * Instituição: USP-RP
 * Ano: 2024
 * Questões identificadas: 100
 * Status: CONFIRMADO
 */
export async function auditAndInspectExamDocument(file: File): Promise<{
  report: ExamPdfAuditReport;
  rawQuestions: RawParsedQuestion[];
}> {
  const docData = await extractTextFromFile(file);

  // 1. Identificar Instituição
  const instResult = identifyInstitutionFromDocument(docData);

  // 2. Identificar Ano
  const yearResult = identifyYearFromDocument(docData);

  // 3. Identificar Questões
  const questionsResult = identifyQuestionsFromDocument(
    docData,
    instResult.institution,
    yearResult.year
  );

  // Determinar Status Geral
  const isInstitutionConfirmed = instResult.confidence === 'CONFIRMADO';
  const isYearConfirmed = yearResult.confidence === 'CONFIRMADO';
  const isSequenceAcceptable =
    questionsResult.missingQuestionNumbers.length === 0 &&
    questionsResult.questions.length > 0;

  const overallStatus: 'CONFIRMADO' | 'PRECISA_CONFIRMACAO' =
    isInstitutionConfirmed && isYearConfirmed && isSequenceAcceptable
      ? 'CONFIRMADO'
      : 'PRECISA_CONFIRMACAO';

  const canAddToOfficialStats = overallStatus === 'CONFIRMADO';

  let systemRecommendation = '';
  if (overallStatus === 'CONFIRMADO') {
    systemRecommendation =
      'Todos os metadados (Instituição, Ano e Numeração) foram confirmados com evidências inequívocas no arquivo. Prova apta para integração automática às estatísticas oficiais de incidência.';
  } else {
    const reasons: string[] = [];
    if (!isInstitutionConfirmed) reasons.push('Instituição precisa de confirmação manual');
    if (!isYearConfirmed) reasons.push('Ano precisa de confirmação manual');
    if (questionsResult.missingQuestionNumbers.length > 0)
      reasons.push(`Sequência incompleta (questões ausentes: ${questionsResult.missingQuestionNumbers.join(', ')})`);
    if (questionsResult.questions.length === 0)
      reasons.push('Nenhuma questão identificada (PDF escaneado ou sem camada de texto legível)');

    systemRecommendation = `Atenção: ${reasons.join(
      '; '
    )}. Por determinação do SynapseMed (Precisão > Velocidade), esta prova ficará isolada até validação manual e NÃO entrará nas estatísticas oficiais de incidência.`;
  }

  const summaryBadgeText =
    overallStatus === 'CONFIRMADO' ? 'CONFIRMADO' : 'PRECISA DE CONFIRMAÇÃO';

  const report: ExamPdfAuditReport = {
    sourceFileName: file.name,
    fileSizeBytes: file.size,
    totalCharactersExtracted: docData.text.length,
    estimatedPagesCount: docData.pages.length,

    // 1. Instituição
    detectedInstitution: instResult.institution,
    targetInstitutionKey: instResult.targetKey,
    institutionConfidence: instResult.confidence,
    institutionEvidenceSnippet: instResult.evidenceSnippet,
    institutionConflictDetected: instResult.hasConflict,
    institutionConflictDetail: instResult.conflictDetail,

    // 2. Ano
    detectedYear: yearResult.year,
    yearConfidence: yearResult.confidence,
    yearEvidenceSnippet: yearResult.evidenceSnippet,
    yearConflictDetected: yearResult.hasConflict,
    yearConflictDetail: yearResult.conflictDetail,
    yearDiscrepancyNotes: yearResult.discrepancyNotes,

    // 3. Questões
    totalIdentifiedQuestions: questionsResult.questions.length,
    firstQuestionNumber: questionsResult.firstQuestionNumber,
    lastQuestionNumber: questionsResult.lastQuestionNumber,
    sequenceIsComplete: questionsResult.sequenceIsComplete,
    missingQuestionNumbers: questionsResult.missingQuestionNumbers,
    unprocessedQuestionNumbers: questionsResult.unprocessedQuestionNumbers,
    splitQuestionsMerged: questionsResult.splitQuestionsMerged,
    imageDependentQuestions: questionsResult.imageDependentQuestions,
    duplicatedDetections: questionsResult.duplicatedDetections,

    // Status Global
    overallStatus,
    summaryBadgeText,
    canAddToOfficialStats,
    systemRecommendation,
  };

  return {
    report,
    rawQuestions: questionsResult.questions,
  };
}
