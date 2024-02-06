import { IonButton } from '@ionic/react';
import React from 'react';

interface OutlinePrimaryButtonProps {
  buttonName: string,
  onClick: () => void
  className?: string
  style?: { [key: string]: string }
  type?: 'button' | 'submit' | 'reset'
}

const OutlinePrimaryButton: React.FC<OutlinePrimaryButtonProps> = ({
  buttonName, onClick, className = '', style = {}, type
}) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`outline-primary-button ${className}`}
    style={style}
    type={type}
  >
    {buttonName}
  </IonButton>
);

export default OutlinePrimaryButton;
