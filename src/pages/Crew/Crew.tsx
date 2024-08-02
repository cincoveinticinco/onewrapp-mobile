// Crew.tsx
import React, { useState, useMemo } from 'react';
import { IonButton, IonContent, IonIcon } from '@ionic/react';
import { useRxData } from 'rxdb-hooks';
import CrewCard from '../../components/Crew/CrewCard/CrewCard';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import { Crew as CrewInterface } from '../../interfaces/crew.types';
import './Crew.scss';
import { caretDown, caretUp } from 'ionicons/icons';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import EditionModal, { FormInput, SelectOptionsInterface } from '../../components/Shared/EditionModal/EditionModal';
import { Unit } from '../../interfaces/unitTypes.types';
import { get } from 'lodash';
import AddButton from '../../components/Shared/AddButton/AddButton';
import { IoMdAdd } from 'react-icons/io';
import { Country } from '../../interfaces/country.types';

const Crew: React.FC = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');
  const [addNewModalIsOpen, setAddNewModalIsOpen] = useState(false);
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);

  // Fetch crew data using useRxData
  const { result: crew = [], isFetching } = useRxData(
    'crew',
    (collection) => collection.find()
  );

  const { result: units = [] }: {result: Unit[]} = useRxData(
    'units',
    (collection) => collection.find()
  );

  const { result: countries = [] }: {result: Country[]} = useRxData(
    'countries',
    (collection) => collection.find()
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
  const sortedDepartments = useMemo(() => {
    return sortArrayAlphabeticaly(Object.keys(crewByDepartment));
  }, [crewByDepartment]);

  // Set initial dropdown states
  useMemo(() => {
    const initialDropDownState: { [key: string]: boolean } = {};
    sortedDepartments.forEach((department) => {
      initialDropDownState[department] = true;
    });
    setIsDropDownOpen(initialDropDownState);
  }, [sortedDepartments]);

  // Filtered departments based on searchText
  const filteredDepartments = sortedDepartments.filter((department) => {
    return (
      crewByDepartment[department].some((member) =>
        member.fullName.toLowerCase().includes(searchText.toLowerCase())
      ) ||
      department.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const unitsOptions: SelectOptionsInterface[] = units.map((unit) => ({
    value: unit.id,
    label: unit.unitName,
  }));

  const countryOptions: SelectOptionsInterface[] = countries.map((country) => ({
    value: country.id,
    label: `${country.prefix} (${country.code})`,
  }));

  const crewFormInputs: FormInput[] = [
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
      fieldKeyName: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      selectOptions: countryOptions,
      placeholder: 'Select country',
      col: '4'
    },
    {
      fieldKeyName: 'phone',
      label: 'Phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone',
      col: '8',
    },
    {
      fieldKeyName: 'unitNumber',
      label: 'Unit',
      type: 'select',
      required: true,
      selectOptions: unitsOptions,
      placeholder: 'Select unit',
      col: '6'
    },
  ];

  const getDefaultValuesById = (id: string | null) => {
    if (!id) return {};
    const crewMember: any = crew.find((member: any) => member.id === id);
    if (!crewMember) return {};
    return {
      fullName: crewMember.fullName,
      email: crewMember.email,
      phone: crewMember.phone,
      unitNumber: crewMember.unitNumber
    };
  }

  const AddEditCrewModal = () => {
    return (
      <EditionModal
        isOpen={addNewModalIsOpen}
        title={selectedCrewId ? 'Edit Crew Member' : 'Add Crew Member'}
        formInputs={crewFormInputs}
        handleEdition={() => console.log('Add/Edit Crew')}
        defaultFormValues={getDefaultValuesById(selectedCrewId)}
        setIsOpen={setAddNewModalIsOpen}
      />
    )
  }

  const openModal = (id: string | null) => {
    setSelectedCrewId(id);
    setAddNewModalIsOpen(true);
  }

  const openModalButton = (): JSX.Element => {
    return (
      <IonButton
        fill="clear"
        slot="end"
        color="light"
        className="ion-no-padding toolbar-button"
        onClick={() => openModal(null)}
      >
        <IoMdAdd className="toolbar-icon" />
      </IonButton>
    )
  }

  return (
    <MainPagesLayout
      search
      searchText={searchText}
      setSearchText={setSearchText}
      title="CREW"
      isLoading={isFetching}
      customButtons={[openModalButton]}
    >
      <IonContent color='tertiary'>
        {filteredDepartments.length === 0 ? (
          <p style={
            {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '1.2rem'
            }
          }>NO CREW MEMBERS FOUND</p>
        ) : (
          filteredDepartments.map((department) => {
            const departmentMembers = crewByDepartment[department].filter((member) =>
              member.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
              department.toLowerCase().includes(searchText.toLowerCase())
            );

            if (departmentMembers.length === 0) return null;

            return (
              <div key={department}>
                <h3
                  onClick={() => setIsDropDownOpen((prev) => ({
                    ...prev,
                    [department]: !prev[department],
                  }))}
                  className='department-dropdown'
                >
                  {department} ({departmentMembers.length})
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
                    onDelete={() => console.log('Delete')}
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
