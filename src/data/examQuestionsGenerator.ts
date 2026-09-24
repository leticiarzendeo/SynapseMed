import { ExamQuestionEntry, ExamSubmission } from '../types';

export interface GeneratedExamData {
  submission: ExamSubmission;
  questions: ExamQuestionEntry[];
}

// 100 questões distribuídas nas 5 Grandes Áreas (20 questões cada)
export const generate100QuestionsExam = (
  title: string,
  institution: string,
  year: number,
  type: 'PROVA_REAL' | 'SIMULADO'
): ExamQuestionEntry[] => {
  const areasConfig = [
    {
      areaName: 'CLÍNICA MÉDICA',
      startQ: 1,
      endQ: 20,
      modules: [
        {
          moduloName: 'Pneumologia',
          subareas: [
            { contentId: 'c-disturbios-obstrutivos', contentName: 'DPOC (Doença Pulmonar Obstrutiva Crônica)', snippet: 'Homem de 66 anos, tabagista 50 anos-maço, dispneia progressiva MRC 3 e tosse crônica matinal. Espirometria VEF1/CVF 0,58 pós-broncodilatador.', answer: 'C' },
            { contentId: 'c-asma', contentName: 'Asma Brônquica e Manejo de Crise Aguda', snippet: 'Mulher de 28 anos, episódios noturnos de sibilância e opressão torácica. Pico de fluxo expiratório com variação circadiana > 20%.', answer: 'B' },
            { contentId: 'c-derrame-pleural', contentName: 'Derrame Pleural & Critérios de Light', snippet: 'Paciente com dispneia e macicez em base direita. Toracocentese revela relação proteína pleural/sérica de 0,7 e DHL pleural/sérico de 0,85.', answer: 'A' },
            { contentId: 'c-disturbios-obstrutivos', contentName: 'DPOC - Manejo de Exacerbação Aguda', snippet: 'Paciente com DPOC conhecido apresenta piora do escarro (volume e purulência) e dispneia (Critérios de Anthonisen I).', answer: 'D' }
          ]
        },
        {
          moduloName: 'Cardiologia',
          subareas: [
            { contentId: 'c-insuficiencia-cardiaca', contentName: 'Insuficiência Cardíaca Congestiva (ICC)', snippet: 'Homem de 62 anos com ICFER (FEVE 32%), classe funcional NYHA III, em uso de Enalapril e Carvedilol em doses máximas toleradas.', answer: 'B' },
            { contentId: 'c-has', contentName: 'Hipertensão Arterial Sistêmica & Refratariedade', snippet: 'Mulher de 55 anos em uso de 3 anti-hipertensivos em doses plenas (incluindo tiazídico) mantendo PA 155x95 mmHg.', answer: 'C' },
            { contentId: 'c-sca', contentName: 'Síndrome Coronariana Aguda sem Supra de ST', snippet: 'Dor retroesternal opressiva há 2 horas com troponina ultrassensível elevada e inversão simétrica de onda T em V1-V4.', answer: 'A' },
            { contentId: 'c-fa', contentName: 'Fibrilação Atrial & Anticoagulação (CHA2DS2-VASc)', snippet: 'Paciente de 71 anos, hipertensa e diabética, com FA paroxística recém-diagnosticada. Escore CHA2DS2-VASc = 4.', answer: 'D' }
          ]
        },
        {
          moduloName: 'Nefrologia',
          subareas: [
            { contentId: 'c-drc', contentName: 'Doença Renal Crônica (DRC) e Síndromes Urêmicas', snippet: 'Paciente diabético de longa data com taxa de filtração glomerular estimada em 28 ml/min/1,73m² e relação albuminúria/creatininúria > 300 mg/g.', answer: 'B' },
            { contentId: 'c-ira', contentName: 'Injúria Renal Aguda & Critérios KDIGO', snippet: 'Paciente séptico em UTI com oligúria nas últimas 12 horas e elevação de creatinina sérica basal de 0,9 para 2,4 mg/dL.', answer: 'A' },
            { contentId: 'c-drc', contentName: 'Distúrbios do Metabolismo Mineral na DRC', snippet: 'Homem em hemodiálise crônica com hiperfosfatemia e PTH intacto de 650 pg/mL. Conduta inicial com quelante de fósforo.', answer: 'C' }
          ]
        },
        {
          moduloName: 'Gastroenterologia & Hepatologia',
          subareas: [
            { contentId: 'c-cirrose', contentName: 'Cirrose Hepática & Complicações (Ascite e PBE)', snippet: 'Paciente cirrótico admitido com desorientação, dor abdominal difusa e febre. Paracentese revela 420 polimorfonucleares/mm³.', answer: 'B' },
            { contentId: 'c-hda', contentName: 'Hemorragia Digestiva Alta Varicosa', snippet: 'Hematêmese volumosa em etilista com estigmas de hepatopatia crônica. Estabilização hemodinâmica e terlipressina endovenosa.', answer: 'C' },
            { contentId: 'c-drge', contentName: 'Doença do Refluxo Gastroesofágico & Esôfago de Barrett', snippet: 'Pirose e regurgitação ácida diárias refratárias a IBP em dose padrão. EDA evidencia epitélio colunar com metaplasia intestinal.', answer: 'D' }
          ]
        },
        {
          moduloName: 'Infectologia',
          subareas: [
            { contentId: 'c-pac', contentName: 'Pneumonia Adquirida na Comunidade & Escore CURB-65', snippet: 'Idoso de 72 anos com tosse produtiva, confusão mental aguda e ureia de 62 mg/dL. Escore CURB-65 = 3.', answer: 'A' },
            { contentId: 'c-hiv', contentName: 'HIV/Aids & Infecções Oportunistas (Neurotoxoplasmose)', snippet: 'Paciente com contagem de LT CD4+ de 45 céls/mm³ apresenta crise convulsiva focal. TC de crânio com lesões com realce anelar.', answer: 'B' },
            { contentId: 'c-dengue', contentName: 'Dengue & Sinais de Alarme', snippet: 'Febre há 4 dias que cedeu hoje, acompanhada de dor abdominal intensa e contínua, vômitos persistentes e hipotensão postural.', answer: 'C' }
          ]
        },
        {
          moduloName: 'Endocrinologia',
          subareas: [
            { contentId: 'c-dm2', contentName: 'Diabetes Mellitus tipo 2 & Alvos Terapêuticos', snippet: 'Homem de 50 anos com DM2 e doença cardiovascular aterosclerótica prévia. Escolha de iSGLT2 ou agonista de GLP-1.', answer: 'A' },
            { contentId: 'c-cad', contentName: 'Cetoacidose Diabética & Manejo Hidroeletrolítico', snippet: 'Jovem com DM1 admitido com hálito cetônico, glicemia 480 mg/dL, pH 7,12 e potássio de 4,2 mEq/L. Prioridade da reposição.', answer: 'B' },
            { contentId: 'c-hipotireoidismo', contentName: 'Hipotireoidismo Primário & Dosagem de Levotiroxina', snippet: 'Fadiga, ganho de peso e constipação. TSH 14 mUI/L e T4 livre diminuído com anticorpo anti-TPO positivo.', answer: 'C' }
          ]
        }
      ]
    },
    {
      areaName: 'CIRURGIA GERAL',
      startQ: 21,
      endQ: 40,
      modules: [
        {
          moduloName: 'Trauma & Urgências Cirúrgicas',
          subareas: [
            { contentId: 'c-atls', contentName: 'Atendimento Inicial ao Politraumatizado (ATLS 10ª Ed)', snippet: 'Vítima de colisão com hipotensão, MV abolido à esquerda e turgência jugular. Conduta imediata: descompressão torácica no 4º/5º EIC.', answer: 'B' },
            { contentId: 'c-trauma-abd', contentName: 'Trauma Abdominal Fechado & E-FAST Positivo', snippet: 'Paciente instável hemodinamicamente com líquido livre no espaço hepatorrenal ao E-FAST. Indicação de laparotomia imediata.', answer: 'A' },
            { contentId: 'c-tce', contentName: 'Traumatismo Cranioencefálico & Hematoma Epidural', snippet: 'Intervalo lúcido após trauma têmporo-parietal com anisocoria homolateral rápida. TC com imagem biconvexa hiperdensa.', answer: 'C' },
            { contentId: 'c-queimaduras', contentName: 'Grandes Queimados & Fórmula de Parkland', snippet: 'Queimadura de 2º e 3º graus em 35% de superfície corporal. Cálculo de ressuscitação volêmica com Ringer Lactato.', answer: 'D' }
          ]
        },
        {
          moduloName: 'Abdome Agudo',
          subareas: [
            { contentId: 'c-apendicite', contentName: 'Apendicite Aguda & Escore de Alvarado', snippet: 'Dor periumbilical que migra para FID, sinal de Blumberg positivo e leucocitose com desvio à esquerda.', answer: 'A' },
            { contentId: 'c-colecistite', contentName: 'Colecistite Aguda Litiásica & Critérios de Tóquio', snippet: 'Dor em hipocôndrio direito com febre e sinal de Murphy positivo ao exame físico. USG com espessamento de parede da vesícula.', answer: 'B' },
            { contentId: 'c-pancreatite', contentName: 'Pancreatite Aguda & Critérios de Atlanta/Ranson', snippet: 'Dor em faixa irradiada para dorso após libação alcoólica com amilase e lipase 4 vezes acima do limite superior.', answer: 'C' },
            { contentId: 'c-obstrucao', contentName: 'Obstrução Intestinal por Bridas e Volvo', snippet: 'Distensão abdominal progressiva, parada de eliminação de gases e fezes e níveis hidroaéreos escalonados no Rx.', answer: 'A' },
            { contentId: 'c-ulcera-perfurada', contentName: 'Abdome Agudo Perfurativo & Pneumoperitônio', snippet: 'Dor abdominal súbita em facada com abdome em tábua. Rx de tórax em ortostase com ar livre sob cúpula diafragmática.', answer: 'D' }
          ]
        },
        {
          moduloName: 'Parede Abdominal & Hérnias',
          subareas: [
            { contentId: 'c-hernias', contentName: 'Hérnia Inguinal Indireta e Direta & Classificação Nyhus', snippet: 'Abaulamento redutível em região inguinal que toca a ponta do dedo examinador através do anel inguinal externo.', answer: 'B' },
            { contentId: 'c-hernia-femoral', contentName: 'Hérnia Femoral & Risco de Encarceramento', snippet: 'Mulher idosa com dor aguda em fossa ilíaca direita e tumoração dolorosa e irredutível abaixo do ligamento inguinal.', answer: 'C' }
          ]
        },
        {
          moduloName: 'Cirurgia Vascular',
          subareas: [
            { contentId: 'c-oclusao-arterial', contentName: 'Oclusão Arterial Aguda dos Membros Inferiores', snippet: 'Os 6 Ps de Pratt: dor súbita intensa, palidez, ausência de pulsos, parestesia, paralisia e hipotermia do membro.', answer: 'A' },
            { contentId: 'c-tvp', contentName: 'Trombose Venosa Profunda & Escore de Wells', snippet: 'Edema assimétrico de membro inferior direito com empastamento de panturrilha e sinal de Homans positivo.', answer: 'B' }
          ]
        },
        {
          moduloName: 'Oncologia Cirúrgica',
          subareas: [
            { contentId: 'c-cancer-colorretal', contentName: 'Câncer Colorretal & Rastreamento Populacional', snippet: 'Mudança do hábito intestinal e sangramento retal em homem de 58 anos. Colonoscopia e estadiamento TNM.', answer: 'C' },
            { contentId: 'c-cancer-gastrico', contentName: 'Câncer Gástrico & Classificação de Lauren', snippet: 'Adenocarcinoma gástrico tipo intestinal de Lauren versus tipo difuso (células em anel de sinete).', answer: 'D' },
            { contentId: 'c-nodulo-tireoide', contentName: 'Nódulo de Tireoide & Classificação Bethesda', snippet: 'PAAF guiada por ultrassom de nódulo tireoidiano hipoecoico com microcalcificações revelando Bethesda V.', answer: 'A' }
          ]
        }
      ]
    },
    {
      areaName: 'PEDIATRIA',
      startQ: 41,
      endQ: 60,
      modules: [
        {
          moduloName: 'Puericultura & Desenvolvimento',
          subareas: [
            { contentId: 'c-marcos-desenvolvimento', contentName: 'Marcos do Desenvolvimento Neuropsicomotor', snippet: 'Lactente de 6 meses capaz de sentar sem apoio e transferir objetos entre as mãos, iniciando balbucio.', answer: 'A' },
            { contentId: 'c-aleitamento', contentName: 'Aleitamento Materno Exclusivo & Pega Correta', snippet: 'Fissura mamilar dolorosa no 5º dia pós-parto decorrente de pega inadequada com queixo longe da mama.', answer: 'C' },
            { contentId: 'c-crescimento', contentName: 'Baixa Estatura & Velocidade de Crescimento', snippet: 'Criança com altura abaixo do percentil 3. Diferenciação entre retardo constitucional e baixa estatura familiar.', answer: 'B' }
          ]
        },
        {
          moduloName: 'Neonatologia',
          subareas: [
            { contentId: 'c-reanimacao-neonatal', contentName: 'Reanimação Neonatal em Sala de Parto (>34 semanas)', snippet: 'Recém-nascido a termo banhado em mecônio, em apneia e bradicárdico (FC < 100 bpm). VPP com máscara facial.', answer: 'B' },
            { contentId: 'c-ictericia-neonatal', contentName: 'Icterícia Neonatal Fisiológica vs Patológica', snippet: 'Icterícia com início nas primeiras 24 horas de vida com incompatibilidade ABO e Coombs direto positivo.', answer: 'A' },
            { contentId: 'c-sdr-neonatal', contentName: 'Síndrome do Desconforto Respiratório & Surfactante', snippet: 'Prematuro de 30 semanas com taquipneia, gemência e tiragem. Rx com infiltrado reticulogranular difuso (vidro fosco).', answer: 'D' }
          ]
        },
        {
          moduloName: 'Doenças Respiratórias na Infância',
          subareas: [
            { contentId: 'c-bronquiolite', contentName: 'Bronquiolite Viral Aguda pelo VSR', snippet: 'Lactente de 4 meses com pródromos de coriza hialina que evolui para taquipneia, sibilos expiratórios e tiragem subcostal.', answer: 'A' },
            { contentId: 'c-asma-infantil', contentName: 'Asma na Infância e Manejo de Crise Aguda / Sibilância Recorrente', snippet: 'Crise de sibilância em escolar de 7 anos. Tratamento de resgate com salbutamol inalatório e corticoide oral.', answer: 'C' },
            { contentId: 'c-crupe', contentName: 'Laringotraqueobronquite Aguda (Crupe Viral)', snippet: 'Criança de 2 anos com tosse metálica (tosse de cachorro), estridor inspiratório e rouquidão. Nebulização com adrenalina.', answer: 'B' }
          ]
        },
        {
          moduloName: 'Infectologia Pediátrica',
          subareas: [
            { contentId: 'c-exantematicas', contentName: 'Doenças Exantemáticas na Infância (Sarampo e Varicela)', snippet: 'Febre alta, conjuntivite, tosse e manchas de Koplik na mucosa jugal, seguidas por exantema maculopapular confluente.', answer: 'A' },
            { contentId: 'c-febre-sem-foco', contentName: 'Febre sem Sinais de Localização & ITU na Infância', snippet: 'Lactente febril de 8 meses sem sintomas respiratórios ou gastrointestinais. EAS com piúria e urocultura.', answer: 'D' },
            { contentId: 'c-meningite-ped', contentName: 'Meningite Bacteriana Aguda na Infância', snippet: 'Lactente com irritabilidade, fontanela abaulada e petéquias em tronco. Punção lombar e ceftriaxona imediata.', answer: 'C' }
          ]
        },
        {
          moduloName: 'Gastroenterologia Pediátrica',
          subareas: [
            { contentId: 'c-diarreia-aguda', contentName: 'Doença Diarreica Aguda & Terapia de Reidratação Oral', snippet: 'Lactente desidratado com olhos fundos e sinal da prega que desaparece lentamente. Aplicação do Plano B da OMS.', answer: 'B' },
            { contentId: 'c-intussuscepcao', contentName: 'Invaginação Intestinal Aguda & Fezes em Geleia de Framboesa', snippet: 'Dor abdominal paroxística em cólica com choro inconsolável e eliminação de fezes com sangue e muco.', answer: 'A' }
          ]
        }
      ]
    },
    {
      areaName: 'GINECOLOGIA E OBSTETRÍCIA',
      startQ: 61,
      endQ: 80,
      modules: [
        {
          moduloName: 'Obstetrícia Geral & Alto Risco',
          subareas: [
            { contentId: 'c-sindromes-hipertensivas-da-gestacao', contentName: 'Síndromes Hipertensivas na Gestação & Pré-Eclâmpsia', snippet: 'Gestante de 34 semanas com PA 160x110 mmHg, proteinúria de fita 3+ e plaquetopenia. Indicação de Sulfato de Magnésio (Pritchard).', answer: 'D' },
            { contentId: 'c-prenatal', contentName: 'Assistência Pré-Natal de Baixo Risco & Rastreamento', snippet: 'Exames obrigatórios do primeiro trimestre: tipagem sanguínea, VDRL, HIV, HBsAg, toxoplasmose e urocultura.', answer: 'A' },
            { contentId: 'c-diabetes-gestacional', contentName: 'Diabetes Mellitus Gestacional (DMG) & TOTG 75g', snippet: 'Glicemia de jejum de 96 mg/dL na 12ª semana confirmando diagnóstico de diabetes gestacional.', answer: 'B' }
          ]
        },
        {
          moduloName: 'Hemorragias da Gestação',
          subareas: [
            { contentId: 'c-abortamento', contentName: 'Sangramento da 1ª Metade: Abortamento e Ectópica', snippet: 'Atraso menstrual de 7 semanas com dor pélvica aguda e sangramento vaginal escuro. USG sem saco gestacional intrauterino.', answer: 'C' },
            { contentId: 'c-dpp', contentName: 'Descolamento Prematuro de Placenta (DPP) vs Placenta Prévia', snippet: 'Gestante de 36 semanas com dor abdominal súbita em cólica intensa, hipertonia uterina e sangramento vermelho-escuro.', answer: 'A' },
            { contentId: 'c-placenta-previa', contentName: 'Placenta Prévia & Sangramento Indolor', snippet: 'Sangramento vaginal indolor, vermelho-vivo, rutilante e de repetição no 3º trimestre com concepto com vitalidade preservada.', answer: 'B' }
          ]
        },
        {
          moduloName: 'Parto e Puerpério',
          subareas: [
            { contentId: 'c-mecanismo-parto', contentName: 'Trabalho de Parto, Partograma & Distocias', snippet: 'Análise do partograma demonstrando dilatação cervical estacionária por mais de duas horas na presença de contrações eficientes.', answer: 'C' },
            { contentId: 'c-hemorragia-posparto', contentName: 'Hemorragia Pós-Parto (HPP) & Atonia Uterina', snippet: 'Sangramento puerperal volumoso logo após dequitação. Útero flácido e amolecido acima da cicatriz umbilical.', answer: 'D' }
          ]
        },
        {
          moduloName: 'Ginecologia Geral & Planejamento Familiar',
          subareas: [
            { contentId: 'c-sua', contentName: 'Ginecologia Geral, Planejamento Familiar & Sangramento Uterino Anormal', snippet: 'Mulher de 42 anos com menorragia crônica. Classificação FIGO pelo sistema PALM-COEIN (Pólipo, Adenomiose, Leiomioma).', answer: 'A' },
            { contentId: 'c-anticoncepcao', contentName: 'Critérios de Elegibilidade da OMS para Métodos Contraceptivos', snippet: 'Puérpera de 3 semanas em aleitamento materno exclusivo solicitando método anticoncepcional sem estrogênio.', answer: 'B' },
            { contentId: 'c-vulvovaginites', contentName: 'Vulvovaginites: Candidíase, Vaginose e Tricomoníase', snippet: 'Corrimento branco-acinzentado bolhoso com odor fétido e colo em framboesa ao exame especular (Tricomoníase).', answer: 'C' }
          ]
        },
        {
          moduloName: 'Oncologia Ginecológica & Mastologia',
          subareas: [
            { contentId: 'c-cancer-colo', contentName: 'Câncer de Colo Uterino & Rastreamento Citopatológico', snippet: 'Citologia oncótica cervical com lesão intraepitelial de alto grau (HSIL). Indicação mandatória de colposcopia.', answer: 'A' },
            { contentId: 'c-cancer-mama', contentName: 'Câncer de Mama & Classificação BI-RADS', snippet: 'Mamografia de rastreamento demonstrando nódulo espiculado com microcalcificações pleomórficas agrupadas (BI-RADS 5).', answer: 'D' }
          ]
        }
      ]
    },
    {
      areaName: 'MEDICINA PREVENTIVA E SOCIAL',
      startQ: 81,
      endQ: 100,
      modules: [
        {
          moduloName: 'Epidemiologia Clínica & Bioestatística',
          subareas: [
            { contentId: 'c-estudos', contentName: 'Delineamento de Estudos & Testes Diagnósticos', snippet: 'Cálculo de Risco Relativo em estudo de coorte prospectivo e Odds Ratio em estudo de caso-controle.', answer: 'B' },
            { contentId: 'c-testes-diag', contentName: 'Sensibilidade, Especificidade, VPP e VPN', snippet: 'Avaliação do impacto da prevalência da doença sobre os Valores Preditivos Positivo e Negativo de um teste.', answer: 'A' },
            { contentId: 'c-vieses', contentName: 'Vieses de Confundimento e Seleção & Randomização', snippet: 'Mecanismos metodológicos para controle de fatores de confusão na fase de desenho e análise estatística.', answer: 'C' }
          ]
        },
        {
          moduloName: 'SUS & Políticas Públicas',
          subareas: [
            { contentId: 'c-principios-sus', contentName: 'Princípios Doutrinários e Organizativos do SUS', snippet: 'Princípio da Equidade: tratar desigualmente os desiguais para reduzir disparidades no acesso à saúde.', answer: 'D' },
            { contentId: 'c-leis-organicas', contentName: 'Leis Orgânicas da Saúde: Lei 8.080/90 e Lei 8.142/90', snippet: 'A Lei 8.142/90 e a garantia da participação da comunidade por meio das Conferências e Conselhos de Saúde.', answer: 'A' },
            { contentId: 'c-financiamento-sus', contentName: 'Financiamento e Gestão do Sistema Único de Saúde', snippet: 'Critérios de repasse interfederativo de recursos fundo a fundo da União para Estados e Municípios.', answer: 'B' }
          ]
        },
        {
          moduloName: 'Vigilância em Saúde',
          subareas: [
            { contentId: 'c-notificacao', contentName: 'Doenças de Notificação Compulsória (Lista Nacional)', snippet: 'Prazos de notificação imediata (até 24 horas) para casos suspeitos de botulismo, febre amarela e raiva humana.', answer: 'C' },
            { contentId: 'c-indicadores', contentName: 'Indicadores Demográficos e de Saúde (Mortalidade Infantil)', snippet: 'Cálculo e interpretação do Coeficiente de Mortalidade Infantil (componentes neonatal precoce, tardio e pós-neonatal).', answer: 'B' }
          ]
        },
        {
          moduloName: 'Atenção Primária & Saúde do Trabalhador',
          subareas: [
            { contentId: 'c-mccp', contentName: 'Método Clínico Centrado na Pessoa & Atenção Domiciliar', snippet: 'Os 4 pilares do MCCP na consulta médica: explorando a doença e a experiência da pessoa com a enfermidade.', answer: 'A' },
            { contentId: 'c-saude-trabalhador', contentName: 'Saúde do Trabalhador & Acidentes de Trabalho (CAT)', snippet: 'Emissão da Comunicação de Acidente de Trabalho (CAT) pelo médico assistente, independentemente de filiação formal.', answer: 'D' }
          ]
        }
      ]
    }
  ];

  const questions: ExamQuestionEntry[] = [];
  let qNumber = 1;

  for (const area of areasConfig) {
    const questionsInThisArea: ExamQuestionEntry[] = [];
    // Distribuir exatamente 20 questões por grande área
    const targetCount = 20;
    const allAreaSubareas = area.modules.flatMap(m => m.subareas.map(s => ({ ...s, moduloName: m.moduloName })));

    for (let i = 0; i < targetCount; i++) {
      const sub = allAreaSubareas[i % allAreaSubareas.length];
      const qNum = qNumber++;
      questionsInThisArea.push({
        id: `q-${type.toLowerCase()}-${qNum}`,
        questionNumber: qNum,
        statementSnippet: sub.snippet,
        contentId: sub.contentId,
        contentName: sub.contentName,
        moduloName: sub.moduloName,
        areaName: area.areaName,
        isCorrect: false, // Inicialmente pendente até correção
        errorReason: undefined,
        aiSuggestedContentId: sub.contentId,
        userCorrectionNote: undefined
      });
    }

    questions.push(...questionsInThisArea);
  }

  return questions;
};
