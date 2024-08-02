import {
  useContext, useEffect, useMemo, useState,
} from 'react';
import DatabaseContext from '../../context/Database.context';
import getUniqueValuesFromNestedArray from '../../utils/getUniqueValuesFromNestedArray';
import sortByCriterias from '../../utils/SortScenesUtils/sortByCriterias';
import ScenesContext from '../../context/Scenes.context';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';
import { SceneTypeEnum } from '../../Ennums/ennums';

const useProcessedCast = () => {
  const { offlineScenes } = useContext(DatabaseContext);
  const { castSelectedSortOptions } = useContext(ScenesContext);
  const [isLoading, setIsLoading] = useState(true);
  const [processedCast, setProcessedCast] = useState<any[]>([]);
  const [processedExtras, setProcessedExtras] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const processCharacter = (character: any) => {
      const scenes: any[] = offlineScenes.reduce((acc: any[], scene: any) => {
        const hasCharacter = scene._data.characters.some(
          (sceneCharacter: any) => sceneCharacter.characterName === character.characterName,
        );
        if (hasCharacter) {
          acc.push(scene._data);
        }
        return acc;
      }, []);

      const setsQuantity: number = getUniqueValuesByKey(scenes, 'setName').length;
      const locationsQuantity: number = getUniqueValuesByKey(scenes, 'locationName').length;
      const pagesSum: number = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum: number = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity: number = getUniqueValuesByKey(scenes, 'episodeNumber').length;
      const scenesQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.SCENE).length;
      const protectionQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.PROTECTION).length;
      const participation: string = ((scenesQuantity / offlineScenes.length) * 100).toFixed(0);

      return {
        characterHeader: character.characterNum ? `${character.characterNum}. ${character.characterName}` : character.characterName,
        characterNum: character.characterNum,
        characterName: character.characterName,
        categoryName: character.categoryName || 'NO CATEGORY',
        setsQuantity,
        locationsQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        scenesQuantity,
        protectionQuantity,
        participation,
      };
    };

    const processExtra = (extra: any) => {
      const scenes: any[] = offlineScenes.reduce((acc: any[], scene: any) => {
        const hasExtra = scene._data.extras.some(
          (sceneExtra: any) => sceneExtra.extraName === extra.extraName,
        );
        if (hasExtra) {
          acc.push(scene._data);
        }
        return acc;
      }, []);

      const setsQuantity: number = getUniqueValuesByKey(scenes, 'setName').length;
      const locationsQuantity: number = getUniqueValuesByKey(scenes, 'locationName').length;
      const pagesSum: number = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum: number = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity: number = getUniqueValuesByKey(scenes, 'episodeNumber').length;
      const scenesQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.SCENE).length;
      const protectionQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.PROTECTION).length;
      const participation: string = ((scenesQuantity / offlineScenes.length) * 100).toFixed(0);

      return {
        characterNum: null,
        extraName: extra.extraName ? extra.extraName : 'NO NAME',
        characterName: extra.extraName,
        categoryName: extra.categoryName || 'NO CATEGORY',
        setsQuantity,
        locationsQuantity,
        pagesSum,
        estimatedTimeSum,
        episodesQuantity,
        scenesQuantity,
        protectionQuantity,
        participation,
      };
    };

    const uniqueCharacters: any[] = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    const uniqueExtras: any[] = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');

    const sortedCast = sortByCriterias(uniqueCharacters.map(processCharacter), castSelectedSortOptions);
    const sortedExtras = sortByCriterias(uniqueExtras.map(processExtra), castSelectedSortOptions);

    setProcessedCast(sortedCast);
    setProcessedExtras(sortedExtras);
    setIsLoading(false);
  }, [offlineScenes, castSelectedSortOptions]);

  return { processedCast, processedExtras, isLoading };
};

export default useProcessedCast;
