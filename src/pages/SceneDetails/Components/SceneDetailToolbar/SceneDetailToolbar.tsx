
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";
import SceneDetailToolbarButtons from "../ToolbarButtons/ToolbarButtons";
import SceneDetailEditModeButtons from "../SceneDetailEditModeButtons/SceneDetailEditModeButtons";
import Toolbar from "../../../../Shared/Components/navigation/Toolbar/Toolbar";

const SceneDetailToolbar = () => {

  const {
    creationMode,
    sceneHeader,
    handleBack,
    editMode,
    sceneId
  } = useSceneDetailsContext();

  return (
        <Toolbar
          name={creationMode ? "CREATE SCENE" : sceneHeader}
          back
          handleBack={handleBack}
          {...(creationMode || editMode
            ? { customButtons: [SceneDetailEditModeButtons], showLogout: false }
            : {
              customButtons: [SceneDetailToolbarButtons],
            })}
          deleteTrigger={`open-delete-scene-alert-${sceneId}-details`}
          color={editMode ? 'yellow' : 'tertiary'}
        />
  )
}

export default SceneDetailToolbar;