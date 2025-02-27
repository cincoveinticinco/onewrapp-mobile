import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter,
} from '@ionic/react';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import InputSortModal from '../../Shared/Components/InputSortModal/InputSortModal';
import StripTagsToolbar from './Components/StripTagsToolbar/StripTagsToolbar';
import { defaultSortOptions } from '../../context/Scenes/Scenes.context';
import useHideTabs from '../../Shared/hooks/useHideTabs';
import useScrollToTop from '../../Shared/hooks/useScrollToTop';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import './Scenes.scss';
import ScenesTotals from './Components/ScenesTotals/ScenesTotals';
import SelectionModal from '../../Layouts/SelectionModal/SelectionModal';
import { groupsByOptions, GroupsSceneEnums } from './Components/ExportModal/ExportModal';
import AppLoader from '../../Shared/hooks/AppLoader';
import { PermisionTypes } from '../../Shared/Components/ProtectedRoute/ProtectedRoute';
import ScenesToolbarButtons from './Components/ScenesTollbarButtons/ScenesToolbarButtons';
import ScenesList from './Components/ScenesList/ScenesList';
import GroupedScenesList from './Components/GroupedScenesList/GroupedScenesList';
import { useScenesFiltering } from '../../hooks/useScenesFiltering/useScenesFiltering';
import useScenesGrouping from '../../hooks/useScenesGrouping/useScenesGrouping';
import useProjectWeeks from '../../hooks/useProjectWeeks/useProjectWeeks';
import ScenesGroupByShootings from './Components/ScenesGroupByShootings/ScenesGroupByShootings';

const Scenes: React.FC<{
  permissionType: PermisionTypes | null;
}> = ({
  permissionType,
}) => {
    const { id: projectId } = useParams<{ id: string }>();
    const contentRef = useRef<HTMLIonContentElement>(null);

    const [searchText, setSearchText] = useState('');
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
    const [displayedCategories, setDisplayedCategories] = useState<string[]>([]);
    const [displayedCategoriesCount, setDisplayedCategoriesCount] = useState<number>(10);
    const [visibleScenesPerCategory, setVisibleScenesPerCategory] = useState<{ [key: string]: number }>({});
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
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
    } = useScenesFiltering(searchText);

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
      setDisplayedCategories(sortedCategoryKeys.slice(0, displayedCategoriesCount));
    }, [sortedCategoryKeys, displayedCategoriesCount]);

    useEffect(() => {
      const initialVisibleScenes: { [key: string]: number } = {};
      const initialOpenSections: { [key: string]: boolean } = {};

      sortedCategoryKeys.forEach(category => {
        initialVisibleScenes[category] = 10;
        initialOpenSections[category] = true;
      });

      setVisibleScenesPerCategory(initialVisibleScenes);
      setOpenSections(initialOpenSections);
    }, [sortedCategoryKeys]);

    // Función para cargar más escenas para una categoría específica
    const loadMoreScenesForCategory = useCallback((category: string) => {
      setVisibleScenesPerCategory(prev => ({
        ...prev,
        [category]: Math.min(
          (prev[category] || 10) + 10,
          categorizedScenes[category]?.length || 0
        )
      }));
    }, [categorizedScenes]);

    const handleScroll = useCallback((event: CustomEvent) => {
      const scrollElement = event.target as HTMLIonContentElement;
      const scrollPosition = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      if (scrollPosition + clientHeight >= scrollHeight - 200) {
        if (displayedCategoriesCount < sortedCategoryKeys.length) {
          setDisplayedCategoriesCount(prev => Math.min(prev + 5, sortedCategoryKeys.length));
        }

        displayedCategories.forEach(category => {
          const categoryElement = document.getElementById(`category-content-${category}`);
          if (categoryElement && openSections[category]) {
            const rect = categoryElement.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= clientHeight &&
              visibleScenesPerCategory[category] < categorizedScenes[category].length) {
              loadMoreScenesForCategory(category);
            }
          }
        });
      }
    }, [displayedCategoriesCount, sortedCategoryKeys, displayedCategories, openSections,
      visibleScenesPerCategory, categorizedScenes, loadMoreScenesForCategory]);

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
      setDisplayedCategoriesCount(10);
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
                scrollEvents={true}
                color="tertiary"
                ref={contentRef}
                id="strips-container-ref"
                onIonScroll={handleScroll}
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