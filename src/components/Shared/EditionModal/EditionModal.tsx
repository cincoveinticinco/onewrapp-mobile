import { IonContent, IonHeader, IonItem, IonModal, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ModalToolbar from '../ModalToolbar/ModalToolbar';
import InputItem from '../../AddScene/AddSceneFormInputs/InputItem';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';
import './EditionModal.scss';
import SelectItem from '../../AddScene/AddSceneFormInputs/SelectItem';

interface EditionModalProps {
  modalTrigger: string;
  modalId?: string;
  title: string;
  formInputs: any;
  handleEdition: any;
  defaultFormValues: any;
  validate?: (value: string, keyValue?: string) => (boolean | string)
}

const EditionModal: React.FC<EditionModalProps> = ({
  modalTrigger,
  title,
  formInputs,
  handleEdition,
  defaultFormValues,
  validate,
  modalId
}) => {
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [errorMessage, setErrorMessage] = useState('REQUIRED *');
  const [showError, setShowError] = useState({});

  useEffect(() => {
    formInputs.forEach((input: any) => {
      setShowError((prevState: any) => ({
        ...prevState,
        [input.fieldName]: false,
      }));
    });
  }, []);

  const resetFormValues = () => {
    formInputs.forEach((input: any) => {
      setValue(input.fieldName, defaultFormValues[input.fieldName]);
    });
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      resetFormValues();
      setShowError(false);
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

  const setNewOptionValue = (fieldName: string, value: string) => {
    if ((value === '' || !value) && fieldName !== 'characterNum') {
      return setValue(fieldName, null);
    }
    return setValue(fieldName, value);
  };

  const handleValidation = (value: string, fieldName: string, required: boolean) => {
    if ((value === '' || !value) && fieldName !== 'characterNum' && required) {
      setShowError(
        (prevState: any) => ({
          ...prevState,
          [fieldName]: true,
        }),
      );
      setErrorMessage('REQUIRED *');
      return 'This field is required';
    }

    if (validate && fieldName !== 'characterNum' && required) {
      const validation = validate(value);
      if (typeof validation === 'string') {
        setShowError(
          (prevState: any) => ({
            ...prevState,
            [fieldName]: true,
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
      trigger={modalTrigger}
      id="add-scenes-options-modal"
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
        <IonHeader className="add-new-option-description" mode="ios">
          Please Add The New information
        </IonHeader>
        {
              formInputs
              && (
              <div className="edit-inputs-wrapper">
                {
                  formInputs.map((input: any, i: any) => (
                    input.type === 'select' ?
                    <IonItem color='tertiary' key={i}>
                      <IonSelect
                        key={i}
                        placeholder={input.placeholder}
                        onIonChange={(e) => setNewOptionValue(input.fieldName, e.detail.value)}
                        interface="popover"
                        label="Stacked label" label-placement="stacked"
                      >
                        {
                          input.selectOptions.map((option: any, index: any) => (
                            <IonSelectOption key={index} value={option.value}>{option.label.toUpperCase()}</IonSelectOption>
                          ))
                        }
                      </IonSelect>
                    </IonItem>
                    :      
                    <InputItem
                      key={i}
                      label={input.label}
                      placeholder={input.placeholder}
                      control={control}
                      fieldName={input.fieldName}
                      inputName={input.inputName}
                      displayError={input.fieldName !== 'characterNum' ? showError[input.fieldName as keyof typeof showError] : false}
                      setValue={setNewOptionValue}
                      validate={input.fieldName === 'characterNum' ? () => true : (value: string) => handleValidation(value, input.fieldName, input.required)}
                      type={input.type}
                      errorMessage={errorMessage}
                    />
                  ))
                }
              </div>
              )
            }
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
