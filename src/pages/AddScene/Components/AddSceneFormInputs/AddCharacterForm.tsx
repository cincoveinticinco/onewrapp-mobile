import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
} from '@ionic/react';
import AddCharacterInput from './AddCharacterInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import { Character } from '../../../../Shared/types/scenes.types';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';

interface AddCharacterFormProps {
  observedCharacters: Character[];
  editMode?: boolean;
  detailsEditMode?: boolean;
  setCharacters: (characters: Character[]) => void;
}

const AddCharacterForm: React.FC<AddCharacterFormProps> = ({
  observedCharacters,
  editMode,
  setCharacters
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [characterCategories, setCharacterCategories] = useState<string[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleModalOpen = () => {
    if(addCategoryModalOpen) {
      setAddCategoryModalOpen(false);
      setSelectedCategory(null);
    } else {
      setAddCategoryModalOpen(true);
    }
  }
  
  const uniqueCharacters = useMemo(() => {
    const offlineChars = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'characterName');
    const mergedChars = [...offlineChars];
    
    observedCharacters.forEach(char => {
      if (!mergedChars.some(existing => existing.characterName === char.characterName)) {
        mergedChars.push(char);
      }
    });
    
    return mergedChars;
  }, [offlineScenes, observedCharacters]);

  const filterCharactersByCategory = useMemo(() => (categoryName: string | null) => 
    uniqueCharacters.filter((character: any) => {
      if(categoryName === 'NO CATEGORY') {
        return !character.categoryName;
      }
      return character.categoryName === categoryName;
    }), [uniqueCharacters]);

  const defineCharactersCategories = useCallback((): string[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName').map(category => category.categoryName ? category.categoryName : 'NO CATEGORY');
    console.log(uniqueCategoryValues);
    const observedCategories = observedCharacters.map(character => character.categoryName);

    const allCategories = [...uniqueCategoryValues, ...observedCategories]

    const uniqueCategories = Array.from(new Set(allCategories
      .sort((a, b) => (a && b ? String(a).localeCompare(String(b)) : 0))));

    return uniqueCategories;
  }, [offlineScenes, observedCharacters]);

  useEffect(() => {
    setCharacterCategories(defineCharactersCategories());
  }, [defineCharactersCategories]);

  const handleSelectedCharactersChange = useCallback((newCharacters: Character[]) => {
    setCharacters(newCharacters);
  }, [setCharacters]);

  const filteredCategories = characterCategories


  const setNewCharacters = (charactersValues: {
    value: string | number;
    category: string;
  }[]) => {
    const newCharacters: Character[] = charactersValues.map((character) => {
      const existingCharacter = uniqueCharacters.find(
        (char) => char.characterName.toLowerCase() === String(character.value).toLowerCase()
      );
      
      return existingCharacter || {
        characterName: character.value,
        categoryName: character.category,
        characterNum: ''
      } as Character;
    });
    setCharacters(newCharacters);
  };

  const getCharactersInCategoryLength = (category: string) => {
    let filteredCharacters = uniqueCharacters;
    if(category === 'NO CATEGORY') {
      filteredCharacters =  uniqueCharacters.filter(character => !character.categoryName || character.categoryName == '');
      console.log(filteredCharacters);
      return filteredCharacters.length
    }
    return uniqueCharacters.filter(character => character.categoryName === category).length;
  };

  const getObservedCharactersInCategoryLength = (category: string) => {
    if(category === 'NO CATEGORY') { 
      return observedCharacters.filter(character => !character.categoryName || character.categoryName == '').length;
    }

    return observedCharacters.filter(character => character.categoryName === category).length;
  }

  const openModalWithCategory = (category: string) => {
    setSelectedCategory(category);
    setAddCategoryModalOpen(true);
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
        setIsOpen={handleModalOpen}
        setValues={setNewCharacters}
        selectedCategory={selectedCategory}
      />

      {filteredCategories.every(c => getCharactersInCategoryLength(c) == 0) && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>     
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>
              NO CHARACTERS AVAILABLE
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {filteredCategories
            .filter(category => editMode ?  getCharactersInCategoryLength(category) > 0 : getObservedCharactersInCategoryLength(category) > 0)
            .map((category, index) => (
            (
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
                            openModalWithCategory(category);
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