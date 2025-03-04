import { useMemo } from "react";

import { useRxData } from "rxdb-hooks";
import { StripboardDocType, StripboardHasScene } from "../../Shared/types/stripboard.types";
import { SceneDocType } from "../../Shared/types/scenes.types";
import { StripboardStatusesEnum } from "../../Shared/ennums/ennums";

interface UseStripboardsProps {
  projectId: string;
}

type CombinedStripboardType = StripboardDocType & {
  scenes: SceneDocType[];
};

const getNumberOfWeeks = (startDate: string, stripboardHasScenes: StripboardHasScene ) => {
  const maxDayNumber = stripboardHasScenes.reduce((acc: number, scene: any) => {
    return scene.dayNumber > acc ? scene.dayNumber : acc;
  }, 0)

  const start = new Date(startDate);
  // sum the max day number to the start date
  start.setDate(start.getDate() + maxDayNumber);
  // get the number of weeks
  return Math.ceil(maxDayNumber / 7);
}

const getNumberOfDays = ( stripboardHasScenes: StripboardHasScene ) => {
  const uniqueDays = stripboardHasScenes.reduce((acc: number[], scene: any) => {
    if (!acc.includes(scene.dayNumber)) {
      return [...acc, scene.dayNumber];
    }
    return acc;
  }
  , []);

  return uniqueDays.length;
}

const getTotalShootingDays = (stripboardHasScenes: StripboardHasScene) => {
  const uniqueUnitsDayNumberCombination = stripboardHasScenes.reduce((acc: string[], scene: any) => {
    const key = `${scene.projUnitId}-${scene.dayNumber}`;
    if (!acc.includes(key)) {
      return [...acc, key];
    }
    return acc;
  }
  , []);

  return uniqueUnitsDayNumberCombination.length;
}


const useStripboards = ({ projectId }: UseStripboardsProps) => {
  const { result: stripboards, isFetching: isStripboardsFetching } = useRxData<StripboardDocType>(
    'stripboards', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    })
  );

  const scenesIds = useMemo(() => {
    if (!stripboards || isStripboardsFetching) return [];
    
    return stripboards.reduce((acc: string[], stripboard) => {
      const ids = stripboard?._data?.stripboardHasScenes?.map(
        (scene: any) => scene.sceneId
      ) || [];
      return [...acc, ...ids];
    }, []);
  }, [stripboards, isStripboardsFetching]);

  const { result: scenes, isFetching: isScenesFetching } = useRxData<SceneDocType>(
    'scenes',
    (collection) => collection.find({
      selector: {
        sceneId: { $in: scenesIds.length ? scenesIds : ['none'] }
      }
    })
  );

  const combinedStripboards = useMemo<CombinedStripboardType[]>(() => {
    if (!stripboards || !scenes || isStripboardsFetching || isScenesFetching) {
      return [];
    }

    return stripboards.map((stripboard) => {
      const stripboardScenes = scenes.filter((scene) => 
        stripboard?._data?.stripboardHasScenes?.some(
          (stripboardScene) => stripboardScene.sceneId === scene.sceneId
        )
      );

      return {
        ...stripboard._data,
        scenes: stripboardScenes.map(s => s._data),
        totalWeeks: getNumberOfWeeks(stripboard.startDate || '', stripboard.stripboardHasScenes || []),
        totalScenes: stripboard?.stripboardHasScenes?.length || 0,
        totalDays: getNumberOfDays(stripboard.stripboardHasScenes || []),
        totalShootingDays: getTotalShootingDays(stripboard.stripboardHasScenes || []),
        statusString: stripboard.statusId === StripboardStatusesEnum.New ? 'New' : 'Published',
      };
    });
  }, [stripboards, scenes, isStripboardsFetching, isScenesFetching]);

  return { 
    stripboards: combinedStripboards, 
    isFetching: isStripboardsFetching || isScenesFetching 
  };
};

export default useStripboards;