import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItem, IonNav } from '@ionic/react';
import { Redirect } from 'react-router';
import { useAuth } from '../../context/auth';
import { projects } from '../../data';
import ProjectCard from '../../components/Projects/ProjectCard';

const Projects: React.FC = () => {
  const { loggedIn } = useAuth();
  
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>HOME</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {projects.map((project) => (
              <IonCol size="3" size-md="3" size-lg="4" key={project.id} class='ion-no-padding'>
                  <ProjectCard project={project} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Projects;
