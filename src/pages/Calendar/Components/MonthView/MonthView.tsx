import { IonCol, IonGrid, IonRow } from '@ionic/react';
import {
  addDays, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek,
} from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ShootingDocType } from '../../../../Shared/types/shooting.types';
import ShootingCard from '../ShootingCard/ShootingCard';

const MonthView: React.FC<{ currentDate: Date; shootings: ShootingDocType[] }> = ({ currentDate, shootings }) => {
  const [dayWithShootingCount, setDayWithShootingCount] = useState<{ [key: string]: number }>({});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  useEffect(() => {
    const countDaysWithShooting = () => {
      let count = 1;
      const newCount: { [key: string]: number } = {};
      let day = startDate;

      while (day <= endDate) {
        if (dayHasShooting(day)) {
          newCount[day.toISOString()] = count;
          count++;
        }
        day = addDays(day, 1);
      }

      setDayWithShootingCount(newCount);
    };

    countDaysWithShooting();
  }, [currentDate, shootings]);

  const dayHasShooting = (day: Date) => shootings.some((shooting) => {
    const shootDate = new Date(shooting.shootDate as string);
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
      const isSunday = currentDay.getDay() === 0;
      let dayClass = isCurrentMonth ? 'calendar-day' : 'other-month';
      dayClass += (isCurrentDay ? ' current-day' : '');
      dayClass += (isSunday ? ' sunday' : '');

      const dayCount = dayWithShootingCount[currentDay.toISOString()];

      days.push(
        <IonCol key={currentDay.toISOString()} className={dayClass}>
          <span
            className={`ion-flex ion-align-items-center ${dayCount ? 'space-flex-row' : 'end-flex-row'}`}
            style={{
              fontSize: '10px',
            }}
          >
            {dayCount && (
            <span>
              DAY #
              {dayCount}
            </span>
            )}
            <span className="day-number bold">{format(currentDay, 'd')}</span>
          </span>

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
        <IonCol>Mon</IonCol>
        <IonCol>Tue</IonCol>
        <IonCol>Wed</IonCol>
        <IonCol>Thu</IonCol>
        <IonCol>Fri</IonCol>
        <IonCol>Sat</IonCol>
        <IonCol>Sun</IonCol>
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
