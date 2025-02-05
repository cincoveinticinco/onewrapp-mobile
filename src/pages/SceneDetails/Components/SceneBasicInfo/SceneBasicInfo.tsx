import { IonCol, IonGrid, IonRow } from '@ionic/react';
import SceneInfoLabels, { FormType } from '../SceneInfoLabels/SceneInfoLabels';
import { InfoType, SceneTypeEnum } from '../../../../Shared/ennums/ennums';
import floatToFraction from '../../../../Shared/Utils/floatToFraction';
import secondsToMinSec from '../../../../Shared/Utils/secondsToMinSec';
import { isNumberValidator, isRequiredValidator } from '../../../../Shared/Utils/validators';
import { useEffect } from 'react';
import useSceneDetailForm from '../../hooks/useSceneDetailForm';
import { useSceneFormOptions } from '../../../../hooks/useSceneOptions/useSceneOptions';
import { SceneDocType } from '../../../../Shared/types/scenes.types';

interface SceneBasicInfoProps {
  editMode?: boolean;
  scene?: SceneDocType;
  form: FormType;
}

const SceneBasicInfo: React.FC<SceneBasicInfoProps> = ({ editMode, scene, form }) => {
  const { control, watch, setValue } = form;
  const {
    sceneTypeOptions,
    protectionTypeValues,
    dayNightOptions,
    intExtOptions,
    locationOptions,
    setOptions
  } = useSceneFormOptions();

  const sceneType = watch('sceneType');

  useEffect(() => {
    if (sceneType === SceneTypeEnum.SCENE) {
      setValue('protectionType', null);
    }
  }, [sceneType, setValue]);

  const getDisabled = () => sceneType !== SceneTypeEnum.PROTECTION;

  const fraction = floatToFraction(scene?.pages || 0);
  const [integerPart, fractionPart] = fraction.split(' ');

  const minutesSeconds = secondsToMinSec(scene?.estimatedSeconds || 0);
  const [minutes, seconds] = minutesSeconds.split(':');

  return (
    <IonGrid fixed style={{ width: '100%' }}>
      <IonRow>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Episode", fieldKeyName: "episodeNumber", isEditable: true, disabled: false, info: scene?.episodeNumber || '-'}}
            form={form}
            input={{ type: InfoType.Number, validators: [isNumberValidator], required: true }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Scene", fieldKeyName: "sceneNumber", isEditable: true, disabled: false, info: scene?.sceneNumber || '-' }}
            form={form}
            input={{ type: InfoType.Number, validators: [isNumberValidator], required: true }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Script Day", fieldKeyName: "scriptDay", isEditable: true, disabled: false, info: scene?.scriptDay || '-' }}
            form={form}
            input={{ type: InfoType.Text }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Year", fieldKeyName: "year", isEditable: true, disabled: false, info: scene?.year || '-' }}
            form={form}
            input={{ type: InfoType.Number }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Page", fieldKeyName: "page", isEditable: true, disabled: false, info: scene?.page || '-' }}
            form={form}
            input={{ type: InfoType.Number }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Pages", fieldKeyName: "pages", isEditable: true, disabled: false, symbol: fractionPart, info: integerPart }}
            form={form}
            input={{ type: InfoType.Pages }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Time", fieldKeyName: "estimatedSeconds", isEditable: true, disabled: false, symbol: `:${seconds}`, info: minutes }}
            form={form}
            input={{ type: InfoType.Minutes }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "SHOT. TIME", fieldKeyName: "", isEditable: false, disabled: true, info: "-:--" }}
            form={form}
            input={{ type: InfoType.Text }}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size-xs="6" size-sm="3" sizeLg="1.5">
          <SceneInfoLabels
            label={{ title: "Type", fieldKeyName: "sceneType", isEditable: true, disabled: false, info: scene?.sceneType || '-' }}
            form={form}
            input={{ type: InfoType.Select, selectOptions: sceneTypeOptions, required: true }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg="1.5">
          <SceneInfoLabels
            label={{ title: "Protection", fieldKeyName: "protectionType", isEditable: true, disabled: getDisabled(), info: scene?.protectionType || '-' }}
            form={form}
            input={{ type: InfoType.Select, selectOptions: protectionTypeValues, required: sceneType === SceneTypeEnum.PROTECTION }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg="1.5">
          <SceneInfoLabels
            label={{ title: "Int/Ext", fieldKeyName: "intOrExtOption", isEditable: true, disabled: false, info: scene?.intOrExtOption || '-' }}
            form={form}
            input={{ type: InfoType.Select, selectOptions: intExtOptions }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg="1.5">
          <SceneInfoLabels
            label={{ title: "Day/Night", fieldKeyName: "dayOrNightOption", isEditable: true, disabled: false, info: scene?.dayOrNightOption || '-' }}
            form={form}
            input={{ type: InfoType.Select, selectOptions: dayNightOptions }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="6" sizeLg="3">
          <SceneInfoLabels
            label={{ title: "Location", fieldKeyName: "locationName", isEditable: true, disabled: false, info: scene?.locationName || '-' }}
            form={form}
            input={{ type: InfoType.Select, selectOptions: locationOptions }}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="6" sizeLg="3">
          <SceneInfoLabels
            label={{ title: "Set", fieldKeyName: "setName", isEditable: true, disabled: false, info: scene?.setName || '-'}}
            form={form}
            input={{ type: InfoType.Select, selectOptions: setOptions, required: true  }}
            editMode={editMode}
          />
        </IonCol>
      </IonRow>
      <IonRow style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }}>
        <IonCol size-xs="12">
          <SceneInfoLabels
            label={{ title: "Synopsis", fieldKeyName: "synopsis", isEditable: true, disabled: false, info: scene?.synopsis || '-' }}
            form={form}
            input={{ type: InfoType.LongText }}
            editMode={editMode}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SceneBasicInfo;
