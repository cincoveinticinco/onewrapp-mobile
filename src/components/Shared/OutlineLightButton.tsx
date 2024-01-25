import { IonButton } from '@ionic/react';
import React from 'react';

interface OutlineLightButtonProps {
  buttonName: string,
  onClick: () => void
  className?: string
}

const OutlineLightButton: React.FC<OutlineLightButtonProps> = ({ buttonName, onClick, className }) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`outline-light-button ${className}`}
  >
    {buttonName}
  </IonButton>
);

export default OutlineLightButton;
