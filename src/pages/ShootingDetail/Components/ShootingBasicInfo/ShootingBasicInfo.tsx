import {
  IonCol, IonGrid, IonRow,
  useIonViewDidEnter,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { VscEdit } from 'react-icons/vsc';
import useIsMobile from '../../../../Shared/hooks/useIsMobile';
import { LocationInfo } from '../../../../Shared/types/shooting.types';
import getHourMinutesFomISO from '../../../../Shared/Utils/getHoursMinutesFromISO';
import separateTimeOrPages from '../../../../Shared/Utils/SeparateTimeOrPages';
import EditionModal from '../../../../Shared/Components/EditionModal/EditionModal';
import GoogleMapComponent from '../../../../Shared/Components/GoogleMapComponent/GoogleMapComponent';
import './ShootingBasicInfo.scss';
import { GoogleMap } from '@capacitor/google-maps';
import environment from '../../../../../environment';

interface EditableFieldProps {
  field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut' | 'rehearsalStart' | 'rehearsalEnd' | 'shootStart' | 'shootEnd' | 'estimatedSeconds';
  value: string;
  title: string;
  withSymbol: boolean;
  permissionType?: number | null;
  updateShootingTime: (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut' | 'rehearsalStart' | 'rehearsalEnd' | 'shootStart' | 'shootEnd' | 'estimatedSeconds', time: string) => void;
  editMode?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  field,
  value,
  title,
  withSymbol,
  permissionType,
  updateShootingTime,
  editMode = true,
}) => {
  const editionModalRef = useRef<HTMLIonModalElement>(null);
  const { main, symbol } = separateTimeOrPages(value);

  const handleEdit = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  const handleEdition = (formData: { time: string }) => {
    updateShootingTime(field, formData.time);
  };

  const editionInputs = [
    {
      fieldKeyName: 'time',
      label: 'Time',
      placeholder: 'Enter time',
      type: 'time',
      required: true,
      offset: '3',
    },
  ];

  return (
    <>
      <ShootingInfoLabels
        info={withSymbol ? main : getHourMinutesFomISO(value, true)}
        symbol={withSymbol ? symbol : ''}
        title={title}
        onEdit={handleEdit}
        isEditable={permissionType === 1 && editMode}
      />
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger={`open-edit-time-modal-${field}`}
        title={`Edit ${field === 'estimatedSeconds' ? 'Estimated Time' : field === 'shootStart' ? 'Shoot Start' : field === 'shootEnd' ? 'Shoot End' : field === 'rehearsalStart' ? 'Rehearsal Start' : field === 'rehearsalEnd' ? 'Rehearsal End' : field === 'generalCall' ? 'General Call' : field === 'onSet' ? 'Ready to Shoot' : field === 'estimatedWrap' ? 'Estimated Wrap' : field === 'wrap' ? 'Wrap' : 'Last Out'}`}
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={{
          time: getHourMinutesFomISO(value),
        }}
        modalId={`edit-time-modal-${field}`}
      />
    </>
  );
};

interface ShootingInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

export const ShootingInfoLabels: React.FC<ShootingInfoLabelsProps> = ({
  info, title, symbol, onEdit, isEditable,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="shooting-label-grid">
      <p className="ion-no-margin ion-flex label-info">
        <b>{info.toUpperCase()}</b>
        {symbol && <span className="symbol-part">{symbol}</span>}
      </p>
      {isEditable && (
        <VscEdit onClick={onEdit} className="label-button" />
      )}
      <p className="ion-no-margin labels-title">
        {title.toUpperCase()}
      </p>
    </div>
  );
};

interface ShootingBasicInfoProps {
  shootingInfo: {
    generalCall: string;
    onSet: string;
    estimatedWrap: string;
    wrap: string;
    lastOut: string;
    sets: number;
    scenes: number;
    pages: string;
    min: string;
    locations: LocationInfo[];
    hospitals: LocationInfo[];
    protectedScenes: number;
  };
  mapRef: React.RefObject<HTMLDivElement>;
  permissionType?: number | null;
  updateShootingAllTimes: (numberOfHours: number) => any;
  updateShootingTime: (field: 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut' | 'rehearsalStart' | 'rehearsalEnd' | 'shootStart' | 'shootEnd' | 'estimatedSeconds', time: string) => void;
}

const ShootingBasicInfo: React.FC<ShootingBasicInfoProps> = ({ shootingInfo, updateShootingTime, permissionType, mapRef, updateShootingAllTimes }) => {
  const [editingField, setEditingField] = useState<'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut' | 'rehearsalStart' | 'rehearsalEnd' | 'shootStart' | 'shootEnd' | 'estimatedSeconds' | null>(null);
  const [firstLocationLat, setFirstLocationLat] = useState<number | undefined>(undefined);
  const [firstLocationLng, setFirstLocationLng] = useState<number | undefined>(undefined);
  const editionModalRef = useRef<HTMLIonModalElement>(null);

  const [map, setMap] = useState<GoogleMap | null>(null);
  const [marker, setMarker] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useIonViewDidEnter(() => {
    if (shootingInfo.locations.length > 0 && mapRef.current) {
      const lat = shootingInfo.locations[0].lat ? parseFloat(shootingInfo.locations[0].lat) : 0;
      const lng = shootingInfo.locations[0].lng ? parseFloat(shootingInfo.locations[0].lng) : 0;

      if (!mapInitialized) {
        createMap(lat, lng);
      } else if (map) {
        updateMarker(lat, lng);
      }
    }
  });

  const createMap = async (lat: number, lng: number) => {
    if (!mapRef.current) return;

    try {
      const newMap = await GoogleMap.create({
        id: 'shooting-basic-info-map',
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: { lat, lng },
          zoom: 15,
        },
      });
      setMap(newMap);
      setMapInitialized(true);

      await newMap.setOnMapClickListener((event) => {
        updateMarker(event.latitude, event.longitude);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateMarker = async (latitude: number, longitude: number) => {
    if (map) {
      if (marker) {
        await map.removeMarker(marker);
      }

      let newMarker;
      try {
        newMarker = await map.addMarker({
          coordinate: { lat: latitude, lng: longitude },
          draggable: true,
        });
      } catch (error) {
        console.error('Error adding marker, retrying:', error);
        newMarker = await map.addMarker({
          coordinate: { lat: latitude, lng: longitude },
          draggable: true,
        });
      }

      setMarker(newMarker);

      await map.setOnMarkerDragEndListener(async (event) => {
        updateMarker(event.latitude, event.longitude);
      });
    }
  };

  useEffect(() => {
    if (shootingInfo.locations.length > 0) {
      setFirstLocationLat(shootingInfo.locations[0].lat ? parseFloat(shootingInfo.locations[0].lat) : 0);
      setFirstLocationLng(shootingInfo.locations[0].lng ? parseFloat(shootingInfo.locations[0].lng) : 0);
    }
  }, [shootingInfo.locations]);

  const handleEdition = (formData: { time: string }) => {
    if (editingField) {
      updateShootingTime(editingField, formData.time);
    }
    setEditingField(null);
  };

  const editionInputs = [
    {
      fieldKeyName: 'time',
      label: 'Time',
      placeholder: 'Enter time',
      type: 'time',
      required: true,
      offset: '3',
    },
  ];

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol sizeSm="10" sizeXs='12'>
          {
            shootingInfo.locations.length > 0 && firstLocationLat && firstLocationLng ? (
              <div className="map-container">
                <GoogleMapComponent
                  locations={[...shootingInfo.locations.map(loc => ({ ...loc, locationTypeId: loc.locationTypeId ?? 0, locationName: loc.locationName ?? '' })), ...shootingInfo.hospitals.map(hosp => ({ ...hosp, locationTypeId: hosp.locationTypeId ?? 0, locationName: hosp.locationName ?? '' }))]}
                  mapRef={mapRef}
                />
              </div>
            ) : (
              <div className="map-container ion-flex ion-justify-content-center ion-align-items-center">
                <p> PLEASE ADD LOCATION TO LOAD MAP</p>
              </div>
            )
          }
        </IonCol>
        <IonCol sizeSm='2' sizeXs='12'>
          <IonRow>
            <IonCol sizeSm="12" sizeXs="4" className="ion-padding">
              <EditableField
                field="generalCall"
                value={shootingInfo.generalCall}
                title="General Call"
                withSymbol={false}
                permissionType={permissionType}
                updateShootingTime={updateShootingTime}
              />
            </IonCol>
            <IonCol sizeSm="12" sizeXs="4" className="ion-padding">
              <EditableField
                field="onSet"
                value={shootingInfo.onSet}
                title="Ready to Shoot"
                withSymbol={false}
                permissionType={permissionType}
                updateShootingTime={updateShootingTime}
              />
            </IonCol>
            <IonCol sizeSm="12" sizeXs="4" className="ion-padding">
              <EditableField
                field="estimatedWrap"
                value={shootingInfo.estimatedWrap}
                title="Estimated Wrap"
                withSymbol={false}
                permissionType={permissionType}
                updateShootingTime={updateShootingTime}
              />
            </IonCol>
            <IonCol sizeSm="12" sizeXs="12" className="ion-padding ion-flex ion-justify-content-center ion-align-items-center">
              <p style={{ textAlign: 'center' }}><b>NO WEATHER AVAILABLE</b></p>
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="12">
          <IonRow class="ion-justify-content-between">
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.scenes.toString()} title="Scenes" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.protectedScenes.toString()} title="Protections" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={separateTimeOrPages(shootingInfo.pages).main} symbol={separateTimeOrPages(shootingInfo.pages).symbol} title="Pages" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={separateTimeOrPages(shootingInfo.min).main} symbol={separateTimeOrPages(shootingInfo.min).symbol} title="Minutes" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.locations.length.toString()} title="Locations" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info={shootingInfo.sets.toString()} title="Sets" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info="0" title="Script Days" />
            </IonCol>
            <IonCol size="auto">
              <ShootingInfoLabels info="0" title="Extras" />
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger={`open-edit-time-modal-${editingField}`}
        title={`Edit ${editingField}`}
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={{
          time: editingField ? getHourMinutesFomISO(shootingInfo[editingField as 'generalCall' | 'onSet' | 'estimatedWrap' | 'wrap' | 'lastOut']) : '',
        }}
        modalId={`edit-time-modal-${editingField}`}
      />
    </IonGrid>
  );
};

export default ShootingBasicInfo;
