import {
  IonButton,
  IonContent,
  IonGrid,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter,
} from '@ionic/react';
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useHistory, useLocation, useParams,
} from 'react-router';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import SceneCard from '../../components/Strips/SceneCard';
import StripTagsToolbar from '../../components/Strips/StripTagsToolbar';
import DatabaseContext from '../../context/Database/Database.context';
import ScenesContext, { defaultSortOptions } from '../../context/Scenes/Scenes.context';
import ScrollInfiniteContext from '../../context/ScrollInfinite/ScrollInfinite.context';
import useHideTabs from '../../hooks/Shared/useHideTabs';
import useScrollToTop from '../../hooks/Shared/useScrollToTop';
import { Scene } from '../../interfaces/scenes.types';
import { SecurePages } from '../../interfaces/securePages.types';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import applyFilters from '../../utils/applyFilters';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import './Strips.scss';
import { DatabaseContextProps } from '../../context/Database/types/Database.types';

const Strips: React.FC<{
  permissionType: SecurePages | null;
}> = ({
  permissionType,
}) => {
  const {
    offlineScenes,
    projectId,
    setProjectId,
    initialReplicationFinished,
    scenesAreLoading,
  } = useContext<DatabaseContextProps>(DatabaseContext);
  const {
    selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions, setSelectedSortOptions,
  } = useContext<any>(ScenesContext);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const location = useLocation();
  useScrollToTop(contentRef, location);
  const { id } = useParams<any>();
  const toggleTabs = useHideTabs();

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

  const [renderScenes, setRenderScenes] = useState<boolean>(false);
  const [replicatorCreated, setReplicatorCreated] = useState<boolean>(false);
  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);
  const [sortPosibilities, setSortPosibilities] = useState<any[]>(() => {
    const savedOrder = localStorage.getItem('sortPosibilitiesOrder');
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
    return defaultSortPosibilitiesOrder;
  });

  useEffect(() => {
    setRenderScenes(initialReplicationFinished);
    setProjectId(id);
  }, [initialReplicationFinished]);

  useIonViewDidEnter(() => {
    toggleTabs.showTabs();
    if (!replicatorCreated && navigator.onLine) {
      setReplicatorCreated(true);
    }
  });

  const memoizedApplyFilters = useCallback((data: any, options: any) => applyFilters(data, options), []);

  const filteredScenes = useMemo(() => {
    const filteredData = Object.keys(selectedFilterOptions).length === 0 && offlineScenes ? offlineScenes : memoizedApplyFilters(offlineScenes, selectedFilterOptions);
    if (filteredData && offlineScenes) {
      return sortByCriterias(filteredData, selectedSortOptions);
    }
    return [];
  }, [offlineScenes, selectedFilterOptions, selectedSortOptions, memoizedApplyFilters, projectId, renderScenes]);

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

  useEffect(() => {
    localStorage.setItem('sortPosibilitiesOrder', JSON.stringify(sortPosibilities));
  }, [sortPosibilities]);

  const renderContent = () => {
    if (filteredScenes.length === 0 && Object.keys(selectedFilterOptions).length > 0) {
      return (
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
      );
    }

    if (filteredScenes.length === 0 && Object.keys(selectedFilterOptions).length === 0) {
      return (
        <div className="no-items-message">
          <p className="ion-no-margin">There are not any scenes in this project. </p>
        </div>
      );
    }

    return (
      <IonGrid className="scenes-grid ion-margin">
        <ScrollInfiniteContext setDisplayedData={setDisplayedScenes} filteredData={filteredScenes} batchSize={20}>
          {displayedScenes.map((scene, i) => (
            <SceneCard
              key={`scene-item-${scene.id}-${i}`}
              scene={scene as any}
              searchText={searchText}
              permissionType={permissionType}
            />
          ))}
        </ScrollInfiniteContext>
      </IonGrid>
    );
  };

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
        title="SCENES"
        sortTrigger="sort-scenes-modal-trigger"
        isLoading={scenesAreLoading}
        permissionType={permissionType}
      >
        <IonContent scrollEvents color="tertiary" ref={contentRef} id="strips-container-ref">
          <IonRefresher slot="fixed" onIonRefresh={() => window.location.reload()}>
            <IonRefresherContent />
          </IonRefresher>
          <StripTagsToolbar />
          <Suspense>
            { renderContent() }
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
