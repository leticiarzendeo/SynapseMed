// ============================================================================
// medwayCurriculum.ts — CURRÍCULO CONSOLIDADO
// ----------------------------------------------------------------------------
// Estrutura REAL: Módulo > Conteúdo > Tópicos de Flashcards (Osler).
// 5 módulos, 197 conteúdos, todos com tópicos Osler correlacionados.
//
// Fonte: planilha MAPEAMENTO_CURRÍCULO_CONSOLIDADO.xlsx (fornecida pela
// usuária), que funde o mapeamento Osler com a matriz de videoaulas/PDFs.
//
// Fidelidade aos dados:
//  - Videoaulas, PDFs teóricos e exercícios pré/pós vêm da planilha.
//  - theoryDurationMin = videoaulas x 60 min.
//  - "Preventiva" foi unificado em "Medicina Preventiva e Social".
//  - Módulos radiológicos e "Abuso de álcool, tabaco e outras substâncias"
//    foram excluídos por não terem flashcards Osler (decisão da usuária).
//  - preVideoQuestions/postVideoQuestions.totalAvailable (10/15) e os campos
//    de incidência são CONVENÇÃO do app, não vêm da planilha. Progresso
//    começa zerado.
//
// Hierarquia ACHATADA: cada módulo é o nível de topo. O campo "modules"
// existe apenas por compatibilidade de tipos e espelha o próprio módulo —
// a UI e os cálculos tratam como Módulo > Conteúdo.
// ============================================================================

import { AreaItem } from '../types';

export const medwayCurriculumHierarchy: AreaItem[] = [
  {
    "id": "mod-cirurgia-geral",
    "name": "Cirurgia Geral",
    "icon": "surgical",
    "modules": [
      {
        "id": "mod-cirurgia-geral",
        "areaId": "mod-cirurgia-geral",
        "name": "Cirurgia Geral",
        "contents": [
          {
            "id": "c-abdome-agudo-inflamatorio",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Abdome Agudo Inflamatório",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 1,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abdomem Agudo Inflamatório (Apendicite, Diverticulite, Pancreatite Aguda)• Abordagem Abdome Agudo",
            "oslerTopicsList": [
              "Abdomem Agudo Inflamatório (Apendicite, Diverticulite, Pancreatite Aguda)",
              "Abordagem Abdome Agudo"
            ],
            "mappedOslerBlockIds": [
              "osler-abdomem-agudo-inflamatorio-apendicite-diverticulite-pancreatite-aguda",
              "osler-abordagem-abdome-agudo"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-abdome-agudo-isquemico",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Abdome Agudo Isquêmico",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 2,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abdomem Agudo Vascular• Oclusão Arterial Aguda (Cirurgia Vascular)",
            "oslerTopicsList": [
              "Abdomem Agudo Vascular",
              "Oclusão Arterial Aguda (Cirurgia Vascular)"
            ],
            "mappedOslerBlockIds": [
              "osler-abdomem-agudo-vascular",
              "osler-oclusao-arterial-aguda-cirurgia-vascular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-abdome-agudo-obstrutivo",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Abdome Agudo Obstrutivo",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 3,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abdomem Agudo Obstrutivo• Corpo Estranho no Trato Gastrintestinal",
            "oslerTopicsList": [
              "Abdomem Agudo Obstrutivo",
              "Corpo Estranho no Trato Gastrintestinal"
            ],
            "mappedOslerBlockIds": [
              "osler-abdomem-agudo-obstrutivo",
              "osler-corpo-estranho-no-trato-gastrintestinal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-abdome-agudo-perfurativo",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Abdome Agudo Perfurativo",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 4,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abdomem Agudo Perfurativo• Úlcera Péptica",
            "oslerTopicsList": [
              "Abdomem Agudo Perfurativo",
              "Úlcera Péptica"
            ],
            "mappedOslerBlockIds": [
              "osler-abdomem-agudo-perfurativo",
              "osler-ulcera-peptica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doenca-arterial-periferica",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Doença Arterial Periférica",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 5,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doença Arterial Obstrutiva Periférica (Cirurgia Vascular)",
            "oslerTopicsList": [
              "Doença Arterial Obstrutiva Periférica (Cirurgia Vascular)"
            ],
            "mappedOslerBlockIds": [
              "osler-doenca-arterial-obstrutiva-periferica-cirurgia-vascular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cirurgia-cardiaca",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cirurgia Cardíaca",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 6,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cirurgia Cardíaca (Cirurgia Torácica)",
            "oslerTopicsList": [
              "Cirurgia Cardíaca (Cirurgia Torácica)"
            ],
            "mappedOslerBlockIds": [
              "osler-cirurgia-cardiaca-cirurgia-toracica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-de-cabeca-e-pescoco",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores de Cabeça e Pescoço",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 7,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer de Cabeça e Pescoço• Carcinoma de Paratireoide",
            "oslerTopicsList": [
              "Câncer de Cabeça e Pescoço",
              "Carcinoma de Paratireoide"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-de-cabeca-e-pescoco",
              "osler-carcinoma-de-paratireoide"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-outras-afeccoes-cirurgicas-de-cabeca-e-pescoco",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Outras Afecções Cirúrgicas de Cabeça e Pescoço",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 8,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Afecções da Parótida (Parotiditide)• Afecções das Glândulas Salivares• Anatomia de Cabeça e Pescoço• Crico e Traqueostomia• Nódulos Cervicais",
            "oslerTopicsList": [
              "Afecções da Parótida (Parotiditide)",
              "Afecções das Glândulas Salivares",
              "Anatomia de Cabeça e Pescoço",
              "Crico e Traqueostomia",
              "Nódulos Cervicais"
            ],
            "mappedOslerBlockIds": [
              "osler-afeccoes-da-parotida-parotiditide",
              "osler-afeccoes-das-glandulas-salivares",
              "osler-anatomia-de-cabeca-e-pescoco",
              "osler-crico-e-traqueostomia",
              "osler-nodulos-cervicais"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cirurgia-da-obesidade",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cirurgia da Obesidade",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 9,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cirurgia Bariátrica",
            "oslerTopicsList": [
              "Cirurgia Bariátrica"
            ],
            "mappedOslerBlockIds": [
              "osler-cirurgia-bariatrica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-colon-e-reto-na-cirurgia",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cólon e Reto na Cirurgia",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 10,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer Colorretal• Colonoscopia• Doença Diverticular• Neoplasias do Apêndice• Prolapso e Procidência Retal",
            "oslerTopicsList": [
              "Câncer Colorretal",
              "Colonoscopia",
              "Doença Diverticular",
              "Neoplasias do Apêndice",
              "Prolapso e Procidência Retal"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-colorretal",
              "osler-colonoscopia",
              "osler-doenca-diverticular",
              "osler-neoplasias-do-apendice",
              "osler-prolapso-e-procidencia-retal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-do-aparelho-digestivo",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores do Aparelho Digestivo",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 11,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer de Esôfago• Câncer de Estômago• Câncer de Pâncreas Exócrino• Neoplasias Císticas do Pâncreas• Tumores Neuroendócrinos",
            "oslerTopicsList": [
              "Câncer de Esôfago",
              "Câncer de Estômago",
              "Câncer de Pâncreas Exócrino",
              "Neoplasias Císticas do Pâncreas",
              "Tumores Neuroendócrinos"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-de-esofago",
              "osler-cancer-de-estomago",
              "osler-cancer-de-pancreas-exocrino",
              "osler-neoplasias-cisticas-do-pancreas",
              "osler-tumores-neuroendocrinos"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-anestesia",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Anestesia",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 12,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Anestesia Geral• Anestesia Local• Anestesia Regional• Bloqueadores Neuromusculares• Cálculo de Infusão Endovenosa• Capnografia• Hipertermia Maligna• Intubação Orotraqueal• Manejo da Dor• Monitorização Anestésica• Sedação",
            "oslerTopicsList": [
              "Anestesia Geral",
              "Anestesia Local",
              "Anestesia Regional",
              "Bloqueadores Neuromusculares",
              "Cálculo de Infusão Endovenosa",
              "Capnografia",
              "Hipertermia Maligna",
              "Intubação Orotraqueal",
              "Manejo da Dor",
              "Monitorização Anestésica",
              "Sedação"
            ],
            "mappedOslerBlockIds": [
              "osler-anestesia-geral",
              "osler-anestesia-local",
              "osler-anestesia-regional",
              "osler-bloqueadores-neuromusculares",
              "osler-calculo-de-infusao-endovenosa",
              "osler-capnografia",
              "osler-hipertermia-maligna",
              "osler-intubacao-orotraqueal",
              "osler-manejo-da-dor",
              "osler-monitorizacao-anestesica",
              "osler-sedacao"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cuidados-e-complicacoes-pos-operatorias",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cuidados e Complicações Pós-Operatórias",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 13,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Complicações Pós-Operatórias (Abscesso Intra-Abdominal, Choque Hemorrágico, Disfunções Orgânicas, Febre e Atelectasia, Fístulas, Gossipiboma, Infecção de Sítio Cirúrgico e Antibioticoprofilaxia, Profilaxia de Tromboembolismo Venoso, Seroma & Hematoma & Deiscência, Síndrome Compartimental Abdominal)",
            "oslerTopicsList": [
              "Complicações Pós-Operatórias (Abscesso Intra-Abdominal, Choque Hemorrágico, Disfunções Orgânicas, Febre e Atelectasia, Fístulas, Gossipiboma, Infecção de Sítio Cirúrgico e Antibioticoprofilaxia, Profilaxia de Tromboembolismo Venoso, Seroma & Hematoma & Deiscência, Síndrome Compartimental Abdominal)"
            ],
            "mappedOslerBlockIds": [
              "osler-complicacoes-pos-operatorias-abscesso-intra-abdominal-choque-hemorragico-disfuncoes-organicas-febre-e-atelectasia-fistulas-gossipiboma-infeccao-de-sitio-cirurgico-e-antibioticoprofilaxia-profilaxia-de-tromboembolismo-venoso-seroma-hematoma-deiscencia-sindrome-compartimental-abdominal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cuidados-pre-operatorios",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cuidados Pré-Operatórios",
            "theoryDurationMin": 600,
            "theoryCompleted": false,
            "medwayRowNumber": 14,
            "videoLessonsHours": 10,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Avaliação Pré-Operatória (Princípios de Cirurgia)",
            "oslerTopicsList": [
              "Avaliação Pré-Operatória (Princípios de Cirurgia)"
            ],
            "mappedOslerBlockIds": [
              "osler-avaliacao-pre-operatoria-principios-de-cirurgia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-feridas-enxertos-e-retalhos",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Feridas, Enxertos e Retalhos",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 15,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cicatrização e Avaliação de Feridas (Cirurgia Plástica)• Enxertos e Retalhos (Cirurgia Plástica)",
            "oslerTopicsList": [
              "Cicatrização e Avaliação de Feridas (Cirurgia Plástica)",
              "Enxertos e Retalhos (Cirurgia Plástica)"
            ],
            "mappedOslerBlockIds": [
              "osler-cicatrizacao-e-avaliacao-de-feridas-cirurgia-plastica",
              "osler-enxertos-e-retalhos-cirurgia-plastica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tecnica-operatoria",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Técnica Operatória",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 16,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Anastomoses Intestinais• Anatomia Cirúrgica• Fios & Suturas• Instrumentação Cirúrgica• Sondas & Drenos & Cateteres",
            "oslerTopicsList": [
              "Anastomoses Intestinais",
              "Anatomia Cirúrgica",
              "Fios & Suturas",
              "Instrumentação Cirúrgica",
              "Sondas & Drenos & Cateteres"
            ],
            "mappedOslerBlockIds": [
              "osler-anastomoses-intestinais",
              "osler-anatomia-cirurgica",
              "osler-fios-suturas",
              "osler-instrumentacao-cirurgica",
              "osler-sondas-drenos-cateteres"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-hernias",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Hérnias",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 17,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hérnias Inguinocrurais• Outras Hérnias",
            "oslerTopicsList": [
              "Hérnias Inguinocrurais",
              "Outras Hérnias"
            ],
            "mappedOslerBlockIds": [
              "osler-hernias-inguinocrurais",
              "osler-outras-hernias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-de-partes-moles",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores de Partes Moles",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 18,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Afecções de Partes Moles (Cirurgia Plástica)• Sarcomas (Cirurgia Plástica)",
            "oslerTopicsList": [
              "Afecções de Partes Moles (Cirurgia Plástica)",
              "Sarcomas (Cirurgia Plástica)"
            ],
            "mappedOslerBlockIds": [
              "osler-afeccoes-de-partes-moles-cirurgia-plastica",
              "osler-sarcomas-cirurgia-plastica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cirurgia-pediatrica",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cirurgia Pediátrica",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 19,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abdome Agudo Pediátrico (Adenite Mesentérica, Diagnóstico Diferencial, Divertículo de Meckel, Enterocolite Necrosante, Estenose Hipertrófica do Piloro, Intussuscepção, Volvo)• Hérnias na Infância• Malformações (Craniofaciais, do Sistema Nervoso/Mielomeningocele, Gastrointestinais, Genitourinárias, Intratorácicas)",
            "oslerTopicsList": [
              "Abdome Agudo Pediátrico (Adenite Mesentérica, Diagnóstico Diferencial, Divertículo de Meckel, Enterocolite Necrosante, Estenose Hipertrófica do Piloro, Intussuscepção, Volvo)",
              "Hérnias na Infância",
              "Malformações (Craniofaciais, do Sistema Nervoso/Mielomeningocele, Gastrointestinais, Genitourinárias, Intratorácicas)"
            ],
            "mappedOslerBlockIds": [
              "osler-abdome-agudo-pediatrico-adenite-mesenterica-diagnostico-diferencial-diverticulo-de-meckel-enterocolite-necrosante-estenose-hipertrofica-do-piloro-intussuscepcao-volvo",
              "osler-hernias-na-infancia",
              "osler-malformacoes-craniofaciais-do-sistema-nervoso-mielomeningocele-gastrointestinais-genitourinarias-intratoracicas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cirurgia-toracica",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Cirurgia Torácica",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 20,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Afecções da Parede Torácica• Anatomia Torácica• Drenagem Torácica• Estenose Traqueal• Hemoptise• Hérnia Diafragmática• Hiperidrose• Laringomalácia e Traqueomalácia• Massas Mediastinais• Mediastinite• Pneumotórax• Transplante Pulmonar",
            "oslerTopicsList": [
              "Afecções da Parede Torácica",
              "Anatomia Torácica",
              "Drenagem Torácica",
              "Estenose Traqueal",
              "Hemoptise",
              "Hérnia Diafragmática",
              "Hiperidrose",
              "Laringomalácia e Traqueomalácia",
              "Massas Mediastinais",
              "Mediastinite",
              "Pneumotórax",
              "Transplante Pulmonar"
            ],
            "mappedOslerBlockIds": [
              "osler-afeccoes-da-parede-toracica",
              "osler-anatomia-toracica",
              "osler-drenagem-toracica",
              "osler-estenose-traqueal",
              "osler-hemoptise",
              "osler-hernia-diafragmatica",
              "osler-hiperidrose",
              "osler-laringomalacia-e-traqueomalacia",
              "osler-massas-mediastinais",
              "osler-mediastinite",
              "osler-pneumotorax",
              "osler-transplante-pulmonar"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-pulmonares-e-do-mediastino",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores Pulmonares e do Mediastino",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 21,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer de Pulmão• Massas Mediastinais",
            "oslerTopicsList": [
              "Câncer de Pulmão",
              "Massas Mediastinais"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-de-pulmao",
              "osler-massas-mediastinais"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-aneurismas",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Aneurismas",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 22,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Aneurismas (Cirurgia Vascular)",
            "oslerTopicsList": [
              "Aneurismas (Cirurgia Vascular)"
            ],
            "mappedOslerBlockIds": [
              "osler-aneurismas-cirurgia-vascular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-venosas",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Doenças Venosas",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 23,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Insuficiência Venosa Crônica (Cirurgia Vascular)",
            "oslerTopicsList": [
              "Insuficiência Venosa Crônica (Cirurgia Vascular)"
            ],
            "mappedOslerBlockIds": [
              "osler-insuficiencia-venosa-cronica-cirurgia-vascular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-estenose-de-carotidas",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Estenose de Carótidas",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 24,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Estenose de Carótidas (Cirurgia Vascular)",
            "oslerTopicsList": [
              "Estenose de Carótidas (Cirurgia Vascular)"
            ],
            "mappedOslerBlockIds": [
              "osler-estenose-de-carotidas-cirurgia-vascular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-dermatologicos",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores Dermatológicos",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 25,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "(Mapear com os tópicos de Pele/Plástica disponíveis ou correlacionar com a base geral de Dermatologia)",
            "oslerTopicsList": [
              "(Mapear com os tópicos de Pele/Plástica disponíveis ou correlacionar com a base geral de Dermatologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-mapear-com-os-topicos-de-pele-plastica-disponiveis-ou-correlacionar-com-a-base-geral-de-dermatologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-afeccoes-pancreaticas",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Afecções Pancreáticas",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 26,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pâncreas (Câncer de Pâncreas Exócrino, Neoplasias Císticas)",
            "oslerTopicsList": [
              "Pâncreas (Câncer de Pâncreas Exócrino, Neoplasias Císticas)"
            ],
            "mappedOslerBlockIds": [
              "osler-pancreas-cancer-de-pancreas-exocrino-neoplasias-cisticas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doenca-inflamatoria-intestinal",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Doença Inflamatória Intestinal",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 27,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "(Abordado nos módulos de Cólon e Reto / Clínica Médica)",
            "oslerTopicsList": [
              "(Abordado nos módulos de Cólon e Reto / Clínica Médica)"
            ],
            "mappedOslerBlockIds": [
              "osler-abordado-nos-modulos-de-colon-e-reto-clinica-medica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-hemorragia-digestiva",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Hemorragia Digestiva",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 28,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abordagem Inicial da Hemorragia Digestiva• Hemorragia Digestiva Alta• Hemorragia Digestiva Baixa",
            "oslerTopicsList": [
              "Abordagem Inicial da Hemorragia Digestiva",
              "Hemorragia Digestiva Alta",
              "Hemorragia Digestiva Baixa"
            ],
            "mappedOslerBlockIds": [
              "osler-abordagem-inicial-da-hemorragia-digestiva",
              "osler-hemorragia-digestiva-alta",
              "osler-hemorragia-digestiva-baixa"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindrome-disfagica",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Síndrome Disfágica",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 29,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doença do Refluxo Gastroesofágico• Esôfago de Barrett• Divertículos Esofágicos• Lesão Cáustica Esofágica",
            "oslerTopicsList": [
              "Doença do Refluxo Gastroesofágico",
              "Esôfago de Barrett",
              "Divertículos Esofágicos",
              "Lesão Cáustica Esofágica"
            ],
            "mappedOslerBlockIds": [
              "osler-doenca-do-refluxo-gastroesofagico",
              "osler-esofago-de-barrett",
              "osler-diverticulos-esofagicos",
              "osler-lesao-caustica-esofagica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindrome-dispeptica",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Síndrome Dispéptica",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 30,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• H. Pylori• Úlcera Péptica• Hérnia de Hiato• Vôlvulo Gástrico",
            "oslerTopicsList": [
              "H. Pylori",
              "Úlcera Péptica",
              "Hérnia de Hiato",
              "Vôlvulo Gástrico"
            ],
            "mappedOslerBlockIds": [
              "osler-h-pylori",
              "osler-ulcera-peptica",
              "osler-hernia-de-hiato",
              "osler-volvulo-gastrico"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-polipose-intestinal",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Polipose Intestinal",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 31,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer Colorretal• Cólon e Reto",
            "oslerTopicsList": [
              "Câncer Colorretal",
              "Cólon e Reto"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-colorretal",
              "osler-colon-e-reto"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-afeccoes-benignas-das-vias-biliares",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Afecções Benignas das Vias Biliares",
            "theoryDurationMin": 480,
            "theoryCompleted": false,
            "medwayRowNumber": 32,
            "videoLessonsHours": 8,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer de Vesícula Biliar• Colangite Aguda• Colecistectomia• Colecistite• Coledocolitíase• Colelitíase• Íleo Biliar• Síndrome de Mirizzi• Vesícula em Porcelana",
            "oslerTopicsList": [
              "Câncer de Vesícula Biliar",
              "Colangite Aguda",
              "Colecistectomia",
              "Colecistite",
              "Coledocolitíase",
              "Colelitíase",
              "Íleo Biliar",
              "Síndrome de Mirizzi",
              "Vesícula em Porcelana"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-de-vesicula-biliar",
              "osler-colangite-aguda",
              "osler-colecistectomia",
              "osler-colecistite",
              "osler-coledocolitiase",
              "osler-colelitiase",
              "osler-ileo-biliar",
              "osler-sindrome-de-mirizzi",
              "osler-vesicula-em-porcelana"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-oftalmologia",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Oftalmologia",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 33,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tópicos de Oftalmologia da Osler (Catarata, Glaucoma, Trauma Ocular, Olho Vermelho, etc.)",
            "oslerTopicsList": [
              "Tópicos de Oftalmologia da Osler (Catarata, Glaucoma, Trauma Ocular, Olho Vermelho, etc.)"
            ],
            "mappedOslerBlockIds": [
              "osler-topicos-de-oftalmologia-da-osler-catarata-glaucoma-trauma-ocular-olho-vermelho-etc"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-fraturas-osseas",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Fraturas Ósseas",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 34,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Fraturas e Luxações (Ortopedia)• Úmero, Punho, Tornozelo, etc.",
            "oslerTopicsList": [
              "Fraturas e Luxações (Ortopedia)",
              "Úmero, Punho, Tornozelo, etc."
            ],
            "mappedOslerBlockIds": [
              "osler-fraturas-e-luxacoes-ortopedia",
              "osler-umero-punho-tornozelo-etc"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-luxacoes-e-lesoes-ligamentares",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Luxações e Lesões Ligamentares",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 35,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Fraturas e Luxações• Joelho (Lesões)• Cotovelo, Ombro, Mão",
            "oslerTopicsList": [
              "Fraturas e Luxações",
              "Joelho (Lesões)",
              "Cotovelo, Ombro, Mão"
            ],
            "mappedOslerBlockIds": [
              "osler-fraturas-e-luxacoes",
              "osler-joelho-lesoes",
              "osler-cotovelo-ombro-mao"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-ortopedia-pediatrica",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Ortopedia Pediátrica",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 36,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Ortopedia Pediátrica (Acondroplasia, Doenças da Coluna, Joelho, Pé, Quadril, Dor do Crescimento, Escoliose, Fraturas na Criança, Infecções, Pronação Dolorosa)",
            "oslerTopicsList": [
              "Ortopedia Pediátrica (Acondroplasia, Doenças da Coluna, Joelho, Pé, Quadril, Dor do Crescimento, Escoliose, Fraturas na Criança, Infecções, Pronação Dolorosa)"
            ],
            "mappedOslerBlockIds": [
              "osler-ortopedia-pediatrica-acondroplasia-doencas-da-coluna-joelho-pe-quadril-dor-do-crescimento-escoliose-fraturas-na-crianca-infeccoes-pronacao-dolorosa"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tendinite-tenossinovite-fascite-e-bursite",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tendinite, Tenossinovite, Fascite e Bursite",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 37,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Lesões Musculotendinosas (Ortopedia)",
            "oslerTopicsList": [
              "Lesões Musculotendinosas (Ortopedia)"
            ],
            "mappedOslerBlockIds": [
              "osler-lesoes-musculotendinosas-ortopedia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-ortopedicos",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores Ortopédicos",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 38,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tumores Ósseos (Traumatologia / Ortopedia)",
            "oslerTopicsList": [
              "Tumores Ósseos (Traumatologia / Ortopedia)"
            ],
            "mappedOslerBlockIds": [
              "osler-tumores-osseos-traumatologia-ortopedia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-abordagem-inicial",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Abordagem Inicial",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 39,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Avaliação Inicial do Trauma (Atendimento Pré-Hospitalar, Avaliação Primária e Secundária, Vias Aéreas)",
            "oslerTopicsList": [
              "Avaliação Inicial do Trauma (Atendimento Pré-Hospitalar, Avaliação Primária e Secundária, Vias Aéreas)"
            ],
            "mappedOslerBlockIds": [
              "osler-avaliacao-inicial-do-trauma-atendimento-pre-hospitalar-avaliacao-primaria-e-secundaria-vias-aereas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-queimaduras",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Queimaduras",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 40,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Queimaduras (Trauma)",
            "oslerTopicsList": [
              "Queimaduras (Trauma)"
            ],
            "mappedOslerBlockIds": [
              "osler-queimaduras-trauma"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trauma-abdominal",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Trauma Abdominal",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 41,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Trauma Abdominal e Pélvico (Abordagem, Contuso, Penetrante, Diafragmático, Esplênico, Hepático, Intestinal, etc.)",
            "oslerTopicsList": [
              "Trauma Abdominal e Pélvico (Abordagem, Contuso, Penetrante, Diafragmático, Esplênico, Hepático, Intestinal, etc.)"
            ],
            "mappedOslerBlockIds": [
              "osler-trauma-abdominal-e-pelvico-abordagem-contuso-penetrante-diafragmatico-esplenico-hepatico-intestinal-etc"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trauma-cranio-encefalico",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Trauma Crânio-Encefálico",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 42,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Traumatismo Cranioencefálico (Trauma)",
            "oslerTopicsList": [
              "Traumatismo Cranioencefálico (Trauma)"
            ],
            "mappedOslerBlockIds": [
              "osler-traumatismo-cranioencefalico-trauma"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trauma-de-face-e-pescoco",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Trauma de Face e Pescoço",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 43,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Trauma de Face• Trauma Cervical",
            "oslerTopicsList": [
              "Trauma de Face",
              "Trauma Cervical"
            ],
            "mappedOslerBlockIds": [
              "osler-trauma-de-face",
              "osler-trauma-cervical"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trauma-toracico",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Trauma Torácico",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 44,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Trauma Torácico",
            "oslerTopicsList": [
              "Trauma Torácico"
            ],
            "mappedOslerBlockIds": [
              "osler-trauma-toracico"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trauma-da-coluna-vertebral",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Trauma da Coluna Vertebral",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 45,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Trauma Vertebral e Raquimedular",
            "oslerTopicsList": [
              "Trauma Vertebral e Raquimedular"
            ],
            "mappedOslerBlockIds": [
              "osler-trauma-vertebral-e-raquimedular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trauma-de-membros-e-extremidades",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Trauma de Membros e Extremidades",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 46,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Trauma de Extremidades• Síndrome Compartimental",
            "oslerTopicsList": [
              "Trauma de Extremidades",
              "Síndrome Compartimental"
            ],
            "mappedOslerBlockIds": [
              "osler-trauma-de-extremidades",
              "osler-sindrome-compartimental"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-afeccoes-urologicas-benignas",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Afecções Urológicas Benignas",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 47,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hiperplasia Prostática Benigna• Nefrolitíase• Urgências Urológicas (Orquiepididimite, Retenção Urinária, Torção de Apêndice Testicular)",
            "oslerTopicsList": [
              "Hiperplasia Prostática Benigna",
              "Nefrolitíase",
              "Urgências Urológicas (Orquiepididimite, Retenção Urinária, Torção de Apêndice Testicular)"
            ],
            "mappedOslerBlockIds": [
              "osler-hiperplasia-prostatica-benigna",
              "osler-nefrolitiase",
              "osler-urgencias-urologicas-orquiepididimite-retencao-urinaria-torcao-de-apendice-testicular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-urologicos",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Tumores Urológicos",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 48,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Neoplasias Urológicas (Câncer de Bexiga, de Pênis, de Próstata, de Testículo, Cistos & Neoplasias Renais)",
            "oslerTopicsList": [
              "Neoplasias Urológicas (Câncer de Bexiga, de Pênis, de Próstata, de Testículo, Cistos & Neoplasias Renais)"
            ],
            "mappedOslerBlockIds": [
              "osler-neoplasias-urologicas-cancer-de-bexiga-de-penis-de-prostata-de-testiculo-cistos-neoplasias-renais"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-abdome-agudo-inflamatorio-na-pediatria",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Abdome Agudo Inflamatório na Pediatria",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 49,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cirurgia Pediátrica / Abdome Agudo Pediátrico",
            "oslerTopicsList": [
              "Cirurgia Pediátrica / Abdome Agudo Pediátrico"
            ],
            "mappedOslerBlockIds": [
              "osler-cirurgia-pediatrica-abdome-agudo-pediatrico"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-queimaduras-na-pediatria",
            "areaId": "mod-cirurgia-geral",
            "areaName": "Cirurgia Geral",
            "moduloId": "mod-cirurgia-geral",
            "moduloName": "Cirurgia Geral",
            "name": "Queimaduras na Pediatria",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 50,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 2,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Queimaduras / Trauma na Criança",
            "oslerTopicsList": [
              "Queimaduras / Trauma na Criança"
            ],
            "mappedOslerBlockIds": [
              "osler-queimaduras-trauma-na-crianca"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          }
        ],
        "totalContents": 50,
        "studiedContents": 0,
        "consolidatedContents": 0,
        "avgMastery": 0
      }
    ],
    "totalContents": 50,
    "studiedContents": 0,
    "consolidatedContents": 0,
    "avgMastery": 0,
    "totalHours": 175
  },
  {
    "id": "mod-clinica-medica",
    "name": "Clínica Médica",
    "icon": "stethoscope",
    "modules": [
      {
        "id": "mod-clinica-medica",
        "areaId": "mod-clinica-medica",
        "name": "Clínica Médica",
        "contents": [
          {
            "id": "c-afeccoes-benignas-das-vias-biliares-2",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Afecções benignas das vias biliares",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 51,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doenças das Vias Biliares / Aparelho Digestivo",
            "oslerTopicsList": [
              "Doenças das Vias Biliares / Aparelho Digestivo"
            ],
            "mappedOslerBlockIds": [
              "osler-doencas-das-vias-biliares-aparelho-digestivo"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-anemia-e-hemoglobinopatias",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Anemia e hemoglobinopatias",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 52,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Anemias (Anemia Aplásica, Anemia da Doença Crônica, Anemia Ferropriva, Anemia Megaloblástica, Anemias Autoimunes, Deficiência de G6PD, Esferocitose Hereditária)• Hemoglobinopatias (Doença Falciforme, Talassemias)",
            "oslerTopicsList": [
              "Anemias (Anemia Aplásica, Anemia da Doença Crônica, Anemia Ferropriva, Anemia Megaloblástica, Anemias Autoimunes, Deficiência de G6PD, Esferocitose Hereditária)",
              "Hemoglobinopatias (Doença Falciforme, Talassemias)"
            ],
            "mappedOslerBlockIds": [
              "osler-anemias-anemia-aplasica-anemia-da-doenca-cronica-anemia-ferropriva-anemia-megaloblastica-anemias-autoimunes-deficiencia-de-g6pd-esferocitose-hereditaria",
              "osler-hemoglobinopatias-doenca-falciforme-talassemias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-arritmias-sincope-e-pcr",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Arritmias, síncope e PCR",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 53,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Distúrbios do Ritmo (Abordagem da Síncope, ACLS, Bradiarritmias, Fibrilação Atrial, Flutter Atrial, Taquiarritmias)",
            "oslerTopicsList": [
              "Distúrbios do Ritmo (Abordagem da Síncope, ACLS, Bradiarritmias, Fibrilação Atrial, Flutter Atrial, Taquiarritmias)"
            ],
            "mappedOslerBlockIds": [
              "osler-disturbios-do-ritmo-abordagem-da-sincope-acls-bradiarritmias-fibrilacao-atrial-flutter-atrial-taquiarritmias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-artrites-e-diagnosticos-diferenciais",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Artrites e diagnósticos diferenciais",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 54,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Artritopatias / Artropatias (Artrite Psoriásica, Artrite Reativa, Artrite Reumatoide, Diagnóstico Diferencial das Artrites, Espondiloartrites, Gota, Osteoartrite)",
            "oslerTopicsList": [
              "Artritopatias / Artropatias (Artrite Psoriásica, Artrite Reativa, Artrite Reumatoide, Diagnóstico Diferencial das Artrites, Espondiloartrites, Gota, Osteoartrite)"
            ],
            "mappedOslerBlockIds": [
              "osler-artritopatias-artropatias-artrite-psoriasica-artrite-reativa-artrite-reumatoide-diagnostico-diferencial-das-artrites-espondiloartrites-gota-osteoartrite"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-avc",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "AVC",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 55,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• AVC (Acidente Isquêmico Transitório, Avaliação Inicial, AVC Hemorrágico, AVC Isquêmico, Hemorragia Subaracnoidea, Trombose Venosa Cerebral)",
            "oslerTopicsList": [
              "AVC (Acidente Isquêmico Transitório, Avaliação Inicial, AVC Hemorrágico, AVC Isquêmico, Hemorragia Subaracnoidea, Trombose Venosa Cerebral)"
            ],
            "mappedOslerBlockIds": [
              "osler-avc-acidente-isquemico-transitorio-avaliacao-inicial-avc-hemorragico-avc-isquemico-hemorragia-subaracnoidea-trombose-venosa-cerebral"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cefaleias",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Cefaleias",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 56,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cefaleias (Neurologia)",
            "oslerTopicsList": [
              "Cefaleias (Neurologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-cefaleias-neurologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cirrose-insuficiencia-hepatica-e-complicacoes",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Cirrose, insuficiência hepática e complicações",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 57,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cirrose (Hepatologia)• Insuficiência Hepática – Complicações (Ascite, Encefalopatia Hepática, Hidrotórax Hepático, Hipertensão Portal, Peritonite Bacteriana Espontânea/Secundária, Síndrome Hepatorrenal)",
            "oslerTopicsList": [
              "Cirrose (Hepatologia)",
              "Insuficiência Hepática – Complicações (Ascite, Encefalopatia Hepática, Hidrotórax Hepático, Hipertensão Portal, Peritonite Bacteriana Espontânea/Secundária, Síndrome Hepatorrenal)"
            ],
            "mappedOslerBlockIds": [
              "osler-cirrose-hepatologia",
              "osler-insuficiencia-hepatica-complicacoes-ascite-encefalopatia-hepatica-hidrotorax-hepatico-hipertensao-portal-peritonite-bacteriana-espontanea-secundaria-sindrome-hepatorrenal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-colagenoses-e-miopatias",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Colagenoses e miopatias",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 58,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doença de Sjögren• Esclerose Sistêmica• Lúpus Eritematoso Sistêmico• Miopatias (Dermatomiosite e Polimiosite, Miosite por Corpúsculos de Inclusão, Miosite Viral Aguda, Síndrome Antissintetase)• Outras Colagenoses (Doença Mista do Tecido Conjuntivo, Policondrite Recidivante, Síndrome do Anticorpo Antifosfolipide)",
            "oslerTopicsList": [
              "Doença de Sjögren",
              "Esclerose Sistêmica",
              "Lúpus Eritematoso Sistêmico",
              "Miopatias (Dermatomiosite e Polimiosite, Miosite por Corpúsculos de Inclusão, Miosite Viral Aguda, Síndrome Antissintetase)",
              "Outras Colagenoses (Doença Mista do Tecido Conjuntivo, Policondrite Recidivante, Síndrome do Anticorpo Antifosfolipide)"
            ],
            "mappedOslerBlockIds": [
              "osler-doenca-de-sjogren",
              "osler-esclerose-sistemica",
              "osler-lupus-eritematoso-sistemico",
              "osler-miopatias-dermatomiosite-e-polimiosite-miosite-por-corpusculos-de-inclusao-miosite-viral-aguda-sindrome-antissintetase",
              "osler-outras-colagenoses-doenca-mista-do-tecido-conjuntivo-policondrite-recidivante-sindrome-do-anticorpo-antifosfolipide"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-diabetes",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Diabetes",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 59,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Diabetes Mellitus (Cetoacidose Diabética, Complicações Crônicas, Diabetes Monogênico, DM1, DM2 - Clínica, Insulina e Tratamento, Doença Renal, Hipoglicemia, Pé Diabético, Pré-Diabetes)",
            "oslerTopicsList": [
              "Diabetes Mellitus (Cetoacidose Diabética, Complicações Crônicas, Diabetes Monogênico, DM1, DM2 - Clínica, Insulina e Tratamento, Doença Renal, Hipoglicemia, Pé Diabético, Pré-Diabetes)"
            ],
            "mappedOslerBlockIds": [
              "osler-diabetes-mellitus-cetoacidose-diabetica-complicacoes-cronicas-diabetes-monogenico-dm1-dm2-clinica-insulina-e-tratamento-doenca-renal-hipoglicemia-pe-diabetico-pre-diabetes"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disturbios-da-hemostasia-desordens-tromboticas-e-transfusao-de-hemocomponentes",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Distúrbios da hemostasia, desordens trombóticas e transfusão de hemocomponentes",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 60,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Distúrbios da Hemostasia (Anticoagulação e Reversão, von Willebrand, Hemofilias, PTI, PTT, TVP)• Reações Transfusion Quais• Hemoterapia",
            "oslerTopicsList": [
              "Distúrbios da Hemostasia (Anticoagulação e Reversão, von Willebrand, Hemofilias, PTI, PTT, TVP)",
              "Reações Transfusion Quais",
              "Hemoterapia"
            ],
            "mappedOslerBlockIds": [
              "osler-disturbios-da-hemostasia-anticoagulacao-e-reversao-von-willebrand-hemofilias-pti-ptt-tvp",
              "osler-reacoes-transfusion-quais",
              "osler-hemoterapia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disturbios-hidroeletroliticos-e-acidos-basicos",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Distúrbios hidroeletrolíticos e ácidos básicos",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 61,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Distúrbios do Equilíbrio Ácido-Básico (Acidose/Alcalose Metabólica e Respiratória, Distúrbios Mistos)• Distúrbios Hidroeletrolíticos (Distúrbios do Potássio, do Sódio - Hipernatremia e Hiponatremia)",
            "oslerTopicsList": [
              "Distúrbios do Equilíbrio Ácido-Básico (Acidose/Alcalose Metabólica e Respiratória, Distúrbios Mistos)",
              "Distúrbios Hidroeletrolíticos (Distúrbios do Potássio, do Sódio - Hipernatremia e Hiponatremia)"
            ],
            "mappedOslerBlockIds": [
              "osler-disturbios-do-equilibrio-acido-basico-acidose-alcalose-metabolica-e-respiratoria-disturbios-mistos",
              "osler-disturbios-hidroeletroliticos-disturbios-do-potassio-do-sodio-hipernatremia-e-hiponatremia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disturbios-obstrutivos",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Distúrbios obstrutivos",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 62,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "(Pneumologia / Cardiologia)",
            "oslerTopicsList": [
              "(Pneumologia / Cardiologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-pneumologia-cardiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-infectoparasitarias-com-acometimento-dermatologico",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Doenças infectoparasitárias com acometimento dermatológico",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 63,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Dermatoses Infecciosas (Bacterianas, Fúngicas, Parasitárias, Virais) / Hanseníase",
            "oslerTopicsList": [
              "Dermatoses Infecciosas (Bacterianas, Fúngicas, Parasitárias, Virais) / Hanseníase"
            ],
            "mappedOslerBlockIds": [
              "osler-dermatoses-infecciosas-bacterianas-fungicas-parasitarias-virais-hanseniase"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-pulmonares-intersticiais",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Doenças pulmonares intersticiais",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 64,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doenças Pulmonares Intersticiais (Pneumologia)",
            "oslerTopicsList": [
              "Doenças Pulmonares Intersticiais (Pneumologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-doencas-pulmonares-intersticiais-pneumologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-embolia-pulmonar-e-hipertensao-pulmonar",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Embolia pulmonar e hipertensão pulmonar",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 65,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tromboembolismo Pulmonar (Pneumologia)• Hipertensão Pulmonar (Pneumologia)",
            "oslerTopicsList": [
              "Tromboembolismo Pulmonar (Pneumologia)",
              "Hipertensão Pulmonar (Pneumologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-tromboembolismo-pulmonar-pneumologia",
              "osler-hipertensao-pulmonar-pneumologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-endocardite-e-infeccoes-da-corrente-sanguinea",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Endocardite e infecções da corrente sanguínea",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 66,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Endocardite Infecciosa (Valvopatias / Cardiologia)• Infecções Nosocomiais (Infecção de Corrente Sanguínea Associada a Cateter)",
            "oslerTopicsList": [
              "Endocardite Infecciosa (Valvopatias / Cardiologia)",
              "Infecções Nosocomiais (Infecção de Corrente Sanguínea Associada a Cateter)"
            ],
            "mappedOslerBlockIds": [
              "osler-endocardite-infecciosa-valvopatias-cardiologia",
              "osler-infeccoes-nosocomiais-infeccao-de-corrente-sanguinea-associada-a-cateter"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-farmacodermias-e-dermatoses",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Farmacodermias e dermatoses",
            "theoryDurationMin": 540,
            "theoryCompleted": false,
            "medwayRowNumber": 67,
            "videoLessonsHours": 9,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Dermatologia (Farmacodermias, Dermatites Eczematosas, Dermatoses Infecciosas, Papuloescamosas, Vesicobolhosas)",
            "oslerTopicsList": [
              "Dermatologia (Farmacodermias, Dermatites Eczematosas, Dermatoses Infecciosas, Papuloescamosas, Vesicobolhosas)"
            ],
            "mappedOslerBlockIds": [
              "osler-dermatologia-farmacodermias-dermatites-eczematosas-dermatoses-infecciosas-papuloescamosas-vesicobolhosas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-geriatria-e-demencias",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Geriatria e demências",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 68,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Geriatria (Atendimento ao Idoso Vítima de Violência, Avaliação Multidimensional, Cuidados Paliativos, Delirium, Depressão no Idoso, Fisiologia do Envelhecimento, Idoso Frágil & Polifarmácia, Prevenção de Quedas)• Síndromes Demenciais (Doença de Alzheimer, Demência Frontotemporal, Demência por Corpos de Lewy, Demência Vascular)",
            "oslerTopicsList": [
              "Geriatria (Atendimento ao Idoso Vítima de Violência, Avaliação Multidimensional, Cuidados Paliativos, Delirium, Depressão no Idoso, Fisiologia do Envelhecimento, Idoso Frágil & Polifarmácia, Prevenção de Quedas)",
              "Síndromes Demenciais (Doença de Alzheimer, Demência Frontotemporal, Demência por Corpos de Lewy, Demência Vascular)"
            ],
            "mappedOslerBlockIds": [
              "osler-geriatria-atendimento-ao-idoso-vitima-de-violencia-avaliacao-multidimensional-cuidados-paliativos-delirium-depressao-no-idoso-fisiologia-do-envelhecimento-idoso-fragil-polifarmacia-prevencao-de-quedas",
              "osler-sindromes-demenciais-doenca-de-alzheimer-demencia-frontotemporal-demencia-por-corpos-de-lewy-demencia-vascular"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-glomerulopatias-e-tubulopatias",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Glomerulopatias e tubulopatias",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 69,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doenças Túbulo-Intersticiais (Tubulopatias)• Glomerulopatias (Biopsia, Doença de Alport, Doença de Lesões Mínimas, GESF, GNMP, GNPE, GNRP, Nefrite Lúpica, Nefropatia Membranosa, Nefropatia por IgA, Síndrome Nefrítica, Síndrome Nefrótica)",
            "oslerTopicsList": [
              "Doenças Túbulo-Intersticiais (Tubulopatias)",
              "Glomerulopatias (Biopsia, Doença de Alport, Doença de Lesões Mínimas, GESF, GNMP, GNPE, GNRP, Nefrite Lúpica, Nefropatia Membranosa, Nefropatia por IgA, Síndrome Nefrítica, Síndrome Nefrótica)"
            ],
            "mappedOslerBlockIds": [
              "osler-doencas-tubulo-intersticiais-tubulopatias",
              "osler-glomerulopatias-biopsia-doenca-de-alport-doenca-de-lesoes-minimas-gesf-gnmp-gnpe-gnrp-nefrite-lupica-nefropatia-membranosa-nefropatia-por-iga-sindrome-nefritica-sindrome-nefrotica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-hepatite-e-doencas-do-metabolismo-da-bilirrubina",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Hepatite e doenças do metabolismo da bilirrubina",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 70,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hepatites Virais (Hepatite A, B, C, D, E)• Metabolismo da Bilirrubina & Icterícias não-obstrutivas• Outras Hepatpatias (Hepatite Alcoólica, Autoimune, Medicamentosa)",
            "oslerTopicsList": [
              "Hepatites Virais (Hepatite A, B, C, D, E)",
              "Metabolismo da Bilirrubina & Icterícias não-obstrutivas",
              "Outras Hepatpatias (Hepatite Alcoólica, Autoimune, Medicamentosa)"
            ],
            "mappedOslerBlockIds": [
              "osler-hepatites-virais-hepatite-a-b-c-d-e",
              "osler-metabolismo-da-bilirrubina-ictericias-nao-obstrutivas",
              "osler-outras-hepatpatias-hepatite-alcoolica-autoimune-medicamentosa"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-hipertensao-arterial-sistemica",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Hipertensão arterial sistêmica",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 71,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hipertensão Arterial Sistêmica (Feocromocitoma & Paraganglioma, Urgências e Emergências, HAS Secundária, HAS no Adulto, HAS Resistente e Refratária, Tratamento)",
            "oslerTopicsList": [
              "Hipertensão Arterial Sistêmica (Feocromocitoma & Paraganglioma, Urgências e Emergências, HAS Secundária, HAS no Adulto, HAS Resistente e Refratária, Tratamento)"
            ],
            "mappedOslerBlockIds": [
              "osler-hipertensao-arterial-sistemica-feocromocitoma-paraganglioma-urgencias-e-emergencias-has-secundaria-has-no-adulto-has-resistente-e-refrataria-tratamento"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-hiv-e-aids-no-adulto-nao-gestante",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "HIV e AIDS no adulto não gestante",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 72,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• HIV e Aids (AIDS e Profilaxia de Oportunistas, Epidemiologia, Clínica & Diagnóstico, Manejo, PEP e PrEP)",
            "oslerTopicsList": [
              "HIV e Aids (AIDS e Profilaxia de Oportunistas, Epidemiologia, Clínica & Diagnóstico, Manejo, PEP e PrEP)"
            ],
            "mappedOslerBlockIds": [
              "osler-hiv-e-aids-aids-e-profilaxia-de-oportunistas-epidemiologia-clinica-diagnostico-manejo-pep-e-prep"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-infeccao-do-trato-urinario",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Infecção do trato urinário",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 73,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecção do Trato Urinário",
            "oslerTopicsList": [
              "Infecção do Trato Urinário"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccao-do-trato-urinario"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-infeccoes-do-sistema-nervoso-central",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Infecções do sistema nervoso central",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 74,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções do Sistema Nervoso Central (Abscesso Cerebral, Encefalite Herpética e Viral, Meningite Tuberculosa, Meningites em Adultos, Neurossífilis, Raiva Humana)",
            "oslerTopicsList": [
              "Infecções do Sistema Nervoso Central (Abscesso Cerebral, Encefalite Herpética e Viral, Meningite Tuberculosa, Meningites em Adultos, Neurossífilis, Raiva Humana)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-do-sistema-nervoso-central-abscesso-cerebral-encefalite-herpetica-e-viral-meningite-tuberculosa-meningites-em-adultos-neurossifilis-raiva-humana"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-infeccoes-fungicas",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Infecções fúngicas",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 75,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções Fúngicas (Aspergilose, Candidíase, Criptococose, Esporotricose, Histoplasmose, Mucormicose, Paracoccidioidomicose, Pneumocistose)",
            "oslerTopicsList": [
              "Infecções Fúngicas (Aspergilose, Candidíase, Criptococose, Esporotricose, Histoplasmose, Mucormicose, Paracoccidioidomicose, Pneumocistose)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-fungicas-aspergilose-candidiase-criptococose-esporotricose-histoplasmose-mucormicose-paracoccidioidomicose-pneumocistose"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-insuficiencia-cardiaca",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Insuficiência cardíaca",
            "theoryDurationMin": 600,
            "theoryCompleted": false,
            "medwayRowNumber": 76,
            "videoLessonsHours": 10,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Insuficiência Cardíaca (IC Ambulatorial, IC Descompensada, Síndrome Cardiorrenal, Transplante Cardíaco)",
            "oslerTopicsList": [
              "Insuficiência Cardíaca (IC Ambulatorial, IC Descompensada, Síndrome Cardiorrenal, Transplante Cardíaco)"
            ],
            "mappedOslerBlockIds": [
              "osler-insuficiencia-cardiaca-ic-ambulatorial-ic-descompensada-sindrome-cardiorrenal-transplante-cardiaco"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-insuficiencia-renal",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Insuficiência renal",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 77,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Insuficiência Renal (Diálise, Doença Renal Crônica, Injúria Renal Aguda)",
            "oslerTopicsList": [
              "Insuficiência Renal (Diálise, Doença Renal Crônica, Injúria Renal Aguda)"
            ],
            "mappedOslerBlockIds": [
              "osler-insuficiencia-renal-dialise-doenca-renal-cronica-injuria-renal-aguda"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-intoxicacoes-exogenas-e-acidentes-por-animais-peconhentos",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Intoxicações exógenas e acidentes por animais peçonhentos",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 78,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "(Já mapeado na parte anterior)",
            "oslerTopicsList": [
              "(Já mapeado na parte anterior)"
            ],
            "mappedOslerBlockIds": [
              "osler-ja-mapeado-na-parte-anterior"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-oncohematologia",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Oncohematologia",
            "theoryDurationMin": 540,
            "theoryCompleted": false,
            "medwayRowNumber": 79,
            "videoLessonsHours": 9,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Oncohematologia (Amiloidose, Emergências Oncológicas, Leucemias, Linfomas, Mieloma Múltiplo, Síndromes Mielodisplásicas e Mieloproliferativas, Policitemia Vera)",
            "oslerTopicsList": [
              "Oncohematologia (Amiloidose, Emergências Oncológicas, Leucemias, Linfomas, Mieloma Múltiplo, Síndromes Mielodisplásicas e Mieloproliferativas, Policitemia Vera)"
            ],
            "mappedOslerBlockIds": [
              "osler-oncohematologia-amiloidose-emergencias-oncologicas-leucemias-linfomas-mieloma-multiplo-sindromes-mielodisplasicas-e-mieloproliferativas-policitemia-vera"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-parasitoses",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Parasitoses",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 80,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Parasitoses / Doenças Infecciosas",
            "oslerTopicsList": [
              "Parasitoses / Doenças Infecciosas"
            ],
            "mappedOslerBlockIds": [
              "osler-parasitoses-doencas-infecciosas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-paratireoide-suprarrenal-e-outras-sindromes-endocrinas",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Paratireoide, suprarrenal e outras síndromes endócrinas",
            "theoryDurationMin": 480,
            "theoryCompleted": false,
            "medwayRowNumber": 81,
            "videoLessonsHours": 8,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Adrenal (Distúrbios da Aldosterona e do Cortisol, Tumores Adrenais)• Paratireoide e Metabolismo Ósseo (Distúrbios do Cálcio e da Vitamina D, Hiperparatireoidismo, Osteoporose)",
            "oslerTopicsList": [
              "Adrenal (Distúrbios da Aldosterona e do Cortisol, Tumores Adrenais)",
              "Paratireoide e Metabolismo Ósseo (Distúrbios do Cálcio e da Vitamina D, Hiperparatireoidismo, Osteoporose)"
            ],
            "mappedOslerBlockIds": [
              "osler-adrenal-disturbios-da-aldosterona-e-do-cortisol-tumores-adrenais",
              "osler-paratireoide-e-metabolismo-osseo-disturbios-do-calcio-e-da-vitamina-d-hiperparatireoidismo-osteoporose"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-pneumointensivismo",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Pneumointensivismo",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 82,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Ventilação Mecânica (Pneumologia)• Síndrome do Desconforto Respiratório Agudo (SDRA)",
            "oslerTopicsList": [
              "Ventilação Mecânica (Pneumologia)",
              "Síndrome do Desconforto Respiratório Agudo (SDRA)"
            ],
            "mappedOslerBlockIds": [
              "osler-ventilacao-mecanica-pneumologia",
              "osler-sindrome-do-desconforto-respiratorio-agudo-sdra"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-pneumonias-e-sindromes-gripais",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Pneumonias e síndromes gripais",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 83,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pneumonia (Abscesso Pulmonar, PAC, Pneumonia Associada a Cuidados de Saúde, Pneumonite Aspirativa)• Infecções Respiratórias (COVID-19, Síndrome Gripal & SRAG)",
            "oslerTopicsList": [
              "Pneumonia (Abscesso Pulmonar, PAC, Pneumonia Associada a Cuidados de Saúde, Pneumonite Aspirativa)",
              "Infecções Respiratórias (COVID-19, Síndrome Gripal & SRAG)"
            ],
            "mappedOslerBlockIds": [
              "osler-pneumonia-abscesso-pulmonar-pac-pneumonia-associada-a-cuidados-de-saude-pneumonite-aspirativa",
              "osler-infeccoes-respiratorias-covid-19-sindrome-gripal-srag"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sepse-choque-septico-e-outros-tipos-de-choque",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Sepse, choque séptico e outros tipos de choque",
            "theoryDurationMin": 540,
            "theoryCompleted": false,
            "medwayRowNumber": 84,
            "videoLessonsHours": 9,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Sepse e Choque Séptico (Infectologia)• Choque Cardiogênico / Classificação e Hemodinâmica do Choque (Cardiologia)",
            "oslerTopicsList": [
              "Sepse e Choque Séptico (Infectologia)",
              "Choque Cardiogênico / Classificação e Hemodinâmica do Choque (Cardiologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-sepse-e-choque-septico-infectologia",
              "osler-choque-cardiogenico-classificacao-e-hemodinamica-do-choque-cardiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindrome-coronariana-e-diagnosticos-diferenciais",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Síndrome coronariana e diagnósticos diferenciais",
            "theoryDurationMin": 540,
            "theoryCompleted": false,
            "medwayRowNumber": 85,
            "videoLessonsHours": 9,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Síndrome Coronariana Aguda (Cardiologia)• Síndrome Coronariana Crônica (Cardiologia)• Diagnóstico Diferencial da Dor Torácica (Cardiologia)",
            "oslerTopicsList": [
              "Síndrome Coronariana Aguda (Cardiologia)",
              "Síndrome Coronariana Crônica (Cardiologia)",
              "Diagnóstico Diferencial da Dor Torácica (Cardiologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-sindrome-coronariana-aguda-cardiologia",
              "osler-sindrome-coronariana-cronica-cardiologia",
              "osler-diagnostico-diferencial-da-dor-toracica-cardiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindrome-metabolica-e-dislipidemia",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Síndrome metabólica e dislipidemia",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 86,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Dislipidemia (Cardiologia)• Obesidade e Síndrome Metabólica (Endocrinologia)",
            "oslerTopicsList": [
              "Dislipidemia (Cardiologia)",
              "Obesidade e Síndrome Metabólica (Endocrinologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-dislipidemia-cardiologia",
              "osler-obesidade-e-sindrome-metabolica-endocrinologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindromes-febris",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Síndromes febris",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 87,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Síndromes Febris (Brucelose, Doença de Lyme, Febre Maculosa, Febre Tifoide, Leptospirose, Toxoplasmose)",
            "oslerTopicsList": [
              "Síndromes Febris (Brucelose, Doença de Lyme, Febre Maculosa, Febre Tifoide, Leptospirose, Toxoplasmose)"
            ],
            "mappedOslerBlockIds": [
              "osler-sindromes-febris-brucelose-doenca-de-lyme-febre-maculosa-febre-tifoide-leptospirose-toxoplasmose"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindromes-neurologicas-e-fraqueza-muscular",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Síndromes neurológicas e fraqueza muscular",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 88,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doenças Neuromusculares (Doenças da Junção Neuromuscular, Neuropatias Periféricas, Síndrome de Guillain-Barré)• Mielopatias / Neuropatias Cranianas",
            "oslerTopicsList": [
              "Doenças Neuromusculares (Doenças da Junção Neuromuscular, Neuropatias Periféricas, Síndrome de Guillain-Barré)",
              "Mielopatias / Neuropatias Cranianas"
            ],
            "mappedOslerBlockIds": [
              "osler-doencas-neuromusculares-doencas-da-juncao-neuromuscular-neuropatias-perifericas-sindrome-de-guillain-barre",
              "osler-mielopatias-neuropatias-cranianas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tireoide",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Tireoide",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 89,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tireoide (Hipertireoidismo, Hipotireoidismo, Hipotireoidismo Subclínico, Tireoidite Subaguda)",
            "oslerTopicsList": [
              "Tireoide (Hipertireoidismo, Hipotireoidismo, Hipotireoidismo Subclínico, Tireoidite Subaguda)"
            ],
            "mappedOslerBlockIds": [
              "osler-tireoide-hipertireoidismo-hipotireoidismo-hipotireoidismo-subclinico-tireoidite-subaguda"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-transtornos-mentais",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Transtornos mentais",
            "theoryDurationMin": 540,
            "theoryCompleted": false,
            "medwayRowNumber": 90,
            "videoLessonsHours": 9,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Psiquiatria (Esquizofrenia & Psicose, Transtorno de Estresse Pós-Traumático, Transtorno Obsessivo-Compulsivo, Transtornos do Humor [Transtorno Afetivo Bipolar, Ansiedade, Depressivos], Transtornos por Abuso de Substâncias)",
            "oslerTopicsList": [
              "Psiquiatria (Esquizofrenia & Psicose, Transtorno de Estresse Pós-Traumático, Transtorno Obsessivo-Compulsivo, Transtornos do Humor [Transtorno Afetivo Bipolar, Ansiedade, Depressivos], Transtornos por Abuso de Substâncias)"
            ],
            "mappedOslerBlockIds": [
              "osler-psiquiatria-esquizofrenia-psicose-transtorno-de-estresse-pos-traumatico-transtorno-obsessivo-compulsivo-transtornos-do-humor-transtorno-afetivo-bipolar-ansiedade-depressivos-transtornos-por-abuso-de-substancias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tuberculose",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Tuberculose",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 91,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tuberculose (Ações de Controle, Diagnóstico, Infecção Latente/ILTB, Micobactérias Atípicas, Tratamento, Tuberculose Miliar e Extrapulmonar)",
            "oslerTopicsList": [
              "Tuberculose (Ações de Controle, Diagnóstico, Infecção Latente/ILTB, Micobactérias Atípicas, Tratamento, Tuberculose Miliar e Extrapulmonar)"
            ],
            "mappedOslerBlockIds": [
              "osler-tuberculose-acoes-de-controle-diagnostico-infeccao-latente-iltb-micobacterias-atipicas-tratamento-tuberculose-miliar-e-extrapulmonar"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-do-sistema-nervoso-central",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Tumores do sistema nervoso central",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 92,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tumores do SNC (Neurocirurgia / Neurologia)",
            "oslerTopicsList": [
              "Tumores do SNC (Neurocirurgia / Neurologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-tumores-do-snc-neurocirurgia-neurologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-urologicos-2",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Tumores urológicos",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 93,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Neoplasias Urológicas / Cistos & Neoplasias Renais (Urologia)",
            "oslerTopicsList": [
              "Neoplasias Urológicas / Cistos & Neoplasias Renais (Urologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-neoplasias-urologicas-cistos-neoplasias-renais-urologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-valvopatias-e-cardiomiopatias",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Valvopatias e cardiomiopatias",
            "theoryDurationMin": 480,
            "theoryCompleted": false,
            "medwayRowNumber": 94,
            "videoLessonsHours": 8,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cardiomiopatias (Cardiologia)• Valvopatias / Doenças Valvares (Cardiologia)",
            "oslerTopicsList": [
              "Cardiomiopatias (Cardiologia)",
              "Valvopatias / Doenças Valvares (Cardiologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-cardiomiopatias-cardiologia",
              "osler-valvopatias-doencas-valvares-cardiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-vasculites",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Vasculites",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 95,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vasculites (Grandes Vasos, Médios Vasos, Pequenos Vasos, Behçet e Tromboangeíte Obliterante, Vasculite Crioglobulinêmica)",
            "oslerTopicsList": [
              "Vasculites (Grandes Vasos, Médios Vasos, Pequenos Vasos, Behçet e Tromboangeíte Obliterante, Vasculite Crioglobulinêmica)"
            ],
            "mappedOslerBlockIds": [
              "osler-vasculites-grandes-vasos-medios-vasos-pequenos-vasos-behcet-e-tromboangeite-obliterante-vasculite-crioglobulinemica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-vertigens",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Vertigens",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 96,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vertigem (Neurologia / Otorrinolaringologia)",
            "oslerTopicsList": [
              "Vertigem (Neurologia / Otorrinolaringologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-vertigem-neurologia-otorrinolaringologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-clinica-medica-doencas-sexualmente-transmissiveis",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Como cai na clínica médica: Doenças sexualmente transmissíveis",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 109,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções Sexualmente Transmissíveis / Úlceras Genitais (Cancro Mole, Herpes Genital, Linfogranuloma Venéreo, Sífilis)",
            "oslerTopicsList": [
              "Infecções Sexualmente Transmissíveis / Úlceras Genitais (Cancro Mole, Herpes Genital, Linfogranuloma Venéreo, Sífilis)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-sexualmente-transmissiveis-ulceras-genitais-cancro-mole-herpes-genital-linfogranuloma-venereo-sifilis"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-infeccoes-de-pele-ossos-e-partes-moles",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Infecções de pele, ossos e partes moles",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 111,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções de Pele e Partes Moles (Infectologia)• Infecções Osteoarticulares (Artrite Séptica, Osteomielite - Ortopedia)",
            "oslerTopicsList": [
              "Infecções de Pele e Partes Moles (Infectologia)",
              "Infecções Osteoarticulares (Artrite Séptica, Osteomielite - Ortopedia)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-de-pele-e-partes-moles-infectologia",
              "osler-infeccoes-osteoarticulares-artrite-septica-osteomielite-ortopedia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-neurointensivismo-e-etica-medica",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Neurointensivismo e ética médica",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 112,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Coma / Hipertensão Intracraniana (Neurologia)",
            "oslerTopicsList": [
              "Coma / Hipertensão Intracraniana (Neurologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-coma-hipertensao-intracraniana-neurologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-saude-mental-no-brasil",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Saúde mental no Brasil",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 113,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Psiquiatria / Abordagem Geral da Dependência Química",
            "oslerTopicsList": [
              "Psiquiatria / Abordagem Geral da Dependência Química"
            ],
            "mappedOslerBlockIds": [
              "osler-psiquiatria-abordagem-geral-da-dependencia-quimica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-clinica-medica-como-cai-sindromes-diarreicas-e-desabsortivas",
            "areaId": "mod-clinica-medica",
            "areaName": "Clínica Médica",
            "moduloId": "mod-clinica-medica",
            "moduloName": "Clínica Médica",
            "name": "Clínica médica: como cai síndromes diarreicas e desabsortivas",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 146,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções Gastrintestinais• Gastroenterologia (Diarreia Aguda e Crônica, Transtornos Disabsortivos)",
            "oslerTopicsList": [
              "Infecções Gastrintestinais",
              "Gastroenterologia (Diarreia Aguda e Crônica, Transtornos Disabsortivos)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-gastrintestinais",
              "osler-gastroenterologia-diarreia-aguda-e-cronica-transtornos-disabsortivos"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          }
        ],
        "totalContents": 51,
        "studiedContents": 0,
        "consolidatedContents": 0,
        "avgMastery": 0
      }
    ],
    "totalContents": 51,
    "studiedContents": 0,
    "consolidatedContents": 0,
    "avgMastery": 0,
    "totalHours": 238
  },
  {
    "id": "mod-pediatria",
    "name": "Pediatria",
    "icon": "child_care",
    "modules": [
      {
        "id": "mod-pediatria",
        "areaId": "mod-pediatria",
        "name": "Pediatria",
        "contents": [
          {
            "id": "c-como-cai-na-pediatria-anemias-e-hemoglobinopatias",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Anemias e hemoglobinopatias",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 97,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Anemias (Anemia Ferropriva na Criança, Anemia Fisiológica da Infância) / Hemoglobinopatias",
            "oslerTopicsList": [
              "Anemias (Anemia Ferropriva na Criança, Anemia Fisiológica da Infância) / Hemoglobinopatias"
            ],
            "mappedOslerBlockIds": [
              "osler-anemias-anemia-ferropriva-na-crianca-anemia-fisiologica-da-infancia-hemoglobinopatias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-glomerulopatias-e-tubulopatias",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Glomerulopatias e tubulopatias",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 98,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Nefrologia Pediátrica / Glomerulopatias",
            "oslerTopicsList": [
              "Nefrologia Pediátrica / Glomerulopatias"
            ],
            "mappedOslerBlockIds": [
              "osler-nefrologia-pediatrica-glomerulopatias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-diabetes",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Diabetes",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 99,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Diabetes Mellitus / DM1 na Infância",
            "oslerTopicsList": [
              "Diabetes Mellitus / DM1 na Infância"
            ],
            "mappedOslerBlockIds": [
              "osler-diabetes-mellitus-dm1-na-infancia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-disturbios-da-hemostasia-e-desordens-tromboticas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Distúrbios da hemostasia e desordens trombóticas",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 100,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Distúrbios Hematológicos Neonatais / Hematologia",
            "oslerTopicsList": [
              "Distúrbios Hematológicos Neonatais / Hematologia"
            ],
            "mappedOslerBlockIds": [
              "osler-disturbios-hematologicos-neonatais-hematologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-hipertensao",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Hipertensão",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 101,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hipertensão Arterial Sistêmica na Criança (Cardiologia Pediátrica)",
            "oslerTopicsList": [
              "Hipertensão Arterial Sistêmica na Criança (Cardiologia Pediátrica)"
            ],
            "mappedOslerBlockIds": [
              "osler-hipertensao-arterial-sistemica-na-crianca-cardiologia-pediatrica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-infeccoes-do-sistema-nervoso-central",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Infecções do sistema nervoso central",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 102,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Meningite Bacteriana em Crianças",
            "oslerTopicsList": [
              "Meningite Bacteriana em Crianças"
            ],
            "mappedOslerBlockIds": [
              "osler-meningite-bacteriana-em-criancas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-intoxicacoes-exogenas-e-acidentes-por-animais-peconhentos",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Intoxicações exógenas e acidentes por animais peçonhentos",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 103,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Intoxicações e Acidentes (Módulo de Clínica Médica / Urgências)",
            "oslerTopicsList": [
              "Intoxicações e Acidentes (Módulo de Clínica Médica / Urgências)"
            ],
            "mappedOslerBlockIds": [
              "osler-intoxicacoes-e-acidentes-modulo-de-clinica-medica-urgencias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-onco-hematologia",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Onco-hematologia",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 104,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Neoplasias Pediátricas (Oncologia)",
            "oslerTopicsList": [
              "Neoplasias Pediátricas (Oncologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-neoplasias-pediatricas-oncologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-pneumonias-e-sindromes-gripais",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Pneumonias e síndromes gripais",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 105,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pneumonia na Pediatria / Infecções Respiratórias",
            "oslerTopicsList": [
              "Pneumonia na Pediatria / Infecções Respiratórias"
            ],
            "mappedOslerBlockIds": [
              "osler-pneumonia-na-pediatria-infeccoes-respiratorias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-sindrome-metabolica-e-dislipidemia",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Síndrome metabólica e dislipidemia",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 106,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Obesidade Infantil / Hebiatria",
            "oslerTopicsList": [
              "Obesidade Infantil / Hebiatria"
            ],
            "mappedOslerBlockIds": [
              "osler-obesidade-infantil-hebiatria"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-sindromes-febris",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Síndromes febris",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 107,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Febre Sem Sinais Localizatórios & de Origem Indeterminada",
            "oslerTopicsList": [
              "Febre Sem Sinais Localizatórios & de Origem Indeterminada"
            ],
            "mappedOslerBlockIds": [
              "osler-febre-sem-sinais-localizatorios-de-origem-indeterminada"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-pediatria-tuberculose",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Como cai na pediatria: Tuberculose",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 108,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tuberculose na Pediatria (Infectologia Pediátrica)",
            "oslerTopicsList": [
              "Tuberculose na Pediatria (Infectologia Pediátrica)"
            ],
            "mappedOslerBlockIds": [
              "osler-tuberculose-na-pediatria-infectologia-pediatrica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-desordens-do-sistema-imune",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Desordens do sistema imune",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 114,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Alergia e Imunologia (Alergia Alimentar, Anafilaxia, Imunodeficiências Primárias)",
            "oslerTopicsList": [
              "Alergia e Imunologia (Alergia Alimentar, Anafilaxia, Imunodeficiências Primárias)"
            ],
            "mappedOslerBlockIds": [
              "osler-alergia-e-imunologia-alergia-alimentar-anafilaxia-imunodeficiencias-primarias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-arritmias-sincope-e-pcr-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Arritmias, síncope e PCR",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 115,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pediatric Advanced Life Support (PALS) / Cardiologia",
            "oslerTopicsList": [
              "Pediatric Advanced Life Support (PALS) / Cardiologia"
            ],
            "mappedOslerBlockIds": [
              "osler-pediatric-advanced-life-support-pals-cardiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-cardiopatias-congenitas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Cardiopatias congênitas",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 116,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Cardiopatias Congênitas (Cardiologia Pediátrica)",
            "oslerTopicsList": [
              "Cardiopatias Congênitas (Cardiologia Pediátrica)"
            ],
            "mappedOslerBlockIds": [
              "osler-cardiopatias-congenitas-cardiologia-pediatrica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-diabetes-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Diabetes",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 117,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Diabetes Mellitus / DM1",
            "oslerTopicsList": [
              "Diabetes Mellitus / DM1"
            ],
            "mappedOslerBlockIds": [
              "osler-diabetes-mellitus-dm1"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-constipacao-intestinal",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Constipação intestinal",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 118,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Constipação (Gastroenterologia Pediátrica)",
            "oslerTopicsList": [
              "Constipação (Gastroenterologia Pediátrica)"
            ],
            "mappedOslerBlockIds": [
              "osler-constipacao-gastroenterologia-pediatrica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-parasitoses-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Parasitoses",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 119,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Parasitoses / Doenças Infecciosas",
            "oslerTopicsList": [
              "Parasitoses / Doenças Infecciosas"
            ],
            "mappedOslerBlockIds": [
              "osler-parasitoses-doencas-infecciosas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindromes-diarreicas-e-absortivas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Síndromes diarreicas e absortivas",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 120,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Diarreia Aguda e Crônica na Criança• Doença Celíaca",
            "oslerTopicsList": [
              "Diarreia Aguda e Crônica na Criança",
              "Doença Celíaca"
            ],
            "mappedOslerBlockIds": [
              "osler-diarreia-aguda-e-cronica-na-crianca",
              "osler-doenca-celiaca"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-desordens-geneticas-e-erros-inatos-do-metabolismo",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Desordens genéticas e erros inatos do metabolismo",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 121,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Erros Inatos do Metabolismo• Síndromes Genéticas (Down, Turner, Noonan, etc.)",
            "oslerTopicsList": [
              "Erros Inatos do Metabolismo",
              "Síndromes Genéticas (Down, Turner, Noonan, etc.)"
            ],
            "mappedOslerBlockIds": [
              "osler-erros-inatos-do-metabolismo",
              "osler-sindromes-geneticas-down-turner-noonan-etc"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-exantematicas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Doenças exantemáticas",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 122,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doenças Exantemáticas (Escarlatina, Exantema Súbito, Mão-Pé-Boca, Parvovírus B19, Rubéola, Sarampo, Varicela)",
            "oslerTopicsList": [
              "Doenças Exantemáticas (Escarlatina, Exantema Súbito, Mão-Pé-Boca, Parvovírus B19, Rubéola, Sarampo, Varicela)"
            ],
            "mappedOslerBlockIds": [
              "osler-doencas-exantematicas-escarlatina-exantema-subito-mao-pe-boca-parvovirus-b19-rubeola-sarampo-varicela"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-imunizacoes",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Imunizações",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 123,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vacinação (Calendário Vacinal, BCG, Tríplice Viral, Meningocócica, Poliomielite, Rotavírus, etc.)",
            "oslerTopicsList": [
              "Vacinação (Calendário Vacinal, BCG, Tríplice Viral, Meningocócica, Poliomielite, Rotavírus, etc.)"
            ],
            "mappedOslerBlockIds": [
              "osler-vacinacao-calendario-vacinal-bcg-triplice-viral-meningococica-poliomielite-rotavirus-etc"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-infeccoes-do-trato-urinario",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Infecções do trato urinário",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 124,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecção do Trato Urinário",
            "oslerTopicsList": [
              "Infecção do Trato Urinário"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccao-do-trato-urinario"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-pneumonias-e-sindromes-gripais-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Pneumonias e síndromes gripais",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 125,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pneumonia na Pediatria• Bronquiolite• Coqueluche",
            "oslerTopicsList": [
              "Pneumonia na Pediatria",
              "Bronquiolite",
              "Coqueluche"
            ],
            "mappedOslerBlockIds": [
              "osler-pneumonia-na-pediatria",
              "osler-bronquiolite",
              "osler-coqueluche"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindromes-febris-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Síndromes febris",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 126,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Febre Sem Sinais Localizatórios• Doença de Kawasaki",
            "oslerTopicsList": [
              "Febre Sem Sinais Localizatórios",
              "Doença de Kawasaki"
            ],
            "mappedOslerBlockIds": [
              "osler-febre-sem-sinais-localizatorios",
              "osler-doenca-de-kawasaki"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-glomerulopatias-e-tubulopatias-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Glomerulopatias e tubulopatias",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 127,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Síndrome Nefrótica na Criança• Infecção do Trato Urinário• Hematúria na Infância",
            "oslerTopicsList": [
              "Síndrome Nefrótica na Criança",
              "Infecção do Trato Urinário",
              "Hematúria na Infância"
            ],
            "mappedOslerBlockIds": [
              "osler-sindrome-nefrotica-na-crianca",
              "osler-infeccao-do-trato-urinario",
              "osler-hematuria-na-infancia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-alojamento-conjunto-e-teste-de-triagem-neonatal",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Alojamento conjunto e teste de triagem neonatal",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 128,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Sala de Parto & Alojamento Conjunto• Testes de Triagem Neonatal",
            "oslerTopicsList": [
              "Sala de Parto & Alojamento Conjunto",
              "Testes de Triagem Neonatal"
            ],
            "mappedOslerBlockIds": [
              "osler-sala-de-parto-alojamento-conjunto",
              "osler-testes-de-triagem-neonatal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-periodo-neonatal-doencas-do-metabolismo",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Período neonatal: doenças do metabolismo",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 129,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Distúrbios Metabólicos (Filho de Mãe Diabética, Hipoglicemia Neonatal, Hipotireoidismo Congênito, Hiperplasia Adrenal Congênita)",
            "oslerTopicsList": [
              "Distúrbios Metabólicos (Filho de Mãe Diabética, Hipoglicemia Neonatal, Hipotireoidismo Congênito, Hiperplasia Adrenal Congênita)"
            ],
            "mappedOslerBlockIds": [
              "osler-disturbios-metabolicos-filho-de-mae-diabetica-hipoglicemia-neonatal-hipotireoidismo-congenito-hiperplasia-adrenal-congenita"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-periodo-neonatal-doencas-hematologicas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Período neonatal: doenças hematológicas",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 130,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doença Hemorrágica do Recém-Nascido• Icterícia Neonatal",
            "oslerTopicsList": [
              "Doença Hemorrágica do Recém-Nascido",
              "Icterícia Neonatal"
            ],
            "mappedOslerBlockIds": [
              "osler-doenca-hemorragica-do-recem-nascido",
              "osler-ictericia-neonatal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-periodo-neonatal-doencas-infecciosas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Período neonatal: doenças infecciosas",
            "theoryDurationMin": 540,
            "theoryCompleted": false,
            "medwayRowNumber": 131,
            "videoLessonsHours": 9,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções Congênitas (Citomegalovírus, Sífilis Congênita, Toxoplasmose, Zika, HIV)• Sepse Neonatal",
            "oslerTopicsList": [
              "Infecções Congênitas (Citomegalovírus, Sífilis Congênita, Toxoplasmose, Zika, HIV)",
              "Sepse Neonatal"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-congenitas-citomegalovirus-sifilis-congenita-toxoplasmose-zika-hiv",
              "osler-sepse-neonatal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-periodo-neonatal-doencas-respiratorias",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Período neonatal: doenças respiratórias",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 132,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Desconforto Respiratório do RN (Taquipneia Transitória, SDR/Doença da Membrana Hialina, Síndrome de Aspiração de Mecônio, Asfixia Perinatal)",
            "oslerTopicsList": [
              "Desconforto Respiratório do RN (Taquipneia Transitória, SDR/Doença da Membrana Hialina, Síndrome de Aspiração de Mecônio, Asfixia Perinatal)"
            ],
            "mappedOslerBlockIds": [
              "osler-desconforto-respiratorio-do-rn-taquipneia-transitoria-sdr-doenca-da-membrana-hialina-sindrome-de-aspiracao-de-meconio-asfixia-perinatal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-neurologicas-e-sensoriais",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Doenças neurológicas e sensoriais",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 133,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Neurologia (Convulsão Febril, BRUE, Cefaleia, Epilepsia, Triagem Visual na Infância)",
            "oslerTopicsList": [
              "Neurologia (Convulsão Febril, BRUE, Cefaleia, Epilepsia, Triagem Visual na Infância)"
            ],
            "mappedOslerBlockIds": [
              "osler-neurologia-convulsao-febril-brue-cefaleia-epilepsia-triagem-visual-na-infancia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sala-de-parto",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Sala de parto",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 134,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Reanimação Neonatal• Escore de Apgar",
            "oslerTopicsList": [
              "Reanimação Neonatal",
              "Escore de Apgar"
            ],
            "mappedOslerBlockIds": [
              "osler-reanimacao-neonatal",
              "osler-escore-de-apgar"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-epilepsia-e-sindromes-convulsivas",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Epilepsia e síndromes convulsivas",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 135,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Crises Epilépticas na Criança• Síndromes Epilépticas",
            "oslerTopicsList": [
              "Crises Epilépticas na Criança",
              "Síndromes Epilépticas"
            ],
            "mappedOslerBlockIds": [
              "osler-crises-epilepticas-na-crianca",
              "osler-sindromes-epilepticas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disturbios-carenciais",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Distúrbios carenciais",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 136,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Deficiência e Reposição de Vitaminas (Ferro, Vitamina A, D)• Desnutrição Infantil",
            "oslerTopicsList": [
              "Deficiência e Reposição de Vitaminas (Ferro, Vitamina A, D)",
              "Desnutrição Infantil"
            ],
            "mappedOslerBlockIds": [
              "osler-deficiencia-e-reposicao-de-vitaminas-ferro-vitamina-a-d",
              "osler-desnutricao-infantil"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-nutricao-na-pediatria",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Nutrição na pediatria",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 137,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Aleitamento Materno• Alimentação Complementar• Fórmulas Infantis",
            "oslerTopicsList": [
              "Aleitamento Materno",
              "Alimentação Complementar",
              "Fórmulas Infantis"
            ],
            "mappedOslerBlockIds": [
              "osler-aleitamento-materno",
              "osler-alimentacao-complementar",
              "osler-formulas-infantis"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-nariz-ouvido-e-laringe",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Nariz, ouvido e laringe",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 138,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções de Vias Aéreas Superiores (Faringite, Laringite, Otite, Rinossinusite, Traqueíte)",
            "oslerTopicsList": [
              "Infecções de Vias Aéreas Superiores (Faringite, Laringite, Otite, Rinossinusite, Traqueíte)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-de-vias-aereas-superiores-faringite-laringite-otite-rinossinusite-traqueite"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disturbios-obstrutivos-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Distúrbios obstrutivos",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 139,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pneumologia (Aspiração de Corpo Estranho, Asma, Bronquiolite, Fibrose Cística)",
            "oslerTopicsList": [
              "Pneumologia (Aspiração de Corpo Estranho, Asma, Bronquiolite, Fibrose Cística)"
            ],
            "mappedOslerBlockIds": [
              "osler-pneumologia-aspiracao-de-corpo-estranho-asma-bronquiolite-fibrose-cistica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-avaliacao-dos-transtornos-do-comportamento-na-infancia-e-adolescencia",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Avaliação dos transtornos do comportamento na infância e adolescência",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 140,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Transtornos da Infância (TDAH, TEA, Transtorno Opositivo-Desafiante)",
            "oslerTopicsList": [
              "Transtornos da Infância (TDAH, TEA, Transtorno Opositivo-Desafiante)"
            ],
            "mappedOslerBlockIds": [
              "osler-transtornos-da-infancia-tdah-tea-transtorno-opositivo-desafiante"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-crescimento-e-desenvolvimento-na-infancia-e-adolescencia",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Crescimento e desenvolvimento na infância e adolescência",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 141,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Puericultura (Avaliação do DNPM, Avaliação Pôndero-Estatural)",
            "oslerTopicsList": [
              "Puericultura (Avaliação do DNPM, Avaliação Pôndero-Estatural)"
            ],
            "mappedOslerBlockIds": [
              "osler-puericultura-avaliacao-do-dnpm-avaliacao-pondero-estatural"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-vasculites-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Vasculites",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 142,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Reumatologia Pediátrica (Doença de Kawasaki, Vasculite por IgA/Henoch-Schönlein, Febre Reumática, Artrite Idiopática Juvenil)",
            "oslerTopicsList": [
              "Reumatologia Pediátrica (Doença de Kawasaki, Vasculite por IgA/Henoch-Schönlein, Febre Reumática, Artrite Idiopática Juvenil)"
            ],
            "mappedOslerBlockIds": [
              "osler-reumatologia-pediatrica-doenca-de-kawasaki-vasculite-por-iga-henoch-schonlein-febre-reumatica-artrite-idiopatica-juvenil"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disturbios-estaturais-e-puberais",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Distúrbios estaturais e puberais",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 143,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hebiatria (Alterações da Puberdade, Puberdade Fisiológica)",
            "oslerTopicsList": [
              "Hebiatria (Alterações da Puberdade, Puberdade Fisiológica)"
            ],
            "mappedOslerBlockIds": [
              "osler-hebiatria-alteracoes-da-puberdade-puberdade-fisiologica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-seguranca-e-violencia-na-infancia",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Segurança e violência na infância",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 144,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Abuso Infantil (Puericultura / Segurança da Criança)",
            "oslerTopicsList": [
              "Abuso Infantil (Puericultura / Segurança da Criança)"
            ],
            "mappedOslerBlockIds": [
              "osler-abuso-infantil-puericultura-seguranca-da-crianca"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sepse-choque-septico-e-outros-tipos-de-choque-2",
            "areaId": "mod-pediatria",
            "areaName": "Pediatria",
            "moduloId": "mod-pediatria",
            "moduloName": "Pediatria",
            "name": "Sepse, choque séptico e outros tipos de choque",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 145,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Sepse Pediátrica• Choque (Cardiologia / Terapia Intensiva Pediátrica)",
            "oslerTopicsList": [
              "Sepse Pediátrica",
              "Choque (Cardiologia / Terapia Intensiva Pediátrica)"
            ],
            "mappedOslerBlockIds": [
              "osler-sepse-pediatrica",
              "osler-choque-cardiologia-terapia-intensiva-pediatrica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          }
        ],
        "totalContents": 44,
        "studiedContents": 0,
        "consolidatedContents": 0,
        "avgMastery": 0
      }
    ],
    "totalContents": 44,
    "studiedContents": 0,
    "consolidatedContents": 0,
    "avgMastery": 0,
    "totalHours": 127
  },
  {
    "id": "mod-medicina-preventiva-e-social",
    "name": "Medicina Preventiva e Social",
    "icon": "public",
    "modules": [
      {
        "id": "mod-medicina-preventiva-e-social",
        "areaId": "mod-medicina-preventiva-e-social",
        "name": "Medicina Preventiva e Social",
        "contents": [
          {
            "id": "c-como-cai-na-preventiva-hiv-e-aids-no-adulto-nao-gestante",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Como cai na preventiva: HIV e AIDS no adulto não gestante",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 110,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• HIV e Aids (Infectologia / Clínica Médica)",
            "oslerTopicsList": [
              "HIV e Aids (Infectologia / Clínica Médica)"
            ],
            "mappedOslerBlockIds": [
              "osler-hiv-e-aids-infectologia-clinica-medica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-como-cai-na-preventiva-imunizacoes",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Como cai na preventiva: imunizações",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 147,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vacinas (Medicina Legal / Epidemiologia)",
            "oslerTopicsList": [
              "Vacinas (Medicina Legal / Epidemiologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-vacinas-medicina-legal-epidemiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-etica-medica-bioetica-e-documentacao",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Ética médica, Bioética e Documentação",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 185,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Atestados Médicos• Bioética• Código de Ética Médica• Declaração de Nascido Vivo• Declaração de Óbito",
            "oslerTopicsList": [
              "Atestados Médicos",
              "Bioética",
              "Código de Ética Médica",
              "Declaração de Nascido Vivo",
              "Declaração de Óbito"
            ],
            "mappedOslerBlockIds": [
              "osler-atestados-medicos",
              "osler-bioetica",
              "osler-codigo-de-etica-medica",
              "osler-declaracao-de-nascido-vivo",
              "osler-declaracao-de-obito"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-estudos-epidemiologicos-analise-estatistica-e-aplicacao",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Estudos Epidemiológicos (Análise Estatística e Aplicação)",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 186,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Bioestatística• Estudos Epidemiológicos",
            "oslerTopicsList": [
              "Bioestatística",
              "Estudos Epidemiológicos"
            ],
            "mappedOslerBlockIds": [
              "osler-bioestatistica",
              "osler-estudos-epidemiologicos"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-estudos-epidemiologicos-classificacao",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Estudos Epidemiológicos (Classificação)",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 187,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Estudos Epidemiológicos (Epidemiologia)",
            "oslerTopicsList": [
              "Estudos Epidemiológicos (Epidemiologia)"
            ],
            "mappedOslerBlockIds": [
              "osler-estudos-epidemiologicos-epidemiologia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-perfis-e-indicadores-demograficos",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Perfis e Indicadores Demográficos",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 188,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Transição Demográfica• Indicadores de Saúde",
            "oslerTopicsList": [
              "Transição Demográfica",
              "Indicadores de Saúde"
            ],
            "mappedOslerBlockIds": [
              "osler-transicao-demografica",
              "osler-indicadores-de-saude"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-indicadores-de-morbimortalidade",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Indicadores de Morbimortalidade",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 189,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Indicadores de Saúde• Medidas de Frequência",
            "oslerTopicsList": [
              "Indicadores de Saúde",
              "Medidas de Frequência"
            ],
            "mappedOslerBlockIds": [
              "osler-indicadores-de-saude",
              "osler-medidas-de-frequencia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-niveis-de-prevencao",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Níveis de Prevenção",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 190,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• História Natural da Doença e Níveis de Prevenção",
            "oslerTopicsList": [
              "História Natural da Doença e Níveis de Prevenção"
            ],
            "mappedOslerBlockIds": [
              "osler-historia-natural-da-doenca-e-niveis-de-prevencao"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-aspectos-historicos-do-sus",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Aspectos Históricos do SUS",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 191,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Marcos Históricos do SUS (SUS)",
            "oslerTopicsList": [
              "Marcos Históricos do SUS (SUS)"
            ],
            "mappedOslerBlockIds": [
              "osler-marcos-historicos-do-sus-sus"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-a-evolucao-do-sus",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "A Evolução do SUS",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 192,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Organização Financeira do SUS• Organização Jurídica do SUS• Princípios do SUS",
            "oslerTopicsList": [
              "Organização Financeira do SUS",
              "Organização Jurídica do SUS",
              "Princípios do SUS"
            ],
            "mappedOslerBlockIds": [
              "osler-organizacao-financeira-do-sus",
              "osler-organizacao-juridica-do-sus",
              "osler-principios-do-sus"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-atencao-primaria-a-saude",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Atenção Primária à Saúde",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 193,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Atenção Primária (Abordagem Familiar e Comunitária, Atributos da APS, Política Nacional de Atenção Básica, Territorialização e Diagnóstico Local)",
            "oslerTopicsList": [
              "Atenção Primária (Abordagem Familiar e Comunitária, Atributos da APS, Política Nacional de Atenção Básica, Territorialização e Diagnóstico Local)"
            ],
            "mappedOslerBlockIds": [
              "osler-atencao-primaria-abordagem-familiar-e-comunitaria-atributos-da-aps-politica-nacional-de-atencao-basica-territorializacao-e-diagnostico-local"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-estatistica-de-testes-diagnosticos",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Estatística de Testes Diagnósticos",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 194,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Testes Diagnósticos (Epidemiologia)• Medidas de Associação",
            "oslerTopicsList": [
              "Testes Diagnósticos (Epidemiologia)",
              "Medidas de Associação"
            ],
            "mappedOslerBlockIds": [
              "osler-testes-diagnosticos-epidemiologia",
              "osler-medidas-de-associacao"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-notificacao",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Notificação",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 195,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vigilância Epidemiológica• Notificação Compulsória",
            "oslerTopicsList": [
              "Vigilância Epidemiológica",
              "Notificação Compulsória"
            ],
            "mappedOslerBlockIds": [
              "osler-vigilancia-epidemiologica",
              "osler-notificacao-compulsoria"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-vigilancia-em-saude-do-trabalhador",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Vigilância em Saúde do Trabalhador",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 196,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Saúde do Trabalhador (Medicina Legal)",
            "oslerTopicsList": [
              "Saúde do Trabalhador (Medicina Legal)"
            ],
            "mappedOslerBlockIds": [
              "osler-saude-do-trabalhador-medicina-legal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-epidemias-endemias-e-pandemias",
            "areaId": "mod-medicina-preventiva-e-social",
            "areaName": "Medicina Preventiva e Social",
            "moduloId": "mod-medicina-preventiva-e-social",
            "moduloName": "Medicina Preventiva e Social",
            "name": "Epidemias, Endemias e Pandemias",
            "theoryDurationMin": 180,
            "theoryCompleted": false,
            "medwayRowNumber": 197,
            "videoLessonsHours": 3,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Endemia & Epidemia & Pandemia• Vigilância Epidemiológica",
            "oslerTopicsList": [
              "Endemia & Epidemia & Pandemia",
              "Vigilância Epidemiológica"
            ],
            "mappedOslerBlockIds": [
              "osler-endemia-epidemia-pandemia",
              "osler-vigilancia-epidemiologica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          }
        ],
        "totalContents": 15,
        "studiedContents": 0,
        "consolidatedContents": 0,
        "avgMastery": 0
      }
    ],
    "totalContents": 15,
    "studiedContents": 0,
    "consolidatedContents": 0,
    "avgMastery": 0,
    "totalHours": 67
  },
  {
    "id": "mod-ginecologia-e-obstetricia",
    "name": "Ginecologia e Obstetrícia",
    "icon": "pregnant_woman",
    "modules": [
      {
        "id": "mod-ginecologia-e-obstetricia",
        "areaId": "mod-ginecologia-e-obstetricia",
        "name": "Ginecologia e Obstetrícia",
        "contents": [
          {
            "id": "c-rastreamento-do-cancer-de-colo-uterino",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Rastreamento do Câncer de Colo Uterino",
            "theoryDurationMin": 120,
            "theoryCompleted": false,
            "medwayRowNumber": 148,
            "videoLessonsHours": 2,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Citologia Cervicovaginal• HPV & Rastreio do Câncer de Colo",
            "oslerTopicsList": [
              "Citologia Cervicovaginal",
              "HPV & Rastreio do Câncer de Colo"
            ],
            "mappedOslerBlockIds": [
              "osler-citologia-cervicovaginal",
              "osler-hpv-rastreio-do-cancer-de-colo"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-pre-natal",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Pré-Natal",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 149,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Assistência Pré-Natal• Diagnóstico & Datação da Gestação• Vacinas da Gestante",
            "oslerTopicsList": [
              "Assistência Pré-Natal",
              "Diagnóstico & Datação da Gestação",
              "Vacinas da Gestante"
            ],
            "mappedOslerBlockIds": [
              "osler-assistencia-pre-natal",
              "osler-diagnostico-datacao-da-gestacao",
              "osler-vacinas-da-gestante"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-do-colo-uterino",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Tumores do colo uterino",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 150,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer de Colo Uterino• Câncer de Colo de Útero — Tratamento",
            "oslerTopicsList": [
              "Câncer de Colo Uterino",
              "Câncer de Colo de Útero — Tratamento"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-de-colo-uterino",
              "osler-cancer-de-colo-de-utero-tratamento"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-do-corpo-uterino-e-endometrio",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Doenças do Corpo Uterino e Endométrio",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 151,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Hiperplasia & Câncer de Endométrio• Pólipo Endometrial",
            "oslerTopicsList": [
              "Hiperplasia & Câncer de Endométrio",
              "Pólipo Endometrial"
            ],
            "mappedOslerBlockIds": [
              "osler-hiperplasia-cancer-de-endometrio",
              "osler-polipo-endometrial"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-diabetes-mellitus-na-gravidez",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Diabetes mellitus na Gravidez",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 152,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Diabetes Mellitus Gestacional",
            "oslerTopicsList": [
              "Diabetes Mellitus Gestacional"
            ],
            "mappedOslerBlockIds": [
              "osler-diabetes-mellitus-gestacional"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sindromes-hipertensivas-da-gestacao",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Síndromes Hipertensivas da Gestação",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 153,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Pré-Eclâmpsia• Eclâmpsia• Hipertensão Gestacional• Síndrome HELLP",
            "oslerTopicsList": [
              "Pré-Eclâmpsia",
              "Eclâmpsia",
              "Hipertensão Gestacional",
              "Síndrome HELLP"
            ],
            "mappedOslerBlockIds": [
              "osler-pre-eclampsia",
              "osler-eclampsia",
              "osler-hipertensao-gestacional",
              "osler-sindrome-hellp"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-hepatites-virais-hiv-aids-e-outras-infeccoes-na-gestacao",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Hepatites virais, HIV/AIDS e outras infecções na gestação",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 154,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infecções na Gestação (HIV na Gestação, Hepatite, Sífilis na Gestação, Toxoplasmose na Gestação, Citomegalovírus)",
            "oslerTopicsList": [
              "Infecções na Gestação (HIV na Gestação, Hepatite, Sífilis na Gestação, Toxoplasmose na Gestação, Citomegalovírus)"
            ],
            "mappedOslerBlockIds": [
              "osler-infeccoes-na-gestacao-hiv-na-gestacao-hepatite-sifilis-na-gestacao-toxoplasmose-na-gestacao-citomegalovirus"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-outras-doencas-na-gestacao",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Outras doenças na gestação",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 155,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doenças Intercorrentes na Gestação (Anemias, Cardiopatias, Tireoidopatias, Trombofilias, Lúpus)",
            "oslerTopicsList": [
              "Doenças Intercorrentes na Gestação (Anemias, Cardiopatias, Tireoidopatias, Trombofilias, Lúpus)"
            ],
            "mappedOslerBlockIds": [
              "osler-doencas-intercorrentes-na-gestacao-anemias-cardiopatias-tireoidopatias-trombofilias-lupus"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-amenorreias-e-sindrome-dos-ovarios-policisticos",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Amenorreias e Síndrome dos Ovários Policísticos",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 156,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Amenorreia Primária• Amenorreia Secundária• Síndrome dos Ovários Policísticos (SOP)",
            "oslerTopicsList": [
              "Amenorreia Primária",
              "Amenorreia Secundária",
              "Síndrome dos Ovários Policísticos (SOP)"
            ],
            "mappedOslerBlockIds": [
              "osler-amenorreia-primaria",
              "osler-amenorreia-secundaria",
              "osler-sindrome-dos-ovarios-policisticos-sop"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-ciclo-menstrual",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Ciclo Menstrual",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 157,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Fisiologia Menstrual",
            "oslerTopicsList": [
              "Fisiologia Menstrual"
            ],
            "mappedOslerBlockIds": [
              "osler-fisiologia-menstrual"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-climaterio",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Climatério",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 158,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Climatério e Menopausa",
            "oslerTopicsList": [
              "Climatério e Menopausa"
            ],
            "mappedOslerBlockIds": [
              "osler-climaterio-e-menopausa"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-contracepcao",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Contracepção",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 159,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Contracepção",
            "oslerTopicsList": [
              "Contracepção"
            ],
            "mappedOslerBlockIds": [
              "osler-contracepcao"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-anatomia-pelvica",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Anatomia Pélvica",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 160,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Anatomia do Trato Genital Feminino",
            "oslerTopicsList": [
              "Anatomia do Trato Genital Feminino"
            ],
            "mappedOslerBlockIds": [
              "osler-anatomia-do-trato-genital-feminino"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-dor-pelvica-cronica",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Dor pélvica crônica",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 161,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Dor Pélvica",
            "oslerTopicsList": [
              "Dor Pélvica"
            ],
            "mappedOslerBlockIds": [
              "osler-dor-pelvica"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doenca-inflamatoria-pelvica-e-violencia-sexual",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Doença Inflamatória Pélvica e Violência Sexual",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 162,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Doença Inflamatória Pélvica (DIP)• Violência Sexual",
            "oslerTopicsList": [
              "Doença Inflamatória Pélvica (DIP)",
              "Violência Sexual"
            ],
            "mappedOslerBlockIds": [
              "osler-doenca-inflamatoria-pelvica-dip",
              "osler-violencia-sexual"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-vulvovaginites",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Vulvovaginites",
            "theoryDurationMin": 420,
            "theoryCompleted": false,
            "medwayRowNumber": 163,
            "videoLessonsHours": 7,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vulvovaginites (Candidíase Vulvovaginal, Tricomoníase, Vaginose Bacteriana)• Abordagem do Corrimento Vaginal",
            "oslerTopicsList": [
              "Vulvovaginites (Candidíase Vulvovaginal, Tricomoníase, Vaginose Bacteriana)",
              "Abordagem do Corrimento Vaginal"
            ],
            "mappedOslerBlockIds": [
              "osler-vulvovaginites-candidiase-vulvovaginal-tricomoniase-vaginose-bacteriana",
              "osler-abordagem-do-corrimento-vaginal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-infertividade-conjugal",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Infertividade Conjugal",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 164,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Infertividade",
            "oslerTopicsList": [
              "Infertividade"
            ],
            "mappedOslerBlockIds": [
              "osler-infertividade"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-doencas-benignas-da-mama",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Doenças Benignas da Mama",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 165,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Lesões Benignas da Mama• Mastalgia",
            "oslerTopicsList": [
              "Lesões Benignas da Mama",
              "Mastalgia"
            ],
            "mappedOslerBlockIds": [
              "osler-lesoes-benignas-da-mama",
              "osler-mastalgia"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-malignos-da-mama",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Tumores Malignos da Mama",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 166,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Câncer de Mama• Rastreio do Câncer de Mama",
            "oslerTopicsList": [
              "Câncer de Mama",
              "Rastreio do Câncer de Mama"
            ],
            "mappedOslerBlockIds": [
              "osler-cancer-de-mama",
              "osler-rastreio-do-cancer-de-mama"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-medicina-fetal",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Medicina Fetal",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 167,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Medicina Fetal / Malformações Fetais / Rastreamento de Cromossomopatias",
            "oslerTopicsList": [
              "Medicina Fetal / Malformações Fetais / Rastreamento de Cromossomopatias"
            ],
            "mappedOslerBlockIds": [
              "osler-medicina-fetal-malformacoes-fetais-rastreamento-de-cromossomopatias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-tumores-dos-ovarios",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Tumores dos Ovários",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 168,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Tumores de Ovário",
            "oslerTopicsList": [
              "Tumores de Ovário"
            ],
            "mappedOslerBlockIds": [
              "osler-tumores-de-ovario"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-assistencia-ao-parto",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Assistência ao Parto",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 169,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Assistência ao Trabalho de Parto• Fases do Trabalho de Parto",
            "oslerTopicsList": [
              "Assistência ao Trabalho de Parto",
              "Fases do Trabalho de Parto"
            ],
            "mappedOslerBlockIds": [
              "osler-assistencia-ao-trabalho-de-parto",
              "osler-fases-do-trabalho-de-parto"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-estatica-fetal-pelve-e-mecanismo-de-parto",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Estática fetal, pelve e mecanismo de parto",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 170,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Estática Fetal",
            "oslerTopicsList": [
              "Estática Fetal"
            ],
            "mappedOslerBlockIds": [
              "osler-estatica-fetal"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-rotura-prematura-de-membros-ovulares-e-infeccao-ovular",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Rotura Prematura de Membros Ovulares e Infecção Ovular",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 171,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Rotura Prematura de Membras Ovulares (RPMO)• Corioamnionite",
            "oslerTopicsList": [
              "Rotura Prematura de Membras Ovulares (RPMO)",
              "Corioamnionite"
            ],
            "mappedOslerBlockIds": [
              "osler-rotura-prematura-de-membras-ovulares-rpmo",
              "osler-corioamnionite"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-trabalho-de-parto-prematuro",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Trabalho de parto prematuro",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 172,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Trabalho de Parto Prematuro",
            "oslerTopicsList": [
              "Trabalho de Parto Prematuro"
            ],
            "mappedOslerBlockIds": [
              "osler-trabalho-de-parto-prematuro"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-puerperio",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Puerpério",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 173,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Puerpério (Hemorragia Pós-Parto, Infecções Puerperais, Amamentação e Complicadas)",
            "oslerTopicsList": [
              "Puerpério (Hemorragia Pós-Parto, Infecções Puerperais, Amamentação e Complicadas)"
            ],
            "mappedOslerBlockIds": [
              "osler-puerperio-hemorragia-pos-parto-infeccoes-puerperais-amamentacao-e-complicadas"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sangramento-da-primeira-metade-da-gestacao",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Sangramento da Primeira Metade da Gestação",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 174,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Sangramentos da 1ª Metade (Abortamento, Gestação Ectópica, Doença & Neoplasia Trofoblástica Gestacional)",
            "oslerTopicsList": [
              "Sangramentos da 1ª Metade (Abortamento, Gestação Ectópica, Doença & Neoplasia Trofoblástica Gestacional)"
            ],
            "mappedOslerBlockIds": [
              "osler-sangramentos-da-1-metade-abortamento-gestacao-ectopica-doenca-neoplasia-trofoblastica-gestacional"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sangramento-da-segunda-metade-da-gestacao",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Sangramento da Segunda Metade da Gestação",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 175,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Sangramentos da 2ª Metade (Descolamento Prematuto de Placenta - DPP, Placenta Prévia e Acretismo, Rotura Uterina, Vasa Prévia)",
            "oslerTopicsList": [
              "Sangramentos da 2ª Metade (Descolamento Prematuto de Placenta - DPP, Placenta Prévia e Acretismo, Rotura Uterina, Vasa Prévia)"
            ],
            "mappedOslerBlockIds": [
              "osler-sangramentos-da-2-metade-descolamento-prematuto-de-placenta-dpp-placenta-previa-e-acretismo-rotura-uterina-vasa-previa"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-palm-coein",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "PALM-COEIN",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 176,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Sangramento Uterino Anormal (Adenomiose, Leiomiomas, Pólipos)",
            "oslerTopicsList": [
              "Sangramento Uterino Anormal (Adenomiose, Leiomiomas, Pólipos)"
            ],
            "mappedOslerBlockIds": [
              "osler-sangramento-uterino-anormal-adenomiose-leiomiomas-polipos"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-conceitos-em-sexualidade",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Conceitos em sexualidade",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 177,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Disfunção Sexual Feminina",
            "oslerTopicsList": [
              "Disfunção Sexual Feminina"
            ],
            "mappedOslerBlockIds": [
              "osler-disfuncao-sexual-feminina"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-disfuncoes-sexuais",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Disfunções Sexuais",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 178,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Disfunção Sexual Feminina",
            "oslerTopicsList": [
              "Disfunção Sexual Feminina"
            ],
            "mappedOslerBlockIds": [
              "osler-disfuncao-sexual-feminina"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-sofrimento-fetal",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Sofrimento Fetal",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 179,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Vitalidade Fetal e Crescimento (Cardiotocografia, Dopplervelocimetria e Perfil Biofísico)",
            "oslerTopicsList": [
              "Vitalidade Fetal e Crescimento (Cardiotocografia, Dopplervelocimetria e Perfil Biofísico)"
            ],
            "mappedOslerBlockIds": [
              "osler-vitalidade-fetal-e-crescimento-cardiotocografia-dopplervelocimetria-e-perfil-biofisico"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-ulceras-genitais",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Úlceras genitais",
            "theoryDurationMin": 360,
            "theoryCompleted": false,
            "medwayRowNumber": 180,
            "videoLessonsHours": 6,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Úlceras Genitais (Módulo de Infectologia / ISTs)",
            "oslerTopicsList": [
              "Úlceras Genitais (Módulo de Infectologia / ISTs)"
            ],
            "mappedOslerBlockIds": [
              "osler-ulceras-genitais-modulo-de-infectologia-ists"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-incontinencia-urinaria-e-prolapsos-de-orgaos-pelvicos",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Incontinência urinária e Prolapsos de Órgãos Pélvicos",
            "theoryDurationMin": 240,
            "theoryCompleted": false,
            "medwayRowNumber": 181,
            "videoLessonsHours": 4,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Uroginecologia (Incontinência Urinária, Prolapso de Órgãos Pélvicos)",
            "oslerTopicsList": [
              "Uroginecologia (Incontinência Urinária, Prolapso de Órgãos Pélvicos)"
            ],
            "mappedOslerBlockIds": [
              "osler-uroginecologia-incontinencia-urinaria-prolapso-de-orgaos-pelvicos"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-fistulas",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Fístulas",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 182,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Fístulas Genito-Urinárias",
            "oslerTopicsList": [
              "Fístulas Genito-Urinárias"
            ],
            "mappedOslerBlockIds": [
              "osler-fistulas-genito-urinarias"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-patologias-da-vulva-e-vagina",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Patologias da Vulva e Vagina",
            "theoryDurationMin": 300,
            "theoryCompleted": false,
            "medwayRowNumber": 183,
            "videoLessonsHours": 5,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Afecções da Vulva (Cisto de Bartholin, Dermatoses, Neoplasias da Vulva)",
            "oslerTopicsList": [
              "Afecções da Vulva (Cisto de Bartholin, Dermatoses, Neoplasias da Vulva)"
            ],
            "mappedOslerBlockIds": [
              "osler-afeccoes-da-vulva-cisto-de-bartholin-dermatoses-neoplasias-da-vulva"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          },
          {
            "id": "c-morte-materna",
            "areaId": "mod-ginecologia-e-obstetricia",
            "areaName": "Ginecologia e Obstetrícia",
            "moduloId": "mod-ginecologia-e-obstetricia",
            "moduloName": "Ginecologia e Obstetrícia",
            "name": "Morte materna",
            "theoryDurationMin": 60,
            "theoryCompleted": false,
            "medwayRowNumber": 184,
            "videoLessonsHours": 1,
            "theoryPdfsCount": 1,
            "preExercisesPdfCount": 1,
            "postExercisesPdfCount": 1,
            "oslerTopicsStatus": "• Mortalidade Materna",
            "oslerTopicsList": [
              "Mortalidade Materna"
            ],
            "mappedOslerBlockIds": [
              "osler-mortalidade-materna"
            ],
            "preVideoQuestions": {
              "totalAvailable": 10,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0
            },
            "postVideoQuestions": {
              "totalAvailable": 15,
              "completedCount": 0,
              "correctCount": 0,
              "accuracy": 0,
              "completionRate": 0
            },
            "learningGainPP": 0,
            "fsrs": {
              "stabilityDays": 0,
              "difficulty": 5.2,
              "retrievability": 0,
              "reps": 0,
              "state": "novo"
            },
            "examStats": {
              "realExamQuestions": 0,
              "realExamHits": 0,
              "simuladoQuestions": 0,
              "simuladoHits": 0
            },
            "incidence": {
              "usp": 0,
              "unifesp": 0,
              "ufmg": 0,
              "unicamp": 0,
              "enare": 0,
              "generalRating": "Média",
              "calculatedPriorityScore": 50
            },
            "estimatedMastery": 0,
            "targetMastery": 85,
            "isStudied": false,
            "isConsolidated": false,
            "status": "Não iniciado"
          }
        ],
        "totalContents": 37,
        "studiedContents": 0,
        "consolidatedContents": 0,
        "avgMastery": 0
      }
    ],
    "totalContents": 37,
    "studiedContents": 0,
    "consolidatedContents": 0,
    "avgMastery": 0,
    "totalHours": 155
  }
];
