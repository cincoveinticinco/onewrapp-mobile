import React from 'react';
import {
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
} from '@ionic/react';
import './ProjectCard.css';
import { Project } from '../../RXdatabase/schemas/projects';
import { ProjectStatusEnum } from '../../Ennums/ennums';
import DatabaseContext from '../../context/database';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { setProjectId } = React.useContext<any>(DatabaseContext);

  const defineBgColor = (status: string) => {
    switch (status) {
      case ProjectStatusEnum.ON_DEVELOPMENT:
        return '#fff'; // white
      case ProjectStatusEnum.ON_PRE_PRODUCTION:
        return '#f4fb8c'; // yellow
      case ProjectStatusEnum.ON_PRODUCTION:
        return '#19cff9'; // blue
      case ProjectStatusEnum.IN_WRAP:
        return '#19cff9'; // blue
      case ProjectStatusEnum.ON_POST_PRODUCTION:
        return '#c13afd'; // purple
      case ProjectStatusEnum.CLOSED:
        return '#04feaa'; // green
      default:
        return 'black';
    }
  };

  const defineTextColor = (bgColor: string) => {
    switch (bgColor) {
      case 'black':
        return '#fff';
      default:
        return '#282f3a';
    }
  };

  const getProjectAbreviation = (name: string) => {
    if (name.length > 3 && name) {
      return name.substring(0, 3).toUpperCase();
    }
    return name;
  }

  return (
    <IonCard routerLink={`/my/projects/${project.id}`} className="project-card project-card project-card" onClick={() => setProjectId(project.id)}>
      <IonCardTitle
        class="ion-justify-content-center ion-align-items-center project-abreviation"
        style={{
          backgroundColor: defineBgColor(project.projStatus),
          color: defineTextColor(defineBgColor(project.projStatus)),
        }}
      >
        {getProjectAbreviation(project.projName)}
      </IonCardTitle>
      <IonCardHeader class="ion-no-padding">
        <IonCardSubtitle class="project-card-subtitle">
          {`${project.id}.`}
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
          {`${project.projType}`}
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
