import { AlertInput, IonAlert } from '@ionic/react';
import React from 'react';

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
    color="tertiary"
    trigger={trigger}
    header={header}
    buttons={[
      {
        text: 'OK',
        handler: handleOk,
      },
    ]}
    inputs={inputs}
    subHeader={subHeader}
    message={message}
  />
);

export default InputAlert;
