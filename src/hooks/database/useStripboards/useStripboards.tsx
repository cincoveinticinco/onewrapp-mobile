// hooks/database/useStripboards/useStripboards.ts
import { useEffect, useMemo, useState } from "react";
import { useRxData } from "rxdb-hooks";
import { StripboardDocType, StripboardHasScene } from "../../../Shared/types/stripboard.types";
import { StripboardStatusesEnum } from "../../../Shared/enums/ennums";
import { getNumberOfDays, getNumberOfWeeks, getTotalShootingDays } from "../../../Shared/Utils/StripboardCalculations";


interface UseStripboardsProps {
  projectId: string;
}

export type StripboardBasicInfo = {
  id: string;
  name: string;
  startDate: string;
  statusId: number;
  statusString: string;
  totalScenes: number;
  totalDays: number;
  totalShootingDays: number;
  totalWeeks: number;
  projectId: number;
};

const useStripboards = ({ projectId }: UseStripboardsProps) => {
  const { result: stripboards, isFetching: isStripboardsFetching } = useRxData<StripboardDocType>(
    'stripboards', 
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    })
  );

  const stripboardsList = useMemo(() => {
    if (!stripboards || isStripboardsFetching) {
      return [];
    }

    return stripboards.map((stripboard) => {
      const stripboardHasScenes = stripboard.stripboardHasScenes || [];
      const startDate = stripboard.startDate || '';
      
      return {
        id: stripboard.id,
        name: stripboard.name,
        startDate: stripboard.startDate,
        statusId: stripboard.statusId,
        statusString: stripboard.statusId === StripboardStatusesEnum.New ? 'New' : 'Published',
        totalScenes: stripboardHasScenes?.length || 0,
        totalDays: getNumberOfDays(stripboardHasScenes),
        totalShootingDays: getTotalShootingDays(stripboardHasScenes),
        totalWeeks: getNumberOfWeeks(startDate, stripboardHasScenes),
        projectId: stripboard.projectId
      };
    });
  }, [stripboards, isStripboardsFetching]);  

  return {
    stripboards: stripboardsList,
    isFetching: isStripboardsFetching
  };
};

export default useStripboards;
