import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import floatToFraction from '../../../../Shared/Utils/floatToFraction';
import secondsToMinSec from '../../../../Shared/Utils/secondsToMinSec';
import SceneInfoLabels from '../SceneInfoLabels/SceneInfoLabels';
import { InfoType } from '../../../../Shared/ennums/ennums';
import { isNumberValidator } from '../../../../Shared/Utils/validators';

import { Control, WatchObserver } from 'react-hook-form';

interface SceneBasicInfoProps {
  scene: SceneDocType;
  control: Control<SceneDocType>
  editMode?: boolean;
  watch?: WatchObserver<SceneDocType>;
  setValue?: () => void;
}

const SceneBasicInfo: React.FC<SceneBasicInfoProps> = ({ scene, control, editMode, watch, setValue }) => {
  const fraction = floatToFraction(scene?.pages || 0);

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

  const minutesSeconds = secondsToMinSec(scene?.estimatedSeconds || 0);

  const { minutes } = divideMinutesFromSeconds(minutesSeconds);
  const { seconds } = divideMinutesFromSeconds(minutesSeconds);

  const handleChange = (value: string) => {
    console.log('value', value);
  }

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.episodeNumber ? scene?.episodeNumber : '-'} title="Episode" type={InfoType.Number} validator={isNumberValidator} editMode={editMode} control={control} fieldKeyName="episodeNumber" isEditable/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.sceneNumber ? scene?.sceneNumber : '-'} title="Scene" type={InfoType.Number} validator={isNumberValidator} editMode={editMode} control={control} fieldKeyName="sceneNumber" isEditable/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.scriptDay ? scene?.scriptDay : '-'} title="Script Day" type={InfoType.Text} editMode={editMode} control={control} fieldKeyName="scriptDay" isEditable/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.year ? scene?.year : '-'} title="Year" type={InfoType.Number} editMode={editMode} control={control} fieldKeyName="year" isEditable/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.page ? `${scene?.page}` : '-'} title="Page" type={InfoType.Number} editMode={editMode} control={control} fieldKeyName="page" isEditable/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={integerPart} symbol={fractionPart} title="Pages" type={InfoType.Pages} editMode={editMode} control={control} fieldKeyName="pages" isEditable watch={watch} handleChange={handleChange}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={minutes} symbol={`:${seconds}`} title="Time" type={InfoType.Minutes} editMode={editMode} control={control} fieldKeyName="estimatedSeconds" isEditable watch={watch} handleChange={handleChange}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info="-:--" title="SHOT. TIME" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size-xs="6" size-sm="3">
          <SceneInfoLabels info={scene?.intOrExtOption ? scene?.intOrExtOption : '-'} title="Int/Ext" />
        </IonCol>
        <IonCol size-xs="6" size-sm="3">
          <SceneInfoLabels info={scene?.dayOrNightOption ? scene?.dayOrNightOption : '-'} title="Day/Night" />
        </IonCol>
        <IonCol size-xs="6" size-sm="3">
          <SceneInfoLabels info={scene?.locationName ? scene?.locationName : '-'} title="Location" />
        </IonCol>
        <IonCol size-xs="6" size-sm="3">
          <SceneInfoLabels info={scene?.setName ? scene?.setName : '-'} title="Set" />
        </IonCol>
      </IonRow>
      <IonRow style={{
        backgroundColor: 'var(--ion-color-tertiary-dark)',
      }}
      >
        <IonCol>
          <p style={{ textAlign: 'center', fontSize: '16px' }}><b>{scene?.synopsis}</b></p>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SceneBasicInfo;
