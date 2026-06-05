import { IonButton } from "@ionic/react";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";

const SceneDetailEditModeButtons = () => {
  const { creationMode, toggleEditMode, handleBack, sceneId } = useSceneDetailsContext();
  return (
    <>
      <IonButton
        slot="end"
        className="filled-success-button-small"
        key="custom-edit"
        type="submit"
        form={`scene-detail-info-${sceneId}`}
      >
        SAVE
      </IonButton>
      <IonButton
        slot="end"
        className="filled-danger-button-small"
        onClick={!creationMode ? toggleEditMode : handleBack}
        key="custom-cancel"
      >
        CANCEL
      </IonButton>
    </>
  );
}

export default SceneDetailEditModeButtons;
