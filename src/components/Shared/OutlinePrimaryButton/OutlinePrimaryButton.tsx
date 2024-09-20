import { IonButton } from '@ionic/react';
import React from 'react';

interface OutlinePrimaryButtonProps {
  buttonName: string,
  onClick?: any
  className?: string
  style?: { [key: string]: string }
  type?: 'button' | 'submit' | 'reset'
  id?: string
}

const OutlinePrimaryButton: React.FC<OutlinePrimaryButtonProps> = ({
  buttonName, onClick, className = '', style = {}, type, id,
}) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`outline-primary-button ${className}`}
    style={style}
    type={type}
    id={id}
  >
    {buttonName}
  </IonButton>
);

export default OutlinePrimaryButton;
