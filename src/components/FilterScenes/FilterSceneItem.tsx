import { IonButton, IonIcon, IonItem, IonTitle } from '@ionic/react'
import { chevronForward } from 'ionicons/icons';
import React from 'react'

interface FilterSceneItemProps {
  itemOption: string;
}

const FilterSceneItem: React.FC<FilterSceneItemProps> = ( { itemOption }) => {
  return (
    <>
      <h6 className='ion-flex ion-align-items-center'>
        { itemOption }
      </h6>
      <IonButton fill='clear' color='light'>
        View All
        <IonIcon icon={chevronForward} />
      </IonButton>
    </>
  )
}

export default FilterSceneItem