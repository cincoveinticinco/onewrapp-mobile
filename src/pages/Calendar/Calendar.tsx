import React, { useContext, useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewDidEnter,
} from '@ionic/react';
import { startOfWeek, addDays, startOfDay } from 'date-fns';
import './Calendar.css';
import { useParams } from 'react-router';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import { Shooting } from '../../interfaces/shooting.types';
import WeekView from '../../components/Calendar/WeekView/WeekView';
import MonthView from '../../components/Calendar/MonthView/MonthView';
import MonthViewToolbar from '../../components/Calendar/MonthViewToolbar/MonthViewToolbar';
import useLoader from '../../hooks/Shared/useLoader';
import Legend from '../../components/Shared/Legend/Legend';
import EditionModal, { FormInput } from '../../components/Shared/EditionModal/EditionModal';

const Calendar: React.FC = () => {
  const [calendarState, setCalendarState] = useState({
    currentDate: new Date(),
    viewMode: 'month' as 'month' | 'week',
    shootings: [] as Shooting[],
  });

  const { oneWrapDb, projectId, setProjectId, initializeShootingReplication } = useContext<DatabaseContextProps>(DatabaseContext);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [openAddShootingModal, setOpenAddShootingModal] = useState(false);

  const legendItems = [
    { color: 'var(--ion-color-primary)', label: 'OPEN SHOOTING' },
    { color: '#f3fb8c', label: 'CALLED SHOOTING' },
    { color: 'var(--ion-color-success)', label: 'CLOSED SHOOTING' },
  ];

  // to create a new shooting, we need only two inputs: the shooting date and the shooting unit number
  
// export interface FormInput {
//   fieldKeyName: string;
//   label: string;
//   placeholder: string;
//   type: string;
//   col?: string;
//   inputName?: string;
//   required?: boolean;
//   selectOptions?: SelectOptionsInterface[];
//   search?: boolean;
// }

  const addShootingInputs: FormInput[] = [
    {
      fieldKeyName: 'shootDate',
      label: 'Shoot Date',
      placeholder: 'Enter shoot date',
      type: 'date',
      required: true,
      col: '6',
    },
    {
      fieldKeyName: 'unitNumber',
      label: 'Unit Number',
      placeholder: 'Enter unit number',
      type: 'number',
      required: true,
      col: '6',
    },
  ]

  useIonViewDidEnter(() => {
    setProjectId(id);
    initializeShootingReplication()
  });

  const initializeReplication = async () => {
    try {
      setIsLoading(true);
      await getShootings();
    } catch (error) {
      console.error('Error initializing replication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    initializeReplication();
  });

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
    if (!oneWrapDb) {
      console.error('Database not initialized');
      return;
    }

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

  const goToCurrentDay = () => {
    setCalendarState((prevState) => ({
      ...prevState,
      currentDate: new Date(),
    }));
  }

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
        {/* <IonSegment
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
        </IonSegment> */}
        {calendarState.viewMode === 'month' ? (
          <MonthViewToolbar
            currentDate={calendarState.currentDate}
            onPrev={prevMonth}
            onNext={nextMonth}
            goToCurrentDay={goToCurrentDay}
            onDateChange={handleDateChange}
            isLoading={isLoading}
            setOpenAddShootingModal={() => setOpenAddShootingModal(true)}
          />
        ) : (
          // <weekViewToolbar
          //   currentDate={calendarState.currentDate}
          //   onPrev={prevWeek}
          //   onNext={nextWeek}
          // />
          <></>
        )}
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <Legend items={legendItems} />
        {isLoading ? (
          useLoader()
        ) : calendarState.viewMode === 'month' ? (
          <MonthView currentDate={calendarState.currentDate} shootings={calendarState.shootings} />
        ) : (
          <WeekView currentDate={calendarState.currentDate} shootings={calendarState.shootings} />
        )}
      </IonContent>
      <EditionModal
        isOpen={openAddShootingModal}
        setIsOpen={setOpenAddShootingModal}
        formInputs={addShootingInputs}
        handleEdition={(form: any) => {console.log(form)}}
        title="Add Shooting"
      />
    </IonPage>
  );
};

export default Calendar;
