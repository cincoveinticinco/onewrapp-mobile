import {
  IonCardContent,
  IonItem,
} from '@ionic/react';
import React, { useContext } from 'react';
import DatabaseContext from '../../../../context/Database/Database.context';
import InputModal from '../../../../Layouts/InputModal/InputModal';
import applyFilters from '../../../../Shared/Utils/applyFilters';
import getOptionsArray from '../../../../Shared/Utils/getOptionsArray';
import getUniqueValuesFromNestedArray from '../../../../Shared/Utils/getUniqueValuesFromNestedArray';
import sortArrayAlphabeticaly from '../../../../Shared/Utils/sortArrayAlphabeticaly';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';

interface AddExtraInputProps {
  categoryName: string;
  selectedExtras: any;
  setSelectedExtras: (value: any) => void;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const AddExtraInput: React.FC<AddExtraInputProps> = ({
  categoryName, selectedExtras, setSelectedExtras, openModal, setOpenModal,
}) => {
  // const extraNameInputRef = useRef<HTMLIonInputElement>(null);
  const { offlineScenes } = useContext(DatabaseContext);

  const filterSelectedExtras = selectedExtras.filter((extra: any) => {
    if (categoryName === 'NO CATEGORY') {
      return extra.categoryName === null;
    }
    return extra.categoryName === categoryName;
  });

  const deleteExtra = (index: number) => {
    setSelectedExtras((currentExtras: any) => currentExtras.filter((_: any, i: any) => i !== index));
  };

  const uniqueExtrasValuesAarray = getUniqueValuesFromNestedArray(offlineScenes, 'extras', 'extraName');

  const categoryCriteria = categoryName === 'NO CATEGORY' ? null : categoryName;

  const getFilteredElements = applyFilters(uniqueExtrasValuesAarray, { categoryName: [categoryCriteria] }, false);

  const getSortedExtrasNames = sortArrayAlphabeticaly(getOptionsArray('extraName', getFilteredElements));

  const toggleExtra = (extra: string) => {
    const sceneWithExtra = offlineScenes.find((scene: any) => scene.extras.some((ex: any) => ex.extraName.toUpperCase() === extra.toUpperCase()));

    const extraObject = sceneWithExtra?.extras?.find((ex: any) => ex.extraName.toUpperCase() === extra.toUpperCase());

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

  const formInputs = [
    {
      label: 'Extra Name',
      type: 'text',
      fieldKeyName: 'extraName',
      placeholder: 'INSERT',
      required: true,
      inputName: 'add-extra-name-input',
    },
  ];

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedExtras.length > 0 ? (
        filterSelectedExtras.map((extra: any, index: number) => (
          <IonItem
            key={index}
            color="tertiary"
            className="ion-no-margin category-items"
          >
            {extra.extraName.toUpperCase()}
            <DeleteButton
              onClick={() => deleteExtra(index)}
              slot="end"
            />
          </IonItem>
        ))
      ) : (
        <NoAdded />
      )}
      <InputModal
        optionName={`Extras (  ${categoryName}  )`}
        listOfOptions={getSortedExtrasNames}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        handleCheckboxToggle={toggleExtra}
        selectedOptions={selectedExtras.map((extra: any) => extra.extraName)}
        clearSelections={clearSelections}
        canCreateNew
        setSelectedOptions={setSelectedExtras}
        formInputs={formInputs}
        optionCategory={categoryName || 'NO CATEGORY'}
        existentOptions={uniqueExtrasValuesAarray}
      />
    </IonCardContent>
  );
};

export default AddExtraInput;
