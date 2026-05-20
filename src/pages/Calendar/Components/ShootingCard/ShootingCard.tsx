import {
  IonCard, IonCardContent,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { ShootingSceneStatusEnum, ShootingStatusEnum } from '../../../../Shared/enums/ennums';
import { ShootingDocType } from '../../../../Shared/types/shooting.types';

const ShootingCard: React.FC<{ className?: string, shooting: ShootingDocType }> = ({ className, shooting }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const getTotalProducedScenes = () => shooting.scenes.reduce((acc, scene) => (scene.status === ShootingSceneStatusEnum.Shoot ? acc + 1 : acc), 0);

  const goToDetail = (shootingId: string) => {
    history.push(`/my/projects/${id}/shooting/${shootingId}`);
  };

  const getShootingColor = () => {
    if (shooting.status === ShootingStatusEnum.Called) {
      return '#f3fb8c';
    } if (shooting.status === ShootingStatusEnum.Closed) {
      return 'var(--ion-color-success)';
    }
    return 'var(--ion-color-primary)';
  };

  const producedScenes = getTotalProducedScenes();

  return (
    <IonCard
      className={className}
      onClick={() => shooting.id && goToDetail(shooting.id)}
      style={{
        backgroundColor: getShootingColor(),
        width: '100%',
      }}
    >
      <IonCardContent className="shooting-card-content">
        <div className="shooting-card-summary">
          <span className="unit-name">
            U.
            {shooting.unitNumber}
          </span>
          <span className="unit-produced">
            {producedScenes}
            /
            {shooting.scenes?.length}
          </span>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ShootingCard;
