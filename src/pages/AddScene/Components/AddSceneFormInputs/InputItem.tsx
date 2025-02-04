import { IonInput, IonItem, IonList } from '@ionic/react';
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
}) => {
  const [showError, setShowError] = useState(displayError);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  const handleInputChange = (value: string) => {
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
      <Controller
        control={control}
        name={fieldKeyName}
        rules={{
          validate: (validate || null),
        }}
        render={({ field }) => (
          <IonInput
            placeholder={showError ? label : placeholder}
            type={type}
            label={showError ? errorMessage : label}
            labelPlacement="floating"
            value={field.value}
            onIonInput={(e) => handleInputChange(e.detail.value || '')}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className={`add-scene-input${showError ? ' error' : ''} ${isFocused ? 'input-item' : ''} ${className || ''}`}
          />
        )}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <IonList className="suggestions-list">
          {filteredSuggestions.map((suggestion, index) => (
            <IonItem key={index} button onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};

export default InputItem;
