import React, { useState, useRef, useEffect } from 'react';
import './DropArea.css';

interface DropAreaProps {
  itemId: string | number;
  onDrop: () => void;
  height?: number; // Altura personalizable
}

const DropArea: React.FC<DropAreaProps> = ({ 
  itemId, 
  onDrop, 
  height = 12 // Valor por defecto de 12px
}) => {
  const [showDropArea, setShowDropArea] = useState(false);
  const dropAreaRef = useRef<HTMLTableSectionElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Cancelar cualquier timeout pendiente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setShowDropArea(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Añadir un pequeño retraso para evitar el parpadeo
    timeoutRef.current = setTimeout(() => {
      setShowDropArea(false);
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Limpiar cualquier timeout pendiente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setShowDropArea(false);
    onDrop();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section 
      ref={dropAreaRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`${showDropArea ? 'drop-area' : 'hide-drop-area'}`} 
      id={`drop-area-${itemId}`}
      style={{
        minHeight: `${height}px`,
        height: `${height}px`,
        // Asegurar que el área sea visible y interactiva
        position: 'relative',
        zIndex: 10
      }}
    >
      DROP HERE
    </section>
  );
};

export default DropArea;