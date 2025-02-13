import React, { useContext } from 'react';
import {
  IonButton,
  IonCardContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
} from '@ionic/react';
import { Character } from '../../../../Shared/types/scenes.types';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';
import { VscEdit } from 'react-icons/vsc';

interface AddCharacterInputProps {
  categoryName: string | null;
  selectedCharacters: any;
  setSelectedCharacters: (value: any) => void;
  editMode?: boolean;
  openEditCharacter: (character: Character) => void;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName,
  selectedCharacters,
  setSelectedCharacters,
  editMode,
  openEditCharacter
}) => {

  const filterSelectedCharacters = selectedCharacters.filter((character: any) => {
    if (categoryName === EmptyEnum.NoCategory || !categoryName) {
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
    <IonCardContent className={contentStyle} color='tertiary-dark'>
      {filterSelectedCharacters.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedCharacters.map((character: any, index: number) => (
            <IonItemSliding key={`character-item-${index}-category-${categoryName}`}>
              <IonItem color='tertiary-dark'>
              <p>{`${character.characterNum ? `${character.characterNum}.` : ''} ${character.characterName.toUpperCase()}`}</p>
              </IonItem>
              {editMode && (
              <>
              <IonItemOptions side="end">
                <IonItemOption color='dark' onClick={() => openEditCharacter(character)}>
                  <IonButton fill="clear" color='primary' slot="end">
                      <VscEdit className="label-button" />
                  </IonButton>
                </IonItemOption>
                <IonItemOption color='dark' onClick={() => deleteCharacter(character.characterName)}>
                  <DeleteButton
                    onClick={() => {}}
                    slot="end"
                  />
                </IonItemOption>
              </IonItemOptions>
              </>
              )}
            </IonItemSliding>
          ))}
        </IonList>
      ) : (
        <NoAdded />
      )}
    </IonCardContent>
  );
};

export default AddCharacterInput;
