import React, { useState, useEffect, useCallback } from 'react';
import { IonGrid, IonSpinner } from '@ionic/react';
import { PermisionTypes } from '../../../../Shared/Components/ProtectedRoute/ProtectedRoute';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import ScenesTotals from '../ScenesTotals/ScenesTotals';
import SceneCard from '../SceneCard/SceneCard';
import { Section } from '../../../../Shared/Components/Section/Section';
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
  const [displayedCategories, setDisplayedCategories] = useState<string[]>([]);
  const [displayedCategoriesCount, setDisplayedCategoriesCount] = useState<number>(10);
  const [visibleScenesPerCategory, setVisibleScenesPerCategory] = useState<{ [key: string]: number }>({});
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  // Update displayed categories when category count changes or categories change
  useEffect(() => {
    setDisplayedCategories(sortedCategoryKeys.slice(0, displayedCategoriesCount));
  }, [sortedCategoryKeys, displayedCategoriesCount]);

  // Initialize visibility states when categories change
  useEffect(() => {
    const initialVisibleScenes: { [key: string]: number } = {};
    const initialOpenSections: { [key: string]: boolean } = {};

    sortedCategoryKeys.forEach(category => {
      initialVisibleScenes[category] = 10; // Initially show 10 scenes per category
      initialOpenSections[category] = true; // Initially all sections are open
    });

    setVisibleScenesPerCategory(initialVisibleScenes);
    setOpenSections(initialOpenSections);
  }, [sortedCategoryKeys]);

  // Function to load more scenes for a specific category
  const loadMoreScenesForCategory = useCallback((category: string) => {
    setVisibleScenesPerCategory(prev => ({
      ...prev,
      [category]: Math.min(
        (prev[category] || 10) + 10,
        categorizedScenes[category]?.length || 0
      )
    }));
  }, [categorizedScenes]);

  // Function to toggle section visibility
  const toggleSectionVisibility = useCallback((category: string) => {
    setOpenSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  // Function to load more categories
  const loadMoreCategories = useCallback(() => {
    if (displayedCategoriesCount < sortedCategoryKeys.length) {
      setDisplayedCategoriesCount(prev => Math.min(prev + 5, sortedCategoryKeys.length));
    }
  }, [displayedCategoriesCount, sortedCategoryKeys.length]);

  // Check if there are any scenes in any category
  const hasScenes = Object.keys(categorizedScenes).length > 0;

  if (!hasScenes) {
    return (
      <NoScenesMessage
        hasFilters={Object.keys(selectedFilterOptions).length > 0}
        resetFilters={() => setSelectedFilterOptions({})}
      />
    );
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
            <IonGrid className="scenes-grid sectioned-grid ion-margin" id={`category-content-${category}`}>
              {categorizedScenes[category]?.slice(0, visibleScenesPerCategory[category] || 10).map((scene, i) => (
                <SceneCard
                  key={`scene-item-${scene.id}-${i}`}
                  scene={scene as any}
                  searchText={searchText}
                  permissionType={permissionType}
                />
              ))}
              
              {visibleScenesPerCategory[category] < categorizedScenes[category]?.length && (
                <div className="ion-text-center ion-padding loading-indicator">
                  <IonSpinner name="crescent" />
                </div>
              )}
            </IonGrid>
            <ScenesTotals scenes={categorizedScenes[category]} isSection />
          </Section>
        )
      ))}
      
      {displayedCategories.length < sortedCategoryKeys.length && (
        <div className="ion-text-center ion-padding loading-indicator">
          <IonSpinner name="crescent" onClick={loadMoreCategories} />
        </div>
      )}
    </>
  );
};

export default GroupedScenesList;