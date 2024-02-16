import { useContext, useEffect, useState } from 'react';
import {
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  AlertInput,
} from '@ionic/react';
import AddCharacterInput from './AddCharacterInput';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import { Character } from '../../../interfaces/scenesTypes';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../Shared/InputAlert/InputAlert';
import DropDownButton from '../../Shared/DropDownButton/DropDownButton';
import DatabaseContext from '../../../context/database';

interface AddCategoryFormProps {
  handleSceneChange: (value: any, field: string) => void;
  observedCharacters: Character[];
}

const AddCharacterForm: React.FC<AddCategoryFormProps> = ({ handleSceneChange, observedCharacters }) => {
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const { offlineScenes } = useContext(DatabaseContext);

  useEffect(() => {
    if (!observedCharacters) {
      setSelectedCharacters([]);
      setDropDownIsOpen(false);
    }
  }, [observedCharacters]);

  useEffect(() => {
    handleSceneChange(selectedCharacters, 'characters');
  }, [selectedCharacters]);

  useEffect(() => {
    const defineCharactersCategories = () => {
      const characterCategoriesArray: string[] = [];
      const uniqueCategoryValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName');
      uniqueCategoryValuesArray.forEach((character: Character) => {
        const { categoryName } = character;
        characterCategoriesArray.push(categoryName);
      });

      return characterCategoriesArray.sort();
    };

    setCharacterCategories(defineCharactersCategories());
  }, [offlineScenes]);

  const [characterCategories, setCharacterCategories] = useState<string[]>([]);

  const handleOk = (inputData: { categoryName: string; }) => {
    const inputElement = document.getElementById('add-category-input');
    if (inputData.categoryName) {
      setCharacterCategories([...characterCategories, inputData.categoryName]);
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
      id: 'add-category-input',
    },
  ];

  const handleDropDown = () => {
    setDropDownIsOpen(!dropDownIsOpen);
  };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Characters
        </p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          <AddButton
            id="characters-category-alert"
            slot="end"
          />
          <DropDownButton open={dropDownIsOpen} handleDropDown={handleDropDown} />
        </div>
      </div>

      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger="characters-category-alert"
        header="Add Category"
        message="Please enter the name of the category you want to add"
      />

      {
        characterCategories.length === 0
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

      {characterCategories.length > 0 && dropDownIsOpen
        && (
        <IonGrid className="add-scene-items-card-grid">
          {[...characterCategories, 'NO CATEGORY'].map((category, index) => (
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
                      id={`open-characters-options-modal-${category}`}
                    />
                  </div>
                </div>
              </IonCardHeader>
              <AddCharacterInput
                categoryName={category}
                selectedCharacters={selectedCharacters}
                setSelectedCharacters={setSelectedCharacters}
              />
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddCharacterForm;