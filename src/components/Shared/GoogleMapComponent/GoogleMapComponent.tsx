import { GoogleMap } from '@capacitor/google-maps';
import React, { useEffect, useRef, useState } from 'react';
import environment from '../../../../environment';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import AppLoader from '../../../hooks/Shared/AppLoader';
import { useIonViewDidEnter } from '@ionic/react';

interface GoogleMapComponentProps {
  lat: number;
  lng: number;
  zoom?: number;
  onMapReady?: () => void;
  onError?: (error: any) => void;
  parentRef?:any
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  lat,
  lng,
  zoom = 14,
  onMapReady,
  onError,
  parentRef
}) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const markerRef = parentRef || useRef<string | null>(null);
  const initializedRef = useRef(false);

  const createMap = async () => {
    if (!mapRef.current || initializedRef.current) return;

    try {
      const newMap = await GoogleMap.create({
        id: `google-map-${Date.now()}`,
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: {
            lat,
            lng,
          },
          zoom,
          disableDefaultUI: false,
          gestureHandling: 'cooperative',
        },
      });

      const newMarker = await newMap.addMarker({
        coordinate: { lat, lng },
        draggable: false,
      });

      markerRef.current = newMarker;
      setMap(newMap);
      initializedRef.current = true;
      onMapReady?.();
    } catch (error) {
      console.error('Error creating map:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar mapa cuando el componente se monta
  useEffect(() => {
    createMap();
    
    // Cleanup function
    return () => {
      if (map) {
        map.destroy();
        initializedRef.current = false;
        markerRef.current = null;
        setMap(null);
      }
    };
  }, []); // Solo se ejecuta al montar el componente

  // Manejar cambios en las props
  useEffect(() => {
    const updateMapPosition = async () => {
      if (!map || !initializedRef.current) return;

      try {
        await map.setCamera({
          coordinate: {
            lat,
            lng,
          },
          zoom,
          animate: true,
        });

        // Remover marcador anterior si existe
        if (markerRef.current) {
          await map.removeMarker(markerRef.current);
        }

        // Añadir nuevo marcador
        const newMarker = await map.addMarker({
          coordinate: { lat, lng },
          draggable: false,
        });

        markerRef.current = newMarker;
      } catch (error) {
        console.error('Error updating map position:', error);
        onError?.(error);
      }
    };

    if(map) {
      updateMapPosition();
    }
  }, [lat, lng, zoom, map]); // Dependencias actualizadas

  // Manejar cuando la vista Ionic se vuelve activa
  useIonViewDidEnter(() => {
    if (!map && mapRef.current) {
      createMap();
    }
  });

  return (
    <div 
      className="relative w-full bg-tertiary-dark"
      style={{
        minHeight: isMobile ? '300px' : '400px',
        height: '100%',
      }}
    >
      {isLoading && <AppLoader />}
      <capacitor-google-map
        ref={mapRef}
        style={{
          display: 'inline-block',
          width: '100%',
          height: '400px',
          visibility: isLoading ? 'hidden' : 'visible',
        }}
      />
    </div>
  );
};

export default GoogleMapComponent;