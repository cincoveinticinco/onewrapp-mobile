import React, { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { RxDatabase, RxLocalDocumentData } from 'rxdb';
import AppDataBase from '../RXdatabase/database';
import ScenesSchema from '../RXdatabase/schemas/scenes';
import ProjectsSchema, { Project } from '../RXdatabase/schemas/projects';
import SceneParagraphsSchema from '../RXdatabase/schemas/paragraphs';
import HttpReplicator from '../RXdatabase/replicator';
import useNavigatorOnLine from '../hooks/useNavigatorOnline';
import UnitsSchema from '../RXdatabase/schemas/units';
import ShootingsSchema from '../RXdatabase/schemas/shootings';

export interface DatabaseContextProps {
  oneWrapDb: RxDatabase | null;
  offlineScenes: any[];
  offlineProjects: Project[];
  setStartReplication: (startReplication: boolean) => void;
  projectId: number | null;
  setProjectId: (projectId: any) => void;
  initializeReplication: () => Promise<boolean>;
  startReplication: boolean;
  isOnline: boolean;
  scenesAreLoading: boolean;
  viewTabs: boolean;
  setViewTabs: (viewTabs: boolean) => void;
  setScenesAreLoading: (scenesAreLoading: boolean) => void;
  projectsAreLoading: boolean;
  setProjectsAreLoading: (projectsAreLoading: boolean) => void;
}

const DatabaseContext = React.createContext<DatabaseContextProps>({
  oneWrapDb: null,
  offlineScenes: [],
  offlineProjects: [],
  setStartReplication: () => {},
  projectId: null,
  setProjectId: () => {},
  initializeReplication: () => new Promise(() => false),
  startReplication: false,
  isOnline: false,
  scenesAreLoading: true,
  viewTabs: true,
  setViewTabs: () => {},
  setScenesAreLoading: () => {},
  projectsAreLoading: true,
  setProjectsAreLoading: () => {}
});

const sceneCollection = new ScenesSchema();
const paragraphCollection = new SceneParagraphsSchema();
const projectCollection = new ProjectsSchema();
const unitsCollection = new UnitsSchema();
const shootingsCollection = new ShootingsSchema();

const RXdatabase = new AppDataBase([sceneCollection, projectCollection, paragraphCollection, unitsCollection, shootingsCollection]);

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any | null>(null);
  const [viewTabs, setViewTabs] = useState(true);
  const [offlineProjects, setOfflineProjects] = useState<any[]>([]);
  const [projectsAreLoading, setProjectsAreLoading] = useState(true);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const [startReplication, setStartReplication] = useState(false);
  const [projectId, setProjectId] = useState<any>(null);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  const projectsQuery = oneWrapRXdatabase?.projects.find();
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
      } finally {
        console.log('Base de datos inicializada');
      }
    };

    if (!oneWrapRXdatabase && isOnline) {
      initializeDatabase();
    }
  }, []);

  useEffect(() => {
    setScenesAreLoading(true);
    if (oneWrapRXdatabase && projectId) {
      const projectIdInt = parseInt(projectId);
      const subscription = oneWrapRXdatabase.scenes.find({
        selector: {
          projectId: projectIdInt,
        },
        sort: [
          { updatedAt: 'asc' },
        ],
      }).$.subscribe((data: RxLocalDocumentData[]) => {
        setOfflineScenes(data);
        setScenesAreLoading(false);
      });
      return () => { subscription.unsubscribe(); };
    }
  }, [oneWrapRXdatabase, projectId]);

  useEffect(() => {
    const subscription = offlineProjects$?.subscribe((data: any) => {
      setOfflineProjects(data);
      console.log(offlineProjects);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [offlineProjects$]);

  const initializeReplication = async () => {
    let replicationFinished = false;
    const lastSceneInProject = await oneWrapRXdatabase?.scenes.find({
      selector: { projectId: parseInt(projectId) },
    }).sort({ updatedAt: 'desc' }).limit(1).exec()
      .then((data: any) => (data[0] ? data[0] : null)); // To compare when you enter in other project

    const lastParagraphInProject = await oneWrapRXdatabase?.paragraphs.find({
      selector: { projectId: parseInt(projectId) },
    }).sort({ updatedAt: 'desc' }).limit(1).exec()
      .then((data: any) => {
        console.log(data[0] ? data[0] : null);
        return data[0] ? data[0] : null;
      }); // To compare when you enter in other project

    const lastUnitInProject = await oneWrapRXdatabase?.units.find({
      selector: { projectId: parseInt(projectId) },
    }).sort({ updatedAt: 'desc' }).limit(1).exec()
      .then((data: any) => (data[0] ? data[0] : null)); // To compare when you enter in other project

    const lastShootingInProject = await oneWrapRXdatabase?.shootings.find({
      selector: { projectId: parseInt(projectId) },
    }).sort({ updatedAt: 'desc' }).limit(1).exec()
      .then((data: any) => (data[0] ? data[0] : null)); // To compare when you enter in other project

    const scenesReplicator = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], projectId, lastSceneInProject);
    const paragraphsReplicator = new HttpReplicator(oneWrapRXdatabase, [paragraphCollection], projectId, lastParagraphInProject);
    const unitsReplicator = new HttpReplicator(oneWrapRXdatabase, [unitsCollection], projectId, lastUnitInProject);
    const shootingsReplicator = new HttpReplicator(oneWrapRXdatabase, [shootingsCollection], projectId, lastShootingInProject);
    const replicator2 = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], projectId);
    isOnline && scenesReplicator.startReplicationPull();
    isOnline && paragraphsReplicator.startReplicationPull();
    isOnline && unitsReplicator.startReplicationPull();
    isOnline && shootingsReplicator.startReplicationPull();
    isOnline && replicator2.startReplicationPush();

    replicationFinished = true

    return replicationFinished
  };

  return (
    <DatabaseContext.Provider
      value={{
        oneWrapDb: oneWrapRXdatabase,
        offlineScenes,
        setStartReplication,
        offlineProjects,
        projectId: parseInt(projectId),
        setProjectId,
        initializeReplication,
        startReplication,
        isOnline,
        scenesAreLoading,
        viewTabs,
        setViewTabs,
        setScenesAreLoading,
        projectsAreLoading,
        setProjectsAreLoading,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
