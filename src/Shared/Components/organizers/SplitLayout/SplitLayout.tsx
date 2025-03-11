import React, { useState, ReactNode, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

interface SplitLayoutProps {
  children: ReactNode[];
}

const SplitLayout: React.FC<SplitLayoutProps> = ({ children}) => {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [panelContents, setPanelContents] = useState<ReactNode[]>(
    React.Children.toArray(children)
  );

  useEffect(() => {
    setPanelContents(React.Children.toArray(children));
  }, [children]);
  
  const [allowDrag, setAllowDrag] = useState(true);
  const [showDropZone, setShowDropZone] = useState(false);

  const handleMouseDown = (ev: React.MouseEvent) => {
    setAllowDrag(ev.altKey);
  };

  const handleTouchStart = (ev: React.TouchEvent) => {
    setAllowDrag(ev.touches.length === 2);
  };

  const handleMouseUp = () => {
    setShowDropZone(false);
  }

  const handleTouchEnd = () => {
    setShowDropZone(false);
  }

  const handleDrop = (ev: React.DragEvent, dropType: 'content' | 'direction', targetIndex?: number) => {
    ev.preventDefault();
    
    setShowDropZone(false);

    if (dropType === 'direction') {
      setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal');
      return;
    }

    if (targetIndex !== undefined) {
      const draggedIndex = ev.dataTransfer?.getData('text/plain');
      
      if (draggedIndex !== undefined) {
        const newPanelContents = [...panelContents];
        const temp = newPanelContents[Number(draggedIndex)];
        newPanelContents[Number(draggedIndex)] = newPanelContents[targetIndex];
        newPanelContents[targetIndex] = temp;
        
        setPanelContents(newPanelContents);
      }
    }
  };

  const handleDragStart = (ev: React.DragEvent, index: number) => {
    ev.dataTransfer?.setData('text/plain', index.toString());
  };

  const dragOver = (ev: React.DragEvent) => {
    ev.preventDefault();
    setShowDropZone(true);
  };

  const DirectionDropComponent = ({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) => {
    const positionStyles = {
      top: { top: 0, left: 0, right: 0, height: '50px' },
      bottom: { bottom: 0, left: 0, right: 0, height: '50px' },
      left: { left: 0, top: 0, bottom: 0, width: '50px' },
      right: { right: 0, top: 0, bottom: 0, width: '50px' }
    };

    return (
      <div
        draggable={false}
        style={{
          position: 'absolute',
          ...positionStyles[position],
          backgroundColor: showDropZone ? 'var(--drop-zone-color-secondary)' : 'transparent',
          zIndex: 10
        }}
        onDrop={(e) => handleDrop(e, 'direction')}
        onDragOver={dragOver}
      />
    );
  };

  const ContentDropComponent = ({ index }: { index: number }) => (
    <div
      style={{
        position: 'absolute',
        ...(direction === 'horizontal' 
          ? (index === 0 
            ? { left: 0, width: '50px', top: 0, bottom: 0 } 
            : { right: 0, width: '50px', top: 0, bottom: 0 })
          : (index === 0 
            ? { top: 0, height: '50px', left: 0, right: 0 } 
            : { bottom: 0, height: '50px', left: 0, right: 0 })),
            backgroundColor: showDropZone ? 'var(--drop-zone-color-primary)' : 'transparent',
        zIndex: 10
      }}
      onDrop={(e) => handleDrop(e, 'content', index)}
      onDragOver={dragOver}
    />
  );

  return (
    <PanelGroup direction={direction} style={{ backgroundColor: 'var(--background-color-secondary) !important'}}>
      {panelContents.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && 
          
            <PanelResizeHandle>
              <div
                style={{
                  backgroundColor: 'var(--ion-color-dark)',
                  cursor: direction === 'horizontal' ? 'ew-resize' : 'ns-resize',
                  height: '100%',
                  zIndex: 10,
                  position: 'relative',
                  ...(direction === 'horizontal' ? { width: '10px', top: 0, bottom: 0 } : { height: '10px', top: '-5px', left: 0, right: 0})
                }}
              >
                <div
                  style={direction === 'horizontal' ? {
                    width: '50%',
                    height: '30px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--ion-color-light)',
                    borderRadius: '5px',
                  } : {
                    height: '50%',
                    width: '30px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--ion-color-light)',
                    borderRadius: '5px',
                  }}
                >
                </div>
              </div>
            </PanelResizeHandle>}
            <Panel 
              defaultSize={50}
              minSize={20} 
              style={{ scrollbarWidth: 'none', backgroundColor: 'var(--background-color-secondary) !important'}}
              draggable={allowDrag}
              onDragStart={(e) => handleDragStart(e, index)}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleTouchEnd}
              id={index.toString()}
            >
            {child}
            
            {direction === 'vertical' && (
              <>
              <DirectionDropComponent position="left" />
              <DirectionDropComponent position="right" />
              </>
            )}
            
            {direction === 'horizontal' 
              ? (index === 0 
              ? <ContentDropComponent index={0} /> 
              : <ContentDropComponent index={1} />)
              : (index === 0 
              ? <ContentDropComponent index={0} /> 
              : <ContentDropComponent index={1} />)}
            </Panel>
        </React.Fragment>
      ))}
    </PanelGroup>
  );
};

export default SplitLayout;