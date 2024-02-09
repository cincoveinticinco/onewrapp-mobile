import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { useIonToast } from '@ionic/react';
import InputItem from './AddSceneFormInputs/InputItem';
import SelectItem from './AddSceneFormInputs/SelectItem';
import AddCharacterForm from './AddSceneFormInputs/AddCharacterForm';
import AddElementForm from './AddSceneFormInputs/AddElementForm';
import AddExtraForm from './AddSceneFormInputs/AddExtraForm';
import scenesData from '../../data/scn_data.json';
import './AddSceneForm.scss';
import useIsMobile from '../../hooks/useIsMobile';
import AddPagesForm from './AddSceneFormInputs/AddPagesForm';
import AddSecondsForm from './AddSceneFormInputs/AddSecondsForm';
import OutlinePrimaryButton from '../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import OutlineLightButton from '../Shared/OutlineLightButton/OutlineLightButton';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import getUniqueValuesByKey from '../../utils/getUniqueValuesByKey';

import DatabaseContext from '../../context/database';

interface AddScenesFormProps {
  scrollToTop: () => void;
}

const AddScenesForm: React.FC<AddScenesFormProps> = ({ scrollToTop }) => {
  const isMobile = useIsMobile();
  const history = useHistory();
  const projectId = '01';
  const updatedAt = new Date().toISOString();

  const { scenes } = scenesData;

  const getSortedLocationNames = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'locationName'));
  const getSortedSetNames = sortArrayAlphabeticaly(getUniqueValuesByKey(scenes, 'setName'));

  const sceneTypeOptions = ['scene', 'protection'];
  const protectionTypeValues = ['VOICE OFF', 'IMAGE', 'STOCK IMAGE', 'VIDEO', 'STOCK VIDEO', 'MULTIMEDIA', 'OTHER'];
  const dayNightOptions = ['day', 'night', 'sunset', 'sunrise'];
  const intExtOptions = ['INT', 'EXT', 'INT/EXT', 'EXT/INT'];
  const locationOptions = getSortedLocationNames;
  const setOptions = getSortedSetNames;

  const { oneWrapDb } = useContext(DatabaseContext);
  const [presentToast] = useIonToast();

  const createdSceneToast = () => {
    presentToast({
      message: 'Scene Successfully Created',
      duration: 2000,
      icon: checkmarkCircle,
      position: 'top',
      cssClass: 'success-toast',
    });
  };

  const errorToast = (errorMessage: string) => {
    presentToast({
      message: errorMessage,
      duration: 2000,
      position: 'top',
      icon: closeCircle,
      cssClass: 'error-toast',
    });
  };

  const [formData, _]: any[] = useState({
    projectId,
    id: null,
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
    notes: [],
    updatedAt,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,

  } = useForm({ defaultValues: formData });

  const insertScene = async (formData: any) => {
    try {
      formData.id = uuidv4();
  
      const sceneExists = await oneWrapDb?.scenes.findOne({
        selector: {
          projectId,
          episodeNumber: formData.episodeNumber,
          sceneNumber: formData.sceneNumber,
        },
      }).exec();
  
      if (sceneExists) {
        errorToast('Scene already exists');
        scrollToTop();
        return;
      }
  
      console.log('Inserting scene:', formData);
      await oneWrapDb?.scenes.insert(formData);
      createdSceneToast();
  
      reset();
      history.push('/my/projects/01/strips');
    } catch (error: any) {
      console.log('Error inserting scene:', error);
      errorToast(error ? error.message : 'Error inserting scene');
      scrollToTop();
    }

    scrollToTop()
  };

  const handleChange = (value: any, field: any) => {
    if (Array.isArray(formData[field])) {
      setValue(field, [...value]);
    } else {
      setValue(field, value);
    }
  };

  const onSubmit = (formData: any): void => {
    insertScene(formData)
  };

  const getDisabled = () => (watch('sceneType') !== 'protection');

  const sceneTypeValidation = (value: any) => (value !== null ? true : 'SCENE TYPE IS REQUIRED *');

  const episodeNUmberValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const sceneNumberValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const setNameValidation = (value: any) => (value !== null ? true : 'REQUIRED *');

  const handleSetValue = (field: string, value: any) => {
    if (value === '') {
      return setValue(field, null);
    }

    return setValue(field, value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-scene-form">

      <SelectItem
        label="SCENE TYPE *"
        options={sceneTypeOptions}
        inputName="add-scene-type-input"
        displayError={!!errors.sceneType}
        fieldName="sceneType"
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
        fieldName="sceneNumber"
        setValue={handleSetValue}
        inputName="add-scene-number-input"
        displayError={!!errors.sceneNumber}
        validate={sceneNumberValidation}
      />

      <InputItem
        label="SCRIPT DAY"
        placeholder="INSERT"
        control={control}
        fieldName="scriptDay"
        setValue={handleSetValue}
        inputName="add-script-day-input"
      />

      <InputItem
        label="YEAR"
        placeholder="INSERT"
        control={control}
        fieldName="year"
        setValue={handleSetValue}
        inputName="add-year-input"
      />

      <SelectItem
        label="DAY/NIGHT"
        options={dayNightOptions}
        inputName="add-day-night-input"
        fieldName="dayOrNightOption"
        control={control}
        watchValue={watch}
        setValue={handleSetValue}
      />

      <SelectItem
        label="INT/EXT"
        options={intExtOptions}
        inputName="add-int-ext-input"
        fieldName="intOrExtOption"
        control={control}
        setValue={handleSetValue}
        watchValue={watch}
      />

      <InputItem
        label="SCRIPT PAGE"
        placeholder="INSERT"
        control={control}
        fieldName="page"
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
        label="LOCATION"
        control={control}
        fieldName="locationName"
        options={locationOptions}
        inputName="add-location-input"
        watchValue={watch}
        setValue={handleSetValue}
        canCreateNew
      />

      <SelectItem
        label="SET *"
        control={control}
        fieldName="setName"
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
        fieldName="synopsis"
        setValue={handleSetValue}
        inputName="add-synopsis-input"
      />

      <AddCharacterForm
        handleSceneChange={handleChange}
        observedCharacters={watch('characters')}
      />

      <AddElementForm
        handleSceneChange={handleChange}
        observedElements={watch('elements')}
      />

      <AddExtraForm
        handleSceneChange={handleChange}
        observedExtras={watch('extras')}
      />

      {/* <div color="tertiary">
        Notes
        <IonButton slot='end' fill='clear' color="light">
          <IonIcon icon={add} />
        </IonButton>
      </div> */}

      <OutlinePrimaryButton
        buttonName="SAVE"
        className="submit-scene-button"
        type="submit"
        onClick={() => {
          scrollToTop();
        }}
      />
      {
        isMobile
        && (
        <OutlineLightButton
          buttonName="CANCEL"
          onClick={() => history.goBack()}
          className="cancel-add-scene-button cancel-button"
        />
        )
      }
    </form>
  );
};

export default AddScenesForm;
