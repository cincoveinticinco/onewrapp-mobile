import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
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
  setCharacters: (characters: Character[]) => void;
}

const AddCharacterForm: React.FC<AddCharacterFormProps> = ({
  handleSceneChange,
  observedCharacters,
  editMode,
  setCharacters
}) => {
  const { offlineScenes } = useContext(DatabaseContext);

  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [characterCategories, setCharacterCategories] = useState<(string)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [uniqueCharacters, setUniqueCharacters] = useState<{
    characterName: string;
    categoryName: string;
    characterNum: string;
  }[]>([]);


  const filterCharactersByCategory = useMemo(() => (categoryName: string | null) => uniqueCharacters.filter((character: any) => {
    if(categoryName === 'NO CATEGORY') {
      return character.categoryName === null || character.categoryName === '' || character.categoryName === undefined;
    }
    return character.categoryName === categoryName;
  }), [uniqueCharacters]);

  const defineCharactersCategories = useCallback((): (string)[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName');
    return Array.from(new Set(uniqueCategoryValues
      .map(character => (!character.categoryName || character.categoryName === '' ? 'NO CATEGORY' : character.categoryName))
      .sort((a, b) => (a && b ? a.localeCompare(b) : 0))));
  }, [offlineScenes]);

  const defineUniqueCharacters = useCallback(() => {
    const uniqueCharacters = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    setUniqueCharacters(uniqueCharacters);
  }, [offlineScenes]);

  useEffect(() => {
    setCharacterCategories(defineCharactersCategories());
  }, [defineCharactersCategories]);

  useEffect(() => {
    defineUniqueCharacters();
  }, [defineUniqueCharacters]);

  useEffect(() => {
    if (!observedCharacters?.length) {
      setDropDownIsOpen(true);
    }
  }, [observedCharacters]);

  const handleSelectedCharactersChange = useCallback((newCharacters: Character[]) => {
    setCharacters(newCharacters);
  }, [handleSceneChange]);

  const toggleModal = (category: string) => {
    setModalStates(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter categories based on whether they have elements if not in editMode
  const filteredCategories = characterCategories
  
  const toggleCharacters = (character: string) => {
    
  };

  const setNewCharacters = (charactersValues: string[]) => {
    const newCharacters: any = charactersValues.map((characterName: string) => {
      const existingCharacter = uniqueCharacters.find(
        (char) => char.characterName.toLowerCase() === characterName.toLowerCase()
      );
      
      const newCharacter: Character = existingCharacter || {
          characterName: characterName,
          categoryName: '',
          characterNum: ''
        } as Character;
      
      return newCharacter;
    });
    setCharacters(newCharacters);
  }


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
            .map(character => ({
              label: `${character.characterNum ? `${character.characterNum}.` : ''} ${character.characterName.toUpperCase()}`,
              value: character.characterName,
              checked: observedCharacters.some(char => char.characterName === character.characterName)
            }))
        }))}
        clearSelections={() => {}}
        isOpen={addCategoryModalOpen}
        setIsOpen={setAddCategoryModalOpen}
        setValues={setNewCharacters}
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
                  selectedCharacters={observedCharacters}
                  setSelectedCharacters={handleSelectedCharactersChange}
                  openModal={modalStates[category] || false}
                  setOpenModal={(isOpen: boolean) => toggleModal(category)}
                  editMode={editMode}
                  toggleCharacters={toggleCharacters}
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