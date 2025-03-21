import React, { useState } from 'react';
import './DraggableItem.css';
import DropArea from '../DropArea/DropArea';
interface DraggableItemProps {
  itemId: string | number;
  elementPosition: number;
  children: React.ReactNode;
  onDrop: (itemId: string | number, elementPosition: number) => void;
  setActiveElement: (elementId: number | string | null) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  itemId,
  setActiveElement,
  elementPosition,
  children,
  onDrop
}) => {

  return (
    <React.Fragment>
      <div
        draggable
        onDragStart={() => setActiveElement(itemId)}
        onDragEnd={() => setActiveElement(null)}
        data-item-id={itemId}
        className='draggable-item'
        id={`draggable-item-${itemId}`}
      >
        {children}
      </div>
      <DropArea itemId={itemId} onDrop={() => onDrop(itemId, elementPosition)}/>
    </React.Fragment>
  );
};

export default DraggableItem;