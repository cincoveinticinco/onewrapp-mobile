import { useContext, useMemo } from 'react';
import DatabaseContext from '../../context/Database/Database.context';
import getUniqueValuesByKey from '../../Shared/Utils/getUniqueValuesByKey';
import sortArrayAlphabeticaly from '../../Shared/Utils/sortArrayAlphabeticaly';
import {
  DayOrNightOptionEnumArray,
  IntOrExtOptionEnumArray,
  ProtectionTypeEnumArray,
  SceneTypeEnumArray,
} from '../../Shared/ennums/ennums';

export const useSceneFormOptions = () => {
  const { offlineScenes } = useContext(DatabaseContext);

  const options = useMemo(() => {
    const getSortedLocationNames = sortArrayAlphabeticaly(
      getUniqueValuesByKey(offlineScenes, 'locationName')
    );
    const getSortedSetNames = sortArrayAlphabeticaly(
      getUniqueValuesByKey(offlineScenes, 'setName')
    );

    return {
      sceneTypeOptions: SceneTypeEnumArray,
      protectionTypeValues: ProtectionTypeEnumArray,
      dayNightOptions: DayOrNightOptionEnumArray,
      intExtOptions: IntOrExtOptionEnumArray,
      locationOptions: getSortedLocationNames,
      setOptions: getSortedSetNames,
    };
  }, [offlineScenes]);

  return options;
};