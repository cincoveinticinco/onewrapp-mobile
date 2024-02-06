import { AlertInput, IonAlert } from '@ionic/react';
import React from 'react';
import './InputAlert.scss';

interface InputAlertProps {
  handleOk: (inputData: any) => void;
  inputs: AlertInput[];
  trigger: string;
  header: string;
  subHeader?: string;
  message?: string;
}

const InputAlert:React.FC<InputAlertProps> = ({
  handleOk,
  inputs,
  trigger,
  header,
  subHeader,
  message,
}) => (
  <IonAlert
    color="dark"
    trigger={trigger}
    header={header}
    className='input-alert'
    buttons={[
      {
        text: 'confirm',
        handler: handleOk,
      },
      {
        text: 'cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }
    ]}
    inputs={inputs}
    subHeader={subHeader}
    message={message}
  />
);

export default InputAlert;
