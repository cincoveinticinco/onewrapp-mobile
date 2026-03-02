import { useContext, useEffect, useMemo, useState } from "react";
import sortByCriterias from "../../../Shared/Utils/SortScenesUtils/sortByCriterias";
import applyFilters from "../../../Shared/Utils/applyFilters";
import DatabaseContext from "../../../context/Database/Database.context";
import ScenesContext from "../../../context/Scenes/Scenes.context";
import { DatabaseContextProps } from "../../../context/Database/types/Database.types";
import useCombinedScenesWithShootingsOptimized from "../../database/useCombinedScenesWithShootings/useCombinedScenesWithShootingsOptimized";

/**
 * Optimized scenes filtering hook that pushes filtering into RxDB queries
 * instead of filtering in JavaScript after loading all data.
 * 
 * Key optimizations:
 * 1. Search filtering happens at database level via RxDB selectors
 * 2. Only filtered results are loaded into memory
 * 3. Sorting happens on smaller dataset
 */
export const useScenesFilteringOptimized = (searchText: string) => {
  const { projectId } = useContext<DatabaseContextProps>(DatabaseContext);
  const { selectedFilterOptions, setSelectedFilterOptions, selectedSortOptions, setSelectedSortOptions } = useContext<any>(ScenesContext);
  
  // Use optimized hook that does basic search filtering at database level
  // Complex filters are applied in JS to maintain compatibility with nested filters, accent removal, etc.
  const { combinedData: scenesFromDB, isFetching: scenesAreLoading } = 
    useCombinedScenesWithShootingsOptimized({
      searchText,
      additionalFilters: {} // Don't push complex filters to DB - they won't work correctly
    });

  // Apply complex filters in JavaScript (maintains full compatibility with applyFilters)
  // This still performs better than before because:
  // 1. Database search pre-filters the dataset when searchText exists
  // 2. We only apply complex filters to the reduced dataset
  const filteredScenes = useMemo(() => {
    if (!scenesFromDB || scenesFromDB.length === 0) return [];
    
    console.log("🟢 Filtrando escenas con:", selectedFilterOptions);
    // Use the original applyFilters for complex nested filters, accent removal, etc.
    const filteredData = Object.keys(selectedFilterOptions).length > 0
      ? applyFilters(scenesFromDB, selectedFilterOptions)
      : scenesFromDB;
    
    console.log("🔵 Ordenando escenas con:", selectedSortOptions);
    const sortedData = sortByCriterias(filteredData, selectedSortOptions);
    
    return sortedData;
  }, [scenesFromDB, selectedFilterOptions, selectedSortOptions]);

  // Update filter options when search text changes
  // This is kept for compatibility but actual filtering happens in the optimized hook
  useEffect(() => {
    if (searchText?.length > 0) {
      const filterCriteria = {
        ...selectedFilterOptions,
        searchActive: true, // Flag to indicate search is active
      };
      // Don't update if already set to avoid infinite loops
      if (!selectedFilterOptions.searchActive) {
        setSelectedFilterOptions(filterCriteria);
      }
    } else if (selectedFilterOptions.searchActive) {
      const { searchActive, ...rest } = selectedFilterOptions;
      setSelectedFilterOptions(rest);
    }
  }, [searchText]);

  return {
    filteredScenes,
    selectedFilterOptions,
    setSelectedFilterOptions,
    selectedSortOptions,
    setSelectedSortOptions,
    scenesAreLoading,
  };
};
