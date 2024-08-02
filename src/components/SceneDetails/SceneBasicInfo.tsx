import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { Scene } from '../../interfaces/scenes.types';
import SceneInfoLabels from './SceneInfoLabels';
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';

interface SceneBasicInfoProps {
  scene: Scene;
}

const SceneBasicInfo: React.FC<SceneBasicInfoProps> = ({ scene }) => {
  const fraction = floatToFraction(scene.pages || 0);

  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ');
    return {
      integer,
      fraction,
    };
  };

  const fractionPart = divideIntegerFromFraction(fraction).fraction;
  const integerPart = divideIntegerFromFraction(fraction).integer;

  const divideMinutesFromSeconds = (value: string) => {
    // 24:00
    const [minutes, seconds] = value.split(':');
    return {
      minutes,
      seconds,
    };
  };

  const minutesSeconds = secondsToMinSec(scene.estimatedSeconds || 0);

  const { minutes } = divideMinutesFromSeconds(minutesSeconds);
  const { seconds } = divideMinutesFromSeconds(minutesSeconds);

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={scene.episodeNumber ? scene.episodeNumber : '-'} title="Episode" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={scene.sceneNumber ? scene.sceneNumber : '-'} title="Scene" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={scene.scriptDay ? scene.scriptDay : '-'} title="Script Day" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={scene.year ? scene.year : '-'} title="Year" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={scene.page ? `${scene.page}` : '-'} title="Page" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={integerPart} symbol={fractionPart} title="Pages" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info={minutes} symbol={`:${seconds}`} title="Time" />
        </IonCol>
        <IonCol size-xs="3" size-sm="1.5">
          <SceneInfoLabels info="-:--" title="SHOT. TIME" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size-xs="6" size-sm="2">
          <SceneInfoLabels info={scene.intOrExtOption ? scene.intOrExtOption : '-'} title="Int/Ext" />
        </IonCol>
        <IonCol size-xs="6" size-sm="4">
          <SceneInfoLabels info={scene.locationName ? scene.locationName : '-'} title="Location" />
        </IonCol>
        <IonCol size-xs="6" size-sm="4">
          <SceneInfoLabels info={scene.setName ? scene.setName : '-'} title="Set" />
        </IonCol>
        <IonCol size-xs="6" size-sm="2">
          <SceneInfoLabels info={scene.dayOrNightOption ? scene.dayOrNightOption : '-'} title="Day/Night" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <p style={{ textAlign: 'center', fontSize: '16px' }}><b>{scene.synopsis}</b></p>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SceneBasicInfo;
