import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { useIsMobile } from '../../hooks/useIsMobile';
import { chevronBack } from 'ionicons/icons';

const SortScenes = () => {

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
    <IonPage color='tertiary'>
      <IonHeader>
      <IonToolbar color='tertiary' className='add-strip-toolbar'>
          {
          !isMobile &&
          <>
            <IonButton fill='clear' color="primary" slot='start' onClick={handleBack}>
              BACK
            </IonButton>
            <IonButton fill='clear' color="primary" slot='end'>
              RESET
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
            Sort By
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='tertiary'>
      </IonContent>
    </IonPage>
  )
}

export default SortScenes