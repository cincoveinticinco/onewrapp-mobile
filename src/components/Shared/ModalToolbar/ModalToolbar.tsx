import {
  IonButton, IonIcon, IonTitle, IonToolbar,
} from '@ionic/react';
import React from 'react';
import { chevronBack } from 'ionicons/icons';
import useIsMobile from '../../../hooks/useIsMobile';
import './ModalToolbar.scss';

interface ModalToolbarProps {
  clearOptions?: () => void
  handleBack: () => void
  toolbarTitle: string
  saveOptions?: () => void
}

const ModalToolbar: React.FC<ModalToolbarProps> = (
  {
    clearOptions,
    handleBack,
    toolbarTitle,
    saveOptions,
  },
) => {
  const isMobile = useIsMobile();

  return (
    <IonToolbar color="tertiary" id="modal-toolbar" className="ion-no-padding">
      {
        !isMobile
        && (
          <>
            <IonButton fill="clear" color="primary" slot="start" onClick={handleBack}>
              BACK
            </IonButton>
          </>
        )
      }

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
        clearOptions
        && (
        <IonButton
          fill="clear"
          color="primary"
          slot="end"
          onClick={clearOptions}
        >
          RESET
        </IonButton>
        )
      }
      {
        saveOptions
        && (
        <IonButton fill="clear" color="primary" slot="end" onClick={saveOptions}>
          SAVE
        </IonButton>
        )
      }

    </IonToolbar>
  );
};

export default ModalToolbar;
