import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter
} from '@ionic/react';
import { addDays, startOfDay } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useRxData } from 'rxdb-hooks';
import MonthView from '../../components/Calendar/MonthView/MonthView';
import MonthViewToolbar from '../../components/Calendar/MonthViewToolbar/MonthViewToolbar';
import WeekView from '../../components/Calendar/WeekView/WeekView';
import EditionModal, { FormInput, SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import Legend from '../../components/Shared/Legend/Legend';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import AppLoader from '../../hooks/Shared/AppLoader';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import { Shooting } from '../../interfaces/shooting.types';
import { Unit } from '../../interfaces/unitTypes.types';
import './Calendar.css';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import WeekViewToolbar from '../../components/Calendar/WeekViewToolbar/WeekViewToolbar';

const Calendar: React.FC = () => {
  const LOCAL_STORAGE_KEY = 'calendarCurrentDate';
  const localStorageDate = localStorage.getItem(LOCAL_STORAGE_KEY);
  const [calendarState, setCalendarState] = useState({
    currentDate: localStorageDate ? new Date(localStorageDate) : new Date(),
    viewMode: 'month' as 'month' | 'week',
    shootings: [] as Shooting[],
  });

  const {
    oneWrapDb, projectId, isOnline, initializeShootingReplication
  } = useContext<DatabaseContextProps>(DatabaseContext);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddShootingModal, setOpenAddShootingModal] = useState(false);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const isMobile = useIsMobile()

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
    (collection) => collection.find().sort({ unitNumber: 'asc' }),
  );

  const validateShootingExistence = (shootDate: string, unitId: string) => calendarState.shootings.some((shooting) => {
      console.log(shooting, shootDate, unitId);
      return shooting.shootDate === shootDate && shooting.unitId === parseInt(unitId);
    }
  );

  const createShooting = async (form: {
    shootDate: string;
    unitId: string;
  }) => {
    if (!oneWrapDb) {
      throw errorToast('Database not initialized');
    }

    if (validateShootingExistence(form.shootDate, form.unitId)) {
      errorToast('Shooting already exists');
      return;
    }

    try {
      const { unitId } = form;
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
      await initializeShootingReplication();
      await getShootings();
      successToast('Shooting created successfully');

      setOpenAddShootingModal(false);
    } catch (error) {
      errorToast('Error creating new shooting');
      throw error;
    }
  };

  const getUnitOptions = (units: Unit[]): SelectOptionsInterface[] => units.map((unit) => ({
    label: unit.unitName || 'No name',
    value: unit.id,
  }));

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
      offset: '3',
    },
    {
      fieldKeyName: 'unitId',
      label: 'Unit',
      placeholder: 'Select unit',
      type: 'select',
      required: true,
      search: true,
      selectOptions: getUnitOptions(units as any),
      col: '6',
      offset: '3',
    },
  ];

  const initializeReplication = async () => {
    try {
      setIsLoading(true);
      await getShootings();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    if (navigator.onLine || isOnline) {
      initializeReplication();
      console.log('online');
    } else {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (oneWrapDb && projectId) {
      const subscription = oneWrapDb.shootings
        .find({
          selector: {
            projectId,
          },
          sort: [{ createdAtBack: 'asc' }],
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
            throw error;
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [oneWrapDb, projectId]);

  const getShootings = async () => {
    if (!oneWrapDb) {
      throw errorToast('Database not initialized');
    }

    try {
      const shootings = await oneWrapDb.shootings.find({
        selector: {
          projectId,
        },
        sort: [{ createdAtBack: 'asc' }],
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
      throw error;
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
    setCalendarState((prevState) => {
      const newDate = addDays(prevState.currentDate, -7);
      saveDateToLocalStorage(newDate); // Guardar la nueva fecha en localStorage
      return {
        ...prevState,
        currentDate: newDate,
      };
    });
  };
  
  const nextWeek = () => {
    setCalendarState((prevState) => {
      const newDate = addDays(prevState.currentDate, 7);
      saveDateToLocalStorage(newDate); // Guardar la nueva fecha en localStorage
      return {
        ...prevState,
        currentDate: newDate,
      };
    });
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
        {!isMobile ? (
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
          <WeekViewToolbar
            currentDate={calendarState.currentDate}
            onPrev={prevWeek}
            onNext={nextWeek}
            goToCurrentDay={goToCurrentDay}
            onDateChange={handleDateChange}
            isLoading={isLoading}
          />
        
        )}
      </IonHeader>
      <IonContent color="tertiary" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={() => window.location.reload()}>
          <IonRefresherContent />
        </IonRefresher>
        <Legend items={legendItems} />
        {isLoading || isFetchingUnits ? (
          AppLoader()
        ) : !isMobile  ? (
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
