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
  selectedCharacters: any;
  setSelectedCharacters: (value: any) => void;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName,
  handleSceneChange,
  selectedCharacters,
  setSelectedCharacters,
}) => {
  const { scenes } = sceneData;
  
  const filterSelectedCharacters = selectedCharacters.filter((character: any) => character.categoryName === categoryName);

  const deleteCharacter = (characterName: string | null) => {
    if (characterName) {
      const updatedCharacters = selectedCharacters.filter(
        (character: Character) => character.characterName !== characterName,
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
        setSelectedCharacters((currentCharacters: any) => currentCharacters.filter(
          (char: any) => char.characterName !== characterObject.characterName,
        ));
      } else if(selectedCharacterObjectIndex === -1) {
        const newCharacter: any = { ...characterObject };
        
        setSelectedCharacters((currentCharacters: any) => {
          console.log('currentCharacters', currentCharacters);
         return [
          ...currentCharacters,
          newCharacter,
        ]});
      }
    }
  };

  const clearSelections = () => {
    setSelectedCharacters([]);
  };

  const contentStyle = selectedCharacters.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedCharacters.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedCharacters.map((character: any, index: number) => (
            <IonItem
              key={`character-item-${index}-category-${categoryName}`}
              color="tertiary"
              className="ion-no-margin category-items"
            >
              {`${character.characterNum ? character.characterNum + '.' : ''} ${character.characterName.toUpperCase()}`}
              <DeleteButton
                onClick={() => deleteCharacter(character.characterName)}
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
          (character: any) => character.characterName,
        )}
        clearSelections={clearSelections}
        canCreateNew={true}
      />
    </IonCardContent>
  );
};

export default AddCharacterInput;
