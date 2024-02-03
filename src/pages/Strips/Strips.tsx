import React, { useEffect, useState, Suspense } from 'react';
import {
  IonButton,
  IonContent,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import './Strips.scss';
import { useLocation } from 'react-router';
import scenesData from '../../data/scn_data.json'; // eslint-disable-line
import { Scene } from '../../interfaces/scenesTypes';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import sortScenes from '../../utils/SortScenesUtils/sortScenes';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';

const SceneCard = React.lazy(() => import('../../components/Strips/SceneCard'));

const Strips: React.FC = () => {
  const BATCH_SIZE = 20;
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([]);
  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const { selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions } = React.useContext<any>(ScenesContext);
  const thisPath = useLocation();

  const contentRef = React.createRef<HTMLIonContentElement>();

  useEffect(() => {
    const newFilteredScenes = sortScenes(applyFilters(scenesData.scenes, selectedFilterOptions), selectedSortOptions);
    setFilteredScenes(newFilteredScenes);
    setCurrentBatch(1);
    setDisplayedScenes(newFilteredScenes.slice(0, BATCH_SIZE));
    setInfiniteDisabled(false);
  }, [selectedFilterOptions, selectedSortOptions]);

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

  return (
    <MainPagesLayout>
      <IonContent scrollEvents color="tertiary" ref={contentRef} id="strips-container-ref">
        <Suspense fallback={<div>Loading...</div>}>
          {filteredScenes.length === 0 ? (
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
                {displayedScenes.map((scene, i) => (
                  <SceneCard key={`scene-item-${scene}-${i}`} scene={scene} />
                ))}
                <IonInfiniteScroll onIonInfinite={handleInfinite} threshold="100px" disabled={isInfiniteDisabled}>
                  <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more scenes..." />
                </IonInfiniteScroll>
              </IonGrid> 
          )}
        </Suspense>
      </IonContent>
    </MainPagesLayout>
  );
};

export default Strips;
