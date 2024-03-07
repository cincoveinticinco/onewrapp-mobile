import { IonContent, IonHeader, IonModal } from '@ionic/react'
import React, { useRef, useState } from 'react'
import ModalToolbar from '../ModalToolbar/ModalToolbar'
import InputItem from '../../AddScene/AddSceneFormInputs/InputItem';
import { useForm } from 'react-hook-form';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';

interface EditionModalProps {
  modalTrigger: string;
  title: string;
  formInputs: any;
  handleEdition: any;
  defaultFormValues: any;
}

const EditionModal: React.FC<EditionModalProps> = ({
  modalTrigger,
  title,
  formInputs,
  handleEdition,
  defaultFormValues
}) => {

  const modalRef = useRef<HTMLIonModalElement>(null);
  const [errorMessage, setErrorMessage] = useState('REQUIRED *');
  const [showError, setShowError] = useState(false);

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

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

  const handleValidation = (value: string, fieldName: string) => {

    if ((value === '' || !value) && fieldName !== 'characterNum') {
      setShowError(true);
      setErrorMessage('REQUIRED *');
      return 'This field is required';
    }

    return true;
  };

  const submitEdition = (formData: any) => {
    handleEdition(formData);
    closeModal();
  }

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
  )
}

export default EditionModal