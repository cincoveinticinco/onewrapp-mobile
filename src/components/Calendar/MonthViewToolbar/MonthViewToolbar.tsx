import {
  IonButton, IonButtons, IonDatetime, IonIcon, IonProgressBar, IonTitle, IonToolbar,
} from '@ionic/react';
import { format } from 'date-fns';
import {
  addOutline, calendarClear, calendarOutline, chevronBackOutline, chevronForwardOutline,
} from 'ionicons/icons';
import './MonthViewToolbar.css';
import { useState } from 'react';
import { LiaDotCircle } from 'react-icons/lia';
import { useHistory } from 'react-router';
import { add } from 'lodash';
import AddButton from '../../Shared/AddButton/AddButton';

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
  currentDate, onPrev, onNext, onDateChange, isLoading = false, setOpenAddShootingModal, goToCurrentDay,
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
          <IonButton onClick={() => handleBack()}>
            <IonIcon icon={chevronBackOutline} style={{ fontSize: '30px' }} />
          </IonButton>
        </IonButtons>
        <IonTitle>{format(currentDate, 'MMMM yyyy').toUpperCase()}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={setOpenAddShootingModal}>
            <IonIcon icon={addOutline} style={{ fontSize: '30px' }} />
          </IonButton>
          <IonButton onClick={toggleDateTime} color={showDateTime ? 'primary' : ''}>
            <IonIcon icon={calendarOutline} style={{ fontSize: '30px' }} />
          </IonButton>
          <IonButton onClick={onPrev}>
            <IonIcon icon={chevronBackOutline} style={{ fontSize: '30px' }} />
          </IonButton>
          <LiaDotCircle className="ow-icons" onClick={goToCurrentDay} />
          <IonButton onClick={onNext}>
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: '30px' }} />
          </IonButton>
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
          />
        )
      }
    </>
  );
};

export default MonthViewToolbar;
