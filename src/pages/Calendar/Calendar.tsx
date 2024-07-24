import React, { useContext, useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  useIonViewWillEnter,
} from '@ionic/react';
import { calendarOutline, listOutline } from 'ionicons/icons';
import { startOfWeek, addDays, startOfDay } from 'date-fns';
import './Calendar.css';
import DatabaseContext, { DatabaseContextProps } from '../../hooks/Shared/database';
import { Shooting } from '../../interfaces/shootingTypes';
import weekViewToolbar from '../../components/Calendar/WeekViewToolbar/WeekViewToolbar';
import WeekView from '../../components/Calendar/WeekView/WeekView';
import MonthView from '../../components/Calendar/MonthView/MonthView';
import MonthViewToolbar from '../../components/Calendar/MonthViewToolbar/MonthViewToolbar';
import useLoader from '../../hooks/Shared/useLoader';
import { useParams } from 'react-router';

const Calendar: React.FC = () => {
  const [calendarState, setCalendarState] = useState({
    currentDate: new Date(),
    viewMode: 'month' as 'month' | 'week',
    shootings: [] as Shooting[],
  });

  const { oneWrapDb, projectId, initializeShootingReplication, setProjectId } = useContext<DatabaseContextProps>(DatabaseContext);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<any>();

  useIonViewWillEnter(() => {
    setProjectId(id);
  });

  useEffect(() => {
    const initializeReplication = async () => {
      try {
        setIsLoading(true);
        const replicationFinished = await initializeShootingReplication();
        if (replicationFinished) {
          await getShootings();
        }
      } catch (error) {
        console.error('Error initializing replication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeReplication();
  }, [projectId]);

  useEffect(() => {
    if (oneWrapDb && projectId) {
      const subscription = oneWrapDb.shootings
        .find({
          selector: {
            projectId,
          },
          sort: [{ createdAt: 'asc' }],
        })
        .$.subscribe({
          next: (shootings) => {
            const shootingsData = shootings.map((shooting: any) => shooting._data);
            setCalendarState((prevState) => ({
              ...prevState,
              shootings: shootingsData as Shooting[],
              currentDate: shootingsData.length > 0
                ? startOfDay(new Date(shootingsData[0].shootDate as string))
                : prevState.currentDate,
            }));
          },
          error: (error) => {
            console.error('Error in shootings subscription:', error);
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [oneWrapDb, projectId]);

  const getShootings = async () => {
    if (!oneWrapDb) return;

    try {
      const shootings = await oneWrapDb.shootings.find({
        selector: {
          projectId,
        },
        sort: [{ createdAt: 'asc' }],
      }).exec();

      const shootingsData = shootings.map((shooting: any) => shooting._data);

      setCalendarState((prevState) => ({
        ...prevState,
        shootings: shootingsData as Shooting[],
        currentDate: shootingsData.length > 0
          ? startOfDay(new Date(shootingsData[0].shootDate as string))
          : prevState.currentDate,
      }));
    } catch (error) {
      console.error('Error fetching shootings:', error);
    }
  };

  const prevMonth = () => {
    setCalendarState((prevState) => ({
      ...prevState,
      currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() - 1, 1),
    }));
  };

  const nextMonth = () => {
    setCalendarState((prevState) => ({
      ...prevState,
      currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() + 1, 1),
    }));
  };

  const handleDateChange = (newDate: Date) => {
    setCalendarState((prevState) => ({
      ...prevState,
      currentDate: newDate,
    }));
  };

  const prevWeek = () => {
    setCalendarState((prevState) => ({
      ...prevState,
      currentDate: startOfWeek(addDays(prevState.currentDate, -7), { weekStartsOn: 1 }),
    }));
  };

  const nextWeek = () => {
    setCalendarState((prevState) => ({
      ...prevState,
      currentDate: startOfWeek(addDays(prevState.currentDate, 7), { weekStartsOn: 1 }),
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonSegment
            value={calendarState.viewMode}
            onIonChange={(e) => setCalendarState((prevState) => ({
              ...prevState,
              viewMode: e.detail.value as 'month' | 'week',
            }))}
          >
            <IonSegmentButton value="month">
              <IonIcon icon={calendarOutline} />
              <IonLabel>Mes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="week">
              <IonIcon icon={listOutline} />
              <IonLabel>Semana</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {
          calendarState.viewMode === 'month'
            ? (
              <MonthViewToolbar
                currentDate={calendarState.currentDate}
                onPrev={prevMonth}
                onNext={nextMonth}
                onDateChange={handleDateChange}
              />
            )
            : weekViewToolbar(calendarState.currentDate, prevWeek, nextWeek)
        }
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        {
        isLoading
          ? useLoader()
          : calendarState.viewMode === 'month'
            ? <MonthView currentDate={calendarState.currentDate} shootings={calendarState.shootings} />
            : <WeekView currentDate={calendarState.currentDate} shootings={calendarState.shootings} />
      }
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
