import React from 'react'
import { IonRow, IonCol, IonTitle } from '@ionic/react'
import { Scene } from '../../interfaces/scenesTypes';

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

  return (
    <IonRow>
      <IonCol size="11">
        <IonTitle>
          {getSceneHeader(scene)}
        </IonTitle>
      </IonCol>
      <IonCol size="2">
      
      </IonCol>   
    </IonRow>
  )
}

export default SceneCard
