import { useScene } from "../../../hooks/useScene/useScene"
import { useShooting } from "../../../hooks/useShooting/useShooting";
import InputAlert from "../../../Layouts/InputAlert/InputAlert"

interface UnassignSceneAlertProps {
  alertIsOpen: boolean;
  setAlertIsOpen: (isOpen: boolean) => void;
  sceneId: string;
  shootingId: string;
  sceneHeader: string;
  onSuccess?: () => void;
}

const UnassignSceneAlert: React.FC<UnassignSceneAlertProps> = ({ alertIsOpen, setAlertIsOpen, sceneId, shootingId, sceneHeader, onSuccess }) => {

  const { shootingDeleteScene } = useShooting()

  const handleUnassignScene = async () => {
    try {
      await shootingDeleteScene(sceneId, shootingId)
       await onSuccess?.()
    } catch (error) {
      console.error('Error deleting scene:', error)
    }
  }

  return (
    <InputAlert
      header="Delete Scene"
      message={`Are you sure you want to unassign scene ${sceneHeader}?`}
      handleOk={handleUnassignScene}
      inputs={[]}
      isOpen={alertIsOpen}
      setIsOpen={setAlertIsOpen}
    />
  )
}

export default UnassignSceneAlert