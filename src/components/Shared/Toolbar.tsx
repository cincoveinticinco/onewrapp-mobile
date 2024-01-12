import React, { useEffect } from 'react';
import { IonToolbar, IonButton, IonIcon, IonTitle } from '@ionic/react';
import { add, ellipsisHorizontal, funnel, menu, search } from 'ionicons/icons';
import './Toolbar.css';

interface ToolbarProps {
  name: string,
}

const Toolbar:React.FC<ToolbarProps> = ({ name }) =>{
  return (
    <IonToolbar color="primary" className="toolbar">
      <IonButton slot="start" fill="clear" className="toolbar-burger-menu">
        <IonIcon icon={menu} className='toolbar-icon' />
      </IonButton>
      <IonTitle className='toolbar-title' slot="start">{name}</IonTitle>
      <IonButton slot="end">
        <IonIcon icon={search} className="toolbar-search-icon toolbar-icon" />
      </IonButton>
      <IonButton slot="end" routerLink={'addscene'} >
        <IonIcon icon={add} className="toolbar-add-icon toolbar-icon" />
      </IonButton>
      <IonButton slot="end">
        <IonIcon icon={funnel} className="toolbar-filter-icon toolbar-icon" />
      </IonButton>
      <IonButton slot="end">
        <IonIcon icon={ellipsisHorizontal} className="toolbar-ellipsis-icon toolbar-icon" />
      </IonButton>
  </IonToolbar>
  );
}
export default Toolbar;
