import React, { useState } from 'react';

interface DragAndDropBoxProps {
  onItemMove?: (itemId: string, sourceListId: string, targetListId: string, targetIndex: number) => void;
  listId: string;
  children: React.ReactNode;
  scrollInfiniteComponent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DragAndDropBox: React.FC<DragAndDropBoxProps> = ({ 
  onItemMove, 
  listId, 
  children,
  scrollInfiniteComponent,
  className = '',
  style = {},
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Cambiamos el estado para mostrar indicador visual de arrastre
    if (!isDragOver) {
      setIsDragOver(true);
    }
    
    // Establecer el efecto de arrastre
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Quitamos el indicador visual cuando sale el arrastre
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    
    // Extraer los datos del arrastre
    const dataString = e.dataTransfer.getData('application/json');
    if (!dataString) return;
    
    try {
      const { itemId, sourceListId, sourceIndex } = JSON.parse(dataString);
      
      // Si no hay función de manejo, no hacemos nada
      if (!onItemMove) return;
      
      // Calcular el índice de destino - para un contenedor entero sería al final
      // En una implementación real, podrías calcular la posición relativa para insertar
      const targetIndex = -1; // -1 significa "al final"
      
      // Llamar a la función que actualiza el estado
      onItemMove(itemId, sourceListId, listId, targetIndex);
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  
  // Estilo condicional basado en el estado
  const dragOverStyle = isDragOver ? {
    backgroundColor: 'var(--ion-color-tertiary-tint)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease'
  } : {};
  
  return (
    <div 
      className={`drag-drop-container ${className} ${isDragOver ? 'drag-over' : ''}`}
      style={{ ...style, ...dragOverStyle }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {scrollInfiniteComponent}
    </div>
  );
};

export default DragAndDropBox;