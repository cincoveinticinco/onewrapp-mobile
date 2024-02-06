import React, { useState, useEffect } from 'react';
import {
  IonItem, IonButton, IonIcon, IonCardContent,
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Extra } from '../../../interfaces/scenesTypes';
import scenesData from '../../../data/scn_data.json';
import sortArrayAlphabeticaly from '../../../utils/sortArrayAlphabeticaly';
import getOptionsArray from '../../../utils/getOptionsArray';
import InputModal from '../../Shared/InputModal/InputModal';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import applyFilters from '../../../utils/applyFilters';
import NoAdded from '../../Shared/NoAdded/NoAdded';

interface AddExtraInputProps {
  categoryName: string;
  handleSceneChange: (value: any, field: string) => void;
  selectedExtras: any;
  setSelectedExtras: (value: any) => void;
}

const AddExtraInput: React.FC<AddExtraInputProps> = ({
  categoryName, handleSceneChange, selectedExtras, setSelectedExtras,
}) => {
  // const extraNameInputRef = useRef<HTMLIonInputElement>(null);
  const { scenes } = scenesData;

  const deleteExtra = (index: number) => {
    setSelectedExtras((currentExtras: any) => currentExtras.filter((_: any, i: any) => i !== index));
  };

  // const addExtra = () => {
  //   const newExtraName = extraNameInputRef.current?.value as string;
  //   if (!newExtraName) return;

  //   const newExtra: Extra = {
  //     categoryName,
  //     extraName: newExtraName,
  //   };

  //   setSelectedExtras((currentExtras) => [...currentExtras, newExtra]);
  //   toggleForm(id);

  //   if (extraNameInputRef.current) {
  //     extraNameInputRef.current.value = '';
  //   }
  // };

  const uniqueExtrasValuesAarray = getUniqueValuesFromNestedArray(scenes, 'extras', 'extraName');

  const categoryCriteria = categoryName === 'NO CATEGORY' ? null : categoryName;

  const getFilteredElements = applyFilters(uniqueExtrasValuesAarray, { categoryName: [categoryCriteria] });

  const getSortedExtrasNames = sortArrayAlphabeticaly(getOptionsArray('extraName', getFilteredElements));

  const toggleExtra = (extra: string) => {
    const sceneWithExtra = scenes.find((scene: any) => scene.extras.some((ex: any) => ex.extraName.toUpperCase() === extra.toUpperCase()));

    const extraObject = sceneWithExtra?.extras.find((ex: any) => ex.extraName.toUpperCase() === extra.toUpperCase());

    if (extraObject) {
      const selectedExtraObjectIndex = selectedExtras.findIndex((ex: any) => ex.extraName === extraObject.extraName);
      if (selectedExtraObjectIndex !== -1) {
        setSelectedExtras((currentExtras: any) => currentExtras.filter((ex: any) => ex.extraName !== extraObject.extraName));
      } else {
        const newExtra: any = { ...extraObject };
        newExtra.categoryName = newExtra.categoryName !== 'NO CATEGORY' ? null : categoryName;
        setSelectedExtras((currentExtras: any) => [...currentExtras, newExtra]);
      }
    }
  };

  const clearSelections = () => {
    setSelectedExtras([]);
  };

  const contentStyle = selectedExtras.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {selectedExtras.length > 0 ? (
        selectedExtras.map((extra: any, index: number) => (
          <IonItem
            key={index}
            color="tertiary"
            className="ion-no-margin category-items"
          >
            {extra.extraName.toUpperCase()}
            <IonButton color="danger" fill="clear" slot="end" onClick={() => deleteExtra(index)}>
              <IonIcon icon={trash} />
            </IonButton>
          </IonItem>
        ))
      ) : (
        <NoAdded />
      )}
      <InputModal
        optionName={`Extras (  ${categoryName}  )`}
        listOfOptions={getSortedExtrasNames}
        modalTrigger={`open-extras-options-modal-${categoryName}`}
        handleCheckboxToggle={toggleExtra}
        selectedOptions={selectedExtras.map((extra: any) => extra.extraName)}
        clearSelections={clearSelections}
        canCreateNew={true}
      />
    </IonCardContent>
  );
};

export default AddExtraInput;
