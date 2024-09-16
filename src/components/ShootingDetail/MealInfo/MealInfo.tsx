import React from 'react';
import { VscEdit } from 'react-icons/vsc';
import { PiTrashSimpleLight } from 'react-icons/pi';
import EditionModal from '../../Shared/EditionModal/EditionModal';
import { Meal } from '../../../interfaces/shooting.types';
import { getAmOrPm } from '../../../utils/getHoursMinutesFromISO';
import InputAlert from '../../../Layouts/InputAlert/InputAlert';

interface MealInfoProps {
  meal: Meal;
  editMode: boolean;
  getHourMinutesFomISO: (iso: string, withAmPm?: boolean) => string;
  deleteMeal: (meal: Meal) => void;
  editionInputs: any;
  handleEdition: any;
}

const MealInfo: React.FC<MealInfoProps> = ({
  meal,
  editMode,
  getHourMinutesFomISO,
  deleteMeal,
  editionInputs,
  handleEdition,
}) => {
  const editionModalRef = React.useRef<HTMLIonModalElement>(null);
  const alertRef = React.useRef<any>(null);

  const formatDefaultValues = (meal: Meal) => {
    const formattedMealValues = {
      ...meal,
      ready_at: getHourMinutesFomISO(meal.ready_at, false),
      end_time: getHourMinutesFomISO(meal.end_time, false),
    }

    console.log('formattedMealValues', formattedMealValues);

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
          header='Delete Meal'
          message={`Are you sure you want to delete the ${meal.meal.toUpperCase()} meal?`}
          ref={alertRef}
          inputs={[]}
        />
        <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
          <b>{meal.meal.toUpperCase()}</b>
        </h5>
        <div className="location-address">
          <p>
            FROM: {getHourMinutesFomISO(meal.ready_at) + getAmOrPm(meal.ready_at)} TO: {getHourMinutesFomISO(meal.end_time) + getAmOrPm(meal.end_time)}
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
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={formatDefaultValues(meal)}
        modalId={`edit-meal-modal-${meal.id}`}
      />
    </>
  );
};

export default MealInfo;