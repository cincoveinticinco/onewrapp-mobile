import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../../interfaces/scenesTypes';
import { IonInput, IonItem, IonList, IonButton, IonIcon, IonAlert } from '@ionic/react';
import { trash } from 'ionicons/icons';

interface AddCharacterInputProps {
  categoryName: string;
  handleSceneChange: (value: any, field: string) => void;
  id: number;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({ categoryName, handleSceneChange, id}) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    handleSceneChange(characters, 'characters');
  }, [characters])

  const deleteCharacter = (characterNum: number) => {
    setCharacters(currentCharacters => 
      currentCharacters.filter(character => character.characterNum !== characterNum)
    );
  };

  const handleAlertConfirm = (name: string, number: number) => {
    if (!name || number <= 0) return;
  
    const newCharacter = {
      categoryName: categoryName,
      characterName: name,
      characterNum: number,
    };
  
    setCharacters(currentCharacters => [...currentCharacters, newCharacter]);
  };

  return (
    <>
      {characters.length > 0 && (
        <IonList className='ion-no-padding ion-no-margin'>
          {characters.map((character, index) => (
            <IonItem
              key={`character-item-${index}`}
              color='tertiary'
              className='ion-no-margin category-items'
            >
              {`${character.characterNum}. ${character.characterName}`}
              <IonButton fill='clear' color="danger" slot='end' onClick={() => deleteCharacter(character.characterNum)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
        <IonAlert
          trigger='character-item-alert'
          header={'Add New Character'}
          inputs={[
            {
              name: 'name',
              type: 'text',
              placeholder: 'Character Name'
            },
            {
              name: 'number',
              type: 'number',
              placeholder: 'Character Number'
            }
          ]}
          buttons={[
            {
              text: 'Ok',
              handler: (alertData) => handleAlertConfirm(alertData.name, parseInt(alertData.number))
            }
          ]}
        />
    </>
  );
}

export default AddCharacterInput;
