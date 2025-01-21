import React from 'react';
import useIsMobile from '../../../../hooks/Shared/useIsMobile';
import { LocationInfo, Meal } from '../../../../interfaces/shooting.types';
import CallSheet from '../../../../pages/CallSheet/CallSheet';
import { FormInput } from '../../../Shared/EditionModal/EditionModal';
import { Section } from '../../../Shared/Section/Section';
import ShootingBasicInfo from '../../ShootingBasicInfo/ShootingBasicInfo';
import { AdvanceCallsSection } from '../../ShootingDetailSections/AdvanceCallsSection/AdvanceCallsSection';
import { HospitalsSection } from '../../ShootingDetailSections/HospitalSection/HospitalSection';
import { LocationsSection } from '../../ShootingDetailSections/LocationsSection/LocationsSections';
import { MealsSection } from '../../ShootingDetailSections/MealsSection/MealsSection';
import ScriptReportView from '../ScriptReportView/ScriptReportView';
import './WrapReportView.css';
import { mergedSceneShoot, ShootingDataProps } from '../../../../pages/ShootingDetail/types/ShootingDetail.types';

interface WrapReportViewProps {
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
  mergedScenesShoot: mergedSceneShoot[]
  editMode: boolean
  setMergedScenesShoot: (mergedScenesShoot: mergedSceneShoot[]) => void
  saveScriptReport: () => void
  permissionType?: number | null
  openEditLocationModal: (index: number) => void
  openEditHospitalModal: (index: number) => void
  removeHospital: (hospital: LocationInfo, hospitalIndex: number) => void
  updateShootingAllTimes: any
}

const WrapReportView: React.FC<WrapReportViewProps> = ({
  shootingData,
  updateShootingTime,
  setOpenLocations,
  openLocations,
  setLocationsEditMode,
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
  handleEditMeal,
  mergedScenesShoot,
  setMergedScenesShoot,
  saveScriptReport,
  permissionType,
  openEditLocationModal,
  openEditHospitalModal,
  removeHospital,
  updateShootingAllTimes
}) => {
  const [openScenes, setOpenScenes] = React.useState(true);
  const [scriptReportEditMode, setScriptReportEditMode] = React.useState(false);
  const mapRef = React.useRef(null);
  return (
    <div className="wrap-report-view" style={{ gridTemplateColumns: useIsMobile() ? '1fr' : '1fr 1fr' }}>
      <div className="section-wrapper scenes-table">
        <div>
          <ShootingBasicInfo
            shootingInfo={shootingData.shotingInfo}
            updateShootingTime={updateShootingTime}
            permissionType={permissionType}
            mapRef={mapRef}
            updateShootingAllTimes={updateShootingAllTimes}
          />
        </div>
      </div>
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
            openEditModal={openEditLocationModal}
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
            openEditModal={openEditHospitalModal}
            removeHospital={removeHospital}
            editMode
            setEditMode={() => true}
          />
        </div>
      </div>
      <div className="section-wrapper">
        <div>
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
      </div>
      <div className="section-wrapper">
        <div>
          <MealsSection
            meals={shootingData.shotingInfo.meals}
            open={openMeals}
            setOpen={setOpenMeals}
            editMode={mealsEditMode}
            setEditMode={setMealsEditMode}
            onAddClick={openMealModal}
            getHourMinutesFomISO={getHourMinutesFomISO}
            deleteMeal={deleteMeal}
            handleEditMeal={handleEditMeal}
            permissionType={permissionType}
          />
        </div>
      </div>
      <div className="section-wrapper scenes-table">
        <div>
          <Section
            title="Scenes"
            open={openScenes}
            setOpen={setOpenScenes}
            editMode={scriptReportEditMode}
            setEditMode={setScriptReportEditMode}
            onAddClick={() => {}}
            saveAfterEdit
            saveFunction={saveScriptReport}
            permissionType={permissionType}
          >
            <ScriptReportView
              mergedScenesShoot={mergedScenesShoot}
              editMode={scriptReportEditMode}
              setMergedScenesShoot={setMergedScenesShoot}
              permissionType={permissionType}
            />
          </Section>
        </div>
      </div>
      <div className="section-wrapper scenes-table">
        <div>
          <div>
            <CallSheet isSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapReportView;
