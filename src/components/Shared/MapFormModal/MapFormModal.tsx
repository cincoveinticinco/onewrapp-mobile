import { GoogleMap } from '@capacitor/google-maps';
import {
  useEffect, useRef, useState, useCallback,
} from 'react';
import {
  IonButton, IonContent, IonHeader, IonModal, IonInput, IonList, IonItem, IonGrid, IonRow, IonCol,
} from '@ionic/react';
import environment from '../../../../environment';
import CustomSelect from '../CustomSelect/CustomSelect';
import { LocationInfo } from '../../../interfaces/shooting.types';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';
import useLoader from '../../../hooks/Shared/useLoader';

interface MapFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (formData: Partial<LocationInfo>) => void;
  hospital?: boolean;
  editLocation?: Partial<LocationInfo>;
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

const MapFormModal: React.FC<MapFormModalProps> = ({
  isOpen, closeModal, onSubmit, hospital, editLocation,
}) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [marker, setMarker] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationPostalCode, setLocationPostalCode] = useState('');
  const [locationTypeId, setLocationTypeId] = useState<number | null>(hospital ? 3 : null);
  const [locationAddress, setLocationAddress] = useState('');

  useEffect(() => {
    if (editLocation) {
      setLocationName(editLocation.locationName || '');
      setLocationTypeId(editLocation.locationTypeId || null);
      setLocationAddress(editLocation.locationAddress || '');
      setLocationPostalCode(editLocation.locationPostalCode || '');
      setLat(editLocation.lat ? parseFloat(editLocation.lat) : null);
      setLng(editLocation.lng ? parseFloat(editLocation.lng) : null);
      setSearchTerm(editLocation.locationAddress || '');
    }
  }, [editLocation]);

  useEffect(() => {
    if (isOpen && !mapInitialized) {
      setTimeout(() => {
        createMap();
      }, 300);
    } else if (map && lat && lng) {
      addMarker(lat, lng);
    }
  }, [isOpen, mapInitialized, lat, lng]);

  const createMap = async () => {
    if (!mapRef.current) return;

    try {
      const newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: {
            lat: lat || 33.6,
            lng: lng || -117.9,
          },
          zoom: 8,
        },
      });
      setMap(newMap);
      setMapInitialized(true);

      await newMap.setOnMapClickListener((event) => {
        addMarker(event.latitude, event.longitude);
      });

      if (lat && lng) {
        addMarker(lat, lng);
      }
    } catch (error) {
      console.error('Error creating map:', error);
    }
  };

  const addMarker = async (lat: number, lng: number) => {
    if (map) {
      if (marker) {
        await map.removeMarker(marker);
      }

      const markerOptions: any = {
        coordinate: {
          lat,
          lng,
        },
        draggable: true,
      };

      const newMarker = await map.addMarker(markerOptions);

      setMarker(newMarker);
      setLat(lat);
      setLng(lng);

      await map.setOnMarkerDragEndListener(async (event) => {
        updateAddress(event.latitude, event.longitude);
      });

      updateAddress(lat, lng);
    }
  };

  const updateAddress = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        if (results[0]) {
          setCurrentAddress(results[0].formatted_address);
          setSearchTerm(results[0].formatted_address);
          setLocationAddress(results[0].formatted_address);

          const postalCode = results[0].address_components.find((component: any) => component.types.includes('postal_code'));
          if (postalCode) {
            setLocationPostalCode(postalCode.long_name);
          }
        } else {
          setCurrentAddress('Dirección no encontrada');
          setSearchTerm('');
          setLocationAddress('');
          setLocationPostalCode('');
        }
      } else {
        console.error(`Geocoder failed due to: ${status}`);
        setCurrentAddress('Error al obtener la dirección');
        setSearchTerm('');
        setLocationAddress('');
        setLocationPostalCode('');
      }
    });
  };

  const handleCloseModal = () => {
    setMapInitialized(false);
    closeModal();
    resetForm();
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value) {
      debouncedGeocodeAddress(value);
    } else {
      setSuggestions([]);
    }
  };

  const geocodeAddress = async (address: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        setSuggestions(results || []);
      } else {
        setSuggestions([]);
      }
    });
  };

  const debouncedGeocodeAddress = useCallback(debounce(geocodeAddress, 300), []);

  const handleSuggestionClick = async (suggestion: any) => {
    if (map) {
      const { location } = suggestion.geometry;
      await map.setCamera({
        coordinate: {
          lat: location.lat(),
          lng: location.lng(),
        },
        zoom: 15,
        animate: true,
      });
      setSearchTerm(suggestion.formatted_address);
      setSuggestions([]);
      addMarker(location.lat(), location.lng());
    }
  };

  const handleSubmit = async () => {
    if (lat && lng && locationName && locationTypeId && locationAddress && locationPostalCode) {
      const formData: Partial<LocationInfo> = {
        locationTypeId: hospital ? 3 : locationTypeId,
        locationName: locationName,
        locationAddress: locationAddress,
        locationPostalCode: locationPostalCode,
        lat: lat.toString(),
        lng: lng.toString(),
      };
      await onSubmit(formData);
      resetForm();
      closeModal();
    }
  };

  const resetForm = () => {
    setLocationTypeId(null);
    setLocationName('');
    setLocationAddress('');
    setLocationPostalCode('');
    setLat(null);
    setLng(null);
    setSearchTerm('');
    setCurrentAddress('');
    setSuggestions([]);
    setMarker(null);
    setMapInitialized(false);
  };

  const selectOptions = [
    { value: 1, label: 'Location' },
    { value: 2, label: 'Basecamp' },
    { value: 4, label: 'Pickup' },
  ];

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCloseModal} className="general-modal-styles" color="tertiary">
      <IonHeader>
      </IonHeader>
      <IonContent color="tertiary">
        {!map && useLoader()}
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: 'inline-block',
            width: '100%', 
            height: '400px',
          }}
        />
        <h1 style={{width: '100%', textAlign: 'center'}}>
          {hospital ? 'NEAREST HOSPITAL' : editLocation ? 'EDIT LOCATION' : 'NEW LOCATION'}
        </h1>
        <IonGrid style={{width: '400px'}}>
          <IonRow>
            <IonCol size="6">
              <IonInput
                value={locationName}
                onIonInput={(e) => setLocationName((e.target as any).value)}
                className="input-item"
                labelPlacement="floating"
                label="Location name"
              />
            </IonCol>
            <IonCol size="12" style={hospital ? { display: 'none' } : {}}>
              <CustomSelect
                input={{
                  label: 'LOCATION TYPE',
                  fieldKeyName: 'location_type_id',
                  selectOptions,
                  placeholder: 'Tipo de ubicación',
                }}
                setNewOptionValue={(fieldKeyName: string, value: string) => setLocationTypeId(parseInt(value))}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonInput
                label="Address"
                value={searchTerm}
                onIonInput={handleInputChange}
                labelPlacement="floating"
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonList color="tertiary" style={{ background: 'var(--ion-color-tertiary)' }}>
                {suggestions.map((suggestion, index) => (
                  <IonItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.formatted_address}
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" className='ion-flex-column ion-align-items-center'>
              <OutlinePrimaryButton 
                onClick={handleSubmit} 
                buttonName={editLocation ? "Update" : "Save"} 
                style={{ marginTop: '50px', maxHeight: '30px' }}
                color='success'
              />
              <IonButton fill='clear' color='light' onClick={closeModal}>
                CANCEL
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default MapFormModal;