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
import { SceneTypeEnum } from '../../Ennums/ennums';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import { useLocation } from 'react-router';
import useScrollToTop from '../../hooks/useScrollToTop';
import floatToFraction from '../../utils/floatToFraction';
import secondsToMinSec from '../../utils/secondsToMinSec';

const Sets: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [setsSearchText, setSetsSearchText] = useState('');
  const [filteredSets, setFilteredSets] = useState<any[]>([]);
  const [displayedSets, setDisplayedSets] = useState<any[]>([]);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  useScrollToTop(contentRef, thisPath);

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

      return {
        setName,
        charactersLength,
        scenesQuantity,
        protectionQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        participation
      };
    };

    const uniqueSetNames: any[] = getUniqueValuesByKey(offlineScenes, 'setName');
    return uniqueSetNames.map(processSet).sort((a, b) => a.setName.localeCompare(b.setName));
  }, [offlineScenes]);

  useEffect(() => {
    const filteredSets = setsSearchText.length > 0 ? processedSets.filter((set) => set.setName.toLowerCase().includes(setsSearchText.toLowerCase())) : processedSets;
    setFilteredSets(filteredSets);
  }, [processedSets, setsSearchText]);

  return (
    <MainPagesLayout
      searchText={setsSearchText}
      setSearchText={setSetsSearchText}
      title="SETS"
      search
      sort
    >
      <IonContent color="tertiary" fullscreen ref={contentRef}>
        <ScrollInfiniteContext setDisplayedData={setDisplayedSets} filteredData={filteredSets}>
          {displayedSets.map((set, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardSubtitle>
                  <HighlightedText text={set.setName} searchTerm={setsSearchText} />
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
  );
};

export default Sets;
