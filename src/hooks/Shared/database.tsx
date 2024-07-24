import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RxDatabase, RxLocalDocumentData } from 'rxdb';
import AppDataBase from '../../RXdatabase/database';
import ScenesSchema from '../../RXdatabase/schemas/scenes';
import ProjectsSchema, { Project } from '../../RXdatabase/schemas/projects';
import SceneParagraphsSchema from '../../RXdatabase/schemas/paragraphs';
import HttpReplicator from '../../RXdatabase/replicator';
import useNavigatorOnLine from './useNavigatorOnline';
import UnitsSchema from '../../RXdatabase/schemas/units';
import ShootingsSchema from '../../RXdatabase/schemas/shootings';
import TalentsSchema from '../../RXdatabase/schemas/talents';
import AuthContext from '../../context/Auth';

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
  initializeTalentsReplication: () => Promise<boolean>;
  isDatabaseReady: boolean;
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
  initializeTalentsReplication: () => new Promise(() => false),
  isDatabaseReady: false,
});

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<RxDatabase | null>(null);
  const [sceneCollection, setSceneCollection] = useState<ScenesSchema | null>(null);
  const [paragraphCollection, setParagraphCollection] = useState<SceneParagraphsSchema | null>(null);
  const [projectCollection, setProjectCollection] = useState<ProjectsSchema | null>(null);
  const [unitsCollection, setUnitsCollection] = useState<UnitsSchema | null>(null);
  const [shootingsCollection, setShootingsCollection] = useState<ShootingsSchema | null>(null);
  const [talentsCollection, setTalentsCollection] = useState<TalentsSchema | null>(null);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const { getToken } = useContext(AuthContext);

  const [viewTabs, setViewTabs] = useState(true);
  const [offlineProjects, setOfflineProjects] = useState<Project[] | null>(null);
  const [projectsAreLoading, setProjectsAreLoading] = useState(true);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const [startReplication, setStartReplication] = useState(false);
  const [projectId, setProjectId] = useState<any>(null);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  const isOnline = useNavigatorOnLine();

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const sceneColl = new ScenesSchema();
        const paragraphColl = new SceneParagraphsSchema();
        const projectColl = new ProjectsSchema();
        const unitsColl = new UnitsSchema();
        const shootingsColl = new ShootingsSchema();
        const talentsColl = new TalentsSchema();

        const RXdatabase = new AppDataBase([sceneColl, projectColl, paragraphColl, unitsColl, shootingsColl, talentsColl]);
        const dbInstance = await RXdatabase.getDatabaseInstance();
        
        setOneWrapRXdatabase(dbInstance);
        setSceneCollection(sceneColl);
        setParagraphCollection(paragraphColl);
        setProjectCollection(projectColl);
        setUnitsCollection(unitsColl);
        setShootingsCollection(shootingsColl);
        setTalentsCollection(talentsColl);

        setIsDatabaseReady(true); 

        if (isOnline) {
          const replicator = new HttpReplicator(dbInstance, [projectColl], null, null, getToken);
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
  }, [isOnline, oneWrapRXdatabase]);

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
        console.log(data)
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
    if (!sceneCollection || !oneWrapRXdatabase || !projectId ) {
      console.log('No scene collection')
      return false
    };
    try {
      const lastSceneInProject = await oneWrapRXdatabase.scenes.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const scenesReplicator = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], parseInt(projectId), lastSceneInProject, getToken);

      if (isOnline) {
        scenesReplicator.startReplicationPull();
        scenesReplicator.startReplicationPush();
      }

      await scenesReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error durante la replicación de escenas:', error);
      return false;
    }
  };

  const initializeParagraphReplication = async () => {
    if (!paragraphCollection || !oneWrapRXdatabase || !projectId) return false;
    try {
      const lastParagraphInProject = await oneWrapRXdatabase.paragraphs.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const paragraphsReplicator = new HttpReplicator(oneWrapRXdatabase, [paragraphCollection], parseInt(projectId), lastParagraphInProject, getToken);

      if (isOnline) {
        paragraphsReplicator.startReplicationPull();
      }

      await paragraphsReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error durante la replicación de párrafos:', error);
      return false;
    }
  };

  const initializeTalentsReplication = async () => {
    if (!talentsCollection || !oneWrapRXdatabase || !projectId) return false;
    try {
      const lastTalentInProject = await oneWrapRXdatabase.talents.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const talentsReplicator = new HttpReplicator(oneWrapRXdatabase, [talentsCollection], parseInt(projectId), lastTalentInProject, getToken);

      if (isOnline) {
        talentsReplicator.startReplicationPull();
      }

      await talentsReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error durante la replicación de talentos:', error);
      return false;
    }
  };

  const initializeUnitReplication = async () => {
    if (!unitsCollection || !oneWrapRXdatabase || !projectId) return false;
    try {
      const lastUnitInProject = await oneWrapRXdatabase.units.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const unitsReplicator = new HttpReplicator(oneWrapRXdatabase, [unitsCollection], parseInt(projectId), lastUnitInProject, getToken);

      if (isOnline) {
        unitsReplicator.startReplicationPull();
      }

      await unitsReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error durante la replicación de unidades:', error);
      return false;
    }
  };

  const initializeShootingReplication = async () => {
    if (!shootingsCollection || !oneWrapRXdatabase || !projectId) return false;
    try {
      const lastShootingInProject = await oneWrapRXdatabase.shootings.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const shootingsReplicator = new HttpReplicator(oneWrapRXdatabase, [shootingsCollection], parseInt(projectId), lastShootingInProject, getToken);

      if (isOnline) {
        shootingsReplicator.startReplicationPull();
        setTimeout(() => {
          shootingsReplicator.startReplicationPush();
        }, 500);
        shootingsReplicator.startReplicationPull();
      }

      await shootingsReplicator.monitorReplicationStatus();
      return true;
    } catch (error) {
      console.error('Error durante la replicación de shootings:', error);
      return false;
    }
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
        initializeTalentsReplication,
        isDatabaseReady
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};


export default DatabaseContext;