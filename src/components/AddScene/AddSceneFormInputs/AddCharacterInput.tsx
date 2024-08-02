import React, { useContext } from 'react';
import {
  IonCardContent,
  IonItem,
  IonList,
} from '@ionic/react';
import { Character } from '../../../interfaces/scenes.types';
import InputModal from '../../../Layouts/InputModal/InputModal';
import getCharactersArray from '../../../utils/getCharactersArray';
import customArraySort from '../../../utils/customArraySort';
import removeNumberAndDot from '../../../utils/removeNumberAndDot';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import applyFilters from '../../../utils/applyFilters';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import NoAdded from '../../Shared/NoAdded/NoAdded';
import DatabaseContext from '../../../context/Database.context';

interface AddCharacterInputProps {
  categoryName: string | null;
  selectedCharacters: any;
  setSelectedCharacters: (value: any) => void;
  modalTrigger: string;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName,
  selectedCharacters,
  setSelectedCharacters,
  modalTrigger,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const filterSelectedCharacters = selectedCharacters.filter((character: any) => {
    if (categoryName === 'NO CATEGORY') {
      return character.categoryName === null;
    }
    return character.categoryName === categoryName;
  });

  const deleteCharacter = (characterName: string | null) => {
    if (characterName) {
      const updatedCharacters = selectedCharacters.filter(
        (character: Character) => character.characterName !== characterName,
      );
      setSelectedCharacters(updatedCharacters);
    }
  };

  const uniqueCharacterValuesArray = getUniqueValuesFromNestedArray(
    offlineScenes,
    'characters',
    'characterName',
  );

  const categoryCriteria = categoryName === 'NO CATEGORY' ? null : categoryName;

  const getFilteredCharacters = applyFilters(
    uniqueCharacterValuesArray,
    {
      categoryName: [categoryCriteria],
    },
    false,
  );

  const getSortedCharacterNames = customArraySort(
    getCharactersArray(selectedCharacters.length > 0 ? [...getFilteredCharacters] : getFilteredCharacters),
  );

  const toggleCharacters = (character: string) => {
    const sceneWithCharacter = offlineScenes.find((scene: any) => scene.characters.some(
      (char: any) => char.characterName.toUpperCase()
          === removeNumberAndDot(character.toUpperCase()),
    ));

    const characterObject = sceneWithCharacter?.characters?.find(
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
      } else if (selectedCharacterObjectIndex === -1) {
        const newCharacter: any = { ...characterObject };

        setSelectedCharacters((currentCharacters: any) => [
          ...currentCharacters,
          newCharacter,
        ]);
      }
    }
  };

  const clearSelections = () => {
    setSelectedCharacters([]);
  };

  const formInputs = [
    {
      label: 'Character Number',
      type: 'text',
      fieldKeyName: 'characterNum',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-character-number-input',
    },
    {
      label: 'Character Name',
      type: 'text',
      fieldKeyName: 'characterName',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-character-name-input',
    },
  ];

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
              {`${character.characterNum ? `${character.characterNum}.` : ''} ${character.characterName.toUpperCase()}`}
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
        modalTrigger={modalTrigger}
        handleCheckboxToggle={toggleCharacters}
        selectedOptions={selectedCharacters.map(
          (character: any) => character.characterName,
        )}
        setSelectedOptions={setSelectedCharacters}
        clearSelections={clearSelections}
        canCreateNew
        optionCategory={categoryName || 'NO CATEGORY'}
        formInputs={formInputs}
        existentOptions={uniqueCharacterValuesArray}
      />
    </IonCardContent>
  );
};

export default AddCharacterInput;
