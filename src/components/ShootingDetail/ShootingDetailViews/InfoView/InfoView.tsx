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
import './InfoView.css';
import OutlinePrimaryButton from "../../../Shared/OutlinePrimaryButton/OutlinePrimaryButton";
import { RiFontSize } from "react-icons/ri";

interface InfoViewProps {
  shootingData: ShootingDataProps;
  updateShootingTime: any;
  setOpenLocations: React.Dispatch<React.SetStateAction<boolean>>;
  openLocations: boolean;
  setLocationsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  locationsEditMode: boolean;
  openMapModal: () => void;
  removeLocation: (location: LocationInfo, locationIndex: number) => void;
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
  permissionType?: number | null;
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
  handleEditMeal,
  permissionType
})  => {

  return (
    <IonContent color="tertiary" fullscreen>
      <ShootingBasicInfo
        shootingInfo={shootingData.shotingInfo}
        updateShootingTime={updateShootingTime}
        permissionType={permissionType}
      />
     <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
     }}>
      <div className="section-wrapper">
        <div>
          <LocationsSection
            locations={shootingData.shotingInfo.locations}
            open={openLocations}
            setOpen={setOpenLocations}
            editMode={locationsEditMode}
            setEditMode={setLocationsEditMode}
            onAddClick={openMapModal}
            removeLocation={removeLocation}
            permissionType={permissionType}
          />
        </div>
      </div>
      <div className="section-wrapper">
        <div>
          <HospitalsSection
            hospitals={shootingData.shotingInfo.hospitals}
            open={openHospitals}
            setOpen={setOpenHospitals}
            onAddClick={openHospitalsMapModal}
            permissionType={permissionType}
          />
        </div>
      </div>
      <div className="section-wrapper">
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
          permissionType={permissionType}
        />
      </div>
      <div className="section-wrapper">
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
          permissionType={permissionType}
        />
      </div>
     </div>

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
  removeLocation: (location: LocationInfo, locationIndex: number) => void;
  permissionType?: number | null;
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
  permissionType?: number | null
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
  saveFunction,
  permissionType
}) => {

  const renderEditSaveButton = () => {

    if (saveFunction && setEditMode) {
      if(editMode) {
        return (
          <VscSave
            className="toolbar-icon"
            style={{ color: 'var(--ion-color-primary)' }}
            onClick={saveFunction}
          />
        );
      } else {
        <VscEdit
          className="toolbar-icon"
          style={{ color: 'var(--ion-color-light)' }}
          onClick={() => setEditMode(!editMode)}
        />
      }
    }
    return null;
  };

  return (
    <>
      <div
        className="ion-flex ion-justify-content-between ion-padding-start ion-align-items-center"
        style={{
          border: '1px solid black',
          backgroundColor: 'var(--ion-color-dark)',
          height: '40px',
        }}
      >
        <p style={{ fontSize: '18px' }}><b>{title.toUpperCase()}</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          {editMode !== undefined && setEditMode && (
            <IonButton
              fill="clear"
              slot="end"
              color="light"
              className="toolbar-button"
              disabled={permissionType !== 1}
            >
             {
              !saveAfterEdit ? (
                <VscEdit
                  className="toolbar-icon"
                  style={editMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                  onClick={() => setEditMode && setEditMode(!editMode)}
                />
              ) : (
                <>
                  {renderEditSaveButton()}
                </>
              )
             }
            </IonButton>
          )}
          <AddButton onClick={onAddClick} disabled={permissionType !== 1} />
        </div>
      </div>
      <div className="children-wrapper">
        {open && children}
      </div>
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
  permissionType
}) => {
  return (
    <Section
      title="Locations"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      setEditMode={setEditMode}
      onAddClick={onAddClick}
      permissionType={permissionType}
    >
      {locations.length > 0 ? (
        locations.map((location, locationIndex) => (
          <div key={location.lat + location.lng} className="ion-padding-start location-info-grid" style={{width: '100%'}}>
            <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
              <b>
                {location.locationName.toUpperCase()}
              </b>
            </h5>
            <div className="location-address">
              <p>{location.locationAddress}</p>
            </div>
            <div className="ion-flex-column location-buttons">
              {editMode && <IonButton fill="clear" slot="end" color="light" className="toolbar-button"><VscEdit /></IonButton>} 
              {editMode && <DeleteButton onClick={() => removeLocation(location, locationIndex)} />}
            </div>
          </div>
        ))
      ) : (
        <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{height: '100%', width: '100%'}}>
          <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1} />
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
  permissionType?: number | null;
}

export const HospitalsSection: React.FC<HospitalsSectionProps> = ({
  hospitals,
  open,
  setOpen,
  onAddClick,
  permissionType,
}) => {
  return (
    <Section
      title="Near Hospitals"
      open={open}
      setOpen={setOpen}
      onAddClick={onAddClick}
      permissionType={permissionType}
    >
      {hospitals.length > 0 ? (
        hospitals.map((hospital) => (
          <div key={hospital.lat + hospital.lng} className="ion-padding-start" style={{width: '100%'}}>
            <h5><b>{hospital.locationName.toUpperCase()}</b></h5>
            <p>{hospital.locationAddress}</p>
          </div>
        ))
      ) : (
        <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{height: '100%', width: '100%'}}>
          <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1} />
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
  permissionType?: number | null;
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
  handleEditAdvanceCall,
  permissionType
}) => {
  return (
    <Section
      title="Advance Calls"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      setEditMode={setEditMode}
      onAddClick={onAddClick}
      permissionType={permissionType}
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
        <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{height: '100%', width: '100%'}}>
          <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1} />
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
  permissionType
}) => {
  return (
    <Section
      title="Meals"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      setEditMode={setEditMode}
      onAddClick={onAddClick}
      permissionType={permissionType}
    >
      <div style={{width: '100%'}}>
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
          <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{height: '100%', width: '100%'}}>
            <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1}/>
          </div>
        )}
      </div>
    </Section>
  );
}

