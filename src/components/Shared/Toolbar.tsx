import React from 'react';
import {
  IonToolbar, IonButton, IonIcon, IonTitle,
} from '@ionic/react';
import {
  menuOutline, searchOutline, addOutline, funnelOutline, ellipsisHorizontalOutline,
} from 'ionicons/icons';
import './Toolbar.css';
import { Link } from 'react-router-dom';

interface ToolbarProps {
  name: string;
  search?: boolean;
  addScene?: boolean;
  filter?: boolean;
  elipse?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  name,
  search = false,
  addScene = false,
  filter = false,
  elipse = false,
}) => (
  <IonToolbar color="tertiary" className="toolbar">
    <IonButton slot="start" fill="clear" className="toolbar-burger-menu ion-margin-bottom">
      <IonIcon icon={menuOutline} className="toolbar-icon" />
    </IonButton>
    <Link to="/my/projects" style={{ textDecoration: 'none', color: 'inherit' }}>
      <IonTitle className="toolbar-title" slot="start">{name}</IonTitle>
    </Link>
    {
      search
      && (
        <IonButton fill="clear" slot="end" className="ion-no-padding toolbar-button">
          <IonIcon icon={searchOutline} className="toolbar-search-icon toolbar-icon" />
        </IonButton>
      )
    }
    {
      addScene
      && (
        <IonButton fill="clear" slot="end" routerLink="addscene" className="ion-no-padding toolbar-button">
          <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
        </IonButton>
      )
    }
    {
      filter
      && (
        <IonButton fill="clear" slot="end" routerLink="/my/projects/01/strips/filters" className="ion-no-padding toolbar-button">
          <IonIcon icon={funnelOutline} className="toolbar-filter-icon toolbar-icon" />
        </IonButton>
      )
    }
    {
      elipse
      && (
        <IonButton fill="clear" slot="end" className="ion-no-padding toolbar-button">
          <IonIcon icon={ellipsisHorizontalOutline} className="toolbar-ellipsis-icon toolbar-icon" />
        </IonButton>
      )
    }
  </IonToolbar>
);
export default Toolbar;
