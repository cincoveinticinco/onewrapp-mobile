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
      const scenesToInsert = scenesSeeds.scenes.map((scene: any) => ({
        ...scene,
        updatedAt: new Date().toISOString(),
      }));
  
      // Check for existing scenes
      const existingScenes = await dbInstance.scenes.find({
        selector: {
          id: { $in: scenesToInsert.map((scene: any) => scene.id) },
        },
      }).exec();
  
      const existingSceneIds = existingScenes.map((scene: any) => scene.id);
  
      // Filter out scenes that already exist
      const scenesToBulkInsert = scenesToInsert.filter((scene: any) => !existingSceneIds.includes(scene.id));
  
      if (scenesToBulkInsert.length > 0) {
        await dbInstance.scenes.bulkInsert(scenesToBulkInsert);
        console.log(`${scenesToBulkInsert.length} new scenes inserted successfully`);
      } else {
        console.log('No new scenes to insert');
      }
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
