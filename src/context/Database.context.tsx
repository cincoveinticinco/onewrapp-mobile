import { debounce } from 'lodash';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { RxDatabase, RxLocalDocumentData } from 'rxdb';
import { Provider } from 'rxdb-hooks';
import AppDataBase from '../RXdatabase/database';
import HttpReplicator from '../RXdatabase/replicator';
import CrewSchema from '../RXdatabase/schemas/crew.schema';
import SceneParagraphsSchema from '../RXdatabase/schemas/paragraphs.schema';
import ProjectsSchema, { Project } from '../RXdatabase/schemas/projects.schema';
import ScenesSchema from '../RXdatabase/schemas/scenes.schema';
import ShootingsSchema from '../RXdatabase/schemas/shootings.schema';
import TalentsSchema from '../RXdatabase/schemas/talents.schema';
import UnitsSchema from '../RXdatabase/schemas/units.schema';
import AuthContext from './Auth.context';

import CountriesSchema from '../RXdatabase/schemas/country.schema';
import ServiceMatricesSchema from '../RXdatabase/schemas/serviceMatrices.schema';
import UserSchema from '../RXdatabase/schemas/user.schema';
import useNetworkStatus from '../hooks/Shared/useNetworkStatus';
import { User } from '../interfaces/user.types';
export interface DatabaseContextProps {
  oneWrapDb: RxDatabase | null;
  offlineScenes: any[];
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
  initializeProjectsUserReplication: () => Promise<boolean>;
}

const DatabaseContext = React.createContext<DatabaseContextProps>({
  oneWrapDb: null,
  offlineScenes: [],
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
  initializeProjectsUserReplication: () => new Promise(() => false),
});

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any>(null);
  const [sceneCollection, setSceneCollection] = useState<ScenesSchema | null>(null);
  const [paragraphCollection, setParagraphCollection] = useState<SceneParagraphsSchema | null>(null);
  const [projectCollection, setProjectCollection] = useState<ProjectsSchema | null>(null);
  const [unitsCollection, setUnitsCollection] = useState<UnitsSchema | null>(null);
  const [shootingsCollection, setShootingsCollection] = useState<ShootingsSchema | null>(null);
  const [talentsCollection, setTalentsCollection] = useState<TalentsSchema | null>(null);
  const [crewCollection, setCrewCollection] = useState<CrewSchema | null>(null);
  const [serviceMatricesCollection, setServiceMatricesCollection] = useState<ServiceMatricesSchema | null>(null);
  const [userCollection, setUserCollection] = useState<UserSchema | null>(null);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [countriesCollection, setCountriesCollection] = useState<any>(null);
  const {
    checkSession, setLoadingAuth, getToken, logout,
  } = useContext(AuthContext);

  const resyncScenes: any = useRef(null);
  const resyncShootings: any = useRef(null);
  const resyncProjectsUser: any = useRef(null);
  const resyncParagraphs: any = useRef(null);
  const resyncUnits: any = useRef(null);
  const resyncTalents: any = useRef(null);
  const resyncCrew: any = useRef(null);
  const resyncServiceMatrices: any = useRef(null);
  const resyncCountries: any = useRef(null);

  const [viewTabs, setViewTabs] = useState(true);
  const [projectsAreLoading, setProjectsAreLoading] = useState(true);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const [startReplication, setStartReplication] = useState(false);
  const [projectId, setProjectId] = useState<any>(localStorage.getItem('projectId') || null);
  const [scenesAreLoading, setScenesAreLoading] = useState(true);
  const [initialReplicationFinished, setInitialReplicationFinished] = useState(true);
  const [replicationStatus, setReplicationStatus] = useState<string>('');
  const isOnline =  useNetworkStatus();
  const [replicationPercentage, setReplicationPercentage] = useState(0);
  const [projectsAreOffline, setProjectsAreOffline] = useState<boolean>(
    localStorage.getItem('projectsAreOffline') ? JSON.parse(localStorage.getItem('projectsAreOffline') as string) : false,
  );
  const [projectsInfoIsOffline, setProjectsInfoIsOffline] = useState<{[key: string]: boolean}>(
    localStorage.getItem('projectsInfoIsOffline') ? JSON.parse(localStorage.getItem('projectsInfoIsOffline') as string) : {},
  );

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
      const serviceMatricesCollection = new ServiceMatricesSchema();
      const userCollection = new UserSchema();

      const RXdatabase = new AppDataBase([sceneColl, projectColl, paragraphColl, unitsColl, shootingsColl, talentsColl, crewColl, countriesCollection, serviceMatricesCollection, userCollection]);
      const dbInstance = await RXdatabase.getDatabaseInstance();

      setOneWrapRXdatabase(dbInstance);
      setSceneCollection(sceneColl);
      setParagraphCollection(paragraphColl);
      setProjectCollection(projectColl);
      setUnitsCollection(unitsColl);
      setShootingsCollection(shootingsColl);
      setTalentsCollection(talentsColl);
      setCrewCollection(crewColl);
      setCountriesCollection(countriesCollection);
      setServiceMatricesCollection(serviceMatricesCollection);
      setUserCollection(userCollection);

      setIsDatabaseReady(true);

      if (isOnline) {
        const projectsReplicator = new HttpReplicator(dbInstance, [projectColl, userCollection], null, null, getToken);
        await projectsReplicator.startReplication(true, false); // Solo PULL para proyectos y usuarios
        resyncProjectsUser.current = projectsReplicator;
      }
    } catch (error) {
      throw error;
    }
  };

  const initializeReplication = async (collection: any, selector: any, resyncRef: any, projectId: number | null = null) => {
    if (!oneWrapRXdatabase || !collection || (projectId && !projectId)) return false;

    const canPush = ['scenes', 'shootings', 'crew'].includes(collection.getSchemaName().toLowerCase());

    try {
      const lastItem = await oneWrapRXdatabase[collection.getSchemaName()].find({ selector })
        .sort({ updatedAt: 'desc' })
        .limit(1)
        .exec()
        .then((data: any) => (data[0] ? data[0] : null));

      if (!resyncRef.current) {
        const replicator = new HttpReplicator(oneWrapRXdatabase, [collection], projectId, lastItem, getToken);
        if (isOnline) {
          await replicator.startReplication(true, canPush); // Only PULL for others, PUSH and PULL for scenes and shootings
          resyncRef.current = replicator;
        }
      } else {
        isOnline && resyncRef.current.resyncReplication();
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const initializeProjectsUserReplication = () => initializeReplication(projectCollection, {}, resyncProjectsUser);

  const initializeSceneReplication = () => initializeReplication(sceneCollection, { projectId: parseInt(projectId, 10) }, resyncScenes, parseInt(projectId, 10));

  const initializeServiceMatricesReplication = () => initializeReplication(serviceMatricesCollection, { projectId: parseInt(projectId, 10) }, resyncServiceMatrices, parseInt(projectId, 10));

  const initializeParagraphReplication = () => initializeReplication(paragraphCollection, { projectId: parseInt(projectId, 10) }, resyncParagraphs, parseInt(projectId, 10));

  const initializeTalentsReplication = () => initializeReplication(talentsCollection, { projectId: parseInt(projectId, 10) }, resyncTalents, parseInt(projectId, 10));

  const initializeUnitReplication = () => initializeReplication(unitsCollection, { projectId: parseInt(projectId, 10) }, resyncUnits, parseInt(projectId, 10));

  const initializeShootingReplication = () => initializeReplication(shootingsCollection, { projectId: parseInt(projectId, 10) }, resyncShootings, parseInt(projectId, 10));

  const initializeCrewReplication = () => initializeReplication(crewCollection, { projectId: parseInt(projectId, 10) }, resyncCrew, parseInt(projectId, 10));

  const initializeCountriesReplication = () => initializeReplication(countriesCollection, {}, resyncCountries);

  useEffect(() => {
    if (oneWrapRXdatabase && isOnline && projectId && initialReplicationFinished) {
      const initializeAllReplications = async () => {
        console.log('projectId', typeof projectId);
        if (projectId) {
          console.log('projectId is null, skipping replication');
          return;
        }
        console.log('Initializing all replications');
        await initializeProjectsUserReplication();
        await initializeSceneReplication();
        await initializeServiceMatricesReplication();
        await initializeParagraphReplication();
        await initializeTalentsReplication();
        await initializeUnitReplication();
        await initializeShootingReplication();
        await initializeCrewReplication();
        await initializeCountriesReplication();
      };
  
      debounce(initializeAllReplications, 1000)();
    }
  }, [oneWrapRXdatabase, isOnline, projectId, initialReplicationFinished]);

  useEffect(() => {
    if (!oneWrapRXdatabase) {
      initializeDatabase();
    }
  }, [isOnline, oneWrapRXdatabase]);

  useEffect(() => {
    if (isOnline) {
      checkSession().finally(() => setLoadingAuth(false));
    } else {
      const user: User = oneWrapRXdatabase?.user.findOne().exec();
      if (user) {
        const sessionEndsAt = new Date(user.sessionEndsAt).getTime();
        const now = new Date().getTime();
        if (now > sessionEndsAt) {
          logout();
          setLoadingAuth(false);
        }
      }
    }
  }, [checkSession, isOnline]);

  useEffect(() => {
    if(projectId) {
      localStorage.setItem('projectId', projectId);
      resyncScenes.current = null;
      resyncShootings.current = null;
      resyncProjectsUser.current = null;
    }
  }, [projectId]);

  useEffect(() => {
    setProjectsAreLoading(true);
    if (oneWrapRXdatabase) {
      const subscription = oneWrapRXdatabase.projects.find().sort({ updatedAt: 'asc' }).$.subscribe({
        next: (data: Project[]) => {
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
            throw error;
          }
        },
        error: (error: any) => {
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
          name: 'Countries',
          startPercentage: 0,
          endPercentage: 5,
          function: initializeCountriesReplication,
        },
        {
          name: 'Service Matrices',
          startPercentage: 5,
          endPercentage: 10,
          function: initializeServiceMatricesReplication,
        },
        {
          name: 'Scene',
          startPercentage: 10,
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
          name: 'Crew',
          startPercentage: 70,
          endPercentage: 100,
          function: initializeCrewReplication,
        },
      ];

      for (const step of steps) {
        setReplicationStatus(`Starting ${step.name} replication...`);
        incrementPercentage(step.startPercentage, step.startPercentage + 5, 10000);
        await step.function().then((result) => {

        }).catch((error) => {
          setReplicationStatus(`Error during ${step.name} replication`);
        });
        incrementPercentage(step.startPercentage + 5, step.endPercentage, 10000);

        await sleep(1000);
      }

      setReplicationStatus('Replication finished');
      setReplicationPercentage(100);
    } catch (error) {
      setReplicationStatus('Error during initial replication');
      setReplicationPercentage(0);
      throw error;
    } finally {
      setInitialReplicationFinished(true);
      setProjectsInfoIsOffline({
        ...projectsInfoIsOffline,
        [projectId]: true,
      });
      setReplicationPercentage(0);
    }
  };

  return (
    <Provider db={oneWrapRXdatabase}>
      <DatabaseContext.Provider
        value={{
          oneWrapDb: oneWrapRXdatabase,
          offlineScenes,
          setStartReplication,
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
          initializeProjectsUserReplication,
        }}
      >
        {children}
      </DatabaseContext.Provider>
    </Provider>
  );
};

export default DatabaseContext;
