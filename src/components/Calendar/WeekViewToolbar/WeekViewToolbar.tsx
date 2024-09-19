import {
  IonButton,
  IonButtons,
  IonDatetime,
  IonIcon,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { chevronBackOutline, chevronForwardOutline, calendarOutline } from 'ionicons/icons';
import { useState } from 'react';
import { LiaDotCircle } from 'react-icons/lia';
import { useHistory } from 'react-router-dom';

// Definir los tipos de las propiedades que se van a recibir en el componente
interface WeekViewToolbarProps {
  currentDate: Date; // Fecha actual que se está mostrando en la vista
  onPrev: () => void; // Función para navegar a la semana anterior
  onNext: () => void; // Función para navegar a la semana siguiente
  onDateChange: (date: Date) => void; // Función para manejar el cambio de fecha
  isLoading?: boolean; // Indicador de carga
  setOpenAddShootingModal?: () => void; // Función opcional para abrir un modal
  goToCurrentDay?: () => void; // Función opcional para ir al día actual
}

const WeekViewToolbar: React.FC<WeekViewToolbarProps> = ({
  currentDate,
  onPrev,
  onNext,
  onDateChange,
  isLoading = false,
  setOpenAddShootingModal,
  goToCurrentDay,
}) => {
  const [showDateTime, setShowDateTime] = useState<boolean>(false); // Control de la visualización del selector de fecha
  const history = useHistory(); // Hook para controlar la navegación

  const toggleDateTime = (): void => {
    setShowDateTime(!showDateTime); // Alternar el estado de mostrar el selector de fecha
  };

  const handleDateChange = (event: CustomEvent): void => {
    const selectedDate = new Date(event.detail.value);
    onDateChange(selectedDate); // Llamar a la función de cambio de fecha con la nueva fecha seleccionada
    setShowDateTime(false); // Ocultar el selector de fecha una vez seleccionada
  };

  const handleBack = (): void => {
    history.push('/my/projects'); // Navegar hacia la página de proyectos
  };

  return (
    <>
      <IonToolbar color='tertiary'>
        <IonButtons slot="start">
          <IonButton onClick={onPrev}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          {goToCurrentDay && ( // Solo mostrar el botón de ir al día actual si la prop está presente
            <IonButton onClick={goToCurrentDay}>
              <LiaDotCircle size="1.2em" />
            </IonButton>
          )}
        </IonButtons>

        <IonTitle className="ion-text-center">
          {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} {' - '}
          {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
        </IonTitle>

        <IonButtons slot="end">
          <IonButton onClick={onNext}>
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
          <IonButton onClick={toggleDateTime}>
            <IonIcon icon={calendarOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      {isLoading && <IonProgressBar type="indeterminate" />} {/* Mostrar barra de progreso si está cargando */}

      {showDateTime && ( // Mostrar IonDatetime cuando el estado showDateTime es verdadero
        <IonDatetime
          presentation="date"
          value={currentDate.toISOString()}
          onIonChange={handleDateChange}
        />
      )}
    </>
  );
};

export default WeekViewToolbar;
