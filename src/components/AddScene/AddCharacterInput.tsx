import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../../interfaces/scenesTypes';
import { IonInput, IonItem, IonList, IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';

interface AddCharacterInputProps {
  categoryName: string;
  toggleForm: (index: number) => void;
  handleSceneChange: (value: any, field: string) => void;
  id: number;
}

const AddCharacterInput: React.FC<AddCharacterInputProps> = ({ categoryName, toggleForm, handleSceneChange, id}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const characterNameInputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    handleSceneChange(characters, 'characters');
  }, [characters])

  const deleteCharacter = (characterNum: number) => {
    setCharacters(currentCharacters => 
      currentCharacters.filter(character => character.characterNum !== characterNum)
    );
  };

  const addCharacter = () => {
    const newCharacterName = characterNameInputRef.current?.value as string;
    if (!newCharacterName) return; 

    const newCharacter = {
      categoryName: categoryName,
      characterName: newCharacterName,
      characterNum: characters.length + 1,
    };

    setCharacters(currentCharacters => [...currentCharacters, newCharacter]);
    toggleForm(id)

    if (characterNameInputRef.current) {
      characterNameInputRef.current.value = '';
    }
  };

  return (
    <>
      {characters.length > 0 && (
        <IonList>
          {characters.map((character, index) => (
            <IonItem
              key={`character-item-${index}`}
            >
              {character.characterName}
              <IonButton slot='end' onClick={() => deleteCharacter(character.characterNum)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
        <IonItem
          style={{ display: 'none'}}
          id={`character-form-${id}`}
        >
          <IonInput
            placeholder='Character Name' 
            ref={characterNameInputRef}
            clearInput={true}
          />
          <IonButton onClick={addCharacter}>Add Character</IonButton>
        </IonItem>
    </>
  );
}

export default AddCharacterInput;
