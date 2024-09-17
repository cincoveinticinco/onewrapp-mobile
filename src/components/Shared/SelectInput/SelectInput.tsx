import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import SelectionModal from '../../../Layouts/SelectionModal/SelectionModal';
import { SelectOptionsInterface } from '../EditionModal/EditionModal';

interface SelectItemProps {
  label: string;
  options: SelectOptionsInterface[];
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
  style?: any;
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
  style = {},
}) => {
  const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    setShowError(displayError);
  }, [displayError]);

  const currentFieldValue = watchValue(fieldKeyName);

  const mapValueToString = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return value.getValue || value.id || JSON.stringify(value);
    }
    return String(value);
  };

  const mapStringToValue = (str: string): any => {
    const option = options.find((o) => mapValueToString(o.value) === str);
    return option ? option.value : str;
  };

  const mappedOptions = useMemo(() => options.map((option) => ({
    ...option,
    mappedValue: mapValueToString(option.value),
  })),
  [options]);

  const handleSelectCheckbox = (label: string) => {
    const option = options.find((o) => o.label === label);
    if (mapValueToString(currentFieldValue) === mapValueToString(option?.value)) {
      setValue(fieldKeyName, null);
    } else {
      setValue(fieldKeyName, option?.value);
    }

    if (validate(currentFieldValue)) {
      setShowError(false);
    }
  };

  const defineTrigger = () => {
    if (editMode) {
      return `edit-${inputName}`;
    }
    if (detailsEditMode) {
      return `details-edit-${inputName}`;
    }
    return inputName;
  };

  return (
    <IonItem color="tertiary" id={defineTrigger()} style={style}>
      <Controller
        control={control}
        name={fieldKeyName}
        rules={{
          validate: (validate || null),
        }}
        render={({ field }) => (
          <IonSelect
            placeholder="SELECT TYPE"
            label={showError && validate && (validate(field.value)) ? (validate(field.value)) : label.toLocaleUpperCase()}
            labelPlacement="floating"
            interface="alert"
            value={mapValueToString(watchValue(fieldKeyName))}
            onIonChange={(e) => { setValue(fieldKeyName, mapStringToValue(e.detail.value)); }}
            className={(showError ? 'error' : '')}
            mode="ios"
            disabled={disabled}
            class="uppercase"
            style={{
              width: '100%',
            }}
          >
            {mappedOptions.map((option) => (
              <IonSelectOption key={option.mappedValue} value={option.mappedValue}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        )}
      />
      <SelectionModal
        optionName={label}
        listOfOptions={options}
        modalTrigger={defineTrigger()}
        handleCheckboxToggle={handleSelectCheckbox}
        selectedOptions={[watchValue(fieldKeyName)]}
        clearSelections={() => setValue(fieldKeyName, null)}
        multipleSelections={false}
        canCreateNew={canCreateNew}
        editMode={editMode}
      />
    </IonItem>
  );
};

export default SelectItem;
