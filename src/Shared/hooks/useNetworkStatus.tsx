import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!isOnline) {
      console.log('Conexión perdida');
    }
  }, [isOnline]);

  const getOnlineStatus = async () => {
    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch (error) {
      console.error('Error al obtener el estado de la red:', error);
      return navigator.onLine;
    }
  };

  useEffect(() => {
    const updateOnlineStatus = async () => {
      const status = await getOnlineStatus();
      setIsOnline(status);
    };

    // Actualizar el estado inicial
    updateOnlineStatus();

    // Configurar listeners para cambios de conexión
    const networkListener = Network.addListener('networkStatusChange', updateOnlineStatus);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      networkListener.remove();
    };
  }, []);

  return isOnline;
};

export default useNetworkStatus;