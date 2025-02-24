import { IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';

interface SceneHeaderProps {
  sceneColor: string;
  sceneHeader: string;
  previousScene: any;
  nextScene: any;
  changeToPreviousScene: () => void;
  changeToNextScene: () => void;
  status?: string;
  editMode?: boolean;
}

const SceneHeader: React.FC<SceneHeaderProps> = ({
  sceneColor,
  sceneHeader,
  previousScene,
  nextScene,
  changeToPreviousScene,
  changeToNextScene,
  status,
  editMode
}) => (
  <IonToolbar
    color={sceneColor}
    mode="ios"
    style={{ border: '1px solid black', color: editMode ? 'black' : 'white' }}
  >
    {previousScene && (
    <IonIcon
      icon={chevronBack}
      slot="start"
      size="large"
      onClick={changeToPreviousScene}
      className="change-scene-button"
      style={{ color: 'var(--ion-color-contrast)' }}
    />
    )}
    <IonTitle style={{ fontWeight: 'light', color: 'var(--ion-color-contrast)' }}><b>{`${sceneHeader} ${editMode ? 'EDIT MODE' : status}`}</b></IonTitle>
    {nextScene && (
    <IonIcon
      icon={chevronForward}
      slot="end"
      size="large"
      onClick={changeToNextScene}
      className="change-scene-button"
      style={{ color: 'var(--ion-color-contrast)' }}
    />
    )}
  </IonToolbar>
);

export default SceneHeader;
