import {
  IonButton, IonIcon,
  IonInput,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  addOutline,
  caretForward,
  chevronBack,
  funnelOutline,
  menuOutline, searchOutline,
  swapVerticalOutline,
} from 'ionicons/icons';
import React, {
  memo, useContext, useEffect, useRef, useState,
} from 'react';
import { CiEdit, CiLogout } from 'react-icons/ci';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { RiDownload2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { useParams } from 'react-router';
import DatabaseContext from '../../../context/Database.context';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import template from '../../../templates/MinimalTemplate';
import './Toolbar.scss';
import AuthContext from '../../../context/Auth.context';

export interface ToolbarButton {
  name: string;
  icon: any;
  click: () => void;
  triggerId: string;
  show: boolean;
}

type CustomButton= () => JSX.Element;

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
  prohibited?: boolean;
  edit?: boolean;
  deleteButton?: boolean;
  editRoute?: string;
  deleteTrigger?: string;
  download?: boolean;
  addShoBanSc?: any;
  isLoading?: boolean;
  customButtons?: CustomButton[];
  permissionType?: number | null;
  logoutIcon?: boolean;
  customHandleSearch?: (e: any) => void;
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
  backString = false,
  prohibited = false,
  deleteButton = false,
  edit = false,
  editRoute = '',
  deleteTrigger = '',
  download = true,
  addShoBanSc,
  isLoading = false,
  customButtons = [],
  permissionType,
  logoutIcon = true,
  customHandleSearch
}) => {
  const isMobile = useIsMobile();

  const { offlineScenes } = useContext(DatabaseContext);
  const { logout } = useContext(AuthContext);

  const [sceneToPrint, setSceneToPrint] = useState<any>({});
  const [inputs, setInputs] = useState<any>([]);

  const { id } = useParams<{ id: string }>();

  const disableEditions = permissionType !== 1;

  useEffect(() => {
    if (offlineScenes.length > 0) setSceneToPrint(offlineScenes[0]._data);
    if (sceneToPrint) {
      const inputs = [{ a: `LOCATION: ${sceneToPrint.locationName}`, b: `SET: ${sceneToPrint.setName}`, c: sceneToPrint.synopsis }];
      setInputs(inputs);
    }
  }, [offlineScenes, sceneToPrint]);

  const handleSearchInput = (e: any) => {
    if(customHandleSearch) {
      customHandleSearch(e);
      setSearchText(e.detail.value!);
    } else {
      setSearchText(e.detail.value!);
    }
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

  const generatePdf = (template: any, inputs: any) => {
    console.log('Generating PDF');
  };

  // Get if the platform is ios

  

  return (
    <IonToolbar color="tertiary" className="toolbar" id="main-pages-toolbar" style={{
      paddingLeft: back || backString ? '0px' : '16px',
    }}>
      {menu && (
        <IonButton slot="start" fill="clear" className="toolbar-button ion-no-padding">
          <IonIcon icon={menuOutline} className="toolbar-icon" />
        </IonButton>
      )}
      <div className="toolbar-title-link" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IonTitle className={`toolbar-title ${isMobile && searchMode ? 'hidden' : ''}`} slot="start">{name}</IonTitle>
      </div>
      <>
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
        <IonButton
          fill="clear"
          slot="end"
          color="light"
          routerLink="addscene"
          className="ion-no-padding toolbar-button"
          style={{
            display: disableEditions ? 'none' : 'flex',
          }}
        >
          <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
        </IonButton>
      )}
      {backString && (
        <IonButton fill="clear" slot="start" className="ion-no-padding toolbar-button" onClick={handleBack}>
          <IonIcon icon={chevronBack} className="toolbar-back-icon toolbar-icon" />
        </IonButton>
      )}
      {filter && (
        <IonButton fill="clear" slot="end" color="light" routerLink={`/my/projects/${id}/strips/filters`} className="ion-no-padding toolbar-button">
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
      {
        edit && (
          <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" routerLink={editRoute}>
            <CiEdit className="toolbar-icon edit-icon" />
          </IonButton>
        )
      }
      {
        prohibited && (
          <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button">
            <PiProhibitLight className="toolbar-icon prohibit-icon" />
          </IonButton>
        )
      }
      {
        deleteButton && (
          <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" id={deleteTrigger}>
            <PiTrashSimpleLight className="toolbar-icon trash-icon" />
          </IonButton>
        )
      }
      {
        customButtons.map((renderFunction: any, index) => (
          renderFunction()
        ))
      }
      {
        addShoBanSc && (
          addShoBanSc()
        )
      }
      {/* {
        download && (
          <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={() => generatePdf(template, inputs)}>
            <RiDownload2Line className="toolbar-icon download-icon" />
          </IonButton>
        )
      } */}
      { logoutIcon &&
        <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button logout-icon" onClick={logout}>
          <RiLogoutBoxLine className="toolbar-icon" />
        </IonButton>
      }
      {
        isLoading && (
          <IonProgressBar type="indeterminate" />
        )
      }
      </>
    </IonToolbar>
  );
});

export default Toolbar;
