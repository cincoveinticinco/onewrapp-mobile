import { IonCol, IonGrid, IonRow } from "@ionic/react"
import { Scene } from "../../interfaces/scenesTypes";
import SceneInfoLabels from "./SceneInfoLabels";
import secondsToMinSec from "../../utils/secondsToMinSec";
import floatToFraction from "../../utils/floatToFraction";

interface SceneBasicInfoProps {
  scene: Scene;
}

const SceneBasicInfo: React.FC<SceneBasicInfoProps> = ({ scene }) => {
  return (
    <IonGrid fixed={true} style={{ width: '100%'}}>
      <IonRow>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.episodeNumber ? scene.episodeNumber : '-'} title='Episode' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.sceneNumber ? scene.sceneNumber : '-'} title='Scene' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.scriptDay ? scene.scriptDay : '-'} title='Script Day' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.year ? scene.year : '-'} title='Year' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.page ? `${scene.page}` : '-'} title='Page' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.pages ? `${floatToFraction(scene.pages)}`: '-'} title='Pages' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info={scene.estimatedSeconds ? secondsToMinSec(scene.estimatedSeconds) : '-'} title='Time' />
        </IonCol>
        <IonCol size-xs='3' size-sm='1.5'>
          <SceneInfoLabels info='-:--' title='SHOT. TIME' />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size-xs='6' size-sm='2'>
          <SceneInfoLabels info={scene.intOrExtOption ? scene.intOrExtOption : '-'} title='Int/Ext' />
        </IonCol>
        <IonCol size-xs='6' size-sm='4'>
          <SceneInfoLabels info={scene.locationName ? scene.locationName : '-'} title='Location' />
        </IonCol>
        <IonCol size-xs='6' size-sm='4'>
          <SceneInfoLabels info={scene.setName ? scene.setName : '-'} title='Set' />
        </IonCol>
        <IonCol size-xs='6' size-sm='2'>
          <SceneInfoLabels info={scene.dayOrNightOption ? scene.dayOrNightOption : '-'} title='Day/Night' />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <p style={{textAlign: 'center', fontSize: '18px'}}><b>{scene.synopsis}</b></p>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default SceneBasicInfo