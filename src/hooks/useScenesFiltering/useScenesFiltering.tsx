import { useContext, useEffect, useState } from "react";
import sortByCriterias from "../../Shared/Utils/SortScenesUtils/sortByCriterias";
import applyFilters from "../../Shared/Utils/applyFilters";
import useCombinedScenesWithShootings from "../useCombinedScenesWithShootings/useCombinedScenesWithShootings";
import DatabaseContext from "../../context/Database/Database.context";
import ScenesContext from "../../context/Scenes/Scenes.context";
import { DatabaseContextProps } from "../../context/Database/types/Database.types";

export const useScenesFiltering = (searchText: string) => {
  const { projectId, initialReplicationFinished } = useContext<DatabaseContextProps>(DatabaseContext);
  const { selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions, setSelectedSortOptions } = useContext<any>(ScenesContext);
  const { combinedData: offlineScenes, isFetching: scenesAreLoading } = useCombinedScenesWithShootings();

  const [filteredScenes, setFilteredScenes] = useState<any[]>([]);
  const [renderScenes, setRenderScenes] = useState<boolean>(false);

  useEffect(() => {
    setRenderScenes(initialReplicationFinished);
  }, [initialReplicationFinished]);

  useEffect(() => {
    if (!offlineScenes) return;

    console.log("🟢 Filtrando escenas con:", selectedFilterOptions);
    const filteredData = applyFilters(offlineScenes, selectedFilterOptions);

    console.log("🔵 Ordenando escenas con:", selectedSortOptions);
    const sortedData = sortByCriterias(filteredData, selectedSortOptions);

    setFilteredScenes([...sortedData]); // ⚠️ Asegura que React detecte cambios
  }, [offlineScenes, selectedFilterOptions, selectedSortOptions, projectId, renderScenes]);

  useEffect(() => {
    if (searchText.length > 0) {
      const filterCriteria = {
        ...selectedFilterOptions,
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
      setSelectedFilterOptions({ ...selectedFilterOptions, ...filterCriteria });
    } else {
      setSelectedFilterOptions({});
    }
  }, [searchText, setSelectedFilterOptions]);

  return {
    filteredScenes,
    selectedFilterOptions,
    setSelectedFilterOptions,
    selectedSortOptions,
    setSelectedSortOptions,
    scenesAreLoading,
  };
};
