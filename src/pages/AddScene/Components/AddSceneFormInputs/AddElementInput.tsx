import {
  IonCardContent,
  IonItem,
  IonList,
} from '@ionic/react';
import React, { useContext } from 'react';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModal from '../../../../Layouts/InputModal/InputModal';
import applyFilters from '../../../../Shared/Utils/applyFilters';
import getOptionsArray from '../../../../Shared/Utils/getOptionsArray';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../../../Shared/Utils/sortArrayAlphabeticaly';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';

interface AddElementInputProps {
  categoryName: string;
  selectedElements: any;
  setSelectedElements: (value: any) => void;
  modalTrigger: string;
}

const AddElementInput: React.FC<AddElementInputProps> = ({
  categoryName,
  selectedElements,
  setSelectedElements,
  modalTrigger,
}) => {
  const { offlineScenes } = useContext(DatabaseContext);

  const filterSelectedElements = selectedElements.filter((element: any) => {
    if (categoryName === 'NO CATEGORY') {
      return element.categoryName === null;
    }
    return element.categoryName === categoryName;
  });

  const deleteElement = (element: string) => {
    setSelectedElements((currentElements: any) => currentElements.filter((el: any) => el.elementName !== element));
  };

  const uniqueElementsValuesArray = getUniqueValuesFromNestedArray(
    offlineScenes,
    'elements',
    'elementName',
  );

  const categoryCriteria = categoryName === 'NO CATEGORY' ? null : categoryName;

  const getFilteredElements = applyFilters(
    uniqueElementsValuesArray,
    {
      categoryName: [categoryCriteria],
    },
    false,
  );

  const getSortedElementNames = sortArrayAlphabeticaly(
    getOptionsArray('elementName', getFilteredElements),
  );

  const toggleElement = (element: string) => {
    const sceneWithElement = offlineScenes.find((scene: any) => scene.elements.some(
      (el: any) => el.elementName.toUpperCase() === element.toUpperCase(),
    ));

    const elementObject = sceneWithElement?.elements?.find(
      (el: any) => el.elementName.toUpperCase() === element.toUpperCase(),
    );

    if (elementObject) {
      const selectedElementObjectIndex = selectedElements.findIndex(
        (el: any) => el.elementName === elementObject.elementName,
      );
      if (selectedElementObjectIndex !== -1) {
        setSelectedElements((currentElements: any) => currentElements.filter(
          (el: any) => el.elementName !== elementObject.elementName,
        ));
      } else {
        const newElement: any = { ...elementObject };
        newElement.categoryName = categoryName !== 'NO CATEGORY' ? categoryName : null;
        setSelectedElements((currentElements: any) => [
          ...currentElements,
          newElement,
        ]);
      }
    }
  };

  const clearSelections = () => {
    setSelectedElements([]);
  };

  const contentStyle = selectedElements.length === 0 ? 'ion-no-padding' : '';

  const formInputs = [
    {
      label: 'Element Name',
      type: 'text',
      fieldKeyName: 'elementName',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-element-name-input',
    },
  ];

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedElements.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedElements.map((element: any, index: number) => (
            <IonItem
              key={index}
              color="tertiary"
              className="ion-no-margin category-items"
            >
              {element.elementName.toUpperCase()}
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
        modalTrigger={modalTrigger}
        handleCheckboxToggle={toggleElement}
        selectedOptions={selectedElements.map((element: any) => element.elementName)}
        clearSelections={clearSelections}
        canCreateNew
        setSelectedOptions={setSelectedElements}
        formInputs={formInputs}
        optionCategory={categoryName || 'NO CATEGORY'}
        existentOptions={uniqueElementsValuesArray}
      />
    </IonCardContent>
  );
};

export default AddElementInput;
