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
} from '@ionic/react';
import {
  useCallback,
  useEffect, useRef, useState,
} from 'react';
import environment from '../../../../environment';
import AppLoader from '../../../hooks/Shared/AppLoader';
import { LocationInfo } from '../../../interfaces/shooting.types';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      setLocationName(selectedLocation.locationName);
      setLocationTypeId(selectedLocation.locationTypeId);
      setLocationAddress(selectedLocation.locationAddress);
      setLat(parseFloat(selectedLocation.lat));
      setLng(parseFloat(selectedLocation.lng));
      setSearchTerm(selectedLocation.locationAddress);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (isOpen && mapRef.current && !map) {
      initMap();
    }
  }, [isOpen, map]);

  const initMap = () => {
    const initialLocation = { lat: selectedLocation ? parseFloat(selectedLocation.lat) : 33.6, lng: selectedLocation ? parseFloat(selectedLocation.lng) : -117.9 };
    const newMap = new google.maps.Map(mapRef.current!, {
      center: initialLocation,
      zoom: selectedLocation ? 15 : 8,
    });

    setMap(newMap);

    const newMarker = new google.maps.Marker({
      position: initialLocation,
      map: newMap,
      draggable: true,
    });

    setMarker(newMarker);

    newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
      updateMarker(event.latLng!);
    });

    newMarker.addListener('dragend', () => {
      updateMarker(newMarker.getPosition()!);
    });

    if (selectedLocation) {
      updateMarker(new google.maps.LatLng(parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lng)));
    }
  };

  const updateMarker = (latLng: google.maps.LatLng) => {
    if (marker && map) {
      marker.setPosition(latLng);
      map.panTo(latLng);
      setLat(latLng.lat());
      setLng(latLng.lng());
      updateAddress(latLng);
    }
  };

  const updateAddress = (latLng: google.maps.LatLng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const address = results[0].formatted_address;
        setCurrentAddress(address);
        setSearchTerm(address);
        setLocationAddress(address);

        const postalCode = results[0].address_components.find((component: any) => component.types.includes('postal_code'));
        if (postalCode) {
          setLocationPostalCode(postalCode.long_name);
        }
      } else {
        setCurrentAddress('Address not found');
        setSearchTerm('');
        setLocationAddress('');
        setLocationPostalCode('');
      }
    });
  };

  const handleCloseModal = () => {
    closeModal();
    setCurrentAddress('');
    setSuggestions([]);
    setSearchTerm('');
    setMarker(null);
    setMap(null);
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

  const geocodeAddress = (address: string) => {
    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: address }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  };

  const debouncedGeocodeAddress = useCallback(debounce(geocodeAddress, 300), []);

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    if (map) {
      const placesService = new google.maps.places.PlacesService(map);
      placesService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
          updateMarker(place.geometry.location);
          setSearchTerm(place.formatted_address || '');
          setSuggestions([]);
        }
      });
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
      await onSubmit(formData);
      // ... (reset form fields)
      closeModal();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCloseModal} className="general-modal-styles" color="tertiary">
      <IonHeader>
        {/* <IonToolbar color="tertiary">
          <IonTitle>Map</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCloseModal}>Close</IonButton>
          </IonButtons>
        </IonToolbar> */}
      </IonHeader>
      <IonContent color="tertiary">
        <div style={{
          minHeight: '400px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
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
                label={errors.locationName ? 'REQUIRED LOCATION *' : 'Location Name'}
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
                    {suggestion.description}
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
