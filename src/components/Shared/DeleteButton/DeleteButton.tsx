import { IonButton } from '@ionic/react';
import React from 'react';
import './DeleteButton.scss';
import { PiTrashSimpleLight } from 'react-icons/pi';

interface DeleteButtonProps {
  id?: string
  className?: string
  onClick?: () => void
  size?: 'small' | 'default' | 'large' | undefined
  slot?: 'start' | 'end' | 'icon-only' | undefined
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  className,
  onClick,
  size,
  slot,
}) => (
  <IonButton
    size={size}
    onClick={onClick}
    fill="clear"
    color="danger"
    className={`${className} delete-button ion-no-padding`}
    id={id}
    slot={slot}
  >
    <PiTrashSimpleLight className="delete-button-icon" />
  </IonButton>
);

export default DeleteButton;
