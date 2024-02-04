import React, { useEffect } from 'react';
import {
  IonToolbar, IonButton, IonIcon, IonTitle, IonInput,
} from '@ionic/react';
import {
  menuOutline, searchOutline, addOutline, funnelOutline, ellipsisHorizontalOutline, swapVerticalOutline, chevronBack,
} from 'ionicons/icons';
import './Toolbar.scss';
import { Link } from 'react-router-dom';
import useHandleBack from '../../../hooks/useHandleBack';

interface ToolbarProps {
  name: string;
  menu?: boolean;
  back?: boolean;
  search?: boolean;
  addScene?: boolean;
  filter?: boolean;
  elipse?: boolean;
  sort?: boolean;
  searchMode?: boolean;
  setSearchMode?: (searchMode: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  name,
  menu,
  back = false,
  search = false,
  addScene = false,
  filter = false,
  elipse = false,
  sort = false,
  searchMode = false,
  setSearchMode = () => {},
}) => {

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
  }

  useEffect(() => {
    console.log(searchMode)
  }, [searchMode]);

  const handleBack = useHandleBack()
  
  return (
    <IonToolbar color="tertiary" className="toolbar" id="main-pages-toolbar">
      {
        menu && <IonButton slot="start" fill="clear" className="toolbar-button ion-no-padding">
          <IonIcon icon={menuOutline} className="toolbar-icon" />
        </IonButton>}
        <Link to="/my/projects" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IonTitle className="toolbar-title" slot="start">{name}</IonTitle>
        </Link>
      {
        back && 
      
        <IonButton fill="clear" slot="start" className="ion-no-padding toolbar-button">
          <IonIcon icon={chevronBack} className="toolbar-back-icon toolbar-icon" onClick={handleBack} />
        </IonButton>
      }
      {search && (
        <div slot="end" className={`ion-no-padding toolbar-search-wrapper ${searchMode ? 'search' : ''}`}>
          <IonButton fill="clear" slot="end" className="ion-no-padding toolbar-button" onClick={toggleSearchMode}>
            <IonIcon icon={searchOutline} className="toolbar-search-icon toolbar-icon"/>
          </IonButton>
          <IonInput className="toolbar-search-input" placeholder="" disabled={!searchMode}/>
        </div>
      )}
      {addScene && (
        <IonButton fill="clear" slot="end" routerLink="addscene" className="ion-no-padding toolbar-button">
          <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
        </IonButton>
      )}
      {filter && (
        <IonButton fill="clear" slot="end" routerLink="/my/projects/01/strips/filters" className="ion-no-padding toolbar-button">
          <IonIcon icon={funnelOutline} className="toolbar-filter-icon toolbar-icon" />
        </IonButton>
      )}
      {sort && (
        <IonButton fill="clear" slot="end" routerLink="/my/projects/01/sortscenes" className="ion-no-padding toolbar-button">
          <IonIcon icon={swapVerticalOutline} className="toolbar-sort-icon toolbar-icon" />
        </IonButton>
      )}
      {/* {elipse && (
        // <IonButton fill="clear" slot="end" className="ion-no-padding toolbar-button">
        //   <IonIcon icon={ellipsisHorizontalOutline} className="toolbar-ellipsis-icon toolbar-icon" />
        // </IonButton>
      )} */}
    </IonToolbar>
)};

export default Toolbar;
