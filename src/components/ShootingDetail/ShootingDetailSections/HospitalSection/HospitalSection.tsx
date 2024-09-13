import { VscEdit } from 'react-icons/vsc';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { LocationInfo } from '../../../../interfaces/shooting.types';
import { Section } from '../../../Shared/Section/Section';
import OutlinePrimaryButton from '../../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import truncateString from '../../../../utils/truncateString';

interface HospitalsSectionProps {
  hospitals: LocationInfo[];
  open: boolean;
  setOpen: (open: boolean) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  onAddClick: () => void;
  removeHospital: (hospital: LocationInfo, index: number) => void;
  permissionType?: number | null;
  openEditModal: (index: number) => void;
}

export const HospitalsSection: React.FC<HospitalsSectionProps> = ({
  hospitals,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  removeHospital,
  permissionType,
  openEditModal,
}) => (
  <Section
    title="Near Hospitals"
    open={open}
    setOpen={() => true}
    editMode={editMode}
    onAddClick={onAddClick}
    permissionType={permissionType}
  >
    {hospitals.length > 0 ? (
      hospitals.map((hospital, hospitalIndex) => (
        <div key={hospital.lat + hospital.lng} className="ion-padding-start location-info-grid" style={{ width: '100%' }}>
          <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
            <b>{truncateString(hospital.locationName.toUpperCase(), 50)}</b>
          </h5>
          <div className="location-address">
            <p>{truncateString(hospital.locationAddress.toUpperCase(), 50)}</p>
          </div>
          <div className="ion-flex-column location-buttons">
            {editMode && <VscEdit className="edit-location" onClick={() => openEditModal(hospitalIndex)} />}
            {editMode && <PiTrashSimpleLight className="delete-location" onClick={() => removeHospital(hospital, hospitalIndex)} />}
          </div>
        </div>
      ))
    ) : (
      <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{ height: '100%', width: '100%' }}>
        <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1} />
      </div>
    )}
  </Section>
);
