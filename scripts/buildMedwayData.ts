import fs from 'fs';
import { fullCurriculumHierarchy as existingHierarchy } from '../src/data/mockData';
import { AreaItem, ContentItem, ModuleItem } from '../src/types';

const rawCsv = fs.readFileSync('src/data/medwayRaw.csv', 'utf8').trim();
const lines = rawCsv.split('\n');

interface RawMedwayRow {
  num: number;
  moduloRaw: string;
  name: string;
  videoHours: number;
  pdfTeorico: number;
  pdfPre: number;
  pdfPos: number;
  osler: string;
}

const items: RawMedwayRow[] = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const parts: string[] = [];
  let inQuotes = false;
  let cur = '';
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);

  if (parts.length >= 7) {
    items.push({
      num: parseInt(parts[0], 10),
      moduloRaw: parts[1].trim(),
      name: parts[2].trim(),
      videoHours: parseInt(parts[3], 10) || 1,
      pdfTeorico: parseInt(parts[4], 10) || 1,
      pdfPre: parseInt(parts[5], 10) || 1,
      pdfPos: parseInt(parts[6], 10) || 1,
      osler: parts[7] ? parts[7].trim() : 'a preencher'
    });
  }
}

console.log('Total Medway items from CSV:', items.length);

// Extract existing rich items
const existingItemsMap = new Map<string, ContentItem>();
for (const area of existingHierarchy) {
  for (const mod of area.modules) {
    for (const c of mod.contents) {
      existingItemsMap.set(c.id, c);
    }
  }
}
console.log('Found rich items:', Array.from(existingItemsMap.keys()));

// Map Medway line number to existing item ID
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
    if (num >= 29 && num <= 32) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-abdome',
        moduloName: 'Abdome Agudo Cirúrgico'
      };
    }
    if ([33, 34, 48, 49, 50, 51, 52].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-vascular-toracica',
        moduloName: 'Cirurgia Vascular & Torácica'
      };
    }
    if ([37, 38, 39, 54, 55, 56, 57, 58, 59, 60].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-aparelho-digestivo',
        moduloName: 'Aparelho Digestivo & Vias Biliares'
      };
    }
    if ([40, 41, 42, 43, 44, 45, 46, 53, 35, 36, 138].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-geral-perioperatorio',
        moduloName: 'Cirurgia Geral, Anestesia & Perioperatório'
      };
    }
    if (num >= 67 && num <= 74) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-trauma',
        moduloName: 'Trauma & Urgências Cirúrgicas'
      };
    }
    if ([47, 77, 78].includes(num)) {
      return {
        areaId: 'cirurgia',
        areaName: 'Cirurgia Geral',
        moduloId: 'mod-cir-pediatrica',
        moduloName: 'Cirurgia Pediátrica'
      };
    }
    if ([61, 62, 63, 64, 65, 66, 75, 76].includes(num)) {
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
    if ([82, 95, 100, 105, 114, 123].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-cardio',
        moduloName: 'Cardiologia'
      };
    }
    if ([91, 93, 94, 111, 112, 120].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-pneumo',
        moduloName: 'Pneumologia'
      };
    }
    if ([90, 98, 102, 106, 122].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-nefro',
        moduloName: 'Nefrologia & Distúrbios Hidroeletrolíticos'
      };
    }
    if ([80, 86, 99, 177].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-gastro',
        moduloName: 'Gastroenterologia & Hepatologia'
      };
    }
    if ([88, 110, 115, 118].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-endocrino',
        moduloName: 'Endocrinologia & Metabologia'
      };
    }
    if ([92, 101, 103, 104, 109, 116, 139, 141].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-infecto',
        moduloName: 'Infectologia'
      };
    }
    if ([81, 89, 108].includes(num)) {
      return {
        areaId: 'clinica',
        areaName: 'Clínica Médica',
        moduloId: 'mod-hemato',
        moduloName: 'Hematologia & Hemoterapia'
      };
    }
    if ([83, 87, 124].includes(num)) {
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
    if ([153, 166, 167, 171, 172, 174, 175].includes(num)) {
      return {
        areaId: 'pediatria',
        areaName: 'Pediatria',
        moduloId: 'mod-ped-puericultura',
        moduloName: 'Puericultura & Desenvolvimento'
      };
    }
    if ([148, 149, 150, 152, 154, 155, 156, 169, 176].includes(num)) {
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
    if ([217, 218, 219, 220, 225, 228].includes(num)) {
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
  29, 31, 32, 41, 42, 45, 60, 67, 68, 69, 70,
  81, 82, 84, 86, 88, 91, 100, 101, 105, 106, 112, 113, 114, 120, 123,
  152, 153, 155, 158, 161, 164, 170, 172,
  179, 180, 181, 183, 184, 190, 194, 197, 200, 202, 205,
  216, 217, 218, 219, 220, 222, 223, 224, 225
]);

const studiedNums = new Set([
  1, 2, 3, 4,
  29, 30, 31, 41, 42, 45, 60, 67, 68, 69,
  81, 82, 84, 88, 91, 95, 100, 105, 106, 112, 114, 123,
  126, 127, 152, 153, 158, 164, 172,
  179, 180, 183, 184, 190, 194, 200, 205,
  216, 217, 218, 220, 222, 223, 224, 225,
  229, 230
]);

const consolidatedNums = new Set([
  105, 114, 67, 184, 172, 223, 42, 88, 180, 224, 153, 81
]);

const modulesMap = new Map<string, { id: string; areaId: string; name: string; contents: ContentItem[] }>();

for (const it of items) {
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
  const matchedExisting = existingId ? existingItemsMap.get(existingId) : undefined;

  if (matchedExisting) {
    // Enrich the existing item with Medway columns
    const enriched: ContentItem = {
      ...matchedExisting,
      moduloId: modInfo.moduloId,
      moduloName: modInfo.moduloName,
      medwayRowNumber: it.num,
      videoLessonsHours: it.videoHours,
      theoryDurationMin: it.videoHours * 60,
      theoryPdfsCount: it.pdfTeorico,
      preExercisesPdfCount: it.pdfPre,
      postExercisesPdfCount: it.pdfPos,
      oslerTopicsStatus: it.osler
    };
    modulesMap.get(key)!.contents.push(enriched);
  } else {
    const isHigh = highIncidenceNums.has(it.num);
    const isStud = studiedNums.has(it.num);
    const isCons = consolidatedNums.has(it.num);
    const contentId = `c-medway-${it.num}`;

    const preAccuracy = isCons ? 65 : isStud ? 55 : 45;
    const postAccuracy = isCons ? 88.5 : isStud ? 76.5 : 0;
    const estMastery = isCons ? 88 : isStud ? 74 : isHigh ? 58 : 42;

    const newItem: ContentItem = {
      id: contentId,
      areaId: modInfo.areaId,
      areaName: modInfo.areaName,
      moduloId: modInfo.moduloId,
      moduloName: modInfo.moduloName,
      name: it.name,
      theoryDurationMin: it.videoHours * 60,
      theoryCompleted: isStud,

      medwayRowNumber: it.num,
      videoLessonsHours: it.videoHours,
      theoryPdfsCount: it.pdfTeorico,
      preExercisesPdfCount: it.pdfPre,
      postExercisesPdfCount: it.pdfPos,
      oslerTopicsStatus: it.osler,

      preVideoQuestions: {
        totalAvailable: 10,
        completedCount: isStud ? 10 : 0,
        correctCount: isStud ? Math.round(10 * (preAccuracy / 100)) : 0,
        accuracy: isStud ? preAccuracy : 0,
        date: isStud ? '15/08/2026' : undefined
      },

      postVideoQuestions: {
        totalAvailable: 15,
        completedCount: isStud ? 15 : 0,
        correctCount: isStud ? Math.round(15 * (postAccuracy / 100)) : 0,
        accuracy: postAccuracy,
        completionRate: isStud ? 100 : 0,
        date: isStud ? '15/08/2026' : undefined
      },

      learningGainPP: isStud ? Number((postAccuracy - preAccuracy).toFixed(1)) : 0,

      fsrs: {
        stabilityDays: isCons ? 28 : isStud ? 12 : 3,
        difficulty: isHigh ? 6.8 : 5.2,
        retrievability: isCons ? 89 : isStud ? 74 : 50,
        lastReviewDate: isStud ? '25/08/2026' : undefined,
        nextReviewDate: isStud ? '18/09/2026' : '11/09/2026',
        reps: isCons ? 4 : isStud ? 2 : 0,
        state: isCons ? 'revisando' : isStud ? 'aprendendo' : 'novo'
      },

      examStats: {
        realExamQuestions: isHigh ? 8 : 4,
        realExamHits: isCons ? (isHigh ? 7 : 3) : isStud ? (isHigh ? 5 : 2) : 1,
        simuladoQuestions: isHigh ? 6 : 3,
        simuladoHits: isCons ? (isHigh ? 5 : 2) : isStud ? (isHigh ? 4 : 2) : 1
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

      estimatedMastery: estMastery,
      targetMastery: 85,
      isStudied: isStud,
      isConsolidated: isCons,
      status: isCons ? 'Dominado' : isStud ? 'Em consolidação' : 'Não iniciado',
      lastStudiedDate: isStud ? (isCons ? '12 dias atrás' : 'Ontem') : undefined
    };

    modulesMap.get(key)!.contents.push(newItem);
  }
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

let totalCount = 0;
for (const a of hierarchy) {
  console.log(`Área ${a.name} (${a.id}): ${a.totalContents} conteúdos, ${a.modules.length} módulos, ${a.totalHours}h video`);
  totalCount += a.totalContents;
}
console.log('Total de conteúdos da Medway gerados:', totalCount);

const tsOutput = `// Currículo Oficial do Curso Medway - 236 Conteúdos Estruturados
// Contém metadados completos: Videoaulas (1h), PDFs Teóricos, PDF Ex. Pré, PDF Ex. Pós, e Tópicos Flashcards (Osler)

import { AreaItem } from '../types';

export const medwayCurriculumHierarchy: AreaItem[] = ${JSON.stringify(hierarchy, null, 2)};
`;

fs.writeFileSync('src/data/medwayCurriculum.ts', tsOutput);
console.log('src/data/medwayCurriculum.ts gerado com sucesso!');
