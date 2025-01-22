import { IonButton } from '@ionic/react';
import React from 'react';

interface FiilledSuccessButtonProps {
  buttonName: string,
  onClick?: any
  className?: string
  style?: { [key: string]: string }
  type?: 'button' | 'submit' | 'reset'
  id?: string
}

const FiilledSuccessButton: React.FC<FiilledSuccessButtonProps> = ({
  buttonName, onClick, className = '', style = {}, type, id,
}) => (
  <IonButton
    expand="block"
    onClick={onClick}
    className={`filled-success-button ${className}`}
    style={style}
    type={type}
    id={id}
  >
    {buttonName}
  </IonButton>
);

export default FiilledSuccessButton;
