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
import environment from '../../environment';
import { useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
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
  initializeShootingReplication: () => Promise<void>;
  initializeSceneReplication: () => Promise<void>;
  initializeParagraphReplication: () => Promise<void>;
  initializeUnitReplication: () => Promise<void>;
  initializeTalentsReplication: () => Promise<void>;
  isDatabaseReady: boolean;
  initialProjectReplication: () => Promise<void>;
  replicationPercentage: number;
  replicationStatus: string;
  initialReplicationFinished: boolean;
  projectsInfoIsOffline: {[key: string]: boolean};
  setProjectsInfoIsOffline: (projectsInfoIsOffline: {[key: string]: boolean}) => void;
  initializeProjectsUserReplication: () => Promise<void>;
  initializeAllReplications: () => Promise<void>;
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
  initializeAllReplications: () => new Promise(() => false),
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
   getToken
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
  const [initialReplicationFinished, setInitialReplicationFinished] = useState(false);
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
    if (!oneWrapRXdatabase || !collection || (projectId && !projectId)) {
      throw new Error('Invalid initialization parameters');
    }
  
    const canPush = ['scenes', 'shootings', 'crew'].includes(collection.getSchemaName().toLowerCase());
  
    const lastItem = await oneWrapRXdatabase[collection.getSchemaName()].find({ selector })
      .sort({ updatedAt: 'desc' })
      .limit(1)
      .exec()
      .then((data: any) => (data[0] ? data[0] : null));
  
    if (!resyncRef.current) {
      const replicator = new HttpReplicator(oneWrapRXdatabase, [collection], projectId, lastItem, getToken);
      if (isOnline) {
        await replicator.startReplication(true, canPush);
        resyncRef.current = replicator;
      }
    } else {
      isOnline && resyncRef.current.resyncReplication();
    }
  
    return true;
  }
  
  const handleDeletedRecords = async (collectionName: string, apiEndpoint: string, projectId: string) => {
    
    // El problema actual es el siguiente. Supongamos que tengo un shooting que fue borrado desde la aplicación web. El shooting era de la unidad 1 con id = 63 y se creó para el día 21 de octubre del 2024 a las 5 de la tarde, por lo tanto, el id del shootin en local sería 2024-10-21_63. Al eliminarse el shooting, la tabla de auditoria en el backend guarda el shooting borrado, que servira de consulta para la aplicación offline. Cuando el usuario de la aplicación offline se conecte, se hara una consulta a la tabla de auditoria, que enviara a la aplicación todos los shootings que fueron borrados en los últimos 3 días, en este caso, envía un array con el id [2023-10-21_63] y desde la aplicación offline, se eliminan en local todos los shooting que tengan este id. Que pasa si ese mismo día, despues de haber borrado ese shooting, lo vuelvo a crear para añadir otra configuración? La aplicación offline, al sincronizarse traera de nuevo el shooting 2024-10-21_63, pero como la consulta a la tabla de auditoria sigue retornando [2023-10-21_63], lo borrara durante los 3 días siguientes. 

    // OPCION 1:  Se me ocurrio usar el createdAt como referencia, para decirle a la aplicación local que el shooting solo se podrá borrar siempre y cuando coincidan el id y el created_at, el problema, es que RXDB escribe automaticamente un createdAt pero basado en el momento en el que se creo el registro en la base de datos local.

    // SOLUCIÓN: Crear un parametro llamado createdAtBack, que es una referencia exacta del momento en el que se creó el shooting en el backend. De esta forma, se va a eliminar el shooting en local si y solo si, el shooting que traiga la tabla de registros coincida tanto en id como en created_at. para este proposito, la consulta ya no me va a arrojar un array de ids, si no más bien, un array de objetos con las llaves id y createdAt

    // COMO TESTEAR?:
    // 1. Crear un shooting en la aplicación local
    // 2. Borrar el shooting en la aplicación web
    // 3. Sincronizar la aplicación local
    // 4. Verificar que el shooting fue eliminado
    // 5. Crear el shooting en la aplicación web o en la aplicación local
    // 6. Sincronizar la aplicación local
    // 7. Verificar que el shooting no fue eliminado
    
    try {
      // Obtener el último registro actualizado
      const lastData = await oneWrapRXdatabase[collectionName]
        .find({
          selector: {
            projectId: parseInt(projectId, 10)
          }
        })
        .sort({
          updatedAt: 'desc'
        })
        .limit(1)
        .exec();
  
      const last_updated_at = lastData[0]?.updatedAt ? new Date(lastData[0]?.updatedAt).toISOString() : '1970-01-01T00:00:00.000Z';
      
      // Configurar los parámetros de la URL
      const params = new URLSearchParams({
        project_id: projectId.toString(),
        last_item_updated_at: last_updated_at
      });
  
      const url = `${environment.URL_PATH}/${apiEndpoint}?${params.toString()}`;
  
      // Llamada a la API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Owsession': `${await getToken()}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Si hay registros eliminados, procesarlos
      if (data[collectionName] && data[collectionName].length > 0) {
        const deletedItems = data[collectionName];
        
        // Procesar las eliminaciones usando una transacción de RxDB
        await oneWrapRXdatabase[collectionName].database.waitForLeadership();
        
        for (const deletedItem of deletedItems) {
          if(deletedItem) {
            const query = deletedItem && oneWrapRXdatabase[collectionName].find({
              selector: {
                id: deletedItem.id,
                createdAtBack: deletedItem.createdAt
              }
            });
    
            const localItems = await query.exec();
            if (localItems.length > 0) {
              await Promise.all(
                localItems.map(async (item: any) => {
                  await item.remove();
                })
              );
            }
          }
        }
      }
  
      return true;
    } catch (error) {
      console.error(`Error in handling deleted records for ${collectionName}:`, error);
      throw error;
    }
  };

  const initializeProjectsUserReplication = async () => {
    await initializeReplication(projectCollection, {}, resyncProjectsUser);
  };
  
  const initializeSceneReplication = async () => {
    await initializeReplication(
      sceneCollection,
      { projectId: parseInt(projectId, 10), createdAtBack: { $exists: true } },
      resyncScenes,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('scenes', 'get_deleted_scenes', projectId);
  };
  
  const initializeServiceMatricesReplication = async () => {
    await initializeReplication(
      serviceMatricesCollection,
      { projectId: parseInt(projectId, 10) },
      resyncServiceMatrices,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('service_matrices', 'get_deleted_service_matrices', projectId);
  };
  
  const initializeParagraphReplication = async () => {
    await initializeReplication(
      paragraphCollection,
      { projectId: parseInt(projectId, 10) },
      resyncParagraphs,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('paragraphs', 'get_deleted_paragraphs', projectId);
  };
  
  const initializeTalentsReplication = async () => {
    await initializeReplication(
      talentsCollection,
      { projectId: parseInt(projectId, 10) },
      resyncTalents,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('talents', 'get_deleted_talents', projectId);
  };
  
  const initializeUnitReplication = async () => {
    await initializeReplication(
      unitsCollection,
      { projectId: parseInt(projectId, 10) },
      resyncUnits,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('units', 'get_deleted_units', projectId);
  };
  
  const initializeShootingReplication = async () => {
    await initializeReplication(
      shootingsCollection,
      { projectId: parseInt(projectId, 10), createdAtBack: { $exists: true } },
      resyncShootings,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('shootings', 'get_deleted_shootings', projectId);
  };
  
  const initializeCrewReplication = async () => {
    await initializeReplication(
      crewCollection,
      { projectId: parseInt(projectId, 10) },
      resyncCrew,
      parseInt(projectId, 10)
    );
    await handleDeletedRecords('crew', 'get_deleted_crew', projectId);
  };
  
  const initializeCountriesReplication = async () => {
    await initializeReplication(
      countriesCollection,
      {},
      resyncCountries
    );
  };

  const initializeAllReplications = async () => {
    const replicationsArray = [initializeProjectsUserReplication, initializeSceneReplication, initializeServiceMatricesReplication, initializeParagraphReplication, initializeTalentsReplication, initializeUnitReplication, initializeShootingReplication, initializeCrewReplication, initializeCountriesReplication];
    
    try {
      for (const replication of replicationsArray) {
        await replication();
      }
    } catch (error) {
      console.error('Error in initializeAllReplications:', error);
      throw error;
    }
  };

  useIonViewDidEnter(() => {
    if (oneWrapRXdatabase && isOnline && projectId && initialReplicationFinished) {
      initializeAllReplications();
    }
  });
  
  useEffect(() => {
    const replicatePeriodically = async () => {
      if (oneWrapRXdatabase && isOnline && projectId) {
        await initializeAllReplications();
      }
    };
  
    if (oneWrapRXdatabase && isOnline && projectId) {

      replicatePeriodically();
  
      const intervalId = setInterval(() => {
        replicatePeriodically();
      }, 300000);

      return () => clearInterval(intervalId);
    }
  }, [oneWrapRXdatabase, isOnline, projectId, initialReplicationFinished]);

  useEffect(() => {
    if (!oneWrapRXdatabase) {
      initializeDatabase();
    }
  }, [isOnline, oneWrapRXdatabase]);

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

  const initialProjectReplication = async () => {
    let currentStep: string = '';
    
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
        currentStep = step.name;
        setReplicationStatus(`Starting ${step.name} replication...`);
        incrementPercentage(step.startPercentage, step.startPercentage + 5, 10000);
        
        await step.function();
     
        incrementPercentage(step.startPercentage + 5, step.endPercentage, 10000);
      }
  
      setReplicationStatus('Replication finished');
      setReplicationPercentage(100);
      setInitialReplicationFinished(true);
      setProjectsInfoIsOffline({
        ...projectsInfoIsOffline,
        [projectId]: true,
      });
      setReplicationPercentage(0);
      
    } catch (error: any) {
      setReplicationStatus(`Error during ${currentStep} replication: ${error.message}`);
      setReplicationPercentage(0);
      setInitialReplicationFinished(false);
      throw error;
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
          initializeAllReplications,
        }}
      >
        {children}
      </DatabaseContext.Provider>
    </Provider>
  );
};

export default DatabaseContext;
