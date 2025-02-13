import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  IonGrid,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  AlertInput,
  IonButton,
} from '@ionic/react';
import AddCharacterInput from './AddCharacterInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import { Character } from '../../../../Shared/types/scenes.types';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';
import { VscEdit } from 'react-icons/vsc';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';

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
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editCharacterModal, setEditCharacterModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

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
      const existingCharIndex = mergedChars.findIndex(
        existing => existing.characterName === char.characterName
      );
      
      if (existingCharIndex === -1) {
        mergedChars.push(char);
      } else {
        mergedChars[existingCharIndex] = {
          ...mergedChars[existingCharIndex],
          categoryName: char.categoryName
        };
      }
    });
    
    return mergedChars;
  }, [offlineScenes, observedCharacters]);

  const filterCharactersByCategory = useMemo(() => (categoryName: string | null) => 
    uniqueCharacters.filter((character: any) => {
      if(categoryName === EmptyEnum.NoCategory) {
        return !character.categoryName;
      }
      return character.categoryName === categoryName;
    }), [uniqueCharacters]);

  useEffect(() => {
    console.log(uniqueCharacters)
  }, [filterCharactersByCategory])

  const defineCharactersCategories = useCallback((): string[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'characters', 'categoryName').map(category => category.categoryName ? category.categoryName : EmptyEnum.NoCategory);
    const observedCategories = observedCharacters.map(character => character.categoryName).map(category => category ? category : EmptyEnum.NoCategory);

    const allCategories = [...uniqueCategoryValues, ...observedCategories, EmptyEnum.NoCategory];

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

  const filteredCategories = useMemo(() => characterCategories, [characterCategories]);


  const setNewCharacters = (charactersValues: {
    value: string | number;
    category: string | null;
  }[]) => {
    const newCharacters: Character[] = charactersValues.map((character) => {
      const existingCharacter = uniqueCharacters.find(
        (char) => char.characterName.toLowerCase() === String(character.value).toLowerCase()
      );
      
      return existingCharacter || {
        characterName: character.value,
        categoryName: character.category === EmptyEnum.NoCategory ? null : character.category,
        characterNum: ''
      } as Character;
    });
    console.log(newCharacters)
    setCharacters(newCharacters);
  };

  const getObservedCharactersInCategoryLength = (category: string) => {
    if(category === EmptyEnum.NoCategory || !category) { 
      return observedCharacters.filter(character => !character.categoryName || character.categoryName == '').length;
    }

    return observedCharacters.filter(character => character.categoryName === category).length;
  }

  const openCategoryEditor = (category: string) => () => {
    setSelectedCategory(category);
    setEditCategoryModal(true);
  }

  const editCategoryInputs = useMemo((): AlertInput[] => [
    {
      name: 'category',
      type: 'text',
      placeholder: 'Category Name',
      value: selectedCategory == EmptyEnum.NoCategory ? '' : selectedCategory,
    }
  ], [selectedCategory]);

  const onEditCategory = (inputData: { [key: string]: any }) => {
    const observedCharactersCopy = structuredClone(observedCharacters);
    const updatedCharacters = observedCharactersCopy.map(character => {
      if(selectedCategory === EmptyEnum.NoCategory && !character.categoryName) {
        character.categoryName = inputData.category;
      }
      if(character.categoryName === selectedCategory) {
        character.categoryName = inputData.category;
      }
      return character;
    });
    setCharacters(updatedCharacters);
    setCharacterCategories(defineCharactersCategories());
    setEditCategoryModal(false);
  }

  const EditCategoryAlert = () => (
    <InputAlert
      isOpen={editCategoryModal}
      inputs={editCategoryInputs}
      header="Edit Category"
      handleOk={onEditCategory}
      handleCancel={() => setEditCategoryModal(false)}
    />
  )

  const openEditCharacterModal = (character: Character) => {
    console.log('executed')
    setSelectedCharacter(character);
    setEditCharacterModal(true);
  }

  const onEditCharacter = (inputData: { [key: string]: any }) => {
    const updatedCharacters = observedCharacters.map(character => {
      if (character.characterName === selectedCharacter?.characterName) {
        return {
          ...character,
          categoryName: inputData.category,
          characterNum: inputData.characterNum,
          characterName: inputData.characterName
        }
      }
      return character;
    });
    setCharacters(updatedCharacters);
    setEditCharacterModal(false);
  }
    

  const formInputs: AlertInput[] = [
    {
      name: 'category',
      type: 'text',
      placeholder: 'Category Name',
      value: selectedCharacter?.categoryName,
    },
    {
      name: 'characterNum',
      type: 'number',
      placeholder: 'Character Number',
      value: selectedCharacter?.characterNum,
    },
    {
      name: 'characterName',
      type: 'text',
      placeholder: 'Character Name',
      value: selectedCharacter?.characterName,
    }
  ];

  const EditCharacterModal = () => (
    <InputAlert
      isOpen={editCharacterModal}
      inputs={formInputs}
      header="Edit Character"
      handleOk={onEditCharacter}
      handleCancel={() => { setEditCharacterModal(false); setSelectedCharacter(null); }}
    />
  )

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

      {filteredCategories.every(c => getObservedCharactersInCategoryLength(c) == 0) && !editMode  && (
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
            .filter(category => getObservedCharactersInCategoryLength(category) > 0)
            .map((category, index) => (
            (
              <IonCard 
                key={`category-item-${index}-category-${category}`} 
                color='tertiary-dark'
                className="add-scene-items-card ion-no-border"
              >
                <IonCardHeader className="ion-flex">
                  <div className="ion-flex ion-justify-content-between">
                    <p className="ion-flex ion-align-items-center">
                      {category?.toUpperCase()}
                    </p>
                    {editMode && (
                      <IonButton fill="clear" color='primary' onClick={openCategoryEditor(category)} className='ion-no-padding'>
                        <VscEdit className="label-button" />
                      </IonButton>
                    )}
                  </div>
                </IonCardHeader>
                <AddCharacterInput
                  categoryName={category}
                  selectedCharacters={observedCharacters}
                  setSelectedCharacters={handleSelectedCharactersChange}
                  editMode={editMode}
                  openEditCharacter={openEditCharacterModal}
                />
              </IonCard>
            )
          ))}
        </IonGrid>
      )}
      {editCategoryModal && <EditCategoryAlert /> }
      {editCharacterModal && <EditCharacterModal />}
    </>
  );
};

export default AddCharacterForm;