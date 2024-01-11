import {
  IonContent, IonGrid, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import './Strips.css';
import { scenes } from '../../data';
import { Scene } from '../../interfaces/scenesTypes';
import SceneCard from '../../components/Strips/SceneCard';

const Strips: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>STRIPS</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="primary" fullscreen>
        <IonGrid>
          {scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
);}

export default Strips;
