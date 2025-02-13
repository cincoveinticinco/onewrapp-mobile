import React from 'react';
import { IonButton, IonCardContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList } from '@ionic/react';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';
import { VscEdit } from 'react-icons/vsc';

interface Element {
  elementName: string;
  categoryName: string | null;
}

interface AddElementInputProps {
  categoryName: string | null;
  selectedElements: Element[];
  setSelectedElements: (elements: Element[]) => void;
  editMode?: boolean;
  openEditElement: (element: Element) => void;
}

const AddElementInput: React.FC<AddElementInputProps> = ({
  categoryName,
  selectedElements,
  setSelectedElements,
  editMode,
  openEditElement
}) => {
  const filterSelectedElements = selectedElements.filter(element => {
    if (categoryName === EmptyEnum.NoCategory || !categoryName) return !element.categoryName;
    return element.categoryName === categoryName;
  });

  const deleteElement = (elementName: string) => {
    const updatedElements = selectedElements.filter(element => element.elementName !== elementName);
    setSelectedElements(updatedElements);
  };

  const contentStyle = selectedElements.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedElements.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedElements.map((element, index) => (
            <IonItemSliding key={`element-item-${index}-category-${categoryName}`}>
              <IonItem color='tertiary-dark'>
                {element.elementName.toUpperCase()}
              </IonItem>
              {editMode && (
                <IonItemOptions side="end">
                  <IonItemOption color='dark' onClick={() => openEditElement(element)}>
                    <IonButton fill="clear" color='primary' slot="end"><VscEdit className="label-button" /></IonButton>
                  </IonItemOption>
                  <IonItemOption color='dark' onClick={() => deleteElement(element.elementName)}>
                    <DeleteButton onClick={() => {}} slot="end" />
                  </IonItemOption>
                </IonItemOptions>
              )}
            </IonItemSliding>
          ))}
        </IonList>
      ) : <NoAdded />}
    </IonCardContent>
  );
};

export default AddElementInput;