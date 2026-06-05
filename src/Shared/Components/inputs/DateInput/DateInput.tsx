import React from 'react';
import { 
  IonItem, 
  IonLabel, 
  IonInput 
} from '@ionic/react';
import { Control, Controller } from 'react-hook-form';
import './DateInput.css';

export type DateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

interface DateInputProps {
  label: string;
  fieldKeyName: string;
  control: Control<any>;
  placeholder?: string;
  required?: boolean;
  displayError?: boolean;
  errorMessage?: string;
  style?: React.CSSProperties;
  onValueChanges?: (value: string) => void;
  min?: DateString;
  max?: DateString;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  fieldKeyName,
  control,
  placeholder = 'Select Date',
  required = false,
  displayError = false,
  errorMessage = 'REQUIRED *',
  style,
  onValueChanges,
  min,
  max,
}) => {

  return (
    <Controller
      name={fieldKeyName}
      control={control}
      rules={{ 
        required: required ? errorMessage : false 
      }}
      render={({ field: { onChange, value } }) => (
        <div style={{ width: '100%', ...style }}>
          <IonItem color="tertiary" lines="none" className='ion-no-margin ion-no-padding' style={{overflow: 'show'}}>
            <IonInput
              type="date"
              value={value}
              placeholder={placeholder}
              label={label.toUpperCase()}
              labelPlacement='floating'
              onIonChange={(e) => {
                const dateValue = e.detail.value || '';
                onChange(dateValue);
                onValueChanges?.(dateValue);
              }}
              min={min}
              max={max}
              className='input-item'
            />
          </IonItem>
          {displayError && (
            <div style={{ 
              color: 'var(--ion-color-danger)', 
              fontSize: '0.8em', 
              marginTop: '5px',
              marginLeft: '16px'
            }}>
              {errorMessage}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default DateInput;
