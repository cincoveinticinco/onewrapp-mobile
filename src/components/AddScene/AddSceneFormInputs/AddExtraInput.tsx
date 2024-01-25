import React, { useState, useRef, useEffect } from 'react';
import {
  IonInput, IonItem, IonList, IonButton, IonIcon,
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Extra } from '../../../interfaces/scenesTypes';

interface AddExtraInputProps {
  categoryName: string;
  toggleForm: (index: number) => void;
  handleSceneChange: (value: any, field: string) => void;
  id: number;
}

const AddExtraInput: React.FC<AddExtraInputProps> = ({
  categoryName, toggleForm, id, handleSceneChange,
}) => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const extraNameInputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    handleSceneChange(extras, 'extras');
  }, [extras]);

  const deleteExtra = (index: number) => {
    setExtras((currentExtras) => currentExtras.filter((_, i) => i !== index));
  };

  const addExtra = () => {
    const newExtraName = extraNameInputRef.current?.value as string;
    if (!newExtraName) return;

    const newExtra: Extra = {
      categoryName,
      extraName: newExtraName,
    };

    setExtras((currentExtras) => [...currentExtras, newExtra]);
    toggleForm(id);

    if (extraNameInputRef.current) {
      extraNameInputRef.current.value = '';
    }
  };

  return (
    <>
      {extras.length > 0 && (
        <IonList
          className="ion-no-padding ion-no-margin"
        >
          {extras.map((extra, index) => (
            <IonItem
              key={index}
              color="tertiary"
              className="ion-no-margin category-items"
            >
              {extra.extraName}
              <IonButton color="danger" fill="clear" slot="end" onClick={() => deleteExtra(index)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
      <IonItem
        style={{ display: 'none' }}
        id={`extra-form-${id}`}
        color="tertiary"
      >
        <IonInput
          placeholder="Extra Name"
          ref={extraNameInputRef}
          clearInput
        />
        <IonButton onClick={addExtra}>Add Extra</IonButton>
      </IonItem>
    </>
  );
};

export default AddExtraInput;
