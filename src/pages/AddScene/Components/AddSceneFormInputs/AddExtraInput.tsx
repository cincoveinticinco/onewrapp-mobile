import React from 'react';
import { IonCardContent, IonList } from '@ionic/react';
import DeleteButton from '../../../../Shared/Components/DeleteButton/DeleteButton';
import NoAdded from '../../../../Shared/Components/NoAdded/NoAdded';
import { Extra } from '../../../../Shared/types/scenes.types';

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
    if (categoryName === 'NO CATEGORY' || !categoryName) {
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
            <div
              key={`extra-item-${index}-category-${categoryName}`}
              style={{ backgroundColor: 'var(--ion-color-tertiary-dark)', color: 'var(--ion-color-light)' }}
              className="ion-no-margin category-items ion-flex ion-justify-content-between ion-align-items-center"
            >
              {(extra.extraName ?? '').toUpperCase()}
              {editMode && (
                <DeleteButton
                  onClick={() => extra.extraName && deleteExtra(extra.extraName)}
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

export default AddExtraInput;
