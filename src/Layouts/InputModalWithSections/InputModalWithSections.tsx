import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IonCheckbox, IonContent, IonHeader, IonModal, IonToggle } from '@ionic/react';
import ModalSearchBar from '../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../Shared/Components/ModalToolbar/ModalToolbar';
import './InputModalWithSections.scss';
import { Section } from '../../Shared/Components/Section/Section';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import InputItem from '../../pages/AddScene/Components/AddSceneFormInputs/InputItem';
import { useForm } from 'react-hook-form';

interface ListOfOptionsItem {
  category: string | null;
  options: {
    label: string;
    value: string | number;
    checked: boolean;
  }[];
}

interface InputModalWithSectionsProps {
  modalRef?: React.RefObject<HTMLIonModalElement>;
  optionName: string;
  listOfOptions: ListOfOptionsItem[];
  clearSelections: () => void;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  setValue: (values: any) => void;
  handleSave?: () => void;
}

const InputModalWithSections: React.FC<InputModalWithSectionsProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  optionName,
  listOfOptions,
  clearSelections,
  isOpen = false,
  setIsOpen,
  setValue,
  handleSave
}) => {
  const [searchText, setSearchText] = useState('');
  const [showError, setShowError] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<ListOfOptionsItem[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  useEffect(() => {
    if (listOfOptions) {
      const categoriesList = listOfOptions.map(category => category.category || 'NO CATEGORY');
      setCategories(categoriesList);
    }
    setFilteredOptions(listOfOptions);
  }, [listOfOptions]);

  useEffect(() => {
    if (listOfOptions) {
      const filteredOptions = listOfOptions.map(category => {
        const options = category.options.filter(option => option.label.toLowerCase().includes(searchText.toLowerCase()));
        return {
          category: category.category,
          options,
        };
      });
      setFilteredOptions(filteredOptions);
    }
  }, [searchText]);

  useEffect(() => {
    if (showOnlySelected) {
      const filteredOptions = listOfOptions.map(category => {
        const options = category.options.filter(option => option.checked);
        return {
          category: category.category,
          options,
        };
      });
      setFilteredOptions(filteredOptions);
    } else {
      setFilteredOptions(listOfOptions);
    }
  }, [showOnlySelected]);

  const resetStates = () => {
    setSearchText('');
    setShowError(false);
    setCategories([]);
    setFilteredOptions(listOfOptions);
    setShowOnlySelected(false);
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      resetStates();
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  const onlySelectedToggleButton = () => {
    return (
       <IonToggle
        slot="end"
        checked={showOnlySelected}
        onIonChange={showOnlySelectedToggle}
        style={{ color: 'var(--ion-color-light)', fontSize: '12px' }}
      >

      </IonToggle>
    );
  }

  const showOnlySelectedToggle = () => {
    setShowOnlySelected(!showOnlySelected);
  }

  const createNew = useCallback(() => {
    if (searchText.trim()) {
      setValue(searchText.trim());
      handleSave?.();
    }
  }, [searchText, setValue, handleSave]);

  if (!isOpen) {
    return null;
  }

  return (
    <IonModal
      className="general-modal-styles"
      isOpen={isOpen}
      ref={modalRef}
      onDidDismiss={() => setIsOpen && setIsOpen(false)}
    >
      <IonHeader>
        <ModalToolbar
          handleSave={handleSave}
          toolbarTitle={optionName}
          handleReset={clearSelections}
          customButtons={[onlySelectedToggleButton]}
          handleBack={closeModal}
          showReset={false}
        />
        <ModalSearchBar 
          searchText={searchText} 
          setSearchText={setSearchText} 
          showSearchBar={true} 
        />
      </IonHeader>
      <IonContent 
        color="tertiary"
      >
        <div className='sections-container'>
            {filteredOptions.every(option => option.options.length == 0)  ? (
              <div className="no-items-card">
                <p className="no-items-card-title"><a>{searchText.toUpperCase()}</a> DOES NOT EXISTS. DO YOU WANT TO CREATE?</p>
                <div className='buttons-wrapper'>
                  <OutlinePrimaryButton
                    buttonName="YES"
                    onClick={createNew}
                    color='success'
                    className='ion-margin-top save-button'
                  />

                  <OutlinePrimaryButton
                    buttonName="NO"
                    onClick={closeModal}
                    color='danger'  
                    className='ion-margin-top save-button'
                  />
                </div>
              </div>
            ) : (
              categories.map((category: string, i: number) => (
                filteredOptions[i]?.options.length > 0 && (
                  <Section
                  key={i}
                  title={category}
                  open={true}
                  setOpen={() => { } }
                  onAddClick={() => { } } >
                  {filteredOptions[i]?.options.map((option, j) => (
                    <div
                    color="tertiary"
                    key={`filter-item-${i}-${j}`}
                    className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                    onClick={() => setValue(option.value)}
                    >
                    <IonCheckbox
                      slot="start"
                      className="ion-no-margin ion-no-padding checkbox-option"
                      labelPlacement="end"
                      checked={option.checked}
                      disabled={false}
                    >
                      {option.label}
                    </IonCheckbox>
                    </div>
                  ))}
                  </Section>
                )
                ))
            )}
        </div> 
      </IonContent>
    </IonModal>
  );
};

export default InputModalWithSections;