import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { IonGrid, IonCard, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddElementInput from './AddElementInput';

interface Element {
  elementName: string;
  categoryName: string | null;
}

interface AddElementFormProps {
  observedElements: Element[];
  editMode?: boolean;
  setElements: (elements: Element[]) => void;
}

const AddElementForm: React.FC<AddElementFormProps> = ({
  observedElements,
  editMode,
  setElements,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [elementsCategories, setElementsCategories] = useState<string[]>([]);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleModalOpen = () => {
    if (addCategoryModalOpen) {
      setAddCategoryModalOpen(false);
      setSelectedCategory(null);
    } else {
      setAddCategoryModalOpen(true);
    }
  };

  const uniqueElements = useMemo(() => {
    const offlineElements = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'elementName');
    const mergedElements = [...offlineElements];

    observedElements.forEach(el => {
      if (!mergedElements.some(existing => existing.elementName === el.elementName)) {
        mergedElements.push(el);
      }
    });

    return mergedElements;
  }, [offlineScenes, observedElements]);

  const filterElementsByCategory = useMemo(() => (categoryName: string | null) =>
    uniqueElements.filter((element: any) => {
      if (categoryName === 'NO CATEGORY') {
        return !element.categoryName;
      }
      return element.categoryName === categoryName;
    }), [uniqueElements]);

  const defineElementsCategories = useCallback((): string[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName')
      .map(category => category.categoryName ? category.categoryName : 'NO CATEGORY');

    const observedCategories = observedElements.map(element => element.categoryName || 'NO CATEGORY');

    const allCategories = [...uniqueCategoryValues, ...observedCategories];

    return Array.from(new Set(allCategories.sort((a, b) => (a && b ? String(a).localeCompare(String(b)) : 0))));
  }, [offlineScenes, observedElements]);

  useEffect(() => {
    setElementsCategories(defineElementsCategories());
  }, [defineElementsCategories]);

  const setNewElements = (elementsValues: {
    value: string | number;
    category: string | null;
  }[]) => {
    const newElements: Element[] = elementsValues.map((element) => {
      const existingElement = uniqueElements.find(
        (el) => el.elementName.toLowerCase() === String(element.value).toLowerCase()
      );

      return existingElement || {
        elementName: String(element.value),
        categoryName: element.category,
      } as Element;
    });
    setElements(newElements);
  };

  const getElementsInCategoryLength = (category: string) => {
    if (category === 'NO CATEGORY') {
      return uniqueElements.filter(element => !element.categoryName).length;
    }
    return uniqueElements.filter(element => element.categoryName === category).length;
  };

  const getObservedElementsInCategoryLength = (category: string) => {
    if (category === 'NO CATEGORY') {
      return observedElements.filter(element => !element.categoryName).length;
    }
    return observedElements.filter(element => element.categoryName === category).length;
  };

  const filteredCategories = elementsCategories;

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">ELEMENTS</p>
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
        listOfOptions={elementsCategories.map(category => ({
          category: category,
          options: filterElementsByCategory(category).map(element => ({
            label: element.elementName.toUpperCase(),
            value: element.elementName,
            checked: observedElements.some(el => el.elementName === element.elementName)
          }))
        }))}
        clearSelections={() => {}}
        isOpen={addCategoryModalOpen}
        setIsOpen={handleModalOpen}
        setValues={setNewElements}
        selectedCategory={selectedCategory}
      />

      {filteredCategories.every(c => getObservedElementsInCategoryLength(c) === 0) && !editMode  && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>
              NO ELEMENTS AVAILABLE
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {(
        <IonGrid className="add-scene-items-card-grid">
          {filteredCategories
            .filter(category => 
              editMode ? getElementsInCategoryLength(category) > 0 : getObservedElementsInCategoryLength(category) > 0
            )
            .map((category, index) => (
              <IonCard
                key={`category-item-${index}-category-${category}`}
                color='tertiary-dark'
                className="add-scene-items-card ion-no-border"
              >
                <IonCardHeader className="ion-flex">
                  <div className="ion-flex ion-justify-content-between">
                    <p className="ion-flex ion-align-items-center">
                      {category.toUpperCase()}
                    </p>
                  </div>
                </IonCardHeader>

                <AddElementInput
                  categoryName={category}
                  selectedElements={observedElements}
                  setSelectedElements={setElements}
                  editMode={editMode}
                />
              </IonCard>
            ))}
        </IonGrid>
      )}
    </>
  );
};

export default AddElementForm;
