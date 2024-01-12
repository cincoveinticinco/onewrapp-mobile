import React from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

interface SelectItemProps {
  label: string;
  value: any;
  onChange: (event: CustomEvent) => void;
  options: Array<{ label: string; value: any }>;
  disabled?: boolean;
}

const SelectItem: React.FC<SelectItemProps> = ({ label, value, onChange, options, disabled }) => {
  return (
    <IonItem>
      <IonLabel position='stacked'>{label}</IonLabel>
      <IonSelect value={value} onIonChange={onChange} disabled={disabled}>
        {options.map((option, index) => (
          <IonSelectOption key={index} value={option.value}>{option.label}</IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
  );
};

export default SelectItem;
