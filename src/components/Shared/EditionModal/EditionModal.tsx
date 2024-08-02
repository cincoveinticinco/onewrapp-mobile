import {
  IonCol, IonContent, IonGrid, IonHeader, IonItem, IonModal, IonRow, IonSelect, IonSelectOption,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ModalToolbar from '../ModalToolbar/ModalToolbar';
import InputItem from '../../AddScene/AddSceneFormInputs/InputItem';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';
import './EditionModal.scss';
import CustomSelect from '../CustomSelect/CustomSelect';

export interface FormInput {
  fieldKeyName: string;
  label: string;
  placeholder: string;
  type: string;
  col?: string;
  inputName?: string;
  required?: boolean;
  selectOptions?: SelectOptionsInterface[];
}

export interface SelectOptionsInterface {
  value: any;
  label: string;
}

export interface defaultFormValues {
  [key: string]: string | number | null;
}

interface EditionModalProps {
  modalRef?: React.RefObject<HTMLIonModalElement>;
  modalTrigger?: string;
  modalId?: string;
  title: string;
  formInputs: FormInput[];
  handleEdition: any;
  defaultFormValues: any;
  validate?: (value: string, keyValue?: string) => (boolean | string),
  openModal?: (modalReference: any) => void;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  onDidPresent?: () => void;
}

const EditionModal: React.FC<EditionModalProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  modalTrigger,
  title,
  formInputs,
  handleEdition,
  defaultFormValues,
  validate,
  modalId,
  isOpen,
  setIsOpen,
  onDidPresent = () => { },
}) => {
  const [errorMessage, setErrorMessage] = useState('REQUIRED *');
  const [showError, setShowError] = useState({});

  useEffect(() => {
    formInputs.forEach((input: any) => {
      setShowError((prevState: any) => ({
        ...prevState,
        [input.fieldKeyName]: false,
      }));
    });
  }, []);

  const resetFormValues = () => {
    formInputs.forEach((input: any) => {
      setValue(input.fieldKeyName, defaultFormValues[input.fieldKeyName]);
    });
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      resetFormValues();
      setShowError(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    resetFormValues();
  }, [modalTrigger]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    resetField,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const setNewOptionValue = (fieldKeyName: string, value: string) => {
    if ((value === '' || !value) && fieldKeyName !== 'characterNum') {
      return setValue(fieldKeyName, null);
    }
    return setValue(fieldKeyName, value);
  };

  const handleValidation = (value: string, fieldKeyName: string, required: boolean) => {
    if ((value === '' || !value) && fieldKeyName !== 'characterNum' && required) {
      setShowError(
        (prevState: any) => ({
          ...prevState,
          [fieldKeyName]: true,
        }),
      );
      setErrorMessage('REQUIRED *');
      return 'This field is required';
    }

    if (validate && fieldKeyName !== 'characterNum' && required) {
      const validation = validate(value, fieldKeyName);
      if (typeof validation === 'string') {
        setShowError(
          (prevState: any) => ({
            ...prevState,
            [fieldKeyName]: true,
          }),
        );
        setErrorMessage(validation);
        return validation;
      }
    }

    return true;
  };

  const submitEdition = (formData: any) => {
    handleEdition(formData);
    closeModal();
    setShowError({});
  };
  return (
    <IonModal
      ref={modalRef}
      className="general-modal-styles"
      id={modalId}
      onDidPresent={() => onDidPresent()}
      isOpen={isOpen}
    >
      <IonHeader>
        <ModalToolbar
          handleSave={closeModal}
          toolbarTitle={title}
          handleReset={() => {}}
          handleBack={closeModal}
          showReset={false}
        />
      </IonHeader>
      <IonContent color="tertiary">
        <IonHeader className="add-new-option-description" mode="ios" />
        {formInputs && (
          <IonGrid className="edit-inputs-wrapper" fixed={true}>
            <IonRow>
              {formInputs.map((input: any, i: number) => (
                <IonCol key={i} sizeSm={input.col || '12'} sizeXs='12' className="ion-flex ion-justify-content-center">
                  {input.type === 'select' ? (
                    <CustomSelect input={input} setNewOptionValue={setNewOptionValue} />
                  ) : (
                    <InputItem
                      label={input.label}
                      placeholder={input.placeholder}
                      control={control}
                      fieldKeyName={input.fieldKeyName}
                      inputName={input.inputName}
                      displayError={input.fieldKeyName !== 'characterNum' ? showError[input.fieldKeyName as keyof typeof showError] : false}
                      setValue={setNewOptionValue}
                      validate={input.fieldKeyName === 'characterNum' ? () => true : (value: string) => handleValidation(value, input.fieldKeyName, input.required)}
                      type={input.type}
                      errorMessage={errorMessage}
                      style={{ width: '100%' }}
                    />
                  )}
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
        <div className="edit-new-option-buttons-container">
          <OutlinePrimaryButton
            buttonName="SAVE"
            onClick={handleSubmit(submitEdition)}
            className="ion-margin modal-confirm-button"
          />
          <OutlineLightButton
            buttonName="CANCEL"
            onClick={closeModal}
            className="ion-margin cancel-input-modal-button cancel-button"
          />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default EditionModal;
