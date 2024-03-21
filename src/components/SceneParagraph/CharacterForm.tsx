import { IonInput, IonItem, IonSelect, IonSelectOption } from "@ionic/react";
import { Character } from "../../interfaces/scenesTypes";
import { useEffect, useState } from "react";

interface CharacterFormProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<any>>;
  characterCategories: (string | null)[]
}

const CharacterForm: React.FC<CharacterFormProps> = ({ character, setCharacter, characterCategories}) => {
  const [isFocused, setIsFocused] = useState([false, false, false]);

  console.log(characterCategories)

  return (
    <>
      <IonItem color='tertiary'>
        <IonInput
          className={isFocused[0] ? 'input-item' : 'script-popup-input'}
          value={character && character.characterNum}
          color="tertiary"
          labelPlacement="stacked"
          label="Character Number"
          placeholder="INSERT CHARACTER NUMBER"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterNum: e.detail.value || null }))}
          onFocus={() => setIsFocused([true, false, false])}
          onBlur={() => setIsFocused([false, false, false])}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
          }}
        />
      </IonItem>
      <IonItem color='tertiary'>
        <IonSelect
            className={isFocused[1] ? 'input-item' : 'script-popup-input'}
            value={character.categoryName}
            color="tertiary"
            labelPlacement="stacked"
            label="Character Category"
            placeholder="INSERT CHARACTER CATEGORY"
            onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, categoryName: e.detail.value || null }))}
            style={{
              borderBottom: '1px solid var(--ion-color-light)',
            }}
            onFocus={() => setIsFocused([false, true, false])}
            onBlur={() => setIsFocused([false, false, false])}
            interface="popover"
          >
            {
              characterCategories.map((category: (string | null)) => (
              category ?
              (<IonSelectOption key={category} value={category}>
                {category.toUpperCase()}
              </IonSelectOption>)
              :
              (<IonSelectOption key={category} value={category}>
                NO CATEGORY         
              </IonSelectOption>
            )
          ))}
          </IonSelect>
      </IonItem>
      <IonItem color='tertiary'>
        <IonInput
          className={isFocused[2] ? 'input-item' : 'script-popup-input'}
          value={character && character.characterName}
          color="tertiary"
          labelPlacement="stacked"
          label="Character Name *"
          placeholder="INSERT CHARACTER NAME"
          onIonChange={(e) => setCharacter((prevCharacter: any) => ({ ...prevCharacter, characterName: e.detail.value || null }))}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            textTransform: 'uppercase'
          }}
          onFocus={() => setIsFocused([false, false, true])}
          onBlur={() => setIsFocused([false, false, false])}
        />
      </IonItem>
    </>
  );
}



export default CharacterForm;