import React, { useContext } from 'react';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonToggle } from '@ionic/react';
import { StripboardContext } from '../../context/StripboardContext/StripboardContext';
import ModalToolbar from '../../../../Shared/Components/modals/ModalToolbar/ModalToolbar';

const DisplayOptionsModal: React.FC = () => {
  const { 
    showOptionsModal, 
    setShowOptionsModal, 
    displayOptions, 
    handleToggleOption 
  } = useContext(StripboardContext);

  return (
    <IonModal 
      isOpen={showOptionsModal} 
      onDidDismiss={() => setShowOptionsModal(false)} 
      color='tertiary' 
      className='modal-styles'
    >
      <IonHeader>
        <ModalToolbar
          toolbarTitle='Display Options'
          handleBack={() => setShowOptionsModal(false)}
        />
      </IonHeader>
      <IonContent color="tertiary">
        <IonList>
          <IonItem>
            <IonLabel>Show Header</IonLabel>
            <IonToggle 
              checked={displayOptions.showHeader} 
              onIonChange={() => handleToggleOption('showHeader')} 
              disabled={true} // El header siempre debe mostrarse
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Synopsis</IonLabel>
            <IonToggle 
              checked={displayOptions.showSynopsis} 
              onIonChange={() => handleToggleOption('showSynopsis')} 
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Characters</IonLabel>
            <IonToggle 
              checked={displayOptions.showCharacters} 
              onIonChange={() => handleToggleOption('showCharacters')} 
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Extras</IonLabel>
            <IonToggle 
              checked={displayOptions.showExtras} 
              onIonChange={() => handleToggleOption('showExtras')} 
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Page Info</IonLabel>
            <IonToggle 
              checked={displayOptions.showPageInfo} 
              onIonChange={() => handleToggleOption('showPageInfo')} 
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Time Info</IonLabel>
            <IonToggle 
              checked={displayOptions.showTimeInfo} 
              onIonChange={() => handleToggleOption('showTimeInfo')} 
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Assignment Date</IonLabel>
            <IonToggle 
              checked={displayOptions.showAssignmentDate} 
              onIonChange={() => handleToggleOption('showAssignmentDate')} 
            />
          </IonItem>
          <IonItem>
            <IonLabel>Show Actions</IonLabel>
            <IonToggle 
              checked={displayOptions.showActions} 
              onIonChange={() => handleToggleOption('showActions')} 
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default DisplayOptionsModal;