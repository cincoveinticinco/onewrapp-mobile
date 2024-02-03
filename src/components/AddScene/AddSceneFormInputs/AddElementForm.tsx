import React, { useEffect, useState } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddElementInput from './AddElementInput';
import scenesData from '../../../data/scn_data.json';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../Shared/InputAlert/InputAlert';

interface AddElementFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddElementForm: React.FC<AddElementFormProps> = ({ handleSceneChange }) => {
  const { scenes } = scenesData;

  const defineElementsCategories = () => {
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'elements', 'categoryName');

    uniqueValuesArray.forEach((element) => {
      const { categoryName } = element;
      categoriesArray.push(categoryName);
    });

    return categoriesArray;
  };

  const sortedElementsCategories = defineElementsCategories().sort();

  const [elementsCategories, setElementsCategories] = useState<string[]>([...sortedElementsCategories, 'NO CATEGORY']);

  const toggleForm = (index: number) => {
    const element = document.getElementById(`element-form-${index}`);
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  };

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

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Elements
        </p>
        <AddButton
          id="elements-categories-alert"
          slot="end"
        />
      </div>

      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger="elements-categories-alert"
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

      {elementsCategories.length > 0
        && (
        <IonGrid className="add-scene-items-card-grid">
          {elementsCategories.map((category, index) => (
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
                      id={`open-element-options-modal-${category}`}
                    />
                  </div>

                </div>
              </IonCardHeader>
              <AddElementInput
                categoryName={category}
                id={index}
                toggleForm={toggleForm}
                handleSceneChange={handleSceneChange}
                />
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddElementForm;
