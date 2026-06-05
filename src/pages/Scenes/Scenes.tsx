import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter,
} from '@ionic/react';
import React, {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import InputSortModal from '../../Shared/Components/inputs/InputSortModal/InputSortModal';
import StripTagsToolbar from './Components/StripTagsToolbar/StripTagsToolbar';
import { defaultSortOptions } from '../../context/Scenes/Scenes.context';
import useHideTabs from '../../hooks/utils/useHideTabs/useHideTabs';
import useScrollToTop from '../../hooks/utils/useScrollToTop/useScrollToTop';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import './Scenes.scss';
import ScenesTotals from './Components/ScenesTotals/ScenesTotals';
import SelectionModal from '../../Layouts/SelectionModal/SelectionModal';
import { groupsByOptions, GroupsSceneEnums } from './Components/ExportModal/ExportModal';
import AppLoader from '../../Shared/Components/loaders/AppLoader/AppLoader';
import { PermisionTypes } from '../../Shared/Components/navigation/ProtectedRoute/ProtectedRoute';
import ScenesToolbarButtons from './Components/ScenesTollbarButtons/ScenesToolbarButtons';
import ScenesList from './Components/ScenesList/ScenesList';
import GroupedScenesList from './Components/GroupedScenesList/GroupedScenesList';
import { useScenesFilteringOptimized } from '../../hooks/utils/useScenesFiltering/useScenesFilteringOptimized';
import useScenesGrouping from '../../hooks/utils/useScenesGrouping/useScenesGrouping';
import useProjectWeeks from '../../hooks/database/useProjectWeeks/useProjectWeeks';
import ScenesGroupByShootings from './Components/ScenesGroupByShootings/ScenesGroupByShootings';
import { useDebounce } from '../../hooks/utils/useDebounce/useDebounce';

const Scenes: React.FC<{
  permissionType: PermisionTypes | null;
}> = ({
  permissionType,
}) => {
    const { id: projectId } = useParams<{ id: string }>();
    const contentRef = useRef<HTMLIonContentElement>(null);

    const [searchText, setSearchText] = useState('');
    // Debounce prevents excessive filtering during rapid typing (200ms delay)
    const debouncedSearchText = useDebounce(searchText, 200);
    // Deferred value prevents UI blocking on every keystroke
    const deferredSearchText = useDeferredValue(debouncedSearchText);
    const [openGroupBy, setOpenGroupBy] = useState(false);
    const history = useHistory();
    const location = useLocation();
    useScrollToTop(contentRef, location);
    const toggleTabs = useHideTabs();
    const { weeks, isFetching } = useProjectWeeks(projectId);

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
    ]

    const [replicatorCreated, setReplicatorCreated] = useState<boolean>(false);
    const [disableEditions, setDisableEditions] = useState<boolean>(false);
    const [sortPosibilities, setSortPosibilities] = useState<any[]>(() => {
      const savedOrder = localStorage.getItem('sortPosibilitiesOrder');
      if (savedOrder) {
        return JSON.parse(savedOrder);
      }
      return defaultSortPosibilitiesOrder;
    });

    const {
      filteredScenes,
      selectedFilterOptions,
      setSelectedFilterOptions,
      selectedSortOptions,
      setSelectedSortOptions,
      scenesAreLoading
    } = useScenesFilteringOptimized(deferredSearchText);

    const [groupBy, setGroupBy] = useState<string[]>([]);


    const {
      categorizedScenes,
      sortedCategoryKeys,
      noGroupByOption
    } = useScenesGrouping(filteredScenes, groupBy);

    useEffect(() => {
      setGroupBy([noGroupByOption.value]);
    }, [noGroupByOption]);

    useEffect(() => {
      if (permissionType !== PermisionTypes.READ_AND_WRITE) {
        setDisableEditions(true);
      }
    }, [permissionType]);

    useIonViewDidEnter(() => {
      toggleTabs.showTabs();
      if (!replicatorCreated && navigator.onLine) {
        setReplicatorCreated(true);
      }
    });

    useEffect(() => {
      localStorage.setItem('selectedSortOptions', JSON.stringify(selectedSortOptions));
    }, [selectedSortOptions]);

    const handleBack = () => history.push('/my/projects');

    const clearSortSelections = () => {
      localStorage.removeItem('selectedSortOptions');
      setSortPosibilities(defaultSortPosibilitiesOrder);
      setSelectedSortOptions(defaultSortOptions);
    };

    useEffect(() => {
      localStorage.setItem('sortPosibilitiesOrder', JSON.stringify(sortPosibilities));
    }, [sortPosibilities]);

    const handleCheckGroup = useCallback((label: string) => {
      const selectedOption = groupsByOptions.find((option) => option.label === label);
      if (selectedOption) {
        setGroupBy([selectedOption.value]);
      } else if (label === noGroupByOption.label) {
        setGroupBy([noGroupByOption.value]);
      }
    }, [noGroupByOption]);


    return (
      <>
        <MainPagesLayout
          searchText={searchText}
          setSearchText={setSearchText}
          handleBack={handleBack}
          search
          title="SCENES"
          isLoading={scenesAreLoading}
          permissionType={permissionType}
          customButtons={[() => <ScenesToolbarButtons
            setOpenGroupBy={setOpenGroupBy}
            disableEditions={disableEditions}
          />]}
        >
          {
            scenesAreLoading ? (
              <IonContent color='tertiary'>
                <AppLoader />
              </IonContent>
            ) : (
              <IonContent
                color="tertiary"
                ref={contentRef}
                id="strips-container-ref"
              >
                <IonRefresher slot="fixed" onIonRefresh={() => window.location.reload()}>
                  <IonRefresherContent />
                </IonRefresher>

                {groupBy[0] == noGroupByOption.value &&
                  <ScenesTotals scenes={filteredScenes} />
                }

                <StripTagsToolbar />

                <Suspense>
                  {groupBy[0] === noGroupByOption.value ? (
                    <ScenesList
                      filteredScenes={filteredScenes}
                      searchText={searchText}
                      permissionType={permissionType}
                      selectedFilterOptions={selectedFilterOptions}
                      setSelectedFilterOptions={setSelectedFilterOptions}
                    />
                  ) : groupBy[0] === GroupsSceneEnums.SHOOTING_PLAN ? (
                    <ScenesGroupByShootings
                      scenes={filteredScenes}
                      weeks={weeks}
                      searchText={searchText}
                      permissionType={permissionType}
                      selectedFilterOptions={selectedFilterOptions}
                      setSelectedFilterOptions={setSelectedFilterOptions}
                    />
                  )
                    : (
                      <GroupedScenesList
                        categorizedScenes={categorizedScenes}
                        sortedCategoryKeys={sortedCategoryKeys}
                        searchText={searchText}
                        permissionType={permissionType}
                        selectedFilterOptions={selectedFilterOptions}
                        setSelectedFilterOptions={setSelectedFilterOptions}
                      />
                    )}
                </Suspense>
              </IonContent>
            )
          }
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
        <SelectionModal
          modalIsOpen={openGroupBy}
          setModalIsOpen={setOpenGroupBy}
          optionName='Group By'
          listOfOptions={[...groupsByOptions, noGroupByOption]}
          setSelectedOptions={setGroupBy}
          selectedOptions={groupBy}
          clearSelections={() => setGroupBy([noGroupByOption.value])}
          modalTrigger='group-by-modal-trigger'
          handleCheckboxToggle={handleCheckGroup}
          multipleSelections={false}
        />
      </>
    );
  };

export default Scenes;