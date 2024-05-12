import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import DatabaseContext from '../context/database';
import ScenesContext from '../context/ScenesContext';
import { Scene } from '../interfaces/scenesTypes';
import getUniqueValuesByKey from '../utils/getUniqueValuesByKey';
import sortByCriterias from '../utils/SortScenesUtils/sortByCriterias';
import { SceneTypeEnum } from '../Ennums/ennums';

interface SceneDataProps {
  _data: Scene;
}

interface SetInformation {
  setName: string;
  charactersLength: number;
  scenesQuantity: number;
  protectionQuantity: number;
  pagesSum: number;
  estimatedTimeSum: number;
  episodesQuantity: number;
  participation: string;
  locationName: string;
}

const useProcessedSetsAndLocations = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const { setsSelectedSortOptions } = useContext(ScenesContext);
  const [locationsSelectedSortOptions, setLocationsSelectedSortOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update locationsSelectedSortOptions based on setsSelectedSortOptions
  useEffect(() => {
    const locationSelectedSortOptions = () => {
      const setNameIndex = setsSelectedSortOptions.findIndex((option) => option.some((option: any) => option === 'setName'));

      const newLocationSelectedSortOptions: any[] = [];

      setsSelectedSortOptions.forEach((criteria: any, index: number) => {
        if (index !== setNameIndex) {
          newLocationSelectedSortOptions.push(criteria);
        } else {
          const newLocationOption = ['locationName', setsSelectedSortOptions[setNameIndex][1], setsSelectedSortOptions[setNameIndex][2]];
          newLocationSelectedSortOptions.push(newLocationOption);
        }
      });

      return newLocationSelectedSortOptions;
    };

    setLocationsSelectedSortOptions(locationSelectedSortOptions());
  }, [setsSelectedSortOptions]);

  // Memoized function to process set data

  const processSet = useCallback((setName: string) => {
    const setScenes = offlineScenes.filter((scene: SceneDataProps) => scene._data.setName === setName);
    const charactersLength = setScenes.reduce((acc: number, scene: SceneDataProps) => (scene._data.characters ? acc + scene._data.characters.length : acc), 0);
    const scenesQuantity = setScenes.length;
    const protectionQuantity = setScenes.filter((scene: SceneDataProps) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length;
    const pagesSum = setScenes.reduce((acc: number, scene: SceneDataProps) => acc + (scene._data.pages || 0), 0);
    const estimatedTimeSum = setScenes.reduce((acc: number, scene: SceneDataProps) => acc + (scene._data.estimatedSeconds || 0), 0);
    const episodesQuantity = getUniqueValuesByKey(setScenes, 'episodeNumber').length;
    const participation = ((scenesQuantity / offlineScenes.length) * 100).toFixed(2);
    const { locationName } = setScenes[0]._data;

    return {
      setName,
      charactersLength,
      scenesQuantity,
      protectionQuantity,
      pagesSum,
      estimatedTimeSum,
      episodesQuantity,
      participation,
      locationName: locationName || 'NO LOCATION',
    };
  }, [offlineScenes]);

  // Memoized processed sets data
  const processedSets = useMemo<SetInformation[]>(() => {
    const uniqueSetNames: string[] = getUniqueValuesByKey(offlineScenes, 'setName');
    setIsLoading(false);
    return sortByCriterias(uniqueSetNames.map(processSet), setsSelectedSortOptions);
  }, [offlineScenes, setsSelectedSortOptions, processSet]);

  // Memoized processed locations data
  const processedLocations = useMemo(() => {
    const uniqueLocationNames = getUniqueValuesByKey(offlineScenes, 'locationName');

    const processedLocationsData = (locationName: string) => {
      const locationScenes = offlineScenes.filter((scene: SceneDataProps) => scene._data.locationName === locationName);
      const scenesQuantity = locationScenes.length;
      const protectionQuantity = locationScenes.filter((scene: SceneDataProps) => scene._data.sceneType === SceneTypeEnum.PROTECTION).length;
      const pagesSum = locationScenes.reduce((acc: number, scene: SceneDataProps) => acc + (scene._data.pages || 0), 0);
      const estimatedTimeSum = locationScenes.reduce((acc: number, scene: SceneDataProps) => acc + (scene._data.estimatedSeconds || 0), 0);
      const episodesQuantity = getUniqueValuesByKey(locationScenes, 'episodeNumber').length;
      const participation = ((scenesQuantity / offlineScenes.length) * 100).toFixed(2);

      return {
        locationName,
        scenesQuantity,
        protectionQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        participation,
      };
    };

    return sortByCriterias(uniqueLocationNames.map(processedLocationsData), locationsSelectedSortOptions);
  }, [offlineScenes, locationsSelectedSortOptions]);

  return {
    processedSets, processedLocations, isLoading, setIsLoading,
  };
};

export default useProcessedSetsAndLocations;
