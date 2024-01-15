import React, { useEffect } from 'react';
import { IonToolbar, IonButton, IonIcon, IonTitle } from '@ionic/react';
import { add, addOutline, ellipsisHorizontal, ellipsisHorizontalOutline, funnel, funnelOutline, menu, menuOutline, search, searchOutline } from 'ionicons/icons';
import './Toolbar.css';

interface ToolbarProps {
  name: string,
  search?: boolean,
  addScene?: boolean,
  filter?: boolean,
  elipse?: boolean,
}

const Toolbar:React.FC<ToolbarProps> = ({ name, search, addScene, filter, elipse}) =>{
  return (
    <IonToolbar color="tertiary" className="toolbar">
      <IonButton slot="start" fill="clear" className="toolbar-burger-menu ion-no-padding">
        <IonIcon icon={menuOutline} className='toolbar-icon' />
      </IonButton>
      <IonTitle className='toolbar-title ion-no-padding' slot="start">{name}</IonTitle>
      {
        search 
        &&
        <IonButton fill="clear" slot="end" className='ion-no-padding toolbar-button'>
          <IonIcon icon={searchOutline} className="toolbar-search-icon toolbar-icon" />
        </IonButton>
      }
      {
        addScene 
        &&
        <IonButton fill="clear" slot="end" routerLink={'addscene'} className='ion-no-padding toolbar-button'>
          <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
        </IonButton>
      }
      {
        filter
        &&
        <IonButton fill="clear" slot="end" className='ion-no-padding toolbar-button'>
          <IonIcon icon={funnelOutline} className="toolbar-filter-icon toolbar-icon" />
        </IonButton>
      }
      {
        elipse
        &&
        <IonButton fill="clear" slot="end" className='ion-no-padding toolbar-button'>
          <IonIcon icon={ellipsisHorizontalOutline} className="toolbar-ellipsis-icon toolbar-icon" />
        </IonButton>
      }
  </IonToolbar>
  );
}
export default Toolbar;
