import { IonHeader, IonToolbar } from "@ionic/react";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import SceneCard, { SceneCardDisplayOptions } from "../../../../Shared/Components/cards/SceneCard/SceneCard";

const ScenesList = ({ 
  scenes, 
  scenesToDisplay, 
  title, 
  displayOptions 
}: { 
  scenes: SceneDocType[], 
  scenesToDisplay: number, 
  title: string,
  displayOptions: Partial<SceneCardDisplayOptions>
}) => {
  return (
    <div style={{overflowY: 'auto'}}>
      <IonHeader color='dark'>
        <IonToolbar style={{height: '30px'}} className='border-light ion-flex ion-justify-content-center ion-align-items-center'>
          <p className='ion-padding'>{title}</p>
        </IonToolbar>
      </IonHeader>
      {scenes.slice(0, scenesToDisplay).map((scene) => (
        <SceneCard 
          scene={scene} 
          key={scene.id} 
          displayOptions={displayOptions}
        />
      ))}
    </div>
  );
}

export default ScenesList;