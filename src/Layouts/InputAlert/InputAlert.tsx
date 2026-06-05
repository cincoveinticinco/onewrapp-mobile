import React, { forwardRef, useState } from 'react';
import { AlertInput, IonAlert } from '@ionic/react';
import './InputAlert.scss';

interface InputAlertProps {
  handleOk: (inputData: { [key: string]: any }) => void;
  inputs: AlertInput[];
  trigger?: string;
  header: string;
  subHeader?: string;
  message?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  handleCancel?: () => void;
}

const InputAlert: React.ForwardRefRenderFunction<HTMLIonAlertElement, InputAlertProps> = ({
  handleOk,
  handleCancel,
  inputs,
  trigger,
  header,
  subHeader,
  message,
  isOpen = false,
  setIsOpen = () => {}
}, ref) => {
  const [alertInputs, setAlertInputs] = useState(inputs);

  const handleDismiss = () => {
    setAlertInputs(inputs.map(input => ({ ...input, value: '' })));
    setIsOpen(false);
  };

  return (
    <IonAlert
      ref={ref}
      trigger={trigger}
      header={header}
      className="input-alert"
      mode="md"
      isOpen={isOpen}
      buttons={[
        {
          text: 'confirm',
          handler: handleOk,
          cssClass: 'primary',
        },
        {
          text: 'cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: handleCancel
        },
      ]}
      inputs={alertInputs}
      subHeader={subHeader}
      message={message}
      onDidDismiss={handleDismiss}
    />
  );
};

export default forwardRef(InputAlert);
