import { VscEdit } from 'react-icons/vsc';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { LocationInfo } from '../../../../interfaces/shooting.types';
import { Section } from '../../../Shared/Section/Section';
import OutlinePrimaryButton from '../../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import truncateString from '../../../../utils/truncateString';
import generateLocationLink from '../../../../utils/getLocationLink';

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
}) => (
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
          <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
            <b>
              {truncateString(location.locationName.toUpperCase(), 50)}
            </b>
          </h5>
          <div className="location-address">
            <p>
              {truncateString(location.locationAddress.toUpperCase(), 50)}
              <br></br>
              <a href={generateLocationLink(location.lat, location.lng)} target="_blank" rel="noreferrer">
                <b> GOOGLE MAP LINK</b>
              </a>
            </p>
          </div>
          <div className="ion-flex-column location-buttons">
            {editMode && <VscEdit className="edit-location" onClick={() => openEditModal(locationIndex)} />}
            {editMode && <PiTrashSimpleLight className="delete-location" onClick={() => removeLocation(location, locationIndex)} />}
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
