import { useRef } from 'react';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { VscEdit } from 'react-icons/vsc';
import { LocationInfo } from '../../../../interfaces/shooting.types';
import InputAlert from '../../../../Layouts/InputAlert/InputAlert';
import generateLocationLink from '../../../../utils/getLocationLink';
import truncateString from '../../../../utils/truncateString';
import OutlinePrimaryButton from '../../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import { Section } from '../../../Shared/Section/Section';

interface LocationsSectionProps {
  locations: LocationInfo[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
  removeLocation: (location: LocationInfo, locationIndex: number) => void;
  permissionType?: number | null;
  openEditModal: (index: number) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  locations,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  removeLocation,
  permissionType,
  openEditModal,
}) => {
  const alertRef: any = useRef(null);

  const openAlert = () => {
    alertRef.current?.present();
  };

  return (
    <Section
      title="Locations"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      onAddClick={onAddClick}
      permissionType={permissionType}
    >
      {locations.length > 0 ? (
        locations.map((location, locationIndex) => (
          <div key={location.lat + location.lng} className="ion-padding-start location-info-grid" style={{ width: '100%' }}>
            <InputAlert
              handleOk={() => removeLocation(location, locationIndex)}
              header="Delete Location"
              message={`Are you sure you want to delete ${location.locationName}?`}
              ref={alertRef}
              inputs={[]}
            />
            <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
              <b>
                {truncateString(location.locationName.toUpperCase(), 50)}
              </b>
            </h5>
            <div className="location-address">
              <p>
                {truncateString(location.locationAddress.toUpperCase(), 50)}
                <br />
                <a href={generateLocationLink(location.lat, location.lng)} target="_blank" rel="noreferrer">
                  <b> GOOGLE MAP LINK</b>
                </a>
              </p>
            </div>
            <div className="ion-flex-column location-buttons">
              {editMode && <VscEdit className="edit-location" onClick={() => openEditModal(locationIndex)} />}
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
