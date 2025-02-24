export enum ProjectStatusEnum {
  ON_DEVELOPMENT = 'On Development',
  ON_PRE_PRODUCTION = 'On Pre-production',
  ON_PRODUCTION = 'On Production',
  ON_POST_PRODUCTION = 'On Post Production',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold',
  DELETED = 'Deleted',
  IN_WRAP = 'In Wrap',
  INTANGIBLES = 'Intangibles'
}

export const ProjectStatusEnumArray: (string)[] = [
  ProjectStatusEnum.ON_DEVELOPMENT,
  ProjectStatusEnum.ON_PRE_PRODUCTION,
  ProjectStatusEnum.ON_PRODUCTION,
  ProjectStatusEnum.ON_POST_PRODUCTION,
  ProjectStatusEnum.CLOSED,
  ProjectStatusEnum.ON_HOLD,
  ProjectStatusEnum.DELETED,
  ProjectStatusEnum.IN_WRAP,
  ProjectStatusEnum.INTANGIBLES,
];

export enum ProjectTypeEnum {
  SCRIPTED_FILM = 'Scripted film',
  SCRIPTED_SERIES = 'Scripted series',
  NON_SCRIPTED_FILM = 'Non-scripted film',
  NON_SCRIPTED_SERIES = 'Non-scripted series'
}

export const ProjectTypeEnumArray: (string)[] = [
  ProjectTypeEnum.SCRIPTED_FILM,
  ProjectTypeEnum.SCRIPTED_SERIES,
  ProjectTypeEnum.NON_SCRIPTED_FILM,
  ProjectTypeEnum.NON_SCRIPTED_SERIES,
];

export enum SceneTypeEnum {
  SCENE = 'SCENE',
  PROTECTION = 'PROTECTION',
}

export enum ProtectionTypeEnum {
  VOICE_OFF = 'VOICE OFF',
  IMAGE = 'IMAGE',
  STOCK_IMAGE = 'STOCK IMAGE',
  VIDEO = 'VIDEO',
  STOCK_VIDEO = 'STOCK VIDEO',
  MULTIMEDIA = 'MULTIMEDIA',
  PHOTO = 'PHOTO',
  OTHER = 'OTHER',
}

export enum IntOrExtOptionEnum {
  INT = 'INTERIOR',
  EXT = 'EXTERIOR',
  INT_EXT = 'INT/EXT',
  EXT_INT = 'EXT/INT',
}

export enum DayOrNightOptionEnum {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  SUNSET = 'SUNSET',
  SUNRISE = 'SUNRISE',
}

// ARRAYS WITH ENNUMS

export const SceneTypeEnumArray: string[] = [
  SceneTypeEnum.SCENE,
  SceneTypeEnum.PROTECTION,
];

export const ProtectionTypeEnumArray: string[] = [
  ProtectionTypeEnum.VOICE_OFF,
  ProtectionTypeEnum.IMAGE,
  ProtectionTypeEnum.STOCK_IMAGE,
  ProtectionTypeEnum.VIDEO,
  ProtectionTypeEnum.STOCK_VIDEO,
  ProtectionTypeEnum.MULTIMEDIA,
  ProtectionTypeEnum.OTHER,
  ProtectionTypeEnum.PHOTO,
];

export const IntOrExtOptionEnumArray: string[] = [
  IntOrExtOptionEnum.INT,
  IntOrExtOptionEnum.EXT,
  IntOrExtOptionEnum.INT_EXT,
  IntOrExtOptionEnum.EXT_INT,
];

export const DayOrNightOptionEnumArray: string[] = [
  DayOrNightOptionEnum.DAY,
  DayOrNightOptionEnum.NIGHT,
  DayOrNightOptionEnum.SUNSET,
  DayOrNightOptionEnum.SUNRISE,
];

// SHOOTING ENNUMS

export enum ShootingStatusEnum {
  Open = 1,
  Called = 2,
  Closed = 3,
}

export const ShootingStatusEnumArray: number[] = [
  ShootingStatusEnum.Closed,
  ShootingStatusEnum.Called,
  ShootingStatusEnum.Open,
];

export enum ShootingSceneStatusEnum {
  Assigned = 1,
  Shoot = 2,
  NotShoot = 3
}

export const ShootingSceneStatusEnumArray: number[] = [
  ShootingSceneStatusEnum.Assigned,
  ShootingSceneStatusEnum.Shoot,
  ShootingSceneStatusEnum.NotShoot,
];

export enum InfoType {
  Date = 'date',
  Year = 'year',
  Time = 'time',
  Number = 'number',
  Text = 'text',
  Fraction = 'fraction',
  Integer = 'integer',
  Hours = 'hours',
  LongText = 'longText',
  Pages = 'pages',
  Minutes = 'minutes',
  Select = 'select',
  CategorizedSelect = 'categorizedSelect',
}

export enum EmptyEnum {
  NoCategory = 'NO CATEGORY',
}