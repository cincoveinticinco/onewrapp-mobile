import { Character } from '../types/scenes.types';

const getCharactersArray = (uniqueValuesArray: Character[]) => {
  const charactersArray: string[] = [];

  if (Array.isArray(uniqueValuesArray)) {
    uniqueValuesArray.forEach((character) => {
      const characterName = character?.characterNum ? 
        `${character?.characterNum}. ${character?.characterName}` : 
        character?.characterName || '';
      charactersArray.push(characterName);
    });
  }

  return charactersArray;
};

export default getCharactersArray;
