import React, { useEffect, useState, Suspense } from 'react';
import {
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import './Strips.css';
import { chevronDownOutline } from 'ionicons/icons';
import { useLocation } from 'react-router';
import scene_data from '../../data/scn_data.json'; // eslint-disable-line
import Toolbar from '../../components/Shared/Toolbar';
import { Scene } from '../../interfaces/scenesTypes';
import ScenesFiltersContext from '../../context/scenesFiltersContext';
import filterScenes from '../../utils/filterScenes';

const SceneCard = React.lazy(() => import('../../components/Strips/SceneCard'));

const Strips: React.FC = () => {
  const BATCH_SIZE = 20;
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([]);
  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const { filterOptions } = React.useContext<any>(ScenesFiltersContext);
  const thisPath = useLocation();

  const contentRef = React.createRef<HTMLIonContentElement>();

  useEffect(() => {
    const newFilteredScenes = filterScenes(scene_data.scenes, filterOptions);
    setFilteredScenes(newFilteredScenes);
    setCurrentBatch(1);
    setDisplayedScenes(newFilteredScenes.slice(0, BATCH_SIZE));
    setInfiniteDisabled(false);
  }, [filterOptions]);

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

  useEffect(() => {
    contentRef.current?.scrollToTop();
  }, [thisPath]);

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="LVE-STRIPS" search addScene filter elipse />
      </IonHeader>
      <IonContent scrollEvents color="tertiary" ref={contentRef} id="strips-container-ref">
        <IonToolbar color="tertiary" className="sort-strips-toolbar">
          <IonButton fill="clear" className="reset-button sort-strips-button" routerLink="sortscenes">
            <IonIcon icon={chevronDownOutline} />
            {' '}
            SORT BY: EPISODE NUMBER
          </IonButton>
        </IonToolbar>
        {filteredScenes.length === 0 ? (
          <div className="no-items-message">
            <p>There are not any scenes that match your search. </p>
            <a href="/" className="create-one-link">Reset Filters </a>
            ?
          </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <IonGrid className="scenes-grid">
              {displayedScenes.map((scene, i) => (
                <SceneCard key={`scene-item-${scene}-${i}`} scene={scene} />
              ))}
              <IonInfiniteScroll onIonInfinite={handleInfinite} threshold="100px" disabled={isInfiniteDisabled}>
                <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more scenes..." />
              </IonInfiniteScroll>
            </IonGrid>
          </Suspense>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Strips;
