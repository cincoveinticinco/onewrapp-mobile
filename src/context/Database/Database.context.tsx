/**
 * DatabaseContext - Bridge ligero entre database module y React UI
 * Solo maneja suscripciones a eventos y expone estado
 */

import React, { useContext, useEffect, useState } from 'react';
import { Provider } from 'rxdb-hooks';
import AuthContext from '../Auth/Auth.context';
import useNetworkStatus from '../../hooks/utils/useNetworkStatus/useNetworkStatus';
import useAppStore from '../../hooks/utils/useAppStore/useAppStore';
import { databaseManager, replicationManager, dbEvents } from '../../database';
import { DatabaseContextProps } from './types/Database.types';

const DatabaseContext = React.createContext<DatabaseContextProps>({
  oneWrapDb: null,
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
  isDatabaseReady: false,
  initialProjectReplication: () => new Promise(() => false),
  replicationPercentage: 0,
  replicationStatus: '',
  projectsInfoIsOffline: {},
  setProjectsInfoIsOffline: () => {},
  initializeProjectsUserReplication: () => new Promise(() => false),
  initializeAllReplications: () => new Promise(() => false),
  hardResync: () => new Promise(() => false),
  hardAppReset: () => new Promise(() => false),
  initialReplicationDone: false, // Nuevo
});

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    scenesAreLoading,
    setScenesAreLoading,
    replicationStatus,
    setReplicationStatus,
    replicationPercentage,
    setReplicationPercentage,
    projectsAreOffline,
    setProjectsAreOffline,
    projectsInfoIsOffline,
    setProjectsInfoIsOffline,
    projectId,
    setProjectId,
  } = useAppStore();

  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any>(null);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [viewTabs, setViewTabs] = useState(true);
  const [projectsAreLoading, setProjectsAreLoading] = useState(true);
  const [startReplication, setStartReplication] = useState(false);
  const [initialReplicationDone, setInitialReplicationDone] = useState(false);
  
  const isOnline = useNetworkStatus();
  const { getToken } = useContext(AuthContext);

  // La DB ya fue inicializada en main.tsx, solo obtenemos la instancia
  useEffect(() => {
    console.log('[DatabaseContext] Getting database instance...');
    const db = databaseManager.getDatabase();
    
    if (db) {
      console.log('[DatabaseContext] Database already ready!');
      setOneWrapRXdatabase(db);
      setIsDatabaseReady(true);
    } else {
      console.log('[DatabaseContext] Waiting for database:ready event...');
      const unsubscribe = dbEvents.on('database:ready', (database) => {
        console.log('[DatabaseContext] Database ready event received');
        setOneWrapRXdatabase(database);
        setIsDatabaseReady(true);
      });
      
      return unsubscribe;
    }
  }, []);

  // Hacer replicación inicial de proyectos/usuarios cuando tengamos DB + token + online
  useEffect(() => {
    const doInitialReplication = async () => {
      // Verificar si ya se hizo antes
      const replicationDone = localStorage.getItem('initialProjectsReplicationDone');
      if (replicationDone === 'true') {
        console.log('[DatabaseContext] Initial replication already done, skipping');
        setInitialReplicationDone(true);
        setProjectsAreLoading(false);
        return;
      }

      if (isDatabaseReady && isOnline && await getToken()) {
        console.log('[DatabaseContext] Starting initial projects/users replication...');
        setProjectsAreLoading(true);
        
        try {
          await replicationManager.initializeProjectsUserReplication();
          console.log('[DatabaseContext] Initial replication completed!');
          localStorage.setItem('initialProjectsReplicationDone', 'true');
          setInitialReplicationDone(true);
          setProjectsAreLoading(false);
        } catch (error) {
          console.error('[DatabaseContext] Initial replication failed:', error);
          setProjectsAreLoading(false);
        }
      }
    };

    doInitialReplication();
  }, [isDatabaseReady, isOnline, getToken]);

  // Configurar replication manager
  useEffect(() => {
    if (isDatabaseReady && getToken) {
      console.log('[DatabaseContext] Configuring replication manager', { isOnline });
      replicationManager.configure(isOnline, getToken);
    }
  }, [isDatabaseReady, isOnline, getToken]);

  // Sync projectId
  useEffect(() => {
    if (projectId) {
      replicationManager.setProjectId(parseInt(projectId, 10));
      localStorage.setItem('projectId', projectId);
    }
  }, [projectId]);

  // Escuchar eventos de replicación
  useEffect(() => {
    const unsubscribeProgress = dbEvents.on('replication:progress', (progress) => {
      console.log(`🎨 UI Update - Progress: ${progress.percentage}%, Status: ${progress.status}`);
      setReplicationPercentage(progress.percentage);
      setReplicationStatus(progress.status);
    });

    const unsubscribeComplete = dbEvents.on('replication:complete', ({ projectId }) => {
      setProjectsInfoIsOffline({ ...projectsInfoIsOffline, [projectId]: true });
      setReplicationStatus('Replication finished');
      setReplicationPercentage(100);
    });

    const unsubscribeError = dbEvents.on('replication:error', ({ error, step }) => {
      setReplicationStatus(`Error during ${step} replication: ${error.message}`);
      setReplicationPercentage(0);
    });

    return () => {
      unsubscribeProgress();
      unsubscribeComplete();
      unsubscribeError();
    };
  }, [projectsInfoIsOffline]);

  // Proyectos: iniciar suscripción en el módulo y escuchar eventos
  useEffect(() => {
    if (!isDatabaseReady) return;

    databaseManager.startProjectsSubscription();

    return dbEvents.on('projects:changed', (projects) => {
      setProjectsAreOffline(true);
      const storedInfo = localStorage.getItem('projectsInfoIsOffline');
      const projectsInfo = storedInfo
        ? JSON.parse(storedInfo)
        : Object.fromEntries(projects.map((p: any) => [String(p.id), false]));
      setProjectsInfoIsOffline(projectsInfo);
    });
  }, [isDatabaseReady]);

  // Escenas: la suscripción la gestiona ReplicationManager.setProjectId(), solo escuchamos eventos
  useEffect(() => {
    if (!projectId) return;

    setScenesAreLoading(true);

    return dbEvents.on('scenes:changed', ({ projectId: changedProjectId }) => {
      if (changedProjectId === parseInt(projectId)) {
        setScenesAreLoading(false);
      }
    });
  }, [projectId]);

  // Replicación automática (polling interno RxDB)
  useEffect(() => {
    if (oneWrapRXdatabase && isOnline && projectId && projectsInfoIsOffline[projectId]) {
      replicationManager.initializeAllReplications();
    }
  }, [oneWrapRXdatabase, isOnline, projectId, projectsInfoIsOffline]);

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem('projectsAreOffline', JSON.stringify(projectsAreOffline));
  }, [projectsAreOffline]);

  useEffect(() => {
    localStorage.setItem('projectsInfoIsOffline', JSON.stringify(projectsInfoIsOffline));
  }, [projectsInfoIsOffline]);

  // Delegates a database module
  const initialProjectReplication = () => replicationManager.initialProjectReplication();
  const initializeProjectsUserReplication = () => replicationManager.initializeProjectsUserReplication();
  const initializeAllReplications = () => replicationManager.initializeAllReplications();
  const hardResync = () => replicationManager.hardResync();
  const hardAppReset = () => databaseManager.hardAppReset();

  return (
    <Provider db={oneWrapRXdatabase}>
      <DatabaseContext.Provider
        value={{
          oneWrapDb: oneWrapRXdatabase,
          setStartReplication,
          projectId: projectId ? parseInt(projectId) : null,
          setProjectId,
          startReplication,
          isOnline,
          scenesAreLoading,
          viewTabs,
          setViewTabs,
          setScenesAreLoading,
          projectsAreLoading,
          setProjectsAreLoading,
          isDatabaseReady,
          initialProjectReplication,
          replicationPercentage,
          replicationStatus,
          projectsInfoIsOffline,
          setProjectsInfoIsOffline,
          initializeProjectsUserReplication,
          initializeAllReplications,
          hardResync,
          hardAppReset,
          initialReplicationDone,
        }}
      >
        {children}
      </DatabaseContext.Provider>
    </Provider>
  );
};

export default DatabaseContext;
