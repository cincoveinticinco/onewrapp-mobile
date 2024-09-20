import React from 'react';
import {
  IonContent, IonHeader, IonPage, IonGrid, IonRow, IonCol,
} from '@ionic/react';
import ProjectCard from '../../components/Projects/ProjectCard';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';
import DatabaseContext from '../../hooks/Shared/database';
import useLoader from '../../hooks/Shared/useLoader';

const Projects: React.FC = () => {
  const { offlineProjects, projectsAreLoading } = React.useContext(DatabaseContext);

  return (
    <IonPage>
      <IonHeader>
        <Toolbar name="PROJECTS" search menu />
      </IonHeader>
      <IonContent className="ion-padding" color="tertiary">
        {
          !projectsAreLoading && offlineProjects ? (
            <IonGrid>
              <IonRow>
                {offlineProjects.map((project: any) => (
                  <IonCol size-xs="6" size-md="3" size-lg="2" size-sm="3" key={project._data.id} class="ion-no-padding">
                    <ProjectCard project={project._data} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          ) : (
            useLoader()
          )
        }
      </IonContent>
    </IonPage>
  );
};

export default Projects;
