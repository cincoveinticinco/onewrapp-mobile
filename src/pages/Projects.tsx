import { IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { projects } from '../data'
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router';

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
        <IonList>
          {projects.map((project) =>
            <IonItem button key={project.id}
              routerLink={`/my/projects/${project.id}`}>
              {project.title}
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Projects;