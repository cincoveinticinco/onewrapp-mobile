import { IonButton } from '@ionic/react';
import React from 'react';

interface OutlinePrimaryButtonProps {
  buttonName: string,
  onClick: () => void
  className?: string
  style?: { [key: string]: string }
}

const OutlinePrimaryButton: React.FC<OutlinePrimaryButtonProps> = ({ buttonName, onClick, className = '', style = {}}) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`outline-primary-button ${className}`}
    style={style}
  >
    {buttonName}
  </IonButton>
);

export default OutlinePrimaryButton;
