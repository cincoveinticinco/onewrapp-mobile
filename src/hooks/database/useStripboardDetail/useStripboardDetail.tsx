import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRxData, useRxDB } from 'rxdb-hooks';
import { StripboardDocType } from '../../../Shared/types/stripboard.types';
import { SceneDocType } from '../../../Shared/types/scenes.types';
import { UnitDocType } from '../../../Shared/types/unitTypes.types';
import { StripboardStatusesEnum } from '../../../Shared/enums/ennums';
import { 
  getNumberOfDays, 
  getNumberOfWeeks, 
  getStripboardWeeks, 
  getTotalShootingDays 
} from '../../../Shared/Utils/StripboardCalculations';
import applyFilters from '../../../Shared/Utils/applyFilters';

interface UseStripboardDetailProps {
  stripboardId: string | null;
  projectId: string;
}

const useStripboardDetail = ({ stripboardId, projectId }: UseStripboardDetailProps) => {
  const database = useRxDB();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStripboard, setCurrentStripboard] = useState<StripboardDocType | null>(null);
  const [firstFetching, setFirstFetching] = useState(true);
  
  // Search and filtering states
  const [searchText, setSearchText] = useState('');
  const [filterOptions, setFilterOptions] = useState<any>({
    $or: {
      characters: [{ characterName: [] }],
      extras: [{ extraName: [] }],
      locationName: [],
      setName: [],
      synopsis: [],
      episodeNumber: [],
      sceneNumber: [],
      intOrExtOption: [],
      dayOrNightOption: [],
      episodeSceneNumber: [],
    }
  });
  const [filteredScenesNotIncluded, setFilteredScenesNotIncluded] = useState<SceneDocType[]>([]);

  // Fetch stripboard
  const { result: stripboard, isFetching: isStripboardFetching } = useRxData<StripboardDocType>(
    'stripboards',
    (collection) => collection.findOne({
      selector: {
        id: stripboardId || 'none',
        projectId: Number(projectId)
      }
    })
  );

  // Update filter options when search text changes
  useEffect(() => {
    const newFilterOptions = {
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

    setFilterOptions(newFilterOptions);
  }, [searchText]);

  // Update current stripboard from DB
  useEffect(() => {
    if (stripboard?.length) {
      setCurrentStripboard(stripboard[0]._data);
      setFirstFetching(false);
    }
  }, [stripboard]);

  // Extract scene IDs from current stripboard
  const sceneIds = useMemo(() => {
    if (!currentStripboard || isStripboardFetching) return [];
    return currentStripboard.stripboardHasScenes?.map((scene: any) => scene.sceneId) || [];
  }, [currentStripboard, isStripboardFetching]);

  // Fetch units for this project
  const { result: units } = useRxData<UnitDocType>(
    'units',
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    }),
  );

  // Fetch scenes included in stripboard
  const { result: scenes } = useRxData<SceneDocType>(
    'scenes',
    (collection) => collection.find({
      selector: {
        sceneId: { $in: sceneIds?.length ? sceneIds : ['none'] }
      }
    })
  );

  // Fetch scenes not included in stripboard
  const { result: scenesNotIncluded } = useRxData<SceneDocType>(
    'scenes', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
        sceneId: { $nin: sceneIds?.length ? sceneIds : ['none'] }
      }
    })
  );

  // Filter scenes not included in stripboard
  useEffect(() => {
    if (!scenesNotIncluded) return;

    const filteredScenes = searchText === '' 
      ? scenesNotIncluded.map(s => s._data)  
      : applyFilters(structuredClone(scenesNotIncluded.map(s => s._data)), filterOptions);

    setFilteredScenesNotIncluded(filteredScenes);
  }, [scenesNotIncluded, searchText, filterOptions]);

  // Update stripboard scenes with proper reordering
  const updateStripboardHasScenes = useCallback(async (
    sceneId: string | number, 
    dayNumber: number, 
    unitId: number, 
    order: number
  ) => {
    if (!currentStripboard || !stripboardId) return;

    try {
      const stripboardCollection = database.collections.stripboards;
      const stripboardDocument = await stripboardCollection
        .findOne({
          selector: { 
            id: stripboardId,
            projectId: Number(projectId)
          }
        })
        .exec();

      if (!stripboardDocument) return;

      // Create a copy of the current stripboard scenes
      const currentScenes = [...(stripboardDocument.stripboardHasScenes || [])];

      // Remove the scene if it already exists
      const filteredScenes = currentScenes.filter(s => s.sceneId !== Number(sceneId));

      // Add the new scene at the specified order
      const newScene = {
        sceneId: Number(sceneId),
        projUnitId: unitId,
        dayNumber,
        order: order
      };

      // Insert the new scene
      filteredScenes.splice(order, 0, newScene);

      // Reorder all scenes
      const reorderedScenes = filteredScenes.map((scene, index) => ({
        ...scene,
        order: index
      }));

      // Optimistically update local state to prevent unnecessary loading
      setCurrentStripboard((prev: any) => ({
        ...(prev || {}),
        stripboardHasScenes: reorderedScenes
      }));

      // Update the document in the database
      await stripboardDocument.update({
        $set: {
          stripboardHasScenes: reorderedScenes
        }
      });

    } catch (error) {
      console.error('Error updating stripboard scenes:', error);
    }
  }, [currentStripboard, stripboardId, projectId, database]);

  const deleteStripboardHasScene = useCallback(async (sceneId: number) => {
    if (!stripboardId) return console.error('Stripboard document not found', currentStripboard, stripboardId);

    try {
      const stripboardCollection = database.collections.stripboards;
      const stripboardDocument = await stripboardCollection
        .findOne({
          selector: { 
            id: stripboardId,
            projectId: Number(projectId)
          }
        })
        .exec();

      if (!stripboardDocument) return console.error('Stripboard document not found');

      // Create a copy of the current stripboard scenes
      const currentScenes = [...(stripboardDocument.stripboardHasScenes || [])];

      // Remove the scene if it already exists
      const filteredScenes = currentScenes.filter(s => s.sceneId !== Number(sceneId));

      // Optimistically update local state to prevent unnecessary loading
      setCurrentStripboard((prev: any) => ({
        ...(prev || {}),
        stripboardHasScenes: filteredScenes
      }));

      // Update the document in the database
      await stripboardDocument.update({
        $set: {
          stripboardHasScenes: filteredScenes
        }
      });
      
      console.log('Scene removed from stripboard:', sceneId);
    } catch (error) {
      console.error('Error updating stripboard scenes:', error);
    }
  }, []);

  // Compute detailed stripboard with minimal dependencies
  const detailedStripboard = useMemo(() => {
    if (!currentStripboard) return null;

    const stripboardHasScenes = currentStripboard.stripboardHasScenes || [];
    const startDate = currentStripboard.startDate || '';

    const weeks = getStripboardWeeks(
      stripboardHasScenes,
      startDate,
      scenes?.map(s => s._data) || [],
      units?.map(u => u._data) || []
    );

    return {
      ...currentStripboard,
      scenes: scenes?.map(s => s._data) || [],
      scenesNotIncluded: filteredScenesNotIncluded || [],
      totalWeeks: getNumberOfWeeks(startDate, stripboardHasScenes),
      totalScenes: stripboardHasScenes?.length || 0,
      totalDays: getNumberOfDays(stripboardHasScenes),
      totalShootingDays: getTotalShootingDays(stripboardHasScenes),
      statusString: currentStripboard.statusId === StripboardStatusesEnum.New ? 'New' : 'Published',
      weeks: weeks,
    };
  }, [currentStripboard, scenes, units, scenesNotIncluded, filteredScenesNotIncluded]);

  // Simplified loading state
  useEffect(() => {
    setIsLoading(firstFetching);
  }, [firstFetching]);

  return {
    stripboard: detailedStripboard,
    stripboardEditingCopy: currentStripboard,
    isLoading,
    updateStripboardHasScenes,
    deleteStripboardHasScene,
    searchText,
    setSearchText
  };
};

export default useStripboardDetail;