import React, { useState, useEffect } from 'react';
import {
  IonCardContent,
  IonItem,
  IonList,
} from '@ionic/react';
import { Element } from '../../../interfaces/scenesTypes';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import InputModal from '../../Shared/InputModal/InputModal';
import sortArrayAlphabeticaly from '../../../utils/sortArrayAlphabeticaly';
import getOptionsArray from '../../../utils/getOptionsArray';
import sceneData from '../../../data/scn_data.json';
import getUniqueValuesFromNestedArray from '../../../utils/getUniqueValuesFromNestedArray';
import applyFilters from '../../../utils/applyFilters';
import NoAdded from '../../Shared/NoAdded/NoAdded';

interface AddElementInputProps {
  categoryName: string;
  toggleForm: (index: number) => void;
  handleSceneChange: (value: any, field: string) => void;
  id: number;
}

const AddElementInput: React.FC<AddElementInputProps> = ({
  categoryName,
  toggleForm,
  id,
  handleSceneChange,
}) => {
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const { scenes } = sceneData;

  useEffect(() => {
    handleSceneChange(selectedElements, 'elements');
  }, [selectedElements]);

  const deleteElement = (element: string) => {
    setSelectedElements((currentElements) =>
      currentElements.filter((el) => el.elementName !== element)
    );
    handleSceneChange(selectedElements, 'elements');
  };

  const uniqueElementsValuesArray = getUniqueValuesFromNestedArray(
    scenes,
    'elements',
    'elementName'
  );

  const categoryCriteria = categoryName === 'NO CATEGORY' ? null : categoryName;

  const getFilteredElements = applyFilters(uniqueElementsValuesArray, {
    categoryName: [categoryCriteria],
  });

  const getSortedElementNames = sortArrayAlphabeticaly(
    getOptionsArray('elementName', getFilteredElements)
  );

  const toggleElement = (element: string) => {
    const sceneWithElement = scenes.find((scene: any) =>
      scene.elements.some(
        (el: any) => el.elementName.toUpperCase() === element.toUpperCase()
      )
    );

    const elementObject = sceneWithElement?.elements.find(
      (el: any) => el.elementName.toUpperCase() === element.toUpperCase()
    );

    if (elementObject) {
      const selectedElementObjectIndex = selectedElements.findIndex(
        (el: any) => el.elementName === elementObject.elementName
      );
      if (selectedElementObjectIndex !== -1) {
        setSelectedElements((currentElements) =>
          currentElements.filter(
            (el: any) => el.elementName !== elementObject.elementName
          )
        );
      } else {
        const newElement: any = { ...elementObject };
        newElement.categoryName =
          categoryName !== 'NO CATEGORY' ? categoryName : null;
        setSelectedElements((currentElements) => [
          ...currentElements,
          newElement,
        ]);
      }
    }
  };

  const contentStyle = selectedElements.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {selectedElements.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {selectedElements.map((element, index) => (
            <IonItem
              key={index}
              color="tertiary"
              className="ion-no-margin category-items"
            >
              {element.elementName}
              <DeleteButton
                onClick={() => deleteElement(element.elementName)}
                slot="end"
              />
            </IonItem>
          ))}
        </IonList>
      ) : (
        <NoAdded />
      )}
      <InputModal
        optionName="Elements"
        listOfOptions={getSortedElementNames}
        modalTrigger={`open-element-options-modal-${categoryName}`}
        handleCheckboxToggle={toggleElement}
        selectedOptions={selectedElements.map((element) => element.elementName)}
      />
    </IonCardContent>
  );
};

export default AddElementInput;
