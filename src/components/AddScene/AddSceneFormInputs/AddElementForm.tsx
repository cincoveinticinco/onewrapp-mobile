import React, { useState } from 'react';
import {
  IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import AddElementInput from './AddElementInput';
import InputModal from '../../Shared/InputModal/InputModal';
import scenesData from '../../../data/scn_data.json';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';

interface AddElementFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddElementForm: React.FC<AddElementFormProps> = ({ handleSceneChange }) => {
  
  const scenes = scenesData.scenes;

  const defineElementsCategories = () => {
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'elements', 'categoryName');
    
    uniqueValuesArray.forEach((element) => {
      const categoryName = element.categoryName;
      categoriesArray.push(categoryName);
    });

    return categoriesArray
  };

  const sortedElementsCategories = defineElementsCategories().sort();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleForm = (index: number) => {
    const element = document.getElementById(`element-form-${index}`);
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  };

  // const handleOk = (inputData: { categoryName: string }) => {
  //   const inputElement = document.getElementById('add-element-category-input');
  //   if (inputData.categoryName) {
  //     setSelectedCategories([...selectedCategories, inputData.categoryName]);
  //   }
  //   if (inputElement) {
  //     (inputElement as HTMLInputElement).value = '';
  //   }
  // };

  // const removeCategory = (categoryName: string) => {
  //   const updatedCategories = selectedCategories.filter((category) => category !== categoryName);
  //   setSelectedCategories(updatedCategories);
  // };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Elements
        </p>
        <IonButton fill="clear" color="light" id="open-add-scene-elements-category-modal" slot="end" className="ion-no-padding">
          <IonIcon icon={add} />
        </IonButton>
      </div>

      {/* <IonAlert
        trigger="element-category-alert"
        header="Please, enter an element category name"
        buttons={[
          {
            text: 'OK',
            handler: handleOk,
          },
        ]}
        inputs={[
          {
            name: 'categoryName',
            type: 'text',
            placeholder: 'Element Category Name',
            id: 'add-element-category-input',
          },
        ]}
      /> */}

      <InputModal
        optionName="Elements Categories"
        listOfOptions={sortedElementsCategories}
        modalTrigger='open-add-scene-elements-category-modal'
      />

      {
        selectedCategories.length === 0
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

      {selectedCategories.length > 0
        && (
        <IonGrid className="add-scene-items-card-grid">
          {selectedCategories.map((category, index) => (
            <IonCard
              key={index}
              color="tertiary"
              className="add-scene-items-card ion-no-border"
            >
              <IonCardHeader className="ion-flex">
                <div className="ion-flex ion-justify-content-between">
                  <IonCardSubtitle className="ion-flex ion-align-items-center">
                    {category}
                  </IonCardSubtitle>
                  <IonButton
                    size="small"
                    onClick={() => { toggleForm(index); }}
                    fill="clear"
                    color="light"
                  >
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <AddElementInput
                  categoryName={category}
                  id={index}
                  toggleForm={toggleForm}
                  handleSceneChange={handleSceneChange}
                />
              </IonCardContent>
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddElementForm;
