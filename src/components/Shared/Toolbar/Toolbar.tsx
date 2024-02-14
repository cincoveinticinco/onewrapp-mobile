import React, { useEffect, useRef } from 'react';
import {
  IonToolbar, IonButton, IonIcon, IonTitle, IonInput,
} from '@ionic/react';
import {
  menuOutline, searchOutline, addOutline, funnelOutline, ellipsisHorizontalOutline, swapVerticalOutline, chevronBack, chevronBackCircle, chevronBackOutline, caretBackOutline,
} from 'ionicons/icons';
import './Toolbar.scss';
import useHandleBack from '../../../hooks/useHandleBack';
import useIsMobile from '../../../hooks/useIsMobile';

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
  setSearchText?: (searchText: string) => void;
  searchText?: string;
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
  setSearchText = () => {},
  searchText = '',
}) => {
  const isMobile = useIsMobile();

  const searchRef = useRef<HTMLIonInputElement>(null);

  const toggleSearchMode = () => {
    if (searchMode) {
      setSearchMode(false);
      setSearchText('');
    } else {
      setSearchMode(!searchMode);
      searchRef.current?.setFocus();
    }
  };

  const handleBack = useHandleBack();

  return (
    <IonToolbar color="tertiary" className="toolbar" id="main-pages-toolbar">
      {
        menu && (
        <IonButton slot="start" fill="clear" className="toolbar-button ion-no-padding">
          <IonIcon icon={menuOutline} className="toolbar-icon" />
        </IonButton>
        )
      }
      <div className="toolbar-title-link" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IonTitle className={`toolbar-title ${isMobile && searchMode ? 'hidden' : ''}`} slot="start">{name}</IonTitle>
      </div>
      {
        back

        && (
        <IonButton fill="clear" slot="start" className="ion-no-padding toolbar-button" onClick={handleBack} >
          <IonIcon icon={chevronBack} className="toolbar-back-icon toolbar-icon" />
        </IonButton>
        )
      }
      {search && (
        <div slot="end" className={`ion-no-padding toolbar-search-wrapper ${searchMode ? 'search' : ''}`}>
          <IonButton fill="clear" slot="end" className="ion-no-padding toolbar-button" onClick={toggleSearchMode}>
            <IonIcon color={searchMode ? 'danger' : 'light'} icon={searchMode ? caretBackOutline : searchOutline} className="toolbar-search-icon toolbar-icon" />
          </IonButton>
          <IonInput 
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            onIonChange={(e) => setSearchText(e.detail.value!)} 
            className="toolbar-search-input" 
            placeholder=""
            ref={searchRef}
            clearInput={true}
          />
        </div>
      )}
      {addScene && (
        <IonButton fill="clear" slot="end" color="light" routerLink="addscene" className="ion-no-padding toolbar-button">
          <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
        </IonButton>
      )}
      {filter && (
        <IonButton fill="clear" slot="end" color="light" routerLink="/my/projects/01/strips/filters" className="ion-no-padding toolbar-button">
          <IonIcon icon={funnelOutline} className="toolbar-filter-icon toolbar-icon" />
        </IonButton>
      )}
      {sort && (
        <IonButton fill="clear" slot="end" color="light" routerLink="/my/projects/01/sortscenes" className="ion-no-padding toolbar-button">
          <IonIcon icon={swapVerticalOutline} className="toolbar-sort-icon toolbar-icon" />
        </IonButton>
      )}
      {/* {elipse && (
        // <IonButton fill="clear" slot="end" className="ion-no-padding toolbar-button">
        //   <IonIcon icon={ellipsisHorizontalOutline} className="toolbar-ellipsis-icon toolbar-icon" />
        // </IonButton>
      )} */}
    </IonToolbar>
  );
};

export default Toolbar;
