import {
  IonButton, IonIcon,
  IonInput,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  caretForward,
  chevronBack,
  menuOutline, searchOutline,
} from 'ionicons/icons';
import React, {
  memo, useContext, useEffect, useRef, useState,
} from 'react';
import { useParams } from 'react-router';
import DatabaseContext from '../../../../context/Database/Database.context';
import useIsMobile from '../../../../hooks/utils/useIsMobile/useIsMobile';
import './Toolbar.scss';
import AuthContext from '../../../../context/Auth/Auth.context';
import { useRxData } from 'rxdb-hooks';
import { ProjectDocType } from '../../../../RXdatabase/schemas/projects.schema';
import ToolbarButton from '../../buttons/ToolbarButton/ToolbarButton';
import SearchToolbarButton from '../../buttons/SearchToolbarButton/SearchToolbarButton';

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
  searchMode?: boolean;
  setSearchMode?: (searchMode: boolean) => void;
  setSearchText?: (searchText: string) => void;
  searchText?: string;
  handleBack?: () => void;
  deleteTrigger?: string;
  isLoading?: boolean;
  customButtons?: CustomButton[];
  permissionType?: number | null;
  customHandleSearch?: (e: any) => void;
  color?: string;
}

const Toolbar: React.FC<ToolbarProps> = memo(({
  name,
  menu,
  back = false,
  search = false,
  searchMode = false,
  setSearchMode = () => {},
  setSearchText = () => {},
  searchText,
  handleBack,
  isLoading = false,
  customButtons = [],
  customHandleSearch,
  color = 'tertiary',
}) => {
  const isMobile = useIsMobile();

  const { offlineScenes } = useContext(DatabaseContext);
  const { logout } = useContext(AuthContext);


  const [sceneToPrint, setSceneToPrint] = useState<any>({});
  const [inputs, setInputs] = useState<any>([]);

  const { id } = useParams<{ id: string }>();

  const { result: currentProject, isFetching } = useRxData<ProjectDocType>(
    'projects',
    (collection: any) => collection.findOne({
      selector: {
        id: id,
      }
    })
  );
  
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

  return (
    <IonToolbar color={color} className="toolbar ion-pading-start" id="main-pages-toolbar" style={{
      paddingLeft: back ? '0px' : '16px',
    }}>
      {menu && (
        <ToolbarButton triggerId="menu-button" click={() => {}} show={true}>
          <IonIcon icon={menuOutline} className="toolbar-icon" />
        </ToolbarButton>
      )}
      <div className="toolbar-title-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <IonTitle className={`toolbar-title ${isMobile && searchMode ? 'hidden' : ''}`} slot="start">
        {currentProject && currentProject.length > 0 ? `${currentProject[0].projAbreviation?.toUpperCase()} - ${name}` : ''}
      </IonTitle>
      </div>
      <>
      {back && (
        <ToolbarButton triggerId="back-button" click={() => handleBack?.()} show={true} slot="start">
          <IonIcon icon={chevronBack} style={{color: `var(--ion-color-${color}-contrast)`}} />
        </ToolbarButton>
      )}
      {search && (
        <SearchToolbarButton
          search={search}
          searchMode={searchMode}
          toggleSearchMode={toggleSearchMode}
          searchText={searchText || ''}
          handleSearchInput={handleSearchInput}
        />
      )}
      {
        customButtons.map((renderFunction: any, index) => (
          <React.Fragment key={index}>
            {renderFunction()}
          </React.Fragment>
        ))
      }
      {
        isLoading || isFetching && (
          <IonProgressBar type="indeterminate" />
        )
      }
      </>
    </IonToolbar>
  );
});

export default Toolbar;
