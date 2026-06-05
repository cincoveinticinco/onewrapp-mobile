import {
  IonButton, IonIcon, IonTitle, IonToolbar,
} from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import React from 'react';
import useIsMobile from '../../../../hooks/utils/useIsMobile/useIsMobile';
import './ModalToolbar.scss';
import zIndex from '@mui/material/styles/zIndex';
import SearchToolbarButton, { SearchToolbarButtonProps } from '../../buttons/SearchToolbarButton/SearchToolbarButton';


interface ModalToolbarProps {
  handleReset?: () => void
  toolbarTitle: string
  handleSave?: () => void
  showReset?: boolean
  handleSaveName?: string
  handleBack?: () => void
  customButtons?: (() => JSX.Element)[]
  search?: SearchToolbarButtonProps,
  slotTitle?: string
  color?: string
}

const ModalToolbar: React.FC<ModalToolbarProps> = (
  {
    handleReset,
    toolbarTitle,
    handleSave,
    showReset = false,
    handleSaveName,
    handleBack,
    customButtons = [],
    search,
    slotTitle,
    color = 'tertiary'
  },
) => {
  const isMobile = useIsMobile();

  return (
    <IonToolbar color={color} id="modal-toolbar" className="ion-no-padding">
      {
        isMobile || !handleReset && handleBack
        && (
          <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
            <IonIcon icon={chevronBack} color="light" />
          </IonButton>
        )
      }
      <IonTitle className={!slotTitle ? "modal-toolbar-title" : slotTitle}>
        {toolbarTitle.toUpperCase()}
      </IonTitle>

      {
        !isMobile
        && handleReset
        && (
        <IonButton
          fill="clear"
          color="danger"
          slot={isMobile ? 'end' : 'start'}
          onClick={showReset ? handleReset : handleBack}
          className="cancel-button"
        >
          {showReset ? 'RESET' : 'CANCEL'}
        </IonButton>
        )
            }
            {
        customButtons && customButtons.map((button) => (
          <React.Fragment key={`${button}`}>
            {button()}
          </React.Fragment>
        ))
            }
            {
        handleSave
        && (
        <IonButton fill="clear" color="success" slot="end" onClick={handleSave}>
          {handleSaveName || 'SAVE'}
        </IonButton>
        )
      }

      { search && (
        <SearchToolbarButton
          search={search.search}
          searchMode={search.searchMode}
          toggleSearchMode={search.toggleSearchMode}
          searchText={search.searchText}
          handleSearchInput={search.handleSearchInput}
        />
      )}

    </IonToolbar>
  );
};

export default ModalToolbar;
