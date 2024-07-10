import React, { useContext, useEffect, useMemo } from 'react';
import {
  IonRow, IonCol, IonItemSliding, IonGrid, IonItem, IonItemOptions, IonItemOption, IonButton, IonIcon, useIonToast,
  IonReorder,
} from '@ionic/react';
import { useHistory, useRouteMatch } from 'react-router';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import { Scene } from '../../interfaces/scenesTypes';
import './SceneCard.scss';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import { checkmarkCircle } from 'ionicons/icons';
import HighlightedText from '../Shared/HighlightedText/HighlightedText';
import {
  DayOrNightOptionEnum, IntOrExtOptionEnum, SceneTypeEnum,
} from '../../Ennums/ennums';
import DatabaseContext, { DatabaseContextProps } from '../../context/database';
import InputAlert from '../../Layouts/InputAlert/InputAlert';
import { LuGripHorizontal } from 'react-icons/lu';
import { IoIosRemoveCircleOutline } from 'react-icons/io';

interface SceneCardProps {
  scene: Scene;
  searchText?: string;
  isShooting?: boolean;
  isProduced?: boolean;
  shootingDeleteScene?: () => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, searchText = '', isShooting = false, isProduced = false, shootingDeleteScene}) => {
  const { oneWrapDb } = useContext<DatabaseContextProps>(DatabaseContext);

  const history = useHistory();
  const routeMatch = useRouteMatch();
  const detailsRoute = `${routeMatch.url}/details/scene/${scene.id}`;

  const [presentToast] = useIonToast();

  const successMessageSceneToast = (message: string) => {
    presentToast({
      message,
      duration: 2000,
      icon: checkmarkCircle,
      position: 'top',
      cssClass: 'success-toast',
    });
  };

  const interior = IntOrExtOptionEnum.INT;
  const exterior = IntOrExtOptionEnum.EXT;
  const intExt = IntOrExtOptionEnum.INT_EXT;
  const extInt = IntOrExtOptionEnum.EXT_INT;
  const protectionType = SceneTypeEnum.PROTECTION;
  const sceneType = SceneTypeEnum.SCENE;
  const day = DayOrNightOptionEnum.DAY;
  const night = DayOrNightOptionEnum.NIGHT;

  function getSceneHeader(scene: Scene) {
    const episodeNumber = scene.episodeNumber || '';
    const sceneNumber = scene.sceneNumber || '';
    const intOrExt = scene.intOrExtOption || '';
    const locationName = scene.locationName || '';
    const setName = scene.setName || '';
    const dayOrNight = scene.dayOrNightOption || '';
    const scriptDay = scene.scriptDay || '';
    const year = scene.year || '';

    const sceneHeader = `${parseInt(episodeNumber) > 0 ? (`${episodeNumber}.`) : ''}${sceneNumber} ${intOrExt ? (`${intOrExt}.`) : ''} ${locationName ? (`${locationName}.`) : ''} ${setName}-${dayOrNight}${scriptDay} ${year ? `(${
      year})` : ''}`;

    return sceneHeader.toUpperCase();
  }

  const getCharacters = (scene: Scene) => {
    const { characters } = scene;
    let charactersString = '';

    if (characters) {
      characters.forEach((character) => {
        charactersString += `${character.characterName.toUpperCase()}, `;
      });

      return charactersString;
    }

    return '';
  };

  const defineSceneColor = (scene: Scene) => {
    const intOrExt: any = [exterior, intExt, extInt];

    if(isShooting) {
      return 'shooting-card'
    }

    if (scene.sceneType === protectionType) {
      return 'rose';
    } if (scene.sceneType === sceneType) {
      if (scene.intOrExtOption === null || scene.dayOrNightOption === null) {
        return 'dark';
      } if (scene.intOrExtOption === interior && scene.dayOrNightOption === day) {
        return 'light';
      } if (scene.intOrExtOption === interior && scene.dayOrNightOption === night) {
        return 'success';
      } if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === day) {
        return 'yellow';
      } if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === night) {
        return 'primary';
      }
    }

    return 'light';
  };

  const defineHighlightColor = (scene: Scene) => {
    const sceneColor = defineSceneColor(scene);

    if (sceneColor === 'success' || sceneColor === 'primary') {
      return 'black';
    }
  };

  const getExtras = (scene: Scene) => {
    const { extras } = scene;
    let extrasString = '';

    if (extras && extras.length > 0) {
      extras.forEach((extra) => {
        extrasString += `${extra.extraName.toUpperCase()}, `;
      });

      return extrasString;
    }

    return 'NO EXTRAS PLAYING';
  };

  const getPageNumber = (scene: Scene) => {
    const pageFloat = scene.pages;
    let pageFraction;

    if (pageFloat) {
      pageFraction = floatToFraction(pageFloat);
    }

    return pageFraction;
  };

  const deleteScene = async () => {
    try {
      const sceneToDelete = await oneWrapDb?.scenes.findOne({ selector: { id: scene.id } }).exec();
      await sceneToDelete?.remove();
      successMessageSceneToast('Scene deleted successfully');
    } catch (error) {
      console.error('Error deleting scene:', error);
    }
  };

  const goToSceneDetails = () => {
    if(isShooting) {
      return
    }
    history.push(detailsRoute);
    localStorage.setItem('editionBackRoute', detailsRoute);
  };

  const cardContent = (
    <IonRow className="scene-card-row" color='tertiary'>
        <IonItemSliding className="ion-no-margin ion-no-padding">
          <IonItem className="ion-no-margin ion-no-padding scene-card-item">
            {
              isShooting && (
                <IonReorder className='reorder-container'>
                  <LuGripHorizontal className="ion-no-padding ion-no-margin grip-sort-item-icon" />
                </IonReorder>
              )
            }
            <IonGrid className="ion-no-margin ion-no-padding">
              <IonRow className={`scene-card scene-theme-${defineSceneColor(scene)}`} onClick={() => goToSceneDetails()}>
                <IonCol className="scene-card-col-1">
                  <h3 className="scene-card-header">
                    <HighlightedText text={getSceneHeader(scene)} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                  </h3>
                  <p className="scene-card-synopsis">
                    <HighlightedText text={scene.synopsis || ''} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                  </p>
                  <p className="scene-card-characters">
                    <strong>CHARACTERS:</strong>
                    {' '}
                    <HighlightedText text={getCharacters(scene) !== '' ? getCharacters(scene) : 'NO CHARACTERS'} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                    <br />
                    <strong>EXTRAS: </strong>
                    {' '}
                    <HighlightedText text={getExtras(scene)} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                  </p>
                </IonCol>
                <IonCol className="scene-card-col-2">
                  <p className="ion-no-margin">
                    <strong>P: </strong>
                    {' '}
                    <HighlightedText text={getPageNumber(scene) || 'N/A'} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                  </p>
                  <p className="ion-no-margin">
                    <strong>M: </strong>
                    {' '}
                    <HighlightedText text={scene.estimatedSeconds ? secondsToMinSec(scene.estimatedSeconds) : 'N/A'} searchTerm={searchText} highlightColor={defineHighlightColor(scene)} />
                  </p>
                </IonCol>
                <IonCol className={"scene-card-col-3 center-flex-row " + (isProduced ? 'produced' : 'not-produced')}>
                  {
                    !isShooting ? (
                      <p className="assignament-date"> NOT ASSIGNED </p>
                    ) : (
                      <p className={isProduced ? 'produced assignament-date' : 'not-produced assignament-date'}> </p>
                    )
                  }
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          <IonItemOptions class="scene-card-options">
            <div className="buttons-wrapper">
              <IonButton fill="clear" routerLink={`/my/projects/163/editscene/${scene.id}`}>
                <CiEdit className="button-icon view" />
              </IonButton>
              {
                !isShooting &&
                <>
                  <IonButton fill="clear">
                    <PiProhibitLight className="button-icon ban" />
                  </IonButton>
                  <IonButton fill="clear" id={`open-delete-scene-alert-${scene.id}`}>
                    <PiTrashSimpleLight className="button-icon trash" />
                  </IonButton>
                </>
              }
              {
                isShooting && shootingDeleteScene &&
                <IonButton fill="clear" onClick={() => shootingDeleteScene()}>
                  <IoIosRemoveCircleOutline className="button-icon ban" />
                </IonButton>
              }
            </div>
          </IonItemOptions>
        </IonItemSliding>
        <InputAlert
          header="Delete Scene"
          message={`Are you sure you want to delete scene ${getSceneHeader(scene)}?`}
          handleOk={() => deleteScene()}
          inputs={[]}
          trigger={`open-delete-scene-alert-${scene.id}`}
        />
      </IonRow>
  );

  
  return cardContent
};

export default SceneCard;
