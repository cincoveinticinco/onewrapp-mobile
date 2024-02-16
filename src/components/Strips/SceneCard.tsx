import React, { useEffect, useMemo } from 'react';
import { IonRow, IonCol, IonItemSliding, IonGrid, IonItem, IonItemOptions, IonItemOption, IonButton, IonIcon } from '@ionic/react';
import { Scene } from '../../interfaces/scenesTypes';
import './SceneCard.scss';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import { banOutline, pencilOutline } from 'ionicons/icons';
import { FiTrash } from "react-icons/fi";
import HighlightedText from '../Shared/HighlightedText/HighlightedText';
import { DayOrNightOptionEnum, IntOrExtOptionEnum, ProtectionTypeEnum, SceneTypeEnum } from '../../Ennums/ennums';

interface SceneCardProps {
  scene: Scene;
  searchText?: string;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, searchText = ''}) => {
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

    const sceneHeader = `${episodeNumber}.${sceneNumber} ${intOrExt}. ${locationName}. ${setName}-${dayOrNight}${scriptDay} ${year ? `(${
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
  }

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

  return (
    <IonRow className = "scene-card-row">
      <IonItemSliding className='ion-no-margin ion-no-padding'>
        <IonItem className='ion-no-margin ion-no-padding scene-card-item'>
          <IonGrid className='ion-no-margin ion-no-padding'>
            <IonRow className={`scene-card scene-theme-${defineSceneColor(scene)}`} onClick={() => console.log(scene)}>
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
              <IonCol className="scene-card-col-3 center-flex-row">
                <p className="assignament-date"> NOT ASSIGNED </p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
        <IonItemOptions class='scene-card-options'>
          <div className='buttons-wrapper'> 
            <IonButton fill='clear'>
              <IonIcon icon={pencilOutline} className='button-icon view'/>
            </IonButton>
            <IonButton fill='clear'>
              <IonIcon icon={banOutline} className='button-icon ban'/>
            </IonButton>
            <IonButton fill='clear'>
              <FiTrash className='button-icon trash'/>
            </IonButton>
          </div>
        </IonItemOptions>
      </IonItemSliding>
    </IonRow>
  );
};

export default SceneCard;
