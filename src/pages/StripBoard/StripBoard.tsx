import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../Shared/Components/ExploreContainer/ExploreContainer';
import { useParams } from 'react-router';
import useStripboards from '../../hooks/useStripboards/useStripboards';
import AppLoader from '../../Shared/Components/AppLoader/AppLoader';
import { useEffect } from 'react';
import GeneralTable, { Column } from '../../Shared/Components/GeneralTable/GeneralTable';
import React, { useState, useRef } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Definición de tipos para el estado del layout
type LayoutState = {
  direction: 'row' | 'column';
  firstSectionSize: number;
  secondSectionSize: number;
};

const SplitLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const [layout, setLayout] = useState<LayoutState>({
    direction: 'row',
    firstSectionSize: 50,
    secondSectionSize: 50
  });

  // Ajustar tamaño al redimensionar la ventana
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    // Llamar inmediatamente para establecer el tamaño inicial
    updateContainerSize();

    // Añadir event listener para redimensionamiento
    window.addEventListener('resize', updateContainerSize);

    // Limpiar el event listener
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  const handleResize: ResizableBoxProps['onResize'] = (
    event, 
    { size }
  ) => {
    // Calcular porcentajes basados en el ancho total del contenedor
    const newFirstSectionSize = (size.width / containerWidth) * 100;
    
    setLayout(prev => ({
      ...prev, 
      firstSectionSize: newFirstSectionSize,
      secondSectionSize: 100 - newFirstSectionSize
    }));
  };

  return (
    <div 
      ref={containerRef}
      style={{
        display: 'flex', 
        flexDirection: layout.direction,
        height: '100vh',
        width: '100%'
      }}
    >
      <ResizableBox
        width={containerWidth * (layout.firstSectionSize / 100)}
        height={containerHeight}
        minConstraints={[100, 100]}
        maxConstraints={[containerWidth * 0.8, containerHeight]}
        onResize={handleResize}
      >
        <div style={{
          background: 'lightblue', 
          height: '100%', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Sección 1 ({layout.firstSectionSize.toFixed(2)}%)
        </div>
      </ResizableBox>
      <ResizableBox
        width={containerWidth * (layout.secondSectionSize / 100)}
        height={containerHeight}
        minConstraints={[100, 100]}
        maxConstraints={[containerWidth * 0.8, containerHeight]}
      >
        <div style={{
          background: 'lightgreen', 
          height: '100%', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Sección 2 ({layout.secondSectionSize.toFixed(2)}%)
        </div>
      </ResizableBox>
    </div>
  );
};


const StripBoard: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();

  const { stripboards, isFetching } = useStripboards({ projectId: projectId });

  const TableColumns: Column[] = [
    {
      key: 'name',
      title: 'Name',
      sticky: true,
      type: 'text',
      textAlign: 'left',
    },
    {
      key: 'statusString',
      title: 'Status',
      type: 'text',
      textAlign: 'center'
    },
    {
      key: 'startDate',
      title: 'Date',
      type: 'text',
      textAlign: 'center'
    },
    {
      key: 'totalScenes',
      title: 'Scenes',
      type: 'number',
      textAlign: 'center'
    },
    {
      key: 'totalWeeks',
      title: 'Weeks',
      type: 'number',
      textAlign: 'center'
    },
    {
      key: 'totalDays',
      title: 'Days',
      type: 'number',
      textAlign: 'center'
    },
    {
      key: 'totalShootingDays',
      title: 'Shooting Days',
      type: 'number',
      textAlign: 'center'
    },
  ]

  useEffect(() => {
    console.log(stripboards);
  }, [stripboards]);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>STRIPBOARD</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        { isFetching ? (
          <AppLoader />
        ) : (
          // <GeneralTable
          //   data={stripboards.sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))}
          //   columns={TableColumns}
          // />
          <SplitLayout />
        )}
      </IonContent>
    </IonPage>
  )
};

export default StripBoard;
