import { useScene } from "../../../hooks/useScene/useScene"
import InputAlert from "../../../Layouts/InputAlert/InputAlert"

interface DeleteSceneAlertProps {
  alertIsOpen: boolean;
  setAlertIsOpen: (isOpen: boolean) => void;
  sceneId: string;
  projectId: string;
  sceneHeader: string;
  onSuccess?: () => void;
}

const DeleteSceneAlert: React.FC<DeleteSceneAlertProps> = ({ alertIsOpen, setAlertIsOpen, sceneId, projectId, sceneHeader, onSuccess }) => {

  const { deleteScene } = useScene()

  const handleDeleteScene = async () => {
    try {
      await deleteScene(sceneId, projectId)
      await onSuccess?.()
    } catch (error) {
      console.error('Error deleting scene:', error)
    }
  }

  return (
    <InputAlert
      header="Delete Scene"
      message={`Are you sure you want to delete scene ${sceneHeader}?`}
      handleOk={handleDeleteScene}
      inputs={[]}
      isOpen={alertIsOpen}
      setIsOpen={setAlertIsOpen}
    />
  )
}

export default DeleteSceneAlert