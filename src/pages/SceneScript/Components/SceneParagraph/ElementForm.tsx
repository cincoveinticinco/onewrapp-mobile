import {
  IonInput, IonItem, IonSelect, IonSelectOption,
} from '@ionic/react';
import React, { useState } from 'react';
import { Element } from '../../../../Shared/types/scenes.types';

interface ElementFormProps {
  element: Element;
  setElement: React.Dispatch<React.SetStateAction<Element>>;
  elementCategories: (string | null)[];
}

const ElementForm: React.FC<ElementFormProps> = ({ element, setElement, elementCategories }) => {
  const [isFocused, setIsFocused] = useState([false, false]);

  return (
    <>
      <IonItem color="tertiary">
        <IonSelect
          className={isFocused[0] ? 'input-item' : 'script-popup-input'}
          value={element && element.categoryName}
          labelPlacement="floating"
          label="Element Category"
          onIonChange={(e) => setElement((prevElement: any) => ({ ...prevElement, categoryName: e.detail.value || '' }))}
          interface="popover"
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '12px',
          }}
          onFocus={() => setIsFocused([true, false])}
          onBlur={() => setIsFocused([false, false])}
          placeholder="INSERT"
        >

          {elementCategories.map((category: (string | null)) => (
            category
              ? (
                <IonSelectOption key={category} value={category}>
                  {category.toUpperCase()}
                </IonSelectOption>
              )
              : (
                <IonSelectOption key={category} value={category}>
                  NO CATEGORY
                </IonSelectOption>
              )
          ))}
        </IonSelect>
      </IonItem>
      <IonItem color="tertiary">
        <IonInput
          className={isFocused[1] ? 'input-item' : 'script-popup-input'}
          value={element.elementName}
          labelPlacement="floating"
          label="Element Name *"
          placeholder="INSERT ELEMENT NAME"
          onIonChange={(e) => setElement((prevElement: any) => ({ ...prevElement, elementName: e.detail.value || '' }))}
          style={{
            borderBottom: '1px solid var(--ion-color-light)',
            fontSize: '12px',
          }}
          onFocus={() => setIsFocused([false, true])}
          onBlur={() => setIsFocused([false, false])}
        />
      </IonItem>
    </>
  );
};
export default ElementForm;
