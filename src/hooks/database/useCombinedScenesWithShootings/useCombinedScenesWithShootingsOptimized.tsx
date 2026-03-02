import { useRxData } from "rxdb-hooks";
import { useMemo } from "react";
import { useParams } from "react-router";
import { ShootingDocType } from "../../../Shared/types/shooting.types";
import { SceneDocType } from "../../../Shared/types/scenes.types";

export type CombinedScenesWithShootings = ( SceneDocType & { shootingInfo: ShootingDocType | null })[];

interface UseCombinedScenesWithShootingsOptimizedProps {
  combinedData: CombinedScenesWithShootings;
  isFetching: boolean;
}

interface FilterOptions {
  searchText?: string;
  additionalFilters?: any; // Reserved for future use, currently not applied at DB level
}

/**
 * Optimized version of useCombinedScenesWithShootings that pushes SEARCH filtering into RxDB queries.
 * 
 * IMPORTANT: Only basic search is pushed to the database level.
 * Complex filters (nested arrays, accent removal, null matching) are still applied in JavaScript
 * using the applyFilters utility to maintain compatibility and correctness.
 * 
 * This approach balances performance with functionality:
 * - Search text filtering reduces initial dataset at DB level
 * - Complex filters work correctly in JS layer
 * - Still achieves significant performance gains for search scenarios
 */
function useCombinedScenesWithShootingsOptimized(options: FilterOptions = {}): UseCombinedScenesWithShootingsOptimizedProps {
  const {id: projectId} = useParams<{id: string}>();
  const { searchText = '' } = options;
  // Note: additionalFilters intentionally not used - complex filters need applyFilters utility

  // Build optimized RxDB query selector - filtering happens at database level
  const sceneSelector = useMemo(() => {
    const selector: any = {
      projectId: Number(projectId)
    };

    // Add search conditions directly to RxDB query if search text exists
    // This prevents loading all scenes into memory before filtering
    if (searchText && searchText.length > 0) {
      const searchRegex = searchText;
      selector.$or = [
        { locationName: { $regex: searchRegex, $options: 'i' } },
        { setName: { $regex: searchRegex, $options: 'i' } },
        { synopsis: { $regex: searchRegex, $options: 'i' } },
        { episodeNumber: { $regex: searchRegex, $options: 'i' } },
        { sceneNumber: { $regex: searchRegex, $options: 'i' } },
        { intOrExtOption: { $regex: searchRegex, $options: 'i' } },
        { dayOrNightOption: { $regex: searchRegex, $options: 'i' } },
        { episodeSceneNumber: { $regex: searchRegex, $options: 'i' } }
      ];
    }

    // NOTE: Complex filters are NOT applied at database level because:
    // 1. RxDB can't normalize accents (applyFilters uses removeAccents())
    // 2. RxDB can't handle nested array filters like characters/extras matching
    // 3. RxDB can't dynamically create fields (episodeSceneNumber is created in applyFilters)
    // 4. RxDB null matching is different from applyFilters null handling
    // 
    // Solution: Complex filters are applied in JS using applyFilters() in useScenesFilteringOptimized
    // This hybrid approach still gives performance gains for search while maintaining correctness

    return selector;
  }, [projectId, searchText]);

  // Optimized RxDB query with selector - results are pre-filtered by the database
  const {result: scenes, isFetching: isFetchingScenes} = useRxData<SceneDocType>('scenes', 
    (collection) => collection.find({
      selector: sceneSelector
    }));
    
  const {result: shootings, isFetching: isFetchingShootings} = useRxData<ShootingDocType>('shootings', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId)
      }
    }));
    
  // Combine scenes with shooting info - only for filtered results
  const combinedData = useMemo(() => {
    if (!scenes || !shootings) return [];
    
    return scenes.map(scene => {
      const relatedShooting = shootings.find(shooting => 
        shooting.scenes.some((s) => Number(s.sceneId) === scene.sceneId)
      );
      
      return {
        ...scene._data,
        shootingInfo: relatedShooting ? {
          projectId: relatedShooting.projectId,
          unitId: relatedShooting.unitId,
          scenes: relatedShooting.scenes,
          shootDate: relatedShooting.shootDate,
          status: relatedShooting.status
        } : null
      };
    });
  }, [scenes, shootings]);
  
  return {
    combinedData,
    isFetching: isFetchingScenes || isFetchingShootings
  };
}

export default useCombinedScenesWithShootingsOptimized;
