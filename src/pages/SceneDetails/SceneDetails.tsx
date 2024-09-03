import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router';
import { IonContent, IonHeader, IonPage, useIonViewDidEnter } from '@ionic/react';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import ScenesContext from '../../context/Scenes.context';
import { Scene } from '../../interfaces/scenes.types';
import { DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum, ShootingSceneStatusEnum } from '../../Ennums/ennums';
import useHideTabs from '../../hooks/Shared/useHideTabs';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import useLoader from '../../hooks/Shared/useLoader';
import applyFilters from '../../utils/applyFilters';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import SceneDetailsTabs from '../../components/Shared/SeceneDetailsTabs/SceneDetailsTabs';
import SceneBasicInfo from '../../components/SceneDetails/SceneBasicInfo';
import DropDownInfo from '../../components/SceneDetails/DropDownInfo';
import InputAlert from '../../Layouts/InputAlert/InputAlert';
import SceneHeader from './SceneHeader';
import DropDownButton from '../../components/Shared/DropDownButton/DropDownButton';
import SceneInfoLabels from '../../components/SceneDetails/SceneInfoLabels';
import './SceneDetails.scss';
import getHourMinutesFomISO from '../../utils/getHoursMinutesFromISO';
import secondsToMinSec from '../../utils/secondsToMinSec';
import { ShootingScene } from '../../interfaces/shooting.types';

const SceneDetails: React.FC = () => {
  const toggleTabs = useHideTabs();
  const { sceneId, id, shootingId: urlShootingId } = useParams<{ sceneId: string; id: string; shootingId: string }>();
  const { oneWrapDb, offlineScenes } = useContext<DatabaseContextProps>(DatabaseContext);
  const { selectedFilterOptions } = useContext(ScenesContext);
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isShooting = searchParams.get('isShooting') === 'true';

  const [thisScene, setThisScene] = useState<any | null>(null);
  const [thisSceneShooting, setThisSceneShooting] = useState<any | null>(null);
  const [sceneIsLoading, setSceneIsLoading] = useState<boolean>(true);
  const [shootingId, setShootingId] = useState<string | undefined>(urlShootingId);
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
  const [previousScene, setPreviousScene] = useState<Scene | null>(null);
  const [nextScene, setNextScene] = useState<Scene | null>(null);
  const [sceneColor, setSceneColor] = useState<any>('light');
  const [openShootDropDown, setOpenShootDropDown] = useState<boolean>(false);

  const successMessageSceneToast = useSuccessToast();

  useEffect(() => {
    if (urlShootingId) {
      setShootingId(urlShootingId);
    }
  }, [urlShootingId]);

  const getScenesInShooting = async () => {
    const shootingDoc = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
    if (!shootingDoc || !shootingDoc._data || !shootingDoc._data.scenes) {
      return [];
    }
    const orderedScenes = [...shootingDoc._data.scenes].sort((a, b) => a.position - b.position);
    return orderedScenes.map((scene: any) => parseInt(scene.sceneId));
  };

  useEffect(() => {
    const filterScenes = async () => {
      setSceneIsLoading(true);
      let filtered: Scene[];
      if (!isShooting) {
        filtered = selectedFilterOptions 
          ? applyFilters(offlineScenes, selectedFilterOptions) 
          : offlineScenes;
      } else {
        const scenesInShooting = await getScenesInShooting();
        filtered = []
        for (const sceneId of scenesInShooting) {
          const scene = offlineScenes.find((scene: any) => parseInt(scene.sceneId) === sceneId);
          if (scene) {
            filtered.push(scene);
          }
        }
      }
      setFilteredScenes(filtered);
      setSceneIsLoading(false);
    };

    filterScenes();
  }, [isShooting, offlineScenes, selectedFilterOptions, shootingId, oneWrapDb]);

  useEffect(() => {
    const fetchScene = async () => {
      if (sceneId && oneWrapDb) {
        const scene = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec();
        setThisScene(scene?._data || null);
        setSceneIsLoading(false);
      }
    };

    fetchScene();
  }, [sceneId, oneWrapDb, offlineScenes]);

  useEffect(() => {
    if (filteredScenes.length > 0 && thisScene) {
      const index = filteredScenes.findIndex((scene: any) => 
        isShooting ? parseInt(scene.sceneId) === parseInt(thisScene.sceneId) : scene.id === thisScene.id
      );
      setCurrentSceneIndex(index);
    }
  }, [filteredScenes, thisScene, isShooting]);

  useEffect(() => {
    if (currentSceneIndex >= 0) {
      setPreviousScene(filteredScenes[currentSceneIndex - 1] || null);
      setNextScene(filteredScenes[currentSceneIndex + 1] || null);
    }
  }, [currentSceneIndex, filteredScenes]);

  // Set this scene shooting

  useEffect(() => {
    const fetchSceneShooting = async () => {
      if (shootingId && oneWrapDb && thisScene) {
        const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
        console.log(thisScene)
        const sceneShooting = shooting?._data?.scenes.find((sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(thisScene?.sceneId));
        console.log(sceneShooting)
        setThisSceneShooting(sceneShooting || null);
        console.log(thisSceneShooting)
      }
    };

    fetchSceneShooting();
  }, [shootingId, oneWrapDb, thisScene]);

  const changeToNextScene = () => {
    if (nextScene) {
      const route = isShooting 
        ? `/my/projects/${id}/shooting/${shootingId}/details/scene/${nextScene.id}?isShooting=true` 
        : `/my/projects/${id}/strips/details/scene/${nextScene.id}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
  };

  const changeToPreviousScene = () => {
    if (previousScene) {
      const route = isShooting 
        ? `/my/projects/${id}/shooting/${shootingId}/details/scene/${previousScene.id}?isShooting=true`
        : `/my/projects/${id}/strips/details/scene/${previousScene.id}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
  };

  const handleBack = () => {
    const backRoute = isShooting ? `/my/projects/${id}/shooting/${shootingId}` : `/my/projects/${id}/strips`;
    history.push(backRoute);
    toggleTabs.showTabs();
  };

  const getSceneColor = async (scene: Scene) => {
    if (isShooting) {
      const shooting = await oneWrapDb?.shootings.find({ selector: { id: shootingId } }).exec();
      const sceneInShooting = shooting?.[0]?.scenes.find((sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(thisScene.sceneId));

      const sceneStatus = sceneInShooting?.status
      console.log(sceneStatus)
      switch (sceneStatus) {
        case ShootingSceneStatusEnum.Assigned: return 'light';
        case ShootingSceneStatusEnum.NotShoot: return 'danger';
        case ShootingSceneStatusEnum.Shoot: return 'success';
        default: return 'light';
      }
    } else {

      const interior = IntOrExtOptionEnum.INT;
      const exterior = IntOrExtOptionEnum.EXT;
      const intExt = IntOrExtOptionEnum.INT_EXT;
      const extInt = IntOrExtOptionEnum.EXT_INT;
      const protectionType = SceneTypeEnum.PROTECTION;
      const sceneType = SceneTypeEnum.SCENE;
      const day = DayOrNightOptionEnum.DAY;
      const night = DayOrNightOptionEnum.NIGHT;

      const intOrExt: any = [exterior, intExt, extInt];

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
        if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === day) {
          return 'yellow';
        } 
        if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === night) {
          return 'primary';
        }
      }
      return 'light';
    }
  };

  useEffect(() => {
    if (thisScene) {
      getSceneColor(thisScene).then(setSceneColor);
    }
  }, [thisScene, isShooting]);

  useIonViewDidEnter(() => {
    setTimeout(() => {
      toggleTabs.hideTabs();
    }, 150);
  });

  const deleteScene = async () => {
    try {
      const sceneToDelete = await oneWrapDb?.scenes.findOne({ selector: { id: sceneId } }).exec();
      await sceneToDelete?.remove();
      history.push(`/my/projects/${id}/strips`);
      successMessageSceneToast('Scene deleted successfully');
    } catch (error) {
      console.error('Error deleting scene:', error);
    }
  };

  const sceneHeader = thisScene ? `${parseInt(thisScene.episodeNumber) > 0 ? (`${thisScene.episodeNumber}.`) : ''}${thisScene.sceneNumber}` : '';

  const sceneCastCategories = sortArrayAlphabeticaly(getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName').map((category: any) => category.categoryName));
  const sceneExtrasCategories = sortArrayAlphabeticaly(getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'categoryName').map((category: any) => category.categoryName));
  const sceneElementsCategories = sortArrayAlphabeticaly(getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName').map((category: any) => category.categoryName));

  const getSceneStatus = (scene: ShootingScene) => {
    switch (scene.status) {
      case ShootingSceneStatusEnum.Assigned: return 'ASSIGNED';
      case ShootingSceneStatusEnum.NotShoot: return 'NOT SHOOT';
      case ShootingSceneStatusEnum.Shoot: return 'SHOOT';
      default: return 'NOT ASSIGNED';
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <Toolbar 
          name="" 
          backString 
          prohibited 
          deleteButton 
          edit 
          editRoute={`/my/projects/${id}/editscene/${sceneId}/details`} 
          handleBack={handleBack} 
          deleteTrigger={`open-delete-scene-alert-${sceneId}-details`} 
        />
        <SceneHeader
          sceneColor={sceneColor}
          sceneHeader={sceneHeader}
          previousScene={previousScene}
          nextScene={nextScene}
          changeToPreviousScene={changeToPreviousScene}
          changeToNextScene={changeToNextScene}
          status={thisSceneShooting ? getSceneStatus(thisSceneShooting) : 'Not Assigned'}
        
        />
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {sceneIsLoading ? useLoader() : <SceneBasicInfo scene={thisScene} />}
        {!sceneIsLoading && thisScene && (
          <div className="ion-padding-top ion-padding-bottom">
            <DropDownInfo categories={sceneCastCategories} scene={thisScene} title="CAST" characters />
            <DropDownInfo categories={sceneExtrasCategories} scene={thisScene} title="EXTRAS" extras />
            {
              isShooting && (
                <div className='shoot-info'>
                <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }} onClick={() => setOpenShootDropDown(!setOpenShootDropDown)}>
                  <p style={{ fontSize: '18px' }}><b>Script Info</b></p>
                  <DropDownButton open={openShootDropDown} />
                </div>   
                {
                  !openShootDropDown && (
                    <div className='info'>
                      <SceneInfoLabels info={getHourMinutesFomISO(thisSceneShooting?.rehersalStart) || 'N/A'} title='rehersal start'></SceneInfoLabels>
                      <SceneInfoLabels info={getHourMinutesFomISO(thisSceneShooting?.rehersalEnd) || 'N/A'} title='rehersal end'></SceneInfoLabels>
                      <SceneInfoLabels info={getHourMinutesFomISO(thisSceneShooting?.shootStart) || 'N/A'} title='shoot start'></SceneInfoLabels>
                      <SceneInfoLabels info={getHourMinutesFomISO(thisSceneShooting?.shootEnd) || 'N/A'} title='shoot end'></SceneInfoLabels>
                      <SceneInfoLabels info={secondsToMinSec(thisScene?.estimatedSeconds) || 'N/A'} title='Estimated Time'></SceneInfoLabels>
                      <SceneInfoLabels info={thisSceneShooting?.set || 'N/A'} title='set'></SceneInfoLabels>
                      <SceneInfoLabels info={thisSceneShooting?.partiality ? '✓' : 'x'} title='scene partial'></SceneInfoLabels>
                      <SceneInfoLabels info={thisSceneShooting?.comment || 'N/A'} title='comment'></SceneInfoLabels>
                    </div>
                  )
                }         
              </div>
              )
            }
            <DropDownInfo categories={sceneElementsCategories} scene={thisScene} title="ELEMENTS" elements />
            <DropDownInfo categories={['LIST OF NOTES']} scene={thisScene} title="NOTES" notes />
          </div>
        )}
      </IonContent>
      <SceneDetailsTabs sceneId={sceneId} />
      <InputAlert
        header="Delete Scene"
        message={`Are you sure you want to delete scene ${sceneHeader}?`}
        handleOk={deleteScene}
        inputs={[]}
        trigger={`open-delete-scene-alert-${sceneId}-details`}
      />
    </IonPage>
  );
};

export default SceneDetails;