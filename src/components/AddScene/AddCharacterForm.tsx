import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../../interfaces/scenesTypes';
import { IonInput, IonItem, IonList, IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';

interface AddCharacterFormProps {
  categoryName: string;
  showForm: boolean;
  setShowForm: (showForm: boolean) => void;
  handleSceneChange: (value: any, field: string) => void;
}

const AddCharacterForm: React.FC<AddCharacterFormProps> = ({ categoryName, showForm, setShowForm, handleSceneChange}) => {
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
    if (!newCharacterName) return; // Do nothing if the input is empty

    const newCharacter = {
      categoryName: categoryName,
      characterName: newCharacterName,
      characterNum: characters.length + 1,
    };

    setCharacters(currentCharacters => [...currentCharacters, newCharacter]);
    setShowForm(false);

    if (characterNameInputRef.current) {
      characterNameInputRef.current.value = '';
    }
  };

  return (
    <>
      {characters.length > 0 && (
        <IonList>
          {characters.map((character, index) => (
            <IonItem key={index}>
              {character.characterName}
              <IonButton slot='end' onClick={() => deleteCharacter(character.characterNum)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
      {showForm && (
        <IonItem>
          <IonInput 
            placeholder='Character Name' 
            ref={characterNameInputRef}
            clearInput={true}
          />
          <IonButton onClick={addCharacter}>Add Character</IonButton>
        </IonItem>
      )}
    </>
  );
}

export default AddCharacterForm;
