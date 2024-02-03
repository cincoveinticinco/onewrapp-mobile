import {
  IonButton, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonSearchbar, IonTitle, IonToolbar,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import useIsMobile from '../../../hooks/useIsMobile';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';
import './InputModal.scss';
import ModalSearchBar from '../ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../ModalToolbar/ModalToolbar';
import removeNumberAndDot from '../../../utils/removeNumberAndDot';

interface InputModalProps {
  optionName: string;
  listOfOptions: string[];
  modalTrigger: string;
  handleCheckboxToggle: (option: string) => void;
  selectedOptions: string[];
}

const InputModal: React.FC<InputModalProps> = ({
  optionName, listOfOptions, modalTrigger, handleCheckboxToggle, selectedOptions,
}) => {
  const [searchText, setSearchText] = useState('');

  const modalRef = useRef<HTMLIonModalElement>(null);
  const isMobile = useIsMobile();

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const clearSearchTextModal = () => {
    setSearchText('');
  };

  const uncheckedOptions = listOfOptions.filter((option: string) => !selectedOptions.includes(removeNumberAndDot(option)));

  const filteredOptions = listOfOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const uncheckedFilteredOptions = uncheckedOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const checkedSelectedOptions: any[] = listOfOptions.filter((option: string) => selectedOptions.includes(removeNumberAndDot(option)));

  const clearModalSelections = () => {};

  const isOptionChecked = (option: string) => selectedOptions.includes(removeNumberAndDot(option));

  return (
    <IonModal
      ref={modalRef}
      trigger={modalTrigger}
      id="add-scenes-options-modal"
    >
      <IonHeader>
        <ModalToolbar
          handleBack={closeModal}
          toolbarTitle={optionName}
          clearOptions={clearModalSelections}
        />
      </IonHeader>
      <IonContent color="tertiary">

        <ModalSearchBar searchText={searchText} setSearchText={setSearchText} />

        {
        filteredOptions.length === 0
          ? (
            <p className="no-items-message">
              There are no coincidences. Do you want to create a new one ?
              <span className="no-items-buttons-container ion-flex ion-justify-content-center ion-align-items-center">
                <OutlinePrimaryButton buttonName="CREATE NEW" className="ion-margin" onClick={() => {}} />
                <OutlineLightButton buttonName="CANCEL" className="ion-margin" onClick={clearSearchTextModal} />
              </span>
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
                      className="ion-no-margin ion-no-padding checkbox-option"
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
                      className="ion-no-margin ion-no-padding checkbox-option"
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
          )
}
      </IonContent>
    </IonModal>
  );
};

export default InputModal;
