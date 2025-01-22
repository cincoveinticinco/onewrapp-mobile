import {
  IonInput, IonItem, IonSelect, IonSelectOption,
} from '@ionic/react';
import { useState } from 'react';
import { Character } from '../../../../Shared/types/scenes.types';

interface CharacterFormProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<any>>;
  characterCategories: (string | null)[]
}

const CharacterForm: React.FC<CharacterFormProps> = ({ character, setCharacter, characterCategories }) => {
  const [isFocused, setIsFocused] = useState([false, false, false]);

  return (
    <>
      <IonItem color="tertiary">
        <IonInput
          className={isFocused[0] ? 'input-item' : 'script-popup-input'}
          value={character && character.characterNum}
          labelPlacement="floating"
          label="Character Number"
          placeholder="INSERT CHARACTER NUMBER"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterNum: e.detail.value || null }))}
          onFocus={() => setIsFocused([true, false, false])}
          onBlur={() => setIsFocused([false, false, false])}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '12px',
          }}
        />
      </IonItem>
      <IonItem color="tertiary">
        <IonSelect
          className={isFocused[1] ? 'input-item' : 'script-popup-input'}
          value={character.categoryName}
          labelPlacement="floating"
          label="Character Category"
          placeholder="INSERT CHARACTER CATEGORY"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, categoryName: e.detail.value || null }))}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '12px',
          }}
          onFocus={() => setIsFocused([false, true, false])}
          onBlur={() => setIsFocused([false, false, false])}
          interface="popover"
        >
          {
              characterCategories.map((category: (string | null)) => (
                category
                  ? (
                    <IonSelectOption key={category} value={category}>
                      {category.toUpperCase()}
                    </IonSelectOption>
                  )
                  : (
                    <IonSelectOption key={category} value={category}>
                      NO CATEGORY
                    </IonSelectOption>
                  )
              ))
}
        </IonSelect>
      </IonItem>
      <IonItem color="tertiary">
        <IonInput
          className={isFocused[2] ? 'input-item' : 'script-popup-input'}
          value={character && character.characterName}
          labelPlacement="floating"
          label="Character Name *"
          placeholder="INSERT CHARACTER NAME"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: e.detail.value || null }))}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '12px',
          }}
          onFocus={() => setIsFocused([false, false, true])}
          onBlur={() => setIsFocused([false, false, false])}
        />
      </IonItem>
    </>
  );
};

export default CharacterForm;
