import { useEffect, useState } from 'react';
import {
  Character, Element, Extra, Note,
} from '../../Shared/types/scenes.types';
import getUniqueValuesFromNestedArray from '../../Shared/Utils/getUniqueValuesFromNestedArray';
import removeAccents from '../../Shared/Utils/removeAccents';
import { EmptyEnum } from '../../Shared/ennums/ennums';

interface UseFormTypeLogicReturnValue {
  formType: 'character' | 'element' | 'extra' | 'note' | null;
  extra: Extra;
  setExtra: React.Dispatch<React.SetStateAction<Extra>>;
  element: Element;
  setElement: React.Dispatch<React.SetStateAction<Element>>;
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  note: Note;
  setNote: React.Dispatch<React.SetStateAction<Note>>;
  setFormType: React.Dispatch<React.SetStateAction<'character' | 'element' | 'extra' | 'note' | null>>;
  popupMessage: string
}

const useFormTypeLogic = (offlineScenes: any[], selectedText: string): UseFormTypeLogicReturnValue => {
  const [formType, setFormType] = useState<'character' | 'element' | 'extra' | 'note' | null>(null);
  const [popupMessage, setPopupMessage] = useState('');

  const [extra, setExtra] = useState<Extra>({
    categoryName: null,
    extraName: '',
  });
  const [element, setElement] = useState<Element>({
    categoryName: null,
    elementName: '',
  });
  const [character, setCharacter] = useState<Character>({
    categoryName: null,
    characterName: '',
    characterNum: null,
  });
  const [note, setNote] = useState<Note>({
    email: null,
    note: '',
    updatedAt: null,
  });

  useEffect(() => {
    const normalizedSelectedText = removeAccents(selectedText).toLowerCase().trim();
    const uniqueCharacters = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    const uniqueExtras = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
    const uniqueElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');

    const foundCharacter = uniqueCharacters.find((character: Character) => character.characterName && removeAccents(character.characterName).toLowerCase().trim() === normalizedSelectedText);
    const foundElement = uniqueElements.find((element: Element) => element.elementName && removeAccents(element.elementName).toLowerCase().trim() === normalizedSelectedText);
    const foundExtra = uniqueExtras.find((extra: Extra) => extra.extraName && removeAccents(extra.extraName).toLowerCase().trim() === normalizedSelectedText);

    if (foundCharacter) {
      setFormType('character');
      setCharacter({
        ...foundCharacter,
        characterNum: foundCharacter.characterNum || null,
      });
      setPopupMessage(`${selectedText} exists in characters (${character.categoryName || EmptyEnum.NoCategory})`);
    } else if (foundElement) {
      setFormType('element');
      setElement(foundElement);
      setPopupMessage(`${selectedText} exists in elements (${foundElement.categoryName})`);
    } else if (foundExtra) {
      setFormType('extra');
      setExtra(foundExtra);
      setPopupMessage(`${selectedText} exists in extras`);
    } else {
      setFormType('character');
      setPopupMessage('');
    }

    setNote((prevNote: any) => ({ ...prevNote, note: selectedText }));
    setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: selectedText }));
    setElement((prevElement: any) => ({ ...prevElement, elementName: selectedText }));
    setExtra((prevExtra: any) => ({ ...prevExtra, extraName: selectedText }));
  }, [selectedText]);

  return {
    formType, extra, setExtra, element, setElement, character, setCharacter, note, setNote, setFormType, popupMessage,
  };
};

export default useFormTypeLogic;
