import React from 'react';
import { IonCardContent, IonItem, IonList } from '@ionic/react';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';

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
    if (categoryName === EmptyEnum.NoCategory || !categoryName) {
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
            <IonItem
              key={`character-item-${index}-category-${categoryName}`}
              color='tertiary-dark'
            >
              {element.elementName.toUpperCase()}
              {editMode && (
                <DeleteButton
                  onClick={() => deleteElement(element.elementName)}
                  slot="end"
                />
              )}
            </IonItem>
          ))}
        </IonList>
      ) : (
        <NoAdded />
      )}
    </IonCardContent>
  );
};

export default AddElementInput;
