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

// PARAGRAPHS TYPES
