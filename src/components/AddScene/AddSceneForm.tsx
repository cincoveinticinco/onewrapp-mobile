import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import InputItem from './AddSceneFormInputs/InputItem';
import SelectItem from './AddSceneFormInputs/SelectItem';
import SelectOrInsertItem from './AddSceneFormInputs/SelectOrInsertItem';
import AddCharacterForm from './AddSceneFormInputs/AddCharacterForm';
import AddElementForm from './AddSceneFormInputs/AddElementForm';
import AddExtraForm from './AddSceneFormInputs/AddExtraForm';

import './AddSceneForm.scss';
import useIsMobile from '../../hooks/useIsMobile';
import AddPagesForm from './AddSceneFormInputs/AddPagesForm';
import AddSecondsForm from './AddSceneFormInputs/AddSecondsForm';

const AddScenesForm: React.FC = () => {
  const isMobile = useIsMobile();
  const history = useHistory();

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
    // register,
    handleSubmit,
    // formState: { errors },
    // getValues,
  } = useForm();

  const handleChange = (value: any, field: any) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...new Set([...(formData[field] || []), ...[].concat(value)])],
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const onSubmit = (): void => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-scene-form">
      <SelectItem
        label="SCENE TYPE *"
        value={formData.sceneType}
        onChange={(e) => handleChange(e.detail.value, 'sceneType')}
        options={[
          { label: 'Scene', value: 'scene' },
          { label: 'Protection', value: 'protection' },
        ]}
        inputName="add-scene-type-input"
      />

      <SelectItem
        label="PROTECTION TYPE"
        value={formData.protectionType}
        onChange={(e) => handleChange(e.detail.value, 'protectionType')}
        disabled={formData.sceneType !== 'protection'}
        options={[
          { label: 'Voice Off', value: 'voice Off' },
          { label: 'Image', value: 'image' },
          { label: 'Stock Image', value: 'stock image' },
          { label: 'Video', value: 'video' },
          { label: 'Stock Video', value: 'stock video' },
          { label: 'Multimedia', value: 'multimedia' },
          { label: 'Other', value: 'other' },
        ]}
        inputName="add-protection-type-input"
      />

      <InputItem
        label="EPISODE *"
        placeholder="INSERT"
        value={formData.episodeNumber}
        onChange={(e) => handleChange(e.detail.value, 'episodeNumber')}
        inputName="add-episode-input"
      />

      <InputItem
        label="SCENE *"
        placeholder="INSERT"
        value={formData.sceneNumber}
        onChange={(e) => handleChange(e.detail.value, 'sceneNumber')}
        inputName="add-scene-number-input"
      />

      <InputItem
        label="SCRIPT DAY"
        placeholder="INSERT"
        value={formData.scriptDay}
        onChange={(e) => handleChange(e.detail.value, 'scriptDay')}
        inputName="add-script-day-input"
      />

      <InputItem
        label="YEAR"
        placeholder="INSERT"
        value={formData.year}
        onChange={(e) => handleChange(e.detail.value, 'year')}
        inputName="add-year-input"
      />

      <SelectItem
        label="DAY/NIGHT"
        value={formData.dayOrNightOption}
        onChange={(e) => handleChange(e.detail.value, 'dayOrNightOption')}
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Night', value: 'night' },
          { label: 'Sunset', value: 'sunset' },
          { label: 'Sunrise', value: 'sunrise' },
        ]}
        inputName="add-day-night-input"
      />

      <SelectItem
        label="INT/EXT"
        value={formData.intOrExtOption}
        onChange={(e) => handleChange(e.detail.value, 'intOrExtOption')}
        options={[
          { label: 'Interior', value: 'INT' },
          { label: 'Exterior', value: 'EXT' },
          { label: 'Interior/Exterior', value: 'INT/EXT' },
          { label: 'Exterior/Interior', value: 'EXT/INT' },
        ]}
        inputName="add-int-ext-input"
      />

      <InputItem
        label="SCRIPT PAGE"
        placeholder="INSERT"
        value={formData.page}
        onChange={(e) => handleChange(e.detail.value, 'page')}
        inputName="add-page-input"
      />

      <AddPagesForm
        handleChange={handleChange}
      />

      <AddSecondsForm
        handleChange={handleChange}
      />

      {/* 12FR */}

      <SelectOrInsertItem
        label="LOCATION"
        selectValue={formData.locationName}
        inputPlaceholder="INSERT LOCATION NAME"
        onInputChange={(e) => handleChange(e.detail.value, 'locationName')}
        onSelectChange={(e) => handleChange(e.detail.value, 'locationName')}
        options={[
          { label: 'Option 1', value: 'option 1' },
          { label: 'Option 2', value: 'option 2' },
          // THIS VALUE CAN BE EXTRACTEED FROM SCENES
        ]}
        inputName="add-location-input"
      />

      <SelectOrInsertItem
        label="SET"
        selectValue={formData.setName}
        inputPlaceholder="INSERT SET NAME"
        onInputChange={(e) => handleChange(e.detail.value, 'setName')}
        onSelectChange={(e) => handleChange(e.detail.value, 'setName')}
        options={[
          { label: 'Option 1', value: 'option 1' },
          { label: 'Option 2', value: 'option 2' },
          // THIS VALUE CAN BE EXTRACTEED FROM SCENES
        ]}
        inputName="add-set-input"
      />

      <InputItem
        label="DESCRIPTION/SYNOPSIS"
        placeholder="INSERT"
        value={formData.synopsis}
        onChange={(e) => handleChange(e.detail.value, 'synopsis')}
        inputName="add-synopsis-input"
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

      <button
        className="submit-scene-button"
        type="submit"
        color="tertiary"

      >
        SAVE
      </button>
      {
        isMobile
        && (
        <button
          className="cancel-add-scene-button"
          type="submit"
          color="tertiary"
          onClick={() => history.goBack()}
        >
          CANCEL
        </button>
        )
      }
    </form>
  );
};

export default AddScenesForm;
