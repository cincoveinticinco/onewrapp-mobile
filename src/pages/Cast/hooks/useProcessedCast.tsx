import {
  useContext, useEffect, useState,
} from 'react';
import ScenesContext from '../../../context/Scenes/Scenes.context';
import { EmptyEnum, SceneTypeEnum } from '../../../Shared/enums/ennums';
import getUniqueValuesByKey from '../../../Shared/Utils/getUniqueValuesByKey';
import getUniqueValuesFromNestedArray from '../../../Shared/Utils/getUniqueValuesFromNestedArray';
import sortByCriterias from '../../../Shared/Utils/SortScenesUtils/sortByCriterias';
import { useProjectScenes } from '../../../hooks/database/useProjectScenes/useProjectScenes';

const useProcessedCast = () => {
  const { castSelectedSortOptions } = useContext(ScenesContext);
  const [isLoading, setIsLoading] = useState(true);
  const [processedCast, setProcessedCast] = useState<any[]>([]);
  const [processedExtras, setProcessedExtras] = useState<any[]>([]);
  const projectScenes = useProjectScenes();

  useEffect(() => {
    setIsLoading(true);
    const processCharacter = (character: any) => {
      const scenes: any[] = projectScenes.reduce((acc: any[], scene: any) => {
        const hasCharacter = scene.characters?.some(
          (sceneCharacter: any) => sceneCharacter.characterName === character.characterName,
        );
        if (hasCharacter) {
          acc.push(scene);
        }
        return acc;
      }, []);

      const setsQuantity: number = getUniqueValuesByKey(scenes, 'setName')?.length;
      const locationsQuantity: number = getUniqueValuesByKey(scenes, 'locationName')?.length;
      const pagesSum: number = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum: number = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity: number = getUniqueValuesByKey(scenes, 'episodeNumber')?.length;
      const scenesQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.SCENE)?.length;
      const protectionQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.PROTECTION)?.length;
      const participation: string = projectScenes.length > 0 ? ((scenesQuantity / projectScenes.length) * 100).toFixed(0) : '0';

      return {
        characterHeader: character.characterNum ? `${character.characterNum}. ${character.characterName}` : character.characterName,
        characterNum: character.characterNum,
        characterName: character.characterName,
        categoryName: character.categoryName || EmptyEnum.NoCategory,
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
      const scenes: any[] = projectScenes.reduce((acc: any[], scene: any) => {
        const hasExtra = scene.extras?.some(
          (sceneExtra: any) => sceneExtra.extraName === extra.extraName,
        );
        if (hasExtra) {
          acc.push(scene);
        }
        return acc;
      }, []);

      const setsQuantity: number = getUniqueValuesByKey(scenes, 'setName')?.length;
      const locationsQuantity: number = getUniqueValuesByKey(scenes, 'locationName')?.length;
      const pagesSum: number = scenes.reduce((acc, scene) => acc + (scene.pages || 0), 0);
      const estimatedTimeSum: number = scenes.reduce((acc, scene) => acc + (scene.estimatedSeconds || 0), 0);
      const episodesQuantity: number = getUniqueValuesByKey(scenes, 'episodeNumber')?.length;
      const scenesQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.SCENE)?.length;
      const protectionQuantity: number = scenes.filter((scene) => scene.sceneType === SceneTypeEnum.PROTECTION)?.length;
      const participation: string = projectScenes.length > 0 ? ((scenesQuantity / projectScenes.length) * 100).toFixed(0) : '0';

      return {
        characterNum: null,
        extraName: extra.extraName ? extra.extraName : 'NO NAME',
        characterName: extra.extraName,
        categoryName: extra.categoryName || EmptyEnum.NoCategory,
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

    const uniqueCharacters: any[] = getUniqueValuesFromNestedArray(projectScenes, 'characters', 'characterName');
    const uniqueExtras: any[] = getUniqueValuesFromNestedArray(projectScenes, 'extras', 'extraName');

    const sortedCast = sortByCriterias(uniqueCharacters.map(processCharacter), castSelectedSortOptions);
    const sortedExtras = sortByCriterias(uniqueExtras.map(processExtra), castSelectedSortOptions);

    setProcessedCast(sortedCast);
    setProcessedExtras(sortedExtras);
    setIsLoading(false);
  }, [projectScenes, castSelectedSortOptions]);

  return { processedCast, processedExtras, isLoading };
};

export default useProcessedCast;
