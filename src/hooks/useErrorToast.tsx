// useErrorToast.js
import { useIonToast } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

const useErrorToast = () => {
  const [presentToast] = useIonToast();

  const errorMessageToast = (message: string) => {
    presentToast({
      message,
      duration: 2000,
      position: 'top',
      icon: closeCircle,
      cssClass: 'error-toast',
    });
  };

  return errorMessageToast;
};

export default useErrorToast;
