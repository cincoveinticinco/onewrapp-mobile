import React from 'react';
import { IonToolbar, IonButton, IonIcon, IonTitle } from '@ionic/react';
import { menu } from 'ionicons/icons';
import './Toolbar.css';

interface ToolbarProps {
  name: string
}

const Toolbar:React.FC<ToolbarProps> = ({ name }) => (
  <IonToolbar color="primary" className="toolbar">
    <IonButton slot="start" fill="clear" color="light" className="toolbar-burger-menu">
      <IonIcon icon={menu} color="light" />
    </IonButton>
    <IonTitle className='toolbar-title' slot="start">{name}</IonTitle>
</IonToolbar>
);

export default Toolbar;
