import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap } from '@capacitor/google-maps';
import environment from '../../../../environment';
import useLoader from '../../../hooks/Shared/useLoader';
import useIsMobile from '../../../hooks/Shared/useIsMobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    createMap();
  }, [lat, lng]);

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
      setIsLoading(false);

      // Añadir el marcador en la posición inicial
      await newMap.addMarker({
        coordinate: { lat, lng },
        draggable: false,
      });
    } catch (error) {
      console.error('Error creating map:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: isMobile ? '300px' : '400px' }}>
      {isLoading && useLoader()}
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
