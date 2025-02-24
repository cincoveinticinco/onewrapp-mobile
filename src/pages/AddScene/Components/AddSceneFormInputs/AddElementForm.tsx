import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput, IonButton, IonItemSliding, IonItemOptions, IonItemOption, IonItem } from '@ionic/react';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import { VscEdit } from 'react-icons/vsc';
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
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editElementModal, setEditElementModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

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
      const existingElementIndex = mergedElements.findIndex(existing => existing.elementName === el.elementName);
      if (existingElementIndex === -1) {
        mergedElements.push(el);
      } else {
        mergedElements[existingElementIndex] = { ...mergedElements[existingElementIndex], categoryName: el.categoryName };
      }
    });
    return mergedElements;
  }, [offlineScenes, observedElements]);

  const filterElementsByCategory = useMemo(() => (categoryName: string | null) =>
    uniqueElements.filter(element => {
      if (categoryName === EmptyEnum.NoCategory) return !element.categoryName;
      return element.categoryName === categoryName;
    }), [uniqueElements]);

  const defineElementsCategories = useCallback((): string[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'elements', 'categoryName').map(c => c.categoryName || EmptyEnum.NoCategory);
    const observedCategories = observedElements.map(e => e.categoryName || EmptyEnum.NoCategory);
    const allCategories = [...uniqueCategoryValues, ...observedCategories, EmptyEnum.NoCategory];
    return Array.from(new Set(allCategories.sort((a, b) => (a && b ? String(a).localeCompare(String(b)) : 0))));
  }, [offlineScenes, observedElements]);

  useEffect(() => setElementsCategories(defineElementsCategories()), [defineElementsCategories]);

  const setNewElements = (elementsValues: { value: string | number; category: string | null; }[]) => {
    const newElements: Element[] = elementsValues.map(element => {
      const existingElement = uniqueElements.find(el => el.elementName.toLowerCase() === String(element.value).toLowerCase());
      return existingElement || { elementName: String(element.value), categoryName: element.category === EmptyEnum.NoCategory ? null : element.category } as Element;
    });
    setElements(newElements);
  };

  const getObservedElementsInCategoryLength = (category: string) => {
    if (category === EmptyEnum.NoCategory) return observedElements.filter(e => !e.categoryName).length;
    return observedElements.filter(e => e.categoryName === category).length;
  };

  const openCategoryEditor = (category: string) => () => {
    setSelectedCategory(category);
    setEditCategoryModal(true);
  };

  const onEditCategory = (inputData: { [key: string]: any }) => {
    const updatedElements = observedElements.map(element => {
      if ((selectedCategory === EmptyEnum.NoCategory && !element.categoryName) || element.categoryName === selectedCategory) {
        element.categoryName = inputData.category;
      }
      return element;
    });
    setElements(updatedElements);
    setElementsCategories(defineElementsCategories());
    setEditCategoryModal(false);
  };

  const openEditElementModal = (element: Element) => {
    setSelectedElement(element);
    setEditElementModal(true);
  };

  const onEditElement = (inputData: { [key: string]: any }) => {
    const updatedElements = observedElements.map(element => {
      if (element.elementName === selectedElement?.elementName) {
        return { ...element, categoryName: inputData.category, elementName: inputData.elementName };
      }
      return element;
    });
    setElements(updatedElements);
    setEditElementModal(false);
  };

  const editCategoryInputs = useMemo((): AlertInput[] => [{
    name: 'category',
    type: 'text',
    placeholder: 'Category Name',
    value: selectedCategory === EmptyEnum.NoCategory ? '' : selectedCategory,
  }], [selectedCategory]);

  const editElementInputs: AlertInput[] = [
    {
      name: 'category',
      type: 'text',
      placeholder: 'Category Name',
      value: selectedElement?.categoryName,
    },
    {
      name: 'elementName',
      type: 'text',
      placeholder: 'Element Name',
      value: selectedElement?.elementName,
    },
  ];

  const EditCategoryAlert = () => (
    <InputAlert isOpen={editCategoryModal} inputs={editCategoryInputs} header="Edit Category" handleOk={onEditCategory} handleCancel={() => setEditCategoryModal(false)} />
  );

  const EditElementModal = () => (
    <InputAlert isOpen={editElementModal} inputs={editElementInputs} header="Edit Element" handleOk={onEditElement} handleCancel={() => { setEditElementModal(false); setSelectedElement(null); }} />
  );

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">ELEMENTS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && <AddButton onClick={() => setAddCategoryModalOpen(true)} slot="end" />}
        </div>
      </div>

      <InputModalWithSections
        optionName="Categories"
        listOfOptions={elementsCategories.map(category => ({
          category,
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

      {elementsCategories.every(c => getObservedElementsInCategoryLength(c) === 0) && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)', fontSize: '16px' }}>NO ELEMENTS AVAILABLE</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      <IonGrid className="add-scene-items-card-grid">
        {elementsCategories.filter(category => getObservedElementsInCategoryLength(category) > 0).map((category, index) => (
          <IonCard key={`category-item-${index}-category-${category}`} color='tertiary-dark' className="add-scene-items-card ion-no-border">
            <IonCardHeader className="ion-flex">
              <IonItemSliding>
                <IonItemOptions side="end" color='dark'>
                  {editMode && (
                  <IonItemOption onClick={openCategoryEditor(category)} color='dark'>
                    <IonButton fill="clear" color='primary' slot="end">
                      <VscEdit className="label-button"/>
                    </IonButton>
                  </IonItemOption>
                  )}
                </IonItemOptions>
                <IonItem color='tertiary-dark'>
                  <div className="ion-flex ion-justify-content-between">
                  <p className="ion-flex ion-align-items-center">
                    {category?.toUpperCase()}
                  </p>
                  </div>
                </IonItem>
              </IonItemSliding>
            </IonCardHeader>
            <AddElementInput categoryName={category} selectedElements={observedElements} setSelectedElements={setElements} editMode={editMode} openEditElement={openEditElementModal} />
          </IonCard>
        ))}
      </IonGrid>

      {editCategoryModal && <EditCategoryAlert />}
      {editElementModal && <EditElementModal />}
    </>
  );
};

export default AddElementForm;
