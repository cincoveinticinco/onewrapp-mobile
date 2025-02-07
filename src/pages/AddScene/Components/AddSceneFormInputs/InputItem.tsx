import { IonInput, IonItem, IonList, IonTextarea } from '@ionic/react';
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
  style?: any;
  className?: string;
  suggestions?: string[];
  textArea?: boolean;
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
  className,
  suggestions = [],
  textArea = false,
}) => {
  const [showError, setShowError] = useState(displayError);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  const handleInputChange = (value: string) => {
    console.log(suggestions)
    if (validate && validate(value.trim()) !== true) {
      setShowError(true);
    } else {
      setShowError(false);
    }
    setValue(fieldKeyName, value.trim());

    // Filter suggestions based on input
    if (suggestions.length > 0) {
      const filtered = suggestions.filter((suggestion) => suggestion.toLowerCase().includes(value.toLowerCase()));
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(fieldKeyName, suggestion);
    setShowSuggestions(false);
  };

  return (
    <div style={style} id={inputName}>
      <IonItem color="tertiary" className='ion-no-padding'>
        <Controller
          control={control}
          name={fieldKeyName}
          rules={{
            validate: (validate || undefined),
          }}
          render={({ field, fieldState: { error } }) => (
            textArea ? (
              <IonTextarea
                placeholder={showError ? label : placeholder}
                value={field.value}
                onIonInput={(e) => {
                  let value = e.detail.value || '';
                  if(value) {
                    value = value.toUpperCase();
                  }
                  field.onChange(value.trim());
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className={`${isFocused ? 'input-item' : ''} ${className || ''}`}
              />
            ) : (
              <IonInput
                placeholder={showError ? label : placeholder}
                type={type}
                label={showError ? errorMessage : label?.toUpperCase()}
                labelPlacement="floating"
                value={field.value}
                onIonInput={(e) => {
                  let value = e.detail.value || '';
                  if(value) {
                    value = value.toUpperCase(); 
                  }
                  field.onChange(value.trim());
                }}
                onIonChange={(e) => handleInputChange(e.detail.value || '')}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className={`add-scene-input${(showError || error ) ? ' error' : ''} ${isFocused ? 'input-item' : ''} ${className || ''}`}
              />
            )
          )}
        />
      </IonItem>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <IonList className="suggestions-list">
          {filteredSuggestions.map((suggestion, index) => (
            <IonItem key={index} button onClick={() => handleSuggestionClick(suggestion)} >
              {suggestion}
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};

export default InputItem;
