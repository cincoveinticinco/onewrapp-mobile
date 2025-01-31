import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddExtraInput from './AddExtraInput';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import AddButton from '../../../../Shared/Components/AddButton/AddButton';
import capitalizeString from '../../../../Shared/Utils/capitalizeString';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import DropDownButton from '../../../../Shared/Components/DropDownButton/DropDownButton';
import { Extra } from '../../../../Shared/types/scenes.types';
import DatabaseContext from '../../../../context/Database/Database.context';

interface AddExtraFormProps {
  handleSceneChange: (value: any, field: string) => void;
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
  const handleSelectedExtrasChange = useCallback((newExtras: Extra[]) => {
    setSelectedExtras(newExtras);
  }, [handleSceneChange]);

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
        onClick={handleDropDown}
        style={{ backgroundColor: 'var(--ion-color-tertiary-shade)' }}
      >
        <p className="ion-flex ion-align-items-center">Extras / Background Actors</p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          <AddButton id={getAlertTrigger()} slot="end" onClick={(e) => { e.stopPropagation(); }}/>
          <DropDownButton open={dropDownIsOpen} />
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

      {extrasCategories.length === 0 && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO EXTRAS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      )}

      {extrasCategories.length > 0 && dropDownIsOpen && (
        <IonGrid className="add-scene-items-card-grid">
          {[...extrasCategories, 'NO CATEGORY'].map((category, index) => 
            category && (
              <IonCard
                key={`category-item-${index}-category-${category}`}
                color="tertiary"
                className="add-scene-items-card ion-no-border"
              >
                <IonCardHeader className="ion-flex">
                  <div className="ion-flex ion-justify-content-between">
                    <p className="ion-flex ion-align-items-center">
                      {capitalizeString(category)}
                    </p>
                    <div className="category-buttons-wrapper">
                      <AddButton
                        onClick={(e) => { toggleModal(category); e.stopPropagation(); }}
                      />
                    </div>
                  </div>
                </IonCardHeader>
                <AddExtraInput
                  categoryName={category}
                  selectedExtras={selectedExtras}
                  setSelectedExtras={handleSelectedExtrasChange}
                  openModal={modalStates[category] || false}
                  setOpenModal={(isOpen: boolean) => toggleModal(category)}
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