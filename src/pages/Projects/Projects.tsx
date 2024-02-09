import React from 'react';
import {
  IonContent, IonHeader, IonPage, IonGrid, IonRow, IonCol,
} from '@ionic/react';
// import { useAuth } from '../../context/auth';
import projects from '../../data';
import ProjectCard from '../../components/Projects/ProjectCard';
import Toolbar from '../../components/Shared/Toolbar/Toolbar';

// const { loggedIn } = useAuth();

// if (!loggedIn) {
//   return <Redirect to="/login" />;
// }

const Projects: React.FC = () => (

  <IonPage>
    <IonHeader>
      <Toolbar name="Projects" search menu />
    </IonHeader>
    <IonContent className="ion-padding" color="tertiary">
      <IonGrid>
        <IonRow>
          {projects.map((project) => (
            <IonCol size-xs="6" size-md="3" size-lg="2" size-sm="3" key={project.id} class="ion-no-padding">
              <ProjectCard project={project} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>
  </IonPage>
);
export default Projects;
