import React, { useContext, useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import { SceneTypeEnum } from '../../Ennums/ennums';

const Cast: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    const processCharacter = (character: any) => {
      const scenes: any[] = offlineScenes.reduce((acc: any[], scene: any) => {
        const hasCharacter = scene._data.characters.some(
          (sceneCharacter: any) => sceneCharacter.characterName === character.characterName
        );
        if (hasCharacter) {
          acc.push(scene._data);
        }
        return acc;
      }, []);
  
      const setsQuantity: number = getUniqueValuesByKey(scenes, 'setName').length;
      const locationsQuantity: number = getUniqueValuesByKey(scenes, 'locationName').length;
      const pagesSum: number = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum: number = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity: number = getUniqueValuesByKey(scenes, 'episodeNumber').length;
      const scenesQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.SCENE).length;
      const protectionQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.PROTECTION).length;
  
      return {
        ...character,
        setsQuantity,
        locationsQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        scenesQuantity,
        protectionQuantity,
      };
    };
  
    const uniqueCharacters: any[] = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    const cast: any[] = uniqueCharacters.map(processCharacter);
    setCast(cast.sort((a, b) => a.characterName.localeCompare(b.characterName)));
  }, [offlineScenes]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>CAST</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {cast.map((character, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardSubtitle>{character.characterName}</IonCardSubtitle>
              <IonCardTitle>{character.role}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Sets Quantity: {character.setsQuantity}</p>
              <p>Locations Quantity: {character.locationsQuantity}</p>
              <p>Pages Sum: {character.pagesSum}</p>
              <p>Estimated Time Sum: {character.estimatedTimeSum}</p>
              <p>Episodes Quantity: {character.episodesQuantity}</p>
              <p>Scenes Quantity: {character.scenesQuantity}</p>
              <p>Protection Quantity: {character.protectionQuantity}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
}

export default Cast;
