import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { Shooting } from "../../../interfaces/shootingTypes";
import { useCallback, useMemo } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow } from "@ionic/react";
import ShootingCard from "../ShootingCard/ShootingCard";

interface WeekViewProps {
  currentDate: Date;
  shootings: Shooting[];
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, shootings }) => {
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

  const getShootingsByDay = (day: Date) => {
    return shootings.filter((shooting) => {
      const shootDate = new Date(shooting.shootDate as string);
      return (
        day.getFullYear() === shootDate.getFullYear() &&
        day.getMonth() === shootDate.getMonth() &&
        day.getDate() === shootDate.getDate()
      );
    });
  };

  const renderDays = useCallback(
    () =>
      days.map((day) => (
        <IonCol key={day.toISOString()} className="week-day" size="12">
          <IonCard className={format(day, 'dd') === format(currentDate, 'dd') ? 'current-day' : ''}>
            <IonCardHeader>
              <IonCardTitle>{format(day, 'EEEE')}</IonCardTitle>
              <IonCardTitle>{format(day, 'dd')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {getShootingsByDay(day).map((shooting) => (
                <ShootingCard key={shooting.id} shooting={shooting} className='week-shooting' />
              ))}
            </IonCardContent>
          </IonCard>
        </IonCol>
      )),
    [days, currentDate, shootings]
  );

  return (
    <IonGrid className="week-view">
      <IonRow>{renderDays()}</IonRow>
    </IonGrid>
  );
};

export default WeekView;