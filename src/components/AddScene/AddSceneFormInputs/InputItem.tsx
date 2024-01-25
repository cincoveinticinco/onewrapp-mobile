import React from 'react';
import { IonItem, IonLabel, IonInput } from '@ionic/react';

interface InputItemProps {
  label: string;
  placeholder?: string;
  value: any;
  onChange: (event: CustomEvent) => void;
  inputName: string;
}

const InputItem: React.FC<InputItemProps> = ({
  label, placeholder, value, onChange, inputName,
}) => (
  <IonItem color="tertiary" id={inputName}>
    <IonInput
      placeholder={placeholder}
      label={label}
      labelPlacement="stacked"
      value={value}
      onIonChange={onChange}
      class="add-scene-input"
    />
  </IonItem>
);

export default InputItem;
