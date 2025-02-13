import {
  IonButton,
  IonContent, IonHeader, IonModal,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import ModalSearchBar from '../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../Shared/Components/ModalToolbar/ModalToolbar';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import removeNumberAndDot from '../../Shared/Utils/removeNumberAndDot';
import RegularList from '../RegularCheckboxList/RegularCheckboxList';
import './InputModal.scss';

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
  formInputs?: FormInputsProps[];
  existentOptions?: any[];
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  modalId?: string;
  modalTrigger?: any;
  onNewOptionCreated?: (newOption: string) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  optionName,
  listOfOptions,
  handleCheckboxToggle,
  selectedOptions,
  clearSelections,
  multipleSelections = true,
  canCreateNew = false,
  formInputs,
  isOpen = false,
  setIsOpen,
  modalId,
  modalTrigger,
  onNewOptionCreated,
}) => {
  const [searchText, setSearchText] = useState('');
  const [listOfOptionsCopy, setListOfOptionsCopy] = useState(listOfOptions);

  useEffect(() => {
    setListOfOptionsCopy(listOfOptions);
  }, [listOfOptions]);

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  const uncheckedOptions = listOfOptionsCopy.filter((option: string) => !selectedOptions.includes(removeNumberAndDot(option)));

  const filteredOptions = listOfOptionsCopy.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const uncheckedFilteredOptions = uncheckedOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const checkedSelectedOptions: any[] = listOfOptionsCopy.filter((option: string) => selectedOptions.includes(removeNumberAndDot(option)) && option.toLowerCase().includes(searchText.toLowerCase()));

  const isOptionChecked = (option: string) => selectedOptions.includes(removeNumberAndDot(option));

  const defaultFormValues: any = {};

  formInputs?.forEach((input: any) => {
    defaultFormValues[input.fieldKeyName] = null;
  });



  const handleSaveNewOption = () => {
    const newOptionArgument: string = searchText;
    onNewOptionCreated?.(newOptionArgument); // Notificar al padre
    handleCheckboxToggle(newOptionArgument);
    setSearchText('');
    closeModal();
};


  if(isOpen) {
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
        {(
          <IonContent color="tertiary">
            <ModalSearchBar searchText={searchText} setSearchText={setSearchText} showSearchBar={true} />
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
                    <div>
                      <p className="add-new-option-description no-items-message">
                        <a>{searchText}</a> does not exist. Do you want to create a new one?        
                      </p>
                      <div className="buttons-wrapper">
                        <OutlinePrimaryButton
                          buttonName="YES"
                          onClick={handleSaveNewOption}
                          color='success'
                        />
                        <OutlinePrimaryButton
                          buttonName="NO"
                          onClick={() => setSearchText('')}
                          className="ion-margin"
                          color='danger'
                        />
                      </div>
                    </div>
                  )
                }
              <div className='buttons-wrapper'>
                {
                  filteredOptions.length > 0
                  && (
                  <OutlinePrimaryButton
                    buttonName="SAVE"
                    onClick={closeModal}
                    className="ion-margin"
                    color='success'
                  />
                  )
                }
                {
                  filteredOptions.length > 0
                  && (
                  <OutlinePrimaryButton
                    buttonName="CANCEL"
                    onClick={closeModal}
                    className="ion-margin"
                    color='danger'
                  />
                  )
                }
              </div>
            </>
          </IonContent>
        )}
      </IonModal>
    );
  } else {
    return <></>
  }
};

export default InputModal;
