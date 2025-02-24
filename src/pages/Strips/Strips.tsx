import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
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
import { useHistory, useLocation } from 'react-router';
import InputSortModal from '../../Shared/Components/InputSortModal/InputSortModal';
import SceneCard from './Components/SceneCard/SceneCard';
import StripTagsToolbar from './Components/StripTagsToolbar/StripTagsToolbar';
import DatabaseContext from '../../context/Database/Database.context';
import ScenesContext, { defaultSortOptions } from '../../context/Scenes/Scenes.context';
import ScrollInfiniteContext from '../../context/ScrollInfinite/ScrollInfinite.context';
import useHideTabs from '../../Shared/hooks/useHideTabs';
import useScrollToTop from '../../Shared/hooks/useScrollToTop';
import { SceneDocType } from '../../Shared/types/scenes.types';
import { SecurePages } from '../../Shared/types/securePages.types';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import applyFilters from '../../Shared/Utils/applyFilters';
import sortByCriterias from '../../Shared/Utils/SortScenesUtils/sortByCriterias';
import './Strips.scss';
import { DatabaseContextProps } from '../../context/Database/types/Database.types';
import ScenesTotals from './Components/ScenesTotals/ScenesTotals';
import ExportButton from './Components/ExportButton/ExportButton';
import SelectionModal from '../../Layouts/SelectionModal/SelectionModal';
import { groupsByOptions, GroupsSceneEnums } from './Components/ExportModal/ExportModal';
import { Section } from '../../Shared/Components/Section/Section';
import useCombinedScenesWithShootings from '../../hooks/useCombinedScenesWithShootings/useCombinedScenesWithShootings';
import { settingsOutline } from 'ionicons/icons';
import { ShootingDocType } from '../../Shared/types/shooting.types';
import AppLoader from '../../Shared/hooks/AppLoader';

const Strips: React.FC<{
  permissionType: SecurePages | null;
}> = ({
  permissionType,
}) => {
    const {
      projectId,
      initialReplicationFinished,
      isOnline
    } = useContext<DatabaseContextProps>(DatabaseContext);
    const {
      selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions, setSelectedSortOptions,
    } = useContext<any>(ScenesContext);
    const noGroupByOption = {
      value: 'NO_GROUP',
      label: 'NO GROUP',
    }

    const contentRef = useRef<HTMLIonContentElement>(null);

    const [searchText, setSearchText] = useState('');
    const [openGroupBy, setOpenGroupBy] = useState(false);
    const history = useHistory();
    const location = useLocation();
    useScrollToTop(contentRef, location);
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
    ]

    const { combinedData: offlineScenes, isFetching: scenesAreLoading } = useCombinedScenesWithShootings();


    const [renderScenes, setRenderScenes] = useState<boolean>(false);
    const [replicatorCreated, setReplicatorCreated] = useState<boolean>(false);
    const [displayedScenes, setDisplayedScenes] = useState<SceneDocType[]>([]);
    const [displayedCategories, setDisplayedCategories] = useState<string[]>([]);
    const [displayedCategoriesCount, setDisplayedCategoriesCount] = useState<number>(10);
    const [groupBy, setGroupBy] = useState<string[]>([noGroupByOption.value]);
    const [visibleScenesPerCategory, setVisibleScenesPerCategory] = useState<{ [key: string]: number }>({});
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
    const [sortPosibilities, setSortPosibilities] = useState<any[]>(() => {
      const savedOrder = localStorage.getItem('sortPosibilitiesOrder');
      if (savedOrder) {
        return JSON.parse(savedOrder);
      }
      return defaultSortPosibilitiesOrder;
    });

    useEffect(() => {
      setRenderScenes(initialReplicationFinished);
    }, [initialReplicationFinished]);

    useIonViewDidEnter(() => {
      toggleTabs.showTabs();
      if (!replicatorCreated && navigator.onLine) {
        setReplicatorCreated(true);
      }
    });

    const memoizedApplyFilters = useCallback((data: any, options: any) => applyFilters(data, options), []);

    // Memoize filteredScenes to avoid unnecessary recalculations
    const filteredScenes = useMemo(() => {
      const filteredData = Object.keys(selectedFilterOptions).length === 0 && offlineScenes ? offlineScenes : memoizedApplyFilters(offlineScenes, selectedFilterOptions);
      if (filteredData && offlineScenes) {
        return sortByCriterias(filteredData, selectedSortOptions);
      }
      return [];
    }, [offlineScenes, selectedFilterOptions, selectedSortOptions, memoizedApplyFilters, projectId, renderScenes]);

    // Memoize categorized scenes to avoid recalculation on every render
    const categorizedScenes = useMemo(() => {
      const result: { [key: string]: SceneDocType[] } = {};

      if (groupBy[0] === noGroupByOption.value) {
        return result; // Return empty object for no grouping
      }

      // Helper function to safely add scene to a category
      const addSceneToCategory = (category: string | null | undefined, scene: SceneDocType) => {
        const safeCategory = category || `NO ${groupBy[0].replace('_', ' ')}`;
        if (!result[safeCategory]) {
          result[safeCategory] = [];
        }
        result[safeCategory].push(scene);
      };

      filteredScenes.forEach((scene: SceneDocType & { shootingInfo: ShootingDocType | null }) => {
        switch (groupBy[0]) {
          case GroupsSceneEnums.LOCATION:
            addSceneToCategory(scene.locationName, scene);
            break;

          case GroupsSceneEnums.SET:
            addSceneToCategory(scene.setName, scene);
            break;

          case GroupsSceneEnums.EPISODE:
            addSceneToCategory(scene.episodeNumber, scene);
            break;

          case GroupsSceneEnums.SCRIPT_DAY:
            addSceneToCategory(scene.scriptDay, scene);
            break;

          case GroupsSceneEnums.YEAR:
            addSceneToCategory(scene.year, scene);
            break;

          case GroupsSceneEnums.INT_EXT_DETAIL:
            addSceneToCategory(scene.intOrExtOption, scene);
            break;

          case GroupsSceneEnums.SHOOTING_PLAN:
            // Agrupar las escenas por shooting_date
            if (scene.shootingInfo && scene.shootingInfo.shootDate) {
              // Convertir fecha a formato legible o usar el formato existente como categoría
              const shootingDate = new Date(scene.shootingInfo.shootDate);
              const formattedDate = shootingDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              // Si la escena tiene información de shooting, usar la fecha como categoría
              addSceneToCategory(formattedDate, scene);
            } else {
              // Si la escena no tiene información de shooting, agruparla en una categoría especial
              addSceneToCategory('No Shooting Date', scene);
            }
            break;

          default:
            addSceneToCategory('Other', scene);
            break;
        }
      });

      // Sort the categories alphabetically for consistent display
      const sortedResult: { [key: string]: SceneDocType[] } = {};
      Object.keys(result).sort().forEach(key => {
        sortedResult[key] = result[key];
      });

      return sortedResult;
    }, [filteredScenes, groupBy, noGroupByOption.value]);

    // Get sorted category keys for infinite scrolling
    const sortedCategoryKeys = useMemo(() => {
      return Object.keys(categorizedScenes).sort();
    }, [categorizedScenes]);

    // Update displayed categories when category count changes or categories change
    useEffect(() => {
      setDisplayedCategories(sortedCategoryKeys.slice(0, displayedCategoriesCount));
    }, [sortedCategoryKeys, displayedCategoriesCount]);

    // Inicializa los estados de visibilidad cuando cambien las categorías
    useEffect(() => {
      const initialVisibleScenes: { [key: string]: number } = {};
      const initialOpenSections: { [key: string]: boolean } = {};

      sortedCategoryKeys.forEach(category => {
        initialVisibleScenes[category] = 10; // Inicialmente muestra 10 escenas por categoría
        initialOpenSections[category] = true; // Inicialmente todas las secciones están abiertas
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

    // Función para alternar la visibilidad de una sección
    const toggleSectionVisibility = useCallback((category: string) => {
      setOpenSections(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }, []);

    // Handle scroll event for infinite loading of categories and scenes within categories
    const handleScroll = useCallback((event: CustomEvent) => {
      const scrollElement = event.target as HTMLIonContentElement;
      const scrollPosition = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      // Si estamos cerca del final y hay más categorías para cargar
      if (scrollPosition + clientHeight >= scrollHeight - 200) {
        // Cargar más categorías si es necesario
        if (displayedCategoriesCount < sortedCategoryKeys.length) {
          setDisplayedCategoriesCount(prev => Math.min(prev + 5, sortedCategoryKeys.length));
        }

        // Verificar cada categoría visible para ver si necesitamos cargar más escenas
        displayedCategories.forEach(category => {
          const categoryElement = document.getElementById(`category-content-${category}`);
          if (categoryElement && openSections[category]) {
            const rect = categoryElement.getBoundingClientRect();
            // Si la categoría está visible y hay más escenas para cargar
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
      // Only update displayedScenes when groupBy is 'NO_GROUP'
      if (groupBy[0] === noGroupByOption.value) {
        const newFilteredScenes = sortByCriterias(filteredScenes, selectedSortOptions);
        setDisplayedScenes(newFilteredScenes.slice(0, 20));
      }

      // Reset category count when grouping changes
      setDisplayedCategoriesCount(10);
    }, [filteredScenes, selectedSortOptions, groupBy, noGroupByOption.value]);

    const handleBack = () => history.push('/my/projects');

    const clearSortSelections = () => {
      localStorage.removeItem('selectedSortOptions');
      setSortPosibilities(defaultSortPosibilitiesOrder);
      setSelectedSortOptions(defaultSortOptions);
    };

    useEffect(() => {
      localStorage.setItem('sortPosibilitiesOrder', JSON.stringify(sortPosibilities));
    }, [sortPosibilities]);

    const GroupByButton = useCallback(() => {
      return (
        <IonButton fill="clear" color='light' className='ion-no-padding reset-filters-option' slot="end" onClick={() => setOpenGroupBy(true)} style={!isOnline ? { marginRight: '10px' } : {}}>
          <IonIcon slot="icon-only" icon={settingsOutline} />
        </IonButton>
      )
    }, []);

    const NoScenesMessage = useCallback(() => {
      if (Object.keys(selectedFilterOptions).length > 0) {
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

      return (
        <div className="no-items-message">
          <p className="ion-no-margin">There are not any scenes in this project. </p>
        </div>
      );
    }, [selectedFilterOptions, setSelectedFilterOptions]);

    // Memoized scene cards renderer to avoid recreating on every render
    const SceneCards = useCallback(({ scenes }: { scenes: SceneDocType[] }) => {
      return (
        <>
          {scenes.map((scene, i) => (
            <SceneCard
              key={`scene-item-${scene.id}-${i}`}
              scene={scene as any}
              searchText={searchText}
              permissionType={permissionType}
            />
          ))}
        </>
      );
    }, [searchText, permissionType]);

    // Render non-categorized content (no grouping)
    const renderStandardContent = useMemo(() => {
      if (filteredScenes.length === 0) {
        return <NoScenesMessage />;
      }

      return (
        <IonGrid className="scenes-grid ion-margin">
          <ScrollInfiniteContext setDisplayedData={setDisplayedScenes} filteredData={filteredScenes} batchSize={20}>
            <SceneCards scenes={displayedScenes} />
          </ScrollInfiniteContext>
        </IonGrid>
      );
    }, [filteredScenes, displayedScenes, SceneCards, NoScenesMessage]);

    // Render content based on categories with infinite scrolling for categories
    const renderCategorizedContent = useMemo(() => {
      if (Object.keys(categorizedScenes).length === 0) {
        return <NoScenesMessage />;
      }

      return (
        <>
          {displayedCategories.map((category) => (
            visibleScenesPerCategory[category] > 0 && categorizedScenes[category]?.length > 0 && (
              <Section
                title={category}
                key={category}
                open={openSections[category] || false}
                setOpen={() => toggleSectionVisibility(category)}
              >
                <IonGrid className="scenes-grid ion-margin" id={`category-content-${category}`} style={{ maxHeight: '80vh' }}>
                  <SceneCards scenes={categorizedScenes[category]?.slice(0, visibleScenesPerCategory[category] || 10)} />
                  {visibleScenesPerCategory[category] < categorizedScenes[category]?.length && (
                    <div className="ion-text-center ion-padding loading-indicator">
                      <IonSpinner name="crescent" />
                    </div>
                  )}
                </IonGrid>
              </Section>
            )
          ))}
          {displayedCategories.length < sortedCategoryKeys.length && (
            <div className="ion-text-center ion-padding loading-indicator">
              <IonSpinner name="crescent" />
            </div>
          )}
        </>
      );
    }, [
      categorizedScenes,
      displayedCategories,
      sortedCategoryKeys,
      NoScenesMessage,
      SceneCards,
      visibleScenesPerCategory,
      openSections,
      toggleSectionVisibility
    ]);

    const handleCheckGroup = useCallback((label: string) => {
      const selectedOption = groupsByOptions.find((option) => option.label === label);
      if (selectedOption) {
        setGroupBy([selectedOption.value]);
      } else if (label === noGroupByOption.label) {
        setGroupBy([noGroupByOption.value]);
      }

      // Reset category count when changing grouping
      setDisplayedCategoriesCount(10);
    }, [noGroupByOption]);

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
          customButtons={[GroupByButton, ExportButton]}
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
                <ScenesTotals scenes={filteredScenes} />
                <StripTagsToolbar />
                <Suspense>
                  {groupBy[0] === noGroupByOption.value ? renderStandardContent : renderCategorizedContent}
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

export default Strips;