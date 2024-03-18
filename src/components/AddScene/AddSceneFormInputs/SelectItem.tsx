import React, { useEffect } from 'react';
import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { Controller, FieldValues, ValidateResult } from 'react-hook-form';
import InputModal from '../../../Layouts/InputModal/InputModal';

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
  editMode?: boolean;
  detailsEditMode?: boolean;
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
  validate = () => true,
  watchValue,
  canCreateNew,
  editMode,
  detailsEditMode,
}) => {
  const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  const currentFieldValue = watchValue(fieldName);

  const handleSelectCheckbox = (option: string) => {
    currentFieldValue === option ? setValue(fieldName, null) : setValue(fieldName, option);

    if (validate(currentFieldValue)) {
      setShowError(false);
    }
  };

  const defineTrigger = () => {
    if (editMode) {
      return `edit-${inputName}`;
    }
    if(detailsEditMode) {
      return `details-edit-${inputName}`;
    }
    return inputName;
  }

  return (
    <IonItem color="tertiary" id={defineTrigger()}>
      <Controller
        control={control}
        name={fieldName}
        rules={{
          validate: (validate || null),
        }}
        render={({ field }) => (
          <IonSelect
            placeholder="SELECT TYPE"
            label={showError && validate && (validate(field.value)) ? (validate(field.value)) : label}
            labelPlacement="stacked"
            interface="alert"
            value={watchValue(fieldName)}
            onIonChange={(e) => { setValue(fieldName, e.detail.value); }}
            className={(showError ? 'error' : '')}
            mode="ios"
            disabled={disabled}
          >
            {options.map((option, index) => (
              <IonSelectOption key={index} value={option}>{option.toUpperCase()}</IonSelectOption>
            ))}
          </IonSelect>
        )}
      />
      <InputModal
        optionName={label}
        listOfOptions={options}
        modalTrigger={defineTrigger()}
        handleCheckboxToggle={handleSelectCheckbox}
        selectedOptions={[watchValue(fieldName)]}
        clearSelections={() => setValue(fieldName, null)}
        multipleSelections={false}
        canCreateNew={canCreateNew}
        editMode={editMode}
      />
    </IonItem>
  );
};

export default SelectItem;
