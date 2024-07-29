import { IonButton, IonIcon } from '@ionic/react';
import { caretDownOutline, caretUpOutline } from 'ionicons/icons';
import React from 'react';

interface DropDownButtonProps {
  open: boolean
}

const DropDownButton: React.FC<DropDownButtonProps> = ({ open }) => (
  <IonButton fill="clear" color={open ? 'primary' : 'light'} slot="start">
    {!open ? <IonIcon icon={caretDownOutline} /> : <IonIcon icon={caretUpOutline} />}
  </IonButton>
);

export default DropDownButton;
