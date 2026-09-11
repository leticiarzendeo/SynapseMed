// Estrutura de Armazenamento e Estatística de Incidência de Provas de Residência Médica
// Suporta USP-RP, USP-SP, UNICAMP, ENAMED e HIAE

export interface QuestionOccurrence {
  examYear: number;
  questionNumber: number;
  questionTheme: string;
  subtopic?: string;
  notes?: string;
}

export interface ContentIncidenceRecord {
  contentName: string;
  areaId: string;
  areaName: string;
  moduleId: string;
  moduleName: string;
  occurrencesCount: number;
  years: number[];
  questions: QuestionOccurrence[];
}

export interface ModuleIncidenceSummary {
  moduleId: string;
  moduleName: string;
  areaId: string;
  areaName: string;
  totalQuestions: number;
  percentageOfExam: number;
  yearsPresent: number[];
  topContents: { contentName: string; count: number; years: number[] }[];
}

export interface AreaIncidenceSummary {
  areaId: string;
  areaName: string;
  totalQuestions: number;
  percentageOfExam: number;
  modulesCount: number;
  modules: ModuleIncidenceSummary[];
}

export interface InstitutionIncidenceData {
  institutionId: string;
  institutionName: string;
  shortName: string;
  yearsAnalyzed: number[];
  totalQuestionsAnalyzed: number;
  areas: AreaIncidenceSummary[];
  contentsRanking: ContentIncidenceRecord[];
}

// =========================================================================================
// BANCO DE INCIDÊNCIA: USP-RP (FMRP-USP) - PROVAS 2021 A 2026 (6 ANOS / 620 QUESTÕES)
// =========================================================================================

export const uspRpIncidenceData: InstitutionIncidenceData = {
  institutionId: 'usp-rp',
  institutionName: 'Faculdade de Medicina de Ribeirão Preto da Universidade de São Paulo',
  shortName: 'USP-RP',
  yearsAnalyzed: [2021, 2022, 2023, 2024, 2025, 2026],
  totalQuestionsAnalyzed: 620, // 2021: 120 questões; 2022 a 2026: 100 questões cada
  areas: [
    {
      areaId: 'preventiva',
      areaName: 'Medicina Preventiva e Social',
      totalQuestions: 138,
      percentageOfExam: 22.26,
      modulesCount: 5,
      modules: [
        {
          moduleId: 'mod-prev-aps-starfield',
          moduleName: 'Atenção Primária à Saúde (APS) & Atributos de Starfield',
          areaId: 'preventiva',
          areaName: 'Medicina Preventiva e Social',
          totalQuestions: 38,
          percentageOfExam: 6.13,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Atributos Essenciais e Derivados da APS (Starfield: Primeiro Contato, Longitudinalidade, Orientação Comunitária)', count: 14, years: [2021, 2022, 2023, 2024, 2025, 2026] },
            { contentName: 'Abordagem Familiar e Ferramentas (Genograma, Ecomapa, Tipologias Familiares)', count: 9, years: [2022, 2023, 2025] },
            { contentName: 'Método Clínico Centrado na Pessoa (MCCP)', count: 5, years: [2023, 2024, 2026] },
            { contentName: 'Acesso e Dimensões da Acessibilidade na APS', count: 5, years: [2021, 2024, 2025] },
            { contentName: 'Transição do Cuidado e Gestão de Casos Complexos', count: 5, years: [2022, 2024, 2025] },
          ]
        },
        {
          moduleId: 'mod-prev-epidemiologia-estudos',
          moduleName: 'Epidemiologia & Desenhos de Estudos Epidemiológicos',
          areaId: 'preventiva',
          areaName: 'Medicina Preventiva e Social',
          totalQuestions: 32,
          percentageOfExam: 5.16,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Delineamento de Estudos (Ecológico, Coorte, Caso-Controle, Ensaio Clínico)', count: 16, years: [2021, 2022, 2023, 2024, 2025, 2026] },
            { contentName: 'Medidas de Associação e Frequência (Incidência, Prevalência, RR, OR, Risco Atribuível)', count: 9, years: [2021, 2022, 2023, 2025] },
            { contentName: 'Dinâmica de Transmissão e Potencial Epidêmico (R0, Períodos de Incubação e Transmissibilidade)', count: 7, years: [2021, 2023, 2024] }
          ]
        },
        {
          moduleId: 'mod-prev-testes-diagnosticos',
          moduleName: 'Testes Diagnósticos, Rastreamento & Bioestatística',
          areaId: 'preventiva',
          areaName: 'Medicina Preventiva e Social',
          totalQuestions: 26,
          percentageOfExam: 4.19,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Acurácia, Sensibilidade, Especificidade, VPP e VPN (Efeito da Prevalência)', count: 14, years: [2021, 2022, 2023, 2024, 2025, 2026] },
            { contentName: 'Curva ROC e Escolha de Pontos de Corte', count: 4, years: [2023, 2025] },
            { contentName: 'Princípios e Diretrizes de Rastreamento Populacional (Critérios de Wilson-Jungner)', count: 8, years: [2021, 2024, 2026] }
          ]
        },
        {
          moduleId: 'mod-prev-sus-politicas',
          moduleName: 'Sistema Único de Saúde (SUS), Legislação & Financiamento',
          areaId: 'preventiva',
          areaName: 'Medicina Preventiva e Social',
          totalQuestions: 24,
          percentageOfExam: 3.87,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Princípios Doutrinários e Organizacionais do SUS (Equidade, Integralidade, Descentralização, Hierarquização)', count: 10, years: [2021, 2022, 2023, 2024] },
            { contentName: 'Redes de Atenção à Saúde (RAS) e Instâncias Colegiadas (CIR, CIB, CIT)', count: 7, years: [2021, 2023, 2024, 2025] },
            { contentName: 'Financiamento do SUS e Atenção Primária (Previne Brasil, EC 29/141, Aplicação Mínima)', count: 7, years: [2021, 2023, 2024] }
          ]
        },
        {
          moduleId: 'mod-prev-vigilancia-ambiental',
          moduleName: 'Vigilância em Saúde, Vacinação no Adulto/Idoso & Saúde Ambiental',
          areaId: 'preventiva',
          areaName: 'Medicina Preventiva e Social',
          totalQuestions: 18,
          percentageOfExam: 2.90,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Imunização no Adulto, Idoso e Profissional de Saúde (Febre Amarela, Tétano, Hepatite B, Influenza, COVID-19)', count: 7, years: [2021, 2022, 2024, 2026] },
            { contentName: 'Acidentes por Animais Peçonhentos e Raiva Humana (Manejo Profilático)', count: 6, years: [2022, 2024, 2026] },
            { contentName: 'Saúde Ambiental, Poluição do Ar e Mudanças Climáticas Globais (SEEG, Efeito Estufa, Ondas de Calor)', count: 5, years: [2022, 2024, 2025, 2026] }
          ]
        }
      ]
    },
    {
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      totalQuestions: 130,
      percentageOfExam: 20.97,
      modulesCount: 7,
      modules: [
        {
          moduleId: 'mod-cardio',
          moduleName: 'Cardiologia',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 28,
          percentageOfExam: 4.52,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Hipertensão Arterial Sistêmica (Diagnóstico, MAPA, HAS secundária, Tratamento)', count: 10, years: [2021, 2022, 2023, 2024, 2025, 2026] },
            { contentName: 'Insuficiência Cardíaca Congestiva (IC com FE reduzida, Descompensação, Beribéri/Tiamina)', count: 7, years: [2021, 2023, 2024, 2026] },
            { contentName: 'Síndrome Coronariana Aguda & Doença Arterial Coronariana Estável', count: 5, years: [2021, 2022, 2023, 2024] },
            { contentName: 'Valvopatias Cardíacas (Estenose e Insuficiência Aórtica, Estenose Mitral Reumática, Fonogramas)', count: 4, years: [2021, 2022, 2024, 2026] },
            { contentName: 'Pericardiopatias e Miocardiopatias (Takotsubo, Pericardite Aguda, Constritiva)', count: 2, years: [2021, 2024] }
          ]
        },
        {
          moduleId: 'mod-endocrino',
          moduleName: 'Endocrinologia & Metabologia',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 21,
          percentageOfExam: 3.39,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Diabetes Mellitus Tipo 2 (Metas terapêuticas, iSGLT2, análogos GLP-1, Insulinas)', count: 9, years: [2022, 2024, 2025, 2026] },
            { contentName: 'Tireoidopatias (Hipotireoidismo primário, Doença de Graves, Tempestade Tireoidiana)', count: 6, years: [2021, 2022, 2024, 2026] },
            { contentName: 'Doenças da Adrenal e Hipófise (Insuficiência Adrenal / Addison, Síndrome de Cushing, Prolactinoma)', count: 4, years: [2021, 2022, 2023] },
            { contentName: 'Distúrbios do Metabolismo Ósseo (Osteoporose, Hipercalcemia e Hiperparatireoidismo na DRC)', count: 2, years: [2024, 2026] }
          ]
        },
        {
          moduleId: 'mod-pneumo',
          moduleName: 'Pneumologia',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 19,
          percentageOfExam: 3.06,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Doença Pulmonar Obstrutiva Crônica (DPOC: Diagnóstico, GOLD, Exacerbação Aguda, VNI e Oxigenoterapia)', count: 8, years: [2021, 2022, 2024, 2025, 2026] },
            { contentName: 'Asma no Adulto (Controle, GINA, Espirometria e Corticoides Inalatórios)', count: 4, years: [2024, 2025, 2026] },
            { contentName: 'Derrame Pleural (Critérios de Light, Empiema, Quilotórax)', count: 4, years: [2023, 2024, 2025] },
            { contentName: 'Doenças Pulmonares Intersticiais & Pneumopatias Ocupacionais (Silicose, Fibrose Pulmonar)', count: 3, years: [2022, 2024, 2026] }
          ]
        },
        {
          moduleId: 'mod-nefro',
          moduleName: 'Nefrologia & Meio Interno',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 19,
          percentageOfExam: 3.06,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Doença Renal Crônica (Estadiamento KDIGO, Relação Albuminúria/Creatinúria, Complicações)', count: 6, years: [2021, 2022, 2024, 2026] },
            { contentName: 'Glomerulopatias (Nefropatia por IgA, Síndrome Nefrótica/Lesões Mínimas, GNPE)', count: 5, years: [2022, 2023] },
            { contentName: 'Distúrbios Hidroeletrolíticos e Ácido-Básicos (Hipercalemia, Hiponatremia, Acidose Metabólica e Ânion Gap)', count: 5, years: [2023, 2024, 2026] },
            { contentName: 'Lesão Renal Aguda (LRA: Etiologias pré-renal, intrínseca, lise tumoral e nefrite intersticial)', count: 3, years: [2021, 2024] }
          ]
        },
        {
          moduleId: 'mod-infecto',
          moduleName: 'Infectologia',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 18,
          percentageOfExam: 2.90,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Hanseníase (Classificação operacional PQT-U, Reação Tipo 1 e Tipo 2/Eritema Nodoso)', count: 5, years: [2021, 2022, 2023, 2026] },
            { contentName: 'HIV/AIDS & Infecções Oportunistas (Pneumocistose, Carga Viral, CD4, Diagnóstico Sorológico)', count: 4, years: [2024, 2025, 2026] },
            { contentName: 'Micoses Sistêmicas e Endêmicas (Paracoccidioidomicose, Histoplasmose, Esporotricose)', count: 4, years: [2021, 2022, 2026] },
            { contentName: 'Febre Maculosa e Riquetsioses (Transmissão por carrapato-estrela, Doxiciclina)', count: 2, years: [2024, 2025] },
            { contentName: 'Tuberculose (Tratamento RIPE, Hepatotoxicidade e Efeitos Adversos)', count: 3, years: [2021, 2023, 2024] }
          ]
        },
        {
          moduleId: 'mod-reumato',
          moduleName: 'Reumatologia',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 14,
          percentageOfExam: 2.26,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Artrite Reumatoide (Quadro clínico articular, erosões marginais, FR e anti-CCP, DMARDs)', count: 4, years: [2022, 2024, 2026] },
            { contentName: 'Artrites Microcristalinas (Gota tofácea crônica, punção articular e cristais de urato)', count: 4, years: [2022, 2023, 2024, 2026] },
            { contentName: 'Lúpus Eritematoso Sistêmico (Critérios diagnósticos, FAN, manifestações cutâneo-articulares)', count: 3, years: [2022, 2024, 2026] },
            { contentName: 'Espondiloartrites e Polimialgia Reumática', count: 3, years: [2021, 2023, 2025] }
          ]
        },
        {
          moduleId: 'mod-hemato-neuro-gastro',
          moduleName: 'Hematologia, Neurologia & Gastroenterologia',
          areaId: 'clinica',
          areaName: 'Clínica Médica',
          totalQuestions: 11,
          percentageOfExam: 1.77,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Anemias Carenciais e Hemolíticas (Deficiência de B12/Megaloblástica, Ferropriva, Anemia Hemolítica Microangiopática)', count: 5, years: [2021, 2022, 2024, 2025] },
            { contentName: 'Acidente Vascular Cerebral (AVC Isquêmico e Hemorrágico, Topografia Tronco/Ponte/Cerebelo)', count: 3, years: [2021, 2024, 2026] },
            { contentName: 'Síndromes Demenciais e Delirium no Idoso (Alzheimer, Corpúsculos de Lewy, Antipsicóticos atípicos)', count: 3, years: [2021, 2022, 2025] }
          ]
        }
      ]
    },
    {
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      totalQuestions: 122,
      percentageOfExam: 19.68,
      modulesCount: 5,
      modules: [
        {
          moduleId: 'mod-cir-trauma',
          moduleName: 'Trauma & Urgências Cirúrgicas (ATLS)',
          areaId: 'cirurgia',
          areaName: 'Cirurgia Geral',
          totalQuestions: 34,
          percentageOfExam: 5.48,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Trauma Torácico (Pneumotórax drenado com fuga aérea/lesão traqueobrônquica, Hemotórax retido/VATS)', count: 9, years: [2021, 2022, 2023, 2025, 2026] },
            { contentName: 'Queimaduras (Fórmula de reposição volêmica ATLS 10ª/11ª ed, lesão inalatória e profundidade)', count: 8, years: [2021, 2022, 2023, 2024, 2026] },
            { contentName: 'Choque Hemorrágico no Trauma e Transfusão Maciça (Protocolos 1:1:1, Ácido Tranexâmico, Hipotensão Permissiva)', count: 7, years: [2023, 2024, 2025] },
            { contentName: 'Trauma Abdominal Fechado e Penetrante (Critérios de laparotomia, lesões esplênicas e hepáticas)', count: 6, years: [2021, 2023, 2024, 2025] },
            { contentName: 'Trauma Raquimedular e Cranioencefálico (Choque Neurogênico, Craniectomia)', count: 4, years: [2021, 2022, 2024] }
          ]
        },
        {
          moduleId: 'mod-cir-abdome',
          moduleName: 'Abdome Agudo Cirúrgico & Doenças das Vias Biliares',
          areaId: 'cirurgia',
          areaName: 'Cirurgia Geral',
          totalQuestions: 30,
          percentageOfExam: 4.84,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Colecistite Aguda e Coledocolitíase (Tóquio Guidelines, Colecistectomia precoce vs Drenagem percutânea)', count: 9, years: [2021, 2023, 2025, 2026] },
            { contentName: 'Apendicite Aguda (Escores clínicos, complicações perfurativas, abscessos pós-operatórios)', count: 8, years: [2023, 2024, 2025, 2026] },
            { contentName: 'Pancreatite Aguda Biliar e Necrosante (Critérios de gravidade, estratificação tomográfica)', count: 5, years: [2021, 2023] },
            { contentName: 'Abdome Agudo Obstrutivo (Brida/Aderência, Volvo de Sigmoide, Pseudo-obstrução de Ogilvie)', count: 5, years: [2023, 2024, 2026] },
            { contentName: 'Diverticulite Aguda do Cólon (Hinchey, Conduta clínica vs cirúrgica)', count: 3, years: [2023, 2025] }
          ]
        },
        {
          moduleId: 'mod-cir-vascular-toracica',
          moduleName: 'Cirurgia Vascular & Torácica',
          areaId: 'cirurgia',
          areaName: 'Cirurgia Geral',
          totalQuestions: 24,
          percentageOfExam: 3.87,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Oclusão Arterial Aguda vs Trombose Arterial Aguda (Classificação de Rutherford e Fogarty)', count: 7, years: [2021, 2022, 2023, 2026] },
            { contentName: 'Doença Arterial Obstrutiva Periférica (DAOP: Claudicação intermitente, ITB, Úlcera isquêmica e Revascularização)', count: 6, years: [2021, 2022, 2023, 2024, 2025] },
            { contentName: 'Aneurisma de Aorta Abdominal (Indicação cirúrgica, diâmetro de corte, rotura e técnica endovascular vs aberta)', count: 5, years: [2022, 2023, 2024] },
            { contentName: 'Insuficiência Venosa Crônica e Doença Tromboembólica (Úlcera venosa estase, profilaxia pós-cirúrgica de TEV)', count: 4, years: [2021, 2024, 2025, 2026] },
            { contentName: 'Nódulo Pulmonar Solitário e Câncer de Pulmão (Investigação por EBUS/Biópsia)', count: 2, years: [2021, 2022] }
          ]
        },
        {
          moduleId: 'mod-cir-geral-perioperatorio',
          moduleName: 'Cirurgia Geral, Perioperatório, Parede Abdominal & Cicatrização',
          areaId: 'cirurgia',
          areaName: 'Cirurgia Geral',
          totalQuestions: 20,
          percentageOfExam: 3.23,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Hérnias da Parede Abdominal (Inguinal, Femoral, Técnicas cirúrgicas)', count: 6, years: [2022, 2024, 2025] },
            { contentName: 'Avaliação Pré-Operatória e Risco Cirúrgico (Classificação ASA, Manejo de Anticoagulantes e Antidiabéticos)', count: 5, years: [2025, 2026] },
            { contentName: 'Complicações de Ferida Operatória e Cicatrização (Deiscência fascial, Seroma, Infecção de Sítio Cirúrgico)', count: 5, years: [2021, 2022, 2024, 2025] },
            { contentName: 'Cirurgia Bariátrica e Complicações Metabólico-Cirúrgicas (Bypass em Y de Roux, Wernicke, Rabdomiólise)', count: 4, years: [2024, 2025] }
          ]
        },
        {
          moduleId: 'mod-cir-especialidades',
          moduleName: 'Especialidades Cirúrgicas (Urologia, Proctologia, Cabeça e Pescoço & Plástica)',
          areaId: 'cirurgia',
          areaName: 'Cirurgia Geral',
          totalQuestions: 14,
          percentageOfExam: 2.26,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Escroto Agudo e Urologia (Torção Testicular vs Orquiepididimite, Câncer de Testículo, Próstata/PSA)', count: 5, years: [2023, 2024, 2025, 2026] },
            { contentName: 'Tumores Cutâneos (Carcinoma Basocelular, Espinocelular, Melanoma e Margens Cirúrgicas / Linfonodo Sentinela)', count: 4, years: [2021, 2022, 2025, 2026] },
            { contentName: 'Doenças Orificiais (Doença Hemorroidária avançada, Fasceíte Necrosante / Fournier)', count: 3, years: [2026] },
            { contentName: 'Traqueostomia e Complicações (Fístula traqueo-inominada, Estenose traqueal)', count: 2, years: [2021, 2022] }
          ]
        }
      ]
    },
    {
      areaId: 'pediatria',
      areaName: 'Pediatria',
      totalQuestions: 116,
      percentageOfExam: 18.71,
      modulesCount: 5,
      modules: [
        {
          moduleId: 'mod-ped-puericultura-desenvolvimento',
          moduleName: 'Puericultura, Crescimento, Desenvolvimento & Nutrição',
          areaId: 'pediatria',
          areaName: 'Pediatria',
          totalQuestions: 30,
          percentageOfExam: 4.84,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Baixa Estatura (Variante Normal: Atraso Constitucional vs Baixa Estatura Familiar vs Patologias Endócrinas)', count: 8, years: [2021, 2022, 2023, 2026] },
            { contentName: 'Marcos do Desenvolvimento Neuropsicomotor e Triagens (Autismo, TDAH, Distúrbios de Linguagem)', count: 8, years: [2021, 2023, 2024, 2025] },
            { contentName: 'Aleitamento Materno, Alimentação Complementar & Fórmulas Infantis', count: 6, years: [2021, 2024, 2025, 2026] },
            { contentName: 'Suplementação Profilática de Ferro e Vitaminas na Infância (SBP)', count: 4, years: [2024, 2025] },
            { contentName: 'Desnutrição Infantil (Marasmo, Kwashiorkor) e Obesidade Infantil / Síndromes Genéticas (Prader-Willi)', count: 4, years: [2021, 2022, 2024] }
          ]
        },
        {
          moduleId: 'mod-ped-neonatologia',
          moduleName: 'Neonatologia & Sala de Parto',
          areaId: 'pediatria',
          areaName: 'Pediatria',
          totalQuestions: 26,
          percentageOfExam: 4.19,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Reanimação Neonatal em Sala de Parto (Passos Iniciais, VPP em ar ambiente/oxigênio titulado, Massagem Cardíaca)', count: 8, years: [2021, 2022, 2023, 2024, 2025] },
            { contentName: 'Icterícia Neonatal (Fisiológica vs Patológica, Incompatibilidade ABO/Rh, Critérios de Fototerapia)', count: 7, years: [2022, 2024, 2026] },
            { contentName: 'Perda Ponderal Fisiológica do Recém-Nascido e Apojadura', count: 3, years: [2024, 2025] },
            { contentName: 'Sepse Neonatal Precoce e Fatores de Risco Maternos', count: 4, years: [2021, 2025] },
            { contentName: 'Triagem Neonatal Biológica (Teste do Pezinho Ampliado: SCID, Fenilcetonúria, Hipotireoidismo Congênito)', count: 4, years: [2022, 2026] }
          ]
        },
        {
          moduleId: 'mod-ped-infecciosas-respiratorias',
          moduleName: 'Infectologia Pediátrica & Doenças Respiratórias',
          areaId: 'pediatria',
          areaName: 'Pediatria',
          totalQuestions: 24,
          percentageOfExam: 3.87,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Asma e Bebê Chiador (Manejo de Crise Aguda, Corticoides, Broncodilatadores, Sinais de Gravidade)', count: 7, years: [2021, 2023, 2024, 2025] },
            { contentName: 'Pneumonias Adquiridas na Comunidade (PAC: Amoxicilina ambulatorial vs Ampicilina hospitalar)', count: 5, years: [2021, 2023, 2024] },
            { contentName: 'Doenças Exantemáticas (Sarampo, Escarlatina, Kawasaki / SIM-P)', count: 5, years: [2021, 2024, 2026] },
            { contentName: 'Infecções de Vias Aéreas Superiores (Faringotonsilite bacteriana, IVAS de repetição)', count: 4, years: [2021, 2023, 2024] },
            { contentName: 'Infecções Congênitas (Toxoplasmose Congênita, Sífilis Congênita, CMV)', count: 3, years: [2021, 2023] }
          ]
        },
        {
          moduleId: 'mod-ped-emergencias-urgencias',
          moduleName: 'Emergências Pediátricas, Choque & Intoxicações',
          areaId: 'pediatria',
          areaName: 'Pediatria',
          totalQuestions: 20,
          percentageOfExam: 3.23,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Choque na Infância (Distributivo/Séptico vs Obstrutivo vs Hipovolêmico/Cardiogênico)', count: 6, years: [2021, 2024, 2025] },
            { contentName: 'Crise Convulsiva e Estado de Mal Epiléptico (Crise Febril Simples vs Complexa, Midazolam/Benzodiazepínicos)', count: 5, years: [2022, 2024, 2025] },
            { contentName: 'Intoxicações Agudas Exógenas e Acidentes na Infância (Escorpionismo e Soro Antiescorpiônico, Paracetamol, Hidrocarbonetos)', count: 5, years: [2022, 2024, 2025, 2026] },
            { contentName: 'Cetoacidose Diabética na Infância (Manejo de Hidratação e Insulina)', count: 4, years: [2021, 2025] }
          ]
        },
        {
          moduleId: 'mod-ped-cirurgia-especialidades',
          moduleName: 'Cirurgia Pediátrica & Especialidades (Nefro, Gastro, Reumato Pediátrica)',
          areaId: 'pediatria',
          areaName: 'Pediatria',
          totalQuestions: 16,
          percentageOfExam: 2.58,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Estenose Hipertrófica do Piloro (Alcalose Metabólica Hipoclorêmica, Piloromiotomia de Fredet-Ramstedt)', count: 4, years: [2022, 2024, 2025] },
            { contentName: 'Invaginação Intestinal / Intussuscepção (Sinal de Dance, Fezes em geleia de morango, Redução hidrostática por enema)', count: 4, years: [2021, 2023, 2024] },
            { contentName: 'Glomerulopatias e ITU na Infância (GNPE, Síndrome Nefrótica Idiopática, Investigação de primeiro episódio de ITU febril)', count: 4, years: [2021, 2022, 2024, 2026] },
            { contentName: 'Constipação Crônica Funcional vs Doença de Hirschsprung', count: 4, years: [2021, 2025] }
          ]
        }
      ]
    },
    {
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      totalQuestions: 114,
      percentageOfExam: 18.39,
      modulesCount: 5,
      modules: [
        {
          moduleId: 'mod-go-obstetricia-patologias',
          moduleName: 'Obstetrícia: Patologias da Gestação & Pré-Natal',
          areaId: 'ginecologia-obstetricia',
          areaName: 'Ginecologia e Obstetrícia',
          totalQuestions: 32,
          percentageOfExam: 5.16,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Síndromes Hipertensivas da Gestação (Pré-Eclâmpsia, Eclâmpsia, Sulfato de Magnésio de Pritchard/Zuspan, Profilaxia com AAS/Cálcio)', count: 12, years: [2021, 2022, 2023, 2024, 2025, 2026] },
            { contentName: 'Diabetes Mellitus Gestacional (Critérios diagnósticos TOTG 75g, Metas glicêmicas, Insulinoterapia/Metformina)', count: 7, years: [2021, 2023, 2024, 2025, 2026] },
            { contentName: 'Infecções Congênitas e Triagem no Pré-Natal (Sífilis na Gestação e Tratamento do Parceiro, Toxoplasmose e Teste de Avidez, HIV e Hepatite B)', count: 8, years: [2021, 2022, 2023, 2024, 2025] },
            { contentName: 'Aloimunização Rh (Profilaxia com Imunoglobulina Anti-D, Coombs Indireto)', count: 5, years: [2022, 2024] }
          ]
        },
        {
          moduleId: 'mod-go-obstetricia-parto',
          moduleName: 'Obstetrícia: Trabalho de Parto, Partograma, Puerpério & Hemorragia Pós-Parto',
          areaId: 'ginecologia-obstetricia',
          areaName: 'Ginecologia e Obstetrícia',
          totalQuestions: 28,
          percentageOfExam: 4.52,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Assistência ao Parto e Humanização (Fase Ativa, Plano de Parto, Partograma da OMS, Analgesia, Mecanismos do Parto)', count: 10, years: [2021, 2022, 2023, 2025, 2026] },
            { contentName: 'Hemorragia Pós-Parto (Atonia Uterina, Condutas Sequenciais: Massagem, Ocitocina, Ácido Tranexâmico, Balão de Bakri, B-Lynch)', count: 7, years: [2024, 2025, 2026] },
            { contentName: 'Avaliação da Vitalidade Fetal (Cardiotocografia intraparto, Perfil Biofísico Fetal, Doppler de Artéria Umbilical e Cerebral Média)', count: 6, years: [2021, 2023, 2024, 2025, 2026] },
            { contentName: 'Prematuridade e Ruptura Prematura de Membranas Ovulares (RPMO / Corioamnionite, Tocólise, Corticoterapia e Neuroproteção)', count: 5, years: [2021, 2023, 2025] }
          ]
        },
        {
          moduleId: 'mod-go-oncologia-trato-inferior',
          moduleName: 'Oncologia Ginecológica & Rastreamento (Colo, Mama e Endométrio)',
          areaId: 'ginecologia-obstetricia',
          areaName: 'Ginecologia e Obstetrícia',
          totalQuestions: 22,
          percentageOfExam: 3.55,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Rastreamento de Câncer de Colo Uterino (Diretrizes INCA: Citopatologia, Condutas em ASC-US, LSIL, HSIL e AGC)', count: 8, years: [2021, 2022, 2023, 2024, 2025] },
            { contentName: 'Rastreamento e Lesões Mamárias (Mamografia, Categorias BI-RADS 0, 3, 4, 5, PAAF/Core Biopsy e Hiperplasia Ductal Atípica)', count: 8, years: [2021, 2022, 2023, 2024, 2025, 2026] },
            { contentName: 'Câncer de Endométrio e Sangramento Pós-Menopausa (Espessura endometrial na USTV, Biópsia endometrial)', count: 6, years: [2021, 2023, 2026] }
          ]
        },
        {
          moduleId: 'mod-go-ginecologia-geral',
          moduleName: 'Ginecologia Geral, Planejamento Familiar & Sangramento Uterino Anormal',
          areaId: 'ginecologia-obstetricia',
          areaName: 'Ginecologia e Obstetrícia',
          totalQuestions: 18,
          percentageOfExam: 2.90,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Contracepção e Critérios Médicos de Elegibilidade da OMS (MEC 1 a 4, DIU/SIU, Métodos em comorbidades)', count: 7, years: [2021, 2022, 2024, 2025] },
            { contentName: 'Sangramento Uterino Anormal (Classificação PALM-COEIN, Miomatose e Adenomiose)', count: 6, years: [2023, 2024, 2025, 2026] },
            { contentName: 'Infecções Genitais e Doença Inflamatória Pélvica (DIP, Vaginose Bacteriana, Candidíase)', count: 5, years: [2021, 2022, 2024, 2026] }
          ]
        },
        {
          moduleId: 'mod-go-uroginecologia-endocrino',
          moduleName: 'Uroginecologia, Prolapso Genital & Endocrinologia Ginecológica',
          areaId: 'ginecologia-obstetricia',
          areaName: 'Ginecologia e Obstetrícia',
          totalQuestions: 14,
          percentageOfExam: 2.26,
          yearsPresent: [2021, 2022, 2023, 2024, 2025, 2026],
          topContents: [
            { contentName: 'Incontinência Urinária Feminina e Estudo Urodinâmico (IUE vs Bexiga Hiperativa, Slings e Antimuscarínicos/Mirabegrona)', count: 5, years: [2021, 2024, 2025, 2026] },
            { contentName: 'Prolapso de Órgãos Pélvicos e Estadiamento POP-Q', count: 4, years: [2021, 2023, 2026] },
            { contentName: 'Síndrome dos Ovários Policísticos (SOP) & Amenorreias Primária/Secundária', count: 5, years: [2021, 2023, 2024, 2025] }
          ]
        }
      ]
    }
  ],
  contentsRanking: [
    {
      contentName: 'Síndromes Hipertensivas da Gestação (Pré-Eclâmpsia, Eclâmpsia, Manejo com Sulfato de Mg e Profilaxia)',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-obstetricia-patologias',
      moduleName: 'Obstetrícia: Patologias da Gestação & Pré-Natal',
      occurrencesCount: 12,
      years: [2021, 2022, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Atributos da Atenção Primária à Saúde (Starfield: Primeiro Contato, Longitudinalidade, Coordenação, Orientação Comunitária)',
      areaId: 'preventiva',
      areaName: 'Medicina Preventiva e Social',
      moduleId: 'mod-prev-aps-starfield',
      moduleName: 'Atenção Primária à Saúde (APS) & Atributos de Starfield',
      occurrencesCount: 14,
      years: [2021, 2022, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Testes Diagnósticos: Sensibilidade, Especificidade, VPP e VPN (Impacto da Prevalência)',
      areaId: 'preventiva',
      areaName: 'Medicina Preventiva e Social',
      moduleId: 'mod-prev-testes-diagnosticos',
      moduleName: 'Testes Diagnósticos, Rastreamento & Bioestatística',
      occurrencesCount: 14,
      years: [2021, 2022, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Delineamento de Estudos Epidemiológicos (Ecológico, Coorte, Caso-Controle, Ensaios Clínicos)',
      areaId: 'preventiva',
      areaName: 'Medicina Preventiva e Social',
      moduleId: 'mod-prev-epidemiologia-estudos',
      moduleName: 'Epidemiologia & Desenhos de Estudos Epidemiológicos',
      occurrencesCount: 16,
      years: [2021, 2022, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Hipertensão Arterial Sistêmica (Diagnóstico, MAPA, HAS Resistente/Secundária e Tratamento)',
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduleId: 'mod-cardio',
      moduleName: 'Cardiologia',
      occurrencesCount: 10,
      years: [2021, 2022, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Trabalho de Parto, Partograma, Mecanismos do Parto e Assistência Humanizada',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-obstetricia-parto',
      moduleName: 'Obstetrícia: Trabalho de Parto, Partograma, Puerpério & Hemorragia Pós-Parto',
      occurrencesCount: 10,
      years: [2021, 2022, 2023, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Colecistite Aguda e Doenças das Vias Biliares (Colelitíase, Coledocolitíase, Conduta Laparoscópica)',
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduleId: 'mod-cir-abdome',
      moduleName: 'Abdome Agudo Cirúrgico & Doenças das Vias Biliares',
      occurrencesCount: 9,
      years: [2021, 2023, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Trauma Torácico (Drenagem pleural, lesão traqueobrônquica com borbulhamento contínuo, hemotórax)',
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduleId: 'mod-cir-trauma',
      moduleName: 'Trauma & Urgências Cirúrgicas (ATLS)',
      occurrencesCount: 9,
      years: [2021, 2022, 2023, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Queimaduras (Cálculo de reposição volêmica ATLS 10ª/11ª ed., profundidade e lesão inalatória)',
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduleId: 'mod-cir-trauma',
      moduleName: 'Trauma & Urgências Cirúrgicas (ATLS)',
      occurrencesCount: 8,
      years: [2021, 2022, 2023, 2024, 2026],
      questions: []
    },
    {
      contentName: 'Reanimação Neonatal em Sala de Parto (Passos iniciais, VPP, indicação de massagem cardíaca)',
      areaId: 'pediatria',
      areaName: 'Pediatria',
      moduleId: 'mod-ped-neonatologia',
      moduleName: 'Neonatologia & Sala de Parto',
      occurrencesCount: 8,
      years: [2021, 2022, 2023, 2024, 2025],
      questions: []
    },
    {
      contentName: 'Rastreamento de Câncer de Mama e Lesões Mamárias (BI-RADS 0, 3, 4, 5, Mamografia e Biópsias)',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-oncologia-trato-inferior',
      moduleName: 'Oncologia Ginecológica & Rastreamento (Colo, Mama e Endométrio)',
      occurrencesCount: 8,
      years: [2021, 2022, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Rastreamento de Câncer de Colo Uterino (Diretrizes INCA: Condutas para ASC-US, LSIL, HSIL e AGC)',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-oncologia-trato-inferior',
      moduleName: 'Oncologia Ginecológica & Rastreamento (Colo, Mama e Endométrio)',
      occurrencesCount: 8,
      years: [2021, 2022, 2023, 2024, 2025],
      questions: []
    },
    {
      contentName: 'DPOC: Diagnóstico espirométrico GOLD, Exacerbação e Manejo Ventilatório',
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduleId: 'mod-pneumo',
      moduleName: 'Pneumologia',
      occurrencesCount: 8,
      years: [2021, 2022, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Apendicite Aguda e Complicações (Abscesso cavitário, Escores de Alvarado, Apendicectomia)',
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduleId: 'mod-cir-abdome',
      moduleName: 'Abdome Agudo Cirúrgico & Doenças das Vias Biliares',
      occurrencesCount: 8,
      years: [2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Baixa Estatura na Infância (Atraso Constitucional do Crescimento vs Baixa Estatura Familiar)',
      areaId: 'pediatria',
      areaName: 'Pediatria',
      moduleId: 'mod-ped-puericultura-desenvolvimento',
      moduleName: 'Puericultura, Crescimento, Desenvolvimento & Nutrição',
      occurrencesCount: 8,
      years: [2021, 2022, 2023, 2026],
      questions: []
    },
    {
      contentName: 'Marcos do Desenvolvimento Infantil e Neuropsiquiatria (Autismo / TEA, TDAH, Distúrbios de fala)',
      areaId: 'pediatria',
      areaName: 'Pediatria',
      moduleId: 'mod-ped-puericultura-desenvolvimento',
      moduleName: 'Puericultura, Crescimento, Desenvolvimento & Nutrição',
      occurrencesCount: 8,
      years: [2021, 2023, 2024, 2025],
      questions: []
    },
    {
      contentName: 'Oclusão Arterial Aguda e Isquemia Crônica de Membros (Fogarty, Rutherford, DAOP e ITB)',
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduleId: 'mod-cir-vascular-toracica',
      moduleName: 'Cirurgia Vascular & Torácica',
      occurrencesCount: 8,
      years: [2021, 2022, 2023, 2024, 2026],
      questions: []
    },
    {
      contentName: 'Icterícia Neonatal (Investigação de hiperbilirrubinemia direta/indireta, fototerapia e Kernicterus)',
      areaId: 'pediatria',
      areaName: 'Pediatria',
      moduleId: 'mod-ped-neonatologia',
      moduleName: 'Neonatologia & Sala de Parto',
      occurrencesCount: 7,
      years: [2022, 2024, 2026],
      questions: []
    },
    {
      contentName: 'Diabetes Mellitus Tipo 2 no Adulto (Metas glicêmicas, iSGLT2, Metformina e Insulinoterapia)',
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduleId: 'mod-endocrino',
      moduleName: 'Endocrinologia & Metabologia',
      occurrencesCount: 9,
      years: [2022, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Diabetes Mellitus Gestacional (Diagnóstico precoce/tardio, Conduta nutricional, Metformina e Insulina)',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-obstetricia-patologias',
      moduleName: 'Obstetrícia: Patologias da Gestação & Pré-Natal',
      occurrencesCount: 7,
      years: [2021, 2023, 2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Hemorragia Pós-Parto e Atonia Uterina (Manejo medicamentoso e cirúrgico sequencial)',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-obstetricia-parto',
      moduleName: 'Obstetrícia: Trabalho de Parto, Partograma, Puerpério & Hemorragia Pós-Parto',
      occurrencesCount: 7,
      years: [2024, 2025, 2026],
      questions: []
    },
    {
      contentName: 'Contracepção e Critérios Médicos de Elegibilidade da OMS',
      areaId: 'ginecologia-obstetricia',
      areaName: 'Ginecologia e Obstetrícia',
      moduleId: 'mod-go-ginecologia-geral',
      moduleName: 'Ginecologia Geral, Planejamento Familiar & Sangramento Uterino Anormal',
      occurrencesCount: 7,
      years: [2021, 2022, 2024, 2025],
      questions: []
    },
    {
      contentName: 'Asma na Infância e Manejo de Crise Aguda / Sibilância Recorrente',
      areaId: 'pediatria',
      areaName: 'Pediatria',
      moduleId: 'mod-ped-infecciosas-respiratorias',
      moduleName: 'Infectologia Pediátrica & Doenças Respiratórias',
      occurrencesCount: 7,
      years: [2021, 2023, 2024, 2025],
      questions: []
    },
    {
      contentName: 'Insuficiência Cardíaca Congestiva (ICFER, tratamento quádruplo, descompensação)',
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduleId: 'mod-cardio',
      moduleName: 'Cardiologia',
      occurrencesCount: 7,
      years: [2021, 2023, 2024, 2026],
      questions: []
    },
    {
      contentName: 'Choque Hemorrágico no Trauma e Transfusão Maciça (Protocolo 1:1:1 e Hipotensão Permissiva)',
      areaId: 'cirurgia',
      areaName: 'Cirurgia Geral',
      moduleId: 'mod-cir-trauma',
      moduleName: 'Trauma & Urgências Cirúrgicas (ATLS)',
      occurrencesCount: 7,
      years: [2023, 2024, 2025],
      questions: []
    },
    {
      contentName: 'Doença Renal Crônica (Estadiamento, Albuminúria, Hiperparatireoidismo secundário/terciário)',
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduleId: 'mod-nefro',
      moduleName: 'Nefrologia & Meio Interno',
      occurrencesCount: 6,
      years: [2021, 2022, 2024, 2026],
      questions: []
    },
    {
      contentName: 'Hanseníase (Classificação operacional, Forma Tuberculóide/Virchowiana, Reações Hansênicas)',
      areaId: 'clinica',
      areaName: 'Clínica Médica',
      moduleId: 'mod-infecto',
      moduleName: 'Infectologia',
      occurrencesCount: 5,
      years: [2021, 2022, 2023, 2026],
      questions: []
    }
  ]
};

// Estrutura comparativa para quando as próximas instituições forem enviadas
export interface MultiInstitutionDatabase {
  institutions: Record<string, InstitutionIncidenceData>;
}

export const institutionsDatabase: MultiInstitutionDatabase = {
  institutions: {
    'usp-rp': uspRpIncidenceData,
    // Próximas instituições reservadas:
    // 'usp-sp': ...,
    // 'unicamp': ...,
    // 'enamed': ...,
    // 'hiae': ...
  }
};
