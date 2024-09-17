import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useParams, useHistory } from 'react-router';
import {
  IonButton,
  IonCheckbox,
  IonContent, IonHeader, IonPage, useIonViewDidEnter,
} from '@ionic/react';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import ScenesContext from '../../context/Scenes.context';
import { Scene } from '../../interfaces/scenes.types';
import {
  DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum, ShootingSceneStatusEnum,
} from '../../Ennums/ennums';
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
import './SceneDetails.scss';
import { ShootingScene } from '../../interfaces/shooting.types';
import { EditableField, ShootingInfoLabels } from '../../components/ShootingDetail/ShootingBasicInfo/ShootingBasicInfo';
import timeToISOString from '../../utils/timeToIsoString';
import EditionModal from '../../components/Shared/EditionModal/EditionModal';
import useErrorToast from '../../hooks/Shared/useErrorToast';

export const EditableTimeField: React.FC<{
  value: number | null;
  title: string;
  updateTime: (minutes: number, seconds: number) => void;
}> = ({ value, title, updateTime }) => {
  const editionModalRef = useRef<HTMLIonModalElement>(null);
  const errorToast = useErrorToast();

  const handleEdit = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  const handleEdition = (formData: { minutes: string; seconds: string }) => {
    updateTime(parseInt(formData.minutes), parseInt(formData.seconds));
  };

  const editionInputs = [
    {
      fieldKeyName: 'minutes',
      label: 'Minutes',
      placeholder: 'Enter minutes',
      type: 'number',
      required: true,
      col: '6',
    },
    {
      fieldKeyName: 'seconds',
      label: 'Seconds',
      placeholder: 'Enter seconds',
      type: 'number',
      required: true,
      col: '6',
    },
  ];

  const [minutes, seconds] = value ? [Math.floor(value / 60), value % 60] : [0, 0];

  return (
    <>
      <ShootingInfoLabels
        info={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        title={title}
        onEdit={handleEdit}
        isEditable
      />
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger="open-edit-time-modal-produced-seconds"
        title={`Edit ${title} (MM:SS)`}
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={{
          minutes: minutes.toString(),
          seconds: seconds.toString(),
        }}
        modalId="edit-time-modal-produced-seconds"
      />
    </>
  );
};

const SceneDetails: React.FC<{
  isShooting?: boolean;
}> = ({ isShooting = false }) => {
  const toggleTabs = useHideTabs();
  const { sceneId, id, shootingId: urlShootingId } = useParams<{ sceneId: string; id: string; shootingId: string }>();
  const { oneWrapDb, offlineScenes } = useContext<DatabaseContextProps>(DatabaseContext);
  const { selectedFilterOptions } = useContext(ScenesContext);
  const history = useHistory();

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
  const errorToast = useErrorToast();

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
    if (oneWrapDb && shootingId && thisScene) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const formattedTime = convertTo24Hour(time);
          const [hours, minutes] = formattedTime.split(':');
          const newTimeISO = timeToISOString({ hours, minutes }, shooting.shootDate);
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(thisScene.sceneId)) {
              return { ...scene, [field]: newTimeISO };
            }
            return scene;
          });
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, [field]: newTimeISO });
        }

        successMessageSceneToast('Scene updated successfully');
      } catch (error) {
        console.error('Error updating scene:', error);
      }
    }
  };

  const updateProducedSeconds = async (minutes: number, seconds: number) => {
    if (oneWrapDb && shootingId && thisScene) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const totalSeconds = minutes * 60 + seconds;
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(thisScene.sceneId)) {
              return { ...scene, producedSeconds: totalSeconds };
            }
            return scene;
          });
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, producedSeconds: totalSeconds });
        }
        successMessageSceneToast('Produced seconds updated successfully');
      } catch (error) {
        console.error('Error updating produced seconds:', error);
      }
    }
  };

  const updatePartiality = async (isPartial: boolean) => {
    if (oneWrapDb && shootingId && thisScene) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(thisScene.sceneId)) {
              return { ...scene, partiality: isPartial };
            }
            return scene;
          });
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, partiality: isPartial });
        }
        successMessageSceneToast('Partiality updated successfully');
      } catch (error) {
        console.error('Error updating partiality:', error);
      }
    }
  };

  const toggleShootingSceneStatus = (
    currentStatus: ShootingSceneStatusEnum,
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
        return currentStatus;
    }
  };

  const updateSceneStatus = async (newStatus: ShootingSceneStatusEnum) => {
    if (oneWrapDb && shootingId && thisScene) {
      try {
        const shooting = await oneWrapDb.shootings.findOne({ selector: { id: shootingId } }).exec();
        if (shooting) {
          const updatedScenes = shooting.scenes.map((scene: any) => {
            if (parseInt(scene.sceneId) === parseInt(thisScene.sceneId)) {
              return { ...scene, status: newStatus };
            }
            return scene;
          });
          await shooting.update({ $set: { scenes: updatedScenes } });
          setThisSceneShooting({ ...thisSceneShooting, status: newStatus });
        }
        successMessageSceneToast('Scene status updated successfully');
      } catch (error) {
        console.error('Error updating scene status:', error);
      } finally {
        getSceneColor(thisScene).then(setSceneColor);
      }
    }
  };

  const handleShootClick = () => {
    const newStatus = toggleShootingSceneStatus(thisSceneShooting.status, 'shoot');
    updateSceneStatus(newStatus);
  };

  const handleNotShootClick = () => {
    const newStatus = toggleShootingSceneStatus(thisSceneShooting.status, 'notShoot');
    updateSceneStatus(newStatus);
  };

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

  const rootRoute = isShooting ? `/my/projects/${id}/shooting/${shootingId}/details/scene` : `/my/projects/${id}/strips/details/scene`;

  const rootRouteScript = isShooting ? `/my/projects/${id}/shooting/${shootingId}/details/script` : `/my/projects/${id}/strips/details/script`;

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
        filtered = [];
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
        const scene = await oneWrapDb?.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
        setThisScene(scene?._data || null);
        setSceneIsLoading(false);
      }
    };

    fetchScene();
  }, [sceneId, oneWrapDb, offlineScenes]);

  useEffect(() => {
    if (filteredScenes.length > 0 && thisScene) {
      const index = filteredScenes.findIndex((scene: any) => (isShooting ? parseInt(scene.sceneId) === parseInt(thisScene.sceneId) : scene.id === thisScene.id));
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
  const fetchSceneShooting = async () => {
    if (shootingId && oneWrapDb && thisScene) {
      const shooting = await oneWrapDb?.shootings.findOne({ selector: { id: shootingId } }).exec();
      const sceneShooting = shooting?._data?.scenes.find((sceneInShooting: any) => parseInt(sceneInShooting.sceneId) === parseInt(thisScene?.sceneId));
      setThisSceneShooting(sceneShooting || null);
    }
  };

  useEffect(() => {
    fetchSceneShooting();
  }, [shootingId, oneWrapDb, thisScene]);

  const changeToNextScene = () => {
    if (nextScene) {
      const route = `${rootRoute}/${nextScene.sceneId}${isShooting ? '?isShooting=true' : ''}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
  };

  const changeToPreviousScene = () => {
    if (previousScene) {
      const route = `${rootRoute}/${previousScene.sceneId}${isShooting ? '?isShooting=true' : ''}`;
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

      const sceneStatus = sceneInShooting?.status;
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
  }, [thisScene, isShooting, oneWrapDb]);

  useIonViewDidEnter(() => {
    setTimeout(() => {
      toggleTabs.hideTabs();
    }, 150);
  });

  const deleteScene = async () => {
    try {
      const sceneToDelete = await oneWrapDb?.scenes.findOne({ selector: { sceneId: parseInt(sceneId) } }).exec();
      await sceneToDelete?.remove();
      history.push(`/my/projects/${id}/strips`);
      successMessageSceneToast('Scene deleted successfully');
    } catch (error) {
      errorToast('Error deleting scene');
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
  };

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
        {
          isShooting && (
            <div className="shoot-info">
              <div className="ion-flex ion-justify-content-between ion-padding-start" style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-dark)' }} onClick={() => setOpenShootDropDown(!setOpenShootDropDown)}>
                <p style={{ fontSize: '18px' }}><b>SCRIPT INFO</b></p>
                <div className="buttons-wrapper">
                  <IonButton
                    fill="clear"
                    className={`success${thisSceneShooting?.status === ShootingSceneStatusEnum.Shoot ? ' active' : ''}`}
                    size="small"
                    onClick={handleShootClick}
                  >
                    <b>SHOOT</b>
                  </IonButton>
                  <IonButton
                    className={`danger${thisSceneShooting?.status === ShootingSceneStatusEnum.NotShoot ? ' active' : ''}`}
                    fill="clear"
                    size="small"
                    onClick={handleNotShootClick}
                  >
                    <b>NOT SHOOT</b>
                  </IonButton>
                </div>
              </div>
              {
              !openShootDropDown && (
                <div className="info">
                  <EditableField
                    field="rehersalStart"
                    value={thisSceneShooting?.rehersalStart || ''}
                    title="Rehersal Start"
                    withSymbol={false}
                    permissionType={1}
                    updateShootingTime={updateShootingTime}
                  />
                  <EditableField
                    field="rehersalEnd"
                    value={thisSceneShooting?.rehersalEnd || ''}
                    title="Rehersal End"
                    withSymbol={false}
                    permissionType={1}
                    updateShootingTime={updateShootingTime}
                  />
                  <EditableField
                    field="shootStart"
                    value={thisSceneShooting?.shootStart || ''}
                    title="Shoot Start"
                    withSymbol={false}
                    permissionType={1}
                    updateShootingTime={updateShootingTime}
                  />
                  <EditableField
                    field="shootEnd"
                    value={thisSceneShooting?.shootEnd || ''}
                    title="Shoot End"
                    withSymbol={false}
                    permissionType={1}
                    updateShootingTime={updateShootingTime}
                  />
                  <EditableTimeField
                    value={thisSceneShooting?.producedSeconds || null}
                    title="Shoot Time"
                    updateTime={updateProducedSeconds}
                  />
                  <div>
                    <IonCheckbox
                      checked={thisSceneShooting?.partiality || false}
                      onIonChange={(e) => updatePartiality(e.detail.checked)}
                      labelPlacement="end"
                      className="partiality-checkbox"
                    >
                      PARTIALY SHOOT
                    </IonCheckbox>
                  </div>
                </div>
              )
            }
            </div>
          )
        }
        {!sceneIsLoading && thisScene && (
          <div className="grid-scene-info">
            <div className="section-wrapper characters-info">
              <DropDownInfo categories={sceneCastCategories} scene={thisScene} title="CHARACTERS" characters />
            </div>
            <div className="section-wrapper extras-info">
              <DropDownInfo categories={sceneExtrasCategories} scene={thisScene} title="EXTRAS" extras />
            </div>
            <div className="section-wrapper elements-info">
              <DropDownInfo categories={sceneElementsCategories} scene={thisScene} title="ELEMENTS" elements />
            </div>
            <div className="section-wrapper notes-info">
              <DropDownInfo categories={['LIST OF NOTES']} scene={thisScene} title="NOTES" notes />
            </div>
          </div>
        )}
      </IonContent>
      <SceneDetailsTabs
        routeDetails={`${rootRoute}/${sceneId}${isShooting ? '?isShooting=true' : ''}`}
        routeScript={`${rootRouteScript}/${sceneId}${isShooting ? '?isShooting=true' : ''}`}
        currentRoute="scenedetails"
      />
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
