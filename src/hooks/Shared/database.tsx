import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { RxDatabase, RxLocalDocumentData } from 'rxdb';
import { set } from 'lodash';
import { locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
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
  initialProjectReplication: () => Promise<void>;
  replicationPercentage: number;
  replicationStatus: string;
  initialReplicationFinished: boolean;
  projectsInfoIsOffline: {[key: string]: boolean};
  setProjectsInfoIsOffline: (projectsInfoIsOffline: {[key: string]: boolean}) => void;
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
  initialProjectReplication: () => new Promise(() => false),
  replicationPercentage: 0,
  replicationStatus: '',
  initialReplicationFinished: false,
  projectsInfoIsOffline: {},
  setProjectsInfoIsOffline: () => {},
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
  const [projectId, setProjectId] = useState<any>(localStorage.getItem('projectId') || null);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  const [initialReplicationFinished, setInitialReplicationFinished] = useState(false);
  const [replicationStatus, setReplicationStatus] = useState<string>('');
  const isOnline = useNavigatorOnLine();
  const [replicationPercentage, setReplicationPercentage] = useState(0);
  const [projectsAreOffline, setProjectsAreOffline] = useState<boolean>(
    localStorage.getItem('projectsAreOffline') ? JSON.parse(localStorage.getItem('projectsAreOffline') as string) : false,
  );
  const [projectsInfoIsOffline, setProjectsInfoIsOffline] = useState<{[key: string]: boolean}>(
    localStorage.getItem('projectsInfoIsOffline') ? JSON.parse(localStorage.getItem('projectsInfoIsOffline') as string) : {},
  );

  useEffect(() => {
    console.log('initialReplicationFinished updated: *********', initialReplicationFinished);
  }, [initialReplicationFinished]);

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
          const projectsReplicator = new HttpReplicator(dbInstance, [projectColl], null, null, getToken);
          projectsReplicator.startReplicationPull();
          await projectsReplicator.monitorReplicationStatus();
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
    localStorage.setItem('projectId', projectId);
  }, [projectId]);

  useEffect(() => {
    setProjectsAreLoading(true);
    if (oneWrapRXdatabase) {
      const subscription = oneWrapRXdatabase.projects.find().sort({ updatedAt: 'asc' }).$.subscribe({
        next: (data: Project[]) => {
          setOfflineProjects(data);
          setProjectsAreOffline(true);
          console.log(data, 'projects');
          const projects = data.map((project: any) => project._data);
          console.log(projects, 'projectInfoIsOffline');
          try {
            const projectsInfoIsOffline = Object.fromEntries(
              projects.map((project: any) => [
                typeof project.id === 'string' || typeof project.id === 'number'
                  ? project.id
                  : String(project.id),
                false,
              ]),
            );
            setProjectsInfoIsOffline(projectsInfoIsOffline);
          } catch (error) {
            console.error('Error processing projects:', error);
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
          setProjectsAreLoading(false);
        },
        complete: () => {
          setProjectsAreLoading(false);
        },
      });
      return () => { subscription.unsubscribe(); };
    }
  }, [oneWrapRXdatabase]);

  useEffect(() => {
    localStorage.setItem('projectsAreOffline', JSON.stringify(projectsAreOffline));
  }, [projectsAreOffline]);

  useEffect(() => {
    localStorage.setItem('projectsInfoIsOffline', JSON.stringify(projectsInfoIsOffline));
  }, [projectsInfoIsOffline]);

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
    if (!sceneCollection || !oneWrapRXdatabase || !projectId) {
      console.log('No scene collection');
      return false;
    }
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
      const shootingReplicatorPush = new HttpReplicator(oneWrapRXdatabase, [shootingsCollection], parseInt(projectId), lastShootingInProject, getToken);

      if (isOnline) {
        shootingsReplicator.startReplicationPull();
        await shootingsReplicator.monitorReplicationStatus();
        shootingReplicatorPush.startReplicationPush();
        await shootingReplicatorPush.monitorReplicationStatus();
        shootingsReplicator.startReplicationPull();
      }

      return true;
    } catch (error) {
      console.error('Error durante la replicación de shootings:', error);
      return false;
    }
  };

  // This initial replication, is the first replication that is done when the user enters in a project. The idea is to replicate all the data from the server to the local database and use a loader to notify the status of replication. After this first replication, it is not necessary to replicate all the data again, and we can avoid the loaders

  let cancelCurrentIncrement: (() => void) | null = null;

  const incrementPercentage = (start: number, end: number, duration: number) => {
    // Cancelar la ejecución anterior si existe
    if (cancelCurrentIncrement) {
      cancelCurrentIncrement();
    }

    let current = start;
    const step = (end - start) / (duration / 10); // Incremento cada 10ms
    let timer: NodeJS.Timeout;

    const increment = () => {
      current += step;
      if (current >= end) {
        clearInterval(timer);
        setReplicationPercentage(end);
        cancelCurrentIncrement = null;
      } else {
        setReplicationPercentage(Math.round(current));
      }
    };

    timer = setInterval(increment, 10);

    // Crear una función de cancelación
    cancelCurrentIncrement = () => {
      clearInterval(timer);
      cancelCurrentIncrement = null;
    };
  };

  const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  const initialProjectReplication = async () => {
    if (!oneWrapRXdatabase) return;
    try {
      setInitialReplicationFinished(false);
      setReplicationPercentage(0);
      setReplicationStatus('Starting replication...');

      const steps = [
        {
          name: 'scenes', function: initializeSceneReplication, startPercentage: 0, endPercentage: 20,
        },
        {
          name: 'shootings', function: initializeShootingReplication, startPercentage: 20, endPercentage: 40,
        },
        {
          name: 'talents', function: initializeTalentsReplication, startPercentage: 40, endPercentage: 60,
        },
        {
          name: 'units', function: initializeUnitReplication, startPercentage: 60, endPercentage: 80,
        },
        {
          name: 'paragraphs', function: initializeParagraphReplication, startPercentage: 80, endPercentage: 100,
        },
      ];

      for (const step of steps) {
        setReplicationStatus(`Starting ${step.name} replication...`);
        incrementPercentage(step.startPercentage, step.startPercentage + 5, 2000);
        await step.function();
        incrementPercentage(step.startPercentage + 5, step.endPercentage, 3000);

        // Agregamos un pequeño tiempo de espera entre cada replicación
        await sleep(1000); // Espera de 1 segundo entre replicaciones
      }

      setReplicationStatus('Replication finished');
      setReplicationPercentage(100);
    } catch (error) {
      console.error('Error during initial replication:', error);
      setReplicationStatus('Error during initial replication');
      setReplicationPercentage(0);
    } finally {
      setInitialReplicationFinished(true);
      setProjectsInfoIsOffline({
        ...projectsInfoIsOffline,
        [projectId]: true,
      });
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
        isDatabaseReady,
        initialProjectReplication,
        replicationPercentage,
        replicationStatus,
        initialReplicationFinished,
        projectsInfoIsOffline,
        setProjectsInfoIsOffline,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
