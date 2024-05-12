import React, { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import AppDataBase from '../RXdatabase/database';
import ScenesSchema from '../RXdatabase/schemas/scenes';
import ProjectsSchema, { Project } from '../RXdatabase/schemas/projects';
import { Scene } from '../interfaces/scenesTypes';
import SceneParagraphsSchema from '../RXdatabase/schemas/paragraphs';
import HttpReplicator from '../RXdatabase/replicator';
import useNavigatorOnLine from '../hooks/useNavigatorOnline';
import { useLocation } from 'react-router';
import { set } from 'lodash';

const DatabaseContext = React.createContext<any>({
  oneWrapDb: null,
  offlineScenes: [],
  offlineProjects: [],
  setStartReplication: () => { },
  projectId: null,
  setProjectId: () => { },
  initializeReplication: () => { },
  startReplication: false,
  isOnline: false,
  scenesAreLoading: true,
});

const sceneCollection = new ScenesSchema();
const paragraphCollection = new SceneParagraphsSchema();
const projectCollection = new ProjectsSchema();

const RXdatabase = new AppDataBase([sceneCollection, projectCollection, paragraphCollection]);

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any | null>(null);
  const [offlineProjects, setOfflineProjects] = useState<any[]>([]);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const [startReplication, setStartReplication] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  const projectsQuery = oneWrapRXdatabase?.projects.find()
  const offlineProjects$: Observable<Project[]> = projectsQuery ? projectsQuery.$ : null;
  const isOnline = useNavigatorOnLine();

  useEffect(() => {
    if (!isOnline) {
      console.log('You are offline');
    } else {
      console.log('You are online');
    }
  }, [isOnline]);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const dbInstance = await RXdatabase.getDatabaseInstance();
        setOneWrapRXdatabase(dbInstance);
        const replicator = new HttpReplicator(dbInstance, [projectCollection]);
        replicator.startReplicationPull();
      } catch (error) {
        console.error('Error al obtener la instancia de la base de datos:', error);
      }
    };

    if (!oneWrapRXdatabase && isOnline) {
      initializeDatabase();
    }
  }, []);

  useEffect(() => {
    oneWrapRXdatabase?.scenes.find().exec().then((data: Scene[]) => {
      setOfflineScenes(data);
      setScenesAreLoading(false);
    });
  }, [oneWrapRXdatabase]);

  useEffect(() => {
    const subscription = offlineProjects$?.subscribe((data: any) => {
      
      setOfflineProjects(data);
      console.log(offlineProjects);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [offlineProjects$]);

  const initializeReplication = () => {
    const replicator = new HttpReplicator(oneWrapRXdatabase, [sceneCollection, paragraphCollection], projectId);
    const replicator2 = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], projectId);
    isOnline && replicator.startReplicationPull();
    isOnline && replicator2.startReplicationPush();
  }

  return (
    <DatabaseContext.Provider 
      value={{ oneWrapDb: 
        oneWrapRXdatabase, 
        offlineScenes, 
        setStartReplication, 
        offlineProjects, 
        projectId, 
        setProjectId,
        initializeReplication,
        startReplication, 
        isOnline,
        scenesAreLoading
      }}
      >
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
