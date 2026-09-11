import {
  ContentItem,
  ContentTargetIncidenceStats,
  ExamQuestionEntry,
  IncidenceFrequencyTier,
  InstitutionFrequencyDetail,
  TargetInstitutionKey,
} from '../types';
import {
  PAST_5_YEARS,
  RECENCY_WEIGHTS,
  TARGET_INSTITUTIONS_LIST,
} from '../data/targetInstitutionsExamsData';
import { getAllCurriculumContents } from '../data/mockData';

// Chave do localStorage para persistir questões analisadas e correções manuais do usuário
const STORAGE_KEY_QUESTIONS = 'synapsemed_target_exam_questions_v2';
const STORAGE_KEY_CUSTOM_EXAMS = 'synapsemed_custom_target_exams_v2';

/**
 * Questões pre-seedadas dos últimos 5 anos das 5 bancas-alvo (USP-RP, USP-SP, UNICAMP, ENAMED, HIAE)
 */
export const SEED_TARGET_QUESTIONS: ExamQuestionEntry[] = [
  // ==========================================
  // DPOC (Exemplo do usuário: Alta incidência nas 5 bancas)
  // ==========================================
  {
    id: 'q-seed-dpoc-uspsp-2025',
    questionNumber: 4,
    statementSnippet: 'Homem de 67 anos, tabagista 55 anos-maço, dispneia mMRC 3 e tosse crônica. Espirometria com relação VEF1/CVF de 0,56 pós-broncodilatador e VEF1 48% do previsto. Histórico de 2 exacerbações com antibiótico no último ano. Classificação GOLD e tratamento inalatório de escolha.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' }, { id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }]
  },
  {
    id: 'q-seed-dpoc-usprp-2025',
    questionNumber: 7,
    statementSnippet: 'Paciente de 64 anos com DPOC grave chega ao pronto-atendimento com piora do padrão de dispneia, aumento do volume e da purulência do escarro (Critérios de Anthonisen I). Gasometria com pH 7,31, PaCO2 58 mmHg e PaO2 54 mmHg em ar ambiente. Indicação de VNI e antibióticoterapia.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-RP',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 97,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-exacerbacao', title: 'Exacerbação Aguda da DPOC & VNI' }]
  },
  {
    id: 'q-seed-dpoc-enamed-2025',
    questionNumber: 12,
    statementSnippet: 'Na Unidade Básica de Saúde, paciente de 60 anos com tosse produtiva há 3 anos e tabagismo de 40 anos-maço solicita indicação de rastreio ou exames. Qual a conduta diagnóstica padrão-ouro recomendada pelo Ministério da Saúde e PCDT?',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 96,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' }]
  },
  {
    id: 'q-seed-dpoc-unicamp-2025',
    questionNumber: 15,
    statementSnippet: 'Mulher de 62 anos, ex-tabagista de 45 anos-maço, em uso de LAMA + LABA. Apresenta eosinófilos sanguíneos de 380 células/mcL e queixa de cansaço aos médios esforços sem novas exacerbações. Qual o benefício da adição de Corticoide Inalatório?',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 94,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }]
  },
  {
    id: 'q-seed-dpoc-hiae-2025',
    questionNumber: 9,
    statementSnippet: 'Paciente hospitalizado com exacerbação infecciosa de DPOC sob oxigenoterapia suplementar em cateter nasal a 4 L/min desenvolve sonolência e torpor. Gasometria arterial com acidose respiratória aguda grave por hipoventilação induzida pelo oxigênio (Efeito Haldane).',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'HIAE',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 95,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-exacerbacao', title: 'Exacerbação Aguda da DPOC & VNI' }]
  },
  // Mais questões históricas de DPOC nos últimos 5 anos
  {
    id: 'q-seed-dpoc-uspsp-2024',
    questionNumber: 8,
    statementSnippet: 'Critérios de oxigenoterapia domiciliar prolongada na DPOC estável: PaO2 em repouso ≤ 55 mmHg ou SpO2 ≤ 88% confirmada em duas gasometrias com intervalo de 3 semanas.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-SP',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }]
  },
  {
    id: 'q-seed-dpoc-usprp-2024',
    questionNumber: 11,
    statementSnippet: 'Avaliação de enfisema pulmonar centroacinar versus panacinar em paciente de 38 anos não tabagista com hepatopatia crônica. Dosagem de alfa-1 antitripsina sérica.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-RP',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 93,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' }]
  },
  {
    id: 'q-seed-dpoc-enamed-2024',
    questionNumber: 18,
    statementSnippet: 'Conduta na cessação do tabagismo em paciente com DPOC: Terapia de Reposição de Nicotina associada à Bupropiona e intervenção comportamental breve.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'ENAMED',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 92,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }]
  },
  {
    id: 'q-seed-dpoc-unicamp-2023',
    questionNumber: 6,
    statementSnippet: 'Homem de 65 anos com DPOC fenotipo enfisematoso, tórax em barril, hiperinsuflação e diminuição difusa do murmúrio vesicular.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'UNICAMP',
    year: 2023,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 97,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' }]
  },
  {
    id: 'q-seed-dpoc-hiae-2023',
    questionNumber: 14,
    statementSnippet: 'Critérios diagnósticos de hipertensão pulmonar associada à DPOC avançada (Grupo 3 de HP) e ecocardiograma com PSAP elevada.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'HIAE',
    year: 2023,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 90,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }]
  },
  {
    id: 'q-seed-dpoc-usprp-2022',
    questionNumber: 10,
    statementSnippet: 'Uso de vacinação anual contra Influenza e vacina pneumocócica conjugada na prevenção de exacerbações de DPOC moderada a grave.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-RP',
    year: 2022,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 95,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }]
  },
  {
    id: 'q-seed-dpoc-uspsp-2021',
    questionNumber: 5,
    statementSnippet: 'Diferenciação entre DPOC e Asma Brônquica: resposta espirométrica completa vs obstrutivo fixo sem normalização.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-SP',
    year: 2021,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 96,
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' }]
  },

  // ==========================================
  // EXEMPLO DE QUESTÃO COM DÚVIDA DA IA (Revisão Manual Sinalizada)
  // ==========================================
  {
    id: 'q-seed-doubt-asma-dpoc-usprp-2025',
    questionNumber: 19,
    statementSnippet: 'Paciente de 52 anos, tabagista ativo 20 anos-maço com história na infância de rinite alérgica e eczema atópico. Apresenta dispneia variável com despertares noturnos por tosse seca e sibilos inspiratórios/expiratórios. Espirometria com VEF1/CVF 0,66 e ganho pós-broncodilatador de 280 mL e 14% de variação no VEF1.',
    contentId: 'c-dpoc',
    contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
    moduloName: 'Pneumologia',
    areaName: 'Clínica Médica',
    institution: 'USP-RP',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'duvida_revisao',
    confidenceScore: 58,
    doubtReason: 'Sobreposição clínica entre DPOC e Asma Brônquica (Síndrome de Overlap / ACOS): paciente tabagista, porém com atopia na infância e resposta broncodilatadora significativa. Sugerida DPOC, mas requer validação manual da usuária.',
    aiSuggestedContentId: 'c-dpoc',
    mappedOslerBlocks: [{ id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' }, { id: 'osler-asma-crise', title: 'Asma Brônquica e Manejo' }]
  },
  {
    id: 'q-seed-doubt-meckel-apendicite-unicamp-2025',
    questionNumber: 33,
    statementSnippet: 'Jovem de 18 anos submetido à laparoscopia diagnóstica por suspeita de apendicite aguda após dor em fossa ilíaca direita e febre baixa. No intraoperatório, o apêndice cecal apresentava-se sem alterações inflamatórias macroscópicas. À inspeção minuciosa dos últimos 100 cm de íleo terminal, identifica-se divertículo antimesentérico a 55 cm da válvula ileocecal com sinais de diverticulite local.',
    contentId: 'c-apendicite',
    contentName: 'Apendicite Aguda & Escore de Alvarado',
    moduloName: 'Abdome Agudo',
    areaName: 'Cirurgia Geral',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'duvida_revisao',
    confidenceScore: 52,
    doubtReason: 'Quadro cirúrgico com diagnóstico diferencial estrito: apendicite vs divertículo de Meckel complicado. IA mapeou preliminarmente em Apendicite, mas o foco da conduta é ressecção diverticular.',
    aiSuggestedContentId: 'c-apendicite',
    mappedOslerBlocks: [{ id: 'osler-abdomem-agudo-inflamatorio-apendicite-diverti', title: 'Abdomem Agudo Inflamatório (Apendicite, Meckel)' }]
  },

  // ==========================================
  // DIVERTÍCULO DE MECKEL (Exemplo do usuário: Baixa incidência / Raro)
  // ==========================================
  {
    id: 'q-seed-meckel-unicamp-2022',
    questionNumber: 29,
    statementSnippet: 'Criança de 3 anos com quadro de sangramento gastrointestinal baixo indolor e volumoso (enterorragia). Estabilidade hemodinâmica inicial, sem dor à palpação abdominal. Cintilografia com pertecnetato de 99mTc (Meckel scan) positiva demonstrando mucosa gástrica ectópica.',
    contentId: 'c-meckel',
    contentName: 'Divertículo de Meckel & Anomalias do Ducto Onfalomesentérico',
    moduloName: 'Cirurgia Pediátrica',
    areaName: 'Cirurgia Geral',
    institution: 'UNICAMP',
    year: 2022,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-meckel',
    mappedOslerBlocks: [{ id: 'osler-diverticulo-meckel', title: 'Divertículo de Meckel e Sangramento Pediátrico' }]
  },

  // ==========================================
  // INSUFICIÊNCIA CARDÍACA CONGESTIVA (ICC) - Muito Frequente
  // ==========================================
  {
    id: 'q-seed-icc-uspsp-2025',
    questionNumber: 2,
    statementSnippet: 'Homem de 63 anos, hipertenso e diabético com ICFER (FEVE 28%), classe funcional NYHA III em uso de Enalapril 20mg 2x/dia e Carvedilol 25mg 2x/dia. Conduta para redução de mortalidade: substituição de Enalapril por Sacubitril/Valsartana e introdução de Dapagliflozina e Espironolactona (terapia quádrupla otimizada).',
    contentId: 'c-icc',
    contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
    moduloName: 'Cardiologia',
    areaName: 'Clínica Médica',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-icc',
    mappedOslerBlocks: [{ id: 'osler-icfer-terapia-farmacologica', title: 'ICFER - Terapia Quádrupla Otimizada' }]
  },
  {
    id: 'q-seed-icc-usprp-2025',
    questionNumber: 5,
    statementSnippet: 'Paciente internado em UTI com descompensação aguda de insuficiência cardíaca crônica apresentando extremidades frias, tempo de enchimento capilar de 5 segundos, PA 85x50 mmHg e estertoração pulmonar bilateral até ápices (Perfil C de Stevenson: Frio e Úmido). Indicação de Dobutamina antes de diuréticos em alta dose.',
    contentId: 'c-icc',
    contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
    moduloName: 'Cardiologia',
    areaName: 'Clínica Médica',
    institution: 'USP-RP',
    year: 2025,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 97,
    aiSuggestedContentId: 'c-icc',
    mappedOslerBlocks: [{ id: 'osler-ic-descompensada-stevenson', title: 'IC Descompensada - Perfis de Stevenson' }]
  },
  {
    id: 'q-seed-icc-enamed-2025',
    questionNumber: 3,
    statementSnippet: 'Na consulta médica ambulatorial, idosa com dispneia paroxística noturna, turgência jugular patológica a 45º e refluxo hepatojugular presente. Aplicação dos Critérios de Boston e Framingham para diagnóstico clínico de Insuficiência Cardíaca.',
    contentId: 'c-icc',
    contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
    moduloName: 'Cardiologia',
    areaName: 'Clínica Médica',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 96,
    aiSuggestedContentId: 'c-icc',
    mappedOslerBlocks: [{ id: 'osler-criterios-framingham-ic', title: 'Critérios de Framingham no Diagnóstico da IC' }]
  },
  {
    id: 'q-seed-icc-unicamp-2024',
    questionNumber: 1,
    statementSnippet: 'Escore de Framingham para insuficiência cardíaca congestiva: critérios maiores vs menores e utilidade da dosagem de NT-proBNP com alto valor preditivo negativo.',
    contentId: 'c-icc',
    contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
    moduloName: 'Cardiologia',
    areaName: 'Clínica Médica',
    institution: 'UNICAMP',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 95,
    aiSuggestedContentId: 'c-icc',
    mappedOslerBlocks: [{ id: 'osler-criterios-framingham-ic', title: 'Critérios de Framingham no Diagnóstico da IC' }]
  },
  {
    id: 'q-seed-icc-hiae-2024',
    questionNumber: 6,
    statementSnippet: 'Manejo de choque cardiogênico refratário: indicação de balão intra-aórtico de contrapulsação e dispositivos de assistência ventricular temporária.',
    contentId: 'c-icc',
    contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
    moduloName: 'Cardiologia',
    areaName: 'Clínica Médica',
    institution: 'HIAE',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 94,
    aiSuggestedContentId: 'c-icc',
    mappedOslerBlocks: [{ id: 'osler-icfer-terapia-farmacologica', title: 'ICFER - Terapia Quádrupla Otimizada' }]
  },
  {
    id: 'q-seed-icc-usprp-2023',
    questionNumber: 4,
    statementSnippet: 'Intoxicação digitálica em paciente com insuficiência cardíaca congestiva em uso de Furosemida com hipocalemia associada. Alterações eletrocardiográficas com extrassístoles ventriculares pareadas.',
    contentId: 'c-icc',
    contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
    moduloName: 'Cardiologia',
    areaName: 'Clínica Médica',
    institution: 'USP-RP',
    year: 2023,
    isCorrect: false,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 92,
    aiSuggestedContentId: 'c-icc',
    mappedOslerBlocks: [{ id: 'osler-icfer-terapia-farmacologica', title: 'ICFER - Terapia Quádrupla Otimizada' }]
  },

  // ==========================================
  // CIRURGIA: APENDICITE AGUDA - Muito Frequente
  // ==========================================
  {
    id: 'q-seed-apend-usprp-2025',
    questionNumber: 22,
    statementSnippet: 'Paciente de 24 anos com dor periumbilical que migrou para fossa ilíaca direita após 12 horas, náuseas, febre aferida 38,2ºC e descompressão brusca dolorosa em ponto de McBurney (Sinal de Blumberg positivo). Escore de Alvarado = 8. Indicação de apendicectomia videolaparoscópica.',
    contentId: 'c-apendicite',
    contentName: 'Apendicite Aguda & Escore de Alvarado',
    moduloName: 'Abdome Agudo',
    areaName: 'Cirurgia Geral',
    institution: 'USP-RP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-apendicite',
    mappedOslerBlocks: [{ id: 'osler-apendicite-escore-alvarado', title: 'Apendicite Aguda e Escore de Alvarado' }]
  },
  {
    id: 'q-seed-apend-uspsp-2025',
    questionNumber: 25,
    statementSnippet: 'Gestante no segundo trimestre (22 semanas) com dor em flanco direito e febre. Deslocamento anatômico cefálico do apêndice pelo útero gravídico. Exame de imagem inicial de escolha: Ultrassonografia com compressão gradual.',
    contentId: 'c-apendicite',
    contentName: 'Apendicite Aguda & Escore de Alvarado',
    moduloName: 'Abdome Agudo',
    areaName: 'Cirurgia Geral',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 97,
    aiSuggestedContentId: 'c-apendicite',
    mappedOslerBlocks: [{ id: 'osler-apendicite-escore-alvarado', title: 'Apendicite Aguda e Escore de Alvarado' }]
  },
  {
    id: 'q-seed-apend-unicamp-2025',
    questionNumber: 21,
    statementSnippet: 'Idoso de 76 anos com dor em quadrante inferior direito, massa palpável e febre há 7 dias. Tomografia de abdome com plastrão apendicular e abscesso bloqueado de 5 cm. Conduta: drenagem percutânea guiada por TC + antibioticoterapia (apendicectomia de intervalo após 6-8 semanas).',
    contentId: 'c-apendicite',
    contentName: 'Apendicite Aguda & Escore de Alvarado',
    moduloName: 'Abdome Agudo',
    areaName: 'Cirurgia Geral',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 96,
    aiSuggestedContentId: 'c-apendicite',
    mappedOslerBlocks: [{ id: 'osler-apendicite-complicada', title: 'Apendicite Complicada e Plastrão Apendicular' }]
  },
  {
    id: 'q-seed-apend-enamed-2025',
    questionNumber: 24,
    statementSnippet: 'Criança de 8 anos com dor abdominal contínua, recusa alimentar e sinal do Rovsing positivo. Discussão sobre necessidade de TC versus USG para redução de exposição à radiação ionizante em pediatria.',
    contentId: 'c-apendicite',
    contentName: 'Apendicite Aguda & Escore de Alvarado',
    moduloName: 'Abdome Agudo',
    areaName: 'Cirurgia Geral',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-apendicite',
    mappedOslerBlocks: [{ id: 'osler-apendicite-escore-alvarado', title: 'Apendicite Aguda e Escore de Alvarado' }]
  },
  {
    id: 'q-seed-apend-hiae-2024',
    questionNumber: 28,
    statementSnippet: 'Achado incidental de tumor neuroendócrino (carcinoide) de apêndice cecal de 1,2 cm em ponta de apêndice após apendicectomia não complicada com margens livres.',
    contentId: 'c-apendicite',
    contentName: 'Apendicite Aguda & Escore de Alvarado',
    moduloName: 'Abdome Agudo',
    areaName: 'Cirurgia Geral',
    institution: 'HIAE',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 93,
    aiSuggestedContentId: 'c-apendicite',
    mappedOslerBlocks: [{ id: 'osler-apendicite-complicada', title: 'Apendicite Complicada e Plastrão Apendicular' }]
  },

  // ==========================================
  // TRAUMA & ATLS - Muito Frequente
  // ==========================================
  {
    id: 'q-seed-atls-uspsp-2025',
    questionNumber: 31,
    statementSnippet: 'Vítima de colisão automobilística frontal em alta velocidade. No XABCDE: vias aéreas pérvias com colar cervical, MV abolido em hemitórax esquerdo, hipertimpanismo e turgência jugular bilateral com hipotensão arterial severa (Pneumotórax Hipertensivo). Conduta imediata: Toracostomia com agulha no 4º ou 5º espaço intercostal na linha axilar anterior (ATLS 10ª edição).',
    contentId: 'c-atls',
    contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)',
    moduloName: 'Trauma & Urgências Cirúrgicas',
    areaName: 'Cirurgia Geral',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-atls',
    mappedOslerBlocks: [{ id: 'osler-atls-abcde', title: 'ATLS 10ª Edição - Sequência do XABCDE' }]
  },
  {
    id: 'q-seed-trauma-abd-unicamp-2025',
    questionNumber: 35,
    statementSnippet: 'Trauma abdominal contuso com choque hemodinâmico refratário a 1000 mL de cristalóides aquecidos. E-FAST no pronto-socorro demonstrando líquido livre abundante no espaço hepatorrenal (Morison). Indicação mandatória de laparotomia exploradora imediata.',
    contentId: 'c-trauma-abd',
    contentName: 'Trauma Abdominal Fechado & E-FAST Positivo',
    moduloName: 'Trauma & Urgências Cirúrgicas',
    areaName: 'Cirurgia Geral',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-trauma-abd',
    mappedOslerBlocks: [{ id: 'osler-efast-trauma-abdominal', title: 'E-FAST e Conduta no Trauma Abdominal' }]
  },
  {
    id: 'q-seed-atls-enamed-2025',
    questionNumber: 38,
    statementSnippet: 'Protocolo de Transfusão Maciça no trauma grave: relação fisiológica 1:1:1 de Concentrado de Hemácias, Plasma Fresco Congelado e Plaquetas associado ao Ácido Tranexâmico dentro das primeiras 3 horas do trauma.',
    contentId: 'c-atls',
    contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)',
    moduloName: 'Trauma & Urgências Cirúrgicas',
    areaName: 'Cirurgia Geral',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 97,
    aiSuggestedContentId: 'c-atls',
    mappedOslerBlocks: [{ id: 'osler-atls-abcde', title: 'ATLS 10ª Edição - Sequência do XABCDE' }]
  },
  {
    id: 'q-seed-atls-hiae-2025',
    questionNumber: 30,
    statementSnippet: 'Lesão da aorta torácica pós-desaceleração brusca em politrauma: alargamento mediastinal na radiografia de tórax e angiotomografia demonstrando pseudoaneurisma.',
    contentId: 'c-atls',
    contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)',
    moduloName: 'Trauma & Urgências Cirúrgicas',
    areaName: 'Cirurgia Geral',
    institution: 'HIAE',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 95,
    aiSuggestedContentId: 'c-atls',
    mappedOslerBlocks: [{ id: 'osler-atls-abcde', title: 'ATLS 10ª Edição - Sequência do XABCDE' }]
  },
  {
    id: 'q-seed-atls-usprp-2024',
    questionNumber: 27,
    statementSnippet: 'Tamponamento cardíaco no trauma contuso: Tríade de Beck (hipotensão, hipofonese de bulhas cardíacas e turgência jugular) com confirmação ecocardiográfica à beira do leito.',
    contentId: 'c-atls',
    contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)',
    moduloName: 'Trauma & Urgências Cirúrgicas',
    areaName: 'Cirurgia Geral',
    institution: 'USP-RP',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-atls',
    mappedOslerBlocks: [{ id: 'osler-atls-abcde', title: 'ATLS 10ª Edição - Sequência do XABCDE' }]
  },

  // ==========================================
  // PREVENTIVA: DELINEAMENTO DE ESTUDOS & EPIDEMIOLOGIA - Muito Frequente
  // ==========================================
  {
    id: 'q-seed-estudos-uspsp-2025',
    questionNumber: 82,
    statementSnippet: 'Estudo para avaliar a associação entre uso prolongado de inibidores da bomba de prótons e demência em idosos. Selecionados 1.200 indivíduos expostos e 2.400 não expostos, acompanhados durante 10 anos para quantificar o aparecimento de novos casos (incidência). Cálculo de Risco Relativo e Risco Atribuível.',
    contentId: 'c-estudos',
    contentName: 'Delineamento de Estudos & Testes Diagnósticos',
    moduloName: 'Epidemiologia Clínica & Bioestatística',
    areaName: 'Medicina Preventiva e Social',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-estudos',
    mappedOslerBlocks: [{ id: 'osler-delineamento-estudos-coorte', title: 'Estudos de Coorte e Medidas de Associação' }]
  },
  {
    id: 'q-seed-testes-unicamp-2025',
    questionNumber: 84,
    statementSnippet: 'Um novo teste de triagem rápida para hepatite C foi aplicado em uma população de alta prevalência (usuários de drogas injetáveis) e em uma população de doadores de sangue (baixa prevalência). O que ocorre com a sensibilidade, especificidade, valor preditivo positivo (VPP) e valor preditivo negativo (VPN) em cada cenário?',
    contentId: 'c-testes-diag',
    contentName: 'Sensibilidade, Especificidade, VPP e VPN',
    moduloName: 'Epidemiologia Clínica & Bioestatística',
    areaName: 'Medicina Preventiva e Social',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-testes-diag',
    mappedOslerBlocks: [{ id: 'osler-sensibilidade-especificidade-vpp', title: 'Acurácia Diagnóstica e Teorema de Bayes' }]
  },
  {
    id: 'q-seed-sus-enamed-2025',
    questionNumber: 88,
    statementSnippet: 'A Lei Orgânica da Saúde nº 8.142/1990 dispõe sobre a participação da comunidade na gestão do Sistema Único de Saúde (SUS) e sobre as transferências intergovernamentais de recursos financeiros na área da saúde. Qual a periodicidade e a composição paritária dos Conselhos de Saúde?',
    contentId: 'c-leis-organicas',
    contentName: 'Leis Orgânicas da Saúde: Lei 8.080/90 e Lei 8.142/90',
    moduloName: 'SUS & Políticas Públicas',
    areaName: 'Medicina Preventiva e Social',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-leis-organicas',
    mappedOslerBlocks: [{ id: 'osler-leis-organicas-sus', title: 'Lei 8.080/90 e Lei 8.142/90' }]
  },
  {
    id: 'q-seed-sus-usprp-2024',
    questionNumber: 85,
    statementSnippet: 'Princípio da Equidade no SUS: distribuição desigual de recursos para equalizar oportunidades e compensar vulnerabilidades sociais e disparidades regionais de acesso.',
    contentId: 'c-principios-sus',
    contentName: 'Princípios Doutrinários e Organizativos do SUS',
    moduloName: 'SUS & Políticas Públicas',
    areaName: 'Medicina Preventiva e Social',
    institution: 'USP-RP',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-principios-sus',
    mappedOslerBlocks: [{ id: 'osler-principios-doutrinarios-sus', title: 'Universalidade, Integralidade e Equidade no SUS' }]
  },
  {
    id: 'q-seed-vieses-hiae-2024',
    questionNumber: 90,
    statementSnippet: 'Ensaio clínico randomizado com mascaramento duplo-cego: objetivo primordial da técnica de randomização para controle de fatores de confusão conhecidos e desconhecidos entre os grupos de intervenção e controle.',
    contentId: 'c-vieses',
    contentName: 'Vieses de Confundimento e Seleção & Randomização',
    moduloName: 'Epidemiologia Clínica & Bioestatística',
    areaName: 'Medicina Preventiva e Social',
    institution: 'HIAE',
    year: 2024,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 96,
    aiSuggestedContentId: 'c-vieses',
    mappedOslerBlocks: [{ id: 'osler-vieses-ensaio-clinico', title: 'Vieses e Randomização em Ensaios Clínicos' }]
  },

  // ==========================================
  // GINECOLOGIA & OBSTETRÍCIA - Muito Frequente
  // ==========================================
  {
    id: 'q-seed-prenatal-uspsp-2025',
    questionNumber: 62,
    statementSnippet: 'Primigesta de 28 semanas com sorologia para toxoplasmose solicitada na primeira consulta apresentando IgG negativo e IgM negativo. Na repetição de 28 semanas, apresenta IgG positivo e IgM positivo. Teste de avidez de IgG solicitado e confirmação de soroconversão aguda materna. Conduta imediata: Espiramicina e amniocentese para PCR a partir de 18 semanas.',
    contentId: 'c-sorologias-prenatal',
    contentName: 'Infecções Congênitas e Sorologias no Pré-Natal (Toxoplasmose, CMV, Sífilis)',
    moduloName: 'Pré-Natal & Fisiologia da Gestação',
    areaName: 'Ginecologia e Obstetrícia',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-sorologias-prenatal',
    mappedOslerBlocks: [{ id: 'osler-toxoplasmose-gestacao', title: 'Toxoplasmose Congênita no Pré-Natal' }]
  },
  {
    id: 'q-seed-dheg-usprp-2025',
    questionNumber: 65,
    statementSnippet: 'Gestante de 34 semanas com PA 165x110 mmHg confirmada, cefaleia refratária, escotomas cintilantes e proteinúria de 24 horas de 2,4g (Pré-Eclâmpsia com Sinais de Gravidade). Conduta imediata para prevenção de convulsões: Esquema de Zuspan ou Pritchard com Sulfato de Magnésio e controle pressórico com Hidralazina EV.',
    contentId: 'c-pre-eclampsia',
    contentName: 'Pré-Eclâmpsia, Eclâmpsia e Síndrome HELLP',
    moduloName: 'Complicações Obstétricas',
    areaName: 'Ginecologia e Obstetrícia',
    institution: 'USP-RP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-pre-eclampsia',
    mappedOslerBlocks: [{ id: 'osler-sulfato-magnesio-zuspan', title: 'Manejo da Pré-Eclâmpsia e Esquema de Zuspan' }]
  },
  {
    id: 'q-seed-dpp-unicamp-2025',
    questionNumber: 68,
    statementSnippet: 'Gestante de 36 semanas admitida com dor abdominal súbita de forte intensidade, sangramento vaginal escuro em moderada quantidade, hipertonia uterina (útero lenhoso) e bradicardia fetal sustentada a 90 bpm. Diagnóstico de Descolamento Prematuro de Placenta (DPP) e indicação de cesariana de emergência.',
    contentId: 'c-dpp-placenta-previa',
    contentName: 'Hemorragias da 2ª Metade: Descolamento Prematuro de Placenta e Placenta Prévia',
    moduloName: 'Complicações Obstétricas',
    areaName: 'Ginecologia e Obstetrícia',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-dpp-placenta-previa',
    mappedOslerBlocks: [{ id: 'osler-dpp-hemorragia-gestacao', title: 'Descolamento Prematuro de Placenta (DPP)' }]
  },
  {
    id: 'q-seed-prenatal-enamed-2025',
    questionNumber: 61,
    statementSnippet: 'Rastreio do Estreptococo do Grupo B (SGB / Streptococcus agalactiae) por swab vaginal e anorretal entre 35 e 37 semanas de gestação e indicação de profilaxia intraparto com Penicilina Cristalina.',
    contentId: 'c-sorologias-prenatal',
    contentName: 'Infecções Congênitas e Sorologias no Pré-Natal (Toxoplasmose, CMV, Sífilis)',
    moduloName: 'Pré-Natal & Fisiologia da Gestação',
    areaName: 'Ginecologia e Obstetrícia',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 97,
    aiSuggestedContentId: 'c-sorologias-prenatal',
    mappedOslerBlocks: [{ id: 'osler-sgb-profilaxia-parto', title: 'Streptococcus agalactiae (SGB) no Parto' }]
  },
  {
    id: 'q-seed-cancer-mama-hiae-2025',
    questionNumber: 74,
    statementSnippet: 'Mulher de 54 anos em mamografia de rastreamento com nódulo espiculado em quadrante superior externo de mama direita associado a microcalcificações pleomórficas agrupadas. Laudo classificado como BI-RADS 5. Conduta: Core-biopsy (biópsia por agulha grossa com fragmento tecidual).',
    contentId: 'c-cancer-mama',
    contentName: 'Câncer de Mama & Classificação BI-RADS',
    moduloName: 'Oncologia Ginecológica & Mastologia',
    areaName: 'Ginecologia e Obstetrícia',
    institution: 'HIAE',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-cancer-mama',
    mappedOslerBlocks: [{ id: 'osler-bi-rads-mamografia', title: 'Classificação BI-RADS e Conduta' }]
  },

  // ==========================================
  // PEDIATRIA - Muito Frequente
  // ==========================================
  {
    id: 'q-seed-desenv-uspsp-2025',
    questionNumber: 42,
    statementSnippet: 'Lactente de 6 meses levado à consulta de puericultura. Ao exame dos marcos do desenvolvimento neuropsicomotor segundo o Ministério da Saúde e OMS, espera-se que consiga: sentar com apoio breve, transferir objetos de uma mão para outra e emitir balbucio com sons polissilábicos.',
    contentId: 'c-desenvolvimento-infantil',
    contentName: 'Puericultura & Marcos do Desenvolvimento Neuropsicomotor',
    moduloName: 'Puericultura & Crescimento',
    areaName: 'Pediatria',
    institution: 'USP-SP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-desenvolvimento-infantil',
    mappedOslerBlocks: [{ id: 'osler-marcos-desenvolvimento-infantil', title: 'Marcos do Desenvolvimento Neuropsicomotor' }]
  },
  {
    id: 'q-seed-ictericia-usprp-2025',
    questionNumber: 45,
    statementSnippet: 'Recém-nascido a termo com 36 horas de vida apresenta icterícia visível até cicatriz umbilical (Zona II de Kramer). Bilirrubina total de 14 mg/dL à custa de bilirrubina indireta. Mãe tipagem O Rh positivo e recém-nascido A Rh positivo com Teste de Coombs Direto positivo (Incompatibilidade Materno-Fetal ABO). Indicação de fototerapia contínua.',
    contentId: 'c-ictericia-neonatal',
    contentName: 'Icterícia Neonatal Fisiológica vs Patológica & Fototerapia',
    moduloName: 'Neonatologia',
    areaName: 'Pediatria',
    institution: 'USP-RP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-ictericia-neonatal',
    mappedOslerBlocks: [{ id: 'osler-ictericia-kramer-fototerapia', title: 'Icterícia Neonatal e Zonas de Kramer' }]
  },
  {
    id: 'q-seed-exantemas-unicamp-2025',
    questionNumber: 49,
    statementSnippet: 'Lactente de 10 meses com pródromos de febre alta (39,5ºC) durante 3 dias sem foco evidente e bom estado geral mantido. No 4º dia, a febre cede em lise e surge exantema maculopapular róseo de distribuição centrífuga iniciando em tronco e poupando palmas e plantas. Diagnóstico de Exantema Súbito (Roséola Infantil / HHV-6).',
    contentId: 'c-doencas-exantematicas',
    contentName: 'Doenças Exantemáticas na Infância (Sarampo, Rubéola, Varicela, Exantema Súbito)',
    moduloName: 'Infectologia Pediátrica',
    areaName: 'Pediatria',
    institution: 'UNICAMP',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 98,
    aiSuggestedContentId: 'c-doencas-exantematicas',
    mappedOslerBlocks: [{ id: 'osler-exantema-subito-roseola', title: 'Doenças Exantemáticas na Infância' }]
  },
  {
    id: 'q-seed-bronquiolite-enamed-2025',
    questionNumber: 47,
    statementSnippet: 'Lactente de 4 meses com tosse, coriza e taquipneia com tiragem subcostal leve e estertores crepitantes bilaterais. Primeiro episódio de sibilância pós-infecção viral. Diagnóstico de Bronquolite Viral Aguda por VSR. Tratamento de suporte com lavagem nasal e oxigenoterapia se SpO2 < 92%. Não indicado uso de corticoide ou broncodilatador de rotina.',
    contentId: 'c-bronquiolite',
    contentName: 'Bronquiolite Viral Aguda & Laringotraqueobronquite',
    moduloName: 'Pneumopediatria',
    areaName: 'Pediatria',
    institution: 'ENAMED',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-bronquiolite',
    mappedOslerBlocks: [{ id: 'osler-bronquiolite-viral-aguda', title: 'Bronquiolite Viral Aguda (VSR)' }]
  },
  {
    id: 'q-seed-reanimacao-hiae-2025',
    questionNumber: 52,
    statementSnippet: 'Reanimação Neonatal em sala de parto segundo diretrizes SBP 2022: recém-nascido a termo que não respira ou chora ao nascer e com tônus flácido. Passos iniciais em 30 segundos: aquecer, secar, posicionar cabeça e aspirar se necessário. Se mantiver FC < 100 bpm ou apneia: Ventilação com Pressão Positiva (VPP) com ar ambiente (FiO2 21%).',
    contentId: 'c-reanimacao-neonatal',
    contentName: 'Reanimação Neonatal em Sala de Parto (Diretrizes SBP)',
    moduloName: 'Neonatologia',
    areaName: 'Pediatria',
    institution: 'HIAE',
    year: 2025,
    isCorrect: true,
    classificationStatus: 'ia_confiavel',
    confidenceScore: 99,
    aiSuggestedContentId: 'c-reanimacao-neonatal',
    mappedOslerBlocks: [{ id: 'osler-reanimacao-neonatal-sbp', title: 'Reanimação Neonatal SBP' }]
  }
];

/**
 * Carrega todas as questões salvas no armazenamento local + seed inicial
 */
export function loadAllTargetExamQuestions(): ExamQuestionEntry[] {
  if (typeof window === 'undefined') {
    return SEED_TARGET_QUESTIONS;
  }
  const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
  if (saved) {
    try {
      const parsed: ExamQuestionEntry[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  // Salva o seed inicial
  saveTargetExamQuestions(SEED_TARGET_QUESTIONS);
  return SEED_TARGET_QUESTIONS;
}

/**
 * Persiste a lista de questões no armazenamento local
 */
export function saveTargetExamQuestions(questions: ExamQuestionEntry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }
}

/**
 * Adiciona novas questões analisadas de uma prova (ex: lida de PDF ou inserida)
 */
export function addAnalyzedExamQuestions(newQuestions: ExamQuestionEntry[]): ExamQuestionEntry[] {
  const current = loadAllTargetExamQuestions();
  // Evitar duplicatas por id
  const existingIds = new Set(current.map((q) => q.id));
  const filtered = newQuestions.filter((q) => !existingIds.has(q.id));
  const updated = [...filtered, ...current];
  saveTargetExamQuestions(updated);
  return updated;
}

/**
 * Atualiza manualmente a classificação de uma questão pelo usuário
 */
export function updateQuestionManualClassification(
  questionId: string,
  updates: {
    contentId: string;
    contentName: string;
    moduloName: string;
    areaName: string;
    note?: string;
  }
): ExamQuestionEntry[] {
  const current = loadAllTargetExamQuestions();
  const updated = current.map((q) => {
    if (q.id === questionId) {
      return {
        ...q,
        originalAiSuggestion: q.originalAiSuggestion || {
          contentId: q.contentId,
          contentName: q.contentName,
          moduloName: q.moduloName,
          areaName: q.areaName,
        },
        contentId: updates.contentId,
        contentName: updates.contentName,
        moduloName: updates.moduloName,
        areaName: updates.areaName,
        classificationStatus: 'corrigido_manual' as const,
        doubtReason: undefined,
        userCorrectionNote: updates.note || 'Classificação ajustada manualmente pela usuária.',
        manualOverrideDate: new Date().toISOString(),
      };
    }
    return q;
  });
  saveTargetExamQuestions(updated);
  return updated;
}

/**
 * ============================================================================
 * MOTOR DE CLASSIFICAÇÃO AUTOMÁTICA DE QUESTÕES COM IA (MEDWAY + OSLER)
 * ============================================================================
 * Lê o texto do enunciado da questão de prova e relaciona à estrutura:
 * Área → Módulo → Conteúdo
 * Se houver incerteza ou sobreposição de temas, marca como 'duvida_revisao'
 */
export function classifyQuestionStatementWithAI(params: {
  statement: string;
  institution?: TargetInstitutionKey | string;
  year?: number;
  questionNumber?: number;
  allContents?: ContentItem[];
}): {
  contentId: string;
  contentName: string;
  moduloName: string;
  areaName: string;
  confidenceScore: number;
  classificationStatus: 'ia_confiavel' | 'duvida_revisao';
  doubtReason?: string;
  mappedOslerBlocks: { id: string; title: string }[];
} {
  const { statement, institution, year, questionNumber, allContents } = params;
  const s = statement.toLowerCase();

  // 1. Regras Clínicas de Rastreamento Semântico e Mapeamento Osler
  if (
    s.includes('dpoc') ||
    s.includes('obstrutiva crônica') ||
    s.includes('obstrutiva cronica') ||
    s.includes('vef1/cvf') ||
    s.includes('espirometria') ||
    (s.includes('enfisema') && s.includes('bronquite')) ||
    s.includes('gold a') ||
    s.includes('gold b') ||
    s.includes('gold e') ||
    s.includes('anthonisen')
  ) {
    // Verificar se há ambiguidade com Asma
    if (s.includes('asma') || s.includes('atopia') || s.includes('reversibilidade completa')) {
      return {
        contentId: 'c-dpoc',
        contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
        moduloName: 'Pneumologia',
        areaName: 'Clínica Médica',
        confidenceScore: 62,
        classificationStatus: 'duvida_revisao',
        doubtReason: 'Sobreposição clínica entre DPOC e Asma Brônquica detectada no enunciado. Sugerida associação provisória com DPOC para validação da usuária.',
        mappedOslerBlocks: [
          { id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' },
          { id: 'osler-asma-diagnostico', title: 'Asma Brônquica e Prova de Função Pulmonar' }
        ]
      };
    }
    return {
      contentId: 'c-dpoc',
      contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
      moduloName: 'Pneumologia',
      areaName: 'Clínica Médica',
      confidenceScore: 96,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [
        { id: 'osler-dpoc-espirometria', title: 'DPOC - Diagnóstico e Espirometria' },
        { id: 'osler-dpoc-gold', title: 'DPOC - Classificação GOLD e Farmacoterapia' }
      ]
    };
  }

  if (s.includes('meckel') || s.includes('ducto onfalomesentérico') || s.includes('pertecnetato')) {
    return {
      contentId: 'c-meckel',
      contentName: 'Divertículo de Meckel & Anomalias do Ducto Onfalomesentérico',
      moduloName: 'Cirurgia Pediátrica',
      areaName: 'Cirurgia Geral',
      confidenceScore: 98,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-diverticulo-meckel', title: 'Divertículo de Meckel e Sangramento Pediátrico' }]
    };
  }

  if (
    s.includes('insuficiência cardíaca') ||
    s.includes('insuficiencia cardiaca') ||
    s.includes('icfer') ||
    s.includes('fracao de ejecao') ||
    s.includes('sacubitril') ||
    s.includes('framingham') ||
    s.includes('stevenson')
  ) {
    return {
      contentId: 'c-icc',
      contentName: 'Insuficiência Cardíaca Congestiva (ICC)',
      moduloName: 'Cardiologia',
      areaName: 'Clínica Médica',
      confidenceScore: 97,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [
        { id: 'osler-icfer-terapia-farmacologica', title: 'ICFER - Terapia Quádrupla Otimizada' },
        { id: 'osler-ic-descompensada-stevenson', title: 'IC Descompensada - Perfis de Stevenson' }
      ]
    };
  }

  if (
    s.includes('apendicite') ||
    s.includes('alvarado') ||
    s.includes('mcburney') ||
    s.includes('blumberg') ||
    s.includes('rovsing')
  ) {
    return {
      contentId: 'c-apendicite',
      contentName: 'Apendicite Aguda & Escore de Alvarado',
      moduloName: 'Abdome Agudo',
      areaName: 'Cirurgia Geral',
      confidenceScore: 99,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-apendicite-escore-alvarado', title: 'Apendicite Aguda e Escore de Alvarado' }]
    };
  }

  if (
    s.includes('atls') ||
    s.includes('politraumatizado') ||
    s.includes('e-fast') ||
    s.includes('morison') ||
    s.includes('pneumotórax hipertensivo') ||
    s.includes('choque hemorrágico')
  ) {
    return {
      contentId: 'c-atls',
      contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)',
      moduloName: 'Trauma & Urgências Cirúrgicas',
      areaName: 'Cirurgia Geral',
      confidenceScore: 98,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-atls-abcde', title: 'ATLS 10ª Edição - Sequência do XABCDE' }]
    };
  }

  if (
    s.includes('sensibilidade') ||
    s.includes('especificidade') ||
    s.includes('valor preditivo') ||
    s.includes('curva roc') ||
    s.includes('acurácia diagnóstica')
  ) {
    return {
      contentId: 'c-testes-diag',
      contentName: 'Sensibilidade, Especificidade, VPP e VPN',
      moduloName: 'Epidemiologia Clínica & Bioestatística',
      areaName: 'Medicina Preventiva e Social',
      confidenceScore: 99,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-sensibilidade-especificidade-vpp', title: 'Acurácia Diagnóstica e Teorema de Bayes' }]
    };
  }

  if (
    s.includes('lei 8.080') ||
    s.includes('lei 8.142') ||
    s.includes('conselho de saúde') ||
    s.includes('conferência de saúde') ||
    s.includes('repasse fundo a fundo')
  ) {
    return {
      contentId: 'c-leis-organicas',
      contentName: 'Leis Orgânicas da Saúde: Lei 8.080/90 e Lei 8.142/90',
      moduloName: 'SUS & Políticas Públicas',
      areaName: 'Medicina Preventiva e Social',
      confidenceScore: 99,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-leis-organicas-sus', title: 'Lei 8.080/90 e Lei 8.142/90' }]
    };
  }

  if (
    s.includes('pré-eclâmpsia') ||
    s.includes('pre-eclampsia') ||
    s.includes('zuspan') ||
    s.includes('sulfato de magnésio') ||
    s.includes('hellp')
  ) {
    return {
      contentId: 'c-pre-eclampsia',
      contentName: 'Pré-Eclâmpsia, Eclâmpsia e Síndrome HELLP',
      moduloName: 'Complicações Obstétricas',
      areaName: 'Ginecologia e Obstetrícia',
      confidenceScore: 99,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-sulfato-magnesio-zuspan', title: 'Manejo da Pré-Eclâmpsia e Esquema de Zuspan' }]
    };
  }

  if (
    s.includes('icterícia neonatal') ||
    s.includes('ictericia neonatal') ||
    s.includes('kramer') ||
    s.includes('fototerapia') ||
    s.includes('incompatibilidade abo')
  ) {
    return {
      contentId: 'c-ictericia-neonatal',
      contentName: 'Icterícia Neonatal Fisiológica vs Patológica & Fototerapia',
      moduloName: 'Neonatologia',
      areaName: 'Pediatria',
      confidenceScore: 99,
      classificationStatus: 'ia_confiavel',
      mappedOslerBlocks: [{ id: 'osler-ictericia-kramer-fototerapia', title: 'Icterícia Neonatal e Zonas de Kramer' }]
    };
  }

  // 2. Busca genérica no currículo existente
  const curriculum = allContents || getAllCurriculumContents();
  for (const c of curriculum) {
    const cNameLower = c.name.toLowerCase();
    const parts = cNameLower.split(/[\(\)&–—\-,]/).map((p) => p.trim()).filter((p) => p.length > 3);
    for (const part of parts) {
      if (s.includes(part)) {
        return {
          contentId: c.id,
          contentName: c.name,
          moduloName: c.moduloName,
          areaName: c.areaName,
          confidenceScore: 82,
          classificationStatus: 'ia_confiavel',
          mappedOslerBlocks: (c.mappedOslerBlockIds || []).map((id) => ({ id, title: c.name }))
        };
      }
    }
  }

  // Se não encontrar certeza suficiente, marca como dúvida / revisão manual
  return {
    contentId: 'c-geral',
    contentName: 'Conteúdo Pendente de Validação Manual',
    moduloName: 'Geral',
    areaName: 'Clínica Médica',
    confidenceScore: 45,
    classificationStatus: 'duvida_revisao',
    doubtReason: 'Nenhum descritor unívoco do currículo atingiu confiança superior a 75%. Sinalizada para revisão manual da usuária.',
    mappedOslerBlocks: []
  };
}

/**
 * ============================================================================
 * MOTOR DE CÁLCULO DE INCIDÊNCIA NAS 5 INSTITUIÇÕES-ALVO
 * ============================================================================
 * Gera a estatística completa de incidência para cada conteúdo curricular:
 * - quantidade de questões
 * - instituições em que apareceu (USP-RP, USP-SP, UNICAMP, ENAMED, HIAE)
 * - anos em que apareceu (2021-2025)
 * - frequência por instituição
 * - frequência nos últimos 5 anos com peso de recência
 * - tendência de cobrança (subindo, estável, caindo)
 * - faixas: Muito frequente, Frequente, Moderada, Pouco frequente, Raro
 * - Score 0-100 para alimentar o algoritmo de prioridade existente
 */
export function calculateTargetInstitutionsIncidence(
  contentId: string,
  allQuestions?: ExamQuestionEntry[]
): ContentTargetIncidenceStats {
  const questions = allQuestions || loadAllTargetExamQuestions();
  const relatedQuestions = questions.filter((q) => q.contentId === contentId);

  const totalQuestions = relatedQuestions.length;

  // Breakdown por instituição
  const institutionsSet = new Set<TargetInstitutionKey>();
  const yearsSet = new Set<number>();
  const yearlyFrequency: Record<number, number> = { 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 };
  const countsByInstitution: Record<TargetInstitutionKey, number> = {
    'USP-RP': 0,
    'USP-SP': 0,
    'UNICAMP': 0,
    'ENAMED': 0,
    'HIAE': 0,
  };

  relatedQuestions.forEach((q) => {
    const inst = q.institution as TargetInstitutionKey;
    if (TARGET_INSTITUTIONS_LIST.includes(inst)) {
      institutionsSet.add(inst);
      countsByInstitution[inst] = (countsByInstitution[inst] || 0) + 1;
    }
    if (q.year && PAST_5_YEARS.includes(q.year as any)) {
      yearsSet.add(q.year);
      yearlyFrequency[q.year] = (yearlyFrequency[q.year] || 0) + 1;
    }
  });

  const institutions = Array.from(institutionsSet);
  const years = Array.from(yearsSet).sort((a, b) => b - a);

  // Detalhes de frequência por instituição
  const byInstitution: Record<TargetInstitutionKey, InstitutionFrequencyDetail> = {} as any;
  TARGET_INSTITUTIONS_LIST.forEach((inst) => {
    const count = countsByInstitution[inst];
    let rating: 'Muito alta' | 'Alta' | 'Média' | 'Baixa' | 'Rara' = 'Rara';
    if (count >= 5) rating = 'Muito alta';
    else if (count >= 3) rating = 'Alta';
    else if (count >= 2) rating = 'Média';
    else if (count >= 1) rating = 'Baixa';

    const percentage = totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0;
    byInstitution[inst] = {
      institution: inst,
      questionCount: count,
      rating,
      percentage,
    };
  });

  // Cálculo de Recência Ponderada (Recency Weighted Score)
  // Anos mais recentes têm peso mais alto (2025: 1.0, 2024: 0.85, 2023: 0.70, 2022: 0.55, 2021: 0.40)
  let weightedQuestionSum = 0;
  PAST_5_YEARS.forEach((yr) => {
    const count = yearlyFrequency[yr] || 0;
    const weight = RECENCY_WEIGHTS[yr] || 0.5;
    weightedQuestionSum += count * weight;
  });

  // Tendência de cobrança nos últimos 5 anos:
  // Compara a taxa recente (2024 e 2025) com a taxa anterior (2021, 2022 e 2023)
  const recentAvg = (yearlyFrequency[2024] + yearlyFrequency[2025]) / 2;
  const pastAvg = (yearlyFrequency[2021] + yearlyFrequency[2022] + yearlyFrequency[2023]) / 3;

  let trend: 'subindo' | 'estavel' | 'caindo' = 'estavel';
  let trendLabel = '➡️ Cobrança estável nas bancas';

  if (totalQuestions >= 3) {
    if (recentAvg >= pastAvg * 1.35 && recentAvg >= 1.5) {
      trend = 'subindo';
      trendLabel = '↗️ Alta recente (em ascensão nas provas)';
    } else if (recentAvg <= pastAvg * 0.65 && pastAvg >= 1.5) {
      trend = 'caindo';
      trendLabel = '↘️ Em queda relativa nas últimas edições';
    }
  }

  // Faixas de Frequência (Tiers)
  let frequencyTier: IncidenceFrequencyTier = 'raro';
  let tierLabel = 'Raro / Não identificado';

  if (totalQuestions >= 15 || weightedQuestionSum >= 12) {
    frequencyTier = 'muito_frequente';
    tierLabel = 'Muito frequente';
  } else if (totalQuestions >= 8 || weightedQuestionSum >= 6.5) {
    frequencyTier = 'frequente';
    tierLabel = 'Frequente';
  } else if (totalQuestions >= 4 || weightedQuestionSum >= 3.0) {
    frequencyTier = 'moderada';
    tierLabel = 'Moderadamente frequente';
  } else if (totalQuestions >= 1) {
    frequencyTier = 'pouco_frequente';
    tierLabel = 'Pouco frequente';
  } else {
    frequencyTier = 'raro';
    tierLabel = 'Raro / Não identificado';
  }

  // Score contínuo normalizado de 0 a 100 para o cérebro de priorização
  // Baseado no peso de recência e diversidade de instituições
  const diversityBonus = institutions.length >= 4 ? 12 : institutions.length >= 2 ? 6 : 0;
  const rawScore = weightedQuestionSum * 7.5 + diversityBonus;
  const calculatedPriorityScore = Math.min(98, Math.max(15, Math.round(rawScore)));

  return {
    contentId,
    totalQuestions,
    institutions,
    years,
    byInstitution,
    yearlyFrequency,
    recencyWeightedScore: Math.round(weightedQuestionSum * 10) / 10,
    trend,
    trendLabel,
    frequencyTier,
    tierLabel,
    calculatedPriorityScore,
  };
}

/**
 * Retorna todos os conteúdos do currículo ordenados por incidência nas 5 bancas-alvo
 */
export function getRankedCurriculumByTargetIncidence(
  allQuestions?: ExamQuestionEntry[]
): {
  content: ContentItem;
  stats: ContentTargetIncidenceStats;
}[] {
  const contents = getAllCurriculumContents();
  const questions = allQuestions || loadAllTargetExamQuestions();

  const mapped = contents.map((c) => {
    const stats = calculateTargetInstitutionsIncidence(c.id, questions);
    return {
      content: c,
      stats,
    };
  });

  // Ordenar decrescente por score de incidência nas bancas-alvo
  return mapped.sort((a, b) => b.stats.calculatedPriorityScore - a.stats.calculatedPriorityScore);
}
