import React from 'react';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { VscEdit } from 'react-icons/vsc';
import { Meal } from '../../../../Shared/types/shooting.types';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import { getAmOrPm } from '../../../../Shared/Utils/getHoursMinutesFromISO';
import EditionModal from '../../../../Shared/Components/EditionModal/EditionModal';
import { mealInputs } from '../../Inputs/meal.inputs';

interface MealInfoProps {
  meal: Meal;
  editMode: boolean;
  getHourMinutesFomISO: (iso: string, withAmPm?: boolean) => string;
  deleteMeal: (meal: Meal) => void;
  handleEdition: any;
}

const MealInfo: React.FC<MealInfoProps> = ({
  meal,
  editMode,
  getHourMinutesFomISO,
  deleteMeal,
  handleEdition,
}) => {
  const editionModalRef = React.useRef<HTMLIonModalElement>(null);
  const alertRef = React.useRef<any>(null);

  const formatDefaultValues = (meal: Meal) => {
    const formattedMealValues = {
      ...meal,
      readyAt: meal.readyAt ? getHourMinutesFomISO(meal.readyAt, false) : '',
      endTime: meal.endTime ? getHourMinutesFomISO(meal.endTime, false) : '',
    };

    return formattedMealValues;
  };

  const openEditModal = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  const openAlert = () => {
    alertRef.current?.present();
  };

  return (
    <>
      <div className="ion-padding-start location-info-grid" style={{ width: '100%' }}>
        <InputAlert
          handleOk={() => deleteMeal(meal)}
          header="Delete Meal"
          message={`Are you sure you want to delete the ${meal.meal ? meal.meal.toUpperCase() : ''} meal?`}
          ref={alertRef}
          inputs={[]}
        />
        <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
          <b>{meal.meal ? meal.meal.toUpperCase() : ''}</b>
        </h5>
        <div className="location-address">
          <p>
            FROM:
            {' '}
            {meal.readyAt ? getHourMinutesFomISO(meal.readyAt) + getAmOrPm(meal.readyAt) : 'N/A'}
            {' '}
            TO:
            {' '}
            {meal.endTime ? getHourMinutesFomISO(meal.endTime) + getAmOrPm(meal.endTime) : 'N/A'}
          </p>
        </div>
        {editMode && (
          <div className="ion-flex-column location-buttons">
            <VscEdit className="edit-location" onClick={openEditModal} />
            <PiTrashSimpleLight className="delete-location" onClick={openAlert} />
          </div>
        )}
      </div>
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger={`open-edit-meal-modal-${meal.id}`}
        title="Edit Meal"
        formInputs={mealInputs}
        handleEdition={handleEdition}
        defaultFormValues={formatDefaultValues(meal)}
        modalId={`edit-meal-modal-${meal.id}`}
      />
    </>
  );
};

export default MealInfo;
