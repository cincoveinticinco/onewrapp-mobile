// Crew.tsx
import { IonButton, IonContent, IonIcon } from '@ionic/react';
import { caretDown, caretUp } from 'ionicons/icons';
import React, { useMemo, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useHistory, useParams } from 'react-router';
import { useRxData, useRxDB } from 'rxdb-hooks';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import CrewCard from '../../components/Crew/CrewCard/CrewCard';
import EditionModal, { FormInput, SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import { Country } from '../../interfaces/country.types';
import { Crew as CrewInterface } from '../../interfaces/crew.types';
import { Unit } from '../../interfaces/unitTypes.types';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import './Crew.scss';
import useSuccessToast from '../../hooks/Shared/useSuccessToast';
import useErrorToast from '../../hooks/Shared/useErrorToast';

interface FormStructureInterface {
  fullName: string;
  position: string;
  email: string;
  countryId: string;
  phone: string;
  unitId: string;
  order: string;
  visibleOnCall: boolean;
  visibleOnHeader: boolean;
  onCall: boolean;
  dailyReportSignature: boolean;
  emergencyContact: boolean;
  department: string;
}

const Crew: React.FC<{
  permissionType?: number | null;
}> = ({ permissionType }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');
  const [addNewModalIsOpen, setAddNewModalIsOpen] = useState(false);
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const oneWrappDb: any = useRxDB();
  const history = useHistory();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  // Fetch crew data using useRxData
  const { result: crew = [], isFetching }: {result: CrewInterface[], isFetching: boolean} = useRxData(
    'crew',
    (collection) => collection.find(),
  );

  const { result: units = [] }: {result: Unit[]} = useRxData(
    'units',
    (collection) => collection.find(),
  );

  const { result: countries = [] }: {result: Country[]} = useRxData(
    'countries',
    (collection) => collection.find(),
  );

  // Create or update crew member
  const handleUpsert = async (data: FormStructureInterface) => {
    const unit = units.find((unit) => unit.id === data.unitId);
    const formattedData: CrewInterface = {
      id: selectedCrewId || `${Date.now()}`,
      fullName: data.fullName,
      positionEsp: data.position,
      positionEng: data.position,
      email: data.email,
      countryId: data.countryId,
      phone: data.phone,
      unitId: data.unitId,
      unitName: unit?.unitName || '',
      unitNumber: unit?.unitNumber || 0,
      order: parseInt(data.order),
      visibleOnCall: data.visibleOnCall,
      visibleOnHeader: data.visibleOnHeader,
      onCall: data.onCall,
      dailyReportSignature: data.dailyReportSignature,
      emergencyContact: data.emergencyContact,
      depNameEng: data.department.toUpperCase(),
      depNameEsp: data.department.toUpperCase(),
      projectId: parseInt(id),
      updatedAt: new Date().toISOString(),
    };

    try {
      await oneWrappDb.crew.upsert(formattedData);
      successToast(`Crew member ${selectedCrewId ? 'updated' : 'added'} successfully`);
      setAddNewModalIsOpen(false);
      setSelectedCrewId(null);
    } catch (error) {
      errorToast(`Error ${selectedCrewId ? 'updating' : 'adding'} crew member`);
      console.error(`Error ${selectedCrewId ? 'updating' : 'adding'} crew member:`, error);
    }
  };

  const handleDeleteCrew = async (id: string) => {
    try {
      await oneWrappDb.crew.findOne({ selector: { id } }).remove();
      successToast('Crew member deleted successfully');
      // Optionally, you might want to update the local state or refetch the crew data
    } catch (error) {
      errorToast('Error deleting crew member');
      console.error('Error deleting crew member:', error);
    }
  };

  // Group crew members by department
  const crewByDepartment = useMemo(() => {
    const departments: { [key: string]: CrewInterface[] } = {};
    crew.forEach((member: any) => {
      const department = member.depNameEng || 'No Department';
      if (!departments[department]) {
        departments[department] = [];
      }
      departments[department].push(member);
    });
    return departments;
  }, [crew]);

  // Sort departments alphabetically
  const sortedDepartments = useMemo(() => sortArrayAlphabeticaly(Object.keys(crewByDepartment)), [crewByDepartment]);

  // Set initial dropdown states
  useMemo(() => {
    const initialDropDownState: { [key: string]: boolean } = {};
    sortedDepartments.forEach((department) => {
      initialDropDownState[department] = true;
    });
    setIsDropDownOpen(initialDropDownState);
  }, [sortedDepartments]);

  // Filtered departments based on searchText
  const filteredDepartments = sortedDepartments.filter((department) => (
    crewByDepartment[department].some((member) => member.fullName.toLowerCase().includes(searchText.toLowerCase()))
      || department.toLowerCase().includes(searchText.toLowerCase())
  ));

  const unitsOptions: SelectOptionsInterface[] = units.map((unit) => ({
    value: unit.id,
    label: unit.unitName || 'NO NAME UNIT',
  }));

  const countryOptions: SelectOptionsInterface[] = countries.map((country) => ({
    value: country.id,
    label: `${country.prefix} (${country.code})`,
  }));

  // departments value = id, label = name

  const departmentsOptions: SelectOptionsInterface[] = Object.keys(crewByDepartment).map((department: any) => ({
    value: department,
    label: department,
  }));

  const crewFormInputs: FormInput[] = [
    {
      fieldKeyName: 'department',
      label: 'Department',
      type: 'text',
      required: true,
      placeholder: 'Enter department',
      selectOptions: departmentsOptions,
      col: '12',
    },
    {
      fieldKeyName: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter full name',
      col: '12',
    },
    {
      fieldKeyName: 'position',
      label: 'Job Title',
      type: 'text',
      required: true,
      placeholder: 'Enter position',
      col: '6',
    },
    {
      fieldKeyName: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email',
      col: '6',
    },
    {
      fieldKeyName: 'countryId',
      label: 'Country',
      type: 'select',
      required: true,
      selectOptions: countryOptions,
      placeholder: 'Select country',
      col: '3',
    },
    {
      fieldKeyName: 'phone',
      label: 'Phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone',
      col: '9',
    },
    {
      fieldKeyName: 'unitId',
      label: 'Unit',
      type: 'select',
      required: true,
      selectOptions: unitsOptions,
      placeholder: 'Select unit',
      col: '6',
    },
    {
      fieldKeyName: 'order',
      label: 'Order',
      type: 'number',
      required: true,
      placeholder: 'Enter order',
      col: '6',
    },
    {
      fieldKeyName: 'visibleOnCall',
      label: 'VISIBLE ON CALL',
      type: 'checkbox',
      required: false,
      placeholder: 'VISIBLE ON CALL',
    },
    {
      fieldKeyName: 'visibleOnHeader',
      label: 'CALL SHEET HEADER',
      type: 'checkbox',
      required: false,
      placeholder: 'CALL SHEET HEADER',
    },
    {
      fieldKeyName: 'onCall',
      label: 'ALWAYS ON CALL',
      type: 'checkbox',
      required: false,
      placeholder: 'ALWAYS ON CALL',
    },
    {
      fieldKeyName: 'dailyReportSignature',
      label: 'REPORT SIGNATURE',
      type: 'checkbox',
      required: false,
      placeholder: 'REPORT SIGNATURE',
    },
    {
      fieldKeyName: 'emergencyContact',
      label: 'EMERGENCY CONTACT',
      type: 'checkbox',
      required: false,
      placeholder: 'EMERGENCY CONTACT',
    },
  ];

  const getDefaultValuesById = (id: string | null): Partial<FormStructureInterface> => {
    if (!id) return {};
    const crewMember = crew.find((member) => member.id === id);
    console.log(crewMember);
    if (!crewMember) return {};
    return {
      fullName: crewMember.fullName,
      position: crewMember.positionEng || crewMember.positionEsp,
      email: crewMember.email,
      countryId: crewMember.countryId,
      phone: crewMember.phone,
      unitId: crewMember.unitId,
      order: crewMember.order.toString(),
      visibleOnCall: crewMember.visibleOnCall,
      visibleOnHeader: crewMember.visibleOnHeader,
      onCall: crewMember.onCall,
      dailyReportSignature: crewMember.dailyReportSignature,
      emergencyContact: crewMember.emergencyContact,
      department: crewMember.depNameEng || crewMember.depNameEsp,
    };
  };

  const AddEditCrewModal = () => (
    <EditionModal
      isOpen={addNewModalIsOpen}
      title={selectedCrewId ? 'Edit Crew Member' : 'Add Crew Member'}
      formInputs={crewFormInputs}
      handleEdition={handleUpsert}
      defaultFormValues={getDefaultValuesById(selectedCrewId)}
      setIsOpen={setAddNewModalIsOpen}
    />
  );

  const openModal = (id: string | null) => {
    setSelectedCrewId(id);
    setAddNewModalIsOpen(true);
  };

  const openModalButton = (): JSX.Element => (
    <IonButton
      fill="clear"
      slot="end"
      color="light"
      className="ion-no-padding toolbar-button"
      style={{
        display: permissionType !== 1 ? 'none' : 'flex',
      }}
      onClick={() => openModal(null)}
    >
      <IoMdAdd className="toolbar-icon" />
    </IonButton>
  );

  const handleBack = () => history.push('/my/projects');

  return (
    <MainPagesLayout
      search
      searchText={searchText}
      setSearchText={setSearchText}
      title="CREW"
      isLoading={isFetching}
      customButtons={[openModalButton]}
      permissionType={permissionType}
      handleBack={handleBack}
    >
      <IonContent color="tertiary">
        {filteredDepartments.length === 0 && !isFetching ? (
          <p style={
            {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '1.2rem',
            }
          }
          >
            NO CREW MEMBERS FOUND
          </p>
        ) : (
          filteredDepartments.map((department) => {
            const departmentMembers = crewByDepartment[department].filter((member) => member.fullName.toLowerCase().includes(searchText.toLowerCase())
              || department.toLowerCase().includes(searchText.toLowerCase()));

            if (departmentMembers.length === 0) return null;

            return (
              <div key={department}>
                <h3
                  onClick={() => setIsDropDownOpen((prev) => ({
                    ...prev,
                    [department]: !prev[department],
                  }))}
                  className="department-dropdown"
                >
                  {department}
                  {' '}
                  (
                  {departmentMembers.length}
                  )
                  <IonIcon
                    color={isDropDownOpen[department] ? 'primary' : 'light'}
                    icon={isDropDownOpen[department] ? caretUp : caretDown}
                  />
                </h3>
                {isDropDownOpen[department] && departmentMembers.map((member) => (
                  <CrewCard
                    key={member.id}
                    crew={member}
                    onEdit={openModal}
                    onDelete={handleDeleteCrew}
                    permissionType={permissionType}
                  />
                ))}
              </div>
            );
          })
        )}
      </IonContent>
      <AddEditCrewModal />
    </MainPagesLayout>
  );
};

export default Crew;
