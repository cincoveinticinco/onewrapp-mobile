import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import OutlinePrimaryButton from '../../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import './AddSceneForm.scss';
import AddCharacterForm from './AddSceneFormInputs/AddCharacterForm';
import AddElementForm from './AddSceneFormInputs/AddElementForm';
import AddExtraForm from './AddSceneFormInputs/AddExtraForm';
import AddPagesForm from './AddSceneFormInputs/AddPagesForm';
import AddSecondsForm from './AddSceneFormInputs/AddSecondsForm';
import InputItem from './AddSceneFormInputs/InputItem';
import SelectItem from './AddSceneFormInputs/SelectItem';
import {
  SceneTypeEnum,
} from '../../../Shared/ennums/ennums';
import { IonButton } from '@ionic/react';
import { useSceneFormOptions } from '../../../hooks/useSceneOptions/useSceneOptions';

interface AddScenesFormProps {
  scrollToTop: () => void;
  editMode?: boolean;
  sceneFormId: string;
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;
  formData: any;
  onSubmit: any;
  detailsEditMode?: boolean;
}

const AddScenesForm: React.FC<AddScenesFormProps> = ({
  scrollToTop,
  editMode,
  sceneFormId,
  handleSubmit,
  control,
  errors,
  reset,
  setValue,
  watch,
  formData,
  onSubmit,
  detailsEditMode,
}) => {
  const history = useHistory();

  const {
    sceneTypeOptions,
    protectionTypeValues,
    dayNightOptions,
    intExtOptions,
    locationOptions,
    setOptions
  } = useSceneFormOptions();

  const handleChange = (value: any, field: any) => {
    if (Array.isArray(formData[field])) {
      setValue(field, [...value]);
    } else {
      setValue(field, value);
    }
  };

  useEffect(() => {
    console.log('formData', formData);
  }, [formData])

  const getDisabled = () => (watch('sceneType') !== SceneTypeEnum.PROTECTION);

  const sceneTypeValidation = (value: any) => (value !== null ? true : 'SCENE TYPE IS REQUIRED *');

  const episodeNUmberValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const sceneNumberValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const setNameValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const protectionTypeValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const handleSetValue = (field: string, value: any) => {
    if (value === '') {
      return setValue(field, null);
    }

    return setValue(field, value);
  };

  const closeModal = () => history.goBack();

  useEffect(() => {
    if (watch('sceneType') === SceneTypeEnum.SCENE) {
      setValue('protectionType', null);
    }
  }, [watch('sceneType'), setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="add-scene-form" id={sceneFormId}>

        <SelectItem
          editMode={editMode}
          detailsEditMode={detailsEditMode}
          label="SCENE TYPE *"
          options={sceneTypeOptions}
          inputName="add-scene-type-input"
          displayError={!!errors.sceneType}
          fieldKeyName="sceneType"
          control={control}
          setValue={handleSetValue}
          watchValue={watch}
          validate={sceneTypeValidation}
        />

        <SelectItem
          editMode={editMode}
          detailsEditMode={detailsEditMode}
          label="PROTECTION TYPE"
          disabled={getDisabled()}
          options={protectionTypeValues}
          inputName="add-protection-type-input"
          fieldKeyName="protectionType"
          displayError={!!errors.protectionType && !getDisabled()}
          watchValue={watch}
          control={control}
          validate={getDisabled() ? () => true : protectionTypeValidation}
          setValue={handleSetValue}
        />

        <InputItem
          label="EPISODE *"
          placeholder="EPISODE"
          control={control}
          fieldKeyName="episodeNumber"
          type="number"
          setValue={handleSetValue}
          inputName="add-episode-input"
          displayError={!!errors.episodeNumber}
          validate={episodeNUmberValidation}
        />

        <InputItem
          label="SCENE *"
          placeholder="INSERT"
          control={control}
          fieldKeyName="sceneNumber"
          setValue={handleSetValue}
          inputName="add-scene-number-input"
          displayError={!!errors.sceneNumber}
          validate={sceneNumberValidation}
        />

        <InputItem
          label="SCRIPT DAY"
          placeholder="INSERT"
          control={control}
          fieldKeyName="scriptDay"
          setValue={handleSetValue}
          inputName="add-script-day-input"
        />

        <InputItem
          label="YEAR"
          placeholder="INSERT"
          control={control}
          fieldKeyName="year"
          setValue={handleSetValue}
          inputName="add-year-input"
        />

        <SelectItem
          editMode={editMode}
          detailsEditMode={detailsEditMode}
          label="DAY/NIGHT"
          options={dayNightOptions}
          inputName="add-day-night-input"
          fieldKeyName="dayOrNightOption"
          control={control}
          watchValue={watch}
          setValue={handleSetValue}
        />

        <SelectItem
          editMode={editMode}
          detailsEditMode={detailsEditMode}
          label="INT/EXT"
          options={intExtOptions}
          inputName="add-int-ext-input"
          fieldKeyName="intOrExtOption"
          control={control}
          setValue={handleSetValue}
          watchValue={watch}
        />

        <InputItem
          label="SCRIPT PAGE"
          placeholder="INSERT"
          control={control}
          fieldKeyName="page"
          type="number"
          setValue={handleSetValue}
          inputName="add-page-input"
        />

        <AddPagesForm
          handleChange={handleChange}
          observedField={watch('pages')}
        />

        <AddSecondsForm
          handleChange={handleChange}
          observedField={watch('estimatedSeconds')}
        />

        <SelectItem
          editMode={editMode}
          detailsEditMode={detailsEditMode}
          label="LOCATION"
          control={control}
          fieldKeyName="locationName"
          options={locationOptions}
          inputName="add-location-input"
          watchValue={watch}
          setValue={handleSetValue}
          canCreateNew
        />

        <SelectItem
          editMode={editMode}
          detailsEditMode={detailsEditMode}
          label="SET *"
          control={control}
          fieldKeyName="setName"
          options={setOptions}
          inputName="add-set-input"
          watchValue={watch}
          setValue={handleSetValue}
          canCreateNew
          displayError={!!errors.setName}
          validate={setNameValidation}
        />

        <InputItem
          label="DESCRIPTION/SYNOPSIS"
          placeholder="INSERT"
          control={control}
          fieldKeyName="synopsis"
          setValue={handleSetValue}
          inputName="add-synopsis-input"
        />

        <AddCharacterForm
          handleSceneChange={handleChange}
          observedCharacters={watch('characters')}
          editMode={editMode}
          detailsEditMode={detailsEditMode}
        />

        <AddElementForm
          handleSceneChange={handleChange}
          observedElements={watch('elements')}
          editMode={editMode}
          detailsEditMode={detailsEditMode}
        />

        <AddExtraForm
          handleSceneChange={handleChange}
          observedExtras={watch('extras')}
          editMode={editMode}
          detailsEditMode={detailsEditMode}
        />

        {/* <div color="tertiary">
          Notes
          <IonButton slot='end' fill='clear' color="light">
            <IonIcon icon={add} />
          </IonButton>
        </div> */}
      </form>
      <div className="add-scene-form-buttons"> 
        <OutlinePrimaryButton
          buttonName="SAVE"
          type="button"
          onClick={() => {
            scrollToTop();
            document.getElementById(sceneFormId)?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }}
          color='success'
          className='ion-margin-top save-button'
        />
        <IonButton
          onClick={closeModal}
          className="modal-cancel-button clear-danger-button ion-margin-bottom"
        >
          CANCEL
        </IonButton>
      </div>
    </>
  );
};

export default AddScenesForm;
