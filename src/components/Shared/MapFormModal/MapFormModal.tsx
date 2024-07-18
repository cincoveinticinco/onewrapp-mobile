import { GoogleMap } from '@capacitor/google-maps';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar,
  IonSpinner, IonInput, IonList, IonItem, IonGrid, IonRow, IonCol
} from '@ionic/react';
import environment from '../../../../environment';
import CustomSelect from '../CustomSelect/CustomSelect';
import './MapFormModal.scss'; // Import the CSS file for additional styles if needed
import { LocationInfo } from '../../../interfaces/shootingTypes';

interface MapFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (formData: Partial<LocationInfo>) => void;
}

const MapFormModal: React.FC<MapFormModalProps> = ({ isOpen, closeModal, onSubmit }) => {
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
  const [locationTypeId, setLocationTypeId] = useState<number | null>(null);
  const [locationAddress, setLocationAddress] = useState('');

  useEffect(() => {
    if (isOpen && !mapInitialized) {
      setTimeout(() => {
        createMap();
      }, 300);
    }
  }, [isOpen, mapInitialized]);

  const createMap = async () => {
    if (!mapRef.current) return;

    try {
      const newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: {
            lat: 33.6,
            lng: -117.9,
          },
          zoom: 8,
        },
      });
      setMap(newMap);
      setMapInitialized(true);

      await newMap.setOnMapClickListener((event) => {
        addMarker(event.latitude, event.longitude);
      });
    } catch (error) {
      console.error('Error creating map:', error);
    }
  };

  const addMarker = async (lat: number, lng: number) => {
    if (map) {
      if (marker) {
        await map.removeMarker(marker);
      }

      const newMarker = await map.addMarker({
        coordinate: {
          lat: lat,
          lng: lng,
        },
        draggable: true,
      });

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
    const latlng = { lat: lat, lng: lng };

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
        console.error('Geocoder failed due to: ' + status);
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
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      debouncedGeocodeAddress(value);
    } else {
      setSuggestions([]);
    }
  };

  const geocodeAddress = async (address: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
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
      const location = suggestion.geometry.location;
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

  const handleSubmit = () => {
    if(lat && lng && locationName && locationTypeId && locationAddress && locationPostalCode) {
      const formData: Partial<LocationInfo> = {
        location_type_id: locationTypeId,
        location_name: locationName,
        location_address: locationAddress,
        location_postal_code: locationPostalCode,
        lat: lat.toString(),
        lng: lng.toString(),
        location_full_address: currentAddress,
      };
      onSubmit(formData);
      closeModal();
    }
  };

  const selectOptions = [
    { value: 1, label: 'Location' },
    { value: 2, label: 'Basecamp' },
    { value: 4, label: 'Pickup' }
  ];


  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCloseModal} className="general-modal-styles" color='tertiary'>
      <IonHeader>
        <IonToolbar color='tertiary'>
          <IonTitle>Map</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCloseModal}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color='tertiary'>
        {!map && <IonSpinner />}
        <capacitor-google-map ref={mapRef} style={{
          display: 'inline-block',
          width: '100%',
          height: '400px'
        }}></capacitor-google-map>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonInput
                label='Address'
                value={searchTerm}
                onIonInput={handleInputChange}
                labelPlacement='floating'
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonList color='tertiary' style={{ background: 'var(--ion-color-tertiary)' }}>
                {suggestions.map((suggestion, index) => (
                  <IonItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.formatted_address}
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonInput
            
                value={locationName}
                onIonInput={(e) => setLocationName((e.target as any).value)}
                className='input-item'
                labelPlacement='floating'
                label='Location name'
              />
            </IonCol>
            <IonCol size="6">
              <CustomSelect
                input={{
                  label: 'LOCATION TYPE',
                  fieldName: 'location_type_id',
                  selectOptions: selectOptions,
                  placeholder: 'Tipo de ubicación',
                }}
                setNewOptionValue={(fieldName: string, value: string) => setLocationTypeId(parseInt(value))}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonButton expand="full" onClick={handleSubmit}>Submit</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default MapFormModal;
