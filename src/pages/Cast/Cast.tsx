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
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import ScenesContext, { castDefaultSortOptions } from '../../context/ScenesContext';

const Cast: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [cast, setCast] = useState<any[]>([]);
  const [castSearchText, setCastSearchText] = useState('');
  const [displayedCast, setDisplayedCast] = useState<any[]>([]);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);
  const { castSelectedSortOptions, setCastSelectedSortOptions } = useContext(ScenesContext);

  /// REMOVE SYMBOLS
  /// LOCATION AND ELEMENTS CATEGORY
  /// CREATE NEW CHARACTERS

  const handleBack = useHandleBack();

  // REMOVE NULL CHARACTERS
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
      const participation: string = ((scenesQuantity / offlineScenes.length) * 100).toFixed(2);

      return {
        ...character,
        setsQuantity,
        locationsQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        scenesQuantity,
        protectionQuantity,
        participation
      };
    };

    const uniqueCharacters: any[] = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    return sortByCriterias(uniqueCharacters.map(processCharacter), castSelectedSortOptions);
  }, [offlineScenes, castSelectedSortOptions]);

  useEffect(() => {
    const filteredCast = castSearchText.length > 0 ? processedCast.filter((character: any) => {
      const characterHeader = `${character.characterNum}. ${character.characterName}`;
      return characterHeader.toLowerCase().includes(castSearchText.toLowerCase());
    }) : processedCast;
    setCast(filteredCast);
  }, [processedCast, castSearchText, processedCast]);

  const getCharacterNum = (character: any) => {
    const characterNum = character.characterNum ? `${character.characterNum}.` : '';
    return characterNum;
  }

  const defaultSortPosibilitiesOrder = [
    {
      id: 'CHARACTER_NUM', label: 'CHARACTER NUM', optionKey: 'characterNum', defaultIndex: 0,
    },
    {
      id: 'CHARACTER_NAME', label: 'CHARACTER NAME', optionKey: 'characterName', defaultIndex: 1,
    },
    {
      id: 'SETS_QUANTITY', label: 'SETS QUANTITY', optionKey: 'setsQuantity', defaultIndex: 2,
    },
    {
      id: 'LOCATIONS_QUANTITY', label: 'LOCATIONS QUANTITY', optionKey: 'locationsQuantity', defaultIndex: 3,
    },
    {
      id: 'PAGES_SUM', label: 'PAGES SUM', optionKey: 'pagesSum', defaultIndex: 4,
    },
    {
      id: 'ESTIMATED_TIME_SUM', label: 'ESTIMATED TIME SUM', optionKey: 'estimatedTimeSum', defaultIndex: 5,
    },
    {
      id: 'EPISODES_QUANTITY', label: 'EPISODES QUANTITY', optionKey: 'episodesQuantity', defaultIndex: 6,
    },
    {
      id: 'SCENES_QUANTITY', label: 'SCENES QUANTITY', optionKey: 'scenesQuantity', defaultIndex: 7,
    },
    {
      id: 'PROTECTION_QUANTITY', label: 'PROTECTION QUANTITY', optionKey: 'protectionQuantity', defaultIndex: 8,
    },
    {
      id: 'PARTICIPATION', label: 'PARTICIPATION', optionKey: 'participation', defaultIndex: 9,
    }
  ];

  const clearSortSelections = () => {
    localStorage.removeItem('castSelectedSortOptions');
    localStorage.removeItem('castSortPosibilitiesOrder');
    setCastSelectedSortOptions(castDefaultSortOptions);
    setCastSortPosibilities(defaultSortPosibilitiesOrder);
  }

  const [castSortPosibilities, setCastSortPosibilities] = React.useState<any[]>(() => {
    const savedOrder = localStorage.getItem('castSortPosibilitiesOrder');
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
    return defaultSortPosibilitiesOrder;
  })

  useEffect(() => {
    localStorage.setItem('castSortPosibilitiesOrder', JSON.stringify(castSortPosibilities));
  }, [castSortPosibilities]);

  return (
    <>
      <MainPagesLayout
        searchText={castSearchText}
        setSearchText={setCastSearchText}
        handleBack={handleBack}
        title="CAST"
        search
        sort
        sortTrigger="sort-cast-modal-trigger"
      >
        <IonContent color="tertiary" fullscreen ref={contentRef}>
          <ScrollInfiniteContext setDisplayedData={setDisplayedCast} filteredData={cast}>
            {displayedCast.map((character, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardSubtitle>
                    <HighlightedText text={`${getCharacterNum(character)} ${character.characterName}`} searchTerm={castSearchText} />
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    <strong>Sets Quantity:</strong> {character.setsQuantity}
                  </p>
                  <p>
                    <strong>Locations Quantity:</strong> {character.locationsQuantity}
                  </p>
                  <p>
                    <strong>Pages Sum:</strong> {floatToFraction(character.pagesSum)}
                  </p>
                  <p>
                    <strong>Estimated Time Sum:</strong> {secondsToMinSec(character.estimatedTimeSum)}
                  </p>
                  <p>
                    <strong>Episodes Quantity:</strong> {character.episodesQuantity}
                  </p>
                  <p>
                    <strong>Scenes Quantity:</strong> {character.scenesQuantity}
                  </p>
                  <p>
                    <strong>Protection Quantity:</strong> {character.protectionQuantity}
                  </p>
                  <p>
                    <strong>Participation:</strong> {character.participation}%
                  </p>
                </IonCardContent>
              </IonCard>
            ))}
          </ScrollInfiniteContext>
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        pageName="Sort Cast"
        modalTrigger="sort-cast-modal-trigger"
        defaultSortOptions={castDefaultSortOptions}
        setSelectedSortOptions={setCastSelectedSortOptions}
        selectedSortOptions={castSelectedSortOptions}
        clearSelections={clearSortSelections}   
        setSortPosibilities={setCastSortPosibilities}
        sortPosibilities={castSortPosibilities}
      />
    </>
  );
};

export default Cast;
