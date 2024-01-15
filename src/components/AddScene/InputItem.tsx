import React from 'react';
import { IonItem, IonLabel, IonInput } from '@ionic/react';

interface InputItemProps {
  label: string;
  placeholder?: string;
  value: any;
  onChange: (event: CustomEvent) => void;
}

const InputItem: React.FC<InputItemProps> = ({ label, placeholder, value, onChange }) => {
  return (
    <IonItem>
      <IonInput placeholder={placeholder} label={label} labelPlacement='stacked' value={value} onIonChange={onChange} />
    </IonItem>
  );
};

export default InputItem;
