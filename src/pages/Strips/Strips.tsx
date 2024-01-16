import React from 'react';
import {
  IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router';
import './Strips.css';
import { scenes } from '../../data';
import SceneCard from '../../components/Strips/SceneCard';
import Toolbar from '../../components/Shared/Toolbar';
import { chevronDownOutline } from 'ionicons/icons';

const Strips: React.FC = () => {
  
  let { id }: { id: string} = useParams();

  return (
    <IonPage>
      <IonHeader>
        <Toolbar 
          name="LVE-STRIPS" 
          search={true}
          addScene={true}
          filter={true}
          elipse={true}
        />
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <IonToolbar color="tertiary" className='filter-strips-toolbar'>
          <p className='filter-strips-text'>
            <IonIcon icon={chevronDownOutline} />
            {' '}
            SORT BY: EPISODE NUMBER
          </p>
        </IonToolbar>
        <IonGrid className='scenes-grid'>
          {scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Strips;
