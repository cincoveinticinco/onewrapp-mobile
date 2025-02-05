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
import { Character, SceneDocType } from '../../../../Shared/types/scenes.types';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import capitalizeString from '../../../../Shared/Utils/capitalizeString';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import DatabaseContext from '../../../../context/Database/Database.context';

interface AddCharacterFormProps {
  handleSceneChange: (value: any, field: keyof SceneDocType) => void
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

  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>(observedCharacters || []);
  const [characterCategories, setCharacterCategories] = useState<(string | null)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});

  const defineCharactersCategories = useCallback(() => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName');
    return uniqueCategoryValues
      .map(character => character.categoryName)
      .filter((categoryName): categoryName is string | null => categoryName !== undefined)
      .sort();
  }, [offlineScenes]);

  useEffect(() => {
    setCharacterCategories(defineCharactersCategories());
  }, [defineCharactersCategories]);

  useEffect(() => {
    if (!observedCharacters?.length) {
      setDropDownIsOpen(true);
    }
  }, [observedCharacters]);

  useEffect(() => {
    if (observedCharacters && JSON.stringify(observedCharacters) !== JSON.stringify(selectedCharacters)) {
      setSelectedCharacters(observedCharacters);
    }
  }, [observedCharacters]);

  const handleSelectedCharactersChange = useCallback((newCharacters: Character[]) => {
    setSelectedCharacters(newCharacters);
  }, [handleSceneChange]);

  useEffect(() => {
    handleSceneChange(selectedCharacters, 'characters');
  }, [selectedCharacters]);

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

  const getAlertTrigger = () => (editMode ? 'characters-categories-alert-edit' : detailsEditMode ? 'characters-categories-alert-details-edit' : 'characters-categories-alert');

  const getModalTrigger = () => (editMode ? 'open-characters-options-modal-edit' : detailsEditMode ? 'open-characters-options-modal-details-edit' : 'open-characters-options-modal');

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-category-input',
    },
  ];

  // Filter categories based on whether they have elements if not in editMode
  const filteredCategories = editMode
    ? characterCategories
    : characterCategories.filter(category => 
        observedCharacters.some(char => char.categoryName === category)
      );

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">CHARACTERS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && (<AddButton id={getAlertTrigger()} slot="end"  onClick={(e) => { e.stopPropagation(); }}/>)}
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

        {filteredCategories.length === 0 && !editMode && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>
              NO EXTRAS AVAILABLE
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {(
        dropDownIsOpen && (
          <IonGrid className="add-scene-items-card-grid">
            {filteredCategories.map((category, index) => (
              category && (
                <IonCard key={`category-item-${index}-category-${category}`} style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="add-scene-items-card ion-no-border">
                  <IonCardHeader className="ion-flex">
                    <div className="ion-flex ion-justify-content-between">
                      <p className="ion-flex ion-align-items-center">
                        {category.toUpperCase()}
                      </p>
                      <div className="category-buttons-wrapper">
                        {editMode && (<AddButton onClick={(e) => { toggleModal(category); e.stopPropagation(); }}/>)}
                      </div>
                    </div>
                  </IonCardHeader>
                  <AddCharacterInput
                    categoryName={category}
                    selectedCharacters={selectedCharacters}
                    setSelectedCharacters={handleSelectedCharactersChange}
                    openModal={modalStates[category] || false}
                    setOpenModal={(isOpen: boolean) => toggleModal(category)}
                    editMode={editMode}
                  />
                </IonCard>
              )
            ))}
          </IonGrid>
        )
      )}
    </>
  );
};

export default AddCharacterForm;
