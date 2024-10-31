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
}

const InputAlert: React.ForwardRefRenderFunction<HTMLIonAlertElement, InputAlertProps> = ({
  handleOk,
  inputs,
  trigger,
  header,
  subHeader,
  message,
}, ref) => (
  <IonAlert
    ref={ref}
    trigger={trigger}
    header={header}
    className="input-alert"
    mode="md"
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
      },
    ]}
    inputs={inputs}
    subHeader={subHeader}
    message={message}
  />
);

export default forwardRef(InputAlert);
