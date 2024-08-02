import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { RxDatabase, RxLocalDocumentData } from 'rxdb';
import AppDataBase from '../RXdatabase/database';
import ScenesSchema from '../RXdatabase/schemas/scenes.schema';
import ProjectsSchema, { Project } from '../RXdatabase/schemas/projects.schema';
import SceneParagraphsSchema from '../RXdatabase/schemas/paragraphs.schema';
import HttpReplicator from '../RXdatabase/replicator';
import useNavigatorOnLine from '../hooks/Shared/useNavigatorOnline';
import UnitsSchema from '../RXdatabase/schemas/units.schema';
import ShootingsSchema from '../RXdatabase/schemas/shootings.schema';
import TalentsSchema from '../RXdatabase/schemas/talents.schema';
import AuthContext from './Auth.context';
import CrewSchema from '../RXdatabase/schemas/crew.schema';

import { Provider } from 'rxdb-hooks';
import CountriesSchema from '../RXdatabase/schemas/country.schema';

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
  resyncShootings: any;
  resyncScenes: any;
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
  resyncScenes: null,
  resyncShootings: null
});

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any>(
    localStorage.getItem('oneWrapRXdatabase') ? JSON.parse(localStorage.getItem('oneWrapRXdatabase') as string) : null,
  );
  const [sceneCollection, setSceneCollection] = useState<ScenesSchema | null>(null);
  const [paragraphCollection, setParagraphCollection] = useState<SceneParagraphsSchema | null>(null);
  const [projectCollection, setProjectCollection] = useState<ProjectsSchema | null>(null);
  const [unitsCollection, setUnitsCollection] = useState<UnitsSchema | null>(null);
  const [shootingsCollection, setShootingsCollection] = useState<ShootingsSchema | null>(null);
  const [talentsCollection, setTalentsCollection] = useState<TalentsSchema | null>(null);
  const [crewCollection, setCrewCollection] = useState<CrewSchema | null>(null);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [countriesCollection, setCountriesCollection] = useState<any>(null);
  const { getToken } = useContext(AuthContext);

  // Resync

  const resyncScenes: any = useRef(null)
  const resyncShootings: any = useRef(null)

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
    const initializeDatabase = async () => {
      try {
        const sceneColl = new ScenesSchema();
        const paragraphColl = new SceneParagraphsSchema();
        const projectColl = new ProjectsSchema();
        const unitsColl = new UnitsSchema();
        const shootingsColl = new ShootingsSchema();
        const talentsColl = new TalentsSchema();
        const crewColl = new CrewSchema();
        const countriesCollection = new CountriesSchema();

        const RXdatabase = new AppDataBase([sceneColl, projectColl, paragraphColl, unitsColl, shootingsColl, talentsColl, crewColl, countriesCollection]);
        const dbInstance = await RXdatabase.getDatabaseInstance();

        setOneWrapRXdatabase(dbInstance);
        localStorage.setItem('oneWrapRXdatabase', JSON.stringify(oneWrapRXdatabase));
        setSceneCollection(sceneColl);
        setParagraphCollection(paragraphColl);
        setProjectCollection(projectColl);
        setUnitsCollection(unitsColl);
        setShootingsCollection(shootingsColl);
        setTalentsCollection(talentsColl);
        setCrewCollection(crewColl);
        setCountriesCollection(countriesCollection);

        setIsDatabaseReady(true);

        if (isOnline) {
          const projectsReplicator = new HttpReplicator(dbInstance, [projectColl], null, null, getToken);
          await projectsReplicator.startReplicationPull();
          setProjectsAreLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener la instancia de la base de datos:', error);
      } finally {
        console.log('Base de datos inicializada');
        setProjectsAreLoading(false);
      }
    };

    if (!oneWrapRXdatabase) {
      initializeDatabase();
    }
  }, [isOnline, oneWrapRXdatabase]);

  useEffect(() => {
    localStorage.setItem('projectId', projectId);
    resyncScenes.current = null
    resyncShootings.current = null
  }, [projectId]);

  useEffect(() => {
    setProjectsAreLoading(true);
    if (oneWrapRXdatabase) {
      const subscription = oneWrapRXdatabase.projects.find().sort({ updatedAt: 'asc' }).$.subscribe({
        next: (data: Project[]) => {
          setOfflineProjects(data);
          setProjectsAreOffline(true);
          const projects = data.map((project: any) => project._data);
          try {
            const projectsInfoIsOffline = localStorage.getItem('projectsInfoIsOffline') ? JSON.parse(localStorage.getItem('projectsInfoIsOffline') as string) : Object.fromEntries(
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
        error: (error: any) => {
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
  
      if(!resyncScenes.current) {
        const scenesReplicator = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], parseInt(projectId), lastSceneInProject, getToken);
  
        if (isOnline) {
          await scenesReplicator.startReplicationPull();
          await scenesReplicator.startReplicationPush();
        }
      } else {
        resyncScenes.current.resyncReplication()
      }
      return true;
    } catch (error) {
      console.error('Error durante la replicación de escenas:', error);
      return false;
    }
  };

  const initializeParagraphReplication = async () => {
    try {
      const lastParagraphInProject = await oneWrapRXdatabase?.paragraphs.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const paragraphsReplicator = new HttpReplicator(oneWrapRXdatabase, [paragraphCollection], parseInt(projectId), lastParagraphInProject, getToken);

      if (isOnline) {
        await paragraphsReplicator.startReplicationPull();
      }

    } catch (error) {
      console.error('Error durante la replicación de párrafos:', error);
      return false;
    } finally {
      console.log('Paragraphs replication finished');
    }
    return true;
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
        await talentsReplicator.startReplicationPull();
      }

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
        await unitsReplicator.startReplicationPull();
      }

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

      if(!resyncShootings.current) {
        const shootingsReplicator = new HttpReplicator(oneWrapRXdatabase, [shootingsCollection], parseInt(projectId), lastShootingInProject, getToken);

        if (isOnline) {
          await shootingsReplicator.startReplicationPull();
          await shootingsReplicator.startReplicationPush();
  
          resyncShootings.current = shootingsReplicator
        }
      } else {
        resyncShootings.current.resyncReplication()
      }

      return true;
    } catch (error) {
      console.error('Error durante la replicación de shootings:', error);
      return false;
    }
  };

  const initializeCrewReplication = async () => {
    if (!crewCollection || !oneWrapRXdatabase || !projectId) return false;
    try {
      const lastCrewInProject = await oneWrapRXdatabase.crew.find({
        selector: { projectId: parseInt(projectId) },
      }).sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const crewReplicator = new HttpReplicator(oneWrapRXdatabase, [crewCollection], parseInt(projectId), lastCrewInProject, getToken);

      if (isOnline) {
        await crewReplicator.startReplicationPull();
      }

      return true;
    } catch (error) {
      console.error('Error durante la replicación de crew:', error);
      return false;
    }
  }

  const initializeCountriesReplication = async () => {
    if (!countriesCollection || !oneWrapRXdatabase) return false;
    try {
      const lastCountry = await oneWrapRXdatabase.countries.find().sort({ updatedAt: 'desc' }).limit(1).exec()
        .then((data: any) => (data[0] ? data[0] : null));

      const countriesReplicator = new HttpReplicator(oneWrapRXdatabase, [countriesCollection], null, lastCountry, getToken);

      if (isOnline) {
        await countriesReplicator.startReplicationPull();
      }

      return true;
    } catch (error) {
      console.error('Error during countries replication:', error);
      return false;
    }
  }

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
    try {
      setInitialReplicationFinished(false);
      setReplicationPercentage(0);
      setReplicationStatus('Starting replication...');

      const steps = [
        {
          name: 'Scene',
          startPercentage: 0,
          endPercentage: 20,
          function: initializeSceneReplication,
        },
        {
          name: 'Paragraph',
          startPercentage: 20,
          endPercentage: 40,
          function: initializeParagraphReplication,
        },
        {
          name: 'Unit',
          startPercentage: 40,
          endPercentage: 50,
          function: initializeUnitReplication,
        },
        {
          name: 'Talent',
          startPercentage: 50,
          endPercentage: 60,
          function: initializeTalentsReplication,
        },
        {
          name: 'Shooting',
          startPercentage: 60,
          endPercentage: 70,
          function: initializeShootingReplication,
        },
        {
          name: 'Countries',
          startPercentage: 70,
          endPercentage: 80,
          function: initializeCountriesReplication,
        },
        {
          name: 'Crew',
          startPercentage: 80,
          endPercentage: 100,
          function: initializeCrewReplication,
        }
      ];

      for (const step of steps) {
        setReplicationStatus(`Starting ${step.name} replication...`);
        incrementPercentage(step.startPercentage, step.startPercentage + 5, 10000);
        await step.function().then((result) => {
          console.log('Replication finished:', result);
        }).catch((error) => {
          console.error('Error during replication:', error);
        });
        incrementPercentage(step.startPercentage + 5, step.endPercentage, 10000);

        await sleep(1000);
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
      setReplicationPercentage(0)
    }
  };

  return (
    <Provider db={oneWrapRXdatabase}>
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
            resyncScenes,
            resyncShootings
          }}
        >
        {children}
      </DatabaseContext.Provider>
    </Provider>
  );
};

export default DatabaseContext;
