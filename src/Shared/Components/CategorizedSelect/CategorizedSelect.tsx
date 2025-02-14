import React, { useState } from "react";
import InputModalWithSections, { ListOfOptionsItem } from "../../../Layouts/InputModalWithSections/InputModalWithSections";
import { IonItem, IonSelect, IonSelectOption } from "@ionic/react";
import { Controller } from "react-hook-form";

interface CategorizedSelectProps {
  label: string;
  options: ListOfOptionsItem[];
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
  setOptions?: (options: ListOfOptionsItem[]) => void;
  ref?: any;
  selectedCategory?: string;
  multiple?: boolean;
  customCategoryLabel?: string;
}

const CategorizedSelect: React.FC<CategorizedSelectProps> = ({
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
  canCreateNew = false,
  editMode,
  detailsEditMode,
  showLabel = true,
  className = '',
  setOptions,
  ref,
  selectedCategory,
  multiple = false,
  customCategoryLabel,
}) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = React.useRef<HTMLIonModalElement>(null);
  const inputRef = React.useRef<HTMLIonItemElement>(null);

  const currentFieldValue = watchValue(fieldKeyName);

  const handleSetValues = (selectedValues: { value: string | number; category: string | null }[]) => {
    if (selectedValues.length > 0) {
      const selectedValue = selectedValues[0];
      setValue(fieldKeyName, selectedValue.value);
    } else {
      setValue(fieldKeyName, null);
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

  // Transform current value to match the expected format for the modal
  const transformOptionsToModal = (opts: ListOfOptionsItem[]): ListOfOptionsItem[] => {
    return opts.map(category => ({
      ...category,
      options: category.options.map(option => ({
        ...option,
        checked: option.value === currentFieldValue
      }))
    }));
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
              {options.flatMap(category => 
                category.options.map(option => (
                  <IonSelectOption key={`${category.category}-${option.value}`} value={option.value}>
                    {`${option.label} (${category.category?.toLocaleUpperCase()})`}
                  </IonSelectOption>
                ))
              )}
            </IonSelect>
            <InputModalWithSections
              modalRef={modalRef}
              optionName={label}
              listOfOptions={transformOptionsToModal(options)}
              clearSelections={() => setValue(fieldKeyName, null)}
              isOpen={showModal}
              setIsOpen={setShowModal}
              setValues={handleSetValues}
              selectedCategory={selectedCategory}
              multiple={multiple}
              customCategoryLabel={customCategoryLabel}
            />
          </>
        )}
      />
    </IonItem>
  );
};

export default CategorizedSelect;