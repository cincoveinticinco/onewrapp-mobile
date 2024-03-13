import React, { useEffect, useState } from 'react';
import { IonItem, IonInput } from '@ionic/react';
import { Controller, FieldValues } from 'react-hook-form';
import './InputItem.scss';

interface InputItemProps {
  label: string;
  placeholder?: string;
  control: any;
  fieldName: string;
  inputName: string;
  displayError?: boolean;
  setValue: any;
  validate?: any;
  type?: any;
  errorMessage?: string;
}

const InputItem: React.FC<InputItemProps> = ({
  label,
  placeholder = '',
  control,
  fieldName,
  inputName,
  displayError = false,
  setValue,
  validate,
  type = 'text',
  errorMessage = 'REQUIRED *',
}) => {
  const [showError, setShowError] = useState(displayError);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  return (
    <IonItem color="tertiary" id={inputName}>
      <Controller
        control={control}
        name={fieldName}
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
            labelPlacement="stacked"
            value={field.value}
            onIonInput={(e) => {
              if (validate && validate(e.detail.value?.trim()) !== true) {
                setShowError(true);
              } else {
                setShowError(false);
              }
              setValue(fieldName, e.detail.value?.trim());
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
