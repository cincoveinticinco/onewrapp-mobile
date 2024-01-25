import React, { useState } from 'react';
import {
  IonItem, IonLabel, IonSelect, IonSelectOption, IonInput,
} from '@ionic/react';

interface SelectOrInsertItemProps {
  label: string;
  selectValue: any;
  inputPlaceholder?: string;
  onInputChange: (event: CustomEvent) => void;
  onSelectChange: (event: CustomEvent) => void;
  options: Array<{ label: string; value: any }>;
  inputName: string;
}

const SelectOrInsertItem: React.FC<SelectOrInsertItemProps> = ({
  label,
  selectValue,
  inputPlaceholder,
  onInputChange,
  onSelectChange,
  options,
  inputName,
}) => {
  const [isInsertMode, setIsInsertMode] = useState(selectValue === 'INSERT');

  const handleSelectChange = (event: CustomEvent) => {
    setIsInsertMode(event.detail.value === 'INSERT');
    onSelectChange(event);
  };

  return (
    <>
      <IonItem color="tertiary" id={inputName}>
        <IonSelect placeholder="SELECT OR INSERT" label={label} labelPlacement="stacked" interface="popover" value={isInsertMode ? 'INSERT' : selectValue} onIonChange={handleSelectChange}>
          {options.map((option, index) => (
            <IonSelectOption key={`selorin-${option}-${index}`} value={option.value}>{option.label}</IonSelectOption>
          ))}
          <IonSelectOption value="INSERT">Insert</IonSelectOption>
        </IonSelect>
      </IonItem>
      {isInsertMode && (
        <IonItem color="tertiary" className="add-scente-input-insert">
          <IonInput clearInput placeholder={inputPlaceholder} onIonChange={onInputChange} class="add-scene-input" />
        </IonItem>
      )}
    </>
  );
};

export default SelectOrInsertItem;
