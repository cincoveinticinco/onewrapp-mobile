import React from 'react';
import { IonCardContent, IonList } from '@ionic/react';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';

interface Element {
  elementName: string;
  categoryName: string | null;
}

interface AddElementInputProps {
  categoryName: string | null;
  selectedElements: Element[];
  setSelectedElements: (elements: Element[]) => void;
  editMode?: boolean;
}

const AddElementInput: React.FC<AddElementInputProps> = ({
  categoryName,
  selectedElements,
  setSelectedElements,
  editMode,
}) => {
  // Filtrar los elementos según la categoría seleccionada
  const filterSelectedElements = selectedElements.filter((element: Element) => {
    if (categoryName === 'NO CATEGORY' || !categoryName) {
      return !element.categoryName || element.categoryName === '' || element.categoryName === undefined;
    }
    return element.categoryName === categoryName;
  });

  // Función para eliminar un elemento
  const deleteElement = (elementName: string) => {
    const updatedElements = selectedElements.filter(
      (element: Element) => element.elementName !== elementName
    );
    setSelectedElements(updatedElements);
  };

  const contentStyle = selectedElements.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedElements.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedElements.map((element: Element, index: number) => (
            <div
              key={`element-item-${index}-category-${categoryName}`}
              style={{ backgroundColor: 'var(--ion-color-tertiary-dark)', color: 'var(--ion-color-light)' }}
              className="ion-no-margin category-items ion-flex ion-justify-content-between ion-align-items-center"
            >
              {element.elementName.toUpperCase()}
              {editMode && (
                <DeleteButton
                  onClick={() => deleteElement(element.elementName)}
                  slot="end"
                />
              )}
            </div>
          ))}
        </IonList>
      ) : (
        <NoAdded />
      )}
    </IonCardContent>
  );
};

export default AddElementInput;
