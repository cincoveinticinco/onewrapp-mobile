import React from 'react';
import {
  IonItem, IonSelect, IonSelectOption,
} from '@ionic/react';

interface SelectItemProps {
  label: string;
  value: any;
  onChange: (event: CustomEvent) => void;
  options: Array<{ label: string; value: any }>;
  disabled?: boolean;
  inputName: string;
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  inputName,
}) => (
  <IonItem color="tertiary" id={inputName}>
    <IonSelect
      placeholder="SELECT TYPE"
      label={label}
      labelPlacement="stacked"
      interface="popover"
      value={value}
      onIonChange={onChange}
      disabled={disabled}
    >
      {options.map((option, i) => (
        <IonSelectOption key={`select-${option}-${i}`} value={option.value}>{option.label}</IonSelectOption>
      ))}
    </IonSelect>
  </IonItem>
);

export default SelectItem;
