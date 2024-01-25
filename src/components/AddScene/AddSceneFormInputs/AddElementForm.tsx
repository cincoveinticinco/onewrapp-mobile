import React, { useState } from 'react';
import {
  IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import AddElementInput from './AddElementInput';

interface AddElementFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddElementForm: React.FC<AddElementFormProps> = ({ handleSceneChange }) => {
  const [categories, setCategories] = useState<string[]>([]);

  const toggleForm = (index: number) => {
    const element = document.getElementById(`element-form-${index}`);
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  };

  const handleOk = (inputData: { categoryName: string }) => {
    const inputElement = document.getElementById('add-element-category-input');
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
          Elements
        </p>
        <IonButton fill="clear" color="light" id="element-category-alert" slot="end" className="ion-no-padding">
          <IonIcon icon={add} />
        </IonButton>
      </div>
      <IonAlert
        trigger="element-category-alert"
        header="Please, enter an element category name"
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
            placeholder: 'Element Category Name',
            id: 'add-element-category-input',
          },
        ]}
      />

      {
        categories.length === 0
        && (
        <IonCard color="tertiary" className="no-items-card">
          <IonCardHeader>
            <IonCardSubtitle className="no-items-card-title">
              NO ELEMENTS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        )
      }

      {categories.length > 0
        && (
        <IonGrid className="add-scene-items-card-grid">
          {categories.map((category, index) => (
            <IonCard
              key={index}
              color="tertiary"
              className="add-scene-items-card ion-no-border"
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
                <AddElementInput
                  categoryName={category}
                  id={index}
                  toggleForm={toggleForm}
                  handleSceneChange={handleSceneChange}
                />
              </IonCardContent>
            </IonCard>
          ))}
        </IonGrid>
        )}
    </>
  );
};

export default AddElementForm;
