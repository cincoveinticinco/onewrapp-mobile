import { useContext, useEffect, useState, useCallback } from 'react';
import {
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
} from '@ionic/react';
import AddCharacterInput from './AddCharacterInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import { Character, SceneDocType } from '../../../../Shared/types/scenes.types';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import removeNumberAndDot from '../../../../Shared/Utils/removeNumberAndDot';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';

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
}) => {
  const { offlineScenes } = useContext(DatabaseContext);

  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>(observedCharacters || []);
  const [characterCategories, setCharacterCategories] = useState<(string)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const filterCharactersByCategory = (categoryName: string | null) => selectedCharacters.filter((character: any) => {
    return character.categoryName === categoryName;
  });

  const defineCharactersCategories = useCallback((): (string)[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName');
    console.log(uniqueCategoryValues);
    return Array.from(new Set(uniqueCategoryValues
      .map(character => (!character.categoryName || character.categoryName === '' ? null : character.categoryName))
      .sort((a, b) => (a && b ? a.localeCompare(b) : 0))));
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

  const toggleModal = (category: string) => {
    setModalStates(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter categories based on whether they have elements if not in editMode
  const filteredCategories = editMode
    ? characterCategories
    : characterCategories.filter(category => 
        observedCharacters.some(char => char.categoryName === category)
      );

  const toggleCharacters = (character: string) => {
    const sceneWithCharacter = offlineScenes.find((scene: any) => scene.characters.some(
      (char: any) => char.characterName.toUpperCase()
          === removeNumberAndDot(character.toUpperCase()),
    ));

    const characterObject = sceneWithCharacter?.characters?.find(
      (char: any) => char.characterName.toUpperCase()
        === removeNumberAndDot(character.toUpperCase()),
    );

    if (characterObject) {
      const selectedCharacterObjectIndex = selectedCharacters.findIndex(
        (char: any) => char.characterName === characterObject.characterName,
      );
      if (selectedCharacterObjectIndex !== -1) {
        setSelectedCharacters((currentCharacters: any) => currentCharacters.filter(
          (char: any) => char.characterName !== characterObject.characterName,
        ));
      } else if (selectedCharacterObjectIndex === -1) {
        const newCharacter: any = { ...characterObject };

        setSelectedCharacters((currentCharacters: any) => [
          ...currentCharacters,
          newCharacter,
        ]);
      }
    }
  };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">CHARACTERS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && (
            <AddButton 
              onClick={() => setAddCategoryModalOpen(true)} 
              slot="end"
            />
          )}
        </div>
      </div>

      <InputModalWithSections
        optionName="Categories"
        listOfOptions={characterCategories.map(category => ({ 
          category: category, 
          options: filterCharactersByCategory(category)
            .map(character => character.characterName)
            .filter((name): name is string => name !== undefined)
        }))}
        clearSelections={() => {}}
        isOpen={addCategoryModalOpen}
        setIsOpen={setAddCategoryModalOpen}
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

      {dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {filteredCategories.map((category, index) => (
            category && (
              <IonCard 
                key={`category-item-${index}-category-${category}`} 
                style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} 
                className="add-scene-items-card ion-no-border"
              >
                <IonCardHeader className="ion-flex">
                  <div className="ion-flex ion-justify-content-between">
                    <p className="ion-flex ion-align-items-center">
                      {category.toUpperCase()}
                    </p>
                    <div className="category-buttons-wrapper">
                      {editMode && (
                        <AddButton 
                          onClick={(e) => { 
                            toggleModal(category); 
                            e.stopPropagation(); 
                          }}
                        />
                      )}
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
      )}
    </>
  );
};

export default AddCharacterForm;