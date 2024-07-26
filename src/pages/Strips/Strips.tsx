import React, {
  useEffect, useState, Suspense, useContext, useRef, useMemo, useCallback,
} from 'react';
import {
  IonButton, 
  IonContent, 
  IonGrid, 
  IonRefresher, 
  IonRefresherContent,
  useIonViewWillEnter,
} from '@ionic/react';
import './Strips.scss';
import { useHistory, useLocation, useParams } from 'react-router';
import ScenesContext, { defaultSortOptions } from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';
import SceneCard from '../../components/Strips/SceneCard';
import { Scene } from '../../interfaces/scenesTypes';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import useScrollToTop from '../../hooks/Shared/useScrollToTop';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import StripTagsToolbar from '../../components/Strips/StripTagsToolbar';
import useLoader from '../../hooks/Shared/useLoader';

const Strips: React.FC = () => {
  const {
    offlineScenes, 
    initializeSceneReplication, 
    projectId, 
    scenesAreLoading, 
    setScenesAreLoading, 
    initializeParagraphReplication,
    initializeTalentsReplication,
    isDatabaseReady,
    setProjectId
  } = useContext<DatabaseContextProps>(DatabaseContext);
  const {
    selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions, setSelectedSortOptions
  } = useContext<any>(ScenesContext);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [searchText, setSearchText] = useState('');
  const [initialReplicationFinished, setInitialReplicationFinished] = useState(false);
  const history = useHistory();
  const location = useLocation();
  useScrollToTop(contentRef, location);
  const { id } = useParams<any>();

  const initializeReplication = async () => {
    if(isDatabaseReady) {
      try { 
        setScenesAreLoading(true);
        console.log('Initializing scene replication');
        await initializeTalentsReplication();
        await initializeSceneReplication().catch((error) => { throw error; });
      } catch (error) {
        console.error('Error initializing scene replication:', error);
      } finally {
        setInitialReplicationFinished(true);
        setScenesAreLoading(false);
        await initializeParagraphReplication();
      }
    }
  };

  useEffect(() => {
    console.log(initialReplicationFinished)
    console.log(isDatabaseReady)
    initializeReplication();
    console.log('Replication initialized', initialReplicationFinished);
  }, [ projectId ]);

  useIonViewWillEnter(() => {
    setProjectId(id);
  });
  
  const memoizedApplyFilters = useCallback((data: any, options: any) => applyFilters(data, options), []);

  const filteredScenes = useMemo(() => {
    const filteredData = Object.keys(selectedFilterOptions).length === 0 && offlineScenes ? offlineScenes : memoizedApplyFilters(offlineScenes, selectedFilterOptions);
    if (filteredData && offlineScenes) {
      return sortByCriterias(filteredData, selectedSortOptions);
    }
    return [];
  }, [offlineScenes, selectedFilterOptions, selectedSortOptions, memoizedApplyFilters, projectId]);

  useEffect(() => {
    localStorage.setItem('selectedSortOptions', JSON.stringify(selectedSortOptions));
  }, [selectedSortOptions]);

  useEffect(() => {
    if (searchText.length > 0) {
      const filterCriteria = {
        ...selectedFilterOptions,
        $or: {
          characters: [{ characterName: [searchText] }],
          extras: [{ extraName: [searchText] }],
          locationName: [searchText],
          setName: [searchText],
          synopsis: [searchText],
          episodeNumber: [searchText],
          sceneNumber: [searchText],
          intOrExtOption: [searchText],
          dayOrNightOption: [searchText],
          episodeSceneNumber: [searchText],
        },
      };
      setSelectedFilterOptions({ ...selectedFilterOptions, ...filterCriteria });
    } else {
      setSelectedFilterOptions({});
    }
  }, [searchText, setSelectedFilterOptions]);

  useEffect(() => {
    const newFilteredScenes = sortByCriterias(filteredScenes, selectedSortOptions);
    setDisplayedScenes(newFilteredScenes.slice(0, 20));
  }, [filteredScenes, selectedSortOptions]);

  const handleBack = () => history.push('/my/projects');

  const clearSortSelections = () => {
    localStorage.removeItem('selectedSortOptions');
    setSortPosibilities(defaultSortPosibilitiesOrder);
    setSelectedSortOptions(defaultSortOptions);
  };

  const defaultSortPosibilitiesOrder = [
    {
      id: 'EPISODE_NUMBER', label: 'EP NUMBER', optionKey: 'episodeNumber', defaultIndex: 0,
    },
    {
      id: 'SCENE_NUMBER', label: 'SCENE NUMBER', optionKey: 'sceneNumber', defaultIndex: 1,
    },
    {
      id: 'DAY_OR_NIGHT', label: 'DAY OR NIGHT', optionKey: 'dayOrNightOption', defaultIndex: 2,
    },
    {
      id: 'INT_OR_EXT', label: 'INT OR EXT', optionKey: 'intOrExtOption', defaultIndex: 3,
    },
    {
      id: 'LOCATION_NAME', label: 'LOCATION NAME', optionKey: 'locationName', defaultIndex: 4,
    },
    {
      id: 'SET_NAME', label: 'SET NAME', optionKey: 'setName', defaultIndex: 5,
    },
    {
      id: 'SCRIPT_DAY', label: 'SCRIPT DAY', optionKey: 'scriptDay', defaultIndex: 6,
    },
  ];

  const [sortPosibilities, setSortPosibilities] = useState<any[]>(() => {
    const savedOrder = localStorage.getItem('sortPosibilitiesOrder');
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
    return defaultSortPosibilitiesOrder;
  });

  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);

  useEffect(() => {
    localStorage.setItem('sortPosibilitiesOrder', JSON.stringify(sortPosibilities));
  }, [sortPosibilities]);

  return (
    <>
      <MainPagesLayout
        searchText={searchText}
        setSearchText={setSearchText}
        handleBack={handleBack}
        search
        add
        filter
        sort
        title="LVE STRIPS"
        sortTrigger="sort-scenes-modal-trigger"
      >
        <IonContent scrollEvents color="tertiary" ref={contentRef} id="strips-container-ref">
          <IonRefresher slot="fixed" onIonRefresh={() => window.location.reload()}>
            <IonRefresherContent />
          </IonRefresher>
          <StripTagsToolbar />
          <Suspense>
            {!initialReplicationFinished || scenesAreLoading ? (
              useLoader()
            ) : (
              <>
                {filteredScenes.length === 0 && Object.keys(selectedFilterOptions).length > 0 ? (
                  <div className="no-items-message">
                    <p className="ion-no-margin">There are not any scenes that match your search. </p>
                    <IonButton
                      fill="clear"
                      color="primary"
                      className="ion-no-margin reset-filters-option"
                      onClick={() => setSelectedFilterOptions({})}
                    >
                      Reset Filters
                    </IonButton>
                  </div>
                ) : filteredScenes.length === 0 && Object.keys(selectedFilterOptions).length === 0 ? (
                  <div className="no-items-message">
                    <p className="ion-no-margin">There are not any scenes in this project. </p>
                  </div>
                ) : (
                  <IonGrid className="scenes-grid ion-margin">
                    <ScrollInfiniteContext setDisplayedData={setDisplayedScenes} filteredData={filteredScenes} batchSize={20}>
                      {displayedScenes.map((scene, i) => (
                        <SceneCard key={`scene-item-${scene.id}-${i}`} scene={scene} searchText={searchText} />
                      ))}
                    </ScrollInfiniteContext>
                  </IonGrid>
                )}
              </>
            )}
          </Suspense>
        </IonContent>
      </MainPagesLayout>
      <InputSortModal
        pageName="Sort"
        clearSelections={clearSortSelections}
        modalTrigger="sort-scenes-modal-trigger"
        defaultSortOptions={defaultSortOptions}
        selectedSortOptions={selectedSortOptions}
        setSelectedSortOptions={setSelectedSortOptions}
        setSortPosibilities={setSortPosibilities}
        sortPosibilities={sortPosibilities}
      />
    </>
  );
};

export default Strips;
