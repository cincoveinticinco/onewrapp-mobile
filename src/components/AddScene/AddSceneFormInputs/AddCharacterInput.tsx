import React, { useState, useEffect } from 'react';
import {
  IonItem, IonList, IonButton, IonIcon, IonAlert,
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Character } from '../../../interfaces/scenesTypes';

interface AddCharacterInputProps {
  categoryName: string;
  handleSceneChange: (value: any, field: string) => void
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({
  categoryName, handleSceneChange,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    handleSceneChange(characters, 'characters');
  }, [characters]);

  const deleteCharacter = (characterNum: string | null) => {
    if (characterNum) {
      setCharacters((currentCharacters) => currentCharacters.filter((character: Character) => character.characterNum !== characterNum));
    }
  };

  const handleAlertConfirm = (name: string, number: number) => {
    if (!name || number <= 0) return;

    const newCharacter = {
      categoryName,
      characterName: name,
      characterNum: number,
    };

    const appendCharacter = (currentChars: any, newCharacter: any, number: any) => [
      ...currentChars,
      { ...newCharacter, characterNum: number.toString() },
    ];

    setCharacters((currChars) => appendCharacter(currChars, newCharacter, number));
  };

  return (
    <>
      {characters.length > 0 && (
        <IonList className="ion-no-padding ion-no-margin">
          {characters.map((character, index) => (
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
      <IonAlert
        trigger="character-item-alert"
        header="Add New Character"
        inputs={[
          {
            name: 'name',
            type: 'text',
            placeholder: 'Character Name',
          },
          {
            name: 'number',
            type: 'number',
            placeholder: 'Character Number',
          },
        ]}
        buttons={[
          {
            text: 'Ok',
            handler: (alertData) => {
              handleAlertConfirm(alertData.name, parseInt(alertData.number, 10));
            },
          },
        ]}
      />
    </>
  );
};

export default AddCharacterInput;
