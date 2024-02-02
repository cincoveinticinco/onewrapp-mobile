import { IonButton, IonIcon } from '@ionic/react'
import { trash, trashOutline } from 'ionicons/icons'
import React from 'react'
import './DeleteButton.scss'
import { FiTrash } from "react-icons/fi";

interface DeleteButtonProps {
  id?: string
  className?: string
  onClick?: () => void
  size?: "small" | "default" | "large" | undefined
  slot?: "start" | "end" | "icon-only" | undefined
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  className,
  onClick,
  size,
  slot
}) => {
  return (
    <IonButton
      size={size}
      onClick={onClick}
      fill="clear"
      color="danger"
      className={className + " delete-button ion-no-padding"}
      id={id}
      slot={slot}
    > 
      <FiTrash className="delete-button-icon" />
    </IonButton>
  )
}

export default DeleteButton