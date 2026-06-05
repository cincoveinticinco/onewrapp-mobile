import { useMemo, useState } from 'react';
import getUniqueValuesByKey from '../../../Shared/Utils/getUniqueValuesByKey';
import sortArrayAlphabeticaly from '../../../Shared/Utils/sortArrayAlphabeticaly';
import {
  DayOrNightOptionEnumArray,
  IntOrExtOptionEnumArray,
  ProtectionTypeEnumArray,
  SceneTypeEnumArray,
} from '../../../Shared/enums/ennums';
import { ListOfOptionsItem } from '../../../Layouts/InputModalWithSections/InputModalWithSections';
import { useProjectScenes } from '../useProjectScenes/useProjectScenes';

export const useSceneFormOptions = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const scenesForOptions = useProjectScenes();

  // Separate memo for location names
  const locationNames = useMemo(() => {
    return sortArrayAlphabeticaly(
      getUniqueValuesByKey(scenesForOptions, 'locationName')
    );
  }, [scenesForOptions]);

  // Separate memo for categorized sets that depends on both project scenes and selectedLocation
  const categorizedSets = useMemo(() => {
    const uniqueLocations = [...getUniqueValuesByKey(scenesForOptions, 'locationName'), 'NO LOCATION']
    
    return uniqueLocations.reduce((acc: ListOfOptionsItem[], location) => {
      // If there's a selected location, only include sets for that location
      if (selectedLocation && location !== selectedLocation) {
        return acc;
      }

      const sets = scenesForOptions
        .filter(scene => {
          if (location === 'NO LOCATION') {
            return !scene.locationName;
          }
          return scene.locationName === location;
        })
        .map(scene => scene.setName)
        // Remove duplicates
        .filter((value, index, self) => self.indexOf(value) === index);
      
      const optionItem: ListOfOptionsItem = {
        category: location,
        options: sets.map(set => ({ label: set, value: set, checked: false })),
        open: true,
      };
      
      acc.push(optionItem);
      return acc;
    }, []);
  }, [scenesForOptions, selectedLocation]);

  const sceneTypeOptions = SceneTypeEnumArray;
  const protectionTypeValues = ProtectionTypeEnumArray;
  const dayNightOptions = DayOrNightOptionEnumArray;
  const intExtOptions = IntOrExtOptionEnumArray;

  return {
    sceneTypeOptions,
    protectionTypeValues,
    dayNightOptions,
    intExtOptions,
    locationOptions: locationNames,
    setOptions: categorizedSets,
    setSelectedLocation,
    selectedLocation
  };
};
