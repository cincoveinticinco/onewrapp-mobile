import {
  IonCard, IonCardContent,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { ShootingSceneStatusEnum, ShootingStatusEnum } from '../../../ennums/ennums';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import { Shooting } from '../../../interfaces/shooting.types';

const ShootingCard: React.FC<{ className?: string, shooting: Shooting }> = ({ className, shooting }) => {
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

  const isMobile = useIsMobile();
  return (
    <IonCard
      className={className}
      onClick={() => goToDetail(shooting.id)}
      style={{
        backgroundColor: getShootingColor(),
        width: '100%',
      }}
    >
      <IonCardContent style={{ width: '100%', padding: '6px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        >
          <p className="unit-name">
            <b>
              U.
              {shooting && shooting.unitNumber}
            </b>
          </p>
          {
            !isMobile && (
              <p className="unit-produced">
                {' '}
                {getTotalProducedScenes()}
                {' '}
                /
                {' '}
                {shooting.scenes.length}
              </p>
            )
          }
        </div>
      </IonCardContent>
      <p />
    </IonCard>
  );
};

export default ShootingCard;
