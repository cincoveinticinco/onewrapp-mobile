import { useState } from 'react';
import { IonItem, IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonHeader, IonTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonInput, IonCardTitle } from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import AddCharacterInput from './AddCharacterInput';

interface AddCategoryFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddCharacterForm: React.FC<AddCategoryFormProps> = ( { handleSceneChange }) => {

  const [categories, setCategories] = useState<string[]>([]);
  
  const toggleForm = (index: number) => {
    const element = document.getElementById(`character-form-${index}`);
    if (element) {
     element.style.display === 'none' ? element.style.display = 'block' : element.style.display = 'none';
    }
  };

  // category has many characters
  // character has one category

  const handleOk = (inputData: { categoryName: string; }) => {
    const inputElement = document.getElementById('add-category-input');
    if (inputData.categoryName) {
      setCategories([...categories, inputData.categoryName]);
    }
    if (inputElement) {
      (inputElement as HTMLInputElement).value = '';
    }
  };

  const removeCategory = (categoryName: string) => {
    const updatedCategories = categories.filter(category => category !== categoryName);
    setCategories(updatedCategories);
  };

  return (
    <>
      <div className='category-item-title ion-flex ion-justify-content-between'>
        <p className='ion-flex ion-align-items-center'>
          Characters
        </p>
        <IonButton fill="clear" id="category-alert" slot='end' color="light" className='ion-no-padding'>
          <IonIcon icon={add} />
        </IonButton>
      </div>
      <IonAlert
        color='tertiary'
        trigger='category-alert'
        header='Please, enter a category name'
        buttons={[
          {
            text: 'OK',
            handler: handleOk
          }
        ]}
        inputs={[
          {
            name: 'categoryName',
            type: 'text',
            placeholder: 'Category Name',
            id: 'add-category-input'
          }
        ]}
      ></IonAlert>

      {
        categories.length === 0 &&
        <IonCard color="tertiary" className='no-items-card'>
          <IonCardHeader>
            <IonCardSubtitle className='no-items-card-title'>
              NO CHARACTERS ADDED TO THIS STRIP
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      }

      {categories.length > 0 && 
        <IonGrid className='add-scene-items-card-grid'>
          {categories.map((category, index) => (
            <IonCard 
              key={index}
              color="tertiary"
              className='add-scene-items-card ion-no-border'
            >
              <IonCardHeader className='ion-flex'>
                <div className='ion-flex ion-justify-content-between'>
                  <IonCardSubtitle className='ion-flex ion-align-items-center'>
                    {category}
                  </IonCardSubtitle>
                  <IonButton 
                    size='small' 
                    onClick={() => {toggleForm(index)}}
                    fill='clear'
                    color="light"
                  >
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <AddCharacterInput
                    categoryName={category} 
                    toggleForm={toggleForm}
                    id={index}
                    handleSceneChange={handleSceneChange}
                  />  
              </IonCardContent>

            </IonCard>  
          ))}
        </IonGrid>
      }
    </>
  );
};

export default AddCharacterForm;
