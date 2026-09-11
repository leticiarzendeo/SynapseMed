import fs from 'fs';
import { AreaItem, ContentItem, ModuleItem, OslerBlock, SourceMapping } from '../src/types';

// 1. Read medwayRaw.csv
const rawCsv = fs.readFileSync('src/data/medwayRaw.csv', 'utf8').trim();
const medwayLines = rawCsv.split('\n');

interface RawMedwayRow {
  num: number;
  moduloRaw: string;
  name: string;
  videoHours: number;
  pdfTeorico: number;
  pdfPre: number;
  pdfPos: number;
}

const medwayRows: RawMedwayRow[] = [];
for (let i = 0; i < medwayLines.length; i++) {
  const line = medwayLines[i].trim();
  if (!line) continue;
  
  const parts: string[] = [];
  let inQuotes = false;
  let cur = '';
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) { parts.push(cur); cur = ''; }
    else cur += ch;
  }
  parts.push(cur);

  if (parts.length >= 7) {
    medwayRows.push({
      num: parseInt(parts[0], 10),
      moduloRaw: parts[1].trim(),
      name: parts[2].trim(),
      videoHours: parseInt(parts[3], 10) || 1,
      pdfTeorico: parseInt(parts[4], 10) || 1,
      pdfPre: parseInt(parts[5], 10) || 1,
      pdfPos: parseInt(parts[6], 10) || 1
    });
  }
}

// 2. Parse oslerMappingRaw.csv
const rawOslerCsv = fs.readFileSync('src/data/oslerMappingRaw.csv', 'utf8').trim();

function parseCSV(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) { row.push(cur); cur = ''; }
    else if ((ch === '\r' || ch === '\n') && !inQuotes) {
      if (ch === '\r' && text[i+1] === '\n') i++;
      row.push(cur); cur = '';
      if (row.length > 0 && row.some(c => c.trim() !== '')) rows.push(row);
      row = [];
    } else cur += ch;
  }
  if (cur || row.length > 0) { row.push(cur); rows.push(row); }
  return rows;
}

const oslerRows = parseCSV(rawOslerCsv).slice(1);
const oslerMapByNum = new Map<number, { rawString: string; topicsList: string[] }>();

for (const r of oslerRows) {
  const num = parseInt(r[0], 10);
  if (isNaN(num)) continue;
  const oslerRaw = (r[3] || '').trim();

  // Split topics by bullet point or newline
  const topics = oslerRaw
    .split(/[•\r\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('(Já mapeado'));

  oslerMapByNum.set(num, {
    rawString: oslerRaw,
    topicsList: topics
  });
}

console.log('Medway rows:', medwayRows.length);
console.log('Osler mapped rows:', oslerMapByNum.size);

// Map Medway line number to existing item ID (for existing rich mocks)
const numToExistingId: Record<number, string> = {
  105: 'c-icc',                  // Insuficiência cardíaca
  91: 'c-dpoc',                  // Distúrbios obstrutivos (DPOC)
  106: 'c-drc',                  // Insuficiência renal (DRC)
  114: 'c-sca',                  // Síndrome coronariana e diagnósticos diferenciais
  82: 'c-arritmias',             // Arritmias, síncope e PCR
  123: 'c-valvopatias',          // Valvopatias e cardiomiopatias
  95: 'c-endocardite',           // Endocardite e infecções da corrente sanguínea
  67: 'c-atls',                  // Abordagem Inicial (ATLS)
  184: 'c-hipertensao-gestacao', // Síndromes Hipertensivas da Gestação
  172: 'c-desenvolvimento',      // Crescimento e desenvolvimento na infância e adolescência
  223: 'c-leis-sus'              // A Evolução do SUS
};

// Module assigner
function getModuleInfo(it: RawMedwayRow) {
  const num = it.num;
  const modRaw = it.moduloRaw;

  if (modRaw === 'Imagens Radiológicas') {
    return {
      areaId: 'radiologia',
      areaName: 'Radiologia e Diagnóstico por Imagem',
      moduloId: 'mod-rad-imagens',
      moduloName: 'Imagens Radiológicas'
    };
  }

  if (modRaw === 'Radiologia e Diagnóstico por Imagem') {
    return {
      areaId: 'radiologia',
      areaName: 'Radiologia e Diagnóstico por Imagem',
      moduloId: 'mod-rad-explica',
      moduloName: 'Radiologia Explica'
    };
  }

  if (modRaw === 'Cirurgia Geral') {
    if (num >= 28 && num <= 31) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-abdome',
        moduloName: 'Abdome Agudo Cirúrgico'
      };
    }
    if ([32, 33, 47, 48, 49, 50, 51].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-vascular-toracica',
        moduloName: 'Cirurgia Vascular & Torácica'
      };
    }
    if ([37, 38, 53, 54, 55, 56, 57, 58, 59].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-aparelho-digestivo',
        moduloName: 'Aparelho Digestivo & Vias Biliares'
      };
    }
    if ([34, 35, 36, 39, 40, 41, 42, 43, 44, 45, 52].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-geral-perioperatorio',
        moduloName: 'Cirurgia Geral, Anestesia & Perioperatório'
      };
    }
    if (num >= 66 && num <= 73) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-trauma',
        moduloName: 'Trauma & Urgências Cirúrgicas'
      };
    }
    if ([46, 76, 77].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-pediatrica',
        moduloName: 'Cirurgia Pediátrica'
      };
    }
    if ([60, 61, 62, 63, 64, 65, 74, 75].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-especialidades',
        moduloName: 'Ortopedia, Urologia & Oftalmologia'
      };
    }
    return {
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduloId: 'mod-cir-geral',
      moduloName: 'Cirurgia Geral'
    };
  }

  if (modRaw === 'Clínica Médica') {
    if ([81, 94, 99, 104, 113, 122].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-cardio',
        moduloName: 'Cardiologia'
      };
    }
    if ([90, 92, 93, 110, 111].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-pneumo',
        moduloName: 'Pneumologia'
      };
    }
    if ([89, 97, 101, 105].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-nefro',
        moduloName: 'Nefrologia & Distúrbios Hidroeletrolíticos'
      };
    }
    if ([79, 85, 98, 177].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-gastro',
        moduloName: 'Gastroenterologia & Hepatologia'
      };
    }
    if ([87, 109, 114, 117].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-endocrino',
        moduloName: 'Endocrinologia & Metabologia'
      };
    }
    if ([91, 100, 102, 103, 112, 115, 119, 139, 141].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-infecto',
        moduloName: 'Infectologia'
      };
    }
    if ([80, 88, 108].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-hemato',
        moduloName: 'Hematologia & Hemoterapia'
      };
    }
    if ([82, 86, 123].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-reumato',
        moduloName: 'Reumatologia'
      };
    }
    return {
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduloId: 'mod-neuro-psic-outros',
      moduloName: 'Neurologia, Psiquiatria & Emergência'
    };
  }

  if (modRaw === 'Pediatria') {
    if (num >= 126 && num <= 137) {
      return {
        areaId: 'pediatria',
        areaName: 'Pediatria',
        moduloId: 'mod-ped-como-cai',
        moduloName: 'Como Cai na Pediatria (Bancas e Temas)'
      };
    }
    if ([158, 159, 160, 161, 162, 164].includes(num)) {
      return {
        areaId: 'pediatria',
        areaName: 'Pediatria',
        moduloId: 'mod-ped-neonatologia',
        moduloName: 'Neonatologia & Sala de Parto'
      };
    }
    if ([153, 166, 167, 171, 173, 174].includes(num)) {
      return {
        areaId: 'pediatria',
        areaName: 'Pediatria',
        moduloId: 'mod-ped-puericultura',
        moduloName: 'Puericultura & Desenvolvimento'
      };
    }
    if ([148, 149, 150, 152, 154, 155, 156, 168, 169].includes(num)) {
      return {
        areaId: 'pediatria',
        areaName: 'Pediatria',
        moduloId: 'mod-ped-infecciosas-geral',
        moduloName: 'Infectologia Pediátrica & Pediatria Geral'
      };
    }
    return {
      areaId: 'pediatria',
      areaName: 'Pediatria',
      moduloId: 'mod-ped-especialidades',
      moduloName: 'Especialidades Pediátricas'
    };
  }

  if (modRaw === 'Ginecologia e Obstetrícia') {
    if ([180, 183, 184, 185, 186, 198, 205, 206].includes(num)) {
      return {
        areaId: 'ginecologia-obstetricia',
        areaName: 'Ginecologia e Obstetrícia',
        moduloId: 'mod-go-obstetricia-prenatal',
        moduloName: 'Obstetrícia: Pré-Natal & Patologias Gestacionais'
      };
    }
    if ([200, 201, 202, 203, 204, 210, 215].includes(num)) {
      return {
        areaId: 'ginecologia-obstetricia',
        areaName: 'Ginecologia e Obstetrícia',
        moduloId: 'mod-go-obstetricia-parto',
        moduloName: 'Obstetrícia: Parto & Puerpério'
      };
    }
    if ([187, 188, 189, 190, 191, 192, 195, 207, 208, 209].includes(num)) {
      return {
        areaId: 'ginecologia-obstetricia',
        areaName: 'Ginecologia e Obstetrícia',
        moduloId: 'mod-go-ginecologia-geral',
        moduloName: 'Ginecologia Geral & Endócrina'
      };
    }
    return {
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduloId: 'mod-go-oncologia-trato-inferior',
      moduloName: 'Oncologia Ginecológica, Mastologia & Trato Inferior'
    };
  }

  if (modRaw === 'Medicina Preventiva e Social' || modRaw === 'Preventiva') {
    if ([140, 178, 217, 218, 219, 220, 225, 228].includes(num)) {
      return {
        areaId: 'preventiva',
        areaName: 'Medicina Preventiva e Social',
        moduloId: 'mod-prev-epidemiologia',
        moduloName: 'Epidemiologia & Estatística em Saúde'
      };
    }
    return {
      areaId: 'preventiva',
      areaName: 'Medicina Preventiva e Social',
      moduloId: 'mod-prev-sus-politicas',
      moduloName: 'SUS, Políticas Públicas & Bioética'
    };
  }

  return {
    areaId: 'clinica',
    areaName: 'Clínica Médica',
    moduloId: 'mod-outros',
    moduloName: 'Outros Tópicos'
  };
}

const areaDefs = [
  { id: 'clinica', name: 'Clínica Médica', icon: 'cardiology' },
  { id: 'cirurgia', name: 'Cirurgia Geral', icon: 'emergency' },
  { id: 'pediatria', name: 'Pediatria', icon: 'child_care' },
  { id: 'ginecologia-obstetricia', name: 'Ginecologia e Obstetrícia', icon: 'pregnant_woman' },
  { id: 'preventiva', name: 'Medicina Preventiva e Social', icon: 'health_and_safety' },
  { id: 'radiologia', name: 'Radiologia e Diagnóstico por Imagem', icon: 'radiology' }
];

const highIncidenceNums = new Set([
  28, 29, 31, 32, 40, 41, 42, 44, 46, 55, 59, 66, 67, 68, 69, 71, 74,
  80, 81, 82, 83, 85, 87, 88, 93, 94, 97, 99, 100, 104, 105, 111, 112, 113, 114, 117, 122, 123,
  152, 153, 155, 158, 161, 162, 164, 171, 172,
  179, 180, 181, 183, 184, 190, 194, 197, 200, 202, 204, 205, 206, 207,
  216, 217, 218, 219, 220, 222, 223, 224, 225, 226
]);

// Estado limpo para início dos estudos: nenhum conteúdo estudado previamente
const studiedNums = new Set<number>();
const consolidatedNums = new Set<number>();

const modulesMap = new Map<string, { id: string; areaId: string; name: string; contents: ContentItem[] }>();

// Catalogs to generate
const generatedOslerBlocks: OslerBlock[] = [];
const generatedSourceMappings: SourceMapping[] = [];
const blockIdSet = new Set<string>();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 45);
}

for (const it of medwayRows) {
  const modInfo = getModuleInfo(it);
  const key = `${modInfo.areaId}___${modInfo.moduloId}`;
  if (!modulesMap.has(key)) {
    modulesMap.set(key, {
      id: modInfo.moduloId,
      areaId: modInfo.areaId,
      name: modInfo.moduloName,
      contents: []
    });
  }

  const existingId = numToExistingId[it.num];
  const contentId = existingId || `c-medway-${it.num}`;

  const isHigh = highIncidenceNums.has(it.num);
  const isStud = false;
  const isCons = false;

  const preAccuracy = 0;
  const postAccuracy = 0;
  const estMastery = 0;

  // Osler topics for this row
  const oslerData = oslerMapByNum.get(it.num);
  const oslerTopicsList = oslerData ? oslerData.topicsList : [];
  const oslerTopicsStatus = oslerTopicsList.length > 0
    ? oslerTopicsList.map(t => `• ${t}`).join(' ')
    : 'a preencher';

  // Create Osler blocks and mappings for each topic
  const mappedBlockIds: string[] = [];
  if (oslerTopicsList.length > 0) {
    oslerTopicsList.forEach((topic, tIdx) => {
      const slug = slugify(topic) || `t-${it.num}-${tIdx}`;
      const blockId = `osler-${slug}`;
      mappedBlockIds.push(blockId);

      if (!blockIdSet.has(blockId)) {
        blockIdSet.add(blockId);
        
        // Estado limpo: cards existem no catálogo para estudo, mas nenhum foi revisado ainda
        const cardsTotal = 20 + ((it.num * 7 + tIdx * 11) % 25);
        const cardsFacil = 0;
        const cardsNormal = 0;
        const cardsDificil = 0;
        const cardsErros = 0;

        generatedOslerBlocks.push({
          id: blockId,
          title: topic,
          specialtyHint: modInfo.areaName,
          cardsTotal,
          cardsFacil,
          cardsNormal,
          cardsDificil: 0,
          cardsErros: 0
        });
      }

      generatedSourceMappings.push({
        id: `map-${contentId}-${tIdx}`,
        contentId: contentId,
        source: 'osler',
        oslerBlockId: blockId,
        oslerBlockTitle: topic,
        relationType: 'associado',
        createdAt: '2026-09-10'
      });
    });
  }

  const contentItem: ContentItem = {
    id: contentId,
    areaId: modInfo.areaId,
    areaName: modInfo.areaName,
    moduloId: modInfo.moduloId,
    moduloName: modInfo.moduloName,
    name: it.name,
    theoryDurationMin: it.videoHours * 60,
    theoryCompleted: false,

    medwayRowNumber: it.num,
    videoLessonsHours: it.videoHours,
    theoryPdfsCount: it.pdfTeorico,
    preExercisesPdfCount: it.pdfPre,
    postExercisesPdfCount: it.pdfPos,
    oslerTopicsStatus: oslerTopicsStatus,
    oslerTopicsList: oslerTopicsList,
    mappedOslerBlockIds: mappedBlockIds,

    preVideoQuestions: {
      totalAvailable: 10,
      completedCount: 0,
      correctCount: 0,
      accuracy: 0,
      date: undefined
    },

    postVideoQuestions: {
      totalAvailable: 15,
      completedCount: 0,
      correctCount: 0,
      accuracy: 0,
      completionRate: 0,
      date: undefined
    },

    learningGainPP: 0,

    fsrs: {
      stabilityDays: 0,
      difficulty: isHigh ? 6.8 : 5.2,
      retrievability: 0,
      lastReviewDate: undefined,
      nextReviewDate: undefined,
      reps: 0,
      state: 'novo'
    },

    examStats: {
      realExamQuestions: 0,
      realExamHits: 0,
      simuladoQuestions: 0,
      simuladoHits: 0
    },

    incidence: {
      usp: isHigh ? 4 : 1,
      unifesp: isHigh ? 4 : 2,
      ufmg: isHigh ? 3 : 1,
      unicamp: isHigh ? 3 : 1,
      enare: isHigh ? 5 : 2,
      generalRating: isHigh ? 'Muito alta' : 'Média',
      calculatedPriorityScore: isHigh ? 88 : 58
    },

    estimatedMastery: 0,
    targetMastery: 85,
    isStudied: false,
    isConsolidated: false,
    status: 'Não iniciado',
    lastStudiedDate: undefined
  };

  modulesMap.get(key)!.contents.push(contentItem);
}

// Assemble final hierarchy
const hierarchy: AreaItem[] = areaDefs.map(areaDef => {
  const mods: ModuleItem[] = [];
  for (const [key, mod] of modulesMap.entries()) {
    if (mod.areaId === areaDef.id) {
      const totalContents = mod.contents.length;
      const studiedContents = mod.contents.filter(c => c.isStudied).length;
      const consolidatedContents = mod.contents.filter(c => c.isConsolidated).length;
      const avgMastery = Math.round(
        mod.contents.reduce((sum, c) => sum + c.estimatedMastery, 0) / (totalContents || 1)
      );

      mods.push({
        ...mod,
        totalContents,
        studiedContents,
        consolidatedContents,
        avgMastery
      });
    }
  }

  const allAreaContents = mods.flatMap(m => m.contents);
  const totalContents = allAreaContents.length;
  const studiedContents = allAreaContents.filter(c => c.isStudied).length;
  const consolidatedContents = allAreaContents.filter(c => c.isConsolidated).length;
  const totalHours = Math.round(allAreaContents.reduce((sum, c) => sum + c.theoryDurationMin / 60, 0));
  const avgMastery = Math.round(
    allAreaContents.reduce((sum, c) => sum + c.estimatedMastery, 0) / (totalContents || 1)
  );

  return {
    id: areaDef.id,
    name: areaDef.name,
    icon: areaDef.icon,
    totalHours,
    totalContents,
    studiedContents,
    consolidatedContents,
    avgMastery,
    modules: mods
  };
});

console.log('Hierarchy generated. Contents with Osler topics:', 
  hierarchy.flatMap(a => a.modules.flatMap(m => m.contents)).filter(c => (c.oslerTopicsList || []).length > 0).length
);
console.log('Unique Osler Blocks created:', generatedOslerBlocks.length);
console.log('Source Mappings created:', generatedSourceMappings.length);

// Write src/data/medwayCurriculum.ts
const tsOutput = `// Currículo Oficial do Curso Medway - 236 Conteúdos Estruturados
// Mapeado com Tópicos de Flashcards correspondentes (Osler), Videoaulas (1h), PDFs Teóricos, PDF Ex. Pré e PDF Ex. Pós

import { AreaItem } from '../types';

export const medwayCurriculumHierarchy: AreaItem[] = ${JSON.stringify(hierarchy, null, 2)};
`;

fs.writeFileSync('src/data/medwayCurriculum.ts', tsOutput);
console.log('src/data/medwayCurriculum.ts successfully written!');

// Write generated Osler catalog to a dedicated data file: src/data/oslerCatalogData.ts
const oslerCatalogOutput = `// Catálogo Oficial de Blocos e Mapeamentos Osler (gerado a partir da correlação com Medway)
import { OslerBlock, SourceMapping } from '../types';

export const defaultOslerBlocks: OslerBlock[] = ${JSON.stringify(generatedOslerBlocks, null, 2)};

export const defaultSourceMappings: SourceMapping[] = ${JSON.stringify(generatedSourceMappings, null, 2)};
`;

fs.writeFileSync('src/data/oslerCatalogData.ts', oslerCatalogOutput);
console.log('src/data/oslerCatalogData.ts successfully written!');
