import React, { useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddExtraInput from './AddExtraInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import { Extra, SceneDocType } from '../../../../Shared/types/scenes.types';
import DatabaseContext from '../../../../context/Database/Database.context';

interface AddExtraFormProps {
  handleSceneChange: (value: any, field: keyof SceneDocType) => void;
  observedExtras: Extra[];
  editMode?: boolean;
  detailsEditMode?: boolean;
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({
  handleSceneChange,
  observedExtras,
  editMode,
  detailsEditMode,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const alertRef = useRef<HTMLIonAlertElement>(null);

  // State
  const [dropDownIsOpen, setDropDownIsOpen] = useState(true);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(observedExtras || []);
  const [extrasCategories, setExtrasCategories] = useState<(string | null)[]>([]);
  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});

  // Fetch initial categories from offline scenes
  const defineExtrasCategories = useCallback(() => {
    const uniqueCategoryValues = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'categoryName');

    return uniqueCategoryValues
      .map(extra => extra.categoryName)
      .filter((categoryName): categoryName is string | null => categoryName !== undefined)
      .sort();
  }, [offlineScenes]);

  // Initialize categories on mount
  useEffect(() => {
    setExtrasCategories(defineExtrasCategories());
  }, [defineExtrasCategories]);

  // Filter categories when editMode is false
  const filteredCategories = useMemo(() => {
    if (editMode) return extrasCategories;
    return extrasCategories.filter(category => 
      selectedExtras.some(extra => extra.categoryName === category)
    );
  }, [extrasCategories, selectedExtras, editMode]);

  // Handle dropdown visibility when there are no extras
  useEffect(() => {
    if (!observedExtras?.length) {
      setDropDownIsOpen(true);
    }
  }, [observedExtras]);

  // Sync observedExtras with selectedExtras when they change
  useEffect(() => {
    if (observedExtras && JSON.stringify(observedExtras) !== JSON.stringify(selectedExtras)) {
      setSelectedExtras(observedExtras);
    }
  }, [observedExtras]);

  // Update parent component when selected extras change
  useEffect(() => {
    handleSceneChange(selectedExtras, 'extras');
  }, [selectedExtras]);

  // Handlers
  const handleOk = (inputData: { [key: string]: any }) => {
    if (inputData.categoryName) {
      setExtrasCategories(prev => {
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
    if (editMode) return 'extras-categories-alert-edit';
    if (detailsEditMode) return 'extras-categories-alert-details-edit';
    return 'extras-categories-alert';
  };

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-extra-category-input',
    },
  ];

  return (
    <>
      <div
        className="category-item-title ion-flex ion-justify-content-between"
        style={{ backgroundColor: 'var(--ion-color-dark)' }}
      >
        <p className="ion-flex ion-align-items-center ion-padding-start">EXTRAS</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          {editMode && (<AddButton id={getAlertTrigger()} slot="end" onClick={(e) => { e.stopPropagation(); }}/>)}
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

      {/* Show "No Extras Available" when editMode is false and there are no elements */}
      {filteredCategories.length === 0 && !editMode && (
        <IonCard style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }} className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title" style={{ color: 'var(--ion-color-light)' }}>
              NO EXTRAS AVAILABLE
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {filteredCategories.length > 0 && dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {filteredCategories.map((category, index) => 
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
                          onClick={(e) => { toggleModal(category); e.stopPropagation(); }}
                        />
                      )}
                    </div>
                  </div>
                </IonCardHeader>
                <AddExtraInput
                  categoryName={category}
                  selectedExtras={selectedExtras}
                  setSelectedExtras={setSelectedExtras}
                  openModal={modalStates[category] || false}
                  setOpenModal={(isOpen: boolean) => toggleModal(category)}
                  editMode={editMode}
                />
              </IonCard>
            )
          )}
        </IonGrid>
      )}
    </>
  );
};

export default AddExtraForm;
