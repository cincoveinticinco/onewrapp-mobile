import {
  IonButton, IonIcon, IonTitle, IonToolbar,
} from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import React from 'react';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import './ModalToolbar.scss';

interface ModalToolbarProps {
  handleReset?: () => void
  toolbarTitle: string
  handleSave?: () => void
  showReset?: boolean
  handleSaveName?: string
  handleBack: () => void
}

const ModalToolbar: React.FC<ModalToolbarProps> = (
  {
    handleReset,
    toolbarTitle,
    handleSave,
    showReset = false,
    handleSaveName,
    handleBack,
  },
) => {
  const isMobile = useIsMobile();

  return (
    <IonToolbar color="tertiary" id="modal-toolbar" className="ion-no-padding">
      {
        isMobile
        && (
          <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
            <IonIcon icon={chevronBack} color="light" />
          </IonButton>
        )
      }
      <IonTitle className="modal-toolbar-title">
        {toolbarTitle.toUpperCase()}
      </IonTitle>

      {
        !isMobile
        && handleReset
        && (
        <IonButton
          fill="clear"
          color="primary"
          slot={isMobile ? 'end' : 'start'}
          onClick={showReset ? handleReset : handleBack}
          className="cancel-button"
        >
          {showReset ? 'RESET' : 'CANCEL'}
        </IonButton>
        )
      }
      {
        handleSave
        && (
        <IonButton fill="clear" color="primary" slot="end" onClick={handleSave}>
          {handleSaveName || 'SAVE'}
        </IonButton>
        )
      }

    </IonToolbar>
  );
};

export default ModalToolbar;
