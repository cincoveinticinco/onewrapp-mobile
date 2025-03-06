import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonTitle } from "@ionic/react";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";
import { useContext } from "react";
import ModalToolbar from "../../../../Shared/Components/modals/ModalToolbar/ModalToolbar";
import SplitLayout from "../../../../Shared/Components/organizers/SplitLayout/SplitLayout";
import ScenesList from "../ScenesList/ScenesList";
import { settings } from "ionicons/icons";

interface StripboardModalProps {
  scenes: SceneDocType[];
  scenesNotIncluded: SceneDocType[];
}

const StripboardModal: React.FC<StripboardModalProps> = ({ scenes, scenesNotIncluded }) => {
  // Usando Context API para acceder al estado
  const { 
    detailIsOpen, 
    setDetailIsOpen, 
    displayOptions, 
    setShowOptionsModal 
  } = useContext(StripboardContext);

  return (
    <IonModal isOpen={detailIsOpen} onDidDismiss={() => setDetailIsOpen(false)} color="tertiary" className="modal-styles">
      <IonHeader>
         <ModalToolbar
          toolbarTitle="Stripboard"
          handleBack={() => setDetailIsOpen(false)}
          customButtons={[
            () => (
            <IonButton key="settings" onClick={() => setShowOptionsModal(true)} slot="end">
              <IonIcon icon={settings} />
            </IonButton>)
          ]}
         />
      </IonHeader>
      <IonContent color="tertiary">
        <SplitLayout> 
          <div style={{overflowY: "auto"}}>
            <ScenesList 
              scenes={scenes} 
              scenesToDisplay={10} 
              title="SCENES"
              displayOptions={displayOptions}
            />
          </div>
          <div>
            <ScenesList 
              scenes={scenesNotIncluded} 
              scenesToDisplay={10} 
              title="SCENES NOT INCLUDED"
              displayOptions={displayOptions}
            />
          </div>
        </SplitLayout>
      </IonContent>
    </IonModal>
  );
};

export default StripboardModal;