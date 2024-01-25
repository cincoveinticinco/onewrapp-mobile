import React, { useState } from 'react';
import {
  IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import AddExtraInput from './AddExtraInput';

interface AddExtraFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({ handleSceneChange }) => {
  const [categories, setCategories] = useState<string[]>([]);

  const toggleForm = (index: number) => {
    const element = document.getElementById(`extra-form-${index}`);
    if (element) {
      if (element.style.display === 'none') {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  };

  const handleOk = (inputData: { categoryName: string }) => {
    const inputElement = document.getElementById('add-extra-category-input');
    if (inputData.categoryName) {
      setCategories([...categories, inputData.categoryName]);
    }
    if (inputElement) {
      (inputElement as HTMLInputElement).value = '';
    }
  };

  // const removeCategory = (categoryName: string) => {
  //   const updatedCategories = categories.filter((category) => category !== categoryName);
  //   setCategories(updatedCategories);
  // };

  return (
    <>
      <div className="category-item-title ion-flex ion-justify-content-between">
        <p className="ion-flex ion-align-items-center">
          Extras / Background Actors
        </p>
        <IonButton fill="clear" color="light" id="extra-category-alert" slot="end" className="ion-no-padding">
          <IonIcon icon={add} />
        </IonButton>
      </div>
      <IonAlert
        trigger="extra-category-alert"
        header="Please, enter an extra category name"
        buttons={[
          {
            text: 'OK',
            handler: handleOk,
          },
        ]}
        inputs={[
          {
            name: 'categoryName',
            type: 'text',
            placeholder: 'Extra Category Name',
            id: 'add-extra-category-input',
          },
        ]}
      />

      {
        categories.length === 0
        && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO EXTRAS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        )
      }

      {categories.length > 0
        && (
        <IonGrid
          className="add-scene-items-card-grid"
        >
          {categories.map((category, index) => (
            <IonCard
              key={index}
              color="tertiary"
            >
              <IonCardHeader className="ion-flex">
                <div className="ion-flex ion-justify-content-between">
                  <IonCardSubtitle className="ion-flex ion-align-items-center">
                    {category}
                  </IonCardSubtitle>
                  <IonButton
                    size="small"
                    onClick={() => { toggleForm(index); }}
                    fill="clear"
                    color="light"
                  >
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <AddExtraInput
                  categoryName={category}
                  toggleForm={toggleForm}
                  handleSceneChange={handleSceneChange}
                  id={index}
                />
              </IonCardContent>
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddExtraForm;
