import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import ScenesContext from '../../../context/Scenes/Scenes.context';
import { SceneTypeEnum } from '../../../Shared/enums/ennums';
import { SceneDocType } from '../../../Shared/types/scenes.types';
import getUniqueValuesByKey from '../../../Shared/Utils/getUniqueValuesByKey';
import sortByCriterias from '../../../Shared/Utils/SortScenesUtils/sortByCriterias';
import { useProjectScenes } from '../useProjectScenes/useProjectScenes';

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
  const projectScenes = useProjectScenes();
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
    const setScenes = projectScenes.filter((scene: SceneDocType) => scene.setName === setName);
    const charactersLength = setScenes.reduce((acc: number, scene: SceneDocType) => (scene.characters ? acc + scene.characters?.length : acc), 0);
    const scenesQuantity = setScenes?.length;
    const protectionQuantity = setScenes.filter((scene: SceneDocType) => scene.sceneType === SceneTypeEnum.PROTECTION)?.length;
    const pagesSum = setScenes.reduce((acc: number, scene: SceneDocType) => acc + (scene.pages || 0), 0);
    const estimatedTimeSum = setScenes.reduce((acc: number, scene: SceneDocType) => acc + (scene.estimatedSeconds || 0), 0);
    const episodesQuantity = getUniqueValuesByKey(setScenes, 'episodeNumber')?.length;
    const participation = projectScenes.length > 0 ? ((scenesQuantity / projectScenes.length) * 100).toFixed(2) : '0.00';
    const { locationName } = setScenes[0];

    return {
      setName,
      charactersLength,
      scenesQuantity,
      protectionQuantity,
      pagesSum,
      estimatedTimeSum,
      episodesQuantity,
      participation,
      locationName: locationName || locationName == '' ? locationName : 'NO LOCATION',
    };
  }, [projectScenes]);

  // Memoized processed sets data
  const processedSets = useMemo<SetInformation[]>(() => {
    const uniqueSetNames: string[] = getUniqueValuesByKey(projectScenes, 'setName');
    setIsLoading(false);
    return sortByCriterias(uniqueSetNames.map(processSet), setsSelectedSortOptions);
  }, [projectScenes, setsSelectedSortOptions, processSet]);

  // Memoized processed locations data
  const processedLocations = useMemo(() => {
    const uniqueLocationNames = getUniqueValuesByKey(projectScenes, 'locationName').concat('NO LOCATION');

    const processedLocationsData = (locationName: string) => {
      const locationScenes = projectScenes.filter((scene: SceneDocType) => scene.locationName === locationName);
      const scenesQuantity = locationScenes?.length;
      const protectionQuantity = locationScenes.filter((scene: SceneDocType) => scene.sceneType === SceneTypeEnum.PROTECTION)?.length;
      const pagesSum = locationScenes.reduce((acc: number, scene: SceneDocType) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum = locationScenes.reduce((acc: number, scene: SceneDocType) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity = getUniqueValuesByKey(locationScenes, 'episodeNumber')?.length;
      const participation = projectScenes.length > 0 ? ((scenesQuantity / projectScenes.length) * 100).toFixed(2) : '0.00';

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
  }, [projectScenes, locationsSelectedSortOptions]);

  return {
    processedSets, processedLocations, isLoading, setIsLoading,
  };
};

export default useProcessedSetsAndLocations;
