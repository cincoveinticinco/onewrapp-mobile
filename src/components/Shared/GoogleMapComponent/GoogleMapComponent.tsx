import { GoogleMap } from '@capacitor/google-maps';
import React, { useEffect, useRef, useState } from 'react';
import environment from '../../../../environment';
import AppLoader from '../../../hooks/Shared/AppLoader';
import { useIonViewDidEnter } from '@ionic/react';

interface GoogleMapComponentProps {
  locations: Array<{lat: string; lng: string}>;
  mapRef: React.RefObject<HTMLElement>;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ locations, mapRef }) => {
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [marker, setMarker] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

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
          zoom: 15,
        },
        forceCreate: true
      });

      const newMarker = await newMap.addMarker({
        coordinate: { lat, lng },
        draggable: true,
      });

      setMap(newMap);
      setMarker(newMarker);
      setMapInitialized(true);

      await newMap.setOnMapClickListener((event) => {
        updateMarker(event.latitude, event.longitude);
      });
    } catch (error) {
      console.error('Error creating map:', error);
    }
  };

  const updateMarker = async (latitude: number, longitude: number) => {
    if (!map) return;

    try {
      if (marker) {
        await map.removeMarker(marker);
      }

      const newMarker = await map.addMarker({
        coordinate: { lat: latitude, lng: longitude },
        draggable: true,
      });

      setMarker(newMarker);

      await map.setOnMarkerDragEndListener(async (event) => {
        updateMarker(event.latitude, event.longitude);
      });
    } catch (error) {
      console.error('Error updating marker:', error);
    }
  };

  const initMap = async () => {
    if (locations.length > 0 && mapRef.current && !mapInitialized) {
      const lat = parseFloat(locations[0].lat);
      const lng = parseFloat(locations[0].lng);
      
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