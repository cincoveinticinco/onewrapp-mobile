import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { SceneDocType } from '../../../Shared/types/scenes.types';

export const useSceneDetailNavigation = (
  scenes: SceneDocType[],
  currentSceneId: string,
  isShooting: boolean,
  projectId: string,
  shootingId?: string
) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
  const [previousScene, setPreviousScene] = useState<SceneDocType | null>(null);
  const [nextScene, setNextScene] = useState<SceneDocType | null>(null);
  const history = useHistory();

  const rootRoute = isShooting 
    ? `/my/projects/${projectId}/shooting/${shootingId}/details/scene` 
    : `/my/projects/${projectId}/strips/details/scene`;

  useEffect(() => {
    // Encontrar el índice de la escena actual
    const index = scenes.findIndex(
      (scene) => scene.sceneId === parseInt(currentSceneId)
    );
    setCurrentSceneIndex(index);
  }, [scenes, currentSceneId]);

  useEffect(() => {
    // Configurar escenas anterior y siguiente
    if (currentSceneIndex >= 0) {
      setPreviousScene(scenes[currentSceneIndex - 1] || null);
      setNextScene(scenes[currentSceneIndex + 1] || null);
    }
  }, [currentSceneIndex, scenes]);

  const changeToNextScene = () => {
    if (nextScene) {
      const route = `${rootRoute}/${nextScene.sceneId}${isShooting ? '?isShooting=true' : ''}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
  };

  const changeToPreviousScene = () => {
    if (previousScene) {
      const route = `${rootRoute}/${previousScene.sceneId}${isShooting ? '?isShooting=true' : ''}`;
      history.push(route);
      localStorage.setItem('editionBackRoute', route);
    }
  };

  return {
    previousScene,
    nextScene,
    changeToNextScene,
    changeToPreviousScene
  };
};

export default useSceneDetailNavigation;