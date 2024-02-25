import React, { useEffect, useState, Suspense, useContext, useRef, useMemo, useCallback } from 'react';
import { IonButton, IonContent, IonGrid } from '@ionic/react';
import './Strips.scss';
import { useHistory, useLocation } from 'react-router';
import ScenesContext, { defaultSortOptions } from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { Scene } from '../../interfaces/scenesTypes';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';
import useScrollToTop from '../../hooks/useScrollToTop';
import InputSortModal from '../../components/Shared/InputSortModal/InputSortModal';
import StripTagsToolbar from '../../components/Strips/StripTagsToolbar';

const Strips: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const { selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions, setSelectedSortOptions } = useContext<any>(ScenesContext);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, unused_] = useState(false);
  const history = useHistory();

  const memoizedApplyFilters = useCallback((data: any, options: any) => applyFilters(data, options), []);

  const filteredScenes = useMemo(() => {
    const filteredData = Object.keys(selectedFilterOptions).length === 0 ? offlineScenes : memoizedApplyFilters(offlineScenes, selectedFilterOptions);
    return sortByCriterias(filteredData, selectedSortOptions);
  }, [offlineScenes, selectedFilterOptions, selectedSortOptions]);

  useEffect(() => {
    setLoading(offlineScenes.length === 0);
  }, [offlineScenes]);

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
    setDisplayedScenes(newFilteredScenes.slice(0, 10));
  }, [filteredScenes, selectedSortOptions]);

  const handleBack = () => history.push('/my/projects');

  const clearSortSelections = () => {
    localStorage.removeItem('selectedSortOptions');
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
          <StripTagsToolbar />
          <Suspense fallback={<div>Loading scene...</div>}>
            {loading ? (
              <div>Loading scenes...</div>
            ) : error ? (
              <div>Error loading scenes. Please try again later.</div>
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
                    <span>?</span>
                  </div>
                ) : (
                  <IonGrid className="scenes-grid ion-margin">
                    <ScrollInfiniteContext setDisplayedData={setDisplayedScenes} filteredData={filteredScenes}>
                      {displayedScenes.map((scene: any, i: any) => (
                        <SceneCard key={`scene-item-${scene}-${i}`} scene={scene} searchText={searchText} />
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
