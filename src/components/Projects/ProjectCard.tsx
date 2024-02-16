import React from 'react';
import {
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
} from '@ionic/react';
import './ProjectCard.css';

interface Project {
  id: number;
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
  const defineBgColor = (status: string) => {
    switch (status) {
      case 'On Development':
        return '#fff';
      case 'On Pre-production':
        return '#f4fb8c';
      case 'On Production':
        return '#19cff9';
      case 'On Wrapp':
        return '#19cff9';
      case 'On Post-production':
        return '#c13afd';
      case 'closed':
        return '#04feaa';
      default:
        return 'black';
    }
  };

  const defineTextColor = (status: string) => {
    switch (status) {
      case 'On Post-production':
        return '#fff';
      default:
        return '#282f3a';
    }
  };

  return (
    <IonCard routerLink={`/my/projects/${project.id}`} className="project-card project-card project-card">
      <IonCardTitle
        class="ion-justify-content-center ion-align-items-center project-abreviation"
        style={{
          backgroundColor: defineBgColor(project.projStatus),
          color: defineTextColor(project.projStatus),
        }}
      >
        {project.projAbreviation}
      </IonCardTitle>
      <IonCardHeader class="ion-no-padding">
        <IonCardSubtitle class="project-card-subtitle">
          {project.projName.length > 9 ? `${project.projName.substring(0, 9)}...` : project.projName}
          {' '}
          {project.season ? `S${project.season}` : null}
        </IonCardSubtitle>
      </IonCardHeader>
      <div>
        <p className="project-card-description">{project.projStatus}</p>
        <p className="project-card-description">
          {project.episodes}
          {' '}
          {`${project.projType}-${project.prodCenter}`}
          {' '}
          Episodes -
          {' '}
          {project.year}
        </p>
      </div>
    </IonCard>
  );
};

export default ProjectCard;
