import { useState } from 'react';
import { IonItem, IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonHeader, IonTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonInput } from '@ionic/react';
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
      <IonItem>
        Characters
        <IonButton id="category-alert" slot='end'>
          <IonIcon icon={add} />
        </IonButton>
      </IonItem>
      <IonAlert
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

      {categories.length > 0 && 
        <IonGrid>
          {categories.map((category, index) => (
            <IonCard key={index}>
              <IonCardHeader className='ion-flex'>
                <div className='ion-flex ion-justify-content-between'>
                  <IonCardSubtitle className='ion-flex ion-align-items-center'>
                    {category}
                  </IonCardSubtitle>
                  <IonButton 
                    size='small' 
                    onClick={() => {toggleForm(index)}}
                  >
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
                <IonCardContent>
                  <AddCharacterInput
                    categoryName={category} 
                    toggleForm={toggleForm}
                    id={index}
                    handleSceneChange={handleSceneChange}
                  />
                </IonCardContent>
              </IonCardHeader>
            </IonCard>  
          ))}
        </IonGrid>
      }
    </>
  );
};

export default AddCharacterForm;
