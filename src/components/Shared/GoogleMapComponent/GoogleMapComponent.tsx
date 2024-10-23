import React, { useCallback, useEffect, useState } from 'react';
import environment from '../../../../environment';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import AppLoader from '../../../hooks/Shared/AppLoader';

interface GoogleMapComponentProps {
  lat: number;
  lng: number;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  lat,
  lng,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (lat && lng) {
      getAddressFromCoordinates(lat, lng);
    }
  }, [lat, lng]);

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${environment.MAPS_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results[0]) {
        const address = data.results[0].formatted_address;
        setCurrentAddress(address);
      } else {
        setCurrentAddress('Address not found');
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setCurrentAddress('Error getting address');
    } finally {
      setIsLoading(false);
    }
  };

  // Si necesitas buscar una dirección específica
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${environment.MAPS_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
          address: data.results[0].formatted_address
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Si necesitas el debounce para búsquedas
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const debouncedGeocodeAddress = useCallback(
    debounce(geocodeAddress, 300),
    []
  );

  return (
    <div style={{
      position: 'relative', 
      width: '100%', 
      height: isMobile ? '300px' : '400px', 
      background: 'var(--ion-color-tertiary-dark)',
    }}>
      {isLoading ? (
        AppLoader()
      ) : (
        <div>
          {currentAddress && (
            <div style={{ padding: '10px' }}>
              {currentAddress}
            </div>
          )}
          {/* Aquí puedes agregar el iframe del mapa estático de Google si lo necesitas */}
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${environment.MAPS_KEY}&q=${lat},${lng}`}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;