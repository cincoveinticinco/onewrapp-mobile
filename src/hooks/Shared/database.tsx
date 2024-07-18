import React, { useCallback, useEffect, useState } from 'react';
import { RxDatabase, RxLocalDocumentData } from 'rxdb';
import AppDataBase from '../../RXdatabase/database';
import ScenesSchema from '../../RXdatabase/schemas/scenes';
import ProjectsSchema, { Project } from '../../RXdatabase/schemas/projects';
import SceneParagraphsSchema from '../../RXdatabase/schemas/paragraphs';
import HttpReplicator from '../../RXdatabase/replicator';
import useNavigatorOnLine from './useNavigatorOnline';
import UnitsSchema from '../../RXdatabase/schemas/units';
import ShootingsSchema from '../../RXdatabase/schemas/shootings';

export interface DatabaseContextProps {
  oneWrapDb: RxDatabase | null;
  offlineScenes: any[];
  offlineProjects: Project[] | null;
  setStartReplication: (startReplication: boolean) => void;
  projectId: number | null;
  setProjectId: (projectId: any) => void;
  startReplication: boolean;
  isOnline: boolean;
  scenesAreLoading: boolean;
  viewTabs: boolean;
  setViewTabs: (viewTabs: boolean) => void;
  setScenesAreLoading: (scenesAreLoading: boolean) => void;
  projectsAreLoading: boolean;
  setProjectsAreLoading: (projectsAreLoading: boolean) => void;
  getOfflineProjects: () => void;
  initializeShootingReplication: () => Promise<boolean>;
  initializeSceneReplication: () => Promise<boolean>;
  initializeParagraphReplication: () => Promise<boolean>;
  initializeUnitReplication: () => Promise<boolean>;
}

const DatabaseContext = React.createContext<DatabaseContextProps>({
  oneWrapDb: null,
  offlineScenes: [],
  offlineProjects: null,
  setStartReplication: () => {},
  projectId: null,
  setProjectId: () => {},
  startReplication: false,
  isOnline: false,
  scenesAreLoading: true,
  viewTabs: true,
  setViewTabs: () => {},
  setScenesAreLoading: () => {},
  projectsAreLoading: true,
  setProjectsAreLoading: () => {},
  getOfflineProjects: () => {},
  initializeShootingReplication: () => new Promise(() => false),
  initializeSceneReplication: () => new Promise(() => false),
  initializeParagraphReplication: () => new Promise(() => false),
  initializeUnitReplication: () => new Promise(() => false),
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
  const [offlineProjects, setOfflineProjects] = useState<Project[] | null>(null);
  const [projectsAreLoading, setProjectsAreLoading] = useState(true);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const [startReplication, setStartReplication] = useState(false);
  const [projectId, setProjectId] = useState<any>(null);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
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
        if (isOnline) {
          const replicator = new HttpReplicator(dbInstance, [projectCollection]);
          replicator.startReplicationPull();
          await replicator.monitorReplicationStatus();
          setProjectsAreLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener la instancia de la base de datos:', error);
      } finally {
        console.log('Base de datos inicializada');
      }
    };

    if (!oneWrapRXdatabase) {
      initializeDatabase();
    }
  }, [isOnline]);

  useEffect(() => {
    setProjectsAreLoading(true);
    if (oneWrapRXdatabase) {
      const subscription = oneWrapRXdatabase.projects.find().sort({ updatedAt: 'asc' }).$.subscribe((data: Project[]) => {
        setOfflineProjects(data);
      });
      return () => { subscription.unsubscribe(); };
    }
  }, [oneWrapRXdatabase]);

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

  const getOfflineProjects = useCallback(async () => {
    if (oneWrapRXdatabase) {
      try {
        setProjectsAreLoading(true);
        const projects = await oneWrapRXdatabase.projects.find().exec();
        setOfflineProjects(projects);
        setProjectsAreLoading(false);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    }
  }, [oneWrapRXdatabase]);

  const initializeSceneReplication = async () => {
    try {
      const lastSceneInProject = await oneWrapRXdatabase?.scenes.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const scenesReplicator = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], parseInt(projectId), lastSceneInProject);

      if (isOnline) {
        scenesReplicator.startReplicationPull();
        scenesReplicator.startReplicationPush();
      }

      await scenesReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error during scene replication:', error);
      return false;
    }
  };

  const initializeParagraphReplication = async () => {
    try {
      const lastParagraphInProject = await oneWrapRXdatabase?.paragraphs.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const paragraphsReplicator = new HttpReplicator(oneWrapRXdatabase, [paragraphCollection], parseInt(projectId), lastParagraphInProject);

      if (isOnline) {
        paragraphsReplicator.startReplicationPull();
      }

      await paragraphsReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error during paragraph replication:', error);
      return false;
    }
  };

  const initializeUnitReplication = async () => {
    try {
      const lastUnitInProject = await oneWrapRXdatabase?.units.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const unitsReplicator = new HttpReplicator(oneWrapRXdatabase, [unitsCollection], parseInt(projectId), lastUnitInProject);

      if (isOnline) {
        unitsReplicator.startReplicationPull();
      }

      await unitsReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error during unit replication:', error);
      return false;
    }
  };
  const initializeShootingReplication = async () => {
    try {
      const lastShootingInProject = await oneWrapRXdatabase?.shootings.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const shootingsReplicator = new HttpReplicator(oneWrapRXdatabase, [shootingsCollection], projectId, lastShootingInProject);

      if (isOnline) {
        shootingsReplicator.startReplicationPull();
        setTimeout(() => {
          shootingsReplicator.startReplicationPush();
        }, 500);
        shootingsReplicator.startReplicationPull();
      }

      // Wait for the initial replication to complete
      await shootingsReplicator.monitorReplicationStatus();

      return true; // Replication finished successfully
    } catch (error) {
      console.error('Error during shooting replication:', error);
      return false; // Replication failed
    }
  };

  const pushShootingsReplication = async () => {
    let replicationFinished = false;
    const pushReplicator = new HttpReplicator(oneWrapRXdatabase, [shootingsCollection], projectId);

    pushReplicator && pushReplicator.startReplicationPush();
    replicationFinished = true;

    return replicationFinished;
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
        startReplication,
        isOnline,
        scenesAreLoading,
        viewTabs,
        setViewTabs,
        setScenesAreLoading,
        projectsAreLoading,
        setProjectsAreLoading,
        getOfflineProjects,
        initializeShootingReplication,
        initializeSceneReplication,
        initializeParagraphReplication,
        initializeUnitReplication,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
