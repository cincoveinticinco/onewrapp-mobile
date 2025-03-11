import { SceneDocType } from "../../../../Shared/types/scenes.types";
import SceneCard from "../../../../Shared/Components/cards/SceneCard/SceneCard";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StripboardContext } from "../../context/StripboardContext/StripboardContext";
import DragAndDropBox from "../../../../Shared/Components/organizers/DragAndDropBox/DragAndDropBox";

// Evento para comunicación entre componentes
const DragDropEvents = {
  lastDropInfo: {
    sceneId: null as string | null,
    targetListId: null as string | null,
    sourceListId: null as string | null,
    successful: false
  },
  resetDropInfo: () => {
    DragDropEvents.lastDropInfo = {
      sceneId: null,
      targetListId: null,
      sourceListId: null,
      successful: false
    };
  },
  setDropInfo: (sceneId: string, sourceListId: string, targetListId: string) => {
    DragDropEvents.lastDropInfo = {
      sceneId,
      sourceListId,
      targetListId,
      successful: true
    };
  }
};

interface ScenesListProps {
  scenes: SceneDocType[];
  scenesToDisplay: number;
  setScenes: React.Dispatch<React.SetStateAction<SceneDocType[]>>;
  listId: string;
  children?: React.ReactNode;
  sectionToolbar?: React.ReactNode;
}

// Estructura de datos optimizada para escenas
interface SceneOrderManager {
  idToIndex: Map<string, number>;
  indexToId: Map<number, string>;
  sceneMap: Map<string, SceneDocType>;
  length: number;
}

const ScenesList: React.FC<ScenesListProps> = ({ 
  scenes, 
  scenesToDisplay,
  setScenes,
  listId,
  children,
  sectionToolbar
}) => {
  const { displayOptions } = useContext(StripboardContext);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('')
  
  // Referencias para el estado de arrastre
  const dragSourceRef = useRef<string | null>(null);
  
  // Estado de visualización optimizado
  const [displayData, setDisplayData] = useState<SceneOrderManager>({
    idToIndex: new Map(),
    indexToId: new Map(),
    sceneMap: new Map(),
    length: 0
  });
  
  // Inicializa y sincroniza la estructura de datos optimizada
  useEffect(() => {
    const newIdToIndex = new Map<string, number>();
    const newIndexToId = new Map<number, string>();
    const newSceneMap = new Map<string, SceneDocType>();
    
    scenes.forEach((scene, index) => {
      if (scene.id) {
        newIdToIndex.set(scene.id, index);
        newIndexToId.set(index, scene.id);
        newSceneMap.set(scene.id, scene);
      }
    });
    
    setDisplayData({
      idToIndex: newIdToIndex,
      indexToId: newIndexToId,
      sceneMap: newSceneMap,
      length: scenes.length
    });
  }, [scenes]);
  
  // Obtiene las escenas a mostrar según el límite
  const displayedScenes = useCallback(() => {
    const result: SceneDocType[] = [];
    const limit = Math.min(scenesToDisplay, displayData.length);
    
    for (let i = 0; i < limit; i++) {
      const id = displayData.indexToId.get(i);
      if (id) {
        const scene = displayData.sceneMap.get(id);
        if (scene) {
          result.push(scene);
        }
      }
    }
    
    return result;
  }, [displayData, scenesToDisplay]);
  
  // Manipula las escenas de manera eficiente y propaga los cambios
  const moveScene = useCallback((fromIndex: number, toIndex: number) => {
    // No hacer nada si los índices son iguales o inválidos
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || 
        fromIndex >= displayData.length || toIndex >= displayData.length) {
      return;
    }
    
    // Obtener ids para los índices
    const fromId = displayData.indexToId.get(fromIndex);
    if (!fromId) return;
    
    // Crear nueva estructura de orden
    const newIdToIndex = new Map(displayData.idToIndex);
    const newIndexToId = new Map(displayData.indexToId);
    
    // Determinar dirección del movimiento
    if (fromIndex < toIndex) {
      for (let i = fromIndex + 1; i <= toIndex; i++) {
        const id = newIndexToId.get(i);
        if (id) {
          newIndexToId.set(i - 1, id);
          newIdToIndex.set(id, i - 1);
        }
      }
    } else {
      for (let i = fromIndex - 1; i >= toIndex; i--) {
        const id = newIndexToId.get(i);
        if (id) {
          newIndexToId.set(i + 1, id);
          newIdToIndex.set(id, i + 1);
        }
      }
    }
    
    newIndexToId.set(toIndex, fromId);
    newIdToIndex.set(fromId, toIndex);
    
    setDisplayData(prev => ({
      ...prev,
      idToIndex: newIdToIndex,
      indexToId: newIndexToId
    }));
    
    const newScenes = [];
    for (let i = 0; i < displayData.length; i++) {
      const id = newIndexToId.get(i);
      if (id) {
        const scene = displayData.sceneMap.get(id);
        if (scene) {
          newScenes.push(scene);
        }
      }
    }
    
    setScenes(newScenes);
  }, [displayData, setScenes]);
  
  const addSceneAt = useCallback((scene: SceneDocType, targetIndex: number) => {
    if (!scene.id) return;
    
    if (displayData.idToIndex.has(scene.id)) {
      const currentIndex = displayData.idToIndex.get(scene.id);
      if (currentIndex !== undefined) {
        moveScene(currentIndex, targetIndex);
        return;
      }
    }
    
    const newIdToIndex = new Map(displayData.idToIndex);
    const newIndexToId = new Map(displayData.indexToId);
    const newSceneMap = new Map(displayData.sceneMap);
    
    for (let i = displayData.length - 1; i >= targetIndex; i--) {
      const id = newIndexToId.get(i);
      if (id) {
        newIndexToId.set(i + 1, id);
        newIdToIndex.set(id, i + 1);
      }
    }

    newIndexToId.set(targetIndex, scene.id);
    newIdToIndex.set(scene.id, targetIndex);
    newSceneMap.set(scene.id, scene);
    
    setDisplayData(prev => ({
      idToIndex: newIdToIndex,
      indexToId: newIndexToId,
      sceneMap: newSceneMap,
      length: prev.length + 1
    }));
    
    const newScenes = [];
    for (let i = 0; i <= displayData.length; i++) {
      const id = newIndexToId.get(i);
      if (id) {
        const sceneObj = id === scene.id ? scene : displayData.sceneMap.get(id);
        if (sceneObj) {
          newScenes.push(sceneObj);
        }
      }
    }
    
    setScenes(newScenes);
  }, [displayData, moveScene, setScenes]);
  
  const removeScene = useCallback((sceneId: string) => {
    const index = displayData.idToIndex.get(sceneId);
    if (index === undefined) return;
    

    const newIdToIndex = new Map(displayData.idToIndex);
    const newIndexToId = new Map(displayData.indexToId);
    const newSceneMap = new Map(displayData.sceneMap);

    newIdToIndex.delete(sceneId);
    newIndexToId.delete(index);
    newSceneMap.delete(sceneId);

    for (let i = index + 1; i < displayData.length; i++) {
      const id = displayData.indexToId.get(i);
      if (id) {
        newIndexToId.set(i - 1, id);
        newIdToIndex.set(id, i - 1);
      }
      newIndexToId.delete(i);
    }
    
    setDisplayData(prev => ({
      idToIndex: newIdToIndex,
      indexToId: newIndexToId,
      sceneMap: newSceneMap,
      length: prev.length - 1
    }));
    
    setScenes(prevScenes => prevScenes.filter(scene => scene.id !== sceneId));
  }, [displayData, setScenes]);
  
  const onDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, scene: SceneDocType) => {
    if (!scene.id) return;

    e.stopPropagation();
    
    dragSourceRef.current = scene.id;
    
    const transferData = {
      scene,
      sourceListId: listId,
      sourceIndex: displayData.idToIndex.get(scene.id)
    };
    
    e.dataTransfer.setData('sceneData', JSON.stringify(transferData));
    e.dataTransfer.effectAllowed = 'move';
  }, [displayData, listId]);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dataString = e.dataTransfer.getData('sceneData');
    if (!dataString) return;
    
    const data = JSON.parse(dataString);
    const droppedScene = data.scene;
    const sourceListId = data.sourceListId;
    const sourceIndex = data.sourceIndex;
    
    if (!droppedScene.id) {
      setOverIndex(null);
      return;
    }
    
    if (sourceListId === listId) {
      if (overIndex !== null && sourceIndex !== overIndex) {
        moveScene(sourceIndex, overIndex);
      }
    } else {
      if (overIndex !== null) {
        addSceneAt(droppedScene, overIndex);
        DragDropEvents.setDropInfo(droppedScene.id, sourceListId, listId);
      } else {
        addSceneAt(droppedScene, displayData.length);
        DragDropEvents.setDropInfo(droppedScene.id, sourceListId, listId);
      }
    }
    
    setOverIndex(null);
  }, [addSceneAt, displayData.length, listId, moveScene, overIndex]);
  
  const onDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>, sceneId?: string) => {
    e.preventDefault();
    if (!sceneId) return;
    
    const dropInfo = DragDropEvents.lastDropInfo;
    
    if (dropInfo.successful && 
        dropInfo.sceneId === sceneId && 
        dropInfo.sourceListId === listId && 
        dropInfo.targetListId !== listId) {
      removeScene(sceneId);
    }
    
    dragSourceRef.current = null;
    
    DragDropEvents.resetDropInfo();
    
    setOverIndex(null);
    
    // Restaurar funcionalidad de scroll en los contenedores IonContent
    const ionContents = document.querySelectorAll('ion-content');
    ionContents.forEach(content => {
      // Forzar refresco del scroll
      setTimeout(() => {
        try {
          (content as any).forceUpdate();
        } catch (e) {

        }
      }, 50);
    });
  }, [listId, removeScene]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setOverIndex(prevIndex => prevIndex !== index ? index : prevIndex);
  }, []);
  
  const getHoverStyles = useCallback((index: number) => {
    return overIndex === index ? {
      borderTop: '2px dashed #666',
      backgroundColor: 'var(--ion-color-tertiary-dark)',
      paddingTop: '20px',
      transition: 'all .5s ease',
      transform: 'scale(1.01)'
    } : {};
  }, [overIndex]);

  const scenesToRender = displayedScenes();
  
  return (
    <DragAndDropBox onDrop={onDrop} scrollInfiniteComponent={children} {...{className: `drop-container drop-${listId} border-light`, style: {padding: '10px', height: 'auto', minHeight: '100%', scrollbarWidth: 'none'}}}>
      {sectionToolbar}
      {scenesToRender.map((scene, index) => (
        <div 
          onDragStart={(e) => onDragStart(e, scene)} 
          draggable 
          key={scene.id} 
          onDragEnd={(e) => onDragEnd(e, scene?.id)} 
          onDragOver={(e) => onDragOver(e, index)} 
          style={getHoverStyles(index)}
          className="draggable-scene"
          data-scene-id={scene.id} 
        >
          <SceneCard 
            scene={scene} 
            key={`${scene.id}-${JSON.stringify(displayOptions)}`} 
            displayOptions={displayOptions}
            goToDetail={false}
          />
        </div>
      ))}
    </DragAndDropBox>
  );
};

export default ScenesList;