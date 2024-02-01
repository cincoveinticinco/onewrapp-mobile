import { useEffect, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonAlert,
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import AddCharacterInput from './AddCharacterInput';
import InputModal from '../../Shared/InputModal/InputModal';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import scenesData from '../../../data/scn_data.json'
import { Character } from '../../../interfaces/scenesTypes';

interface AddCategoryFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddCharacterForm: React.FC<AddCategoryFormProps> = ({ handleSceneChange }) => {
  
  const [selectedCategories, setCategories] = useState<string[]>([]);
  
  const defineCharactersCategories = () => {
    const scenes = scenesData.scenes;
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(scenes, 'characters', 'categoryName');
    
    uniqueValuesArray.forEach((character: Character) => {
      const categoryName = character.categoryName;
      categoriesArray.push(categoryName);
    });

    return categoriesArray
  };

  const sortedCharactersCategories = defineCharactersCategories();

  // const handleOk = (inputData: { categoryName: string; }) => {
  //   const inputElement = document.getElementById('add-category-input');
  //   if (inputData.categoryName) {
  //     setCategories([...selectedCategories, inputData.categoryName]);
  //   }
  //   if (inputElement) {
  //     (inputElement as HTMLInputElement).value = '';
  //   }
  // };

  // const removeCategory = (categoryName: string) => {
  //   const updatedCategories = selectedCategories.filter((category) => category !== categoryName);
  //   setCategories(updatedCategories);
  // };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Characters
        </p>
        <IonButton fill="clear" id="open-add-scene-character-category-modal" slot="end" color="light" className="ion-no-padding">
          <IonIcon icon={add} />
        </IonButton>
      </div>
      {/* <IonAlert
        color="tertiary"
        trigger="category-alert"
        header="Please, enter a category name"
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
            placeholder: 'Category Name',
            id: 'add-category-input',
          },
        ]}
      /> */}

      <InputModal
        optionName="Character Categories"
        listOfOptions={sortedCharactersCategories}
        modalTrigger='open-add-scene-character-category-modal'
      />

      {
        selectedCategories.length === 0
        && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO CHARACTERS ADDED TO THIS STRIP
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
                    fill="clear"
                    color="light"
                    id="character-item-alert"
                  >
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <AddCharacterInput
                  categoryName={category}
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

export default AddCharacterForm;
