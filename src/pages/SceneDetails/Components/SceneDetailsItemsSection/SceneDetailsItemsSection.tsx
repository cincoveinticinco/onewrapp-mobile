import { Character } from "../../../../Shared/types/scenes.types";
import AddCharacterForm from "../../../AddScene/Components/AddSceneFormInputs/AddCharacterForm";
import AddElementForm from "../../../AddScene/Components/AddSceneFormInputs/AddElementForm";
import AddExtraForm from "../../../AddScene/Components/AddSceneFormInputs/AddExtraForm";
import { useSceneDetailsContext } from "../../Context/SceneDetailsContext";

const SceneDetailsItemsSection = () => {
  const { editMode, creationMode, form } = useSceneDetailsContext();
  const { watch, setValue } = form;
  return (
    <>
      <div className={`section-wrapper characters-info`}>
        <AddCharacterForm
          observedCharacters={watch("characters") || []}
          editMode={editMode || creationMode}
          setCharacters={(value: Character[]) => setValue("characters", value)}
        />
      </div>
      <div className={`section-wrapper elements-info`}>
        <AddElementForm
          setElements={(value: any) => setValue("elements", value)}
          observedElements={(watch("elements") || []).map((element: any) => ({
            ...element,
            categoryName: element.categoryName || "",
          }))}
          editMode={editMode || creationMode}
        />
      </div>
      <div className={`section-wrapper extras-info`}>
        <AddExtraForm setExtras={(value: any) => setValue("extras", value)} observedExtras={watch("extras") || []} editMode={editMode || creationMode} />
      </div>
    </>
  );
};

export default SceneDetailsItemsSection;