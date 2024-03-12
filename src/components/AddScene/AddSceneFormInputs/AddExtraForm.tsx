import React, { useContext, useEffect, useState } from 'react';
import {
  IonGrid, IonCard, IonCardHeader, IonCardSubtitle, AlertInput,
} from '@ionic/react';
import AddExtraInput from './AddExtraInput';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import AddButton from '../../Shared/AddButton/AddButton';
import capitalizeString from '../../../utils/capitalizeString';
import InputAlert from '../../Shared/InputAlert/InputAlert';
import DropDownButton from '../../Shared/DropDownButton/DropDownButton';
import { Extra } from '../../../interfaces/scenesTypes';
import DatabaseContext from '../../../context/database';

interface AddExtraFormProps {
  handleSceneChange: (value: any, field: string) => void;
  observedExtras: Extra[];
  editMode?: boolean;
  detailsEditMode?: boolean;
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({ handleSceneChange, observedExtras, editMode, detailsEditMode }) => {
  const { offlineScenes } = useContext(DatabaseContext);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [extrasFetched, setExtrasFetched] = useState(false);

  useEffect(() => {
    if (!observedExtras) {
      setDropDownIsOpen(true);
    }
  }, [observedExtras]);

  useEffect(() => {
    if (observedExtras && selectedExtras.length === 0 && !extrasFetched) {
      setSelectedExtras(observedExtras);
      setExtrasFetched(true);
    }
  }, [observedExtras, extrasFetched]);

  useEffect(() => {
    handleSceneChange(selectedExtras, 'extras');
  }, [selectedExtras]);

  const defineExtrasCategories = () => {
    const categoriesArray: string[] = [];
    const uniqueValuesArray = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'categoryName');

    uniqueValuesArray.forEach((extra) => {
      const { categoryName } = extra;
      if (categoryName && !categoriesArray.includes(categoryName)) {
        categoriesArray.push(categoryName);
      }
    });

    return categoriesArray;
  };

  useEffect(() => {
    const sortedCategories = defineExtrasCategories().sort();
    setSelectedCategories([...sortedCategories, 'NO CATEGORY']);
  }, [offlineScenes]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const alertInputs: AlertInput[] = [
    {
      name: 'categoryName',
      type: 'text',
      placeholder: 'Category Name',
      id: 'add-extra-category-input',
    },
  ];

  const handleOk = (inputData: { categoryName: string }) => {
    const inputElement = document.getElementById('add-extra-category-input');
    if (inputData.categoryName) {
      setSelectedCategories([...selectedCategories, inputData.categoryName]);
    }
    if (inputElement) {
      (inputElement as HTMLInputElement).value = '';
    }
  };

  const handleDropDown = () => {
    setDropDownIsOpen(!dropDownIsOpen);
  };

  const getAlertTrigger = () => {
    if (editMode) {
      return 'open-extras-category-alert-edit';
    }
    if(detailsEditMode) {
      return 'open-extras-category-alert-details-edit';
    }
    return 'open-extras-category-alert';
  }

  const getModalTrigger = (category: string) => {
    if (editMode) {
      return `open-extras-alert-edit-${category}`;
    }
    if(detailsEditMode) {
      return `open-extras-alert-details-edit-${category}`;
    }
    return `open-extras-alert-${category}`;
  }

  return (
    <>
      <div
        className="category-item-title ion-flex ion-justify-content-between"
        onClick={handleDropDown}
        style={{ backgroundColor: 'var(--ion-color-tertiary-shade)' }}
      >
        <p className="ion-flex ion-align-items-center">
          Extras / Background Actors
        </p>
        <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
          <AddButton
            id={getAlertTrigger()}
            slot="end"
          />
          <DropDownButton open={dropDownIsOpen} />
        </div>
      </div>
      <InputAlert
        handleOk={handleOk}
        inputs={alertInputs}
        trigger={getAlertTrigger()}
        header="Add Category"
        message="Please enter the name of the category you want to add"
      />
      {
        selectedCategories.length === 0
        && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO EXTRAS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        )
      }

      {selectedCategories.length > 0 && dropDownIsOpen
        && (
        <IonGrid
          className="add-scene-items-card-grid"
        >
          {selectedCategories.map((category, index) => (
            category && (
              <IonCard
                key={index}
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
                        id={getModalTrigger(category)}
                      />
                    </div>
                  </div>
                </IonCardHeader>
                <AddExtraInput
                  categoryName={category}
                  selectedExtras={selectedExtras}
                  setSelectedExtras={setSelectedExtras}
                  modalTrigger={getModalTrigger(category)}
                />
              </IonCard>
            )
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddExtraForm;
