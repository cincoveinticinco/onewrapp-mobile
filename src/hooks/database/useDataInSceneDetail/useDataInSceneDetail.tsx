// useSceneData.ts
import { useContext, useEffect, useState } from 'react';
import { DatabaseContextProps } from '../../../context/Database/types/Database.types';
import DatabaseContext from '../../../context/Database/Database.context';
import { SceneDocType } from '../../../Shared/types/scenes.types';
import useAlertToast from '../../utils/useToastAlert/useToastAlert';
import { DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum, ShootingSceneStatusEnum } from '../../../Shared/enums/ennums';


export const useDataInSceneDetail = (sceneId: string, projectId: string, creationMode = false) => {
  const { oneWrapDb } = useContext<DatabaseContextProps>(DatabaseContext);
  const [thisScene, setThisScene] = useState<SceneDocType | null>(null);
  const [sceneIsLoading, setSceneIsLoading] = useState<boolean>(true);
  const [sceneColor, setSceneColor] = useState<string>('light');
  const { successToast, errorToast } = useAlertToast();

  const emptyScene: SceneDocType = {
    id: '',
    projectId: Number(projectId),
    sceneId: 0,
    episodeNumber: '',
    sceneNumber: '',
    setName: '',
    locationName: '',
    sceneType: SceneTypeEnum.SCENE,
    intOrExtOption: IntOrExtOptionEnum.INT,
    dayOrNightOption: DayOrNightOptionEnum.DAY,
    characters: [],
    elements: [],
    extras: [],
    notes: [],
  };

  const loadScene = async () => {
    setSceneIsLoading(true);

    if (sceneId && oneWrapDb && !creationMode) {
      try {
        const scene = await oneWrapDb.scenes
          .findOne({ selector: { sceneId: parseInt(sceneId) } })
          .exec();

        setThisScene(scene?._data || null);
        return scene?._data;
      } catch (error) {
        console.error('Error loading scene:', error);
        return null;
      } finally {
        setSceneIsLoading(false);
      }
    }
    
    setSceneIsLoading(false);
    return null;
  };

  const getSceneColor = async (scene: SceneDocType, isShooting: boolean, shootingId?: string) => {
    if (isShooting && shootingId) {
      const shooting = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
      const sceneInShooting = shooting?.[0]?.scenes.find(
        (sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(scene.sceneId?.toString() || '')
      );

      const sceneStatus = sceneInShooting?.status;
      switch (sceneStatus) {
        case ShootingSceneStatusEnum.Assigned: return 'light';
        case ShootingSceneStatusEnum.NotShoot: return 'danger';
        case ShootingSceneStatusEnum.Shoot: return 'success';
        default: return 'light';
      }
    } else {
      // Lógica para determinar el color según características de la escena
      const interior = IntOrExtOptionEnum.INT;
      const exterior = IntOrExtOptionEnum.EXT;
      const intExt = IntOrExtOptionEnum.INT_EXT;
      const extInt = IntOrExtOptionEnum.EXT_INT;
      const protectionType = SceneTypeEnum.PROTECTION;
      const sceneType = SceneTypeEnum.SCENE;
      const day = DayOrNightOptionEnum.DAY;
      const night = DayOrNightOptionEnum.NIGHT;

      const intOrExtArray = [exterior, intExt, extInt];

      if (scene.sceneType === protectionType) {
        return 'rose';
      }
      if (scene.sceneType === sceneType) {
        if (scene.intOrExtOption === null || scene.dayOrNightOption === null) {
          return 'dark';
        }
        if (scene.intOrExtOption === interior && scene.dayOrNightOption === day) {
          return 'light';
        }
        if (scene.intOrExtOption === interior && scene.dayOrNightOption === night) {
          return 'success';
        }
        if (scene.intOrExtOption && intOrExtArray?.includes(scene?.intOrExtOption as IntOrExtOptionEnum) && scene.dayOrNightOption === day) {
          return 'yellow';
        }
        if (scene.intOrExtOption && intOrExtArray.includes(scene.intOrExtOption as IntOrExtOptionEnum) && scene.dayOrNightOption === night) {
          return 'primary';
        }
      }
      return 'light';
    }
  };

  const saveScene = async (data: SceneDocType) => {
    try {
      if (creationMode) {
        data.id = projectId + '.' + data?.episodeNumber + '.' + data?.sceneNumber;
        const temporaryId = getTemporarySceneId();
        
        const sceneToSave = {
          ...data,
          projectId: Number(projectId),
          sceneId: temporaryId,
        };
        
        await validateSceneExistence(data.id);
        await oneWrapDb?.scenes.insert(sceneToSave);
        successToast('Scene created successfully');
        return temporaryId;
      } else {
        const sceneDocument = await oneWrapDb?.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
        const currentId = sceneDocument?.get('id');
        const newId = data?.projectId + '.' + data?.episodeNumber + '.' + data?.sceneNumber;
        
        if (currentId !== newId) {
          await validateSceneExistence(newId);
        }
        
        await sceneDocument?.update({ $set: data });
        successToast('Scene updated successfully');
        await loadScene();
      }
      return true;
    } catch (error: any) {
      console.error('Error saving scene:', error);
      errorToast(error.message || error || 'Error saving scene');
      return false;
    }
  };

  const validateSceneExistence = async (id: string) => {
    const sceneDocument = await oneWrapDb?.scenes.findOne({ selector: { id } }).exec();
    if (sceneDocument) {
      throw 'Scene already exists';
    }
    return true;
  };

  const getTemporarySceneId = () => {
    // Lógica para generar un ID temporal único
    return 10000000 + Math.floor(Math.random() * 10000000);
  };

  const deleteScene = async () => {
    try {
      if (sceneId && oneWrapDb) {
        const sceneDocument = await oneWrapDb.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
        if (sceneDocument) {
          await sceneDocument.remove();
          successToast('Scene deleted successfully');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error deleting scene:', error);
      errorToast('Error deleting scene');
      return false;
    }
  };

  useEffect(() => {
    if (!creationMode) {
      loadScene();
    } else {
      setSceneIsLoading(false);
    }
  }, [sceneId, oneWrapDb]);

  useEffect(() => {
    if (thisScene) {
      getSceneColor(thisScene, false).then(setSceneColor);
    }
  }, [thisScene]);

  return {
    thisScene,
    sceneIsLoading,
    sceneColor,
    emptyScene,
    loadScene,
    saveScene,
    deleteScene,
    getSceneColor,
    setThisScene
  };
};