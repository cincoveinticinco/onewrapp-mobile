import {
  IonButton, IonButtons, IonDatetime, IonIcon, IonProgressBar, IonTitle, IonToolbar,
} from '@ionic/react';
import { format } from 'date-fns';
import { calendarClear, calendarOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import './MonthViewToolbar.css';
import { useState } from 'react';
import { LiaDotCircle } from "react-icons/lia";
import { useHistory } from 'react-router';
import AddButton from '../../Shared/AddButton/AddButton';

interface MonthViewToolbarProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
  setOpenAddShootingModal?: () => void; 
}

const MonthViewToolbar: React.FC<MonthViewToolbarProps> = ({
  currentDate, onPrev, onNext, onDateChange, isLoading = false, setOpenAddShootingModal
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
            <IonIcon slot="icon-only" icon={chevronBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>{format(currentDate, 'MMMM yyyy').toUpperCase()}</IonTitle>
        <IonButtons slot="end">
          <AddButton onClick={setOpenAddShootingModal} />
          <IonButton onClick={toggleDateTime} color={showDateTime ? 'primary' : ''} >
            <IonIcon slot="icon-only" icon={calendarOutline} style={{
              fontSize: '30px',
              padding: '0', 
              fontWeight: 'bold'
            }}/>
          </IonButton>
          <IonButton onClick={onPrev}>
            <IonIcon slot="icon-only" icon={chevronBackOutline} style={{
              fontSize: '30px',
              fontWeight: 'bold',
            }}/>
          </IonButton>
          <LiaDotCircle style={{
            fontSize: '24px',
            fontWeight: 'bold',
          }}/>
          <IonButton onClick={onNext}>
            <IonIcon slot="icon-only" icon={chevronForwardOutline} />
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
