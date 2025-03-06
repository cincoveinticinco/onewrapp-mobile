import { useMemo } from 'react';
import { SceneDocType } from '../../../Shared/types/scenes.types';
import { GroupsSceneEnums } from '../../../pages/Scenes/Components/ExportModal/ExportModal';
import { ShootingDocType } from '../../../Shared/types/shooting.types';

export const useScenesGrouping = (
  filteredScenes: (SceneDocType & { shootingInfo: ShootingDocType | null })[],
  groupBy: string[]
) => {
  // Define no group by option
  const noGroupByOption = useMemo(() => ({
    value: 'NO_GROUP',
    label: 'NO GROUP',
  }), []);

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
          // Group scenes by shooting_date
          if (scene.shootingInfo && scene.shootingInfo.shootDate) {
            // Convert date to readable format or use existing format as category
            const shootingDate = new Date(scene.shootingInfo.shootDate);
            const formattedDate = shootingDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            // If the scene has shooting information, use the date as category
            addSceneToCategory(formattedDate, scene);
          } else {
            // If the scene has no shooting information, group it in a special category
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

  return {
    categorizedScenes,
    sortedCategoryKeys,
    noGroupByOption
  };
};

export default useScenesGrouping;