import {
  addDays, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek,
} from 'date-fns';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { Shooting } from '../../../interfaces/shooting.types';
import ShootingCard from '../ShootingCard/ShootingCard';

const MonthView: React.FC<{ currentDate: Date; shootings: Shooting[] }> = ({ currentDate, shootings }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = addDays(endOfWeek(monthEnd), 35);

  const dayHasShooting = (day: Date) => shootings.some((shooting) => {
    const shootDate = new Date(shooting.shootDate as string);
    // Sumar 1 día a la fecha del shooting por un bug de renderizado
    const adjustedShootDate = new Date(shootDate.getTime() + (24 * 60 * 60 * 1000));
    return (
      day.getFullYear() === adjustedShootDate.getFullYear()
        && day.getMonth() === adjustedShootDate.getMonth()
        && day.getDate() === adjustedShootDate.getDate()
    );
  });
  const getSHootingsByDay = (day: Date) => shootings.filter((shooting) => {
    const shootDate = new Date(shooting.shootDate as string);
    const adjustedShootDate = new Date(shootDate.getTime() + (24 * 60 * 60 * 1000));
    return (
      day.getFullYear() === adjustedShootDate.getFullYear()
        && day.getMonth() === adjustedShootDate.getMonth()
        && day.getDate() === adjustedShootDate.getDate()
    );
  });

  const renderDays = () => {
    const days = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      const isCurrentMonth = isSameMonth(currentDay, monthStart);
      const isCurrentDay = isCurrentMonth && currentDay.toDateString() === new Date().toDateString();
      let dayClass = isCurrentMonth ? 'calendar-day' : 'other-month';
      dayClass += (isCurrentDay ? ' current-day' : '');

      days.push(
        <IonCol key={currentDay.toISOString()} className={dayClass}>
          <span className="day-number">{format(currentDay, 'd')}</span>
          {
            dayHasShooting(currentDay) && getSHootingsByDay(currentDay).map((shooting) => (
              isCurrentMonth && <ShootingCard key={shooting.id} shooting={shooting} className="month-shooting" />
            ))
          }
        </IonCol>,
      );

      currentDay = addDays(currentDay, 1);
    }

    return days;
  };

  return (
    <IonGrid className="calendar-grid">
      <IonRow className="day-names-row">
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

export default MonthView;
