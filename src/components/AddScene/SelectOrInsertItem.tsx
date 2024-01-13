import React, { useState } from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';

interface SelectOrInsertItemProps {
  label: string;
  selectValue: any;
  inputPlaceholder?: string;
  onInputChange: (event: CustomEvent) => void;
  onSelectChange: (event: CustomEvent) => void;
  options: Array<{ label: string; value: any }>;
}

const SelectOrInsertItem: React.FC<SelectOrInsertItemProps> = ({
  label,
  selectValue,
  inputPlaceholder,
  onInputChange,
  onSelectChange,
  options
}) => {
  const [isInsertMode, setIsInsertMode] = useState(selectValue === 'INSERT');

  const handleSelectChange = (event: CustomEvent) => {
    setIsInsertMode(event.detail.value === 'INSERT');
    onSelectChange(event);
  };

  return (
    <>
      <IonItem>
        <IonLabel position='stacked'>{label}</IonLabel>
        <IonSelect interface="popover" value={isInsertMode ? 'INSERT' : selectValue} onIonChange={handleSelectChange}>
          {options.map((option, index) => (
            <IonSelectOption key={index} value={option.value}>{option.label}</IonSelectOption>
          ))}
          <IonSelectOption value="INSERT">Insert</IonSelectOption>
        </IonSelect>
      </IonItem>
      {isInsertMode && (
        <IonItem>
          <IonInput clearInput={true} placeholder={inputPlaceholder} onIonChange={onInputChange} />
        </IonItem>
      )}
    </>
  );
};

export default SelectOrInsertItem;
