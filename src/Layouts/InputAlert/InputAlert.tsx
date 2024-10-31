import React, { forwardRef } from 'react';
import { AlertInput, IonAlert } from '@ionic/react';
import './InputAlert.scss';

interface InputAlertProps {
  handleOk: (inputData: any) => void;
  inputs: AlertInput[];
  trigger?: string;
  header: string;
  subHeader?: string;
  message?: string;
  isOpen?: boolean;
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
  isOpen = false
}, ref) => (
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
    inputs={inputs}
    subHeader={subHeader}
    message={message}
  />
);

export default forwardRef(InputAlert);
