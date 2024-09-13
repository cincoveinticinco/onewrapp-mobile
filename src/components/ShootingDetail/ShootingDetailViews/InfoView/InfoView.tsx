import { IonContent } from '@ionic/react';
import { LocationInfo, Meal } from '../../../../interfaces/shooting.types';
import { FormInput } from '../../../Shared/EditionModal/EditionModal';
import ShootingBasicInfo from '../../ShootingBasicInfo/ShootingBasicInfo';
import './InfoView.css';
import { LocationsSection } from '../../ShootingDetailSections/LocationsSection/LocationsSections';
import { AdvanceCallsSection } from '../../ShootingDetailSections/AdvanceCallsSection/AdvanceCallsSection';
import { MealsSection } from '../../ShootingDetailSections/MealsSection/MealsSection';
import { HospitalsSection } from '../../ShootingDetailSections/HospitalSection/HospitalSection';

interface InfoViewProps {
  shootingData: any;
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
  openEditModal: (index: number) => void;
  removeHospital: (hospital: LocationInfo, hospitalIndex: number) => void;
  openEditHospitalModal: (index: number) => void;
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
  permissionType,
  openEditModal,
  openEditHospitalModal,
  removeHospital,
}) => (
  <IonContent color="tertiary" fullscreen>
    <ShootingBasicInfo
      shootingInfo={shootingData.shotingInfo}
      updateShootingTime={updateShootingTime}
      permissionType={permissionType}
    />
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}
    >
      <div className="section-wrapper">
        <div>
          <LocationsSection
            locations={shootingData.shotingInfo.locations}
            open={openLocations}
            setOpen={setOpenLocations}
            editMode
            setEditMode={setLocationsEditMode}
            onAddClick={openMapModal}
            removeLocation={removeLocation}
            permissionType={permissionType}
            openEditModal={openEditModal}
          />
        </div>
      </div>
      <div className="section-wrapper">
        <div>
          <HospitalsSection
            hospitals={shootingData.shotingInfo.hospitals}
            open={openHospitals}
            setOpen={setOpenHospitals}
            editMode
            onAddClick={openHospitalsMapModal}
            permissionType={permissionType}
            openEditModal={openEditHospitalModal}
            removeHospital={removeHospital}
            setEditMode={() => true}
          />
        </div>
      </div>
      <div className="section-wrapper">
        <AdvanceCallsSection
          advanceCalls={shootingData.shotingInfo.advanceCalls}
          open={openadvanceCalls}
          setOpen={setOpenAdvanceCalls}
          editMode={true}
          setEditMode={() => true}
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
);

export default InfoView;
