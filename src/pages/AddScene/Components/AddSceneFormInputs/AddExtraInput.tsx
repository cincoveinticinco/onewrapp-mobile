import React from 'react';
import { IonButton, IonCardContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList } from '@ionic/react';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import { Extra } from '../../../../Shared/types/scenes.types';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';
import { VscEdit } from 'react-icons/vsc';

interface AddExtraInputProps {
  categoryName: string | null;
  selectedExtras: Extra[];
  setSelectedExtras: (extras: Extra[]) => void;
  editMode?: boolean;
  openEditExtra: (extra: Extra) => void;
}

const AddExtraInput: React.FC<AddExtraInputProps> = ({
  categoryName,
  selectedExtras,
  setSelectedExtras,
  editMode,
  openEditExtra
}) => {
  const filterSelectedExtras = selectedExtras.filter(extra => {
    if (categoryName === EmptyEnum.NoCategory || !categoryName) return !extra.categoryName;
    return extra.categoryName === categoryName;
  });

  const deleteExtra = (extraName: string) => {
    const updatedExtras = selectedExtras.filter(extra => extra.extraName !== extraName);
    setSelectedExtras(updatedExtras);
  };

  const contentStyle = selectedExtras.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedExtras.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedExtras.map((extra, index) => (
            <IonItemSliding key={`extra-item-${index}-category-${categoryName}`}>
              <IonItem color='tertiary-dark'>
                {extra.extraName?.toUpperCase()}
              </IonItem>
              {editMode && (
                <IonItemOptions side="end">
                  <IonItemOption color='dark' onClick={() => openEditExtra(extra)}>
                    <IonButton fill="clear" color='primary' slot="end"><VscEdit className="label-button" /></IonButton>
                  </IonItemOption>
                  <IonItemOption color='dark' onClick={() => extra.extraName && deleteExtra(extra.extraName)}>
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


export default AddExtraInput;
