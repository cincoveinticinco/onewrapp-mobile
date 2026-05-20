import { useContext, useEffect, useMemo, useState } from 'react';
import DatabaseContext from '../../../context/Database/Database.context';

const normalizeScene = (scene: any) => scene?._data || scene;

export const useProjectScenes = () => {
  const { oneWrapDb, projectId } = useContext(DatabaseContext);
  const [projectScenes, setProjectScenes] = useState<any[]>([]);

  useEffect(() => {
    if (!oneWrapDb || !projectId) {
      setProjectScenes([]);
      return undefined;
    }

    const subscription = oneWrapDb.scenes
      .find({
        selector: { projectId },
        sort: [{ updatedAt: 'desc' }],
      })
      .$.subscribe((scenes: any[]) => {
        setProjectScenes(scenes.map(normalizeScene).filter(Boolean));
      });

    return () => subscription.unsubscribe();
  }, [oneWrapDb, projectId]);

  return useMemo(() => projectScenes, [projectScenes]);
};
