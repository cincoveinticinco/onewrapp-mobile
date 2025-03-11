// DragAndDropBox.tsx
import React, { useEffect, useState } from "react";

interface DragAndDropBoxProps {
  children: React.ReactNode;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  props?: any;
  scrollInfiniteComponent?: React.ReactNode
}

const DragAndDropBox: React.FC<DragAndDropBoxProps> = ({ children, onDrop,  scrollInfiniteComponent, ...props }) => {
  const [dragableItems, setDragableItems] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    setDragableItems(React.Children.toArray(children));
  }, [children]);
  
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }
  
  return (
    <div 
      onDrop={onDrop} 
      onDragOver={onDragOver} 
      style={{ 
        padding: "10px", 
        maxHeight: '100%',
        minHeight: '200px',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        position: 'relative' 
      }}
      {...props}
    >
      {dragableItems.map((item, index) => (
        <React.Fragment key={index}>
          {item}
        </React.Fragment>
      ))}
      {scrollInfiniteComponent}
    </div>
  );
};

export default DragAndDropBox;