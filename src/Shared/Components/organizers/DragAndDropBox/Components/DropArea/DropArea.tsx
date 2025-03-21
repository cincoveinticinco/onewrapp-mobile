
import React from 'react';
import './DropArea.css';

interface DropAreaProps {
  itemId: string | number;
  onDrop: () => void;
}

const DropArea: React.FC<DropAreaProps> = ({ itemId, onDrop }) => {
  const [showDropArea, setShowDropArea] = React.useState(false);

  return (
    <section onDragEnter={() => setShowDropArea(true)} onDragLeave={() => setShowDropArea(false)} className={`${showDropArea ? 'drop-area' : 'hide-drop-area'}`} id={`drop-area-${itemId}`} onAbort={onDrop} onDrop={onDrop}>
      DROP HERE
    </section>
  )
}

export default DropArea;