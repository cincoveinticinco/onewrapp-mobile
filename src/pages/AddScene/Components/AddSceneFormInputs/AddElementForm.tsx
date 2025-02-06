import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddElementInput from './AddElementInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import DatabaseContext from '../../../../context/Database/Database.context';
import { SceneDocType } from '../../../../Shared/types/scenes.types';

interface Element {
  categoryName: string;
}

interface AddElementFormProps {
  handleSceneChange: (value: any, field: keyof SceneDocType) => void;
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

  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedElements, setSelectedElements] = useState<Element[]>(observedElements || []);
  const [elementsCategories, setElementsCategories] = useState<(string | null)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});

  const defineElementsCategories = useCallback(() => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');
    return uniqueCategoryValues
      .map(element => element.categoryName)
      .filter((categoryName): categoryName is string | null => categoryName !== undefined)
      .sort();
  }, [offlineScenes]);

  useEffect(() => {
    setElementsCategories(defineElementsCategories());
  }, [defineElementsCategories]);

  useEffect(() => {
    if (!observedElements?.length) {
      setDropDownIsOpen(true);
    }
  }, [observedElements]);

  useEffect(() => {
    if (observedElements && JSON.stringify(observedElements) !== JSON.stringify(selectedElements)) {
      setSelectedElements(observedElements);
    }
  }, [observedElements]);

  const handleSelectedElementsChange = useCallback((newElements: Element[]) => {
    setSelectedElements(newElements);
  }, [handleSceneChange]);

  useEffect(() => {
    handleSceneChange(selectedElements, 'elements');
  }, [selectedElements]);

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

  const getAlertTrigger = () => (editMode ? 'elements-categories-alert-edit' : detailsEditMode ? 'elements-categories-alert-details-edit' : 'elements-categories-alert');

  const getModalTrigger = () => (editMode ? 'open-elements-options-modal-edit' : detailsEditMode ? 'open-elements-options-modal-details-edit' : 'open-elements-options-modal');

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-element-category-input',
    },
  ];

  // Filter categories to only include those with elements if not in editMode
  const filteredCategories = editMode
    ? elementsCategories
    : elementsCategories.filter(category => 
        observedElements.some(el => el.categoryName === category)
      );

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">ELEMENTS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && (<AddButton id={getAlertTrigger()} slot="end"  onClick={(e) => { e.stopPropagation(); }}/>)}
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

            {/* Show "No Extras Available" when editMode is false and there are no elements */}
      {filteredCategories.length === 0 && !editMode && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>
              NO ELEMENTS AVAILABLE
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {(
        dropDownIsOpen && (
          <IonGrid className="add-scene-items-card-grid">
            {filteredCategories.map((category, index) => (
              category && (
                <IonCard key={`category-item-${index}-category-${category}`} style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="add-scene-items-card ion-no-border">
                  <IonCardHeader className="ion-flex">
                    <div className="ion-flex ion-justify-content-between">
                      <p className="ion-flex ion-align-items-center">
                        {category.toUpperCase()}
                      </p>
                      <div className="category-buttons-wrapper">
                        {editMode && (<AddButton onClick={(e) => { toggleModal(category); e.stopPropagation(); }}/>)}
                      </div>
                    </div>
                  </IonCardHeader>
                  <AddElementInput
                    categoryName={category}
                    selectedElements={selectedElements}
                    setSelectedElements={handleSelectedElementsChange}
                    openModal={modalStates[category] || false}
                    setOpenModal={(isOpen: boolean) => toggleModal(category)}
                    editMode={editMode}
                  />
                </IonCard>
              )
            ))}
          </IonGrid>
        )
      )}
    </>
  );
};

export default AddElementForm;
