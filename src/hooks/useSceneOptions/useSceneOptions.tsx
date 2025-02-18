import { useContext, useMemo, useState } from 'react';
import DatabaseContext from '../../context/Database/Database.context';
import getUniqueValuesByKey from '../../Shared/Utils/getUniqueValuesByKey';
import sortArrayAlphabeticaly from '../../Shared/Utils/sortArrayAlphabeticaly';
import {
  DayOrNightOptionEnumArray,
  IntOrExtOptionEnumArray,
  ProtectionTypeEnumArray,
  SceneTypeEnumArray,
} from '../../Shared/ennums/ennums';
import { ListOfOptionsItem } from '../../Layouts/InputModalWithSections/InputModalWithSections';

export const useSceneFormOptions = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Separate memo for location names
  const locationNames = useMemo(() => {
    return sortArrayAlphabeticaly(
      getUniqueValuesByKey(offlineScenes, 'locationName')
    );
  }, [offlineScenes]);

  // Separate memo for categorized sets that depends on both offlineScenes and selectedLocation
  const categorizedSets = useMemo(() => {
    const uniqueLocations = [...getUniqueValuesByKey(offlineScenes, 'locationName'), 'NO LOCATION']
    
    return uniqueLocations.reduce((acc: ListOfOptionsItem[], location) => {
      // If there's a selected location, only include sets for that location
      if (selectedLocation && location !== selectedLocation) {
        return acc;
      }

      const sets = offlineScenes
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
  }, [offlineScenes, selectedLocation]);

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