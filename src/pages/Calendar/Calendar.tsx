import React, { useContext, useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewDidEnter,
  useIonViewWillEnter,
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
import EditionModal, { FormInput, SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import { useRxData } from 'rxdb-hooks';
import { Unit } from '../../interfaces/unitTypes.types';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';


const Calendar: React.FC = () => {
  const LOCAL_STORAGE_KEY = 'calendarCurrentDate';
  const localStorageDate = localStorage.getItem(LOCAL_STORAGE_KEY);
  const [calendarState, setCalendarState] = useState({
    currentDate: localStorageDate ? new Date(localStorageDate) : new Date(),
    viewMode: 'month' as 'month' | 'week',
    shootings: [] as Shooting[],
  });

  const { oneWrapDb, projectId, setProjectId, initializeShootingReplication } = useContext<DatabaseContextProps>(DatabaseContext);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [openAddShootingModal, setOpenAddShootingModal] = useState(false);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();

  useEffect(() => {
    const storedDate = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDate) {
      setCalendarState((prevState) => ({
        ...prevState,
        currentDate: new Date(storedDate),
      }));
    }
  }, []);

  const legendItems = [
    { color: 'var(--ion-color-primary)', label: 'OPEN SHOOTING' },
    { color: '#f3fb8c', label: 'CALLED SHOOTING' },
    { color: 'var(--ion-color-success)', label: 'CLOSED SHOOTING' },
  ];

  const { result: units, isFetching: isFetchingUnits } = useRxData(
    'units',
    (collection) => collection.find().sort({ unitNumber: 'asc' })
  );

  const validateShootingExistence = (shootDate: string, unitId: string) => {
    return calendarState.shootings.some((shooting) => (
      shooting.shootDate === shootDate && shooting.unitId === parseInt(unitId)
    ));
  }

  const createShooting = async (form: {
    shootDate: string;
    unitId: string;
  }) => {
    if (!oneWrapDb) {
      console.error('Database not initialized');
      return;
    }

    if(validateShootingExistence(form.shootDate, form.unitId)) {
      errorToast('Shooting already exists');
      return;
    }

    try {
      const unitId = form.unitId;
      const unit = units.map((u: any) => u._data).find((u: Unit) => u.id === unitId);
      if (!unit) {
        errorToast('Unit not found');
        return;
      }

      const tempId = `${form.shootDate}_${unit.id}`;

      const newShooting: Partial<Shooting> = {
        id: tempId,
        projectId: projectId || undefined,
        unitId: parseInt(unit.id),
        unitNumber: unit.unitNumber,
        shootDate: form.shootDate,
        status: 1,
        isTest: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scenes: [],
        banners: [],
        locations: [],
        hospitals: [],
        meals: [],
        services: [],
        advanceCalls: [],
        castCalls: [],
        extraCalls: [],
        crewCalls: [],
        pictureCars: [],
        otherCalls: [],
      };

      await oneWrapDb.shootings.insert(newShooting);
      await getShootings();

      setOpenAddShootingModal(false);
    } catch (error) {
      console.error('Error creating new shooting:', error);
      errorToast('Error creating new shooting');
      return;
    } finally {
      successToast('Shooting created successfully');
    }
  };

  const getUnitOptions = (units: Unit[]): SelectOptionsInterface[] => {
    return units.map((unit) => ({
      label: unit.unitName || 'No name',
      value: unit.id
    }));
  }

  const saveDateToLocalStorage = (date: Date) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, date.toISOString());
  };

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
      fieldKeyName: 'unitId',
      label: 'Unit',
      placeholder: 'Select unit',
      type: 'select',
      required: true,
      selectOptions: getUnitOptions(units as any),
      col: '6',
    },
  ]

  useIonViewWillEnter(() => {
    setProjectId(id);
    {
      const initializeReplication = async () => {
        try {
          setIsLoading(true);
          await initializeShootingReplication()
        } catch (error) {
          console.error('Error initializing replication:', error);
        } finally {
          setIsLoading(false);
        }
      }

      if(navigator.onLine) {
        initializeReplication();
      }
    }
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
    if(navigator.onLine) {
      initializeReplication();
    }
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
    setCalendarState((prevState) => {
      const newDate = new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() - 1, 1);
      saveDateToLocalStorage(newDate);
      return {
        ...prevState,
        currentDate: newDate,
      };
    });
  };

  const nextMonth = () => {
    setCalendarState((prevState) => {
      const newDate = new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() + 1, 1);
      saveDateToLocalStorage(newDate);
      return {
        ...prevState,
        currentDate: newDate,
      };
    });
  };

  const handleDateChange = (newDate: Date) => {
    setCalendarState((prevState) => {
      saveDateToLocalStorage(newDate);
      return {
        ...prevState,
        currentDate: newDate,
      };
    });
  };

  const goToCurrentDay = () => {
    const today = new Date();
    setCalendarState((prevState) => {
      saveDateToLocalStorage(today);
      return {
        ...prevState,
        currentDate: today,
      };
    });
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
            setOpenAddShootingModal={() => setOpenAddShootingModal(!openAddShootingModal)}
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
        {isLoading || isFetchingUnits ? (
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
        handleEdition={createShooting}
        title="Add Shooting"
      />
    </IonPage>
  );
};

export default Calendar;
