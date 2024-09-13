import { Meal } from '../../../../interfaces/shooting.types';
import { FormInput } from '../../../Shared/EditionModal/EditionModal';
import OutlinePrimaryButton from '../../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import { Section } from '../../../Shared/Section/Section';
import MealInfo from '../../MealInfo/MealInfo';

interface MealsSectionProps {
  meals: Meal[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: any;
  getHourMinutesFomISO: (isoString: string) => string;
  deleteMeal: (meal: Meal) => void;
  mealInputs: FormInput[];
  handleEditMeal: (meal: Meal) => void;
  permissionType?: number | null;
}

export const MealsSection: React.FC<MealsSectionProps> = ({
  meals,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  getHourMinutesFomISO,
  deleteMeal,
  mealInputs,
  handleEditMeal,
  permissionType,
}) => (
  <Section
    title="Meals"
    open={open}
    setOpen={setOpen}
    editMode={editMode}
    setEditMode={setEditMode}
    onAddClick={onAddClick}
    permissionType={permissionType}
  >
    <div style={{ width: '100%' }}>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <MealInfo
            key={meal.id}
            meal={meal}
            editMode={editMode}
            getHourMinutesFomISO={getHourMinutesFomISO}
            deleteMeal={deleteMeal}
            editionInputs={mealInputs}
            handleEdition={handleEditMeal}
          />
        ))
      ) : (
        <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{ height: '100%', width: '100%' }}>
          <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1} />
        </div>
      )}
    </div>
  </Section>
);
