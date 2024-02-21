import React, { useEffect, useState, Suspense, useContext, useRef, useMemo, useCallback } from 'react';
import { IonButton, IonContent, IonGrid } from '@ionic/react';
import './Strips.scss';
import { useHistory, useLocation } from 'react-router';
import ScenesContext from '../../context/ScenesContext';
import applyFilters from '../../utils/applyFilters';
import sortScenes from '../../utils/SortScenesUtils/sortScenes';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import DatabaseContext from '../../context/database';
import SceneCard from '../../components/Strips/SceneCard';
import { Scene } from '../../interfaces/scenesTypes';
import StripTagsToolbar from '../../components/Strips/StripTagsToolbar';
import ScrollInfiniteContext from '../../context/ScrollInfiniteContext';

const Strips: React.FC = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [filteredScenes, setFilteredScenes] = useState<Scene[]>([]);
  const [displayedScenes, setDisplayedScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, unused_] = useState(false);
  const { selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions } = useContext<any>(ScenesContext);
  const thisPath = useLocation();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [searchText, setSearchText] = useState('');

  const memoizedApplyFilters = useCallback(
    (data: any, options: any) => {
      const filteredData = applyFilters(data, options);
      return filteredData;
    },
    []
  );

  const newFilteredScenes = useMemo(() => {
    if (Object.keys(selectedFilterOptions).length === 0) {
      return sortScenes(offlineScenes, selectedSortOptions);
    } else {
      return sortScenes(memoizedApplyFilters(offlineScenes, selectedFilterOptions), selectedSortOptions);
    }
  }, [offlineScenes, selectedFilterOptions, selectedSortOptions]);

  useEffect(() => {
    setFilteredScenes(newFilteredScenes);
    offlineScenes.length > 0 ? setLoading(false) : setLoading(true);
  }, [selectedFilterOptions, selectedSortOptions, newFilteredScenes ]);

  const resetFilters = () => {
    setSelectedFilterOptions({});
  }

  useEffect(() => {
    contentRef.current?.scrollToTop();
  }, [thisPath]);

  const filterScenesBySearchText = useCallback(
    (searchText: string) => {
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
          episodeSceneNumber: [searchText]
        },
      };

      if (searchText.length > 0) {
        setSelectedFilterOptions({
          ...selectedFilterOptions,
          ...filterCriteria,
        });
      } else {
        setSelectedFilterOptions({});
      }
    },
    [setSelectedFilterOptions]
  );

  useEffect(() => {
    filterScenesBySearchText(searchText);
  }, [searchText, filterScenesBySearchText]);

  const history = useHistory();

  const handleBack= () => history.push(`/my/projects`);

  return (
    <MainPagesLayout
      searchText={searchText}
      setSearchText={setSearchText}
      handleBack={handleBack}
      search
      add
      filter
      sort
      title="LVE STRIPS"
    >
      <StripTagsToolbar />
      <IonContent scrollEvents color="tertiary" ref={contentRef} id="strips-container-ref">
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
                      onClick={resetFilters}
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
  );
};

export default Strips;
