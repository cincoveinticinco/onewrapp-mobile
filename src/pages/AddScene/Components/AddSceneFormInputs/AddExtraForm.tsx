import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { IonGrid, IonCard, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModalWithSections from '../../../../Layouts/InputModalWithSections/InputModalWithSections';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddExtraInput from './AddExtraInput';
import { Extra } from '../../../../Shared/types/scenes.types';

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

  const handleModalOpen = () => {
    if (addCategoryModalOpen) {
      setAddCategoryModalOpen(false);
      setSelectedCategory(null);
    } else {
      setAddCategoryModalOpen(true);
    }
  };

  // Obtener extras únicos de las escenas offline y observados
  const uniqueExtras = useMemo(() => {
    const offlineExtras = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');
    const mergedExtras = [...offlineExtras];

    observedExtras.forEach(extra => {
      if (!mergedExtras.some(existing => existing.extraName === extra.extraName)) {
        mergedExtras.push(extra);
      }
    });

    return mergedExtras;
  }, [offlineScenes, observedExtras]);

  // Filtrar extras por categoría
  const filterExtrasByCategory = useMemo(() => (categoryName: string | null) =>
    uniqueExtras.filter((extra: any) => {
      if (categoryName === 'NO CATEGORY') {
        return !extra.categoryName;
      }
      return extra.categoryName === categoryName;
    }), [uniqueExtras]);

  // Definir categorías únicas de los extras
  const defineExtrasCategories = useCallback((): string[] => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'categoryName')
      .map(category => category.categoryName ? category.categoryName : 'NO CATEGORY');

    const observedCategories = observedExtras.map(extra => extra.categoryName || 'NO CATEGORY');

    const allCategories = [...uniqueCategoryValues, ...observedCategories];

    return Array.from(new Set(allCategories.sort((a, b) => (a && b ? String(a).localeCompare(String(b)) : 0))));
  }, [offlineScenes, observedExtras]);

  useEffect(() => {
    setExtrasCategories(defineExtrasCategories());
  }, [defineExtrasCategories]);

  // Manejar selección de nuevos extras
  const setNewExtras = (extrasValues: {
    value: string | number;
    category: string;
  }[]) => {
    const newExtras: Extra[] = extrasValues.map((extra) => {
      const existingExtra = uniqueExtras.find(
        (ex) => ex.extraName.toLowerCase() === String(extra.value).toLowerCase()
      );

      return existingExtra || {
        extraName: String(extra.value),
        categoryName: extra.category,
      } as Extra;
    });
    setExtras(newExtras);
  };

  const openModalWithCategory = (category: string) => {
    setSelectedCategory(category);
    setAddCategoryModalOpen(true);
  };

  const getExtrasInCategoryLength = (category: string) => {
    if (category === 'NO CATEGORY') {
      console.log(uniqueExtras.filter(extra => !extra.categoryName).length);
      return uniqueExtras.filter(extra => !extra.categoryName).length;
    }
    return uniqueExtras.filter(extra => extra.categoryName === category).length;
  };

  const getObservedExtrasInCategoryLength = (category: string) => {
    if (category === 'NO CATEGORY') {
      return observedExtras.filter(extra => !extra.categoryName || extra.categoryName == '').length;
    }
    return observedExtras.filter(extra => extra.categoryName === category).length;
  };

  const filteredCategories = extrasCategories;

  useEffect(() => {
    console.log(filteredCategories.every(c => getExtrasInCategoryLength(c) === 0))
  }, [filteredCategories])

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between" style={{ backgroundColor: 'var(--ion-color-dark)' }}>
        <p className="ion-flex ion-align-items-center ion-padding-start">EXTRAS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && (
            <AddButton
              onClick={() => setAddCategoryModalOpen(true)}
              slot="end"
            />
          )}
        </div>
      </div>

      {/* Modal Reutilizable */}
      <InputModalWithSections
        optionName="Categories"
        listOfOptions={extrasCategories.map(category => ({
          category: category,
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

      {/* Mostrar mensaje si no hay extras disponibles */}
      {filteredCategories.every(c => getObservedExtrasInCategoryLength(c) === 0) && !editMode && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>
              NO EXTRAS AVAILABLE
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {/* Mostrar extras agrupados por categoría */}
      <IonGrid className="add-scene-items-card-grid">
        {filteredCategories
          .filter(category => editMode ? getExtrasInCategoryLength(category) > 0 : getObservedExtrasInCategoryLength(category) > 0)
          .map((category, index) => (
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

              {/* Aquí integramos AddExtraInput */}
              <AddExtraInput
                categoryName={category}
                selectedExtras={observedExtras}
                setSelectedExtras={setExtras}
                editMode={editMode}
              />
            </IonCard>
          ))}
      </IonGrid>
    </>
  );
};

export default AddExtraForm;
