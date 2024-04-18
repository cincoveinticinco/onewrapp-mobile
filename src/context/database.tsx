import React, { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import AppDataBase from '../RXdatabase/database';
import ScenesSchema from '../RXdatabase/schemas/scenes';
import ProjectsSchema from '../RXdatabase/schemas/projects';
import { Scene } from '../interfaces/scenesTypes';
import SceneParagraphsSchema from '../RXdatabase/schemas/paragraphs';
import HttpReplicator from '../RXdatabase/replicator';

const sceneCollection = new ScenesSchema();
const paragraphCollection = new SceneParagraphsSchema();
const projectCollection = new ProjectsSchema();
const projectId = 163;

const RXdatabase = new AppDataBase([sceneCollection, projectCollection, paragraphCollection]);

const DatabaseContext = React.createContext<any>({
  oneWrapDb: null,
  offlineScenes: [],
});

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any | null>(null);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const scenesQuery = oneWrapRXdatabase?.scenes.find();
  const offlineScenes$: Observable<Scene[]> = scenesQuery ? scenesQuery.$ : null;

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const dbInstance = await RXdatabase.getDatabaseInstance();
        setOneWrapRXdatabase(dbInstance);
        const replicator = new HttpReplicator(dbInstance, [sceneCollection, paragraphCollection], projectId);
        replicator.startReplicationPull();
      } catch (error) {
        console.error('Error al obtener la instancia de la base de datos:', error);
      }
    };

    if (!oneWrapRXdatabase) {
      initializeDatabase();
    }
  }, []);

  useEffect(() => {
    const subscription = offlineScenes$?.subscribe((data: any) => {
      setOfflineScenes(data);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [offlineScenes$]);

  useEffect(() => {
   
      const initializeReplication = () => {
        if (oneWrapRXdatabase) {
          const replicator2 = new HttpReplicator(oneWrapRXdatabase, [sceneCollection], projectId);
          replicator2.startReplicationPush();
        }
      };

      initializeReplication();

  }, [oneWrapRXdatabase, offlineScenes]);

  return (
    <DatabaseContext.Provider value={{ oneWrapDb: oneWrapRXdatabase, offlineScenes }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
