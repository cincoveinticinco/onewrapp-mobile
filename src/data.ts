// import { Scene } from './interfaces/scenesTypes';

import { ShootingSceneStatusEnum, ShootingStatusEnum } from './ennums/ennums';

const projects = [
  {
    id: 163,
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
    id: 164,
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
    id: 165,
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
    id: 166,
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
    id: 167,
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
    id: 168,
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
    id: 169,
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
    id: 170,
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

export const paragraphs = [
  {
    type: 'scene',
    content: '1_1 INT. DF, DEPTO JUAN Y MARÍA. SALA/COMEDOR - DAY 01',
  },
  {
    type: 'description',
    content: 'Una pequeña y cálida sala de un departamento en la colonia Roma. Destacan varias maquetas arquitectónicas que compiten por espacio con muchas plantas, GOS restiradores, un mueble con TVy Betamax, un par de sofás de la época y un estéreo con tornamesa, discos de acetato y reproductor de cassettes. Es un espacio mitad casa, mitad despacho de arquitectos.',
  },
  {
    type: 'description',
    content: ' En temprano por la mañana. El reloj marca las 7:00 am.',
  },
  {
    type: 'description',
    content: 'Juan (32), un hombre de apariencia gentil y MARÍA (30), una mujer de presencia fuerte e innegable belleza, estan a la mitad de una fuerte pelea.',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: 'Es una oportunidad para los dos, Maria. No puedo decir que no.',
  },
  {
    type: 'character',
    content: 'MARÍA',
  },
  {
    type: 'dialog',
    content: 'Soy rata de ciudad, Juan. ¿Qué voy a hacer viviendo meses en la sierra?',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: 'Trabajar juntos. Divertirnos. Hacer el amor. No estaría mal, ¿no?',
  },
  {
    type: 'action',
    content: 'María se siente picada por el comentario.',
  },
  {
    type: 'character',
    content: 'MARÍA',
  },
  {
    type: 'dialog',
    content: 'Vete tú. Ni te obligo a quedarte, ni me obligues a hacer cosas que no quiero.',
  },
  {
    type: 'action',
    content: 'Juan se queda descolocado. Descubrimos que María tiene una maleta a su lado. Ella se levanta y la toma',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: 'Prefieres dejarnos? ¿En serio, te vas? ¿Y Pablo?',
  },
  {
    type: 'character',
    content: 'MARÍA',
  },
  {
    type: 'dialog',
    content: 'Sin chantajes, Juan. Te hago la misma pregunta. ¿Y Pablo? Lejos de sus amigos, de su escuela, de su mundo. Lejos de mi.',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: 'Solo no puedo.',
  },
  {
    type: 'action',
    content: 'Se miran, con dolor.',
  },
  {
    type: 'character',
    content: 'MARÍA',
  },
  {
    type: 'dialog',
    content: 'Quieres que meta mis sueños en una maleta y te siga al fin del mundo sin importarte lo que necesito.',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: 'Si me importa. Es sólo un tiempo.',
  },
  {
    type: 'character',
    content: 'MARÍA',
  },
  {
    type: 'dialog',
    content: 'No me dejes, Juan. Vámonos juntos a California.',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: '¡Qué carajos! ¡Nacimos allá!',
  },
  {
    type: 'action',
    content: 'María toma su maleta y va hacia la puerta. Juan le cierra el paso. Forcejean. La pelea se torna casi violenta.',
  },
  {
    type: 'character',
    content: 'JUAN',
  },
  {
    type: 'dialog',
    content: '¡No, no te van a ningún lado!',
  },
  {
    type: 'action',
    content: 'Se dan cuenta que PABLO NING (6), un niño con gran parecido a Juan vestido con su uniforme de la escuela, los mira asustado.',
  },
];

export const fakeShootings: any[] = [
  {
    id: 'shooting-1',
    projectId: 123,
    unitId: 456,
    unitNumber: 1,
    shootDate: '2024-05-01',
    generalCall: '08:00',
    onSet: '09:00',
    estimatedWrap: '18:00',
    firstShoot: '10:00',
    wrap: null,
    lastOut: null,
    status: ShootingStatusEnum.Called,
    isTest: false,
    createdAt: '2024-04-15T10:30:00Z',
    updatedAt: '2024-05-01T08:15:00Z',
    scenes: [
      {
        id: 'scene-1',
        projectId: 123,
        shootingId: 1,
        sceneId: '1A',
        status: ShootingSceneStatusEnum.Assigned,
        position: 1,
        rehearsalStart: '10:00',
        rehearsalEnd: '10:30',
        startShooting: '11:00',
        endShooting: '14:00',
        producedSeconds: 7200,
        setups: 5,
        createdAt: '2024-04-15T10:30:00Z',
        updatedAt: '2024-05-01T14:15:00Z',
      },
      {
        id: 'scene-2',
        projectId: 123,
        shootingId: 1,
        sceneId: '2B',
        status: ShootingSceneStatusEnum.Assigned,
        position: 2,
        rehearsalStart: '14:30',
        rehearsalEnd: '15:00',
        startShooting: '15:30',
        endShooting: null,
        producedSeconds: null,
        setups: null,
        createdAt: '2024-04-15T10:30:00Z',
        updatedAt: '2024-05-01T16:00:00Z',
      },
    ],
  },
  {
    id: 'shooting-2',
    projectId: 789,
    unitId: 101,
    unitNumber: 1,
    shootDate: '2024-05-15',
    generalCall: '07:00',
    onSet: '08:00',
    estimatedWrap: '20:00',
    firstShoot: '09:00',
    wrap: null,
    lastOut: null,
    status: ShootingStatusEnum.Closed,
    isTest: false,
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-05-10T09:30:00Z',
    scenes: [],
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

export default projects;
