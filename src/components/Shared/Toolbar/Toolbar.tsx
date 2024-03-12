import React, { memo, useRef } from 'react';
import {
  IonToolbar, IonButton, IonIcon, IonTitle, IonInput,
} from '@ionic/react';
import {
  menuOutline, searchOutline, addOutline, funnelOutline, swapVerticalOutline, chevronBack, caretForward,
} from 'ionicons/icons';
import './Toolbar.scss';
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
  handleBack?: () => void;
  sortTrigger?: string;
  backString?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = memo(({
  name,
  menu,
  back = false,
  search = false,
  addScene = false,
  filter = false,
  sort = false,
  searchMode = false,
  setSearchMode = () => {},
  setSearchText = () => {},
  searchText,
  handleBack,
  sortTrigger,
  backString = false
}) => {
  const isMobile = useIsMobile();

  const handleSearchInput = (e: any) => {
    setSearchText(e.detail.value);
  };

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

  return (
    <IonToolbar color="tertiary" className="toolbar" id="main-pages-toolbar">
      {menu && (
        <IonButton slot="start" fill="clear" className="toolbar-button ion-no-padding">
          <IonIcon icon={menuOutline} className="toolbar-icon" />
        </IonButton>
      )}
      <div className="toolbar-title-link" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IonTitle className={`toolbar-title ${isMobile && searchMode ? 'hidden' : ''}`} slot="start">{name}</IonTitle>
      </div>
      {back && (
        <IonButton fill="clear" slot="start" className="ion-no-padding toolbar-button" onClick={handleBack}>
          <IonIcon icon={chevronBack} className="toolbar-back-icon toolbar-icon" />
        </IonButton>
      )}
      {search && (
        <div slot="end" className={`ion-no-padding toolbar-search-wrapper ${searchMode ? 'search' : ''}`}>
          <IonButton fill="clear" slot="start" className="ion-no-padding toolbar-button" onClick={toggleSearchMode}>
            <IonIcon color={searchMode ? 'primary' : 'light'} icon={searchMode ? caretForward : searchOutline} className="toolbar-search-icon toolbar-icon" />
          </IonButton>
          <IonInput
            value={searchText}
            onIonInput={handleSearchInput}
            // onIonChange={(e) => setSearchText(e.detail.value!)}
            className="toolbar-search-input"
            placeholder=""
            ref={searchRef}
            clearInput
          />
        </div>
      )}
      {addScene && (
        <IonButton fill="clear" slot="end" color="light" routerLink="addscene" className="ion-no-padding toolbar-button">
          <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
        </IonButton>
      )}
      {backString && (
        <IonButton fill="clear" color='light' slot="start" className="ion-no-padding toolbar-button" onClick={handleBack}>
          Back
        </IonButton>
      )}
      {filter && (
        <IonButton fill="clear" slot="end" color="light" routerLink="/my/projects/163/strips/filters" className="ion-no-padding toolbar-button">
          <IonIcon icon={funnelOutline} className="toolbar-filter-icon toolbar-icon" />
        </IonButton>
      )}
      {sort && (
        <IonButton fill="clear" slot="end" color="light" id={sortTrigger} className="ion-no-padding toolbar-button">
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
});

export default Toolbar;
