import { useState, useEffect, useMemo } from 'react';
import { useRxData, useRxDB } from 'rxdb-hooks';
import { StripboardDocType } from '../../../Shared/types/stripboard.types';
import { SceneDocType } from '../../../Shared/types/scenes.types';
import { UnitDocType } from '../../../Shared/types/unitTypes.types';
import { StripboardStatusesEnum } from '../../../Shared/enums/ennums';
import { getNumberOfDays, getNumberOfWeeks, getStripboardWeeks, getTotalShootingDays } from '../../../Shared/Utils/StripboardCalculations';

interface UseStripboardDetailProps {
  stripboardId: string | null;
  projectId: string;
}

const useStripboardDetail = ({ stripboardId, projectId }: UseStripboardDetailProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStripboard, setCurrentStripboard] = useState<StripboardDocType | null>(null);

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

  // Update current stripboard from DB, but only update copy if not editing
  useEffect(() => {
    if (stripboard?.length) {
      setCurrentStripboard(stripboard[0]._data);
    } else {
      setCurrentStripboard(null);
    }
  }, [stripboard]);

  // Extract scene IDs from current stripboard (not copy)
  const sceneIds = useMemo(() => {
    if (!currentStripboard || isStripboardFetching) return [];
    return currentStripboard.stripboardHasScenes?.map((scene: any) => scene.sceneId) || [];
  }, [currentStripboard, isStripboardFetching]);

  // Fetch units for this project
  const { result: units, isFetching: isUnitsFetching } = useRxData<UnitDocType>(
    'units',
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    })
  );

  // Fetch scenes included in stripboard
  const { result: scenes, isFetching: isScenesFetching } = useRxData<SceneDocType>(
    'scenes',
    (collection) => collection.find({
      selector: {
        sceneId: { $in: sceneIds.length ? sceneIds : ['none'] }
      }
    })
  );

  const updateStripboardHasScenes = (scenes: SceneDocType[], dayNumber: number, unitId: number) => {
    console.log(scenes)
  };

  // Fetch scenes not included in stripboard
  const { result: scenesNotIncluded, isFetching: isScenesNotIncludedFetching,  } = useRxData<SceneDocType>(
    'scenes', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
        sceneId: { $nin: sceneIds.length ? sceneIds : ['none'] }
      }
    })
  );

  // Compute detailed stripboard using currentStripboard para cálculos
  const detailedStripboard = useMemo(() => {
    if (!currentStripboard || !scenes || !units || !scenesNotIncluded ||
        isStripboardFetching || isScenesFetching || isUnitsFetching || isScenesNotIncludedFetching) {
      return null;
    }

    const stripboardHasScenes = currentStripboard.stripboardHasScenes || [];
    const startDate = currentStripboard.startDate || '';

    const weeks = getStripboardWeeks(
      stripboardHasScenes,
      startDate,
      scenes.map(s => s._data),
      units.map(u => u._data)
    );

    return {
      ...currentStripboard,
      scenes: scenes.map(s => s._data),
      scenesNotIncluded: scenesNotIncluded.map(s => s._data) || [],
      totalWeeks: getNumberOfWeeks(startDate, stripboardHasScenes),
      totalScenes: stripboardHasScenes.length || 0,
      totalDays: getNumberOfDays(stripboardHasScenes),
      totalShootingDays: getTotalShootingDays(stripboardHasScenes),
      statusString: currentStripboard.statusId === StripboardStatusesEnum.New ? 'New' : 'Published',
      weeks: weeks,
    };
  }, [currentStripboard, scenes, units, scenesNotIncluded, isStripboardFetching, isScenesFetching, isUnitsFetching, isScenesNotIncludedFetching]);

  useEffect(() => {
    setIsLoading(
      isStripboardFetching ||
      isScenesFetching ||
      isUnitsFetching ||
      isScenesNotIncludedFetching
    );
  }, [isStripboardFetching, isScenesFetching, isUnitsFetching, isScenesNotIncludedFetching]);

  return {
    stripboard: detailedStripboard,
    stripboardEditingCopy: currentStripboard,
    isLoading,
    updateStripboardHasScenes
  };
};

export default useStripboardDetail;