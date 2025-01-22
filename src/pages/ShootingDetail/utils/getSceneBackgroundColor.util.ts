import { ShootingSceneStatusEnum } from "../../../Shared/ennums/ennums";
import { mergedSceneShoot } from "../types/ShootingDetail.types";

export const getSceneBackgroundColor = (scene: mergedSceneShoot) => {
    if (scene.status === ShootingSceneStatusEnum.NotShoot) {
      return 'var(--ion-color-danger-shade)';
    } if (scene.status === ShootingSceneStatusEnum.Shoot) {
      return 'var(--ion-color-success-shade)';
    }
    return 'var(--ion-color-tertiary-dark)';
  };