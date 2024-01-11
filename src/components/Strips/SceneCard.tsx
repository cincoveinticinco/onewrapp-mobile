import React from 'react'
import { IonRow, IonCol, IonTitle } from '@ionic/react'
import { Scene } from '../../interfaces/scenesTypes';
import './SceneCard.css';
import { get } from 'mongoose';

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

    console.log(characters);

    return charactersString;
  }

  return (
    <IonRow className='scene-card'>
      <IonCol size="10">
        <h3 className='scene-card-header'>
          {getSceneHeader(scene)}
        </h3>
        <p className='scene-card-synopsis'>
          {scene.synopsis}
        </p>
        <p className='scene-card-characters'>
          <strong>CHARACTERS:</strong> {getCharacters(scene)}
        </p>
      </IonCol>
      <IonCol size="1">

      </IonCol>
      <IonCol size="1">
      
      </IonCol>   
    </IonRow>
  )
}

export default SceneCard
