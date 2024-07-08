import { ShootingSceneStatusEnum, ShootingStatusEnum } from '../Ennums/ennums';

export interface ShootingScene {
  id: string;
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
  id: string;
  shootingId: number;
  description: string;
  backgroundColor: string | null;
  fontSize: number | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}