import React from 'react';
import { IonItem, IonInput } from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { Element } from '../../../../Shared/types/scenes.types';
import SelectItem from '../../../AddScene/Components/AddSceneFormInputs/SelectItem';

interface ElementFormProps {
  element: Element;
  setElement: React.Dispatch<React.SetStateAction<Element>>;
  elementCategories: (string | null)[];
  setElementCategories: React.Dispatch<React.SetStateAction<(string | null)[]>>;
}

const ElementForm: React.FC<ElementFormProps> = ({ element, setElement, elementCategories, setElementCategories }) => {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      categoryName: element.categoryName || '',
      elementName: element.elementName || ''
    }
  });

  const handleCategoryChange = (category: string | null) => {
    setElement((prevElement) => ({ 
      ...prevElement, 
      categoryName: category || '' 
    }));
  };

  const handleElementNameChange = (name: string) => {
    setElement((prevElement) => ({ 
      ...prevElement, 
      elementName: name 
    }));
  };

  return (
    <>
      <SelectItem
        label="ELEMENT CATEGORY"
        options={elementCategories.filter(category => category !== null) as string[]}
        control={control}
        fieldKeyName="categoryName"
        inputName="elementCategory"
        setValue={setValue}
        watchValue={watch}
        canCreateNew={true}
        setOptions={(newCategories: any) => {
          setElementCategories(newCategories);
        }}
        afterSelection={() => {
          const selectedCategory = watch('categoryName');
          handleCategoryChange(selectedCategory);
        }}
      />
      
      <IonItem color="tertiary">
        <IonInput
          value={element.elementName}
          labelPlacement="floating"
          label="ELEMENT NAME *"
          placeholder="INSERT ELEMENT NAME"
          onIonChange={(e) => handleElementNameChange(e.detail.value || '')}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '16px',
            textTransform: 'uppercase'
          }}
        />
      </IonItem>
    </>
  );
};

export default ElementForm;