import React, { useState, useRef, useEffect } from 'react';
import { IonInput, IonItem, IonList, IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Element } from '../../../interfaces/scenesTypes';

interface AddElementInputProps {
  categoryName: string;
  toggleForm: (index: number) => void;
  handleSceneChange: (value: any, field: string) => void;
  id: number;
}

const AddElementInput: React.FC<AddElementInputProps> = ({ categoryName, toggleForm, id, handleSceneChange}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const elementNameInputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    handleSceneChange(elements, 'elements');
  }, [elements])

  const deleteElement = (index: number) => {
    setElements(currentElements => 
      currentElements.filter((_, i) => i !== index)
    );
  };

  const addElement = () => {
    const newCharacterName = elementNameInputRef.current?.value as string;
    if (!newCharacterName) return;

    const newElement: Element = {
      categoryName: categoryName,
      elementName: newCharacterName,
    };

    setElements(currentElements => [...currentElements, newElement]);
    toggleForm(id)

    if (elementNameInputRef.current) {
      elementNameInputRef.current.value = '';
    }
  };

  return (
    <>
      {elements.length > 0 && (
        <IonList
          className='ion-no-padding ion-no-margin'
        >
          {elements.map((element, index) => (
            <IonItem
              key={index} 
              color="tertiary"
              className='ion-no-margin category-items'
            >
              {element.elementName}
              <IonButton fill='clear' color="danger" slot='end' onClick={() => deleteElement(index)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
        <IonItem
          style={{ display: 'none'}}
          id={`element-form-${id}`}
          color="tertiary"
        >
          <IonInput 
            placeholder='Element Name' 
            ref={elementNameInputRef}
            clearInput={true}
          />
          <IonButton onClick={addElement}>Add Element</IonButton>
        </IonItem>
    </>
  );
}

export default AddElementInput;
