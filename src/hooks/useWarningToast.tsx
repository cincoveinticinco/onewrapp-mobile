// useSuccessToast.tsx
import { useIonToast } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';

const useWarningToast = () => {
  const [presentToast] = useIonToast();

  const warnigMessageToast = (message: string) => {
    presentToast({
      message,
      duration: 1000,
      icon: settingsOutline,
      position: 'top',
      cssClass: 'warning-toast',
    });
  };

  return warnigMessageToast;
};

export default useWarningToast;

// CHANGE CATEGORY, LOCATION ...
