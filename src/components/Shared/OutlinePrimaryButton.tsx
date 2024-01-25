import { IonButton } from '@ionic/react'
import React from 'react'

interface OutlinePrimaryButtonProps {
  buttonName: string,
  onClick: () => void
  className?: string
}

const OutlinePrimaryButton: React.FC<OutlinePrimaryButtonProps> = ({buttonName, onClick, className }) => {
  return (
  <IonButton
    expand='block' 
    onClick={onClick}
    className={'outline-primary-button ' + className}
  >
    {buttonName}
  </IonButton>
  )
}

export default OutlinePrimaryButton