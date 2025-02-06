import React, { useEffect, useRef, useState } from 'react';
import { IonCheckbox, IonContent, IonHeader, IonModal, IonToggle } from '@ionic/react';
import ModalSearchBar from '../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../Shared/Components/ModalToolbar/ModalToolbar';
import './InputModalWithSections.scss';
import { Section } from '../../Shared/Components/Section/Section';


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

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      setShowError(false);
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
            {categories.map((category: string, i: number) => (
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
            ))}
        </div>
        
      </IonContent>
    </IonModal>
  );
};

export default InputModalWithSections;