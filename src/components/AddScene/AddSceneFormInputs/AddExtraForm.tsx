import React, { useEffect, useState } from 'react';
import {
  IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle,
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import AddExtraInput from './AddExtraInput';
import scenesData from '../../../data/scn_data.json';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import InputModal from '../../Shared/InputModal/InputModal';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';

interface AddExtraFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({ handleSceneChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const scenes = scenesData.scenes;

  const defineExtrasCategories = () => {
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'extras', 'categoryName');
    
    uniqueValuesArray.forEach((extra) => {
      const categoryName = extra.categoryName;
      if(categoryName) {
        categoriesArray.push(categoryName);
      }
    });

    return categoriesArray
  };

  const sortedExtrasCategories = defineExtrasCategories().sort();

  const toggleSelectedCategory = (selectedCategory: string) => {
    const categoryIndex = selectedCategories.indexOf(selectedCategory);

    if (categoryIndex === -1) {
      setSelectedCategories([...selectedCategories, selectedCategory]);
    } else {
      const updatedCategories = selectedCategories.filter((category) => category !== selectedCategory);
      setSelectedCategories(updatedCategories);
    }
  };

  useEffect(() => {
    console.log('EXTRAS CATEGORIES', selectedCategories)
  }, [selectedCategories]);

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

  const removeCategory = (categoryName: string) => {
    const updatedCategories = selectedCategories.filter((category) => category !== categoryName);
    setSelectedCategories(updatedCategories);
  };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Extras / Background Actors
        </p>
        <AddButton
          id="open-add-scene-extras-categories-modal"
          slot='end'
        />
      </div>
      {/* <IonAlert
        trigger="extra-category-alert"
        header="Please, enter an extra category name"
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
            placeholder: 'Extra Category Name',
            id: 'add-extra-category-input',
          },
        ]}
      /> */}

      <InputModal
        optionName="Extras Categories"
        listOfOptions={[]}
        modalTrigger='open-add-scene-extras-categories-modal'
        handleCheckboxToggle={toggleSelectedCategory}
        selectedOptions={selectedCategories}
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
            >
              <IonCardHeader className="ion-flex">
                <div className="ion-flex ion-justify-content-between">
                  <p className="ion-flex ion-align-items-center">
                    {capitalizeString(category)}
                  </p>
                  <div className='category-buttons-wrapper'>
                    <AddButton
                      id="character-item-alert"
                    />
                    <DeleteButton
                      onClick={() => { removeCategory(category); }}
                    />
                  </div>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <AddExtraInput
                  categoryName={category}
                  toggleForm={toggleForm}
                  handleSceneChange={handleSceneChange}
                  id={index}
                />
              </IonCardContent>
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddExtraForm;
