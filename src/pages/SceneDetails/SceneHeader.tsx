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
    className={editMode ? `scene-theme-${sceneColor}` : `scene-theme-${sceneColor}`}
    mode="ios"
    style={{ border: '1px solid black' }}
  >
    {previousScene && (
    <IonIcon
      icon={chevronBack}
      slot="start"
      size="large"
      onClick={changeToPreviousScene}
      className="change-scene-button"
    />
    )}
    <IonTitle style={{ fontWeight: 'light' }}><b>{`${sceneHeader} ${editMode ? 'EDIT MODE' : status}`}</b></IonTitle>
    {nextScene && (
    <IonIcon
      icon={chevronForward}
      slot="end"
      size="large"
      onClick={changeToNextScene}
      className="change-scene-button"
    />
    )}
  </IonToolbar>
);

export default SceneHeader;
