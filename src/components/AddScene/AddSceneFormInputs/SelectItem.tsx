import React, { useEffect } from 'react';
import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { Controller, FieldValues, ValidateResult } from 'react-hook-form';
import InputModal from '../../Shared/InputModal/InputModal';

interface SelectItemProps {
  label: string;
  options: string[];
  control: any;
  fieldName: string;
  displayError?: boolean;
  inputName: string;
  disabled?: boolean;
  setValue: any;
  validate?: any;
  watchValue: any;
  canCreateNew?: boolean;
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  options,
  control,
  fieldName,
  displayError = false,
  inputName,
  disabled = false,
  setValue,
  validate = () => {return true},
  watchValue,
  canCreateNew
}) => {
  const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  let currentFieldValue = watchValue(fieldName);


  const handleSelectCheckbox = (option: string) => {
    currentFieldValue === option ? setValue(fieldName, null) : setValue(fieldName, option);

    if(validate(currentFieldValue)) {
      setShowError(false);
    }
  }

  return (
  <IonItem color="tertiary" id={inputName}>
    <Controller
      control={control}
      name={fieldName}
      rules={{
        validate: (validate ? validate : null)
      }}
      render={({ field }) => (
        <IonSelect
          placeholder="SELECT TYPE"
          label={showError && validate && (validate(field.value)) ? (validate(field.value)) : label}
          labelPlacement="stacked"
          interface="alert"
          value={watchValue(fieldName)}
          onIonChange={(e) => {setValue(fieldName, e.detail.value)}}
          className={(showError ? 'error' : '')}
          mode='ios'
          disabled={disabled}
        >
          {options.map((option, index) => (
            <IonSelectOption key={index} value={option}>{option.toUpperCase()}</IonSelectOption>
          ))}
        </IonSelect>
      )}
    />
    <InputModal 
      optionName = {label}
      listOfOptions = {options}
      modalTrigger={inputName}
      handleCheckboxToggle={handleSelectCheckbox}
      selectedOptions={[watchValue(fieldName)]}
      clearSelections={() => setValue(fieldName, null)}
      multipleSelections={false}
      canCreateNew={canCreateNew}
    />
  </IonItem>
)};

export default SelectItem;
