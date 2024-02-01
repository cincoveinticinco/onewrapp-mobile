import React from 'react';
import {
  IonToolbar, IonButton, IonIcon, IonTitle,
} from '@ionic/react';
import {
  menuOutline, searchOutline, addOutline, funnelOutline, ellipsisHorizontalOutline, swapVerticalOutline,
} from 'ionicons/icons';
import './Toolbar.scss';
import { Link } from 'react-router-dom';

interface ToolbarProps {
  name: string;
  search?: boolean;
  addScene?: boolean;
  filter?: boolean;
  elipse?: boolean;
  sort?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  name,
  search = false,
  addScene = false,
  filter = false,
  elipse = false,
  sort = false,
}) => (
  <IonToolbar color="tertiary" className="toolbar">
    <IonButton slot="start" fill="clear" className="toolbar-button ion-no-padding">
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
      sort
      && (
        <IonButton fill="clear" slot="end" routerLink="/my/projects/01/sortscenes" className="ion-no-padding toolbar-button" >
          <IonIcon icon={swapVerticalOutline} className="toolbar-sort-icon toolbar-icon" />
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
