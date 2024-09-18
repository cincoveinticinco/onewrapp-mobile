import { IonInput, IonItem } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import './InputItem.scss';

interface InputItemProps {
  label: string;
  placeholder?: string;
  control: any;
  fieldKeyName: string;
  inputName: string;
  displayError?: boolean;
  setValue: any;
  validate?: any;
  type?: any;
  errorMessage?: string;
  style?: any
}

const InputItem: React.FC<InputItemProps> = ({
  label,
  placeholder = '',
  control,
  fieldKeyName,
  inputName,
  displayError = false,
  setValue,
  validate,
  type = 'text',
  errorMessage = 'REQUIRED *',
  style,
}) => {
  const [showError, setShowError] = useState(displayError);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  return (
    <IonItem color="tertiary" id={inputName} style={style}>
      <Controller
        control={control}
        name={fieldKeyName}
        rules={
          {
            validate: (validate || null),
          }
        }
        render={({ field }) => (
          <IonInput
            placeholder={showError ? label : placeholder}
            type={type}
            label={showError ? errorMessage : label}
            labelPlacement="floating"
            value={field.value}
            onIonInput={(e) => {
              if (validate && validate(e.detail.value?.trim()) !== true) {
                setShowError(true);
              } else {
                setShowError(false);
              }
              setValue(fieldKeyName, e.detail.value?.trim());
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`add-scene-input${showError ? ' error' : ''} ${isFocused ? 'input-item' : ''}`}
          />
        )}
      />
    </IonItem>
  );
};

export default InputItem;
