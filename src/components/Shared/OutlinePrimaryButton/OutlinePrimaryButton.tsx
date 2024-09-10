import { IonButton } from '@ionic/react';
import React from 'react';

interface OutlinePrimaryButtonProps {
  buttonName: string,
  onClick?: any
  className?: string
  style?: { [key: string]: string }
  type?: 'button' | 'submit' | 'reset'
  id?: string
  disabled?: boolean
}

const OutlinePrimaryButton: React.FC<OutlinePrimaryButtonProps> = ({
  buttonName, onClick, className = '', style = {}, type, id, disabled
}) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`outline-primary-button ${className}`}
    style={style}
    type={type}
    id={id}
    disabled={disabled}
  >
    {buttonName}
  </IonButton>
);

export default OutlinePrimaryButton;
