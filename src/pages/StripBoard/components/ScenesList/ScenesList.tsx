import { SceneDocType } from "../../../../Shared/types/scenes.types";
import SceneCard from "../../../../Shared/Components/cards/SceneCard/SceneCard";
import { useMemo, useContext } from "react";
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";

const ScenesList = ({ 
  scenes, 
  scenesToDisplay 
}: { 
  scenes: SceneDocType[], 
  scenesToDisplay: number 
}) => {
  const displayedScenes = useMemo(() => scenes.slice(0, scenesToDisplay), [scenes, scenesToDisplay]);
  const { displayOptions } = useContext(StripboardContext);

  return (
    <>
      {displayedScenes.map((scene) => (
        <SceneCard 
          scene={scene} 
          key={`${scene.id}-${JSON.stringify(displayOptions)}`} 
          displayOptions={displayOptions}
        />
      ))}
    </>
  );
};

export default ScenesList;
