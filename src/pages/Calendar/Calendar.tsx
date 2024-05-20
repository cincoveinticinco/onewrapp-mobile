import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent 
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, calendarOutline, listOutline } from 'ionicons/icons';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, startOfDay, endOfDay } from 'date-fns';
import './Calendar.css';

const monthViewToolbar = (currentDate: Date, onPrev: () => void, onNext: () => void) => (
    <IonToolbar color="tertiary">
    <IonButtons slot="start">
      <IonButton onClick={onPrev}>
        <IonIcon slot="icon-only" icon={chevronBackOutline} />
      </IonButton>
    </IonButtons>
    <IonTitle>{format(currentDate, 'MMMM yyyy')}</IonTitle>
    <IonButtons slot="end">
      <IonButton onClick={onNext}>
        <IonIcon slot="icon-only" icon={chevronForwardOutline} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
);

const weekViewToolbar = (currentDate: Date, onPrev: () => void, onNext: () => void) => (
  <IonToolbar color="tertiary">
    <IonButtons slot="start">
      <IonButton onClick={() => onPrev()}>
        <IonIcon slot="icon-only" icon={chevronBackOutline} />
      </IonButton>
    </IonButtons>
    <IonTitle>
      {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} -{' '}
      {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
    </IonTitle>
    <IonButtons slot="end">
      <IonButton onClick={() => onNext()}>
        <IonIcon slot="icon-only" icon={chevronForwardOutline} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
);

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevWeek = () => {
    setCurrentDate(startOfWeek(addDays(currentDate, -7), { weekStartsOn: 1 }));
  };
  
  const nextWeek = () => {
    setCurrentDate(startOfWeek(addDays(currentDate, 7), { weekStartsOn: 1 }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonSegment value={viewMode} onIonChange={(e) => setViewMode(e.detail.value as 'month' | 'week')}>
            <IonSegmentButton value="month">
              <IonIcon icon={calendarOutline} />
              <IonLabel>Mes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="day">
              <IonIcon icon={listOutline} />
              <IonLabel>Día</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {
          viewMode === 'month'
            ? monthViewToolbar(currentDate, prevMonth, nextMonth)
            : weekViewToolbar(currentDate, prevWeek, nextWeek)
        }
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {viewMode === 'month' ? <MonthView currentDate={currentDate} /> : <WeekView currentDate={currentDate} />}
      </IonContent>
    </IonPage>
  );
};

const MonthView: React.FC<{ currentDate: Date }> = ({ currentDate }) => {
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

interface WeekViewProps {
  currentDate: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = useMemo(() => {
    const days = [];
    let currentDay = weekStart;
    while (currentDay <= weekEnd) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    return days;
  }, [weekStart, weekEnd]);

  const renderDays = useCallback(
    () =>
      days.map((day) => (
        <IonCol key={day.toISOString()} className="week-day" size='12'>
          <IonCard className={format(day, 'dd') === format(currentDate, 'dd') ? 'current-day' : ''}>
            <IonCardHeader>
              <IonCardTitle>{format(day, 'EEEE')}</IonCardTitle>
              <IonCardTitle>{format(day, 'dd')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {/* Add your event or schedule content here */}
            </IonCardContent>
          </IonCard>
        </IonCol>
      )),
    [days, currentDate]
  );

  return (
    <IonGrid className="week-view">
      <IonRow>{renderDays()}</IonRow>
    </IonGrid>
  );
};

export default Calendar;