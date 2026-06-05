import React, { useState } from 'react';

interface DragAndDropBoxProps {
  children: React.ReactNode;
  scrollInfiniteComponent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  listId: string;
  onDrop: () => void;
}

const DragAndDropBox: React.FC<DragAndDropBoxProps> = ({
  listId, 
  children,
  scrollInfiniteComponent,
  className = '',
  style = {},
  onDrop
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
    // Quitamos el indicador visual cuando se suelta el elemento
    setIsDragOver(false);
    
    // Ejecutamos la función de drop
    onDrop();
  }
  
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
      id={listId}
      onDrop={handleDrop}
    >
      {children}
      {scrollInfiniteComponent}
    </div>
  );
};

export default DragAndDropBox;