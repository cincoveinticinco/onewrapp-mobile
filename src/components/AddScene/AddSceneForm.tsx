import React, { useState } from 'react';
import { IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';

import InputItem from './InputItem';
import SelectItem from './SelectItem';
import SelectOrInsertItem from './SelectOrInsertItem';
import { add } from 'ionicons/icons';
import AddCategoryForm from './AddCategoryForm';

const AddScenesForm = () => {
  const [formData, setFormData] = useState({
      id: null,
      projectId: null,
      episodeNumber: null,
      sceneNumber: null,
      sceneType: "scene",
      protectionType: null,
      intOrExtOption: null,
      dayOrNightOption: "day",
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
      updatedAt: null
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleChange = (value: any, field: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const onSubmit = (): void => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonList>
        <SelectItem
          label="TYPE *"
          value={formData.sceneType}
          onChange={(e) => handleChange(e.detail.value, 'sceneType')}
          options={[
            { label: "SCENE", value: "scene" },
            { label: "PROTECTION", value: "protection" }
          ]}
        />

        <SelectItem
          label="PROTECTION TYPE"
          value={formData.protectionType}
          onChange={(e) => handleChange(e.detail.value, 'protectionType')}
          disabled={formData.sceneType !== 'protection'}
          options={[
            { label: "Voice Off", value: "voice Off" },
            { label: "Image", value: "image" },
            { label: "Stock Image", value: "stock image" },
            { label: "Video", value: "video" },
            { label: "Stock Video", value: "stock video" },
            { label: "Multimedia", value: "multimedia" },
            { label: "Other", value: "other" }
          ]}
        />

        <SelectItem
          label="Day/Night"
          value={formData.dayOrNightOption}
          onChange={(e) => handleChange(e.detail.value, 'dayOrNightOption')}
          options={[
            { label: "DAY", value: "day" },
            { label: "NIGHT", value: "night" },
            { label: "SUNSET", value: "sunset" },
            { label: "SUNRISE", value: "sunrise" }
          ]}
        />

        <SelectItem
          label="Interior/Exterior"
          value={formData.intOrExtOption}
          onChange={(e) => handleChange(e.detail.value, 'intOrExtOption')}
          options={[
            { label: "INTERIOR", value: "INT" },
            { label: "EXTERIOR", value: "EXT" },
            { label: "INTERIOR/EXTERIOR", value: "INT/EXT" },
            { label: "EXTERIOR/INTERIOR", value: "EXT/INT" }
          ]}
        />

        <InputItem
          label="EPISODE *"
          placeholder="INSERT"
          value={formData.episodeNumber}
          onChange={(e) => handleChange(e.detail.value, 'episodeNumber')}
        />

        <InputItem
          label="SCENE *"
          placeholder="INSERT"
          value={formData.sceneNumber}
          onChange={(e) => handleChange(e.detail.value, 'sceneNumber')}
        />

        <InputItem
          label="SCRIPT DAY"
          placeholder="INSERT"
          value={formData.scriptDay}
          onChange={(e) => handleChange(e.detail.value, 'scriptDay')}
        />

        <InputItem
          label="YEAR"
          placeholder="INSERT"
          value={formData.year}
          onChange={(e) => handleChange(e.detail.value, 'year')}
        />

        <InputItem
          label="PAGE"
          placeholder="INSERT"
          value={formData.page}
          onChange={(e) => handleChange(e.detail.value, 'page')}
        />

        <IonItem>
          <IonLabel position='stacked'> PAGES </IonLabel>
          <div className='ion-flex'>
            <IonInput placeholder='0' onIonChange={(e) => handleChange(e.detail.value, 'sceneNumber')} />
            <IonInput placeholder='0' onIonChange={(e) => handleChange(e.detail.value, 'sceneNumber')} />
            <p>/8</p>
          </div>
        </IonItem>
        
        <IonItem>
          <IonLabel position='stacked'> EST.MINUTES(MM:SS)</IonLabel>
          <div className='ion-flex'>
            <IonInput placeholder='MM' onIonChange={(e) => handleChange(e.detail.value, 'sceneNumber')} />
            <p>:</p>
            <IonInput placeholder='SS' onIonChange={(e) => handleChange(e.detail.value, 'sceneNumber')} />
          </div>
        </IonItem>

        <SelectOrInsertItem
          label="LOCATION"
          selectValue={formData.locationName}
          inputPlaceholder="INSERT"
          onInputChange={(e) => handleChange(e.detail.value, 'locationName')}
          onSelectChange={(e) => handleChange(e.detail.value, 'locationName')}
          options={[
            { label: "OPTION 1", value: "option 1" },
            { label: "OPTION 2", value: "option 2" },
          ]}
        />

        <SelectOrInsertItem
          label="SET"
          selectValue={formData.setName}
          inputPlaceholder="INSERT"
          onInputChange={(e) => handleChange(e.detail.value, 'setName')}
          onSelectChange={(e) => handleChange(e.detail.value, 'setName')}
          options={[
            { label: "OPTION 1", value: "option 1" },
            { label: "OPTION 2", value: "option 2" },
          ]}
        />

        <InputItem
          label="DESCRIPTION/SYNOPSIS"
          placeholder="Type here"
          value={formData.synopsis}
          onChange={(e) => handleChange(e.detail.value, 'synopsis')}
        />
        
        <AddCategoryForm handleSceneChange={handleChange}/>

        <IonItem>
          Extras / Background Actor
          <IonButton slot='end'>
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>

        <IonItem>
          Elements
          <IonButton slot='end'>
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>

        <IonItem>
          Notes
          <IonButton slot='end'>
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>

        <IonButton type="submit" expand="block">Save</IonButton>
      </IonList>
    </form>
  );
};

export default AddScenesForm;
