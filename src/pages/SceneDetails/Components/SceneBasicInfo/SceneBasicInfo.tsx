import { IonCol, IonGrid, IonRow } from '@ionic/react';
import SceneInfoLabels, { FormType } from '../SceneInfoLabels/SceneInfoLabels';
import { InfoType, SceneTypeEnum } from '../../../../Shared/ennums/ennums';
import { isNumberValidator } from '../../../../Shared/Utils/validators';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSceneFormOptions } from '../../../../hooks/useSceneOptions/useSceneOptions';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import { set } from 'lodash';

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
    setOptions,
    setSelectedLocation,
    selectedLocation
  } = useSceneFormOptions();

  const [locationOptionsCopy, setLocationOptionsCopy] = useState(locationOptions);
  const [setOptionsCopy, setSetOptionsCopy] = useState(setOptions);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAutoSettingLocation, setIsAutoSettingLocation] = useState(false);
  const [isLocationChange, setIsLocationChange] = useState(false);
  const previousLocationRef = useRef<string | null>(null);
  const protectionInputRef = useRef<any>(null);

  useEffect(() => {
    setLocationOptionsCopy(locationOptions);
    setSetOptionsCopy(setOptions);
  }, [locationOptions, setOptions]);

  const [showProtection, setShowProtection] = useState(false);

  const sceneType = watch('sceneType');
  const location = watch('locationName');
  const currentSet = watch('setName');

  useEffect(() => {
    if (sceneType === SceneTypeEnum.SCENE) {
      setValue('protectionType', null);
      setShowProtection(false);
    } else {
      setShowProtection(true);
    }
  }, [sceneType, setValue]);

  useEffect(() => {
    if (!isInitialized && scene?.locationName) {
      setSelectedLocation(scene.locationName);
      previousLocationRef.current = scene.locationName;
      setIsInitialized(true);
      return;
    }

    if (location !== previousLocationRef.current) {
      setSelectedLocation(location || null);
      previousLocationRef.current = location || null;

      if (location !== scene?.locationName && !isAutoSettingLocation) {
        setIsLocationChange(true);
        setValue('setName', null);
        setTimeout(() => {
          setIsLocationChange(false);
        }, 100);
      }
    }
  }, [location, setSelectedLocation, setValue, scene?.locationName, isInitialized, isAutoSettingLocation]);

  useEffect(() => {
    console.log('here')
    if (!currentSet || isLocationChange) {
      return;
    }

    if (currentSet && (!location || location === '')) {
      const relatedLocation = setOptions.find(
        (location) => location.options.some((set) => set.value === currentSet)
      )?.category;

      if (relatedLocation) {
        setIsAutoSettingLocation(true);
        setValue('locationName', relatedLocation);
        
        setTimeout(() => {
          setIsAutoSettingLocation(false);
        }, 100);
      }
    }
  }, [currentSet, setOptions, setValue, isLocationChange]);

  const getDisabled = () => sceneType !== SceneTypeEnum.PROTECTION;
  const sizeLg = showProtection ? "3" : "4";

  const memoizedSetLabel = useMemo(() => {
    return (
      <SceneInfoLabels
        label={{ title: "Set", fieldKeyName: "setName", isEditable: true, disabled: false, info: scene?.setName || '-' }}
        form={form}
        input={{ 
          selectOptions: setOptionsCopy, 
          required: true, 
          canCreateNew: true, 
          setSelectOptions: setSetOptionsCopy, 
          selectedCategory: (selectedLocation || ''), 
          multiple: false, 
          customCategoryLabel: 'Location' 
        }}
        type={InfoType.CategorizedSelect}
        editMode={editMode}
      />
    )
  }, [selectedLocation, setOptionsCopy, form, scene, editMode]);

  return (
    <IonGrid fixed style={{ width: '100%', marginTop: '12px' }}>
      <IonRow>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Episode", fieldKeyName: "episodeNumber", isEditable: true, disabled: false, info: scene?.episodeNumber || '-' }}
            form={form}
            input={{ validators: [isNumberValidator], required: true }}
            type={InfoType.Number}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Scene", fieldKeyName: "sceneNumber", isEditable: true, disabled: false, info: scene?.sceneNumber || '-' }}
            form={form}
            input={{ validators: [isNumberValidator], required: true }}
            type={InfoType.Number}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Script Day", fieldKeyName: "scriptDay", isEditable: true, disabled: false, info: scene?.scriptDay || '-' }}
            form={form}
            type={InfoType.Text}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Year", fieldKeyName: "year", isEditable: true, disabled: false, info: scene?.year || '-' }}
            form={form}
            type={InfoType.Number}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Page", fieldKeyName: "page", isEditable: true, disabled: false, info: scene?.page || '-' }}
            form={form}
            type={InfoType.Number}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Pages", fieldKeyName: "pages", isEditable: true, disabled: false, info: scene?.pages || 0 }}
            form={form}
            type={InfoType.Pages}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "Time", fieldKeyName: "estimatedSeconds", isEditable: true, disabled: false, info: scene?.estimatedSeconds || 0 }}
            form={form}
            type={InfoType.Minutes}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="3" size-sm="3" size-md="3" size-lg="1.5">
          <SceneInfoLabels
            label={{ title: "SHOT. TIME", fieldKeyName: "", isEditable: false, disabled: true, info: "-:--" }}
            form={form}
            type={InfoType.Text}
            editMode={editMode}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size-xs="6" size-sm="3" sizeLg={sizeLg}>
          <SceneInfoLabels
            label={{ title: "Type", fieldKeyName: "sceneType", isEditable: true, disabled: false, info: scene?.sceneType || '-' }}
            form={form}
            input={{ selectOptions: sceneTypeOptions, required: true }}
            type={InfoType.Select}
            editMode={editMode}
          />
        </IonCol>
        {showProtection && (
          <IonCol size-xs="6" size-sm="3" sizeLg={sizeLg}>
            <SceneInfoLabels
              label={{ title: "Protection", fieldKeyName: "protectionType", isEditable: true, disabled: getDisabled(), info: scene?.protectionType || '-' }}
              form={form}
              input={{ selectOptions: protectionTypeValues, required: sceneType === SceneTypeEnum.PROTECTION, ref: protectionInputRef }}
              type={InfoType.Select}
              editMode={editMode}
            />
          </IonCol>
        )}
        <IonCol size-xs="6" size-sm="3" sizeLg={sizeLg}>
          <SceneInfoLabels
            label={{ title: "Int/Ext", fieldKeyName: "intOrExtOption", isEditable: true, disabled: false, info: scene?.intOrExtOption || '-' }}
            form={form}
            input={{ selectOptions: intExtOptions }}
            type={InfoType.Select}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="3" sizeLg={sizeLg}>
          <SceneInfoLabels
            label={{ title: "Day/Night", fieldKeyName: "dayOrNightOption", isEditable: true, disabled: false, info: scene?.dayOrNightOption || '-' }}
            form={form}
            input={{ selectOptions: dayNightOptions }}
            type={InfoType.Select}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="6" sizeLg="6">
          <SceneInfoLabels
            label={{ title: "Location", fieldKeyName: "locationName", isEditable: true, disabled: false, info: scene?.locationName || '-' }}
            form={form}
            input={{ selectOptions: locationOptionsCopy, canCreateNew: true, setSelectOptions: setLocationOptionsCopy }}
            type={InfoType.Select}
            editMode={editMode}
          />
        </IonCol>
        <IonCol size-xs="6" size-sm="6" sizeLg="6">
          {memoizedSetLabel}
        </IonCol>
      </IonRow>
      <IonRow style={{ backgroundColor: 'var(--ion-color-tertiary-dark)' }}>
        <IonCol size-xs="12">
          <SceneInfoLabels
            label={{ title: "Synopsis", fieldKeyName: "synopsis", isEditable: true, disabled: false, info: scene?.synopsis || '-' }}
            form={form}
            type={InfoType.LongText}
            editMode={editMode}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SceneBasicInfo;
