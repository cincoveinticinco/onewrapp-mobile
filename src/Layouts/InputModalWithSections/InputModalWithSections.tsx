import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IonCheckbox, IonContent, IonHeader, IonModal, IonToggle } from '@ionic/react';
import ModalSearchBar from '../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../Shared/Components/ModalToolbar/ModalToolbar';
import './InputModalWithSections.scss';
import { Section } from '../../Shared/Components/Section/Section';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';

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
  setValues: (values: any[]) => void;
}

const InputModalWithSections: React.FC<InputModalWithSectionsProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  optionName,
  listOfOptions,
  clearSelections,
  isOpen = false,
  setIsOpen,
  setValues,
}) => {
  const [searchText, setSearchText] = useState('');
  const [showError, setShowError] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<ListOfOptionsItem[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  useEffect(() => {
    if (listOfOptions) {
      const categoriesList = structuredClone(listOfOptions).map(category => category.category || 'NO CATEGORY');
      setCategories(categoriesList);
    }
    setFilteredOptions(listOfOptions);
  }, [listOfOptions]);

  useEffect(() => {
    const checkedOptions = filteredOptions.map(category => category.options.filter(option => option.checked))
    const checkedOptionsValues = checkedOptions.map(option => option.map(option => option.value));
    setSelectedOptions(checkedOptionsValues);
  }, [filteredOptions]);

  useEffect(() => {
    if (listOfOptions && searchText !== '') {
      const filteredOptions = structuredClone(listOfOptions).map(category => {
        const options = category.options.filter(option => option.label.toLowerCase().includes(searchText.toLowerCase()));
        return {
          category: category.category,
          options,
        };
      });
      setFilteredOptions(filteredOptions);
    } else {
      setFilteredOptions(listOfOptions);
    }
  }, [searchText]);

  useEffect(() => {
    if (showOnlySelected) {
      const filteredCheckOptions = filteredOptions.map(category => {
        const options = category.options.filter(option => option.checked);
        return {
          category: category.category,
          options,
        };
      });
      setFilteredOptions(filteredCheckOptions);
    } else {
      setFilteredOptions(filteredOptions);
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
      const updatedListOfOptions = listOfOptions.map((category) => {
        if (category.category === 'NO CATEGORY') {
          return {
            ...category,
            options: [
              ...category.options,
              {
                label: searchText.trim(),
                value: searchText.trim(),
                checked: true,
              },
            ],
          };
        }
        return category;
      });
  
      setFilteredOptions(updatedListOfOptions);
    }
  }, [searchText, listOfOptions]);
  
  
  const toggleCheckOptions = (value: string | number) => {
    const updatedSelectedOptions = structuredClone(filteredOptions).map(category => {
      const updatedOptions = category.options.map(option => {
        if (option.value === value) {
          return {
            ...option,
            checked: !option.checked,
          };
        }
        return option;
      });
      return {
        ...category,
        options: updatedOptions,
      };
    })
    setFilteredOptions(updatedSelectedOptions); 
  }

  const onSave = () => {
    if (selectedOptions.length > 0) {
      setValues(selectedOptions.flat());
      closeModal();
    } else {
      setShowError(true);
    }
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
          handleSave={onSave}
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
                    {filteredOptions[i]?.options
                    .sort((a, b) => Number(b.checked) - Number(a.checked))
                    .map((option, j) => (
                    <div
                      color="tertiary"
                      key={`filter-item-${i}-${j}`}
                      className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                    >
                      <IonCheckbox
                        slot="start"
                        className="ion-no-margin ion-no-padding checkbox-option"
                        labelPlacement="end"
                        checked={option.checked}
                        onIonChange={() => toggleCheckOptions(option.value)}
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