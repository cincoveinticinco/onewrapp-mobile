import React, { useEffect, useState } from 'react';
import { IonItem, IonInput } from '@ionic/react';
import { Controller, FieldValues } from 'react-hook-form';

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

}) => {
  const [showError, setShowError] = useState(false);

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
            label={showError ? 'REQUIRED' : label}
            labelPlacement="stacked"
            value={field.value}
            onIonChange={(e) => {
              if (validate && !validate(e.detail.value) === true) {
                setShowError(true);
              } else {
                setShowError(false);
              }
              setValue(fieldName, e.detail.value);
            }}
            className={`add-scene-input${showError ? ' error' : ''}`}
          />
        )}
      />
    </IonItem>
  );
};

export default InputItem;
