import { Scene } from "./interfaces/scenesTypes";

export const projects = [
  {
    id: '01',
    projName: 'Memorias De Una Soledad',
    projAbreviation: 'MDS',
    season: 1,
    projStatus: 'On Development',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2024,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '02',
    projName: 'El Dentista',
    projAbreviation: 'ED',
    season: 1,
    projStatus: 'On Production',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2023,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '03',
    projName: 'La Vida Entera',
    projAbreviation: 'LVD',
    season: 1,
    projStatus: 'On Pre-production',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2024,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '04',
    projName: 'La Banda',
    projAbreviation: 'LBDN',
    season: null,
    projStatus: 'On Post-production',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2024,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '05',
    projName: 'Memorias De Una Soledad',
    projAbreviation: 'MDS',
    season: 1,
    projStatus: 'On Development',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2024,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '06',
    projName: 'El Dentista',
    projAbreviation: 'ED',
    season: 1,
    projStatus: 'On Production',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2023,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '07',
    projName: 'La Vida Entera',
    projAbreviation: 'LVD',
    season: 1,
    projStatus: 'On Pre-production',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2024,
    updatedAt: '2024-01-09T12:57:10Z',
  },
  {
    id: '08',
    projName: 'La Banda',
    projAbreviation: 'LBDN',
    season: null,
    projStatus: 'On Post-production',
    projType: 'Scripted Series',
    prodCenter: 'Mexico',
    episodes: 20,
    year: 2024,
    updatedAt: '2024-01-09T12:57:10Z',
  },
];

export const scenes: Scene[] = [
  {
    id: 'scene-1022-int-day-26',
    projectId: '01',
    episodeNumber: 10,
    sceneNumber: '22',
    sceneType: 'scene',
    protectionType: null,
    intOrExtOption: 'INT',
    dayOrNightOption: 'day',
    locationName: 'INTERNADO LA VICTORIA',
    setName: 'CAMINO AL INTERNADO',
    scriptDay: '26',
    year: '2022',
    synopsis: 'POLICIAS VAN PREGUNTANDO E INFORMA A CESAR SE COMIENZA LA BUSQUEDA DEL CUERPO DE PEDRO',
    page: 0,
    pages: 0.375,
    estimatedSeconds: 400,
    characters: [
      {
        categoryName: 'Principal',
        characterName: 'Cesar',
        characterNum: 1
      },
      {
        categoryName: 'Principal',
        characterName: 'Pedro',
        characterNum: 2
      },
      {
        categoryName: 'Principal',
        characterName: 'Jorge',
        characterNum: 3
      }
    ],
    extras: null,
    elements: [],
    notes: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'scene-1023-int-day-26',
    projectId: '01',
    episodeNumber: 10,
    sceneNumber: '22',
    sceneType: 'scene',
    protectionType: null,
    intOrExtOption: 'INT',
    dayOrNightOption: 'day',
    locationName: 'INTERNADO LA VICTORIA',
    setName: 'CAMINO AL INTERNADO', // UNIQUE NOT NULL
    scriptDay: '26',
    year: '2022',
    synopsis: 'POLICIAS VAN PREGUNTANDO E INFORMA A CESAR SE COMIENZA LA BUSQUEDA DEL CUERPO DE PEDRO',
    page: 0,
    pages: 0.375, // siempre 8
    estimatedSeconds: 125, // To minutes
    characters: [
      {
        categoryName: 'Principal',
        characterName: 'Cesar',
        characterNum: 1
      },
      {
        categoryName: 'Principal',
        characterName: 'Pedro',
        characterNum: 2
      },
      {
        categoryName: 'Principal',
        characterName: 'Jorge',
        characterNum: 3
      }
    ], // CAN BE NULL
    extras: null,
    elements: [],
    notes: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'scene-1024-int-day-26',
    projectId: '01',
    episodeNumber: 10,
    sceneNumber: '22',
    sceneType: 'scene',
    protectionType: null,
    intOrExtOption: 'INT',
    dayOrNightOption: 'day',
    locationName: 'INTERNADO LA VICTORIA',
    setName: 'CAMINO AL INTERNADO',
    scriptDay: '26',
    year: '2022',
    synopsis: 'POLICIAS VAN PREGUNTANDO E INFORMA A CESAR SE COMIENZA LA BUSQUEDA DEL CUERPO DE PEDRO',
    page: 0,
    pages: 0.375,
    estimatedSeconds: 213,
    characters: [
      {
        categoryName: 'Principal',
        characterName: 'Cesar',
        characterNum: 1
      },
      {
        categoryName: 'Principal',
        characterName: 'Pedro',
        characterNum: 2
      },
      {
        categoryName: 'Principal',
        characterName: 'Jorge',
        characterNum: 3
      }
    ],
    extras: null,
    elements: [],
    notes: [],
    updatedAt: new Date().toISOString()
  },
];

// SCENE COLOR

// SCENE TYPE === PROTECTION ROSE

// SCENE TYP === SCENE
  // CASE 1: INT OR EXT OR DAY OR NIGHT NULL,  BLACK
  // CASE 2: IF INT DAY, WHITE
  // CASE 4: IF INT NIGHT, YELLOW
  // CASE 5: IF EXT DAY, GREEN
  // CASE 6: IF EXT NIGHT, BLUE

// SCENE WITHOUT INT OR EXT BLACK, OR DAY OR NIGHT BLACK
// 
