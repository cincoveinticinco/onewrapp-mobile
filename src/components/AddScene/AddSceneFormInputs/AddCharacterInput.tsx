import React, { useState, useEffect } from 'react';
import {
  IonItem, IonList, IonButton, IonIcon, IonAlert,
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Character } from '../../../interfaces/scenesTypes';
import InputModal from '../../Shared/InputModal/InputModal';
import getCharactersArray from '../../../utils/getCharactersArray';
import customArraySort from '../../../utils/customArraySort';
import sceneData from '../../../data/scn_data.json';
import removeNumberAndDot from '../../../utils/removeNumberAndDot';

interface AddCharacterInputProps {
  categoryName: string | null;
  handleSceneChange: (value: any, field: string) => void
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName, handleSceneChange,
}) => {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);

  const { scenes } = sceneData;

  useEffect(() => {
    console.log('SELECTED CHARACTERS', selectedCharacters);
    handleSceneChange(selectedCharacters, 'characters');
  }, [selectedCharacters]);

  const deleteCharacter = (characterNum: string | null) => {
    if (characterNum) {
      setSelectedCharacters((currentCharacters) => currentCharacters.filter((character: Character) => character.characterNum !== characterNum));
    }
  };

  const getSortedCharacterNames = customArraySort(getCharactersArray());

  const toggleCharacters = (character: string) => {
    const sceneWithCharacter = scenes.find((scene: any) => scene.characters.some((char: any) => char.characterName.toUpperCase() === removeNumberAndDot(character.toUpperCase())));
  
    const characterObject = sceneWithCharacter?.characters.find((char: any) => char.characterName.toUpperCase() === removeNumberAndDot(character.toUpperCase()));
  
    if (characterObject) {
      const selectedCharacterObjectIndex = selectedCharacters.findIndex((char: any) => char.characterName === characterObject.characterName);
      if (selectedCharacterObjectIndex !== -1) {
        setSelectedCharacters((currentCharacters) => currentCharacters.filter((char: any) => char.characterName !== characterObject.characterName));
      } else {
        const newCharacter: any = { ...characterObject };
        newCharacter.categoryName = newCharacter.categoryName !== 'NO CATEGORY' ? null : categoryName; 
        setSelectedCharacters((currentCharacters) => [...currentCharacters, newCharacter]);
      }
    }
  }

  return (
    <>
      {selectedCharacters.length > 0 && (
        <IonList className="ion-no-padding ion-no-margin">
          {selectedCharacters.map((character, index) => (
            <IonItem
              key={`character-item-${index}`}
              color="tertiary"
              className="ion-no-margin category-items"
            >
              {`${character.characterNum}. ${character.characterName}`}
              <IonButton fill="clear" color="danger" slot="end" onClick={() => deleteCharacter(character.characterNum)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
      <InputModal
        optionName='character'
        listOfOptions={getSortedCharacterNames}
        modalTrigger='open-character-options-modal'
        handleCheckboxToggle={toggleCharacters}
        selectedOptions={selectedCharacters.map((character) => character.characterName)}
      />
    </>
  );
};

export default AddCharacterInput;
