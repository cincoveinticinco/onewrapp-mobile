import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './AddScene.css';
import { useEffect } from 'react';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import { useHistory } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import { chevronBack } from 'ionicons/icons';

const AddScene = () => {

  const history = useHistory();
  const isMobile = useIsMobile();

  useEffect(() => {
    const tabsContainer: any = document.querySelector('.app-tabs-container');
    if (tabsContainer) {
      tabsContainer.style.display = 'none';
    }

    return () => {
      if (tabsContainer) {
        tabsContainer.style.display = '';
      }
    };
  }, []);

  const handleBack = () => {
    history.goBack();
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='tertiary' className='add-strip-toolbar'>
          {
          !isMobile &&
          <>
            <IonButton fill='clear' color="primary" slot='start' onClick={handleBack}>
              CANCEL
            </IonButton>
            <IonButton fill='clear' color="primary" slot='end'>
              SAVE
            </IonButton>
          </>
          }

          {
            isMobile && 
            <IonButton fill='clear' color="primary" slot='start' onClick={handleBack}>
              <IonIcon  icon={chevronBack} color='light'  />
            </IonButton>
          }
          <IonTitle className='add-strip-toolbar-title'> 
            Add Strip 
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='tertiary'>
        <AddScenesForm />
      </IonContent>
    </IonPage>
  );
};

export default AddScene;
