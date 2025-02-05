import React, { useEffect } from 'react';
import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { Controller, FieldValues, ValidateResult } from 'react-hook-form';
import InputModal from '../../../../Layouts/InputModal/InputModal';
import SelectionModal from '../../../../Layouts/SelectionModal/SelectionModal';

interface SelectItemProps {
  label: string;
  options: string[];
  control: any;
  fieldKeyName: string;
  displayError?: boolean;
  inputName: string;
  disabled?: boolean;
  setValue: any;
  validate?: any;
  watchValue: any;
  canCreateNew?: boolean;
  editMode?: boolean;
  detailsEditMode?: boolean;
  showLabel?: boolean;
  className?: string;
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  options,
  control,
  fieldKeyName,
  displayError = false,
  inputName,
  disabled = false,
  setValue,
  validate = () => true,
  watchValue,
  canCreateNew,
  editMode,
  detailsEditMode,
  showLabel = true,
  className = '',
}) => {
  const [showError, setShowError] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const modalRef = React.useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  const currentFieldValue = watchValue(fieldKeyName);

  const handleSelectCheckbox = (option: string) => {
    currentFieldValue === option ? setValue(fieldKeyName, null) : setValue(fieldKeyName, option);

    if (validate(currentFieldValue)) {
      setShowError(false);
    }
  };

  const getId = () => {
    if (editMode) {
      return `edit-${inputName}`;
    }
    if (detailsEditMode) {
      return `details-edit-${inputName}`;
    }
    return inputName;
  };

  return (
    <IonItem color="tertiary" id={getId()} onClick={() => setShowModal(true)}>
      <Controller
        control={control}
        name={fieldKeyName}
        rules={{
          validate: (validate || null),
        }}
        render={({ field }) => (
          <IonSelect
            placeholder="SELECT TYPE"
            label={showError && validate && (validate(field.value)) ? (validate(field.value)) : (showLabel ? label : '')}
            labelPlacement="floating"
            interface="alert"
            value={watchValue(fieldKeyName)}
            onIonChange={(e) => { setValue(fieldKeyName, e.detail.value); }}
            className={(showError ? 'error' : className)}
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
        modalRef={modalRef}
        optionName={label}
        listOfOptions={options}
        handleCheckboxToggle={handleSelectCheckbox}
        selectedOptions={[watchValue(fieldKeyName)]}
        clearSelections={() => setValue(fieldKeyName, null)}
        multipleSelections={false}
        canCreateNew={canCreateNew}
        editMode={editMode}
        isOpen={showModal}
        setIsOpen={setShowModal}
        modalId={getId()}
      />
    </IonItem>
  );
};

export default SelectItem;
