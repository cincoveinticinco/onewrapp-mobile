import {
  IonCheckbox, IonContent, IonHeader, IonItem, IonList, IonModal,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import useIsMobile from '../../../hooks/useIsMobile';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../OutlineLightButton/OutlineLightButton';
import './InputModal.scss';
import ModalSearchBar from '../ModalSearchBar/ModalSearchBar';
import removeNumberAndDot from '../../../utils/removeNumberAndDot';
import ModalPagesLayout from '../../../Layouts/ModalPagesLayout/ModalPagesLayout';
import useHandleBack from '../../../hooks/useHandleBack';
import ModalToolbar from '../ModalToolbar/ModalToolbar';
import truncateString from '../../../utils/truncateString';

interface InputModalProps {
  optionName: string;
  listOfOptions: string[];
  modalTrigger: string;
  handleCheckboxToggle: (option: string) => void;
  selectedOptions: string[];
  clearSelections: () => void;
  multipleSelections?: boolean;
  canCreateNew?: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
  optionName,
  listOfOptions,
  modalTrigger,
  handleCheckboxToggle,
  selectedOptions,
  clearSelections,
  multipleSelections = true,
  canCreateNew = false,
}) => {
  const [searchText, setSearchText] = useState('');

  const modalRef = useRef<HTMLIonModalElement>(null);

  const isMobile = useIsMobile();

  const clearSearchTextModal = () => {
    setSearchText('');
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    }
  };

  const uncheckedOptions = listOfOptions.filter((option: string) => !selectedOptions.includes(removeNumberAndDot(option)));

  const filteredOptions = listOfOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const uncheckedFilteredOptions = uncheckedOptions.filter((option: string) => option.toLowerCase().includes(searchText.toLowerCase()));

  const checkedSelectedOptions: any[] = listOfOptions.filter((option: string) => selectedOptions.includes(removeNumberAndDot(option)));

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
          clearOptions={clearSelections}
        />
      </IonHeader>
      <IonContent color="tertiary">
        <ModalSearchBar searchText={searchText} setSearchText={setSearchText} showSearchBar={listOfOptions.length > 10 }/>
        {
          filteredOptions.length === 0 && !canCreateNew && (
            <p className="no-items-message">
              There are no coincidences.
            </p>
          )
        }
        {
          filteredOptions.length === 0 && canCreateNew
            ? (
              <p className="no-items-message">
                There are no coincidences. Do you want to create a new one ?
                <span className="no-items-buttons-container ion-flex ion-justify-content-center ion-align-items-center">
                  <OutlinePrimaryButton buttonName="CREATE NEW" className="ion-margin no-items-confirm" onClick={() => {}} />
                  <OutlineLightButton buttonName="CANCEL" className="ion-margin cancel-button no-items-cancel" onClick={clearSearchTextModal} />
                </span>
              </p>
            ) : (
              <>
                <IonList color="tertiary" className="ion-no-padding ion-margin options-list" style={listOfOptions.length > 10 ? {marginTop: "100px"} : {}}>
                  {checkedSelectedOptions.map((option: string, i: number) => (
                    <div
                      color="tertiary"
                      key={`filter-item-${i}`}
                      className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                      onClick={() => handleCheckboxToggle(option)}
                    >
                      <IonCheckbox
                        slot="start"
                        className="ion-no-margin ion-no-padding checkbox-option"
                        labelPlacement="end"
                        checked={isOptionChecked(option)}
                      >
                        {isMobile ? truncateString(option.toUpperCase(), 30) : option.toUpperCase()}
                      </IonCheckbox>
                    </div>
                  ))}
                  {uncheckedFilteredOptions.map((option: string, i: number) => (
                    <div
                      color="tertiary"
                      key={`filter-item-${i}`}
                      className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                      onClick={() => handleCheckboxToggle(option)}
                    >
                      <IonCheckbox
                        slot="start"
                        className="ion-no-margin ion-no-padding checkbox-option"
                        labelPlacement="end"
                        checked={isOptionChecked(option)}
                        disabled={!multipleSelections && checkedSelectedOptions.length > 0}
                      >
                        {isMobile ? truncateString(option.toUpperCase(), 30) : option.toUpperCase()}
                      </IonCheckbox>
                    </div>
                  ))}
                </IonList>
                <OutlinePrimaryButton
                  buttonName="CONFIRM"
                  onClick={closeModal}
                  className="ion-margin modal-confirm-button"
                />
                {isMobile && <OutlineLightButton buttonName="CANCEL" onClick={closeModal} className="ion-margin cancel-input-modal-button cancel-button" />}
              </>
            )
        }
      </IonContent>
    </IonModal>
  );
};

export default InputModal;
