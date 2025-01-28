import React, { useEffect, useState } from 'react';
import GeneralTable, { Column, EditFunction } from '../../../../Shared/Components/GeneralTable/GeneralTable';
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
  IonCheckbox,
} from '@ionic/react';
import OutlinePrimaryButton from '../../../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import AppLoader from '../../../../Shared/hooks/AppLoader';
import './ CrewView.scss'
import { ShootingStatusEnum } from '../../../../Shared/ennums/ennums';
import { CrewCall, ShootingDocType } from '../../../../Shared/types/shooting.types';
import useErrorToast from '../../../../Shared/hooks/useErrorToast';
import useSuccessToast from '../../../../Shared/hooks/useSuccessToast';
import { CrewDocType } from '../../../../Shared/types/crew.types';

interface CrewViewProps {
  crewCalls: CrewCall[];
  editMode: boolean;
  setCrewCalls: any
  searchText: string;
  openCopyCrewModal: boolean;
  setOpenCopyCrewModal: any;
}

const CrewView: React.FC<CrewViewProps> = ({ crewCalls, editMode, setCrewCalls, searchText, openCopyCrewModal, setOpenCopyCrewModal }) => {
  const columns: Column[] = [
    {
      key: 'name', title: 'Name', type: 'text', textAlign: 'left',
    },
    { key: 'position', title: 'Position', type: 'text', textAlign: 'left' },
    { key: 'call', title: 'Call', type: 'hour',  editable: true},
    { key: 'callPlace', title: 'Call Place', type: 'text',  editable: true },
    { key: 'onCall', title: 'On Call', type: 'text' },
  ];

  const currentDate = new Date()
   // FORMAT ON YYYY-MM-DD
  const formattedDate = currentDate.toISOString().split('T')[0];

  const { shootingId } = useParams<{ shootingId: string }>();
  const oneWrappDb: any = useRxDB();

  const [ thisShooting, setThisShooting ] = useState<ShootingDocType | any>(null);
  const [ availableDates, setAvailableDates ] = useState<{
    date: string;
    status: number;
  }[]>([]);
  const [ copyCrewFromMaster, setCopyCrewFromMaster ] = useState<boolean>(false);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const [ selectedDate, setSelectedDate ] = useState<string>(availableDates[0]?.date || formattedDate);

  const { result: shootings, isFetching }: {
    result: ShootingDocType[];
    isFetching: boolean;
  } = useRxData('shootings', (collection) => collection.find());
  const { result: units, isFetching: isFetchingUnits } = useRxData('units', (collection) => collection.find());

  const { result: crew, isFetching: isFetchingCrew } = useRxData<CrewDocType>('crew', (collection) => collection.find());
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

  // const deleteCrewCall = async (index: number) => {
  //   try {
  //     const newCrewCalls = crewCalls.filter((call, i) => i !== index);
  //     const shootingUpdate = {
  //       ...thisShooting._data,
  //       crewCalls: newCrewCalls,
  //     };
  //     await oneWrappDb?.shootings.upsert(shootingUpdate);
  //     setCrewCalls(newCrewCalls);
  //     successToast('Crew call deleted successfully');
  //   } catch (error: any) {
  //     console.error('Error deleting crew call:', error?.validationErrors || error);
  //     errorToast('Error deleting crew call');
  //   }
  // }

  // const editOptions: editOptionType[] = [
  //   {
  //     label: 'edit',
  //     onClick: (index: number) => console.log('Edit', index),
  //   },
  //   {
  //     label: 'delete',
  //     onClick: (index: number) => deleteCrewCall(index),
  //   }
  // ]

  const editCrew: EditFunction = async (index: number, key: string, value: any) => {
    console.log('Edit crew', index, key, value);
  }

  const copyCrewCalls = async () => {
    try {
      // Validate required data
      if (!selectedDate || (!selectedUnitId  && !copyCrewFromMaster)|| !thisShooting) {
        errorToast('Missing required data to copy crew calls');
        return;
      }
  
      let newCrewCalls: CrewCall[];
  
      if (!copyCrewFromMaster) {
        // Find source shooting with the selected date and unit
        const sourceShootingDoc = shootings.find(
          (shooting: ShootingDocType) => 
            shooting.shootDate === selectedDate && 
            shooting.unitId === parseInt(selectedUnitId)
        );
  
        if (!sourceShootingDoc || !sourceShootingDoc.crewCalls?.length) {
          errorToast('No crew calls found for selected date and unit');
          return;
        }
  
        // Create new crew calls array based on source shooting
        newCrewCalls = sourceShootingDoc.crewCalls.map((call: any) => ({
          ...call,
          call: call.onCall ? null : thisShooting.generalCall || null,
          wrap: null
        }));
      } else {
        // Create custom crewCalls array based on the existing crew
        newCrewCalls = (crew as CrewDocType[])?.map((crewMember: CrewDocType) => ({
          id: `${crewMember.id}-${selectedDate}`,
          visible: crewMember.visibleOnCall ?? null,
          name: crewMember.fullName,
          departmentEsp: crewMember.depNameEsp,
          departmentEng: crewMember.depNameEng,
          position: crewMember.positionEng,
          call: crewMember.onCall ? null : thisShooting.generalCall || null,
          callPlace: null,
          wrap: null,
          onCall: crewMember.onCall ?? null,
          projCrewId: parseInt(crewMember.id || '0')
        }));
      }
  
      // Prepare shooting document update
      const shootingUpdate = {
        ...thisShooting._data,
        crewCalls: newCrewCalls,
      };
  
      // Update shooting document in database
      await oneWrappDb?.shootings.upsert(shootingUpdate);
      setCrewCalls(newCrewCalls);
      successToast('Crew calls copied successfully');
      closeModal();
    } catch (error: any) {
      console.error('Error copying crew calls:', error?.validationErrors || error);
      errorToast('Error copying crew calls');
    }
  };

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
            <IonRow className='ion-flex ion-align-items-center ion-justify-content-center'>
              <IonCheckbox
                checked={copyCrewFromMaster}
                onIonChange={(e) => setCopyCrewFromMaster(e.detail.checked)}
                className='ion-flex ion-align-items-icenter'
              />
              <p className="ion-padding-start">COPY FROM MASTER</p>
            </IonRow>
            {
              !copyCrewFromMaster && (
                <>
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
                </>
              )
            }
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

  if (!crewCalls.length) return <NoRegisters addNew={() => setOpenCopyCrewModal(true)} name='Copy Crew' />;

  return (
    <GeneralTable
      columns={columns}
      data={formattedData}
      stickyColumnCount={1}
      editMode={editMode}
      groupBy='departmentEng'
      searchText={searchText}
      numbered={true}
      editFunction={editCrew}
      // editOptions={editOptions}
    />
  );
};

export default CrewView;  