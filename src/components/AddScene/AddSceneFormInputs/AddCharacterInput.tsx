import React, { useState, useEffect } from 'react';
import {
  IonCardContent,
  IonItem,
  IonList,
} from '@ionic/react';
import { Character } from '../../../interfaces/scenesTypes';
import InputModal from '../../Shared/InputModal/InputModal';
import getCharactersArray from '../../../utils/getCharactersArray';
import customArraySort from '../../../utils/customArraySort';
import sceneData from '../../../data/scn_data.json';
import removeNumberAndDot from '../../../utils/removeNumberAndDot';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import applyFilters from '../../../utils/applyFilters';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import NoAdded from '../../Shared/NoAdded/NoAdded';

interface AddCharacterInputProps {
  categoryName: string | null;
  handleSceneChange: (value: any, field: string) => void;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName,
  handleSceneChange,
}) => {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const { scenes } = sceneData;

  useEffect(() => {
    handleSceneChange(selectedCharacters, 'characters');
  }, [selectedCharacters]);

  const deleteCharacter = (characterNum: string | null) => {
    if (characterNum) {
      const updatedCharacters = selectedCharacters.filter(
        (character: Character) => character.characterNum !== characterNum,
      );
      setSelectedCharacters(updatedCharacters);
    }
  };

  const uniqueCharacterValuesArray = getUniqueValuesFromNestedArray(
    scenes,
    'characters',
    'characterName',
  );

  const categoryCriteria = categoryName === 'NO CATEGORY' ? null : categoryName;

  const getFilteredCharacters = applyFilters(uniqueCharacterValuesArray, {
    categoryName: [categoryCriteria],
  });

  const getSortedCharacterNames = customArraySort(
    getCharactersArray(getFilteredCharacters),
  );

  const toggleCharacters = (character: string) => {
    const sceneWithCharacter = scenes.find((scene: any) => scene.characters.some(
      (char: any) => char.characterName.toUpperCase()
          === removeNumberAndDot(character.toUpperCase()),
    ));

    const characterObject = sceneWithCharacter?.characters.find(
      (char: any) => char.characterName.toUpperCase()
        === removeNumberAndDot(character.toUpperCase()),
    );

    if (characterObject) {
      const selectedCharacterObjectIndex = selectedCharacters.findIndex(
        (char: any) => char.characterName === characterObject.characterName,
      );
      if (selectedCharacterObjectIndex !== -1) {
        setSelectedCharacters((currentCharacters) => currentCharacters.filter(
          (char: any) => char.characterName !== characterObject.characterName,
        ));
      } else {
        const newCharacter: any = { ...characterObject };
        newCharacter.categoryName = categoryName !== 'NO CATEGORY' ? categoryName : null;
        setSelectedCharacters((currentCharacters) => [
          ...currentCharacters,
          newCharacter,
        ]);
      }
    }
  };

  const clearSelections = () => {
    setSelectedCharacters([]);
  };

  const contentStyle = selectedCharacters.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {selectedCharacters.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {selectedCharacters.map((character, index) => (
            <IonItem
              key={`character-item-${index}`}
              color="tertiary"
              className="ion-no-margin category-items"
            >
              {`${character.characterNum ? character.characterNum + '.' : ''} ${character.characterName}`}
              <DeleteButton
                onClick={() => deleteCharacter(character.characterNum)}
                slot="end"
              />
            </IonItem>
          ))}
        </IonList>
      ) : (
        <NoAdded />
      )}
      <InputModal
        optionName={`Characters (  ${categoryName}  )`}
        listOfOptions={getSortedCharacterNames}
        modalTrigger={`open-characters-options-modal-${categoryName}`}
        handleCheckboxToggle={toggleCharacters}
        selectedOptions={selectedCharacters.map(
          (character) => character.characterName,
        )}
        clearSelections={clearSelections}
      />
    </IonCardContent>
  );
};

export default AddCharacterInput;
