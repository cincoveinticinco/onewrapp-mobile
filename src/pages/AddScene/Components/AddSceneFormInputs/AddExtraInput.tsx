import React from 'react';
import { IonCardContent, IonItem, IonList } from '@ionic/react';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import { Extra } from '../../../../Shared/types/scenes.types';
import { EmptyEnum } from '../../../../Shared/ennums/ennums';

interface AddExtraInputProps {
  categoryName: string | null;
  selectedExtras: Extra[];
  setSelectedExtras: (extras: Extra[]) => void;
  editMode?: boolean;
}

const AddExtraInput: React.FC<AddExtraInputProps> = ({
  categoryName,
  selectedExtras,
  setSelectedExtras,
  editMode,
}) => {
  const filterSelectedExtras = selectedExtras.filter((extra: Extra) => {
    if (categoryName === EmptyEnum.NoCategory || !categoryName) {
      return !extra.categoryName || extra.categoryName === '' || extra.categoryName === undefined;
    }
    return extra.categoryName === categoryName;
  });

  const deleteExtra = (extraName: string) => {
    const updatedExtras = selectedExtras.filter(
      (extra: Extra) => extra.extraName !== extraName
    );
    setSelectedExtras(updatedExtras);
  };

  const contentStyle = selectedExtras.length === 0 ? 'ion-no-padding' : '';

  return (
    <IonCardContent className={contentStyle}>
      {filterSelectedExtras.length > 0 ? (
        <IonList className="ion-no-padding ion-no-margin">
          {filterSelectedExtras.map((extra: Extra, index: number) => (
            <IonItem
              key={`character-item-${index}-category-${categoryName}`}
              color='tertiary-dark'
            >
              {(extra.extraName ?? '').toUpperCase()}
              {editMode && (
                <DeleteButton
                  onClick={() => extra.extraName && deleteExtra(extra.extraName)}
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

export default AddExtraInput;
