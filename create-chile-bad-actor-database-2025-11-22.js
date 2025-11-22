#!/usr/bin/env node
/**
 * CHILE BAD ACTOR DATABASE - COMPREHENSIVE PERPETRATOR REGISTRY
 * Based on DINA Perpetrators Database + Chile Bad Actor Hunt Investigation
 * Date: 2025-11-22
 * Version: 2.0
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gatomaestrorevised:gaborevised@free-cluster.svjei3w.mongodb.net/';

const DATABASES = [
  'neko-defense-system',
  'marionnette-theater',
  'noel-precision-archives',
  'glam-street-chronicles',
  'hannibal-forensic-archives',
  'tetora-mpd-archives'
];

// ═══════════════════════════════════════════════════════════════════════════
// BAD ACTOR DATABASE - COMPREHENSIVE PERPETRATOR RECORDS
// ═══════════════════════════════════════════════════════════════════════════

const BAD_ACTORS = [
  // ═══════════════════════════════════════════════════════════════════════
  // TIER 0: DINA LEADERSHIP (CONVICTED/DECEASED)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'DINA-001',
    fullName: 'Juan Manuel Guillermo Contreras Sepúlveda',
    alias: 'Mamo',
    organization: 'DINA',
    rank: 'General',
    position: 'DINA Director (1973-1977)',
    birth: '1929',
    death: '2015-08-07',
    status: 'DECEASED_IN_PRISON',
    prosecutionStatus: 'CONVICTED',
    convictions: 59,
    totalSentence: '529 years + 2 life sentences',
    majorCases: [
      'Letelier-Moffitt assassination (USA) - 7 years',
      'Leighton attempted murder (Italy) - 18 years',
      'Prats assassination (Argentina) - 2 life sentences'
    ],
    crimes: ['Kidnapping', 'Forced disappearance', 'Assassination', 'Torture', 'International terrorism'],
    significance: 'Head of DINA. Most convicted state agent in Latin American history.',
    region: 'National',
    tier: 0,
    priority: 'HISTORICAL',
    documentaryAppearance: null,
    sources: ['Chilean courts', 'US courts', 'Italian courts']
  },
  {
    id: 'DINA-002',
    fullName: 'Raúl Eduardo Iturriaga Neumann',
    alias: null,
    organization: 'DINA',
    rank: 'General',
    position: 'DINA Vice-Director, Head of Foreign Department',
    birth: '~1939',
    death: null,
    status: 'IMPRISONED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '~200 years accumulated',
    prisonLocation: 'Punta Peuco',
    majorCases: [
      'Carlos Prats assassination (Argentina, 1974)',
      'Bernardo Leighton attempted murder (Rome, 1975)',
      'Operation Colombo',
      'Operation Condor coordination',
      'Villa Grimaldi operations'
    ],
    crimes: ['Assassination', 'Torture', 'Kidnapping', 'International terrorism'],
    significance: 'Second-in-command of DINA. Managed Operation Condor.',
    region: 'National/International',
    tier: 1,
    priority: 'CRITICAL',
    age: 86,
    documentaryAppearance: 'Phase 2 - Documentary 3',
    sources: ['Chilean courts', 'Italian courts']
  },
  {
    id: 'DINA-003',
    fullName: 'Pedro Octavio Espinoza Bravo',
    alias: null,
    organization: 'DINA',
    rank: 'Brigadier General',
    position: 'Chief Deputy, Head of Covert Operations',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '6 years (Letelier) + additional sentences',
    majorCases: ['Letelier assassination (intellectual author)'],
    crimes: ['Assassination planning', 'Covert operations command'],
    significance: 'Commanded DINA assassination squads.',
    region: 'National/International',
    tier: 1,
    priority: 'HIGH',
    documentaryAppearance: null,
    sources: ['US courts', 'Chilean courts']
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 1: INTERNATIONAL OPERATIVES
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'DINA-004',
    fullName: 'Michael Vernon Townley',
    alias: null,
    organization: 'DINA',
    rank: 'Agent',
    position: 'Chemical weapons specialist, Assassin',
    birth: '1942-12-05',
    birthPlace: 'Waterloo, Iowa, USA',
    nationality: 'American',
    death: null,
    status: 'US_WITNESS_PROTECTION',
    prosecutionStatus: 'CONVICTED_RELEASED',
    convictions: 3,
    totalSentence: '10 years USA (served 62 months), 18 years Italy (in absentia)',
    majorCases: [
      'Letelier-Moffitt assassination (Washington DC, 1976)',
      'Bernardo Leighton attempted assassination (Rome, 1975)',
      'Carlos Prats assassination (Buenos Aires, 1974)'
    ],
    crimes: ['Assassination', 'Car bombing', 'International terrorism'],
    significance: 'American-born DINA assassin. Only agent to cooperate with US.',
    controversy: 'Served minimal time despite multiple murders. Protected by US government.',
    region: 'International',
    tier: 1,
    priority: 'CRITICAL',
    age: 83,
    documentaryAppearance: 'Phase 2 - Documentary 3',
    sources: ['US courts', 'Italian courts', 'Chilean courts']
  },
  {
    id: 'DINA-005',
    fullName: 'Virgilio Paz Romero',
    alias: null,
    organization: 'Cuban Exile (DINA contractor)',
    rank: null,
    position: 'Letelier assassination executor',
    nationality: 'Cuban-American',
    birth: null,
    death: null,
    status: 'RELEASED',
    prosecutionStatus: 'CONVICTED_SERVED',
    convictions: 1,
    totalSentence: 'Served federal sentence',
    majorCases: ['Letelier-Moffitt car bombing (executed)'],
    crimes: ['Assassination', 'Terrorism'],
    significance: 'Planted car bomb that killed Letelier and Moffitt.',
    region: 'International (USA)',
    tier: 2,
    priority: 'HIGH',
    documentaryAppearance: 'Phase 2 - Documentary 3',
    sources: ['US courts']
  },
  {
    id: 'DINA-006',
    fullName: 'José Dionisio Suárez Esquivel',
    alias: null,
    organization: 'Cuban Exile (DINA contractor)',
    rank: null,
    position: 'Letelier assassination executor',
    nationality: 'Cuban-American',
    birth: null,
    death: null,
    status: 'RELEASED',
    prosecutionStatus: 'CONVICTED_SERVED',
    convictions: 1,
    totalSentence: 'Served federal sentence',
    majorCases: ['Letelier-Moffitt car bombing (co-executed)'],
    crimes: ['Assassination', 'Terrorism'],
    significance: 'Co-executed car bomb attack in Washington DC.',
    region: 'International (USA)',
    tier: 2,
    priority: 'HIGH',
    documentaryAppearance: 'Phase 2 - Documentary 3',
    sources: ['US courts']
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 2: TORTURE CENTER COMMANDERS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'DINA-007',
    fullName: 'Miguel Krassnoff Martchenko',
    alias: null,
    organization: 'DINA',
    rank: 'Army Officer',
    position: 'Brigade Commander, Villa Grimaldi Operations',
    birth: null,
    death: null,
    status: 'IMPRISONED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: 'Multiple sentences',
    prisonLocation: 'Punta Peuco',
    majorCases: ['Villa Grimaldi torture center operations', 'Multiple disappearance cases'],
    crimes: ['Systematic torture', 'Kidnapping', 'Forced disappearances'],
    significance: 'One of most brutal DINA torturers. Villa Grimaldi commander.',
    region: 'Santiago',
    tier: 1,
    priority: 'CRITICAL',
    documentaryAppearance: 'Phase 2 - Documentary 2',
    sources: ['Chilean courts']
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 3: REGION XI AYSÉN PERPETRATORS (From Chile Bad Actor Hunt)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'AYSEN-001',
    fullName: 'Humberto Gordon Rubio',
    alias: null,
    organization: 'Chilean Army / CNI',
    rank: 'General',
    position: 'Commander Regiment 14 Aysén (1973-1974), CNI Director (1980-1986)',
    birth: null,
    death: '2000',
    status: 'DECEASED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: 'Convicted for Tucapel Jiménez assassination',
    majorCases: ['Tucapel Jiménez assassination', 'Regiment 14 operations', 'CNI directorship'],
    crimes: ['Assassination', 'Torture authorization', 'Command responsibility'],
    significance: 'Commander of Aysén during coup. Later became CNI Director.',
    region: 'XI Region Aysén / National',
    tier: 1,
    priority: 'HISTORICAL',
    documentaryAppearance: 'Documentary 1 (Chile Bad Actor Hunt)',
    sources: ['Chilean courts', 'Memoria Viva']
  },
  {
    id: 'AYSEN-002',
    fullName: 'Unknown TOMKOWIAC',
    alias: 'Suboficial Tomkowiac',
    organization: 'Carabineros de Chile',
    rank: 'Suboficial',
    position: 'Torturer at Regiment 14 Aysén',
    rut: 'UNKNOWN',
    birth: null,
    death: null,
    status: 'UNKNOWN',
    prosecutionStatus: 'UNPROSECUTED',
    convictions: 0,
    totalSentence: null,
    majorCases: ['Las Bandurrias detention camp torture'],
    crimes: ['Torture', 'Psychological pressure', 'Family threats'],
    significance: 'Name protected by Valech 50-year secrecy law until 2054.',
    protectedBy: 'Valech Commission 50-year secrecy',
    superiors: ['Raúl Ducassou Borde (Prefecto)', 'José González Mejías (Suboficial Mayor)'],
    investigationNotes: 'First name unknown. Strategies: Interview González Mejías, Carabineros records, survivor interviews, genealogical search.',
    region: 'XI Region Aysén',
    tier: 2,
    priority: 'CRITICAL',
    documentaryAppearance: 'Documentary 1 (Chile Bad Actor Hunt)',
    sources: ['Valech Commission (sealed)', 'Survivor testimonies']
  },
  {
    id: 'AYSEN-003',
    fullName: 'José María Fuentealba Suazo',
    alias: 'Death Doctor',
    organization: 'Ejército de Chile',
    rank: 'Medical Corps',
    position: 'Army Doctor, Hospital de Coyhaique',
    rut: '4.320.203-0',
    birth: null,
    death: '2012-07',
    status: 'DECEASED',
    prosecutionStatus: 'CONVICTED',
    convictions: 1,
    totalSentence: '7 years for qualified kidnapping',
    sentenceDate: '2010-12-16',
    majorCases: ['Kidnapping of 3 people from Argentina using hospital ambulance'],
    victims: ['Carlos Enrique Barría Navarro', 'Segundo Neftali Ulloa Marin', 'Juan de Dios Machuca Muñoz'],
    crimes: ['Kidnapping', 'Operation Condor cross-border crimes', 'Delivering bodies to morgue'],
    significance: 'Used medical position to facilitate kidnappings and disappearances.',
    region: 'XI Region Aysén',
    tier: 2,
    priority: 'HISTORICAL',
    documentaryAppearance: 'Documentary 1 (Chile Bad Actor Hunt)',
    sources: ['Caso Coyhaique sentencing (2010)', 'Memoria Viva', 'BioBioChile']
  },
  {
    id: 'AYSEN-004',
    fullName: 'Antonio Guillermo Parvex Canales',
    alias: null,
    organization: 'CNI',
    rank: 'Agent #1484',
    position: 'División Psicopolítica - Death notice deliverer',
    rut: '5.714.720-2',
    birth: null,
    death: null,
    status: 'LIVING_FREE',
    prosecutionStatus: 'UNPROSECUTED',
    convictions: 0,
    totalSentence: null,
    currentOccupation: 'Bestselling writer',
    evidence: [
      'Army Official Bulletin No. 23 (June 1990) - Listed as CNI member',
      'León Gómez Araneda DINA Agents List',
      'Interferencia Investigation (2019)',
      'Multiple witness testimonies'
    ],
    denials: 'Claims to have never been CNI agent despite documented evidence',
    majorCases: ['CNI psychological operations', 'Death notice delivery to families'],
    crimes: ['Psychological torture', 'CNI operations'],
    significance: 'Living freely as successful author despite documented CNI membership.',
    region: 'XI Region Aysén / National',
    tier: 2,
    priority: 'CRITICAL',
    documentaryAppearance: 'Documentary 1 (Chile Bad Actor Hunt)',
    sources: ['Army Bulletin No.23', 'El Siglo 1990 list', 'Interferencia']
  },
  {
    id: 'AYSEN-005',
    fullName: 'Joaquín Molina Fuenzalida',
    alias: null,
    organization: 'Chilean Army',
    rank: 'Captain',
    position: 'Interrogator at Las Bandurrias detention camp',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: 'Convicted for crimes against humanity',
    majorCases: ['Las Bandurrias detention camp operations'],
    crimes: ['Torture', 'Illegal detention'],
    significance: 'Key interrogator at main Aysén detention center.',
    region: 'XI Region Aysén',
    tier: 2,
    priority: 'MEDIUM',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  },
  {
    id: 'AYSEN-006',
    fullName: 'Raúl Ducassou Borde',
    alias: null,
    organization: 'Carabineros de Chile',
    rank: 'Prefecto',
    position: 'Prefect of Carabineros, Aysén',
    birth: null,
    death: null,
    status: 'UNKNOWN',
    prosecutionStatus: 'UNKNOWN',
    convictions: null,
    totalSentence: null,
    majorCases: ['Command of Carabineros operations in Aysén'],
    crimes: ['Command responsibility for torture'],
    significance: 'Superior of Tomkowiac. Commanded Carabineros torture operations.',
    subordinates: ['Tomkowiak'],
    region: 'XI Region Aysén',
    tier: 3,
    priority: 'HIGH',
    documentaryAppearance: 'Documentary 1 (Chile Bad Actor Hunt)',
    sources: ['Memoria Viva', 'Investigation documents']
  },
  {
    id: 'AYSEN-007',
    fullName: 'José González Mejías',
    alias: null,
    organization: 'Carabineros de Chile',
    rank: 'Suboficial Mayor',
    position: 'Senior NCO, Aysén Carabineros',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: 'Convicted for human rights violations',
    majorCases: ['Aysén detention operations'],
    crimes: ['Torture', 'Illegal detention'],
    significance: 'Convicted superior who may know Tomkowiac first name.',
    subordinates: ['Tomkowiak'],
    region: 'XI Region Aysén',
    tier: 3,
    priority: 'MEDIUM',
    investigationNotes: 'Key witness for identifying Tomkowiac first name.',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 4: OTHER CONVICTED DINA AGENTS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'DINA-008',
    fullName: 'César Manríquez Bravo',
    alias: null,
    organization: 'DINA',
    rank: 'Army Officer',
    position: 'DINA Brigade Chief',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '541 days to 10 years',
    majorCases: ['Systematic torture operations'],
    crimes: ['Torture', 'Kidnapping'],
    significance: 'High-ranking DINA officer convicted for systematic torture.',
    region: 'Santiago',
    tier: 3,
    priority: 'MEDIUM',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  },
  {
    id: 'DINA-009',
    fullName: 'Ciro Torré Sáez',
    alias: null,
    organization: 'DINA',
    rank: null,
    position: 'DINA Interrogator',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '541 days to 10 years',
    majorCases: ['Torture center operations'],
    crimes: ['Torture', 'Illegal detention'],
    significance: 'DINA interrogator at torture centers.',
    region: 'Santiago',
    tier: 4,
    priority: 'LOW',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  },
  {
    id: 'DINA-010',
    fullName: 'Klaudio Erich Kosiel Hornig',
    alias: null,
    organization: 'DINA',
    rank: null,
    position: 'DINA Agent',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '541 days to 10 years',
    majorCases: ['Human rights violations'],
    crimes: ['Torture'],
    significance: 'Convicted DINA agent.',
    region: 'Unknown',
    tier: 4,
    priority: 'LOW',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  },
  {
    id: 'DINA-011',
    fullName: 'Raúl Pablo Quintana Salazar',
    alias: null,
    organization: 'DINA',
    rank: null,
    position: 'DINA Agent',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '541 days to 10 years',
    majorCases: ['Illegal detention'],
    crimes: ['Torture', 'Illegal detention'],
    significance: 'Convicted DINA agent.',
    region: 'Unknown',
    tier: 4,
    priority: 'LOW',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  },
  {
    id: 'DINA-012',
    fullName: 'Vittorio Orviedo Tiplitzky',
    alias: null,
    organization: 'DINA',
    rank: null,
    position: 'DINA Agent',
    birth: null,
    death: null,
    status: 'CONVICTED',
    prosecutionStatus: 'CONVICTED',
    convictions: 'Multiple',
    totalSentence: '541 days to 10 years',
    majorCases: ['Human rights violations'],
    crimes: ['Torture'],
    significance: 'Convicted DINA agent.',
    region: 'Unknown',
    tier: 4,
    priority: 'LOW',
    documentaryAppearance: null,
    sources: ['Chilean courts']
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// VICTIMS DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const VICTIMS = [
  // Aysén Disappeared
  {
    id: 'VICTIM-AYSEN-001',
    fullName: 'Juan Vera Oyarzún',
    status: 'DISAPPEARED',
    date: '1973-10-27',
    location: 'Coyhaique',
    occupation: 'Secretario Regional Partido Comunista, Former union leader, Councilman',
    perpetrators: ['Regiment 14 personnel'],
    region: 'XI Region Aysén'
  },
  {
    id: 'VICTIM-AYSEN-002',
    fullName: 'José Rosendo Pérez Ríos',
    status: 'DISAPPEARED',
    date: '1973-10-27',
    location: 'Coyhaique',
    perpetrators: ['Regiment 14 personnel'],
    region: 'XI Region Aysén'
  },
  {
    id: 'VICTIM-AYSEN-003',
    fullName: 'Néstor Hernán Castillo Sepúlveda',
    status: 'DISAPPEARED',
    date: '1973-10-27',
    location: 'Coyhaique',
    perpetrators: ['Regiment 14 personnel'],
    region: 'XI Region Aysén'
  },
  // Aysén Executed
  {
    id: 'VICTIM-AYSEN-004',
    fullName: 'Moisés Ayanao Montoya',
    status: 'EXECUTED',
    date: '1973-10-25',
    location: 'Villa Los Torreones (Puerto Aysén-Coyhaique route)',
    age: 19,
    occupation: 'Worker',
    perpetrators: ['Unknown'],
    region: 'XI Region Aysén'
  },
  {
    id: 'VICTIM-AYSEN-005',
    fullName: 'Jorge Vilugrón Reyes',
    status: 'EXECUTED',
    date: '1973-10-08',
    location: 'Puerto Cisnes',
    perpetrators: ['Unknown'],
    region: 'XI Region Aysén'
  },
  {
    id: 'VICTIM-AYSEN-006',
    fullName: 'Osvaldo Alvarado Vargas',
    status: 'MURDERED',
    date: '1973-10-02',
    location: '2nd Carabineros Station, Puerto Aysén',
    perpetrators: ['Carabineros'],
    region: 'XI Region Aysén'
  },
  // Fuentealba Victims (kidnapped from Argentina)
  {
    id: 'VICTIM-AYSEN-007',
    fullName: 'Carlos Enrique Barría Navarro',
    status: 'KIDNAPPED_DISAPPEARED',
    date: '1973-10',
    location: 'Kidnapped from Argentina',
    perpetrators: ['José María Fuentealba Suazo'],
    region: 'XI Region Aysén / Argentina'
  },
  {
    id: 'VICTIM-AYSEN-008',
    fullName: 'Segundo Neftali Ulloa Marin',
    status: 'KIDNAPPED_DISAPPEARED',
    date: '1973-10',
    location: 'Kidnapped from Argentina',
    perpetrators: ['José María Fuentealba Suazo'],
    region: 'XI Region Aysén / Argentina'
  },
  {
    id: 'VICTIM-AYSEN-009',
    fullName: 'Juan de Dios Machuca Muñoz',
    status: 'KIDNAPPED_DISAPPEARED',
    date: '1973-10',
    location: 'Kidnapped from Argentina',
    perpetrators: ['José María Fuentealba Suazo'],
    region: 'XI Region Aysén / Argentina'
  },
  // International Victims
  {
    id: 'VICTIM-INT-001',
    fullName: 'Orlando Letelier del Solar',
    status: 'ASSASSINATED',
    date: '1976-09-21',
    location: 'Washington DC, USA',
    occupation: 'Former Chilean Ambassador, Economist',
    perpetrators: ['Michael Townley', 'Virgilio Paz Romero', 'José Dionisio Suárez'],
    region: 'International (USA)'
  },
  {
    id: 'VICTIM-INT-002',
    fullName: 'Ronni Karpen Moffitt',
    status: 'ASSASSINATED',
    date: '1976-09-21',
    location: 'Washington DC, USA',
    nationality: 'American',
    occupation: 'IPS colleague of Letelier',
    perpetrators: ['Michael Townley', 'Virgilio Paz Romero', 'José Dionisio Suárez'],
    region: 'International (USA)',
    note: 'US citizen killed by foreign intelligence operation on US soil'
  },
  {
    id: 'VICTIM-INT-003',
    fullName: 'Carlos Prats González',
    status: 'ASSASSINATED',
    date: '1974-09-30',
    location: 'Buenos Aires, Argentina',
    occupation: 'Former Chilean Army Commander-in-Chief',
    perpetrators: ['Michael Townley', 'DINA'],
    region: 'International (Argentina)'
  },
  {
    id: 'VICTIM-INT-004',
    fullName: 'Sofía Cuthbert Chiarleoni',
    status: 'ASSASSINATED',
    date: '1974-09-30',
    location: 'Buenos Aires, Argentina',
    occupation: 'Wife of Carlos Prats',
    perpetrators: ['Michael Townley', 'DINA'],
    region: 'International (Argentina)'
  },
  {
    id: 'VICTIM-INT-005',
    fullName: 'Bernardo Leighton Guzmán',
    status: 'SURVIVED_WOUNDED',
    date: '1975-10-06',
    location: 'Rome, Italy',
    occupation: 'Former Vice President of Chile',
    perpetrators: ['Michael Townley', 'Italian neo-fascists'],
    region: 'International (Italy)'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// DETENTION CENTERS
// ═══════════════════════════════════════════════════════════════════════════

const DETENTION_CENTERS = [
  {
    id: 'CENTER-001',
    name: 'Villa Grimaldi',
    officialName: 'Cuartel Terranova',
    location: 'Santiago',
    period: '1974-1978',
    organization: 'DINA',
    commander: 'Miguel Krassnoff Martchenko',
    prisonersProcessed: 4500,
    significance: 'Main DINA torture center',
    currentStatus: 'Peace Park / Memorial'
  },
  {
    id: 'CENTER-002',
    name: 'Londres 38',
    location: 'Santiago',
    period: '1973-1974',
    organization: 'DINA',
    executions: 94,
    significance: 'DINA headquarters, most notorious facility',
    currentStatus: 'Memorial'
  },
  {
    id: 'CENTER-003',
    name: 'Las Bandurrias',
    location: '15 km NE of Coyhaique, Aysén',
    period: '1973-1974',
    organization: 'Army/Carabineros',
    commander: 'Joaquín Molina Fuenzalida',
    personnel: ['Tomkowiac'],
    significance: 'Main Aysén detention/torture center',
    currentStatus: 'Unknown'
  },
  {
    id: 'CENTER-004',
    name: 'Regimiento 14 Aysén',
    location: 'Coyhaique',
    period: '1973-1990',
    organization: 'Army',
    commander: 'Humberto Gordon Rubio (1973-1974)',
    significance: 'Military base used for detention and torture',
    currentStatus: 'Active military installation'
  },
  {
    id: 'CENTER-005',
    name: 'Recinto CNI Coyhaique',
    location: 'Obispo Michelatto con Carrera, Coyhaique',
    period: '1977-1990',
    organization: 'CNI',
    significance: 'Regional CNI headquarters',
    currentStatus: 'Unknown'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE STATISTICS
// ═══════════════════════════════════════════════════════════════════════════

const STATISTICS = {
  dinaAgentsTotal: 1097,
  dinaAgentsProsecuted: 200,
  dinaAgentsUnprosecuted: 897,
  impunityRate: '82%',
  valechVictims: 38254,
  valechSecrecyUntil: 2054,
  massConviction2023: 53,
  confirmedVictimsAysen: 6,
  detentionCentersAysen: 22,
  tortureVictimsNational: 38254,
  disappearedNational: 957,
  executedNational: 2279
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

async function createBadActorDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🐾 CHILE BAD ACTOR DATABASE - CREATION INITIATED');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    for (const dbName of DATABASES) {
      const db = client.db(dbName);

      // Create collections
      const badActorsCollection = db.collection('chile-bad-actors');
      const victimsCollection = db.collection('chile-victims');
      const centersCollection = db.collection('chile-detention-centers');
      const statsCollection = db.collection('chile-statistics');

      // Clear existing data
      await badActorsCollection.deleteMany({});
      await victimsCollection.deleteMany({});
      await centersCollection.deleteMany({});
      await statsCollection.deleteMany({});

      // Insert new data
      await badActorsCollection.insertMany(BAD_ACTORS.map(actor => ({
        ...actor,
        createdAt: new Date(),
        updatedAt: new Date(),
        database: dbName
      })));

      await victimsCollection.insertMany(VICTIMS.map(victim => ({
        ...victim,
        createdAt: new Date(),
        database: dbName
      })));

      await centersCollection.insertMany(DETENTION_CENTERS.map(center => ({
        ...center,
        createdAt: new Date(),
        database: dbName
      })));

      await statsCollection.insertOne({
        ...STATISTICS,
        createdAt: new Date(),
        database: dbName
      });

      console.log(`✅ ${dbName}`);
      console.log(`   └─ Bad Actors: ${BAD_ACTORS.length}`);
      console.log(`   └─ Victims: ${VICTIMS.length}`);
      console.log(`   └─ Detention Centers: ${DETENTION_CENTERS.length}`);
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎯 CHILE BAD ACTOR DATABASE CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Database Summary:');
    console.log(`   Total Bad Actors: ${BAD_ACTORS.length}`);
    console.log(`   Total Victims: ${VICTIMS.length}`);
    console.log(`   Detention Centers: ${DETENTION_CENTERS.length}`);
    console.log(`   Databases Updated: ${DATABASES.length}`);
    console.log('');
    console.log('📋 Collections Created:');
    console.log('   • chile-bad-actors');
    console.log('   • chile-victims');
    console.log('   • chile-detention-centers');
    console.log('   • chile-statistics');
    console.log('');
    console.log('🔍 Bad Actors by Status:');
    const imprisoned = BAD_ACTORS.filter(a => a.status === 'IMPRISONED').length;
    const livingFree = BAD_ACTORS.filter(a => a.status === 'LIVING_FREE').length;
    const deceased = BAD_ACTORS.filter(a => a.status.includes('DECEASED')).length;
    const unknown = BAD_ACTORS.filter(a => a.status === 'UNKNOWN').length;
    const witnessProt = BAD_ACTORS.filter(a => a.status === 'US_WITNESS_PROTECTION').length;
    const released = BAD_ACTORS.filter(a => a.status === 'RELEASED').length;
    const convicted = BAD_ACTORS.filter(a => a.status === 'CONVICTED').length;
    console.log(`   • Imprisoned: ${imprisoned}`);
    console.log(`   • Living Free/Unprosecuted: ${livingFree}`);
    console.log(`   • Deceased: ${deceased}`);
    console.log(`   • US Witness Protection: ${witnessProt}`);
    console.log(`   • Released (served): ${released}`);
    console.log(`   • Convicted: ${convicted}`);
    console.log(`   • Unknown: ${unknown}`);
    console.log('');
    console.log('🐾 Nyaa~! Database creation complete, desu~! 💖');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

createBadActorDatabase();
