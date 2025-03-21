import React, { useCallback, useContext, useMemo, useState } from 'react';
import DragAndDropBox from '../../../../Shared/Components/organizers/DragAndDropBox/DragAndDropBox';
import SceneCard from '../../../../Shared/Components/cards/SceneCard/SceneCard';
import { SceneDocType } from '../../../../Shared/types/scenes.types';
import { SearchToolbarButtonProps } from '../../../../Shared/Components/buttons/SearchToolbarButton/SearchToolbarButton';
import { StripboardContext } from '../../context/StripboardContext/StripboardContext';
import DraggableItem from '../../../../Shared/Components/organizers/DragAndDropBox/Components/DraggableItem/DraggableItem';

interface ScenesListProps {
  scenes: SceneDocType[];
  scenesToDisplay: number;
  setScenes: (scenes: SceneDocType[]) => void;
  listId: string;
  children?: React.ReactNode;
  sectionToolbar?: (search?: SearchToolbarButtonProps) => React.ReactNode;
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
  const [searchText, setSearchText] = useState<string>('');
  const [searchMode, setSearchMode] = useState<boolean>(false);
  
  // Función que maneja el movimiento de escenas entre listas
  const handleSceneMove = useCallback((
    sceneId: string, 
    sourceListId: string, 
    targetListId: string, 
    targetIndex: number
  ) => {
    // Si la operación es dentro de la misma lista
    if (sourceListId === targetListId && sourceListId === listId) {
      const sourceIndex = scenes.findIndex(scene => scene.id === sceneId);
      if (sourceIndex === -1) return;
      
      // Crear una copia del array de escenas
      const newScenes = [...scenes];
      
      // Mover la escena dentro del array
      const [movedScene] = newScenes.splice(sourceIndex, 1);
      
      // Si targetIndex es -1, añadimos al final
      if (targetIndex === -1) {
        newScenes.push(movedScene);
      } else {
        // Ajustar el índice si es necesario
        const adjustedIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newScenes.splice(adjustedIndex, 0, movedScene);
      }
      
      // Actualizar el estado
      setScenes(newScenes);
    }
    
    // Es una operación entre listas - sólo manejamos si somos la fuente o destino
    else if (sourceListId === listId || targetListId === listId) {
      // Si somos la lista fuente, debemos eliminar la escena
      if (sourceListId === listId) {
        const sourceIndex = scenes.findIndex(scene => scene.id === sceneId);
        if (sourceIndex === -1) return;
        
        const newScenes = [...scenes];
        newScenes.splice(sourceIndex, 1);
        setScenes(newScenes);
      }
      
      // Nota: El manejo cuando somos la lista destino debe ocurrir en el componente padre
      // que coordina el estado global, ya que necesitamos acceso a la escena que se mueve
    }
  }, [scenes, setScenes, listId]);
  
  // Filtrar escenas según la búsqueda
  const filteredScenes = useMemo(() => {
    if (!searchText) return scenes.slice(0, scenesToDisplay);
    
    return scenes
      .slice(0, scenesToDisplay);
  }, [scenes, scenesToDisplay, searchText]);
  
  return (
    <DragAndDropBox
      onItemMove={handleSceneMove}
      listId={listId}
      className={`scenes-list scenes-list-${listId}`}
      style={{ padding: '6px', height: 'auto', minHeight: '100%', scrollbarWidth: 'none' }}
      scrollInfiniteComponent={children}
    >
      {sectionToolbar && sectionToolbar({
        search: true,
        searchMode,
        toggleSearchMode: () => setSearchMode(prev => !prev),
        searchText,
        handleSearchInput: (e: CustomEvent) => setSearchText(e.detail.value!)
      })}
      
      {filteredScenes.map((scene, index) => (
        <DraggableItem
          key={scene.id}
          itemId={scene.id || ''}
          listId={listId}
          index={index}
          onItemMove={handleSceneMove}
        >
          <SceneCard
            scene={scene}
            displayOptions={displayOptions}
            goToDetail={false}
          />
        </DraggableItem>
      ))}
    </DragAndDropBox>
  );
};

export default ScenesList;