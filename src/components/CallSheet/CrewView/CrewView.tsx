import React, { useEffect, useState } from 'react';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable';
import NoRegisters from '../NoRegisters/NoRegisters';
import { useParams } from 'react-router';
import { useRxData, useRxDB } from 'rxdb-hooks';
import { 
  IonButton, 
  IonContent, 
  IonGrid, 
  IonModal, 
  IonRow, 
  IonSelect,
  IonSelectOption,
  IonDatetime,
} from '@ionic/react';
import OutlinePrimaryButton from '../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';
import AppLoader from '../../../hooks/Shared/AppLoader';
import './ CrewView.scss'
import { ShootingStatusEnum } from '../../../Ennums/ennums';
import { Shooting } from '../../../interfaces/shooting.types';
import { copy } from 'ionicons/icons';
import useErrorToast from '../../../hooks/Shared/useErrorToast';
import useSuccessToast from '../../../hooks/Shared/useSuccessToast';

interface CrewCall {
  id: string;
  visible: boolean | null;
  unit: string | null;
  name: string | null;
  department: string | null;
  position: string | null;
  call: string | null;
  callPlace: string | null;
  wrap: string | null;
  onCall: boolean | null;
}

interface CrewViewProps {
  crewCalls: CrewCall[];
  editMode: boolean;
}

const CrewView: React.FC<CrewViewProps> = ({ crewCalls, editMode }) => {
  const columns: Column[] = [
    {
      key: 'name', title: 'Name', type: 'text', textAlign: 'left',
    },
    { key: 'visible', title: 'Visible', type: 'text' },
    { key: 'unit', title: 'Unit', type: 'text' },
    { key: 'departmentEng', title: 'Department', type: 'text' },
    { key: 'position', title: 'Position', type: 'text' },
    { key: 'call', title: 'Call', type: 'hour' },
    { key: 'callPlace', title: 'Call Place', type: 'text' },
    { key: 'wrap', title: 'Wrap', type: 'hour' },
    { key: 'onCall', title: 'On Call', type: 'text' },
  ];

  const currentDate = new Date()
   // FORMAT ON YYYY-MM-DD
  const formattedDate = currentDate.toISOString().split('T')[0];

  const { shootingId } = useParams<{ shootingId: string }>();
  const oneWrappDb: any = useRxDB();

  const [ thisShooting, setThisShooting ] = useState<Shooting | null>(null);
  const [ shootingsWithCrewCalls, setShootingsWithCrewCalls ] = useState<any>(null);
  const [ availableDates, setAvailableDates ] = useState<{
    date: string;
    status: number;
  }[]>([]);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const [ selectedDate, setSelectedDate ] = useState<string>(availableDates[0]?.date || formattedDate);

  const { result: shootings, isFetching }: {
    result: Shooting[];
    isFetching: boolean;
  } = useRxData('shootings', (collection) => collection.find());
  const { result: units, isFetching: isFetchingUnits } = useRxData('units', (collection) => collection.find());

  const [ openCopyCrewModal, setOpenCopyCrewModal ] = useState<boolean>(false);
  const [ selectedUnitId, setSelectedUnitId ] = useState<string>('');

  const formattedData = crewCalls.map((crew) => ({
    ...crew,
    visible: crew.visible ? 'YES' : 'NO',
    onCall: crew.onCall ? 'YES' : 'NO',
  }));

  useEffect(() => {
    if(shootingId) {
      const shooting = shootings.find((shooting: any) => shooting._data.id === shootingId);
      if(shooting) {
        setThisShooting(shooting);
      }
    }
  }, [shootings])


  const closeModal = () => {
    setOpenCopyCrewModal(false);
    setSelectedUnitId('');
    setSelectedDate('');
    setAvailableDates([]);
  };

  const getAvailableShootingDays = (unitId: string) => {
    const shootingDays = shootings.filter((shooting: any) => shooting._data.unitId === parseInt(unitId) && shooting._data.crewCalls.length > 0).map((shooting: any) => {
      return {
        date: shooting.shootDate,
        status: shooting.status
      }
    });
    setAvailableDates(shootingDays);
    setSelectedDate(shootingDays[0]?.date || formattedDate);
  };

  // Función para validar si una fecha está disponible
  const isDateEnabled = (dateString: string) => {
    return availableDates.map(date => date.date).includes(dateString.split('T')[0]);
  };

  const copyCrewCalls = async () => {
    // find a shooting with the selected date and the selected unit
    const shooting = shootings.find((shooting: Shooting) => shooting.shootDate === selectedDate);
    const shootingCopy = {...shooting};
    if (!shootingCopy) return;
    // format the crew calls for selected shooting
    if (shootingCopy.crewCalls) {
      if (thisShooting?.generalCall) {
        shootingCopy.crewCalls = shootingCopy.crewCalls.map((call: any) => {
          if (call.onCall) {
            return {
              ...call,
              call: null
            }
          } else {
            return {
              ...call,
              call: thisShooting?.generalCall,
            }
          }
        })
      } else {
        shootingCopy.crewCalls = shootingCopy.crewCalls.map((call: any) => {
          return {
            ...call,
            call: null,
          }
        })
      }
    }

    const thisShootingCopy = {...thisShooting};
    if (thisShootingCopy.crewCalls) {
      thisShootingCopy.crewCalls = shootingCopy.crewCalls
    }

    try {
      await oneWrappDb.collection('shootings').upsert(thisShootingCopy);
      successToast('Crew calls copied successfully');
      closeModal();
    } catch (error) {
      errorToast('Error copying crew calls');
      console.error(error);
    }
  }
  // Formatear las fechas para highlightedDates
  const highlightedDates = availableDates.map(shoot => {
    if(shoot.status === ShootingStatusEnum.Called) { 
      return {
        date: shoot.date,
        textColor: 'var(--ion-color-dark)',
        backgroundColor: '#f3fb8c',
      }
    } else if(shoot.status === ShootingStatusEnum.Closed) {
      return {
        date: shoot.date,
        textColor: 'var(--ion-color-dark)',
        backgroundColor: 'var(--ion-color-success)',
      }
    } else {
      return {
        date: shoot.date,
        textColor: 'var(--ion-color-dark)',
        backgroundColor: 'var(--ion-color-primary)',
      }
    }
  });

  if (isFetching || isFetchingUnits) return AppLoader();

  if (openCopyCrewModal) {
    return (
      <IonModal isOpen={openCopyCrewModal} className="general-modal-styles">
        <IonContent color='tertiary'>
          <IonButton fill="clear" onClick={closeModal}>
            BACK
          </IonButton>
          <IonGrid className="edit-inputs-wrapper" fixed style={{ maxWidth: '600px' }}>
            <IonRow>
              <IonSelect
                color='tertiary'
                interface='popover'
                placeholder="SELECT A UNIT"
                value={selectedUnitId}
                onIonChange={e => { 
                  setSelectedUnitId(e.detail.value); 
                  getAvailableShootingDays(e.detail.value); 
                }}
                className="ion-margin-top"
                labelPlacement="stacked"
                label='UNIT'
                mode="ios"
              >
                {units.map((unit: any) => (
                  <IonSelectOption key={unit.id} value={unit.id}>
                    {`UNIT-${unit?.unitNumber}-${unit?.unitName.toUpperCase() || unit?.unitNumber}`}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonRow>   
            <IonRow className='margin-top'>
              <IonDatetime
                preferWheel={false}
                presentation="date"
                value={selectedDate}
                onIonChange={(e) => {
                  const newDate = e.detail.value;
                  if (typeof newDate === "string" && isDateEnabled(newDate)) {
                    setSelectedDate(newDate);
                  }
                }}
                highlightedDates={highlightedDates}
                isDateEnabled={isDateEnabled}
                className="ion-margin-top custom-datetime"  // Clase personalizada para CS
              />
            </IonRow>
          </IonGrid>
          <div className="edit-new-option-buttons-container ion-flex-column">
            <OutlinePrimaryButton
              buttonName="SAVE"
              onClick={() => copyCrewCalls()}
              className="modal-confirm-button"
              color="success"
            />
            <IonButton
              onClick={closeModal}
              className="modal-cancel-button clear-danger-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    )
  }

  if (!crewCalls.length) return <NoRegisters addNew={() => setOpenCopyCrewModal(true)} />;

  return (
    <GeneralTable
      columns={columns}
      data={formattedData}
      stickyColumnCount={1}
      editMode={editMode}
    />
  );
};

export default CrewView;  