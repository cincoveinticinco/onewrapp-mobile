import React, { useState } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddElementInput from './AddElementInput';
import scenesData from '../../../data/scn_data.json';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../Shared/InputAlert/InputAlert';
import DropDownButton from '../../Shared/DropDownButton/DropDownButton';

interface AddElementFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddElementForm: React.FC<AddElementFormProps> = ({ handleSceneChange }) => {
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
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

  // const toggleForm = (index: number) => {
  //   const element = document.getElementById(`element-form-${index}`);
  //   if (element) {
  //     element.style.display = element.style.display === 'none' ? 'block' : 'none';
  //   }
  // };

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
  }


  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Elements
        </p>
        <div className='categories-card-buttons-wrapper ion-flex ion-align-items-center'>
          <AddButton
            id="elements-category-alert"
            slot="end"
          />
          <DropDownButton open={ dropDownIsOpen } handleDropDown={handleDropDown} />
        </div>
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

      {elementsCategories.length > 0 && dropDownIsOpen
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
