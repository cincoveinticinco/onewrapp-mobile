import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import InputItem from './AddSceneFormInputs/InputItem';
import SelectItem from './AddSceneFormInputs/SelectItem';
import SelectOrInsertItem from './AddSceneFormInputs/SelectOrInsertItem';
import AddCharacterForm from './AddSceneFormInputs/AddCharacterForm';
import AddElementForm from './AddSceneFormInputs/AddElementForm';
import AddExtraForm from './AddSceneFormInputs/AddExtraForm';
import scenesData from '../../data/scn_data.json'
import './AddSceneForm.scss';
import useIsMobile from '../../hooks/useIsMobile';
import AddPagesForm from './AddSceneFormInputs/AddPagesForm';
import AddSecondsForm from './AddSceneFormInputs/AddSecondsForm';
import OutlinePrimaryButton from '../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../Shared/OutlineLightButton/OutlineLightButton';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';

const AddScenesForm: React.FC = () => {
  const isMobile = useIsMobile();
  const history = useHistory();

  const { scenes } = scenesData;

  const [formData, setFormData]: any[] = useState({
    id: null,
    projectId: null,
    episodeNumber: null,
    sceneNumber: null,
    sceneType: null,
    protectionType: null,
    intOrExtOption: null,
    dayOrNightOption: null,
    locationName: null,
    setName: null,
    scriptDay: null,
    year: null,
    synopsis: null,
    page: null,
    pages: null,
    estimatedSeconds: null,
    characters: null,
    extras: null,
    elements: null,
    notes: null,
    updatedAt: null,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    getFieldState,
    watch
  } = useForm({ defaultValues: formData });

  const handleChange = (value: any, field: any) => {
    if (Array.isArray(formData[field])) {
      setValue(field, [...value]);
    } else {
      setValue(field, value);
    }
  };

  const onSubmit = (formData: any): void => {
    console.log(['ERRORS'], errors)
    console.log(['FORM DATA'], formData)
  };

  const getDisabled = () => {
    return watch('sceneType') === 'protection' ? false : true;
  }

  let formErrors = watch('errors');

  const sceneTypeValidation = (value: any) => {
    return value !== null ? true : 'Scene Type is required *';
  }

  const episodeNUmberValidation = (value: any) => {
    return value !== null ? true : 'required *';
  }

  const sceneNumberValidation = (value: any) => {
    return value !== null ? true : 'required *';
  }

  useEffect(() => {
    console.log(['FORM ERRORS'], formErrors)
  }, [formErrors]);

  const handleSetValue = (field: string, value: any) => {
    if(value === "") {
      return setValue(field, null);
    }

    return setValue(field, value);
  }

  const getSortedLocationNames = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'locationName'));
  const getSortedSetNames = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'setName'));

  const sceneTypeOptions = ["scene", "protection"];
  const protectionTypeValues = ["voice Off", "image", "stock image", "video", "stock video", "multimedia", "other"];
  const dayNightOptions = ["day", "night", "sunset", "sunrise"];
  const intExtOptions = ["INT", "EXT", "INT/EXT", "EXT/INT"];
  const locationOptions = getSortedLocationNames;
  const setOptions = getSortedSetNames;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-scene-form">
      
      <SelectItem
        label="SCENE TYPE *"
        options={sceneTypeOptions}
        inputName="add-scene-type-input"
        displayError={errors['sceneType'] ? true : false}
        fieldName='sceneType'
        control={control}
        setValue={handleSetValue}
        watchValue={watch}
        validate={sceneTypeValidation}
      />

      <SelectItem
        label="PROTECTION TYPE"
        disabled={getDisabled()}
        options={protectionTypeValues}
        inputName="add-protection-type-input"
        fieldName="protectionType"
        watchValue={watch}
        control={control}
        setValue={handleSetValue}
      />

      <InputItem
        label="EPISODE *"
        placeholder="EPISODE"
        control={control}
        fieldName="episodeNumber"
        setValue={handleSetValue}
        inputName="add-episode-input"
        displayError={errors['episodeNumber'] ? true : false}
        validate={episodeNUmberValidation}
        watch={watch}
      />

      <InputItem
        label="SCENE *"
        placeholder="INSERT"
        control={control}
        fieldName="sceneNumber"
        setValue={handleSetValue}
        inputName="add-scene-number-input"
        displayError={errors['sceneNumber'] ? true : false}
        validate={sceneNumberValidation}
        watch={watch}
      />

      <InputItem
        label="SCRIPT DAY"
        placeholder="INSERT"
        control={control}
        fieldName="scriptDay"
        setValue={handleSetValue}
        inputName="add-script-day-input"
        watch={watch}
      />

      <InputItem
        label="YEAR"
        placeholder="INSERT"
        control={control}
        fieldName="year"
        setValue={handleSetValue}
        inputName="add-year-input"
        watch={watch}
      />

      <SelectItem
        label="DAY/NIGHT"
        options={dayNightOptions}
        inputName="add-day-night-input"
        fieldName='dayOrNightOption'
        control={control}
        watchValue={watch}
        setValue={handleSetValue}
      />

      <SelectItem
        label="INT/EXT"
        options={intExtOptions}
        inputName="add-int-ext-input"
        fieldName='intOrExtOption'
        control={control}
        setValue={handleSetValue}
        watchValue={watch}
      />

      <InputItem
        label="SCRIPT PAGE"
        placeholder="INSERT"
        control={control}
        fieldName="scriptPage"
        setValue={handleSetValue}
        inputName="add-page-input"
        watch={watch}
      />

      <AddPagesForm
        handleChange={handleChange}
      />

      <AddSecondsForm
        handleChange={handleChange}
      />

      <SelectItem
        label="LOCATION"
        control={control}
        fieldName="locationName"
        options={locationOptions}
        inputName="add-location-input"
        watchValue={watch}
        setValue={handleSetValue}
        canCreateNew={true}
      />

      <SelectItem
        label="SET"
        control={control}
        fieldName="setName"
        options={setOptions}
        inputName="add-set-input"
        watchValue={watch}
        setValue={handleSetValue}
        canCreateNew={true}
      />

      <InputItem
        label="DESCRIPTION/SYNOPSIS"
        placeholder="INSERT"
        control={control}
        fieldName="synopsis"
        setValue={handleSetValue} 
        inputName="add-synopsis-input"
        watch={watch}
      />

      <AddCharacterForm handleSceneChange={handleChange} />

      <AddElementForm handleSceneChange={handleChange} />

      <AddExtraForm handleSceneChange={handleChange} />

      {/* <div color="tertiary">
        Notes
        <IonButton slot='end' fill='clear' color="light">
          <IonIcon icon={add} />
        </IonButton>
      </div> */}

      <OutlinePrimaryButton
        buttonName="SAVE"
        className='submit-scene-button'
        type="submit"
        onClick={() => onSubmit(getValues())}
      />
      {
        isMobile
        && (
        <OutlineLightButton
          buttonName="CANCEL"
          onClick={() => history.goBack()}
          className='cancel-add-scene-button cancel-button'
        />
        )
      }
    </form>
  );
};

export default AddScenesForm;
