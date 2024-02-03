import { Character } from '../interfaces/scenesTypes';

const getCharactersArray = (uniqueValuesArray: any[]) => {
  const charactersArray: string[] = [];

  if (Array.isArray(uniqueValuesArray)) {
    uniqueValuesArray.forEach((character: Character) => {
      const characterName = character.characterNum ? `${character.characterNum}. ${character.characterName}` : character.characterName;
      charactersArray.push(characterName);
    });
  }

  return charactersArray;
};

export default getCharactersArray;

// receive
