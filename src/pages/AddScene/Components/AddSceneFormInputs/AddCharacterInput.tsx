import React, { useContext } from 'react';
import {
  IonCardContent,
  IonList,
} from '@ionic/react';
import { Character } from '../../../../Shared/types/scenes.types';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';

interface AddCharacterInputProps {
  categoryName: string | null;
  selectedCharacters: any;
  setSelectedCharacters: (value: any) => void;
  editMode?: boolean;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName,
  selectedCharacters,
  setSelectedCharacters,
  editMode,
}) => {
  const filterSelectedCharacters = selectedCharacters.filter((character: any) => {
    if (categoryName === 'NO CATEGORY' || !categoryName) {
      return character.categoryName === null || character.categoryName === '' || character.categoryName === undefined;
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

  const contentStyle = selectedCharacters.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedCharacters.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedCharacters.map((character: any, index: number) => (
            <div
              key={`character-item-${index}-category-${categoryName}`}
              style={{ backgroundColor: 'var(--ion-color-tertiary-dark)', color: 'var(--ion-color-light)'}}
              className="ion-no-margin category-items ion-flex ion-justify-content-between ion-align-items-center"
            >
              {`${character.characterNum ? `${character.characterNum}.` : ''} ${character.characterName.toUpperCase()}`}
              {editMode && (<DeleteButton
                onClick={() => deleteCharacter(character.characterName)}
                slot="end"
              />)}
            </div>
          ))}
        </IonList>
      ) : (
        <NoAdded />
      )}
    </IonCardContent>
  );
};

export default AddCharacterInput;
