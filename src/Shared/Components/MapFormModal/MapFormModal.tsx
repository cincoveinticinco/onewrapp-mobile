import { GoogleMap } from '@capacitor/google-maps';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  useIonViewWillLeave,
} from '@ionic/react';
import {
  useCallback,
  useEffect, useRef, useState,
} from 'react';
import environment from '../../../../environment';
import AppLoader from '../../hooks/AppLoader';
import { LocationInfo } from '../../types/shooting.types';
import CustomSelect from '../CustomSelect/CustomSelect';
import OutlinePrimaryButton from '../OutlinePrimaryButton/OutlinePrimaryButton';

interface MapFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (formData: Partial<LocationInfo>) => void;
  hospital?: boolean;
  selectedLocation?: LocationInfo | null;
}

const MapFormModal: React.FC<MapFormModalProps> = ({
  isOpen, closeModal, onSubmit, hospital, selectedLocation,
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (selectedLocation) {
      setLocationName(selectedLocation.locationName || '');
      setLocationTypeId(selectedLocation.locationTypeId ?? (hospital ? 3 : null));
      setLocationAddress(selectedLocation.locationAddress || '');
      setLat(parseFloat(selectedLocation.lat || '0'));
      setLng(parseFloat(selectedLocation.lng || '0'));
      setSearchTerm(selectedLocation.locationAddress || '');
    } else {
      setLocationName('');
      setLocationTypeId(hospital ? 3 : null);
      setLocationAddress('');
      setLat(null);
      setLng(null);
      setSearchTerm('');
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (isOpen && !mapInitialized) {
      setTimeout(() => {
        createMap();
      }, 300);
    } else if (map && lat && lng) {
      updateMarker(lat, lng);
    }
  }, [isOpen, mapInitialized, map, lat, lng]);

  const createMap = async () => {
    if (!mapRef.current) return;

    try {
      const newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: {
            lat: selectedLocation && selectedLocation.lat ? parseFloat(selectedLocation.lat) : 33.6,
            lng: selectedLocation && selectedLocation.lng ? parseFloat(selectedLocation.lng) : -117.9,
          },
          zoom: selectedLocation ? 15 : 8,
        },
      });
      setMap(newMap);
      setMapInitialized(true);

      await newMap.setOnMapClickListener((event) => {
        updateMarker(event.latitude, event.longitude);
      });

      if (selectedLocation) {
        if (selectedLocation.lat && selectedLocation.lng) {
          updateMarker(parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lng));
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const updateMarker = async (latitude: number, longitude: number) => {
    if (map) {
      if (marker) {
        await map.removeMarker(marker);
      }

      const newMarker = await map.addMarker({
        coordinate: {
          lat: latitude,
          lng: longitude,
        },
        draggable: true,
      });

      setMarker(newMarker);
      setLat(latitude);
      setLng(longitude);

      await map.setOnMarkerDragEndListener(async (event) => {
        updateMarker(event.latitude, event.longitude);
      });

      // Use Capacitor's Geocoding API instead of Google Maps JavaScript API
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${environment.MAPS_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results && data.results[0]) {
          const address = data.results[0].formatted_address;
          setCurrentAddress(address);
          setSearchTerm(address);
          setLocationAddress(address);

          const postalComponent = data.results[0].address_components.find(
            (component: any) => component.types.includes('postal_code')
          );
          if (postalComponent) {
            setLocationPostalCode(postalComponent.long_name);
          }
        } else {
          setCurrentAddress('Address not found');
          setSearchTerm('');
          setLocationAddress('');
          setLocationPostalCode('');
        }
      } catch (error) {
        console.error('Error getting address:', error);
        setCurrentAddress('Error getting address');
        setSearchTerm('');
        setLocationAddress('');
        setLocationPostalCode('');
      }
    }
  };

  const handleCloseModal = () => {
    setMapInitialized(false);
    setCurrentAddress('');
    setSuggestions([]);
    setSearchTerm('');
    setMarker(null);
    setMap(null);
    setLocationName('');
    setLocationTypeId(hospital ? 3 : null);
    setLocationAddress('');
    setLat(null);
    setLng(null);
    destroyMap();
    closeModal();
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
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${environment.MAPS_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.results || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setSuggestions([]);
    }
  };

  const debouncedGeocodeAddress = useCallback(debounce(geocodeAddress, 300), []);

  const handleSuggestionClick = async (suggestion: any) => {
    if (map) {
      const location = suggestion.geometry.location;
      await map.setCamera({
        coordinate: {
          lat: location.lat,
          lng: location.lng,
        },
        zoom: 15,
        animate: true,
      });
      setSearchTerm(suggestion.formatted_address);
      setSuggestions([]);
      updateMarker(location.lat, location.lng);
    }
  };

  const selectOptions = [
    { value: 1, label: 'Location' },
    { value: 2, label: 'Basecamp' },
    { value: 4, label: 'Pickup' },
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!locationName.trim()) {
      newErrors.locationName = 'Location name is required';
    }

    if (!hospital && !locationTypeId) {
      newErrors.locationType = 'Location type is required';
    }

    if (!locationAddress.trim()) {
      newErrors.locationAddress = 'Address is required';
    }

    if (!locationPostalCode.trim()) {
      newErrors.locationPostalCode = 'Postal code is required';
    }

    if (!lat || !lng) {
      newErrors.location = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData: Partial<LocationInfo> = {
        locationTypeId: hospital ? 3 : locationTypeId!,
        locationName,
        locationAddress,
        locationPostalCode,
        lat: lat!.toString(),
        lng: lng!.toString(),
      };
      onSubmit(formData);
      setTimeout(() => {
        handleCloseModal();
      }, 500);
    }
  };

  const destroyMap = async () => {
    if (map) {
      await map.destroy();
  }}

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCloseModal} className="general-modal-styles" color="tertiary">
      <IonHeader />
      <IonContent color="tertiary">
        <div style={{
          minHeight: '400px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
        >
          {!map && AppLoader()}
          <capacitor-google-map
            ref={mapRef}
            style={{
              display: 'inline-block',
              width: '100%',
              height: '400px',
            }}
          />
        </div>

        <h1 style={{ width: '100%', textAlign: 'center' }}>{hospital ? 'NEAREST HOSPITAL' : 'NEW LOCATION'}</h1>
        <IonGrid style={{ width: '400px' }}>
          <IonRow>
            <IonCol size="6">
              <IonInput
                value={locationName}
                onIonInput={(e) => setLocationName((e.target as any).value)}
                className={`${errors.locationName ? 'ion-invalid' : ''}`}
                labelPlacement="floating"
                label={errors.locationName ? 'REQUIRED *' : hospital ? 'NAME' : 'LOCATION NAME'}
                placeholder={errors.locationName ? 'Location Name' : ''}
                required
              />
            </IonCol>
            <IonCol size="12" style={hospital ? { display: 'none' } : {}}>
              <CustomSelect
                input={{
                  label: errors.locationType ? 'REQUIRED TYPE *' : 'LOCATION TYPE',
                  fieldKeyName: 'location_type_id',
                  selectOptions,
                  placeholder: errors.locationType ? 'Location Type' : 'Tipo de ubicación',
                  value: locationTypeId,
                }}
                setNewOptionValue={(fieldKeyName: string, value: string) => setLocationTypeId(parseInt(value, 10))}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonInput
                value={searchTerm}
                onIonInput={handleInputChange}
                className={`${errors.locationAddress ? 'ion-invalid' : ''}`}
                labelPlacement="floating"
                label={errors.locationAddress ? 'REQUIRED ADDRESS *' : 'Address'}
                placeholder={errors.locationAddress ? 'Address' : ''}
                required
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
            <IonCol size="12" className="ion-flex-column ion-align-items-center">
              <OutlinePrimaryButton
                onClick={handleSubmit}
                buttonName="Save"
                style={{ marginTop: '50px', maxHeight: '30px' }}
                color="success"
              />
              <IonButton onClick={closeModal} className="clear-danger-button">
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