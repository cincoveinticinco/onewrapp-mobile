import { useState, useCallback } from 'react';
import { RxDocument, RxCollection } from 'rxdb';// Asumiendo que tienes un hook para acceder a la DB
import { ShootingDocType, ShootingScene } from '../../Shared/types/shooting.types';
import { SceneDocType } from '../../Shared/types/scenes.types';
import { useRxDB } from 'rxdb-hooks';
import useSuccessToast from '../../Shared/hooks/useSuccessToast';
import useErrorToast from '../../Shared/hooks/useErrorToast';

interface UseShootingReturn {
  loading: boolean;
  error: Error | null;
  deleteShootingById: (id: string) => Promise<void>;
  getShootingBySceneId: (sceneId: string) => Promise<RxDocument | null>;
  updateShootingScene: (shootingId: string, sceneId: string, sceneData: Partial<SceneDocType>) => Promise<void>;
  createShooting: (shootingData: ShootingDocType) => Promise<RxDocument>;
  getShootingById: (id: string) => Promise<RxDocument | null>;
  shootingDeleteScene: (sceneId: number, shootingId: string) => Promise<void>;
}

export const useShooting = (): UseShootingReturn => {
  const oneWrappDB: any = useRxDB();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const handleError = useCallback((error: Error) => {
    setError(error);
    setLoading(false);
    console.error('Shooting operation failed:', error);
  }, []);

  const deleteShootingById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const shooting = await oneWrappDB?.shootings.findOne({
        selector: { id }
      }).exec();

      if (!shooting) {
        throw new Error('Shooting not found');
      }

      await shooting.remove();
      setLoading(false);
    } catch (err) {
      handleError(err as Error);
    }
  }, [oneWrappDB, handleError]);

  const getShootingBySceneId = useCallback(async (sceneId: string) => {
    try {
      setLoading(true);
      setError(null);

      const shooting = await oneWrappDB?.shootings.findOne({
        selector: {
          scenes: {
            $elemMatch: {
              sceneId: sceneId.toString()
            }
          }
        }
      }).exec();

      setLoading(false);
      return shooting || null;
    } catch (err) {
      handleError(err as Error);
      return null;
    }
  }, [oneWrappDB, handleError]);

  const updateShootingScene = useCallback(async (
    shootingId: string, 
    sceneId: string, 
    sceneData: Partial<SceneDocType>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const shooting = await oneWrappDB?.shootings.findOne({
        selector: { id: shootingId }
      }).exec();

      if (!shooting) {
        throw new Error('Shooting not found');
      }

      const updatedScenes = shooting.scenes.map((scene: ShootingScene) => 
        scene.sceneId === sceneId 
          ? { ...scene, ...sceneData }
          : scene
      );

      await shooting.patch({ scenes: updatedScenes });
      setLoading(false);
    } catch (err) {
      handleError(err as Error);
    }
  }, [oneWrappDB, handleError]);

  const createShooting = useCallback(async (shootingData: ShootingDocType) => {
    try {
      setLoading(true);
      setError(null);

      const newShooting = await oneWrappDB?.shootings.insert(shootingData);
      
      if (!newShooting) {
        throw new Error('Failed to create shooting');
      }

      setLoading(false);
      return newShooting;
    } catch (err) {
      handleError(err as Error);
      throw err;
    }
  }, [oneWrappDB, handleError]);

  const getShootingById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const shooting = await oneWrappDB?.shootings.findOne({
        selector: { id }
      }).exec();

      setLoading(false);
      return shooting || null;
    } catch (err) {
      handleError(err as Error);
      return null;
    }
  }, [oneWrappDB, handleError]);

  const shootingDeleteScene = async (sceneId: number, shootingId: string) => {
    try {
      console.log(shootingId)
      const shooting = await oneWrappDB?.shootings.findOne({ selector: { id: shootingId } }).exec();
      console.log(shooting)
      if (!shooting) throw new Error('Shooting not found');
  
      const shootingCopy = { 
        ...shooting._data,
        scenes: [...(shooting._data.scenes || [])].filter(
          (s: any) => s.sceneId !== sceneId
        )
      };
  
      await oneWrappDB?.shootings.upsert(shootingCopy);
      successToast('SceneDocType deleted successfully');
    } catch (error) {
      errorToast('Error deleting scene');
      throw error;
    }
  };

  return {
    loading,
    error,
    deleteShootingById,
    getShootingBySceneId,
    updateShootingScene,
    createShooting,
    getShootingById,
    shootingDeleteScene
  };
};