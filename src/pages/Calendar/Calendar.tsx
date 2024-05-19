import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonDatetime,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth } from 'date-fns';
import './Calendar.css';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonButton onClick={prevMonth}>
              <IonIcon slot="icon-only" icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {format(currentDate, 'MMMM yyyy')}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={nextMonth}>
              <IonIcon slot="icon-only" icon={chevronForwardOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <CalendarGrid currentDate={currentDate} />
      </IonContent>
    </IonPage>
  );
};

const CalendarGrid: React.FC<{ currentDate: Date }> = ({ currentDate }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = addDays(endOfWeek(monthEnd), 35);

  const renderDays = () => {
    const days = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      const isCurrentMonth = isSameMonth(currentDay, monthStart);
      const isCurrentDay = isCurrentMonth && currentDay.toDateString() === new Date().toDateString();
      let dayClass = isCurrentMonth ? 'calendar-day' : 'other-month';
      dayClass = dayClass + (isCurrentDay ? ' current-day' : '');

      days.push(
        <IonCol key={currentDay.toISOString()} className={dayClass}>
          {format(currentDay, 'd')}
        </IonCol>
      );

      currentDay = addDays(currentDay, 1);
    }

    return days;
  };

  return (
    <IonGrid className="calendar-grid">
      <IonRow>
        <IonCol>Sun</IonCol>
        <IonCol>Mon</IonCol>
        <IonCol>Tue</IonCol>
        <IonCol>Wed</IonCol>
        <IonCol>Thu</IonCol>
        <IonCol>Fri</IonCol>
        <IonCol>Sat</IonCol>
      </IonRow>
      {[...Array(6)].map((_, weekIndex) => (
        <IonRow key={weekIndex} className="week-row">
          {renderDays().slice(weekIndex * 7, (weekIndex + 1) * 7)}
        </IonRow>
      ))}
    </IonGrid>
  );
};

export default Calendar;