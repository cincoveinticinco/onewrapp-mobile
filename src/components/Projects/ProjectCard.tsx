import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './ProjectCard.css';

interface Project {
  id: string;
  projName: string;
  projAbreviation: string;
  season: number | null;
  projStatus: string;
  projType: string;
  prodCenter: string;
  episodes: number;
  year: number;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  const defineColor = (status: string) => {
    switch (status) {
      case 'On Development':
        return 'white';
      case 'On Pre-production':
        return 'yellow';
      case 'On Production':
      case 'On Wrapp':
        return 'blue';
      case 'On Post-production':
        return 'purple';
      case 'closed':
        return 'green';
      default:
        return 'black';
    }
  };

  return (
    <IonCard routerLink={`/my/projects/${project.id}`} className='project-card-margin project-card-padding project-card'>
        <IonCardTitle 
          class='ion-justify-content-center ion-align-items-center project-abreviation'
          style={{ backgroundColor: defineColor(project.projStatus) }}>
            {project.projAbreviation}
        </IonCardTitle>
      <IonCardHeader class='ion-no-padding'>
        <IonCardSubtitle>{project.projName} S{project.season}</IonCardSubtitle>
      </IonCardHeader>
      <div>
        <p>{project.projStatus}</p>
        <p>{project.episodes} Episodes - {project.year}</p>
      </div>
    </IonCard>
  );
};

export default ProjectCard;
