import { useState } from "react";
import { ProjWeekDocType } from "../../../Shared/types/projWeekTypes.types";
import { useRxData } from "rxdb-hooks";


const useProjectWeeks = (projectId: string) => {
  
  const { result: projWeeks, isFetching } = useRxData<ProjWeekDocType>('proj_weeks', (collection) => collection.find({
    selector: {
      projectId: Number(projectId)
    }
  }));

  return { weeks: projWeeks, isFetching };
}

export default useProjectWeeks;