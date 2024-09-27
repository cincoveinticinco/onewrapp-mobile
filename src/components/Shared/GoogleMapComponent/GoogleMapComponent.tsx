import React, { useEffect, useRef, useState } from 'react';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (mapRef.current && !map) {
      initMap();
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map) {
      updateMap();
    }
  }, [lat, lng, map]);

  const initMap = () => {
    const newMap = new google.maps.Map(mapRef.current!, {
      center: { lat, lng },
      zoom: 14,
    });
    setMap(newMap);
    setIsLoading(false);
  };

  const updateMap = () => {
    if (map) {
      map.setCenter({ lat, lng });
      clearMarkers();
      addMarker();
    }
  };

  const clearMarkers = () => {
    if (map) {
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });
    }
  };

  const addMarker = () => {
    if (map) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
      });
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: isMobile ? '300px' : '400px',
      background: 'var(--ion-color-tertiary-dark)',
    }}>
      {isLoading && AppLoader()}
      <div
        ref={mapRef}
        style={{
          display: isLoading ? 'none' : 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default GoogleMapComponent;