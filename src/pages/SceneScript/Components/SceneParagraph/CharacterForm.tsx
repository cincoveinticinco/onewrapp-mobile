import React from 'react';
import { IonInput, IonItem } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { Character } from '../../../../Shared/types/scenes.types';
import SelectItem from '../../../AddScene/Components/AddSceneFormInputs/SelectItem';

interface CharacterFormProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  characterCategories: (string | null)[];
  setCharacterCategories: React.Dispatch<React.SetStateAction<(string | null)[]>>;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ 
  character, 
  setCharacter, 
  characterCategories,
  setCharacterCategories 
}) => {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      characterNum: character.characterNum || '',
      categoryName: character.categoryName || '',
      characterName: character.characterName || ''
    }
  });

  const handleCharacterNumChange = (num: string | null) => {
    setCharacter((prevCharacter) => ({ 
      ...prevCharacter, 
      characterNum: num 
    }));
  };

  const handleCategoryChange = (category: string | null) => {
    setCharacter((prevCharacter) => ({ 
      ...prevCharacter, 
      categoryName: category || '' 
    }));
  };

  const handleCharacterNameChange = (name: string) => {
    setCharacter((prevCharacter) => ({ 
      ...prevCharacter, 
      characterName: name 
    }));
  };

  return (
    <>
      <IonItem color="tertiary">
        <IonInput
          value={character.characterNum}
          labelPlacement="floating"
          label="CHARACTER NUMBER"
          placeholder="INSERT CHARACTER NUMBER"
          onIonChange={(e) => handleCharacterNumChange(e.detail.value || null)}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '16px',
            textTransform: 'uppercase'
          }}
        />
      </IonItem>

      <SelectItem
        label="CHARACTER CATEGORY"
        options={characterCategories.filter(category => category !== null) as string[]}
        control={control}
        fieldKeyName="categoryName"
        inputName="characterCategory"
        setValue={setValue}
        watchValue={watch}
        canCreateNew={true}
        setOptions={(newCategories: any) => {
          setCharacterCategories(newCategories);
        }}
        afterSelection={() => {
          const selectedCategory = watch('categoryName');
          handleCategoryChange(selectedCategory);
        }}
      />
      
      <IonItem color="tertiary">
        <IonInput
          value={character.characterName}
          labelPlacement="floating"
          label="CHARACTER NAME *"
          placeholder="INSERT CHARACTER NAME"
          onIonChange={(e) => handleCharacterNameChange(e.detail.value || '')}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '16px',
            textTransform: 'uppercase'
          }}
        />
      </IonItem>
    </>
  );
};

export default CharacterForm;