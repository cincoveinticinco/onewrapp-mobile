import React, { useState, useEffect, useCallback } from 'react';
import { 
  IonGrid, 
  IonContent, 
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  IonButton
} from '@ionic/react';
import { PermisionTypes } from '../../../../Shared/Components/navigation/ProtectedRoute/ProtectedRoute';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import ScenesTotals from '../ScenesTotals/ScenesTotals';
import SceneCard from '../../../../Shared/Components/cards/SceneCard/SceneCard';
import { Section } from '../../../../Shared/Components/organizers/Section/Section';
import NoScenesMessage from '../NoScenesMessage/NoScenesMessage';

interface GroupedScenesListProps {
  categorizedScenes: { [key: string]: SceneDocType[] };
  sortedCategoryKeys: string[];
  searchText: string;
  permissionType: PermisionTypes | null;
  selectedFilterOptions: any;
  setSelectedFilterOptions: (options: any) => void;
}

const GroupedScenesList: React.FC<GroupedScenesListProps> = ({
  categorizedScenes,
  sortedCategoryKeys,
  searchText,
  permissionType,
  selectedFilterOptions,
  setSelectedFilterOptions
}) => {
  const [displayedCategoriesCount, setDisplayedCategoriesCount] = useState<number>(10);
  const [visibleScenesPerCategory, setVisibleScenesPerCategory] = useState<{ [key: string]: number }>({});
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [isInfiniteDisabled, setInfiniteDisabled] = useState<boolean>(false);

  useEffect(() => {
    const initialVisibleScenes: { [key: string]: number } = {};
    const initialOpenSections: { [key: string]: boolean } = {};
    
    sortedCategoryKeys.forEach(category => {
      initialVisibleScenes[category] = 30;
      initialOpenSections[category] = true;
    });
    
    setVisibleScenesPerCategory(initialVisibleScenes);
    setOpenSections(initialOpenSections);
  }, [sortedCategoryKeys]);


  const loadMoreScenesForCategory = useCallback((category: string) => {
    if (!categorizedScenes[category]) {
      return;
    }
    
    const totalInCategory = categorizedScenes[category].length;
    
    setVisibleScenesPerCategory(prev => {
      const currentCount = prev[category] || 10;
      const newCount = Math.min(currentCount + 10, totalInCategory);
      
      return {
        ...prev,
        [category]: newCount
      };
    });
  }, [categorizedScenes]);

  const toggleSectionVisibility = useCallback((category: string) => {
    console.log('TOGGLE SECTION VISIBILITY ',  category);
    setOpenSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const handleInfiniteScroll = useCallback((event: CustomEvent<void>) => {
    const nextCategoriesCount = Math.min(displayedCategoriesCount + 5, sortedCategoryKeys.length);
    setDisplayedCategoriesCount(nextCategoriesCount);

    setTimeout(() => {
      (event.target as HTMLIonInfiniteScrollElement).complete();

      if (nextCategoriesCount >= sortedCategoryKeys.length) {
        setInfiniteDisabled(true);
      }
    }, 500);
  }, [displayedCategoriesCount, sortedCategoryKeys.length]);

  if (Object.keys(categorizedScenes).length === 0) {
    return (
      <NoScenesMessage
        hasFilters={Object.keys(selectedFilterOptions).length > 0}
        resetFilters={() => setSelectedFilterOptions({})}
      />
    );
  }

  const hasMoreScenes = (category: string) => {
    const totalScenes = categorizedScenes[category]?.length || 0;
    const visibleScenes = visibleScenesPerCategory[category] || 0;
    return visibleScenes < totalScenes;
  };

  return (
    <IonContent>
      {sortedCategoryKeys.slice(0, displayedCategoriesCount).map((category) => (
        (visibleScenesPerCategory[category] > 0 && categorizedScenes[category]?.length > 0) && (
          <Section
            title={category}
            key={category}
            open={openSections[category]}
            setOpen={() => toggleSectionVisibility(category)}
            color='light'
          >
            <IonGrid className="scenes-grid sectioned-grid ion-margin">
              {categorizedScenes[category]
                ?.slice(0, visibleScenesPerCategory[category])
                .map((scene: SceneDocType) => (
                  <SceneCard
                    key={`scene-item-${scene?.id}`}
                    scene={scene as any}
                    searchText={searchText}
                    permissionType={permissionType}
                  />
                ))}
              {hasMoreScenes(category) && (
                <div className="ion-text-center ion-padding">
                  <IonButton 
                    onClick={() => loadMoreScenesForCategory(category)}
                    fill="outline"
                    size="small"
                  >
                    LOAD MORE
                  </IonButton>
                </div>
              )}
            </IonGrid>
            
            <ScenesTotals scenes={categorizedScenes[category]} isSection />
          </Section>
        )
      ))}

      {/* Scroll Infinito principal para cargar más categorías */}
      <IonInfiniteScroll
        onIonInfinite={handleInfiniteScroll}
        threshold="100px"
        disabled={isInfiniteDisabled}
      >
        <IonInfiniteScrollContent
          loadingSpinner="crescent"
          loadingText="LOADING..."
        />
      </IonInfiniteScroll>
    </IonContent>
  );
};

export default GroupedScenesList;