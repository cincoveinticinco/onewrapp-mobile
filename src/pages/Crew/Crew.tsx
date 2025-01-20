// Crew.tsx
import { IonButton, IonContent, IonIcon } from '@ionic/react';
import { caretDown, caretUp } from 'ionicons/icons';
import React, { useMemo, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useHistory, useParams } from 'react-router';
import { useRxData } from 'rxdb-hooks';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import CrewCard from '../../components/Crew/CrewCard/CrewCard';
import EditionModal, { SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import { Country } from '../../interfaces/country.types';
import { Crew as CrewInterface } from '../../interfaces/crew.types';
import { Unit } from '../../interfaces/unitTypes.types';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import './Crew.scss';
import { crewFormInputs } from './inputs/crewForm.inputs';
import useCrewOperations from './hooks/useCrewOperations';
import { FormStructureInterface } from './types/crew.interfaces';

const Crew: React.FC<{permissionType?: number | null}> = ({ permissionType }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');
  const [addNewModalIsOpen, setAddNewModalIsOpen] = useState(false);
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);
  const projectId = useParams<{ id: string }>().id;
  const {handleDeleteCrew, handleUpsert} = useCrewOperations({selectedCrewId, setSelectedCrewId, setAddNewModalIsOpen, id: projectId});
  const history = useHistory();

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

  const getDefaultValuesById = (id: string | null): Partial<FormStructureInterface> => {
    if (!id) return {};
    const crewMember = crew.find((member) => member.id === id);
    if (!crewMember) return {};
    return {
      fullName: crewMember.fullName,
      position: crewMember.positionEng || crewMember.positionEsp,
      email: crewMember.email,
      countryId: crewMember.countryId,
      phone: crewMember.phone,
      unitIds: crewMember.unitIds.split(','),
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
      formInputs={crewFormInputs(departmentsOptions, countryOptions, unitsOptions)}
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
