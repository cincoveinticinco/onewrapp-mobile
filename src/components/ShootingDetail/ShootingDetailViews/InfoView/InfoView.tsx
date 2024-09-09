import { IonButton, IonContent } from "@ionic/react";
import { LocationInfo, Meal } from "../../../../interfaces/shooting.types";
import { ShootingDataProps } from "../../../../pages/ShootingDetail/ShootingDetail";
import { FormInput } from "../../../Shared/EditionModal/EditionModal";
import ShootingBasicInfo from "../../ShootingBasicInfo/ShootingBasicInfo";
import AddButton from "../../../Shared/AddButton/AddButton";
import DropDownButton from "../../../Shared/DropDownButton/DropDownButton";
import DeleteButton from "../../../Shared/DeleteButton/DeleteButton";
import { VscEdit, VscSave } from "react-icons/vsc";
import AdvanceCallInfo from "../../AdvanceCallInfo/AdvanceCallInfo";
import MealInfo from "../../MealInfo/MealInfo";

interface InfoViewProps {
  shootingData: ShootingDataProps;
  updateShootingTime: any;
  setOpenLocations: React.Dispatch<React.SetStateAction<boolean>>;
  openLocations: boolean;
  setLocationsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  locationsEditMode: boolean;
  openMapModal: () => void;
  removeLocation: (location: LocationInfo) => void;
  setOpenHospitals: React.Dispatch<React.SetStateAction<boolean>>;
  openHospitals: boolean;
  openHospitalsMapModal: () => void;
  setOpenAdvanceCalls: React.Dispatch<React.SetStateAction<boolean>>;
  openadvanceCalls: boolean;
  setAdvanceCallsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  advanceCallsEditMode: boolean;
  openAdvanceCallModal: (e: React.MouseEvent) => void;
  getHourMinutesFomISO: (isoString: string) => string;
  deleteAdvanceCall: (call: any) => void;
  advanceCallInputs: any; // Tipo más específico si está disponible
  handleEditAdvanceCall: (call: any) => void;
  setOpenMeals: React.Dispatch<React.SetStateAction<boolean>>;
  openMeals: boolean;
  setMealsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  mealsEditMode: boolean;
  openMealModal: (e: React.MouseEvent) => void;
  deleteMeal: (meal: Meal) => void;
  mealInputs: FormInput[];
  handleEditMeal: (meal: Meal) => void;
}

const InfoView: React.FC<InfoViewProps> = ({
  shootingData,
  updateShootingTime,
  setOpenLocations,
  openLocations,
  setLocationsEditMode,
  locationsEditMode,
  openMapModal,
  removeLocation,
  setOpenHospitals,
  openHospitals,
  openHospitalsMapModal,
  setOpenAdvanceCalls,
  openadvanceCalls,
  setAdvanceCallsEditMode,
  advanceCallsEditMode,
  openAdvanceCallModal,
  getHourMinutesFomISO,
  deleteAdvanceCall,
  advanceCallInputs,
  handleEditAdvanceCall,
  setOpenMeals,
  openMeals,
  setMealsEditMode,
  mealsEditMode,
  openMealModal,
  deleteMeal,
  mealInputs,
  handleEditMeal
})  => {

  return (
    <IonContent color="tertiary" fullscreen>
      <ShootingBasicInfo
        shootingInfo={shootingData.shotingInfo}
        updateShootingTime={updateShootingTime}
      />

      <LocationsSection
        locations={shootingData.shotingInfo.locations}
        open={openLocations}
        setOpen={setOpenLocations}
        editMode={locationsEditMode}
        setEditMode={setLocationsEditMode}
        onAddClick={openMapModal}
        removeLocation={removeLocation}
      />

      <HospitalsSection
        hospitals={shootingData.shotingInfo.hospitals}
        open={openHospitals}
        setOpen={setOpenHospitals}
        onAddClick={openHospitalsMapModal}
      />

      <AdvanceCallsSection
        advanceCalls={shootingData.shotingInfo.advanceCalls}
        open={openadvanceCalls}
        setOpen={setOpenAdvanceCalls}
        editMode={advanceCallsEditMode}
        setEditMode={setAdvanceCallsEditMode}
        onAddClick={openAdvanceCallModal}
        getHourMinutesFomISO={getHourMinutesFomISO}
        deleteAdvanceCall={deleteAdvanceCall}
        advanceCallInputs={advanceCallInputs}
        handleEditAdvanceCall={handleEditAdvanceCall}
      />

      <MealsSection
        meals={shootingData.shotingInfo.meals}
        open={openMeals}
        setOpen={setOpenMeals}
        editMode={mealsEditMode}
        setEditMode={setMealsEditMode}
        onAddClick={openMealModal}
        getHourMinutesFomISO={getHourMinutesFomISO}
        deleteMeal={deleteMeal}
        mealInputs={mealInputs}
        handleEditMeal={handleEditMeal}
      />

    </IonContent>
  )
}

export default InfoView;

interface LocationsSectionProps {
  locations: LocationInfo[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
  removeLocation: (location: LocationInfo) => void;
}

interface SectionProps {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode?: boolean;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
  children: React.ReactNode;
  saveAfterEdit?: boolean
  saveFunction?: () => void
}

export const Section: React.FC<SectionProps> = ({
  title,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  children,
  saveAfterEdit = false,
  saveFunction
}) => {

  const renderEditSaveButton = () => {
    if (saveFunction && setEditMode) {
      return (
        <IonButton
          fill="clear"
          slot="end"
          color="light"
          className="toolbar-button"
        >
          {editMode ? (
            <VscSave
              className="toolbar-icon"
              style={{ color: 'var(--ion-color-primary)' }}
              onClick={saveFunction}
            />
          ) : (
            <VscEdit
              className="toolbar-icon"
              style={{ color: 'var(--ion-color-light)' }}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </IonButton>
      );
    }
    return null;
  };

  return (
    <>
      <div
        className="ion-flex ion-justify-content-between ion-padding-start"
        style={{
          border: '1px solid black',
          backgroundColor: 'var(--ion-color-tertiary-shade)',
        }}
        onClick={() => setOpen(!open)}
      >
        <p style={{ fontSize: '18px' }}><b>{title.toUpperCase()}</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          {editMode !== undefined && setEditMode && (
            <IonButton
              fill="clear"
              slot="end"
              color="light"
              className="toolbar-button"
              onClick={() => setEditMode && setEditMode(!editMode)}
            >
             {
              !saveAfterEdit ? (
                <VscEdit
                  className="toolbar-icon"
                  style={editMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                />
              ) : (
                <>
                  {renderEditSaveButton()}
                </>
              )
             }
            </IonButton>
          )}
          <AddButton onClick={onAddClick} />
          <DropDownButton open={open} />
        </div>
      </div>
      {open && children}
    </>
  );
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  locations,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  removeLocation,
}) => {
  return (
    <Section
      title="Locations"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      setEditMode={setEditMode}
      onAddClick={onAddClick}
    >
      {locations.length > 0 ? (
        locations.map((location) => (
          <div key={location.id} className="ion-padding-start">
            <h5><b>{location.location_name.toUpperCase()}</b></h5>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p>{location.location_full_address}</p>
              {editMode && <DeleteButton onClick={() => removeLocation(location)} />}
            </div>
          </div>
        ))
      ) : (
        <div className="ion-padding-start">
          <p>NO LOCATIONS ADDED</p>
        </div>
      )}
    </Section>
  );
}

interface HospitalsSectionProps {
  hospitals: LocationInfo[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
}

export const HospitalsSection: React.FC<HospitalsSectionProps> = ({
  hospitals,
  open,
  setOpen,
  onAddClick
}) => {
  return (
    <Section
      title="Near Hospitals"
      open={open}
      setOpen={setOpen}
      onAddClick={onAddClick}
    >
      {hospitals.length > 0 ? (
        hospitals.map((hospital) => (
          <div key={hospital.id} className="ion-padding-start">
            <h5><b>{hospital.location_name.toUpperCase()}</b></h5>
            <p>{hospital.location_full_address}</p>
          </div>
        ))
      ) : (
        <div className="ion-padding-start">
          <p>NO HOSPITALS ADDED</p>
        </div>
      )}
    </Section>
  );
}

interface AdvanceCallsSectionProps {
  advanceCalls: any[]; // Cambiar a un tipo más específico si está disponible
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: any;
  getHourMinutesFomISO: (isoString: string) => string;
  deleteAdvanceCall: (call: any) => void;
  advanceCallInputs: any; // Tipo más específico si está disponible
  handleEditAdvanceCall: (call: any) => void;
}

export const AdvanceCallsSection: React.FC<AdvanceCallsSectionProps> = ({
  advanceCalls,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  getHourMinutesFomISO,
  deleteAdvanceCall,
  advanceCallInputs,
  handleEditAdvanceCall
}) => {
  return (
    <Section
      title="Advance Calls"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      setEditMode={setEditMode}
      onAddClick={onAddClick}
    >
      {advanceCalls.length > 0 ? (
        advanceCalls.map((call) => (
          <AdvanceCallInfo
            key={call.id}
            call={call}
            editMode={editMode}
            getHourMinutesFomISO={getHourMinutesFomISO}
            deleteAdvanceCall={deleteAdvanceCall}
            editionInputs={advanceCallInputs}
            handleEdition={handleEditAdvanceCall}
          />
        ))
      ) : (
        <div className="ion-padding-start">
          <p>NO ADVANCE CALLS ADDED</p>
        </div>
      )}
    </Section>
  );
}

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
  handleEditMeal
}) => {
  return (
    <Section
      title="Meals"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      setEditMode={setEditMode}
      onAddClick={onAddClick}
    >
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
        <div className="ion-padding-start">
          <p>NO MEALS ADDED</p>
        </div>
      )}
    </Section>
  );
}

