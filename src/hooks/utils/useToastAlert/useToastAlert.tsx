import { useIonToast } from '@ionic/react';
import { settingsOutline, closeCircle, checkmarkCircle } from 'ionicons/icons';

const useToast = (icon: string, cssClass: string, duration: number = 2000) => {
  const [presentToast] = useIonToast();

  return (message: string) => {
    presentToast({
      message,
      duration,
      icon,
      position: 'top',
      cssClass,
    });
  };
};

const useWarningToast = () => useToast(settingsOutline, 'warning-toast', 1000);
const useErrorToast = () => useToast(closeCircle, 'error-toast');
const useSuccessToast = () => useToast(checkmarkCircle, 'success-toast');

const useAlertToast = () => {
  const successToast = useSuccessToast();
  const warningToast = useWarningToast();
  const errorToast = useErrorToast();

  return {
    successToast,
    warningToast,
    errorToast,
  };
};

export default useAlertToast;
