import {
  IonButton, IonButtons, IonDatetime, IonIcon, IonTitle, IonToolbar,
} from '@ionic/react';
import { format } from 'date-fns';
import { calendarClear, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import './MonthViewToolbar.css';
import { useState } from 'react';

interface MonthViewToolbarProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onDateChange: (date: Date) => void;
}

const MonthViewToolbar: React.FC<MonthViewToolbarProps> = ({
  currentDate, onPrev, onNext, onDateChange,
}) => {
  const [showDateTime, setShowDateTime] = useState(false);

  const toggleDateTime = () => {
    setShowDateTime(!showDateTime);
  };

  const handleDateChange = (event: CustomEvent) => {
    const selectedDate = new Date(event.detail.value);
    onDateChange(selectedDate);
    setShowDateTime(false);
  };

  return (
    <>
      <IonToolbar color="tertiary" className="month-toolbar">
        <IonButtons slot="start">
          <IonButton onClick={onPrev}>
            <IonIcon slot="icon-only" icon={chevronBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>{format(currentDate, 'MMMM yyyy')}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={toggleDateTime} color={showDateTime ? 'primary' : ''}>
            <IonIcon slot="icon-only" icon={calendarClear} />
          </IonButton>
          <IonButton onClick={onNext}>
            <IonIcon slot="icon-only" icon={chevronForwardOutline} />
          </IonButton>
        </IonButtons>
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
