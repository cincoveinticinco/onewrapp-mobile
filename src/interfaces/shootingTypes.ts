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
  scenes: ShootingScene[];
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
  id: number | null | string;
  location_type_id: number;
  location_id: number;
  call_time: string | null;
  location_full_address: string;
  location_city_state: string | null;
  company_id: number;
  location_name: string;
  location_address: string;
  location_addres_2: string;
  city_id: number | null;
  location_postal_code: string;
  lat: string;
  lng: string;
  city_name_eng: string | null;
  city_name_esp: string | null;
  state_id: number | null;
  state_name_eng: string | null;
  state_name_esp: string | null;
  country_id: number | null;
  country_name_eng: string | null;
  country_name_esp: string | null;
  shoot_date: string;
}

export interface meals {
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
