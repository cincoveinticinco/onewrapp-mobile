import { GoogleMap } from '@capacitor/google-maps';
import React, { useEffect, useRef, useState } from 'react';
import environment from '../../../../environment';
import AppLoader from '../../../hooks/Shared/AppLoader';
import { useIonViewDidEnter } from '@ionic/react';
import useErrorToast from '../../../hooks/Shared/useErrorToast';

interface LocationInfo {
  locationTypeId: number;
  locationName: string;
  locationAddress?: string;
  locationPostalCode?: string | null;
  lat?: string | null;
  lng?: string | null;
}

interface GoogleMapComponentProps {
  locations: Array<LocationInfo>;
  mapRef: React.RefObject<HTMLElement>;
}

const colorMap: { [key: number]: string } = {
  1: 'blue',    // Ubicación
  2: 'purple',  // Campamento base
  3: 'red',     // Hospital
  4: 'yellow'   // Pick up
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ locations, mapRef }) => {
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const errorToast = useErrorToast();
  const successToast = useErrorToast();

  const createMap = async (lat: number, lng: number) => {
    if (!mapRef.current) return;

    try {
      if (map) {
        await map.destroy();
      }

      const newMap = await GoogleMap.create({
        id: 'shooting-basic-info-map',
        element: mapRef.current,
        apiKey: environment.MAPS_KEY,
        config: {
          center: { lat, lng },
          zoom: 13,
        },
        forceCreate: true
      });

      setMap(newMap);
      setMapInitialized(true);

      // Agregar todos los marcadores después de crear el mapa
      await addMarkers(newMap, locations);
      
    } catch (error) {
      console.error('Error creating map:', error);
    }
  };

  const addMarkers = async (mapInstance: GoogleMap, locations: Array<LocationInfo>) => {
    for (const location of locations) {
      await addMarker(mapInstance, location);
    }
  };

  const addMarker = async (mapInstance: GoogleMap, location: LocationInfo) => {
    const color = colorMap[location.locationTypeId] || 'gray';

    try {
      if(!location.lat || !location.lng) {
        const missedParameter = !location.lat ? 'lat' : 'lng';
        throw new Error(`Location is missing ${missedParameter}`);
      }
      await mapInstance.addMarker({
        coordinate: { lat: parseFloat(location.lat), lng: parseFloat(location.lng) },
        draggable: true,
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
      });
    } catch(error: any) {
      errorToast(error.message || 'Error adding marker');
    }
  };

  const initMap = async () => {
    if (locations.length > 0 && mapRef.current && !mapInitialized) {
      if (!locations[0]?.lat) {
        throw new Error('Location is missing lat');
      }

      if (!locations[0]?.lng) {
        throw new Error('Location is missing lng');
      }
      const lat = parseFloat(locations[0].lat!);
      const lng = parseFloat(locations[0].lng!);

      if (!isNaN(lat) && !isNaN(lng)) {
        await createMap(lat, lng);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (map) {
        map.destroy();
      }
    };
  }, [locations, mapRef.current]);

  useIonViewDidEnter(() => {
    initMap();
  });

  return (
    <div style={{
      minHeight: '400px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {!mapInitialized && AppLoader()}
      <capacitor-google-map
        ref={mapRef}
        style={{
          display: 'inline-block',
          width: '100%',
          height: '400px',
          opacity: mapInitialized ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default GoogleMapComponent;
