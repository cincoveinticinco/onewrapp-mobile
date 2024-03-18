import React, { useContext, useEffect, useState } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddElementInput from './AddElementInput';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../../Layouts/InputAlert/InputAlert';
import DropDownButton from '../../Shared/DropDownButton/DropDownButton';
import DatabaseContext from '../../../context/database';
import { get } from 'lodash';

interface AddElementFormProps {
  handleSceneChange: (value: any, field: string) => void;
  observedElements: Element[];
  editMode?: boolean;
  detailsEditMode?: boolean;
}

const AddElementForm: React.FC<AddElementFormProps> = ({ handleSceneChange, observedElements, editMode, detailsEditMode }) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [elementsFetched, setElementsFetched] = useState(false);

  useEffect(() => {
    if (!observedElements) {
      setDropDownIsOpen(true);
    }
  }, [observedElements]);

  useEffect(() => {
    if (observedElements && selectedElements.length === 0 && !elementsFetched) {
      setSelectedElements(observedElements);
      setElementsFetched(true);
    }
  }, [observedElements, elementsFetched]);

  useEffect(() => {
    handleSceneChange(selectedElements, 'elements');
  }, [selectedElements]);

  const defineElementsCategories = () => {
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName');

    uniqueValuesArray.forEach((element) => {
      const { categoryName } = element;
      categoriesArray.push(categoryName);
    });

    return categoriesArray;
  };

  useEffect(() => {
    const sortedCategories = defineElementsCategories().sort();
    setElementsCategories([...sortedCategories, 'NO CATEGORY']);
  }, [offlineScenes]);

  const [elementsCategories, setElementsCategories] = useState<string[]>([]);

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
    },
  ];

  const handleOk = (inputData: { categoryName: string }) => {
    const inputElement = document.getElementById('add-element-category-input');
    if (inputData.categoryName) {
      setElementsCategories([...elementsCategories, inputData.categoryName]);
    }
    if (inputElement) {
      (inputElement as HTMLInputElement).value = '';
    }
  };

  const handleDropDown = () => {
    setDropDownIsOpen(!dropDownIsOpen);
  };

  const getAlertTrigger = () => {
    if(editMode) {
      return 'open-element-options-modal-edit'
    }
    if(detailsEditMode) {
      return 'open-element-options-modal-details-edit'
    }
    return 'open-element-options-modal'
  }

  const getModalTrigger = (category: string) => {
    if(editMode) {
      return `open-elements-options-modal-edit-${category}`
    }
    if(detailsEditMode) {
      return `open-elements-options-modal-details-edit-${category}`
    }
    return `open-elements-options-modal-${category}`
  }

  return (
    <>
      <div
        className="category-item-title ion-flex ion-justify-content-between"
        onClick={handleDropDown}
        style={{ backgroundColor: 'var(--ion-color-tertiary-shade)' }}
      >
        <p className="ion-flex ion-align-items-center">
          Elements
        </p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          <AddButton
            id={getAlertTrigger()}
            slot="end"
          />
          <DropDownButton open={dropDownIsOpen} />
        </div>
      </div>

      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger={getAlertTrigger()}
        header="Add Category"
        message="Please enter the name of the category you want to add"
      />

      {
        elementsCategories.length === 0
        && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO ELEMENTS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        )
      }

      {elementsCategories.length > 0 && dropDownIsOpen
        && (
        <IonGrid className="add-scene-items-card-grid">
          {elementsCategories.map((category, index) => (
            category && (
              <IonCard
                key={index}
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
                        id={getModalTrigger(category)}
                      />
                    </div>

                  </div>
                </IonCardHeader>
                <AddElementInput
                  categoryName={category}
                  selectedElements={selectedElements}
                  setSelectedElements={setSelectedElements}
                  modalTrigger={getModalTrigger(category)}
                />
              </IonCard>
            )
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddElementForm;
