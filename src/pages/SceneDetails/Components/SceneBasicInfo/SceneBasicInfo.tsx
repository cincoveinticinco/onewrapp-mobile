import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import floatToFraction from '../../../../Shared/Utils/floatToFraction';
import secondsToMinSec from '../../../../Shared/Utils/secondsToMinSec';
import SceneInfoLabels from '../SceneInfoLabels/SceneInfoLabels';
import { InfoType, SceneTypeEnum } from '../../../../Shared/ennums/ennums';
import { isNumberValidator } from '../../../../Shared/Utils/validators';

import { Control, UseFormWatch } from 'react-hook-form';
import { useSceneFormOptions } from '../../../../hooks/useSceneOptions/useSceneOptions';
import { useEffect } from 'react';

interface SceneBasicInfoProps {
  scene: SceneDocType;
  control: Control<SceneDocType>;
  editMode?: boolean;
  watch: UseFormWatch<SceneDocType>;
  setValue: (field: keyof SceneDocType, value: any) => void;
}

const SceneBasicInfo: React.FC<SceneBasicInfoProps> = ({ scene, control, editMode, watch, setValue }) => {

  useEffect(() => {
    if (watch && watch('sceneType') === SceneTypeEnum.SCENE) {
      setValue('protectionType', null);
    }
  }, [watch ? watch('sceneType') : undefined, setValue]);

  const getDisabled = () => (watch && watch('sceneType') !== SceneTypeEnum.PROTECTION);

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

  const handleChange = (value: any, field: any) => {
    setValue(field, value);
  };


  const {
    sceneTypeOptions,
    protectionTypeValues,
    dayNightOptions,
    intExtOptions,
    locationOptions,
    setOptions
  } = useSceneFormOptions();

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.episodeNumber ? scene?.episodeNumber : '-'} title="Episode" type={InfoType.Number} validator={isNumberValidator} editMode={editMode} control={control} fieldKeyName="episodeNumber" isEditable setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.sceneNumber ? scene?.sceneNumber : '-'} title="Scene" type={InfoType.Number} validator={isNumberValidator} editMode={editMode} control={control} fieldKeyName="sceneNumber" isEditable setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.scriptDay ? scene?.scriptDay : '-'} title="Script Day" type={InfoType.Text} editMode={editMode} control={control} fieldKeyName="scriptDay" isEditable setValue={setValue} />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.year ? scene?.year : '-'} title="Year" type={InfoType.Number} editMode={editMode} control={control} fieldKeyName="year" isEditable setValue={setValue} />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={scene?.page ? `${scene?.page}` : '-'} title="Page" type={InfoType.Number} editMode={editMode} control={control} fieldKeyName="page" isEditable setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={integerPart} symbol={fractionPart} title="Pages" type={InfoType.Pages} editMode={editMode} control={control} fieldKeyName="pages" isEditable watch={watch} setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info={minutes} symbol={`:${seconds}`} title="Time" type={InfoType.Minutes} editMode={editMode} control={control} fieldKeyName="estimatedSeconds" isEditable watch={watch} setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels info="-:--" title="SHOT. TIME" setValue={setValue}/>
        </IonCol>
      </IonRow>
      <IonRow>
      <IonCol size-xs="6" size-sm="3" sizeLg='1.5'>
          <SceneInfoLabels info={scene?.sceneType ? scene?.sceneType : '-'} title="Type" type={InfoType.Select} editMode={editMode} control={control} fieldKeyName="sceneType" isEditable selectOptions={sceneTypeOptions} watch={watch} setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg='1.5'>
          <SceneInfoLabels info={scene?.protectionType ? scene?.protectionType : '-'} title="Protection" type={InfoType.Select} editMode={editMode} control={control} fieldKeyName="protectionType" isEditable selectOptions={protectionTypeValues} watch={watch} setValue={setValue} disabled={getDisabled()}/>
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg='1.5'>
          <SceneInfoLabels info={scene?.intOrExtOption ? scene?.intOrExtOption : '-'} title="Int/Ext" type={InfoType.Select} editMode={editMode} control={control} fieldKeyName="intOrExtOption" isEditable selectOptions={intExtOptions} watch={watch} setValue={setValue} />
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg='1.5'>
          <SceneInfoLabels info={scene?.dayOrNightOption ? scene?.dayOrNightOption : '-'} title="Day/Night" type={InfoType.Select} editMode={editMode} control={control} fieldKeyName="dayOrNightOption" isEditable selectOptions={dayNightOptions} watch={watch} setValue={setValue} />
        </IonCol>
        <IonCol size-xs="6" size-sm="6" sizeLg='3'>
          <SceneInfoLabels info={scene?.locationName ? scene?.locationName : '-'} title="Location" type={InfoType.Select} editMode={editMode} control={control} fieldKeyName="locationName" isEditable selectOptions={locationOptions}  watch={watch} setValue={setValue}/>
        </IonCol>
        <IonCol size-xs="6" size-sm="6" sizeLg='3'>
          <SceneInfoLabels info={scene?.setName ? scene?.setName : '-'} title="Set" type={InfoType.Select} editMode={editMode} control={control} fieldKeyName="setName" isEditable selectOptions={setOptions} watch={watch} setValue={setValue}/>
        </IonCol>
      </IonRow>
      <IonRow style={{
        backgroundColor: 'var(--ion-color-tertiary-dark)',
      }}
      >
      <IonCol size-xs="12">
        <SceneInfoLabels info={scene?.synopsis ? scene?.synopsis : '-'} title="Synopsis" type={InfoType.LongText} editMode={editMode} control={control} fieldKeyName="synopsis" isEditable setValue={setValue}/>
      </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SceneBasicInfo;
