import {
  IonContent, IonHeader, IonModal,
} from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useIsMobile from '../../hooks/useIsMobile';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import './InputModal.scss';
import ModalSearchBar from '../../components/Shared/ModalSearchBar/ModalSearchBar';
import removeNumberAndDot from '../../utils/removeNumberAndDot';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import InputItem from '../../components/AddScene/AddSceneFormInputs/InputItem';
import RegularList from '../RegularCheckboxList/RegularCheckboxList';

interface FormInputsProps {
  label: string;
  placeholder: string;
  fieldName: string;
  inputName: string;
  type: string;
}

interface InputModalProps {
  optionName: string;
  listOfOptions: (string)[];
  modalTrigger: string;
  handleCheckboxToggle: (option: string) => void;
  selectedOptions: string[];
  setSelectedOptions?: any;
  clearSelections: () => void;
  multipleSelections?: boolean;
  canCreateNew?: boolean;
  editMode?: boolean;
  optionCategory?: string;
  formInputs?: FormInputsProps[];
  existentOptions?: any[];
}

const InputModal: React.FC<InputModalProps> = ({
  optionName,
  listOfOptions,
  modalTrigger,
  handleCheckboxToggle,
  selectedOptions,
  setSelectedOptions,
  clearSelections,
  multipleSelections = true,
  canCreateNew = false,
  optionCategory,
  formInputs,
  existentOptions,
}) => {
  const [searchText, setSearchText] = useState('');
  const [createNewMode, setCreateNewMode] = useState(false);

  const modalRef = useRef<HTMLIonModalElement>(null);

  const isMobile = useIsMobile();

  const clearSearchTextModal = () => {
    setSearchText('');
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
    setSearchText('');
  };

  const uncheckedOptions = listOfOptions.filter((option: string) => !selectedOptions.includes(removeNumberAndDot(option)));

  const filteredOptions = listOfOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const uncheckedFilteredOptions = uncheckedOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const checkedSelectedOptions: any[] = listOfOptions.filter((option: string) => selectedOptions.includes(removeNumberAndDot(option)));

  const isOptionChecked = (option: string) => selectedOptions.includes(removeNumberAndDot(option));

  const defaultFormValues: any = {};

  formInputs?.forEach((input: any) => {
    defaultFormValues[input.fieldName] = null;
  });

  const [errorMessage, setErrorMessage] = useState('REQUIRED *');
  const [showError, setShowError] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    resetField,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const handleSaveNewOption = (newOptionArgument: any) => {
    formInputs?.forEach((input: any) => {
      resetField(input.fieldName);
    });
    newOptionArgument.categoryName = optionCategory === 'NO CATEGORY' ? null : optionCategory;
    setCreateNewMode(false);
    setShowError(false);
    setSearchText('');
    setSelectedOptions((prev: any) => [...prev, newOptionArgument]);
    closeModal();
  };

  const setNewOptionValue = (fieldName: string, value: string) => {
    if ((value === '' || !value) && fieldName !== 'characterNum') {
      return setValue(fieldName, null);
    }
    return setValue(fieldName, value);
  };

  const handleValidation = (value: string, fieldName: string) => {
    if (fieldName === 'characterNum') {
      return true;
    }

    if ((value === '' || !value) && fieldName !== 'characterNum') {
      setShowError(true);
      setErrorMessage('REQUIRED *');
      return 'This field is required';
    }

    const optionExists = existentOptions?.findIndex((option: any) => {
      if (option[fieldName]) {
        return option[fieldName].toLowerCase() === value.toLowerCase();
      }
    });

    const optionExistsInSelected = selectedOptions.findIndex((option: string) => option.toLowerCase() === value.toLowerCase());

    if (fieldName !== 'characterNum' && (optionExists && optionExists > -1) || (optionExistsInSelected > -1)) {
      setShowError(true);
      setErrorMessage('ALREADY EXISTS *');
      return 'This option already exists';
    }

    return true;
  };

  const cancelForm = () => {
    setCreateNewMode(false);
    formInputs?.forEach((input: any) => {
      setValue(input.fieldName, null);
    });
    setShowError(false);
    setSearchText('');
  };

  return (
    <IonModal
      ref={modalRef}
      trigger={modalTrigger}
      id="add-scenes-options-modal"
    >
      <IonHeader>
        <ModalToolbar
          handleSave={closeModal}
          toolbarTitle={optionName}
          handleReset={clearSelections}
          handleBack={closeModal}
          showReset={false}
        />
      </IonHeader>
      {canCreateNew && createNewMode ? (
        <IonContent color="tertiary">
          <IonHeader className="add-new-option-description" mode="ios">
            Please, fill the form to create a new option
          </IonHeader>
          {
              formInputs
              && formInputs.map((input: any, i: any) => (
                <InputItem
                  key={i}
                  label={input.label}
                  placeholder={input.placeholder}
                  control={control}
                  fieldName={input.fieldName}
                  inputName={input.inputName}
                  displayError={input.fieldName !== 'characterNum' ? showError : false}
                  setValue={setNewOptionValue}
                  validate={input.fieldName === 'characterNum' ? () => true : (value: string) => handleValidation(value, input.fieldName)}
                  type={input.type}
                  errorMessage={errorMessage}
                />
              ))
            }
          <div className="add-new-option-buttons-container">
            <OutlinePrimaryButton
              buttonName="SAVE"
              onClick={handleSubmit(handleSaveNewOption)}
              className="ion-margin modal-confirm-button"
            />

            <OutlineLightButton
              buttonName="CANCEL"
              onClick={cancelForm}
              className="ion-margin cancel-input-modal-button cancel-button"
            />
          </div>
        </IonContent>
      ) : (
        <IonContent color="tertiary">
          <ModalSearchBar searchText={searchText} setSearchText={setSearchText} showSearchBar={listOfOptions.length > 10} />
          {
            searchText.length > 0
            && filteredOptions.length === 0
            && (
            <p className="no-items-message">
              There are no coincidences. Do you want to
              <span onClick={() => setSearchText('')} style={{ color: 'var(--ion-color-primary)' }}>reset </span>
              ?
            </p>
            )
          }
          <>
            <RegularList
              listOfOptions={listOfOptions}
              selectedOptions={selectedOptions}
              handleCheckboxToggle={handleCheckboxToggle}
              isOptionChecked={isOptionChecked}
              multipleSelections={multipleSelections}
              searchText={searchText}
              checkedSelectedOptions={checkedSelectedOptions}
              uncheckedFilteredOptions={uncheckedFilteredOptions}
            />
            {
              filteredOptions.length === 0 && canCreateNew
                && (
                <p className="no-items-message">
                  There are no coincidences. Do you want to create a new one ?
                  <span className="no-items-buttons-container ion-flex ion-justify-content-center ion-align-items-center">
                    <OutlinePrimaryButton buttonName="CREATE NEW" className="ion-margin no-items-confirm" onClick={() => setCreateNewMode(true)} />
                    <OutlineLightButton buttonName="CANCEL" className="ion-margin cancel-button no-items-cancel" onClick={clearSearchTextModal} />
                  </span>
                </p>
                )
              }
            {
              filteredOptions.length > 0
              && (
              <OutlinePrimaryButton
                buttonName="SAVE"
                onClick={closeModal}
                className="ion-margin modal-confirm-button"
              />
              )
            }
            {
              isMobile
              && filteredOptions.length > 0
              && (
              <OutlineLightButton
                buttonName="CANCEL"
                onClick={closeModal}
                className="ion-margin cancel-input-modal-button cancel-button"
              />
              )
            }
          </>
        </IonContent>
      )}
    </IonModal>
  );
};

export default InputModal;
