// ReplicationPage.tsx
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
  useIonViewDidEnter,
} from '@ionic/react';
import { refresh } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';
import useHideTabs from '../../hooks/Shared/useHideTabs';
import './ReplicationPage.scss';

const ReplicationPage: React.FC = () => {
  const {
    replicationPercentage,
    replicationStatus,
    initialProjectReplication,
    isOnline,
    projectsInfoIsOffline,
  } = useContext<DatabaseContextProps>(DatabaseContext);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const toggleTabs = useHideTabs();

  useIonViewDidEnter(() => {
    toggleTabs.hideTabs();
  });

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
      <IonContent className="replication-page-content" color="tertiary">
        <IonCard className="replication-card" color="tertiary">
          <IonCardContent>
            <IonText color="primary">
              <h2>Replication Progress</h2>
            </IonText>
            <IonProgressBar
              value={replicationPercentage / 100}
              style={{ height: '20px', margin: '20px 0', borderRadius: '10px' }}
              className="progress-bar"
            />
            <IonText>
              <h3 className="replication-percentage">{replicationPercentage}%</h3>
              <p>{replicationStatus}</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        {!isOnline && (
          <IonText color="danger" className="offline-message">
            <p>You are offline. Please connect to the internet to start replication.</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          onClick={handleRetry}
          disabled={!isOnline || (replicationPercentage > 0 && replicationPercentage < 100)}
          className="retry-button"
          style={{
            backgroundColor: {
              '--background': 'var(--ion-color-yellow)'
            }
          }}
        >
          <IonIcon icon={refresh} slot="start" />
          Retry Replication
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ReplicationPage;
