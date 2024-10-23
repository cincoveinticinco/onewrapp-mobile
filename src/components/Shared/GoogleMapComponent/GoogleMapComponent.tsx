import { GoogleMap } from '@capacitor/google-maps';
import React, { useEffect, useRef, useState } from 'react';
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
  const mapRef = useRef<HTMLElement | null>(null);
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [marker, setMarker] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!mapInitialized) {
      // Pequeño delay para asegurar que el elemento DOM esté listo
      setTimeout(() => {
        createMap();
      }, 300);
    } else if (map && lat && lng) {
      updateMarker(lat, lng);
    }
  }, [mapInitialized, map, lat, lng]);

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
        draggable: false,
      });

      setMarker(newMarker);
    }
  };

  const createMap = async () => {
    if (!mapRef.current) return;

    try {
      const newMap = await GoogleMap.create({
        id: 'google-map',
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: {
            lat,
            lng,
          },
          zoom: 14,
        },
      });
      setMap(newMap);
      setMapInitialized(true);
      setIsLoading(false);

      await updateMarker(lat, lng);
    } catch (error) {
      console.error('Error creating map:', error);
      setIsLoading(false);
    }
  };

  const destroyMap = async () => {
    if (map) {
      await map.destroy();
      setMap(null);
      setMapInitialized(false);
      setMarker(null);
    }
  };

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      destroyMap();
    };
  }, []);

  return (
    <div style={{
      position: 'relative', 
      width: '100%', 
      height: isMobile ? '300px' : '400px', 
      background: 'var(--ion-color-tertiary-dark)',
    }}
    >
      {isLoading && AppLoader()}
      <capacitor-google-map
        ref={mapRef}
        style={{
          display: isLoading ? 'none' : 'inline-block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default GoogleMapComponent;