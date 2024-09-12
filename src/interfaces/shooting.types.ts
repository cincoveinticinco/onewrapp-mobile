import { ShootingSceneStatusEnum, ShootingStatusEnum } from '../Ennums/ennums';

export interface ShootingScene {
  id?: string | null;
  projectId: number;
  shootingId: number;
  sceneId: string;
  status: ShootingSceneStatusEnum;
  position: number | null;
  rehersalStart: string | null;
  rehersalEnd: string | null;
  startShooting: string | null;
  endShooting: string | null;
  producedSeconds: number | null;
  comment: string | null;
  partiality: boolean | null;
  setups: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Shooting {
  id: string;
  projectId: number;
  unitId: number;
  unitNumber: number;
  shootDate: string | null;
  generalCall: string | null;
  onSet: string | null;
  estimatedWrap: string | null;
  firstShoot: string | null;
  wrap: string | null;
  lastOut: string | null;
  status: ShootingStatusEnum;
  isTest: boolean;
  createdAt: string;
  updatedAt: string;
  banners: ShootingBanner[];
  scenes: ShootingScene[];
  locations: LocationInfo[];
  hospitals: Hospital[];
  meals: Meal[];
  advanceCalls: AdvanceCall[];
  castCalls: CastCalls[];
  extraCalls: ExtraCall[];
  crewCalls: CrewCall[];
  pictureCars: PictureCar[];
  otherCalls: OtherCall[];
  services: FormattedService[];
}

export interface ShootingBanner {
  id?: string | null;
  shootingId: number;
  description: string;
  backgroundColor: string | null;
  fontSize: number | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdvanceCalls {
  error: boolean;
  advanceCalls: AdvanceCall[];
  departments: string[];
}

export interface AdvanceCall {
  id: number;
  shooting_id: number;
  department_id: number;
  adv_pick_up: string | null;
  adv_call_time: string;
  adv_wrap: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  dep_name_eng: string;
  dep_name_esp: string;
}

export interface LocationInfo {
  locationTypeId: number;
  locationName: string;
  locationAddress: string;
  locationPostalCode: string;
  lat: string;
  lng: string;
}

export interface Meal {
  [key: string]: any;
}

export interface CastCalls {
  id: string;
  projectCastId: number;
  shootingId: number;
  pickUp: string | null;
  callTime: string | null;
  onMakeUp: string | null;
  onWardrobe: string | null;
  readyToShoot: string | null;
  arrived: string | null;
  wrap: string | null;
  startProcesses: string | null;
  wrapSet: string | null;
  dropOff: string | null;
  mealIn: string | null;
  mealOut: string | null;
  mealExtraIn: string | null;
  mealExtraOut: string | null;
  castName: string | null;
  castNumber: string | null;
  castCategory: string | null;
  castCategoryId: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExtraCall {
  id: string;
  shootingId: number;
  projExtraId: number;
  pickUp: Date | null;
  callTime: Date | null;
  onMakeUp: Date | null;
  onWardrobe: Date | null;
  readyToShoot: Date | null;
  arrived: Date | null;
  wrap: Date | null;
  quantity: number | null;
  extraName: string | null;
  talentAgency: string | null;
  notes: string | null;
}

export interface CrewCall {
  crewName: string;
  id: string;
  visible: boolean | null;
  unit: string | null;
  name: string | null;
  department: string | null;
  position: string | null;
  call: string | null;
  callPlace: string | null;
  wrap: string | null;
  onCall: boolean | null;
}

export interface PictureCar {
  id: string;
  pictureCarId: number;
  pictureCarName: string;
  callTime: string;
  quantity: number;
}

export interface OtherCall {
  id: string;
  callTime: string;
  otherCallId: number;
  otherCallName: string;
  quantity: number;
}

export interface Hospital {
  id: string;
  hospitalId: number;
  hospitalName: string;
  callTime: string;
  quantity: number;
}

export interface FormattedService {
  description: string;
  providerName: string;
  providerId: number;
  quantity: string;
  unitCost: string;
  tax: string | null;
  retention: string | null;
  aiuUtility: number | null;
  aiuPercent: number | null;
  aiuValue: number | null;
  totalCost: string  | null;
  files: number;
  observations: string | null;
}