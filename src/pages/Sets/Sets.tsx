import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
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

const Sets: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [setsSearchText, setSetsSearchText] = useState('');
  const [filteredSets, setFilteredSets] = useState<any[]>([]);
  const [displayedSets, setDisplayedSets] = useState<any[]>([]);

  const processedSets = useMemo(() => {
    const processSet = (setName: string) => {
      const setScenes = offlineScenes.filter((scene: any) => scene._data.setName === setName);
      const charactersLength = setScenes.reduce((acc: number, scene: any) => acc + scene._data.characters.length, 0);
      const scenesQuantity = setScenes.length;
      const protectionQuantity = setScenes.filter((scene: any) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length;
      const pagesSum = setScenes.reduce((acc: number, scene: any) => acc + (scene._data.pages || 0), 0);
      const estimatedTimeSum = setScenes.reduce((acc: number, scene: any) => acc + (scene._data.estimatedSeconds || 0), 0);
      const episodesQuantity = getUniqueValuesByKey(setScenes, 'episodeNumber').length;
      
      return {
        setName,
        charactersLength,
        scenesQuantity,
        protectionQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
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
    >
      <IonContent color="tertiary" fullscreen>
        <ScrollInfiniteContext setDisplayedData={setDisplayedSets} filteredData={filteredSets}>
          {displayedSets.map((set, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardSubtitle>
                  <HighlightedText text={set.setName} searchTerm={setsSearchText} />
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Characters Length: {set.charactersLength}</p>
                <p>Scenes Quantity: {set.scenesQuantity}</p>
                <p>Protection Quantity: {set.protectionQuantity}</p>
                <p>Pages Sum: {set.pagesSum}</p>
                <p>Estimated Time Sum: {set.estimatedTimeSum}</p>
                <p>Episodes Quantity: {set.episodesQuantity}</p>
              </IonCardContent>
            </IonCard>
          ))}
        </ScrollInfiniteContext>
      </IonContent>
    </MainPagesLayout>
  );
}

export default Sets;

