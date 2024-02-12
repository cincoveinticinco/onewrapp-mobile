import React, {
  useEffect, useState, Suspense, useContext, useRef,
} from 'react';
import {
  IonButton,
  IonContent,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import './Strips.scss';
import { useLocation } from 'react-router';
import scenesData from '../../data/scn_data.json';
import { Scene } from '../../interfaces/scenesTypes';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import sortScenes from '../../utils/SortScenesUtils/sortScenes';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';

const BATCH_SIZE = 30;

const Strips: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([]);
  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [scenesReady, setScenesReady] = useState(false);
  const { selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions } = useContext<any>(ScenesContext);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [searchText, setSearchText] = useState('');
  const concatedScenes = [...scenesData.scenes, ...offlineScenes];

  useEffect(() => {
    const newFilteredScenes = sortScenes(applyFilters((concatedScenes), selectedFilterOptions || {}), selectedSortOptions);
    setFilteredScenes(newFilteredScenes);
    setCurrentBatch(1);
    setDisplayedScenes(newFilteredScenes.slice(0, BATCH_SIZE));
    setInfiniteDisabled(false);
    setScenesReady(true);
  }, [selectedFilterOptions, selectedSortOptions, offlineScenes]);

  const filterScenes = (scenes: Scene[], searchText: string) => {
    return scenes.filter(scene => {
      const sceneFlatString = `${scene.sceneNumber} ${scene.synopsis} ${scene.locationName} ${scene.intOrExtOption} ${scene.dayOrNightOption} ${scene.scriptDay} ${scene.year} ${scene.episodeNumber} ${scene.sceneNumber} ${scene.intOrExtOption} ${scene.locationName} ${scene.setName} ${scene.dayOrNightOption} ${scene.scriptDay} ${scene.year}`;
      return sceneFlatString.toLowerCase().includes(searchText.toLowerCase());
    });
  };

  const loadMoreScenes = () => {
    if (currentBatch * BATCH_SIZE >= filteredScenes.length) {
      setInfiniteDisabled(true);
      return;
    }
    const newScenes = filteredScenes.slice(0, (currentBatch + 1) * BATCH_SIZE);
    setDisplayedScenes(newScenes);
    setCurrentBatch(currentBatch + 1);
  };

  const handleInfinite = async (e: CustomEvent<void>) => {
    loadMoreScenes();
    (e.target as HTMLIonInfiniteScrollElement).complete();
  };

  const resetFilters = () => {
    setSelectedFilterOptions({});
  };

  useEffect(() => {
    contentRef.current?.scrollToTop();
  }, [thisPath]);

  useEffect(() => {
    if(searchText) {
      const newFilteredScenes = filterScenes(filteredScenes, searchText);
      setDisplayedScenes(newFilteredScenes);
    }
  })

  useEffect(() => {
    console.log(displayedScenes.length)
    if(displayedScenes.length < 10) {
      loadMoreScenes();
    }
  }, [displayedScenes]);


  return (
    <MainPagesLayout 
      searchText={searchText}
      setSearchText={setSearchText}
    >
      <IonContent scrollEvents color="tertiary" ref={contentRef} id="strips-container-ref">
        <Suspense fallback={<div>Loading...</div>}>
          {scenesReady ? (
            filteredScenes.length === 0 ? (
              <div className="no-items-message">
                <p className="ion-no-margin">There are not any scenes that match your search. </p>
                <IonButton
                  fill="clear"
                  color="primary"
                  className="ion-no-margin reset-filters-option"
                  onClick={resetFilters}
                >
                  Reset Filters
                </IonButton>
                <span>?</span>
              </div>
            ) : (
              <IonGrid className="scenes-grid ion-margin">
                {displayedScenes.map((scene:any, i: any) => (
                  <SceneCard key={`scene-item-${scene}-${i}`} scene={scene} searchText={searchText}/>
                ))}
                <IonInfiniteScroll onIonInfinite={handleInfinite} threshold="100px" disabled={isInfiniteDisabled}>
                  <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more scenes..." />
                </IonInfiniteScroll>
              </IonGrid>
            )
          ) : (
            <div>Loading scenes...</div>
          )}
        </Suspense>
      </IonContent>
    </MainPagesLayout>
  );
};

export default Strips;