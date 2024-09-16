import {
  IonButton,
  IonCheckbox,
  IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonModal, IonRow
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputItem from '../../AddScene/AddSceneFormInputs/InputItem';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import './EditionModal.scss';
import CustomSelect from '../CustomSelect/CustomSelect';
import SelectItem from '../SelectInput/SelectInput';

export interface FormInput {
  fieldKeyName: string;
  label: string;
  placeholder: string;
  type: string;
  col?: string;
  inputName?: string;
  required?: boolean;
  selectOptions?: SelectOptionsInterface[];
  search?: boolean;
}

export interface SelectOptionsInterface {
  value: any;
  label: string;
  style?: {
    [key: string]: string;
  };
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
  defaultFormValues?: any;
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
    if (defaultFormValues) {
      formInputs.forEach((input: any) => {
        setValue(input.fieldKeyName, defaultFormValues[input.fieldKeyName]);
      });
    } else {
      formInputs.forEach((input: any) => {
        resetField(input.fieldKeyName);
      });
    }
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
    watch,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const setNewOptionValue = (fieldKeyName: string, value: string) => {
    if ((value === '' || !value) && fieldKeyName !== 'characterNum') {
      return setValue(fieldKeyName, null);
    }
    console.log(value);
    setValue(fieldKeyName, value);
    console.log(watch(fieldKeyName));
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

  const handleCheckboxChange = (fieldKeyName: string, checked: boolean) => {
    console.log('fieldKeyName', fieldKeyName, 'TESTING');
    setValue(fieldKeyName, checked);
  };

  return (
    <IonModal
      ref={modalRef}
      className="general-modal-styles"
      id={modalId}
      onDidPresent={() => onDidPresent()}
      isOpen={isOpen}
    >
      <IonContent color="tertiary">
        <IonHeader className="add-new-option-description" mode="ios" />
        <IonButton fill='clear' className='back-button' onClick={closeModal}>
          BACK
        </IonButton>
        <h1 style={{width: '100%', textAlign: 'center', marginTop: '20%'}}>{title.toUpperCase()}</h1>
        {formInputs && (
          <IonGrid className="edit-inputs-wrapper" fixed style={{maxWidth: '600px'}}>
            <IonRow>
              {formInputs.map((input: any, i: number) => (
                <IonCol key={i} offset={input.offset || 0} sizeSm={input.col || '6'} sizeXs="12" className="ion-flex ion-justify-content-center">
                  {input.type === 'select' ? (
                    input.search ? (
                      <CustomSelect input={input} setNewOptionValue={setNewOptionValue} enableSearch />
                    ) : (
                      <SelectItem
                        control={control}
                        fieldKeyName={input.fieldKeyName}
                        label={input.label}
                        inputName={input.fieldKeyName}
                        options={input.selectOptions}
                        canCreateNew={false}
                        setValue={setNewOptionValue}
                        validate={() => true}
                        watchValue={watch}
                        editMode={false}
                        detailsEditMode={false}
                        style={{ width: '100%' }}
                      />
                    )
                  ) : input.type === 'checkbox' ? (
                    <IonItem
                      color="tertiary"
                      lines="none"
                      className="checkbox"
                      style={{
                        width: '100%',
                      }}
                    >
                      <IonCheckbox
                        checked={watch(input.fieldKeyName)}
                        onIonChange={(e) => handleCheckboxChange(input.fieldKeyName, e.detail.checked)}
                        class="checkbox"
                      />
                      <IonLabel className="ion-padding-start">{input.label}</IonLabel>
                    </IonItem>
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
        <div className="edit-new-option-buttons-container ion-flex-column ">
          <OutlinePrimaryButton
            buttonName="SAVE"
            onClick={handleSubmit(submitEdition)}
            className="modal-confirm-button"
            color='success'
          />
          <IonButton
            onClick={closeModal}
            className="modal-cancel-button clear-danger-button"
          >
            CANCEL
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default EditionModal;
