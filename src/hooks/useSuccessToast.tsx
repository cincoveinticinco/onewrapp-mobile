// useSuccessToast.tsx
import { useIonToast } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';

const useSuccessToast = () => {
  const [presentToast] = useIonToast();

  const successMessageToast = (message: string) => {
    presentToast({
      message: message,
      duration: 2000,
      icon: checkmarkCircle,
      position: 'top',
      cssClass: 'success-toast',
    });
  };

  return successMessageToast;
};

export default useSuccessToast;
