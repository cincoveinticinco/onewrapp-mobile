import React, { useEffect, useState } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddExtraInput from './AddExtraInput';
import scenesData from '../../../data/scn_data.json';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../Shared/InputAlert/InputAlert';

interface AddExtraFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({ handleSceneChange }) => {
  const { scenes } = scenesData;

  const defineExtrasCategories = () => {
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'extras', 'categoryName');

    uniqueValuesArray.forEach((extra) => {
      const { categoryName } = extra;
      if (categoryName) {
        categoriesArray.push(categoryName);
      }
    });

    return categoriesArray;
  };

  const sortedExtrasCategories = defineExtrasCategories().sort();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([...sortedExtrasCategories, 'NO CATEGORY']);

  const toggleForm = (index: number) => {
    const element = document.getElementById(`extra-form-${index}`);
    if (element) {
      if (element.style.display === 'none') {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  };

  const handleOk = (inputData: { categoryName: string }) => {
    const inputElement = document.getElementById('add-extra-category-input');
    if (inputData.categoryName) {
      setSelectedCategories([...selectedCategories, inputData.categoryName]);
    }
    if (inputElement) {
      (inputElement as HTMLInputElement).value = '';
    }
  };

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-extra-category-input',
    },
  ];

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Extras / Background Actors
        </p>
        <AddButton
          id="extras-category-alert"
          slot="end"
        />
      </div>
      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger="extras-category-alert"
        header="Add Category"
        message="Please enter the name of the category you want to add"
      />
      {
        selectedCategories.length === 0
        && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO EXTRAS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        )
      }

      {selectedCategories.length > 0
        && (
        <IonGrid
          className="add-scene-items-card-grid"
        >
          {selectedCategories.map((category, index) => (
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
                      id={`open-extras-options-modal-${category}`}
                    />
                  </div>
                </div>
              </IonCardHeader>
              <AddExtraInput
                categoryName={category}
                toggleForm={toggleForm}
                handleSceneChange={handleSceneChange}
                id={index}
              />
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddExtraForm;
