import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import { Scene } from '../../interfaces/scenesTypes';
import './SceneCard.css';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
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
  };

  const defineSceneColor = (scene: Scene) => {
    const intOrExt: any = ['EXTERIOR', 'INT/EXT', 'EXT/INT'];

    if (scene.sceneType === 'protection') {
      return 'rose';
    } if (scene.sceneType === 'scene') {
      if (scene.intOrExtOption === null || scene.dayOrNightOption === null) {
        return 'dark';
      } if (scene.intOrExtOption === 'Interior' && scene.dayOrNightOption === 'Day') {
        return 'light';
      } if (scene.intOrExtOption === 'Interior' && scene.dayOrNightOption === 'Night') {
        return 'success';
      } if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === 'Day') {
        return 'yellow';
      } if (intOrExt.includes((scene.intOrExtOption)?.toUpperCase()) && scene.dayOrNightOption === 'Night') {
        return 'primary';
      }

      return 'light';
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

  return (
    <IonRow className={`scene-card scene-theme-${defineSceneColor(scene)}`}>
      <IonCol className="scene-card-col-1">
        <h3 className="scene-card-header">
          {getSceneHeader(scene)}
        </h3>
        <p className="scene-card-synopsis">
          {scene.synopsis}
        </p>
        <p className="scene-card-characters">
          <strong>CHARACTERS:</strong>
          {' '}
          {getCharacters(scene) !== '' ? getCharacters(scene) : 'NO CHARACTERS'}
          <br />
          <strong>EXTRAS: </strong>
          {' '}
          {getExtras(scene)}
        </p>
      </IonCol>
      <IonCol className="scene-card-col-2">
        <p className="ion-no-margin">
          <strong>P: </strong>
          {' '}
          {getPageNumber(scene) || 'N/A'}
        </p>
        <p className="ion-no-margin">
          <strong>M: </strong>
          {' '}
          {scene.estimatedSeconds ? secondsToMinSec(scene.estimatedSeconds) : 'N/A'}
        </p>
      </IonCol>
      <IonCol className="scene-card-col-3 center-flex-row">
        <p className="assignament-date"> NOT ASSIGNED </p>
      </IonCol>
    </IonRow>
  );
};

export default SceneCard;
