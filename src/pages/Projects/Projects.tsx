import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader, IonPage,
  IonRow,
  useIonViewWillEnter,
} from '@ionic/react';
import React, { useContext, useEffect } from 'react';
import { useRxData } from 'rxdb-hooks';
import ProjectCard from './Components/ProjectCard/ProjectCard';
import Toolbar from '../../Shared/Components/Toolbar/Toolbar';
import DatabaseContext from '../../context/Database/Database.context';
import AppLoader from '../../Shared/hooks/AppLoader';

const Projects: React.FC = () => {
  const { initializeProjectsUserReplication } = useContext(DatabaseContext);
  const [isLoading, setIsLoading] = React.useState(true);

  const isOnline = navigator.onLine;
  const currentPath = window.location.pathname;

  const { result: projects, isFetching } = useRxData(
    'projects',
    (collection) => collection.find().sort({ projName: 'asc' })
  );

  useIonViewWillEnter(() => {
    const initialize = async () => {
      if (isOnline && currentPath === '/projects') {
        try {
          await initializeProjectsUserReplication();
          setIsLoading(false);
        } catch (error) {
          console.error('Replication initialization failed', error);
          setIsLoading(false);
        }
      }
    };
    initialize();
  });

  useEffect(() => {
    // Additional fallback to ensure loading state is managed
    if (!isFetching && projects.length > 0) {
      setIsLoading(false);
    }
  }, [isFetching, projects]);


  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="PROJECTS" search menu />
      </IonHeader>
      <IonContent className="ion-padding" color="tertiary">
        {(isLoading || isFetching) ? (
          AppLoader()
        ) : (
          <IonGrid>
            <IonRow>
              {projects.map((project: any) => (
                <IonCol
                  size-xs="6"
                  size-md="3"
                  size-lg="2"
                  size-sm="3"
                  key={project.id}
                  className="ion-no-padding"
                >
                  <ProjectCard project={project} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Projects;
