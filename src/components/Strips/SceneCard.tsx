import React from 'react'
import { IonRow, IonCol, IonTitle } from '@ionic/react'
import { Scene } from '../../interfaces/scenesTypes';
import './SceneCard.css';
import { floatToFraction } from '../../utils/floatToFraction';

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {

  function getSceneHeader(scene: Scene) {
    const episodeNumber = scene.episodeNumber;
    const sceneNumber = scene.sceneNumber;
    const intOrExt = scene.intOrExtOption;
    const locationName = scene.locationName;
    const setName = scene.setName;
    const dayOrNight = scene.dayOrNightOption;
    const scriptDay = scene.scriptDay;
    const year = scene.year;

    const sceneHeader = `${episodeNumber}.${sceneNumber} ${intOrExt}. ${locationName}. ${setName}-${dayOrNight}${scriptDay} ${year ? '('
    + year + ')': ''}`;

    return sceneHeader.toUpperCase();
  }

  const getCharacters = (scene: Scene) => {
    const characters = scene.characters;
    let charactersString = ''

    characters.forEach((character) => {
      charactersString += character.characterName + ', ';
    });

    return charactersString;
  }

  const getExtras = (scene: Scene) => {
    const extras = scene.extras;
    let extrasString = ''

    if (extras) {
      extras.forEach((extra) => {
        extrasString += extra.extraName + ', ';
      });

      return extrasString;
    }

    return 'NO EXTRAS PLAYING'

  }

  const getPageNumber = (scene: Scene) => {
    const pageNumber = scene.page;
    const pageFloat = scene.pages;
    let pageFraction;

    pageFraction = pageNumber + ' ' + floatToFraction(pageFloat);

    return pageFraction;
  }

  return (
    <IonRow className='scene-card'>
      <IonCol className='scene-card-col-1'>
        <h3 className='scene-card-header'>
          {getSceneHeader(scene)}
        </h3>
        <p className='scene-card-synopsis'>
          {scene.synopsis}
        </p>
        <p className='scene-card-characters'>
          <strong>CHARACTERS:</strong> {getCharacters(scene)}<br />
          <strong>EXTRAS: </strong> {getExtras(scene)}
        </p>
      </IonCol>
      <IonCol className='scene-card-col-2'>
        <p className='ion-no-margin'>
          <strong>P: </strong> {getPageNumber(scene)}
        </p>
        <p className='ion-no-margin'><strong>M: 3:33 </strong></p>
      </IonCol>
      <IonCol className='scene-card-col-3 center-flex-row'>
        <p className='assignament-date'> NOT ASSIGNED </p>
      </IonCol>
    </IonRow>
  )
}

export default SceneCard
