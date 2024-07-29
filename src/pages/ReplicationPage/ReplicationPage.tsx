import React, { useContext, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonProgressBar,
  IonText,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { refresh } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';

const ReplicationPage: React.FC = () => {
  const {
    replicationPercentage,
    replicationStatus,
    initialProjectReplication,
    isOnline,
    projectsInfoIsOffline,
  } = useContext<DatabaseContextProps>(DatabaseContext);

  const { id } = useParams<{ id: string }>();
  const { projectId } = useContext(DatabaseContext);
  const history = useHistory();

  const handleRetry = () => {
    if (isOnline) {
      initialProjectReplication();
    }
  };

  useEffect(() => {
    if (isOnline && !projectsInfoIsOffline[`project_${id}`]) {
      initialProjectReplication().finally(() => {
        history.push(`/my/projects/${id}/strips`);
      });
    }
  }, [isOnline, id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>Data Replication</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" color="tertiary">
        <IonCard color="tertiary">
          <IonCardContent>
            <IonText color="primary">
              <h2>Replication Progress</h2>
            </IonText>
            <IonProgressBar
              value={replicationPercentage / 100}
              style={{ height: '20px', margin: '20px 0' }}
            />
            <IonText>
              <h3>
                {replicationPercentage}
                %
              </h3>
              <p>{replicationStatus}</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        {!isOnline && (
          <IonText color="danger">
            <p>You are offline. Please connect to the internet to start replication.</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          onClick={handleRetry}
          disabled={!isOnline || replicationPercentage > 0 && replicationPercentage < 100}
        >
          <IonIcon icon={refresh} slot="start" />
          Retry Replication
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ReplicationPage;
