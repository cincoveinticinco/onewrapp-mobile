import { IonButton, IonIcon } from '@ionic/react'
import { caretDownOutline, caretUpOutline } from 'ionicons/icons'
import React from 'react'

interface DropDownButtonProps {
  open: boolean
  handleDropDown: () => void
}

const DropDownButton: React.FC<DropDownButtonProps> = ({ open, handleDropDown }) => {
  return (
    <IonButton fill="clear" color={open ? "primary" : "light"} slot="start" onClick={handleDropDown}>
      {!open ? <IonIcon icon={caretDownOutline} /> : <IonIcon icon={caretUpOutline} />}
    </IonButton>
  )
}

export default DropDownButton