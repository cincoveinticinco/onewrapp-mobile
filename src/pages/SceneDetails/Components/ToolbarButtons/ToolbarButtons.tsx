import { IonButton } from "@ionic/react"
import { CiEdit } from "react-icons/ci"
import { PiProhibitLight, PiTrashSimpleLight } from "react-icons/pi"
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext"

const SceneDetailToolbarButtons = () => {
  const {
    toggleEditMode,
    setOpenUnassignAlert,
    setOpenDeleteSceneAlert,
    thisSceneShooting
  } = useSceneDetailsContext();

  return (
    <>
      <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={toggleEditMode}>
        <CiEdit className="toolbar-icon edit-icon" />
      </IonButton>
      {
        thisSceneShooting &&
        <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={() => setOpenUnassignAlert(true)}>
          <PiProhibitLight className="toolbar-icon prohibit-icon" />
        </IonButton>
      }
      <IonButton fill="clear" slot="end" color="light" className="ion-no-padding toolbar-button" onClick={() => setOpenDeleteSceneAlert(true)}>
        <PiTrashSimpleLight className="toolbar-icon trash-icon" />
      </IonButton>
    </>
  )
}

export default SceneDetailToolbarButtons;