import {
  IonButton, IonButtons, IonDatetime, IonIcon, IonProgressBar, IonTitle, IonToolbar,
} from '@ionic/react';
import { format } from 'date-fns';
import {
  addOutline,
  calendarOutline, chevronBackOutline, chevronForwardOutline,
} from 'ionicons/icons';
import { useState } from 'react';
import { LiaDotCircle } from 'react-icons/lia';
import { useHistory } from 'react-router';
import './MonthViewToolbar.css';
import ToolbarButton from '../../../../Shared/Components/ToolbarButton/ToolbarButton';

interface MonthViewToolbarProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
  setOpenAddShootingModal?: () => void;
  goToCurrentDay?: () => void;
}

const MonthViewToolbar: React.FC<MonthViewToolbarProps> = ({
  currentDate, onPrev, onNext, onDateChange, isLoading = false, setOpenAddShootingModal = () => {}, goToCurrentDay,
}) => {
  const [showDateTime, setShowDateTime] = useState(false);
  const history = useHistory();

  const toggleDateTime = () => {
    setShowDateTime(!showDateTime);
  };

  const handleDateChange = (event: CustomEvent) => {
    const selectedDate = new Date(event.detail.value);
    onDateChange(selectedDate);
    setShowDateTime(false);
  };

  const handleBack = () => history.push('/my/projects');

  return (
    <>
      <IonToolbar color="tertiary" className="month-toolbar">
        <IonButtons slot="start">
          <ToolbarButton click={() => handleBack()}>
            <IonIcon icon={chevronBackOutline} />
          </ToolbarButton>
        </IonButtons>
        <IonTitle>{format(currentDate, 'MMMM yyyy').toUpperCase()}</IonTitle>
        <IonButtons slot="end">
          <ToolbarButton click={setOpenAddShootingModal}>
            <IonIcon icon={addOutline} />
          </ToolbarButton>
          <ToolbarButton click={toggleDateTime} color={showDateTime ? 'primary' : ''}>
            <IonIcon icon={calendarOutline} />
          </ToolbarButton>
          <ToolbarButton click={onPrev}>
            <IonIcon icon={chevronBackOutline} />
          </ToolbarButton>
          <LiaDotCircle className="ow-icons" onClick={goToCurrentDay} />
          <ToolbarButton click={onNext}>
            <IonIcon icon={chevronForwardOutline} />
          </ToolbarButton>
        </IonButtons>
        {
          isLoading
          && (
            <IonProgressBar type="indeterminate" color="primary" className="month-toolbar-progress" />
          )
        }
      </IonToolbar>
      {
        showDateTime && (
          <IonDatetime
            presentation="month-year"
            className="date-picker"
            mode="md"
            itemID="month-date-picker"
            value={currentDate.toISOString()}
            onIonChange={handleDateChange}
            color='tertiary'
          />
        )
      }
    </>
  );
};

export default MonthViewToolbar;
