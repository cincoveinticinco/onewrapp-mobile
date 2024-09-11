import React from 'react';
import { IonButton } from '@ionic/react';
import { VscEdit } from 'react-icons/vsc';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import EditionModal from '../../Shared/EditionModal/EditionModal';
import { Meal } from '../../../interfaces/shooting.types';

interface MealInfoProps {
  meal: any;
  editMode: boolean;
  getHourMinutesFomISO: (iso: string) => string;
  deleteMeal: (meal: any) => void;
  editionInputs: any;
  handleEdition: any;
}

const MealInfo: React.FC<MealInfoProps> = ({
  meal, editMode, getHourMinutesFomISO, deleteMeal, editionInputs, handleEdition,
}) => {
  const editionModalRef = React.useRef<HTMLIonModalElement>(null);

  const formatDefaultValues = (meal: Meal) => ({
    ...meal,
    ready_at: getHourMinutesFomISO(meal.ready_at),
    end_time: getHourMinutesFomISO(meal.end_time),
  });

  const EditModal = () => (
    <EditionModal
      modalRef={editionModalRef}
      modalTrigger={`${'open-edit-meal-modal' + '-'}${meal.id}`}
      title="Edit Meal"
      formInputs={editionInputs}
      handleEdition={handleEdition}
      defaultFormValues={{ ...formatDefaultValues(meal) }}
      modalId={`${'edit-meal-modal' + '-'}${meal.id}`}
    />
  );

  const openModal = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  return (
    <>
      <div className="ion-padding-start">
        <b
          className="ion-flex ion-align-items-center ion-justify-content-between"
          style={{ minHeight: '50px' }}
        >
          {meal.meal.toUpperCase()}
          :

          {
          editMode
          && (
          <div>
            <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => openModal()}>
              <VscEdit
                className="toolbar-icon"
                style={{ color: 'var(--ion-color-primary)' }}
              />
            </IonButton>
            <DeleteButton onClick={() => deleteMeal(meal)} />
          </div>
          )
        }
        </b>
        <span
          className="ion-flex ion-align-items-center"
        >
          FROM:
          {getHourMinutesFomISO(meal.ready_at)}
          {' '}
          TO:
          {getHourMinutesFomISO(meal.end_time)}
        </span>
      </div>
      <EditModal />
    </>
  );
};

export default MealInfo;
