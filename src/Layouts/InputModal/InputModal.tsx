import {
  IonContent, IonHeader, IonModal,
} from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputItem from '../../components/AddScene/AddSceneFormInputs/InputItem';
import ModalSearchBar from '../../components/Shared/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../components/Shared/ModalToolbar/ModalToolbar';
import OutlineLightButton from '../../components/Shared/OutlineLightButton/OutlineLightButton';
import OutlinePrimaryButton from '../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import removeNumberAndDot from '../../utils/removeNumberAndDot';
import RegularList from '../RegularCheckboxList/RegularCheckboxList';
import './InputModal.scss';
import { set } from 'lodash';

interface FormInputsProps {
  modalRef?: React.RefObject<HTMLIonModalElement>;
  label: string;
  placeholder: string;
  fieldKeyName: string;
  inputName: string;
  type: string;
}

interface InputModalProps {
  modalRef?: React.RefObject<HTMLIonModalElement>;
  optionName: string;
  listOfOptions: (string)[];
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
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  modalId?: string;
  modalTrigger?: any;
}

const InputModal: React.FC<InputModalProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  optionName,
  listOfOptions,
  handleCheckboxToggle,
  selectedOptions,
  setSelectedOptions,
  clearSelections,
  multipleSelections = true,
  canCreateNew = false,
  optionCategory,
  formInputs,
  existentOptions,
  isOpen = false,
  setIsOpen,
  modalId,
  modalTrigger,
}) => {
  const [searchText, setSearchText] = useState('');
  const [createNewMode, setCreateNewMode] = useState(false);

  const isMobile = useIsMobile();

  const clearSearchTextModal = () => {
    setSearchText('');
  };

  const closeModal = () => {
    console.log('closeModal()')
    if (modalRef.current) {
      modalRef.current.dismiss();
      setShowError(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  const uncheckedOptions = listOfOptions.filter((option: string) => !selectedOptions.includes(removeNumberAndDot(option)));

  const filteredOptions = listOfOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const uncheckedFilteredOptions = uncheckedOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const checkedSelectedOptions: any[] = listOfOptions.filter((option: string) => selectedOptions.includes(removeNumberAndDot(option)));

  const isOptionChecked = (option: string) => selectedOptions.includes(removeNumberAndDot(option));

  const defaultFormValues: any = {};

  formInputs?.forEach((input: any) => {
    defaultFormValues[input.fieldKeyName] = null;
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
      resetField(input.fieldKeyName);
    });
    newOptionArgument.categoryName = optionCategory === 'NO CATEGORY' ? null : optionCategory;
    setCreateNewMode(false);
    setShowError(false);
    setSearchText('');
    setSelectedOptions((prev: any) => [...prev, newOptionArgument]);
    closeModal();
  };

  const setNewOptionValue = (fieldKeyName: string, value: string) => {
    if ((value === '' || !value) && fieldKeyName !== 'characterNum') {
      return setValue(fieldKeyName, null);
    }
    return setValue(fieldKeyName, value);
  };

  const handleValidation = (value: string, fieldKeyName: string) => {
    if (fieldKeyName === 'characterNum') {
      return true;
    }

    if ((value === '' || !value) && fieldKeyName !== 'characterNum') {
      setShowError(true);
      setErrorMessage('REQUIRED *');
      return 'This field is required';
    }

    const optionExists = existentOptions?.findIndex((option: any) => {
      if (option[fieldKeyName]) {
        return option[fieldKeyName].toLowerCase() === value.toLowerCase();
      }
    });

    const optionExistsInSelected = selectedOptions.findIndex((option: string) => option.toLowerCase() === value.toLowerCase());

    if (fieldKeyName !== 'characterNum' && (optionExists && optionExists > -1) || (optionExistsInSelected > -1)) {
      setShowError(true);
      setErrorMessage('ALREADY EXISTS *');
      return 'This option already exists';
    }

    return true;
  };

  const cancelForm = () => {
    setCreateNewMode(false);
    formInputs?.forEach((input: any) => {
      setValue(input.fieldKeyName, null);
    });
    setShowError(false);
    setSearchText('');
    closeModal();
  };

  return (
    <IonModal
      className="general-modal-styles"
      isOpen={isOpen}
      id={modalTrigger || modalId}
      ref={modalRef}
      onDidDismiss={() => setIsOpen && setIsOpen(false)}
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
                  fieldKeyName={input.fieldKeyName}
                  inputName={input.inputName}
                  displayError={input.fieldKeyName !== 'characterNum' ? showError : false}
                  setValue={setNewOptionValue}
                  validate={input.fieldKeyName === 'characterNum' ? () => true : (value: string) => handleValidation(value, input.fieldKeyName)}
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
