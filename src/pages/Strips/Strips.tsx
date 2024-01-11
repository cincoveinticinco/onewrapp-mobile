import {
  IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import './Strips.css';
import { scenes } from '../../data';
import SceneCard from '../../components/Strips/SceneCard';
import Toolbar from '../../components/Shared/Toolbar';
import { chevronDownOutline } from 'ionicons/icons';

const Strips: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="LVE-STRIPS" />
      </IonHeader>
      <IonContent color="primary" fullscreen>
        <IonToolbar color='primary' className='filter-strips-toolbar'>
          <p className='filter-strips-text'>
            <IonIcon icon={chevronDownOutline} />
            {' '}
            FILTER BY: EPISODE NUMBER
          </p>
        </IonToolbar>
        <IonGrid className='scenes-grid'>
          {scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
);}

export default Strips;
