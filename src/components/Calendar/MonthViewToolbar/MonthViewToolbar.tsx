import { IonButton, IonButtons, IonDatetime, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { format } from "date-fns";
import { calendarClear, chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import './MonthViewToolbar.css';
import { useState } from "react";

const monthViewToolbar = (currentDate: Date, onPrev: () => void, onNext: () => void) => {
  const [toolbarProps, setToolbarProps] = useState({
    showDateTime: false,
    currentDate: currentDate,
  });

  const toggleDateTime = () => {
    setToolbarProps({
      ...toolbarProps,
      showDateTime: !toolbarProps.showDateTime,
    });
  }

  return(
    <>
      <IonToolbar color="tertiary" className="month-toolbar">
        <IonButtons slot="start">
          <IonButton onClick={onPrev}>
            <IonIcon slot="icon-only" icon={chevronBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>{format(currentDate, 'MMMM yyyy')}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={toggleDateTime} color={toolbarProps.showDateTime ? 'primary' : ''}>
            <IonIcon slot="icon-only" icon={calendarClear} />
          </IonButton>
          <IonButton onClick={onNext}>
            <IonIcon slot="icon-only" icon={chevronForwardOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      {
        toolbarProps.showDateTime && (
          <IonDatetime presentation="month-year" className="date-picker" mode="md" value={currentDate.toISOString()}></IonDatetime>
        )
      }
    </>
)};

export default monthViewToolbar;