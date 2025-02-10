import { useEffect, useMemo, useState } from "react";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import { InfoType, SceneTypeEnum } from "../../../../Shared/ennums/ennums";
import SceneInfoLabels from "../../../SceneDetails/Components/SceneInfoLabels/SceneInfoLabels";
import { IonToolbar } from "@ionic/react";
import getUniqueValuesFromNestedArray from "../../../../Shared/Utils/getUniqueValuesFromNestedArray";
import getUniqueValuesByKey from "../../../../Shared/Utils/getUniqueValuesByKey";

interface ScenesTotalsProps {
  scenes: SceneDocType[];
}

const ScenesTotals: React.FC<ScenesTotalsProps> = ({
  scenes
}) => {
  const [sceneTotals, setSceneTotals] = useState({
    totalScenes: 0,
    totalProtections: 0,
    totalPages: 0,
    totalCharacters: 0,
    totalExtras: 0,
    totalElements: 0,
    totalLocations: 0,
    totalSets: 0,
    totalSeconds: 0
  });

  useEffect(() => {
    let totalScenes = 0;
    let totalProtections = 0;
    let totalPages = 0;
    let totalCharacters = 0;
    let totalExtras = 0;
    let totalElements = 0;
    let totalLocations = 0;
    let totalSets = 0;
    let totalSeconds = 0;

    scenes.forEach(scene => {
      if(scene.sceneType === SceneTypeEnum.SCENE) {
        totalScenes++;
      } else {
        totalProtections++;
      }
    });

    scenes.forEach(scene => {
      totalPages += scene.pages ?? 0;
      totalSeconds += scene.estimatedSeconds ?? 0;
    });

    const uniqueCharacters = getUniqueValuesFromNestedArray(scenes, 'characters', 'characterName')

    const uniqueExtras = getUniqueValuesFromNestedArray(scenes, 'extras', 'extraName')

    const uniqueElements = getUniqueValuesFromNestedArray(scenes, 'elements', 'elementName')

    const uniqueLocations = getUniqueValuesByKey(scenes, 'locationName')

    const uniqueSets = getUniqueValuesByKey(scenes, 'setName')

    totalCharacters = uniqueCharacters.length;
    totalExtras = uniqueExtras.length;
    totalElements = uniqueElements.length;
    totalLocations = uniqueLocations.length;
    totalSets = uniqueSets.length;

    setSceneTotals({
      totalScenes,
      totalProtections,
      totalPages,
      totalCharacters,
      totalExtras,
      totalElements,
      totalLocations,
      totalSets,
      totalSeconds
    });

    console.log('sceneTotals', sceneTotals);
  }, [scenes]);

  const wraperLabelStyles = {
    margin: '0 12px',
  }

  return (
    <div
    className="ion-padding-top"
     style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
     }}
    >
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalScenes',
            isEditable: false,
            disabled: true,
            title: 'Scn',
            info: sceneTotals.totalScenes,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalProtections',
            isEditable: false,
            disabled: true,
            title: 'Prot',
            info: sceneTotals.totalProtections,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalPages',
            isEditable: false,
            disabled: true,
            title: 'Pgs',
            info: sceneTotals.totalPages,
          }}
          type={InfoType.Pages}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalCharacters',
            isEditable: false,
            disabled: true,
            title: 'Characters',
            info: sceneTotals.totalCharacters,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalExtras',
            isEditable: false,
            disabled: true,
            title: 'Extras',
            info: sceneTotals.totalExtras,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalElements',
            isEditable: false,
            disabled: true,
            title: 'Elements',
            info: sceneTotals.totalElements,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalLocations',
            isEditable: false,
            disabled: true,
            title: 'Locations',
            info: sceneTotals.totalLocations,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalSets',
            isEditable: false,
            disabled: true,
            title: 'Sets',
            info: sceneTotals.totalSets,
          }}
          type={InfoType.Number}
        />
      </div>
      <div style={wraperLabelStyles}>
        <SceneInfoLabels
          editMode={false}
          label={{
            fieldKeyName: 'totalSeconds',
            isEditable: false,
            disabled: true,
            title: 'EST. TIME',
            info: sceneTotals.totalSeconds,
          }}
          type={InfoType.Minutes}
        />
      </div>
    </div>
  );
}

export default ScenesTotals;