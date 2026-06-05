import { useEffect, useState, useContext } from 'react';
import { DatabaseContextProps } from '../../../context/Database/types/Database.types';
import { ShootingDocType, ShootingScene } from '../../../Shared/types/shooting.types';
import useAlertToast from '../../utils/useToastAlert/useToastAlert';
import { SceneDocType } from '../../../Shared/types/scenes.types';
import { ShootingSceneStatusEnum } from '../../../Shared/enums/ennums';
import timeToISOString from '../../../Shared/Utils/timeToIsoString';
import DatabaseContext from '../../../context/Database/Database.context';

export const useShootingSceneData = (
  sceneId: string,
  shootingId?: string
) => {
  const { oneWrapDb } = useContext<DatabaseContextProps>(DatabaseContext);
  const [thisShooting, setThisShooting] = useState<ShootingDocType | null>(null);
  const [thisSceneShooting, setThisSceneShooting] = useState<ShootingScene | null>(null);
  const { successToast, errorToast } = useAlertToast();

  const fetchSceneShooting = async (scene: SceneDocType | null) => {
    if (!scene) return;
    
    if (shootingId && oneWrapDb) {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const sceneShooting = shooting?._data?.scenes.find(
        (sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(scene?.sceneId?.toString() || '')
      );
      setThisSceneShooting(sceneShooting || null);
      setThisShooting(shooting?._data || null);
    } else if (scene?.sceneId) {
      // Buscar si la escena está asignada a algún rodaje
      const shooting = await oneWrapDb?.shootings.findOne({
        selector: {
          scenes: {
            $elemMatch: {
              sceneId: scene.sceneId.toString()
            }
          }
        }
      }).exec();

      if (shooting) {
        const sceneShooting = shooting._data?.scenes.find(
          (sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(scene.sceneId?.toString() || '')
        );
        setThisSceneShooting(sceneShooting || null);
        setThisShooting(shooting._data || null);
      }
    }
  };

  const convertTo24Hour = (time: string): string => {
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours, 10);

    if (period && period.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period && period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const updateShootingTime = async (field: string, time: string) => {
    if (oneWrapDb && shootingId && thisSceneShooting) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const formattedTime = convertTo24Hour(time);
          const [hours, minutes] = formattedTime.split(':');
          const newTimeISO = timeToISOString({ hours, minutes }, shooting.shootDate);
          
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(sceneId)) {
              return { ...scene, [field]: newTimeISO };
            }
            return scene;
          });
          
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, [field]: newTimeISO });
          successToast('Scene updated successfully');
        }
      } catch (error) {
        errorToast('Error updating scene');
        throw error;
      }
    }
  };

  const updateProducedSeconds = async (minutes: number, seconds: number) => {
    if (oneWrapDb && shootingId && thisSceneShooting) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const totalSeconds = minutes * 60 + seconds;
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(sceneId)) {
              return { ...scene, producedSeconds: totalSeconds };
            }
            return scene;
          });
          
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, producedSeconds: totalSeconds });
          successToast('Produced seconds updated successfully');
        }
      } catch (error) {
        errorToast('Error updating produced seconds');
        throw error;
      }
    }
  };

  const updatePartiality = async (isPartial: boolean) => {
    if (oneWrapDb && shootingId && thisSceneShooting) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(sceneId)) {
              return { ...scene, partiality: isPartial };
            }
            return scene;
          });
          
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, partiality: isPartial });
          successToast('Partiality updated successfully');
        }
      } catch (error) {
        errorToast('Error updating partiality');
        throw error;
      }
    }
  };

  const toggleShootingSceneStatus = (
    currentStatus: ShootingSceneStatusEnum | undefined | null,
    clickedButton: 'shoot' | 'notShoot',
  ): ShootingSceneStatusEnum => {
    switch (clickedButton) {
      case 'shoot':
        return currentStatus === ShootingSceneStatusEnum.Shoot
          ? ShootingSceneStatusEnum.Assigned
          : ShootingSceneStatusEnum.Shoot;
      case 'notShoot':
        return currentStatus === ShootingSceneStatusEnum.NotShoot
          ? ShootingSceneStatusEnum.Assigned
          : ShootingSceneStatusEnum.NotShoot;
      default:
        return currentStatus || ShootingSceneStatusEnum.Assigned;
    }
  };

  const updateSceneStatus = async (newStatus: ShootingSceneStatusEnum) => {
    if (oneWrapDb && shootingId && thisSceneShooting) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(sceneId)) {
              return { ...scene, status: newStatus };
            }
            return scene;
          });
          
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, status: newStatus });
          successToast('Scene status updated successfully');
        }
      } catch (error) {
        errorToast('Error updating scene status');
        throw error;
      }
    }
  };

  const unassignScene = async () => {
    if (oneWrapDb && thisShooting && thisSceneShooting) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: thisShooting.id } }).exec();
        if (shooting) {
          const updatedScenes = shooting.scenes.filter(
            (scene: any) => parseInt(scene.sceneId) !== parseInt(sceneId)
          );
          
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting(null);
          setThisShooting(null);
          successToast('Scene unassigned successfully');
          return true;
        }
      } catch (error) {
        errorToast('Error unassigning scene');
        console.error(error);
      }
    }
    return false;
  };

  return {
    thisShooting,
    thisSceneShooting,
    fetchSceneShooting,
    updateShootingTime,
    updateProducedSeconds,
    updatePartiality,
    toggleShootingSceneStatus,
    updateSceneStatus,
    unassignScene,
    setThisSceneShooting
  };
};

export default useShootingSceneData;