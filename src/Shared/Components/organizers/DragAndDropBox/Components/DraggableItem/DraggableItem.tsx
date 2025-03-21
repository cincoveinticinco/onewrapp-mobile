import React, { useState } from 'react';

interface DraggableItemProps {
  itemId: string;
  listId: string;
  index: number;
  children: React.ReactNode;
  onItemMove?: (itemId: string, sourceListId: string, targetListId: string, targetIndex: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  itemId,
  listId,
  index,
  children,
  onItemMove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Guardar datos relevantes para el drop
    const data = {
      itemId,
      sourceListId: listId,
      sourceIndex: index
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    
    setIsDragging(true);
    
    // Para una mejor experiencia de usuario
    setTimeout(() => {
      (e.target as HTMLElement).classList.add('dragging');
    }, 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    document.querySelectorAll('.dragging').forEach(el => 
      el.classList.remove('dragging')
    );
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Obtener los datos del elemento que se está arrastrando
    const dataString = e.dataTransfer.getData('application/json');
    if (!dataString) return;
    
    try {
      const { itemId: draggedItemId, sourceListId, sourceIndex } = JSON.parse(dataString);
      
      // Si es el mismo elemento o no hay función de manejo, salimos
      if (draggedItemId === itemId || !onItemMove) return;
      
      // Si el cursor está en la mitad superior del elemento, insertamos antes
      // Si está en la mitad inferior, insertamos después
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const isTop = y < rect.height / 2;
      
      // Calcular el nuevo índice de destino
      const targetIndex = isTop ? index : index + 1;
      
      // La clase visual para mostrar dónde se insertará el elemento
      e.currentTarget.classList.add(isTop ? 'drag-over-top' : 'drag-over-bottom');
      
      // Crear un controlador de drop específico para este elemento
      e.currentTarget.ondrop = (dropEvent) => {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        
        // Actualizar el estado a través de la función proporcionada
        onItemMove(draggedItemId, sourceListId, listId, targetIndex);
        
        // Limpiar las clases y el manejador
        e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
        e.currentTarget.ondrop = null;
      };
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
  };
  
  // Estilos condicionales basados en estado
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    position: 'relative',
    transition: 'opacity 0.2s ease'
  };
  
  return (
    <div
      draggable
      className={`draggable-item ${isDragging ? 'dragging' : ''}`}
      style={style}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      data-item-id={itemId}
      data-list-id={listId}
      data-index={index}
    >
      {children}
    </div>
  );
};

export default DraggableItem;