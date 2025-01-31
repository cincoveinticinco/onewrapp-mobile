import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddElementInput from './AddElementInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import capitalizeString from '../../../../Shared/Utils/capitalizeString';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import DropDownButton from '../../../../Shared/Components/DropDownButton/DropDownButton';
import DatabaseContext from '../../../../context/Database/Database.context';

interface Element {
  categoryName: string;
}

interface AddElementFormProps {
  handleSceneChange: (value: any, field: string) => void;
  observedElements: Element[];
  editMode?: boolean;
  detailsEditMode?: boolean;
}

const AddElementForm: React.FC<AddElementFormProps> = ({
  handleSceneChange,
  observedElements,
  editMode,
  detailsEditMode,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const alertRef = useRef<HTMLIonAlertElement>(null);

  // State
  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedElements, setSelectedElements] = useState<Element[]>(observedElements || []);
  const [elementsCategories, setElementsCategories] = useState<(string | null)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});

  // Fetch initial categories from offline scenes
  const defineElementsCategories = useCallback(() => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
    return uniqueCategoryValues
      .map(element => element.categoryName)
      .filter((categoryName): categoryName is string | null => categoryName !== undefined)
      .sort();
  }, [offlineScenes]);

  // Initialize categories on mount
  useEffect(() => {
    setElementsCategories(defineElementsCategories());
  }, [defineElementsCategories]);

  // Handle dropdown visibility when there are no elements
  useEffect(() => {
    if (!observedElements?.length) {
      setDropDownIsOpen(true);
    }
  }, [observedElements]);

  // Sync observedElements with selectedElements when they change
  useEffect(() => {
    if (observedElements && JSON.stringify(observedElements) !== JSON.stringify(selectedElements)) {
      setSelectedElements(observedElements);
    }
  }, [observedElements]);

  // Update parent component when selected elements change
  const handleSelectedElementsChange = useCallback((newElements: Element[]) => {
    setSelectedElements(newElements);
  }, [handleSceneChange]);

  useEffect(() => {
    handleSceneChange(selectedElements, 'elements');
  }, [selectedElements]);

  // Handlers
  const handleOk = (inputData: { [key: string]: any }) => {
    if (inputData.categoryName) {
      setElementsCategories(prev => {
        const newCategories = [...prev, inputData.categoryName];
        return newCategories.sort();
      });
    }
  };

  const handleDropDown = () => {
    setDropDownIsOpen(!dropDownIsOpen);
  };

  const toggleModal = (category: string) => {
    setModalStates(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Helper functions
  const getAlertTrigger = () => {
    if (editMode) return 'elements-categories-alert-edit';
    if (detailsEditMode) return 'elements-categories-alert-details-edit';
    return 'elements-categories-alert';
  };

  const getModalTrigger = () => {
    if (editMode) return 'open-elements-options-modal-edit';
    if (detailsEditMode) return 'open-elements-options-modal-details-edit';
    return 'open-elements-options-modal';
  };

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-element-category-input',
    },
  ];

  return (
    <>
      <div
        className="category-item-title ion-flex ion-justify-content-between"
        onClick={handleDropDown}
        style={{ backgroundColor: 'var(--ion-color-tertiary-shade)' }}
      >
        <p className="ion-flex ion-align-items-center">Elements</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          <AddButton id={getAlertTrigger()} slot="end" onClick={(e) => { e.stopPropagation(); }}/>
          <DropDownButton open={dropDownIsOpen} />
        </div>
      </div>

      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger={getAlertTrigger()}
        header="Add Category"
        message="PLEASE ENTER THE NAME OF THE CATEGORY YOU WANT TO ADD"
        ref={alertRef}
      />

      {elementsCategories.length === 0 && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO ELEMENTS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {elementsCategories.length > 0 && dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {[...elementsCategories, 'NO CATEGORY'].map((category, index) => 
            category && (
              <IonCard
                key={`category-item-${index}-category-${category}`}
                color="tertiary"
                className="add-scene-items-card ion-no-border"
              >
                <IonCardHeader className="ion-flex">
                  <div className="ion-flex ion-justify-content-between">
                    <p className="ion-flex ion-align-items-center">
                      {capitalizeString(category)}
                    </p>
                    <div className="category-buttons-wrapper">
                      <AddButton
                        id={`${getModalTrigger()}${category}`}
                        onClick={(e) => { toggleModal(category); e.stopPropagation(); }}
                      />
                    </div>
                  </div>
                </IonCardHeader>
                <AddElementInput
                  categoryName={category}
                  selectedElements={selectedElements}
                  setSelectedElements={handleSelectedElementsChange}
                  openModal={modalStates[category] || false}
                  setOpenModal={(isOpen: boolean) => toggleModal(category)}
                />
              </IonCard>
            )
          )}
        </IonGrid>
      )}
    </>
  );
};

export default AddElementForm;