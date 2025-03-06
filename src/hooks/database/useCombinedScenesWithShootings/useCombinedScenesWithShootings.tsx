import { useRxData } from "rxdb-hooks";
import { useMemo } from "react";
import { useParams } from "react-router";
import { ShootingDocType } from "../../../Shared/types/shooting.types";
import { SceneDocType } from "../../../Shared/types/scenes.types";

export type CombinedScenesWithShootings = ( SceneDocType & { shootingInfo: ShootingDocType | null })[];

interface UseCombinedScenesWithShootingsProps {
  combinedData: CombinedScenesWithShootings;
  isFetching: boolean;
}

function useCombinedScenesWithShootings(): UseCombinedScenesWithShootingsProps {
  const {id: projectId} = useParams<{id: string}>();

  const {result: scenes, isFetching: isFetchingScenes} = useRxData<SceneDocType>('scenes', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId)
      }
    }));
    
  const {result: shootings, isFetching: isFetchingShootings} = useRxData<ShootingDocType>('shootings', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId)
      }
    }));
    
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

export default useCombinedScenesWithShootings;