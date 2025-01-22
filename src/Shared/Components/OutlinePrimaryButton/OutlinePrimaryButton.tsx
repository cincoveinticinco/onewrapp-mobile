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
  color?: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'tertiary' | 'dark' | 'medium' | 'light' | 'transparent'
}

const OutlinePrimaryButton: React.FC<OutlinePrimaryButtonProps> = ({
  buttonName, onClick, className = '', style = {}, type, id, disabled, color = 'primary',
}) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`outline-${color}-button ${className}`}
    style={style}
    type={type}
    id={id}
    disabled={disabled}
  >
    {buttonName}
  </IonButton>
);

export default OutlinePrimaryButton;
