import { SceneDocType } from "../../../Shared/types/scenes.types";
import { ShootingScene,  ShootingBanner as ShootingBannerType, LocationInfo, AdvanceCall, Meal, } from "../../../Shared/types/shooting.types";

export type ShootingViews = 'scenes' | 'info' | 'script-report' | 'wrap-report' | 'production-report' | 'call-sheet';
type cardType = {
  cardType: string;
};

export type mergedSceneBanner = (SceneDocType & ShootingScene & cardType) | (ShootingBannerType & cardType)
export type mergedSceneShoot = (SceneDocType & ShootingScene & cardType)

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
  advanceCalls: AdvanceCall[]
  meals: Meal[];
}

export interface ShootingDataProps {
  mergedSceneBanners: mergedSceneBanner[];
  notIncludedScenes: SceneDocType[];
  shotingInfo: ShootingInfo;
  shootingFormattedDate: string;
  mergedScenesShootData: mergedSceneShoot[];
}