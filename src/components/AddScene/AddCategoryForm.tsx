import { useState } from 'react';
import { IonItem, IonButton, IonIcon, IonAlert, IonGrid, IonCard, IonHeader, IonTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonInput } from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import AddCharacterForm from './AddCharacterForm';

interface AddCategoryFormProps {
  handleSceneChange: (value: any, field: string) => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ( { handleSceneChange }) => {

  const [categories, setCategories] = useState<string[]>([]);
  const [showCharacterForm, setShowCharacterForm] = useState<boolean>(false);

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
                    onClick={() => {setShowCharacterForm(!showCharacterForm)}}
                  >
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
                <IonCardContent>
                  <AddCharacterForm 
                    categoryName={category} 
                    showForm={showCharacterForm}
                    setShowForm={setShowCharacterForm}
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

export default AddCategoryForm;
