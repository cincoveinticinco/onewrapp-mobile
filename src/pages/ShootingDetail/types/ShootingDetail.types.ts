import { Scene } from "../../../interfaces/scenes.types";
import { ShootingScene,  ShootingBanner as ShootingBannerType, LocationInfo, AdvanceCalls, Meal, } from "../../../interfaces/shooting.types";

export type ShootingViews = 'scenes' | 'info' | 'script-report' | 'wrap-report' | 'production-report' | 'call-sheet';
type cardType = {
  cardType: string;
};

export type mergedSceneBanner = (Scene & ShootingScene & cardType) | (ShootingBannerType & cardType)
export type mergedSceneShoot = (Scene & ShootingScene & cardType)

export interface ShootingInfo {
  generalCall: string;
  onSet: string;
  estimatedWrap: string;
  wrap: string;
  lastOut: string;
  sets: number;
  scenes: number;
  protectedScenes: number;
  pages: string;
  min: string;
  locations: LocationInfo[];
  hospitals: LocationInfo[];
  advanceCalls: AdvanceCalls[]
  meals: Meal[];
}

export interface ShootingDataProps {
  mergedSceneBanners: mergedSceneBanner[];
  notIncludedScenes: Scene[];
  shotingInfo: ShootingInfo;
  shootingFormattedDate: string;
  mergedScenesShootData: mergedSceneShoot[];
}