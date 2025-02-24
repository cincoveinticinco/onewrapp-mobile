import { useHistory } from 'react-router-dom';
import useSuccessToast from '../../Shared/hooks/useSuccessToast';
import { useRxData, useRxDB } from 'rxdb-hooks';
import useErrorToast from '../../Shared/hooks/useErrorToast';
import getUniqueValuesByKey from '../../Shared/Utils/getUniqueValuesByKey';
import { useMemo, useState, useEffect } from 'react';
import { Character, Element, SceneDocType } from '../../Shared/types/scenes.types';
import getUniqueValuesFromNestedArray from '../../Shared/Utils/getUniqueValuesFromNestedArray';
import { IntOrExtOptionEnumArray } from '../../Shared/ennums/ennums';

export const useScene = () => {
  const history = useHistory();
  const oneWrapDb: any = useRxDB();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const [loading, setLoading] = useState(true);

  const { result: scenes, isFetching } = useRxData<SceneDocType>('scenes', (collection) => collection.find());

  useEffect(() => {
    if (!isFetching) {
      setLoading(false);
    }
  }, [isFetching]);

  const deleteScene = async (sceneId: string, projectId: string) => {
    try {
      const sceneToDelete = await oneWrapDb?.scenes.findOne({
        selector: { sceneId: parseInt(sceneId) }
      }).exec();

      await sceneToDelete?.remove();
      history.push(`/my/projects/${projectId}/strips`);
      successToast('Scene deleted successfully');
    } catch (error) {
      errorToast('Error deleting scene');
    }
  };

  const uniqueSets: SceneDocType['setName'][] = useMemo(() => {
    return getUniqueValuesByKey(scenes, 'setName') || [];
  }, [oneWrapDb?.scenes]);

  const uniqueLocations: SceneDocType['locationName'][] = useMemo(() => {
    const locations = getUniqueValuesByKey(scenes, 'locationName') || [];
    return locations;
  }, [scenes]);

  const uniqueElements: Element[] = useMemo(() => {
    const elements = getUniqueValuesFromNestedArray(scenes, 'elements', 'elementName') || [];
    return elements;
  }, [scenes]);

  const uniqueElementsCategories: Element[] = useMemo(() => {
    const elements = getUniqueValuesFromNestedArray(scenes, 'elements', 'categoryName') || [];
    return elements;
  }, [scenes]);

  const uniqueCharacters: Character[] = useMemo(() => {
    const characters = getUniqueValuesFromNestedArray(scenes, 'characters', 'characterName') || [];
    return characters;
  }, [scenes]);

  const uniqueCharactersCategories: Character[] = useMemo(() => {
    const characters = getUniqueValuesFromNestedArray(scenes, 'characters', 'categoryName') || [];
    return characters;
  }, [scenes]);

  const uniqueIntExt = IntOrExtOptionEnumArray;

  return {
    deleteScene,
    uniqueSets,
    uniqueLocations,
    uniqueElements,
    uniqueElementsCategories,
    uniqueCharacters,
    uniqueCharactersCategories,
    uniqueIntExt,
    isFetching: isFetching || loading
  };
};