import React, {
  useContext, useEffect, useState, useMemo, useRef,
} from 'react';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/react';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import { SceneTypeEnum } from '../../Ennums/ennums';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import useHandleBack from '../../hooks/useHandleBack';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import { useLocation } from 'react-router';
import useScrollToTop from '../../hooks/useScrollToTop';

const Cast: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [cast, setCast] = useState<any[]>([]);
  const [castSearchText, setCastSearchText] = useState('');
  const [displayedCast, setDisplayedCast] = useState<any[]>([]);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);

  const handleBack = useHandleBack();

  const processedCast = useMemo(() => {
    const processCharacter = (character: any) => {
      const scenes: any[] = offlineScenes.reduce((acc: any[], scene: any) => {
        const hasCharacter = scene._data.characters.some(
          (sceneCharacter: any) => sceneCharacter.characterName === character.characterName,
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
    return uniqueCharacters.map(processCharacter).sort((a, b) => a.characterName.localeCompare(b.characterName));
  }, [offlineScenes]);

  useEffect(() => {
    const filteredCast = castSearchText.length > 0 ? processedCast.filter((character) => character.characterName.toLowerCase().includes(castSearchText.toLowerCase())) : processedCast;
    setCast(filteredCast);
  }, [processedCast, castSearchText]);

  return (
    <MainPagesLayout
      searchText={castSearchText}
      setSearchText={setCastSearchText}
      handleBack={handleBack}
      title="CAST"
      search
    >
      <IonContent color="tertiary" fullscreen ref={contentRef}>
        <ScrollInfiniteContext setDisplayedData={setDisplayedCast} filteredData={cast}>
          {displayedCast.map((character, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardSubtitle>
                  <HighlightedText text={character.characterName} searchTerm={castSearchText} />
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  Sets Quantity:
                  {character.setsQuantity}
                </p>
                <p>
                  Locations Quantity:
                  {character.locationsQuantity}
                </p>
                <p>
                  Pages Sum:
                  {character.pagesSum}
                </p>
                <p>
                  Estimated Time Sum:
                  {character.estimatedTimeSum}
                </p>
                <p>
                  Episodes Quantity:
                  {character.episodesQuantity}
                </p>
                <p>
                  Scenes Quantity:
                  {character.scenesQuantity}
                </p>
                <p>
                  Protection Quantity:
                  {character.protectionQuantity}
                </p>
              </IonCardContent>
            </IonCard>
          ))}
        </ScrollInfiniteContext>
      </IonContent>
    </MainPagesLayout>
  );
};

export default Cast;
