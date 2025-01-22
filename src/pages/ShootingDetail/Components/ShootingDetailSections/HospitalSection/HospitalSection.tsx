import { useRef } from 'react';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { VscEdit } from 'react-icons/vsc';
import { LocationInfo } from '../../../../../interfaces/shooting.types';
import InputAlert from '../../../../../Layouts/InputAlert/InputAlert';
import generateLocationLink from '../../../../../utils/getLocationLink';
import truncateString from '../../../../../utils/truncateString';
import OutlinePrimaryButton from '../../../../../components/Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import { Section } from '../../../../../components/Shared/Section/Section';

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
}) => {
  const alertRef: any = useRef(null);

  const openAlert = () => {
    alertRef.current?.present();
  };

  return (
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
          <div key={`${hospital.lat ?? ''}${hospital.lng ?? ''}`} className="ion-padding-start location-info-grid" style={{ width: '100%' }}>
            <InputAlert
              handleOk={() => removeHospital(hospital, hospitalIndex)}
              header="Delete Hospital"
              message={`Are you sure you want to delete ${hospital.locationName ?? ''}?`}
              ref={alertRef}
              inputs={[]}
            />
            <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
              <b>{truncateString(hospital.locationName?.toUpperCase() ?? '', 50)}</b>
            </h5>
            <div className="location-address">
              <p>
                {truncateString(hospital.locationAddress?.toUpperCase() ?? '', 50)}
                <br />
                <a href={generateLocationLink(hospital.lat ?? '', hospital.lng ?? '')} target="_blank" rel="noreferrer">
                  <b> GOOGLE MAP LINK</b>
                </a>
              </p>
            </div>
            <div className="ion-flex-column location-buttons">
              {editMode && <VscEdit className="edit-location" onClick={() => openEditModal(hospitalIndex)} />}
              {editMode && <PiTrashSimpleLight className="delete-location" onClick={() => openAlert()} />}
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
};
