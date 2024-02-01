import { IonButton, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react'
import React, { useRef, useState } from 'react'
import useIsMobile from '../../../hooks/useIsMobile';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';
import { chevronBack, trash } from 'ionicons/icons';
import './InputModal.scss'
import ModalSearchBar from '../ModalSearchBar/ModalSearchBar';

interface InputModalProps {
  optionName: string;
  listOfOptions: string[];
  modalTrigger: string;
}

const InputModal: React.FC<InputModalProps> = ({ optionName, listOfOptions, modalTrigger }) => {
  
  const [searchText, setSearchText] = useState('');

  const modalRef = useRef<HTMLIonModalElement>(null);
  const isMobile = useIsMobile();

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const uncheckedOptions = [];

  const uncheckedFilteredOptions = listOfOptions;

  const checkedSelectedOptions: any[] = [];

  const clearModalSelections = () => {};

  const handleCheckboxToggle = (option: string) => {};

  const isOptionChecked = (option: string) => {
    return true
  };

  return (
    <IonModal
    ref={modalRef}
    trigger={modalTrigger}
    id="add-scenes-options-modal"
  >
    <IonHeader>
      <IonToolbar color="tertiary" className="add-strip-toolbar ion-no-padding">
        {
          !isMobile
          && (
            <>
              <IonButton fill="clear" color="primary" slot="start" onClick={closeModal}>
                BACK
              </IonButton>
              <IonButton
                fill="clear"
                color="primary"
                slot="end"
                onClick={clearModalSelections}
              >
                RESET
              </IonButton>
            </>
          )
        }

        {
          isMobile
          && (
            <IonButton fill="clear" color="primary" slot="start" onClick={closeModal}>
              <IonIcon icon={chevronBack} color="light" />
            </IonButton>
          )
        }
        <IonTitle className="add-strip-toolbar-title">
          {optionName.toUpperCase()}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="tertiary">

      <ModalSearchBar searchText={searchText} setSearchText={setSearchText} />

      {uncheckedFilteredOptions.length === 0 ? (
        <p className="no-items-message">
          {`There are no coincidences. Do you want to create a new one ?`}
          <div className='no-items-buttons-container ion-flex ion-justify-content-center ion-align-items-center'>
            <OutlinePrimaryButton buttonName="CREATE NEW" className='ion-margin' onClick={()=> {}}/>
            <OutlineLightButton buttonName="CANCEL" className='ion-margin' onClick={closeModal}/>
          </div>
        </p>
      ) : (
        <>
          <IonList color="tertiary" className="ion-no-padding ion-margin options-list">
          {checkedSelectedOptions && checkedSelectedOptions.map((option: string, i: number) => (
              <IonItem
                color="tertiary"
                key={`filter-item-${i}`}
                className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
              >
                <IonCheckbox
                  slot="start"
                  className="ion-no-margin ion-no-padding"
                  labelPlacement="end"
                  onClick={() => handleCheckboxToggle(option)}
                  checked={isOptionChecked(option)}
                >
                  {option.toUpperCase()}
                </IonCheckbox>
              </IonItem>
            ))}
            {uncheckedFilteredOptions.map((option: string, i: number) => (
              <IonItem
                color="tertiary"
                key={`filter-item-${i}`}
                className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
              >
                <IonCheckbox
                  slot="start"
                  className="ion-no-margin ion-no-padding"
                  labelPlacement="end"
                  onClick={() => handleCheckboxToggle(option)}
                  checked={isOptionChecked(option)}
                >
                  {option.toUpperCase()}
                </IonCheckbox>
              </IonItem>
            ))}
          </IonList>
          <OutlinePrimaryButton 
            buttonName="CONFIRM" 
            onClick={closeModal} 
            className="ion-margin modal-confirm-button"
          />
          {isMobile && <OutlineLightButton buttonName="CANCEL" onClick={closeModal} className="ion-margin" />}
        </>
      )}
    </IonContent>
  </IonModal>
  )
}

export default InputModal