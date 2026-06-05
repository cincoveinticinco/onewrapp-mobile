import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  IonSpinner,
} from '@ionic/react';
import { refresh, reload } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router';
import DatabaseContext from '../../context/Database/Database.context';
import useHideTabs from '../../hooks/utils/useHideTabs/useHideTabs';
import './ReplicationPage.scss';
import { DatabaseContextProps } from '../../context/Database/types/Database.types';

const ReplicationPage: React.FC = () => {
  const {
    replicationPercentage,
    replicationStatus,
    hardResync, 
    initialProjectReplication,
    isOnline,
    projectsInfoIsOffline,
  } = useContext<DatabaseContextProps>(DatabaseContext);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const toggleTabs = useHideTabs();
  const [isReplicating, setIsReplicating] = useState(false);
  const [dots, setDots] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const normalizedPercentage = Math.max(0, Math.min(100, replicationPercentage || 0));
  const isReplicationComplete = !!id && (projectsInfoIsOffline[`${id}`] || normalizedPercentage >= 100);

  const messages = [
    'Please wait, replication can take some minutes to finish',
    'Do not close or refresh the app',
    'Replication is in progress, please be patient',
    'Syncing data, this may take a while',
  ];

  useIonViewDidEnter(() => {
    toggleTabs.hideTabs();
  });

  // Debug: Log progress updates
  useEffect(() => {
    console.log(`📊 ReplicationPage - Progress: ${replicationPercentage}%, Status: ${replicationStatus}`);
  }, [replicationPercentage, replicationStatus]);


  useEffect(() => {
    if (isOnline && id && !projectsInfoIsOffline[`${id}`]) {
      setIsReplicating(true);
      initialProjectReplication().then(() => {
        setIsReplicating(false);
         // we need to avoid multiple replication instances creations when project is changed, so we use window.location.replace
        // window.location.replace(`/my/projects/${id}/strips`);
      }).catch(() => {
        setIsReplicating(false);
        setError('There was an error replicating the data. Please try again or contact support.');
      });
    }
  }, [isOnline, id]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev?.length >= 3 ? '' : `${prev}.`));
    }, 500);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages?.length);
    }, 10000); // Change message every 10 seconds

    return () => {
      clearInterval(dotsInterval);
      clearInterval(messageInterval);
    };
  }, []);

  const retryButton = () => {
    return (
      <IonButton
        expand="block"
        onClick={handleRetry}
        disabled={!isOnline || (isReplicating && !error)}
        className="retry-button"
        style={{
          '--background': 'var(--ion-color-yellow)',
        }}
      >
        <IonIcon icon={refresh} slot="start" />
        Retry Replication
      </IonButton>
    );
  }

  const handleRetry = () => {
    if (isOnline) {
      window.location.reload();
    }
  };
  
  const handleGoToProject = () => {
    if (id) {
      window.location.replace(`/my/projects/${id}/strips`);
    }
  };

  if(error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonTitle>Data Replication</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="replication-page-content" color="tertiary">
          <div className="replication-bg" aria-hidden="true">
            <video className="replication-video" autoPlay muted loop playsInline>
              <source src="/videos/backgroundLogin.webm" type="video/webm" />
              <source src="/videos/backgroundLogin.mp4" type="video/mp4" />
            </video>
            <div className="replication-bg-overlay" />
          </div>
          <div className="replication-content">
            <IonCard className="replication-card" color="tertiary">
              <IonCardContent>
                <IonText color="danger">
                  <h2>Error while replicating</h2>
                  <p>{error}</p>
                  {retryButton()}
                </IonText>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>Data Replication</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="replication-page-content" color="tertiary">
        <div className="replication-bg" aria-hidden="true">
          <video className="replication-video" autoPlay muted loop playsInline>
            <source src="/videos/backgroundLogin.webm" type="video/webm" />
            <source src="/videos/backgroundLogin.mp4" type="video/mp4" />
          </video>
          <div className="replication-bg-overlay" />
        </div>
        <div className="replication-content">
          <IonCard className="replication-card" color="tertiary">
            <IonCardContent>
              <IonText color="primary">
                <h2>Replication Progress</h2>
              </IonText>
              {isReplicating && (
                <div className="spinner-container">
                  <p>
                    {messages[messageIndex]}
                    {dots}
                  </p>
                </div>
              )}
              <IonProgressBar
                value={normalizedPercentage / 100}
                className="progress-bar"
              />
              <IonText>
                <h3 className="replication-percentage">
                  {Math.round(normalizedPercentage)}
                  %
                </h3>
                <p className="replication-status">{replicationStatus}</p>
              </IonText>
            </IonCardContent>
          </IonCard>

          {!isOnline && (
            <IonText color="danger" className="offline-message">
              <p>You are offline. Please connect to the internet to start replication.</p>
            </IonText>
          )}

          {isReplicationComplete ? (
            <IonButton
              expand="block"
              onClick={handleGoToProject}
              className="retry-button"
              style={{
                '--background': 'var(--ion-color-success)',
              }}
            >
              Go to Project
            </IonButton>
          ) : (
            retryButton()
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReplicationPage;
