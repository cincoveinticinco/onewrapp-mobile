import React, { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import AppDataBase from '../RXdatabase/database';
import ScenesSchema from '../RXdatabase/schemas/scenes';
import ProjectsSchema from '../RXdatabase/schemas/projects';

const sceneCollection = new ScenesSchema();
const projectCollection = new ProjectsSchema();

const RXdatabase = new AppDataBase([sceneCollection, projectCollection]);

const DatabaseContext = React.createContext<any>({
  oneWrapDb: null,
  offlineScenes: [],
});

export const DatabaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneWrapRXdatabase, setOneWrapRXdatabase] = useState<any | null>(null);
  const [offlineScenes, setOfflineScenes] = useState<any[]>([]);
  const scenesQuery = oneWrapRXdatabase?.scenes.find();
  const offlineScenes$: Observable<any[]> = scenesQuery ? scenesQuery.$ : null;

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const dbInstance = await RXdatabase.getDatabaseInstance();
        setOneWrapRXdatabase(dbInstance);
        console.log('Database instance:', dbInstance);
      } catch (error) {
        console.error('Error al obtener la instancia de la base de datos:', error);
      }
    };

    if (!oneWrapRXdatabase) {
      initializeDatabase();
    }
  }, [oneWrapRXdatabase]);

  useEffect(() => {
    const subscription = offlineScenes$?.subscribe((data: any) => {
      setOfflineScenes(data);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [offlineScenes$]);

  return (
    <DatabaseContext.Provider value={{ oneWrapDb: oneWrapRXdatabase, offlineScenes }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
