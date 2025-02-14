import React, { useState } from 'react';
import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { Controller } from 'react-hook-form';
import InputModal from '../../../../Layouts/InputModal/InputModal';

interface SelectItemProps {
  label: string;
  options: string[];
  control: any;
  fieldKeyName: string;
  inputName: string;
  disabled?: boolean;
  setValue: any;
  validate?: any;
  displayError?: boolean;
  watchValue: any;
  canCreateNew?: boolean;
  editMode?: boolean;
  detailsEditMode?: boolean;
  showLabel?: boolean;
  className?: string;
  setOptions: any;
  ref?: any
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  options,
  control,
  fieldKeyName,
  inputName,
  disabled = false,
  setValue,
  validate = () => true,
  displayError = false,
  watchValue,
  canCreateNew,
  editMode,
  detailsEditMode,
  showLabel = true,
  className = '',
  setOptions,
  ref
}) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = React.useRef<HTMLIonModalElement>(null);
  const inputRef = React.useRef<HTMLIonItemElement>(null);

  const currentFieldValue = watchValue(fieldKeyName);

  const handleSelectCheckbox = (option: string) => {
    const isNewOption = !options.includes(option);
    if (isNewOption) {
      setOptions([...options, option]);
    }
    currentFieldValue == option ? setValue(fieldKeyName, null) : setValue(fieldKeyName, option);
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
    <IonItem color="tertiary" id={getId()} onClick={() => setShowModal(true)} ref={ref ? ref : inputRef}>
      <Controller
        control={control}
        name={fieldKeyName}
        rules={{
          validate: validate || undefined,
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <IonSelect
              {...field}
              placeholder="SELECT TYPE"
              label={error ? (showLabel ? error.message : '') || (showLabel ? label : '') : (showLabel ? label : '')}
              labelPlacement="floating"
              interface="alert"
              value={field.value}
              className={`${(displayError || error) ? 'error' : ''} ${className}`}
              mode="ios"
              disabled={disabled}
              onIonChange={(e) => {
                field.onChange(e.detail.value);
              }}
            >
              {options.map((option, index) => (
                <IonSelectOption key={index} value={option}>
                  {option.toUpperCase()}
                </IonSelectOption>
              ))}
            </IonSelect>
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
              onNewOptionCreated={(newOption) => {
                setOptions([...options, newOption]);
              }}
            />
          </>
        )}
      />
    </IonItem>
  );
};

export default SelectItem;
