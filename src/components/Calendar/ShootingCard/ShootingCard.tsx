import {
  IonBadge, IonCard, IonCardContent, IonItem, IonLabel,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { LocationInfo, Shooting } from '../../../interfaces/shooting.types';
import { ShootingSceneStatusEnum, ShootingStatusEnum } from '../../../Ennums/ennums';
import useIsMobile from '../../../hooks/Shared/useIsMobile';
import truncateString from '../../../utils/truncateString';

const ShootingCard: React.FC<{ className?: string, shooting: Shooting }> = ({ className, shooting }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const getTotalProducedScenes = () => shooting.scenes.reduce((acc, scene) => (scene.status === ShootingSceneStatusEnum.Shoot ? acc + 1 : acc), 0);

  const goToDetail = (shootingId: string) => {
    history.push(`/my/projects/${id}/shooting/${shootingId}`);
  };

  const getLocationsString = () => shooting.locations.map((location: LocationInfo) => location.location_name).join(', ');

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
        {
          shooting.locations.length > 0 && !isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              className="location-info"
            >
              <IonBadge color="light" style={{ margin: '3px', fontSize: '10px' }}>
                {shooting.locations.length}
              </IonBadge>
              <span style={{
                fontSize: '10px',
                fontWeight: '300',
                marginLeft: '6px',
                textAlign: 'left',
              }}
              >
                {truncateString(getLocationsString(), 15)}
              </span>
            </div>
          )
        }
      </IonCardContent>
      <p />
    </IonCard>
  );
};

export default ShootingCard;
