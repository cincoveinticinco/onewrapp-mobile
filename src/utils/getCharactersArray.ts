import scenesData from '../data/scn_data.json';
import { Character } from '../interfaces/scenesTypes';
import getUniqueValuesFromNestedArray from './getUniqueValuesFromNestedArray';

const scenes = scenesData.scenes;

const getCharactersArray = () => {
  const charactersArray: string[] = [];
  const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'characters', 'characterName');

  uniqueValuesArray.forEach((character: Character) => {
    const characterName = character.characterNum ? `${character.characterNum}. ${character.characterName}` : character.characterName;
    charactersArray.push(characterName);
  });

  return charactersArray;
};

export default getCharactersArray;