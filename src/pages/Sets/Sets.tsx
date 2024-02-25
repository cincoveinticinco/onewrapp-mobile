import React, {
  useContext, useEffect, useState, useMemo, useRef,
} from 'react';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';
import DatabaseContext from '../../context/database';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import { SceneTypeEnum } from '../../Ennums/ennums';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import { useLocation } from 'react-router';
import useScrollToTop from '../../hooks/useScrollToTop';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import ScenesContext, { setsDefaultSortOptions } from '../../context/ScenesContext';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';

const Sets: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const { setsSelectedSortOptions, setSetsSelectedSortOptions} = useContext(ScenesContext);
  const [setsSearchText, setSetsSearchText] = useState('');
  const [filteredSets, setFilteredSets] = useState<any[]>([]);
  const [displayedSets, setDisplayedSets] = useState<any[]>([]);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);

  const defaultSortPosibilitiesOrder = [
    {id: 'SET_NAME', label: 'Set Name', optionKey: 'setName', defaultIndex: 0},
    {id: 'LOCATION_NAME', label: 'Location Name', optionKey: 'locationName', defaultIndex: 1},
    {id: 'CHARACTERS_LENGTH', label: 'Characters Length', optionKey: 'charactersLength', defaultIndex: 2},
    {id: 'SCENES_QUANTITY', label: 'Scenes Quantity', optionKey: 'scenesQuantity', defaultIndex: 3},
    {id: 'PROTECTION_QUANTITY', label: 'Protection Quantity', optionKey: 'protectionQuantity', defaultIndex: 4},
    {id: 'PAGES_SUM', label: 'Pages Sum', optionKey: 'pagesSum', defaultIndex: 5},
    {id: 'ESTIMATED_TIME_SUM', label: 'Estimated Time Sum', optionKey: 'estimatedTimeSum', defaultIndex: 6},
    {id: 'EPISODES_QUANTITY', label: 'Episodes Quantity', optionKey: 'episodesQuantity', defaultIndex: 7},
    {id: 'PARTICIPATION', label: 'Participation', optionKey: 'participation', defaultIndex: 8},
  ]

  const [setsSortPosibilities, setSetsSortPosibilities] = useState<any[]>(() => {
    const savedSortPosibilities = localStorage.getItem('setsSortPosibilities');
    if (savedSortPosibilities) {
      return JSON.parse(savedSortPosibilities);
    }
    return defaultSortPosibilitiesOrder;
  });

  useEffect(() => {
    localStorage.setItem('setsSortPosibilities', JSON.stringify(setsSortPosibilities));
  }, [setsSortPosibilities]);

  const processedSets = useMemo(() => {
    const processSet = (setName: string) => {
      const setScenes = offlineScenes.filter((scene: any) => scene._data.setName === setName);
      const charactersLength = setScenes.reduce((acc: number, scene: any) => acc + scene._data.characters.length, 0);
      const scenesQuantity = setScenes.length;
      const protectionQuantity = setScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length;
      const pagesSum = setScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0);
      const estimatedTimeSum = setScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0);
      const episodesQuantity = getUniqueValuesByKey(setScenes, 'episodeNumber').length;
      const participation = ((scenesQuantity / offlineScenes.length) * 100).toFixed(2);
      const locationName = setScenes[0]._data.locationName;

      return {
        setName,
        charactersLength,
        scenesQuantity,
        protectionQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        participation,
        locationName
      };
    };

    const uniqueSetNames: any[] = getUniqueValuesByKey(offlineScenes, 'setName');
    return sortByCriterias(uniqueSetNames.map(processSet), setsSelectedSortOptions)
  }, [offlineScenes, setsSelectedSortOptions]);

  useEffect(() => {
    const filteredSets = setsSearchText.length > 0 ? processedSets.filter((set: any) => set.setName.toLowerCase().includes(setsSearchText.toLowerCase())) : processedSets;
    setFilteredSets(filteredSets);
  }, [processedSets, setsSearchText]);

  const cleartSortSelections = () => {
    localStorage.removeItem('setsSelectedSortOptions');
    localStorage.removeItem('setsSortPosibilities');
    setSetsSelectedSortOptions(setsDefaultSortOptions);
    setSetsSortPosibilities(defaultSortPosibilitiesOrder);
  }

  return (
    <>
      <MainPagesLayout
        searchText={setsSearchText}
        setSearchText={setSetsSearchText}
        title="SETS"
        search
        sort
        sortTrigger='sort-sets-modal-trigger'
      >
        <IonContent color="tertiary" fullscreen ref={contentRef}>
          <ScrollInfiniteContext setDisplayedData={setDisplayedSets} filteredData={filteredSets}>
            {displayedSets.map((set, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardTitle>
                  <HighlightedText text={set.setName} searchTerm={setsSearchText} />
                  </IonCardTitle>
                  <IonCardSubtitle>
                    {set.locationName.toUpperCase() || ''}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    <strong>Characters Length:</strong> {set.charactersLength}
                  </p>
                  <p>
                    <strong>Scenes Quantity:</strong> {set.scenesQuantity}
                  </p>
                  <p>
                    <strong>Protection Quantity:</strong> {set.protectionQuantity}
                  </p>
                  <p>
                    <strong>Pages Sum:</strong> {floatToFraction(set.pagesSum)}
                  </p>
                  <p>
                    <strong>Estimated Time Sum:</strong> {secondsToMinSec(set.estimatedTimeSum)}
                  </p>
                  <p>
                    <strong>Episodes Quantity:</strong> {set.episodesQuantity}
                  </p>
                  <p>
                    <strong>Participation:</strong> {set.participation}%
                  </p>
                </IonCardContent>
              </IonCard>
            ))}
          </ScrollInfiniteContext>
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        pageName="Sort Sets"
        clearSelections={cleartSortSelections}
        modalTrigger="sort-sets-modal-trigger"
        defaultSortOptions={setsDefaultSortOptions}
        selectedSortOptions={setsSelectedSortOptions}
        setSelectedSortOptions={setSetsSelectedSortOptions}
        sortPosibilities={setsSortPosibilities}
        setSortPosibilities={setSetsSortPosibilities}
      />
    </>
  );
};

export default Sets;
