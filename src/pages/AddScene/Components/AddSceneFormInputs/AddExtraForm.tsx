import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput, IonButton, IonItemSliding, IonItemOptions, IonItemOption, IonItem } from '@ionic/react';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddExtraInput from './AddExtraInput';
import { Extra } from '../../../../Shared/types/scenes.types';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import { VscEdit } from 'react-icons/vsc';

interface AddExtraFormProps {
  observedExtras: Extra[];
  editMode?: boolean;
  setExtras: (extras: Extra[]) => void;
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({
  observedExtras,
  editMode,
  setExtras,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [extrasCategories, setExtrasCategories] = useState<string[]>([]);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editExtraModal, setEditExtraModal] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);

  const handleModalOpen = () => {
    if (addCategoryModalOpen) {
      setAddCategoryModalOpen(false);
      setSelectedCategory(null);
    } else {
      setAddCategoryModalOpen(true);
    }
  };

  const uniqueExtras = useMemo(() => {
    const offlineExtras = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
    const mergedExtras = [...offlineExtras];
    observedExtras.forEach(extra => {
      const existingExtraIndex = mergedExtras.findIndex(existing => existing.extraName === extra.extraName);
      if (existingExtraIndex === -1) {
        mergedExtras.push(extra);
      } else {
        mergedExtras[existingExtraIndex] = { ...mergedExtras[existingExtraIndex], categoryName: extra.categoryName };
      }
    });
    return mergedExtras;
  }, [offlineScenes, observedExtras]);

  const filterExtrasByCategory = useMemo(() => (categoryName: string | null) =>
    uniqueExtras.filter(extra => {
      if (categoryName === EmptyEnum.NoCategory) return !extra.categoryName;
      return extra.categoryName === categoryName;
    }), [uniqueExtras]);

  const defineExtrasCategories = useCallback((): string[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'categoryName').map(c => c || EmptyEnum.NoCategory);
    const observedCategories = observedExtras.map(e => e.categoryName || EmptyEnum.NoCategory);
    const allCategories = [...uniqueCategoryValues, ...observedCategories, EmptyEnum.NoCategory];
    console.log('allCategories', allCategories);
    return Array.from(new Set(allCategories.sort((a, b) => (a && b ? String(a).localeCompare(String(b)) : 0))));
  }, [offlineScenes, observedExtras]);

  useEffect(() => setExtrasCategories(defineExtrasCategories()), [defineExtrasCategories]);

  const setNewExtras = (extrasValues: { value: string | number; category: string | null; }[]) => {
    const newExtras: Extra[] = extrasValues.map(extra => {
      const existingExtra = uniqueExtras.find(ex => ex.extraName.toLowerCase() === String(extra.value).toLowerCase());
      return existingExtra || { extraName: String(extra.value), categoryName: extra.category === EmptyEnum.NoCategory ? null : extra.category } as Extra;
    });
    setExtras(newExtras);
  };

  const getObservedExtrasInCategoryLength = (category: string) => {
    if (category === EmptyEnum.NoCategory) return observedExtras.filter(e => !e.categoryName).length;
    return observedExtras.filter(e => e.categoryName === category).length;
  };

  const openCategoryEditor = (category: string) => () => {
    setSelectedCategory(category);
    setEditCategoryModal(true);
  };

  const onEditCategory = (inputData: { [key: string]: any }) => {
    const updatedExtras = observedExtras.map(extra => {
      if ((selectedCategory === EmptyEnum.NoCategory && !extra.categoryName) || extra.categoryName === selectedCategory) {
        extra.categoryName = inputData.category;
      }
      return extra;
    });
    setExtras(updatedExtras);
    setExtrasCategories(defineExtrasCategories());
    setEditCategoryModal(false);
  };

  const openEditExtraModal = (extra: Extra) => {
    setSelectedExtra(extra);
    setEditExtraModal(true);
  };

  const onEditExtra = (inputData: { [key: string]: any }) => {
    const updatedExtras = observedExtras.map(extra => {
      if (extra.extraName === selectedExtra?.extraName) {
        return { ...extra, categoryName: inputData.category, extraName: inputData.extraName };
      }
      return extra;
    });
    setExtras(updatedExtras);
    setEditExtraModal(false);
  };

  const editCategoryInputs = useMemo((): AlertInput[] => [{
    name: 'category',
    type: 'text',
    placeholder: 'Category Name',
    value: selectedCategory === EmptyEnum.NoCategory ? '' : selectedCategory,
  }], [selectedCategory]);

  const editExtraInputs: AlertInput[] = [
    {
      name: 'category',
      type: 'text',
      placeholder: 'Category Name',
      value: selectedExtra?.categoryName,
    },
    {
      name: 'extraName',
      type: 'text',
      placeholder: 'Extra Name',
      value: selectedExtra?.extraName,
    },
  ];

  const EditCategoryAlert = () => (
    <InputAlert isOpen={editCategoryModal} inputs={editCategoryInputs} header="Edit Category" handleOk={onEditCategory} handleCancel={() => setEditCategoryModal(false)} />
  );

  const EditExtraModal = () => (
    <InputAlert isOpen={editExtraModal} inputs={editExtraInputs} header="Edit Extra" handleOk={onEditExtra} handleCancel={() => { setEditExtraModal(false); setSelectedExtra(null); }} />
  );

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">EXTRAS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && <AddButton onClick={() => setAddCategoryModalOpen(true)} slot="end" />}
        </div>
      </div>

      <InputModalWithSections
        optionName="Categories"
        listOfOptions={extrasCategories.map(category => ({
          category,
          options: filterExtrasByCategory(category).map(extra => ({
            label: extra.extraName.toUpperCase(),
            value: extra.extraName,
            checked: observedExtras.some(ex => ex.extraName === extra.extraName)
          }))
        }))}
        clearSelections={() => {}}
        isOpen={addCategoryModalOpen}
        setIsOpen={handleModalOpen}
        setValues={setNewExtras}
        selectedCategory={selectedCategory}
      />

      {extrasCategories.every(c => getObservedExtrasInCategoryLength(c) === 0) && !editMode && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>NO EXTRAS AVAILABLE</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      <IonGrid className="add-scene-items-card-grid">
        {extrasCategories.filter(category => getObservedExtrasInCategoryLength(category) > 0).map((category, index) => (
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
            <AddExtraInput categoryName={category} selectedExtras={observedExtras} setSelectedExtras={setExtras} editMode={editMode} openEditExtra={openEditExtraModal} />
          </IonCard>
        ))}
      </IonGrid>

      {editCategoryModal && <EditCategoryAlert />}
      {editExtraModal && <EditExtraModal />}
    </>
  );
};


export default AddExtraForm;
