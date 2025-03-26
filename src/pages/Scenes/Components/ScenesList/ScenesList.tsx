import { useEffect, useState } from "react";
import { PermisionTypes } from "../../../../Shared/Components/navigation/ProtectedRoute/ProtectedRoute";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import ScrollInfiniteContext from "../../../../context/ScrollInfinite/ScrollInfinite.context";
import { IonGrid } from "@ionic/react";
import SceneCard from "../../../../Shared/Components/cards/SceneCard/SceneCard";
import NoScenesMessage from "../NoScenesMessage/NoScenesMessage";

const ScenesList: React.FC<{
  filteredScenes: SceneDocType[];
  searchText: string;
  permissionType: PermisionTypes | null;
  selectedFilterOptions: any;
  setSelectedFilterOptions: (options: any) => void;
}> = ({ 
  filteredScenes, 
  searchText, 
  permissionType,
  selectedFilterOptions,
  setSelectedFilterOptions
}) => {

  const [ displayedScenes, setDisplayedScenes ] = useState<SceneDocType[]>([]);

  useEffect(() => {
    setDisplayedScenes([...filteredScenes.slice(0, 20)]); // Clonar para forzar actualización
  }, [filteredScenes]);

  if (filteredScenes.length === 0) {
    return (
      <NoScenesMessage 
        hasFilters={Object.keys(selectedFilterOptions).length > 0}
        resetFilters={() => setSelectedFilterOptions({})}
      />
    );
  }
  
  return (
    <IonGrid className="scenes-grid ion-margin">
      <ScrollInfiniteContext 
        setDisplayedData={setDisplayedScenes} 
        filteredData={filteredScenes} 
        batchSize={20}
      >
        {displayedScenes.map((scene, i) => (
          <SceneCard
            key={`scene-item-${scene.id}-${i}`}
            scene={scene as any}
            searchText={searchText}
            permissionType={permissionType}
          />
        ))}
      </ScrollInfiniteContext>
    </IonGrid>
  );
};

export default ScenesList;
