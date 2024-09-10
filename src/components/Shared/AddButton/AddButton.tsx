import { IonButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import React from 'react';
import './AddButton.scss';

interface AddButtonProps {
  id?: string
  className?: string
  onClick?: (e: any) => void
  slot?: 'start' | 'end' | 'icon-only' | undefined
  disabled?: boolean
}

const AddButton: React.FC<AddButtonProps> = ({
  id,
  className,
  onClick,
  slot,
  disabled
}) => (
  <IonButton
    fill="clear"
    color="light"
    id={id}
    className={`${className} add-button ion-no-padding`}
    onClick={onClick}
    slot={slot}
    disabled={disabled}
  >
    <IonIcon className="add-button-icon" icon={add} />
  </IonButton>
);

export default AddButton;
