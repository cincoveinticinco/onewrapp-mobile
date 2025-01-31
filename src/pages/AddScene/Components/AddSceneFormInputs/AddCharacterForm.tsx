import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  AlertInput,
} from '@ionic/react';
import AddCharacterInput from './AddCharacterInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import { Character } from '../../../../Shared/types/scenes.types';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import capitalizeString from '../../../../Shared/Utils/capitalizeString';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import DropDownButton from '../../../../Shared/Components/DropDownButton/DropDownButton';
import DatabaseContext from '../../../../context/Database/Database.context';

interface AddCharacterFormProps {
  handleSceneChange: (value: any, field: string) => void;
  observedCharacters: Character[];
  editMode?: boolean;
  detailsEditMode?: boolean;
}

const AddCharacterForm: React.FC<AddCharacterFormProps> = ({
  handleSceneChange,
  observedCharacters,
  editMode,
  detailsEditMode,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const alertRef = useRef<HTMLIonAlertElement>(null);

  // State
  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>(observedCharacters || []);
  const [characterCategories, setCharacterCategories] = useState<(string | null)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});

  // Fetch initial categories from offline scenes
  const defineCharactersCategories = useCallback(() => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName');
    return uniqueCategoryValues
      .map(character => character.categoryName)
      .filter((categoryName): categoryName is string | null => categoryName !== undefined)
      .sort();
  }, [offlineScenes]);

  // Initialize categories on mount
  useEffect(() => {
    setCharacterCategories(defineCharactersCategories());
  }, [defineCharactersCategories]);

  // Handle dropdown visibility when there are no characters
  useEffect(() => {
    if (!observedCharacters?.length) {
      setDropDownIsOpen(true);
    }
  }, [observedCharacters]);

  // Sync observedCharacters with selectedCharacters when they change
  useEffect(() => {
    if (observedCharacters && JSON.stringify(observedCharacters) !== JSON.stringify(selectedCharacters)) {
      setSelectedCharacters(observedCharacters);
    }
  }, [observedCharacters]);

  // Update parent component when selected characters change
  const handleSelectedCharactersChange = useCallback((newCharacters: Character[]) => {
    setSelectedCharacters(newCharacters);
  }, [handleSceneChange]);

  useEffect(() => {
    handleSceneChange(selectedCharacters, 'characters');
  }, [selectedCharacters]);

  // Handlers
  const handleOk = (inputData: { [key: string]: any }) => {
    if (inputData.categoryName) {
      setCharacterCategories(prev => {
        const newCategories = [...prev, inputData.categoryName];
        return newCategories.sort();
      });
    }
  };

  const handleDropDown = () => {
    setDropDownIsOpen(!dropDownIsOpen);
  };

  const toggleModal = (category: string) => {
    setModalStates(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Helper functions
  const getAlertTrigger = () => {
    if (editMode) return 'characters-categories-alert-edit';
    if (detailsEditMode) return 'characters-categories-alert-details-edit';
    return 'characters-categories-alert';
  };

  const getModalTrigger = () => {
    if (editMode) return 'open-characters-options-modal-edit';
    if (detailsEditMode) return 'open-characters-options-modal-details-edit';
    return 'open-characters-options-modal';
  };

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-category-input',
    },
  ];

  return (
    <>
      <div
        className="category-item-title ion-flex ion-justify-content-between"
        onClick={handleDropDown}
        style={{ backgroundColor: 'var(--ion-color-tertiary-shade)' }}
      >
        <p className="ion-flex ion-align-items-center">Characters</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          <AddButton id={getAlertTrigger()} slot="end"  onClick={(e) => { e.stopPropagation(); }}/>
          <DropDownButton open={dropDownIsOpen} />
        </div>
      </div>

      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger={getAlertTrigger()}
        header="Add Category"
        message="PLEASE ENTER THE NAME OF THE CATEGORY YOU WANT TO ADD"
        ref={alertRef}
      />

      {characterCategories.length === 0 && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO CHARACTERS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {characterCategories.length > 0 && dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {[...characterCategories, 'NO CATEGORY'].map((category, index) => 
            category && (
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
                        id={`${getModalTrigger()}${category}`}
                        onClick={(e) => { toggleModal(category); e.stopPropagation(); }}
                      />
                    </div>
                  </div>
                </IonCardHeader>
                <AddCharacterInput
                  categoryName={category}
                  selectedCharacters={selectedCharacters}
                  setSelectedCharacters={handleSelectedCharactersChange}
                  openModal={modalStates[category] || false}
                  setOpenModal={(isOpen: boolean) => toggleModal(category)}
                />
              </IonCard>
            )
          )}
        </IonGrid>
      )}
    </>
  );
};

export default AddCharacterForm;