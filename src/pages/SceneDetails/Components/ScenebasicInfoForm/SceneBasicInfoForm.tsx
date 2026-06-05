import { SceneDocType } from "../../../../Shared/types/scenes.types";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";
import SceneBasicInfo from "../SceneBasicInfo/SceneBasicInfo";

const SceneBasicInfoForm = () => {
  const { form, onSubmitForm, editMode, creationMode, thisScene, sceneId } = useSceneDetailsContext();
  const { handleSubmit, formState: { errors }, watch, setValue } = form;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id={`scene-detail-info-${sceneId}`}>
      <SceneBasicInfo editMode={editMode || creationMode} scene={thisScene as SceneDocType} sceneIsLoading form={{
        ...form,
        errors,
        watch,
        setValue
      }} />
    </form>
  );
}

export default SceneBasicInfoForm;