import React, { useEffect, useRef, useState } from 'react';
import { IonCheckbox, IonCol, IonContent, IonHeader, IonModal, IonRow, IonGrid } from '@ionic/react';
import ModalSearchBar from '../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../Shared/Components/ModalToolbar/ModalToolbar';
import './InputModalWithSections.scss';
import { Section } from '../../Shared/Components/Section/Section';
import OutlinePrimaryButton from '../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import InputItem from '../../pages/AddScene/Components/AddSceneFormInputs/InputItem';
import { useForm } from 'react-hook-form';
import { EmptyEnum } from '../../Shared/ennums/ennums';

export interface ListOfOptionsItem {
  category: string;
  options: {
    label: string;
    value: string | number;
    checked: boolean;
  }[];
  open?: boolean;
}

interface InputModalWithSectionsProps {
  modalRef?: React.RefObject<HTMLIonModalElement>;
  optionName: string;
  listOfOptions: ListOfOptionsItem[];
  clearSelections: () => void;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  setValues: (values: {
    value: string | number;
    category: string | null;
  }[]) => void;
  selectedCategory?: string | null;
  multiple?: boolean;
  customCategoryLabel?: string;
  afterSelection?: () => void;
}

const  InputModalWithSections: React.FC<InputModalWithSectionsProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  optionName,
  listOfOptions,
  clearSelections,
  isOpen = false,
  setIsOpen,
  setValues,
  selectedCategory,
  multiple = true,
  customCategoryLabel,
  afterSelection = () => {},
}) => {
  useEffect(() => {
    if (!isOpen) {
      setFilteredOptions([]);
    }
  }, [isOpen]);
  
  const [searchText, setSearchText] = useState('');
  const [showError, setShowError] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<ListOfOptionsItem[]>([]);
  const [createdOptions, setCreatedOptions] = useState<ListOfOptionsItem[]>([]);
  const [openSelectedOptions, setOpenSelectedOptions] = useState(true);

  const noCategory = customCategoryLabel ? 'NO ' + customCategoryLabel.toUpperCase() : EmptyEnum.NoCategory
  
  const { control, setValue, getValues } = useForm<{ categoryName: string }>({
    defaultValues: { categoryName: 
      noCategory
     },
  });


  const categorySuggestions = listOfOptions.map(item => item.category);

  useEffect(() => {
    if (selectedCategory) {
      setValue('categoryName', selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    filterOptions();
  }, [searchText, listOfOptions, createdOptions]);

  const filterOptions = () => {
    let combinedOptions = [...listOfOptions, ...createdOptions];
    if (selectedCategory) {
      combinedOptions = combinedOptions.filter(category => 
        category.category === selectedCategory
      );
    }
  
    if (searchText.trim()) {
      combinedOptions = combinedOptions.map(category => ({
        ...category,
        options: category.options.filter(option =>
          option.label?.toLowerCase().includes(searchText.toLowerCase())
        ),
      }));
    }
  
    setFilteredOptions(combinedOptions);
  };

  const toggleOpenSection = (category: string) => {
    const updatedOptions = filteredOptions.map(option =>
      option.category === category ? { ...option, open: !option.open } : option
    );
    setFilteredOptions(updatedOptions);
  };

  const resetStates = () => {
    setSearchText('');
    setShowError(false);
    setCreatedOptions([]);
    setValue('categoryName', 
      noCategory
    );
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      resetStates();
      setIsOpen?.(false);
    }
  };

  const createNew = () => {
    const categoryName = getValues('categoryName');
    const updatedCreatedOptions = [...createdOptions];
    if (!multiple) {
      updatedCreatedOptions.forEach(category => {
        category.options.forEach(option => {
          option.checked = false;
        });
      });
      
      // También desmarca las opciones en filteredOptions
      setFilteredOptions(prevOptions => 
        prevOptions.map(category => ({
          ...category,
          options: category.options.map(option => ({
            ...option,
            checked: false
          }))
        }))
      );
    }

    const categoryIndex = updatedCreatedOptions.findIndex(category => category.category === categoryName);
    if (categoryIndex !== -1) {
      updatedCreatedOptions[categoryIndex].options.push({
        label: searchText.trim(),
        value: searchText.trim(),
        checked: true,
      });
    } else {
      updatedCreatedOptions.push({
        category: categoryName,
        options: [
          {
            label: searchText.trim(),
            value: searchText.trim(),
            checked: true,
          },
        ],
      });
    }

    setCreatedOptions(updatedCreatedOptions);
    setSearchText('');
  };

  const toggleCheckOptions = (value: string | number, category: string) => {
    const updatedOptions = filteredOptions.map(cat => {
      if (cat.category?.toLowerCase() === category?.toLowerCase()) {
        return {
          ...cat,
          options: cat.options.map(option =>
        option.value === value ? { ...option, checked: !option.checked } : multiple ? option : { ...option, checked: false }
          ),
        };
      }
      return cat;
    });
    setFilteredOptions(updatedOptions)
  };

  const onSave = () => {
    const selectedValues = filteredOptions.flatMap(category =>
      category.options
        .filter(option => option.checked)
        .map(option => ({
          value: option.value,
          category: category?.category 
        }))
    );

    if (!multiple && selectedValues.length > 1) {
      // Para selección única, solo tomamos el último valor seleccionado
      setValues([selectedValues[selectedValues.length - 1]]);
    } else if (selectedValues.length > 0) {
      setValues(selectedValues);
    } else {
      setShowError(true);
      return;
    }
    
    closeModal();
    afterSelection()
  };

  const getSelectedOptions = () => {
    return filteredOptions.flatMap(category =>
      category.options
        .filter(option => option.checked)
        .map(option => ({ 
          label: option.label, 
          category: category.category, 
          checked: option.checked, 
          value: option.value 
        }))
    )
  };

  if (!isOpen) return null;

  return (
    <IonModal
      className="general-modal-styles"
      isOpen={isOpen}
      ref={modalRef}
      onDidDismiss={() => setIsOpen?.(false)}
    >
      <IonHeader>
        <ModalToolbar
          handleSave={filteredOptions.every(category => category.options.length === 0) ? createNew : onSave}
          toolbarTitle={`${optionName} ${!multiple ? '(Single Selection)' : ''}`}
          handleReset={clearSelections}
          customButtons={[]}
          handleBack={closeModal}
          showReset={false}
        />
        <ModalSearchBar searchText={searchText} setSearchText={setSearchText} showSearchBar={true} />
      </IonHeader>
      <IonContent color="tertiary">
        <div className='sections-container'>
          {/* Selected Options Section */}
          {getSelectedOptions().length > 0 && (
            <Section title="Selected Options" open={openSelectedOptions} setOpen={setOpenSelectedOptions}>
              {getSelectedOptions().map((option, i) => (
                <div 
                  key={i} 
                  className="checkbox-item-option filter-item ion-no-margin ion-no-padding" 
                  onClick={() => toggleCheckOptions(option.value, option.category)}
                >
                  <IonCheckbox
                    slot="start"
                    className="ion-no-margin ion-no-padding checkbox-option"
                    labelPlacement="end"
                    checked={option.checked}
                  >
                    {option.label} 
                    <a 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        e.preventDefault(); 
                        document.getElementById(option.category);
                      }}
                    >
                      {` (${option.category.toUpperCase()})`}
                    </a>
                  </IonCheckbox>
                </div>
              ))}
            </Section>
          )}
          
          {/* Main Options Section */}
          {filteredOptions.every(category => category.options.length === 0) ? (
            <div className="no-items-card">
              <p className="no-items-card-title">
                <a>{searchText.toUpperCase()}</a> DOES NOT EXIST. DO YOU WANT TO CREATE?
              </p>
              <IonGrid>
                <IonRow>
                  <IonCol size='6' offset='3'>
                    <InputItem
                      label={customCategoryLabel  || 'Category'}
                      placeholder="Enter category"
                      control={control}
                      fieldKeyName="categoryName"
                      inputName="category-input"
                      suggestions={categorySuggestions}
                      setValue={setValue}
                      disabled={selectedCategory !== null}
                    />
                  </IonCol> 
                </IonRow>
              </IonGrid>
              
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
            filteredOptions.map((category, i) => (
              category.options.filter(o => !o.checked).length > 0 && (
                <Section 
                  key={i} 
                  title={category.category || 
                    noCategory
                  } 
                  open={category.open ?? true} 
                  setOpen={() => toggleOpenSection(category.category || 
                    noCategory
                  )} 
                  id={category.category}
                >
                  {category.options
                    .sort((a, b) => Number(b.checked) - Number(a.checked))
                    .map((option, j) => (
                      !option.checked && (
                        <div 
                          key={`filter-item-${i}-${j}`} 
                          className="checkbox-item-option filter-item ion-no-margin ion-no-padding"
                        >
                          <IonCheckbox
                            slot="start"
                            className="ion-no-margin ion-no-padding checkbox-option"
                            labelPlacement="end"
                            checked={option.checked}
                            onIonChange={() => toggleCheckOptions(option.value, category.category || 
                              noCategory
                            )}
                          >
                            {option.label}
                          </IonCheckbox>
                        </div>
                      )
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