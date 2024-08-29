import { IonButton, IonContent } from "@ionic/react";
import { LocationInfo, Meal } from "../../../../interfaces/shooting.types";
import { ShootingDataProps } from "../../../../pages/ShootingDetail/ShootingDetail";
import { FormInput } from "../../../Shared/EditionModal/EditionModal";
import ShootingBasicInfo from "../../ShootingBasicInfo/ShootingBasicInfo";
import AddButton from "../../../Shared/AddButton/AddButton";
import DropDownButton from "../../../Shared/DropDownButton/DropDownButton";
import DeleteButton from "../../../Shared/DeleteButton/DeleteButton";
import { VscEdit } from "react-icons/vsc";
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
      <div
        className="ion-flex ion-justify-content-between ion-padding-start"
        style={{
          border: '1px solid black',
          backgroundColor: 'var(--ion-color-tertiary-shade)',
        }}
        onClick={() => setOpenLocations(!openLocations)}
      >
        <p style={{ fontSize: '18px' }}><b>LOCATIONS</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          {
            shootingData.shotingInfo.locations.length > 0
            && (
            <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => setLocationsEditMode(!locationsEditMode)}>
              <VscEdit
                className="toolbar-icon"
                style={locationsEditMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
              />
            </IonButton>
            )
          }
          <AddButton onClick={() => openMapModal()} />
          <DropDownButton open={openLocations} />
        </div>
      </div>
      {openLocations && (
        shootingData.shotingInfo.locations.length > 0 ? (
          shootingData.shotingInfo.locations.map((location: LocationInfo) => (
            <div key={location.id} className="ion-padding-start">
              <h5><b>{location.location_name.toUpperCase()}</b></h5>
              <div style={
                {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }
              }
              >
                <p>{location.location_full_address}</p>
                {
                    locationsEditMode && (
                      <DeleteButton onClick={() => removeLocation(location)} />
  
                    )
                  }
              </div>
  
            </div>
          ))
        ) : (
          <div className="ion-padding-start">
            <p>NO LOCATIONS ADDED</p>
          </div>
        )
      )}
  
      <div
        className="ion-flex ion-justify-content-between ion-padding-start"
        style={{
          border: '1px solid black',
          backgroundColor: 'var(--ion-color-tertiary-shade)',
        }}
        onClick={() => setOpenHospitals(!openHospitals)}
      >
        <p style={{ fontSize: '18px' }}><b>NEAR HOSPITALS</b></p>
        <div onClick={(e) => e.preventDefault()}>
          <AddButton onClick={() => openHospitalsMapModal()} />
          <DropDownButton open={openHospitals} />
        </div>
  
      </div>
      {openHospitals && (
        shootingData.shotingInfo.hospitals.length > 0 ? (
          shootingData.shotingInfo.hospitals.map((hospital: LocationInfo) => (
            <div key={hospital.id} className="ion-padding-start">
              <h5><b>{hospital.location_name.toUpperCase()}</b></h5>
              <p>{hospital.location_full_address}</p>
            </div>
          ))
        ) : (
          <div className="ion-padding-start">
            <p>NO HOSPITALS ADDED</p>
          </div>
        )
      )}
  
      <div
        className="ion-flex ion-justify-content-between ion-padding-start"
        style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }}
        onClick={() => setOpenAdvanceCalls(!openadvanceCalls)}
      >
        <p style={{ fontSize: '18px' }}><b>ADVANCE CALLS</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => setAdvanceCallsEditMode(!advanceCallsEditMode)}>
            {
            shootingData.shotingInfo.advanceCalls.length > 0
            && (
            <VscEdit
              className="toolbar-icon"
              style={advanceCallsEditMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
            />
            )
          }
          </IonButton>
          <AddButton onClick={(e) => openAdvanceCallModal(e)} />
          <DropDownButton open={openadvanceCalls} />
        </div>
      </div>
      {
        openadvanceCalls && shootingData.shotingInfo.advanceCalls && (
          shootingData.shotingInfo.advanceCalls.length > 0 ? (
            shootingData.shotingInfo.advanceCalls.map((call: any) => (
              <AdvanceCallInfo
                key={call.id}
                call={call}
                editMode={advanceCallsEditMode}
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
          )
        )
      }
  
      <div
        className="ion-flex ion-justify-content-between ion-padding-start"
        style={{ border: '1px solid black', backgroundColor: 'var(--ion-color-tertiary-shade)' }}
        onClick={() => setOpenMeals(!openMeals)}
      >
        <p style={{ fontSize: '18px' }}><b>MEALS</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => setMealsEditMode(!mealsEditMode)}>
  
            {
            shootingData.shotingInfo.meals.length > 0
            && (
            <VscEdit
              className="toolbar-icon"
              style={mealsEditMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
            />
            )
          }
          </IonButton>
          <AddButton onClick={(e) => openMealModal(e)} />
          <DropDownButton open={openMeals} />
        </div>
      </div>
      {
        openMeals && (
          Object.keys(shootingData.shotingInfo.meals).length > 0 ? (
            Object.entries(shootingData.shotingInfo.meals).map(([key, meal]: any) => (
              <MealInfo
                key={meal.id}
                meal={meal}
                editMode={mealsEditMode}
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
          )
        )
      }
    </IonContent>
  )
}

export default InfoView;