import React, { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import AppDataBase from '../RXdatabase/database';
import ScenesSchema from '../RXdatabase/schemas/scenes';
import ProjectsSchema from '../RXdatabase/schemas/projects';
import scenesSeeds from '../data/scn_data.json';

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
        await loadSeeds(dbInstance);
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

  const loadSeeds = async (dbInstance: any) => {
    try {
      scenesSeeds.scenes.forEach(async (scene: any) => {
        const sceneExists = await dbInstance.scenes.findOne({
          selector: {
            id: scene.id,
          },
        }).exec();

        const updatedScene = {
          ...scene,
          updatedAt: new Date().toISOString(),
        };

        if (!sceneExists) {
          await dbInstance.scenes.insert(updatedScene);
        }
      });
      console.log('Seeds loaded successfully');
    } catch (error) {
      console.error('Error loading seeds:', error);
    }
  };

  return (
    <DatabaseContext.Provider value={{ oneWrapDb: oneWrapRXdatabase, offlineScenes }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
