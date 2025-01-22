import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader, IonPage,
  IonRow,
  useIonViewWillEnter,
} from '@ionic/react';
import React, { useContext } from 'react';
import { useRxData } from 'rxdb-hooks';
import ProjectCard from './Components/ProjectCard/ProjectCard';
import Toolbar from '../../Shared/Components/Toolbar/Toolbar';
import DatabaseContext from '../../context/Database/Database.context';
import AppLoader from '../../Shared/hooks/AppLoader';

const Projects: React.FC = () => {
  const { initializeProjectsUserReplication } = useContext(DatabaseContext);

  const isOnline = navigator.onLine;
  const currentPath = window.location.pathname;

  const { result: projects, isFetching } = useRxData(
    'projects',
    (collection) => collection.find().sort({ projName: 'asc' }),
  );

  useIonViewWillEnter(() => {
    if (isOnline && currentPath === '/projects') {
      initializeProjectsUserReplication();
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="PROJECTS" search menu />
      </IonHeader>
      <IonContent className="ion-padding" color="tertiary">
        {isFetching ? (
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
