import { useContext, useEffect, useState } from 'react';
import {
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  AlertInput,
} from '@ionic/react';
import { get } from 'lodash';
import AddCharacterInput from './AddCharacterInput';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import { Character } from '../../../interfaces/scenes.types';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../../Layouts/InputAlert/InputAlert';
import DropDownButton from '../../Shared/DropDownButton/DropDownButton';
import DatabaseContext from '../../../context/Database.context';

interface AddCategoryFormProps {
  handleSceneChange: (value: any, field: string) => void;
  observedCharacters: Character[];
  editMode?: boolean;
  detailsEditMode?: boolean;
}

const AddCharacterForm: React.FC<AddCategoryFormProps> = ({
  handleSceneChange, observedCharacters, editMode, detailsEditMode,
}) => {
  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const { offlineScenes } = useContext(DatabaseContext);
  const [charactersFetched, setCharactersFetched] = useState(false);

  useEffect(() => {
    if (!observedCharacters) {
      setDropDownIsOpen(true);
    }
  }, [observedCharacters]);

  useEffect(() => {
    if (observedCharacters && selectedCharacters.length === 0 && !charactersFetched) {
      setSelectedCharacters(observedCharacters);
      setCharactersFetched(true);
    }
  }, [observedCharacters, charactersFetched]);

  useEffect(() => {
    handleSceneChange(selectedCharacters, 'characters');
  }, [selectedCharacters]);

  const characterCategoriesArray: (string | null)[] = [];
  const uniqueCategoryValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName');

  useEffect(() => {
    const defineCharactersCategories = () => {
      uniqueCategoryValuesArray.forEach((character: Character) => {
        const { categoryName } = character;
        characterCategoriesArray.push(categoryName);
      });

      return characterCategoriesArray.sort();
    };

    setCharacterCategories(defineCharactersCategories());
  }, [offlineScenes]);

  const [characterCategories, setCharacterCategories] = useState<(string | null)[]>([]);

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

  const getAlertTrigger = () => {
    if (editMode) {
      return 'characters-categories-alert-edit';
    }

    if (detailsEditMode) {
      return 'characters-categories-alert-details-edit';
    }

    return 'characters-categories-alert';
  };

  const getModalTrigger = () => {
    if (editMode) {
      return 'open-characters-options-modal-edit';
    }

    if (detailsEditMode) {
      return 'open-characters-options-modal-details-edit';
    }

    return 'open-characters-options-modal';
  };

  return (
    <>
      <div
        className="category-item-title ion-flex ion-justify-content-between"
        onClick={handleDropDown}
        style={{ backgroundColor: 'var(--ion-color-tertiary-shade)' }}
      >
        <p className="ion-flex ion-align-items-center">
          Characters
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

      {characterCategories.length > 0 && dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {[...characterCategories, 'NO CATEGORY'].map((category, index) => (
            category && (
              <IonCard
                key={`category-item-${index}-category-${category}`}
                color="tertiary"
                className="add-scene-items-card ion-no-border"
              >
                <IonCardHeader className="ion-flex">
                  <div className="ion-flex ion-justify-content-between">
                    <p className="ion-flex ion-align-items-center">
                      {category && capitalizeString(category)}
                    </p>
                    <div className="category-buttons-wrapper">
                      <AddButton
                        id={getModalTrigger() + category}
                      />
                    </div>
                  </div>
                </IonCardHeader>
                <AddCharacterInput
                  categoryName={category}
                  selectedCharacters={selectedCharacters}
                  setSelectedCharacters={setSelectedCharacters}
                  modalTrigger={getModalTrigger() + category}
                />
              </IonCard>
            )
          ))}
        </IonGrid>
      )}
    </>
  );
};

export default AddCharacterForm;
