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
import { add, trash } from 'ionicons/icons';
import AddCharacterInput from './AddCharacterInput';
import InputModal from '../../Shared/InputModal/InputModal';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import scenesData from '../../../data/scn_data.json'
import { Character } from '../../../interfaces/scenesTypes';
import AddButton from '../../Shared/AddButton/AddButton';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import capitalizeString from '../../../utils/capitalizeString';

interface AddCategoryFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddCharacterForm: React.FC<AddCategoryFormProps> = ({ handleSceneChange }) => {
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
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
    console.log('CHAR CATEGORIES', selectedCategories)
  }, [selectedCategories]);

  // const handleOk = (inputData: { categoryName: string; }) => {
  //   const inputElement = document.getElementById('add-category-input');
  //   if (inputData.categoryName) {
  //     setSelectedCategories([...selectedCategories, inputData.categoryName]);
  //   }
  //   if (inputElement) {
  //     (inputElement as HTMLInputElement).value = '';
  //   }
  // };

  const removeCategory = (categoryName: string) => {
    const updatedCategories = selectedCategories.filter((category) => category !== categoryName);
    setSelectedCategories(updatedCategories);
  };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Characters
        </p>
        <AddButton
          id="open-add-scene-character-category-modal"
          slot='end'
        />
      </div>

      <InputModal
        optionName="Character Categories"
        listOfOptions={[...sortedCharactersCategories, 'NO CATEGORY']}
        modalTrigger='open-add-scene-character-category-modal'
        handleCheckboxToggle={toggleSelectedCategory}
        selectedOptions={selectedCategories}
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
                  <p className="ion-flex ion-align-items-center">
                    {capitalizeString(category)}
                  </p>
                  <div className='category-buttons-wrapper'>
                    <AddButton
                      id="open-character-options-modal"
                    />
                    <DeleteButton
                      onClick={() => { removeCategory(category); }}
                    />
                  </div>
                  
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
