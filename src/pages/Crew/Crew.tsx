// Crew.tsx
import React, { useState, useMemo } from 'react';
import { IonContent, IonIcon } from '@ionic/react';
import { useRxData } from 'rxdb-hooks';
import CrewCard from '../../components/Crew/CrewCard/CrewCard';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import { Crew as CrewInterface } from '../../interfaces/crewTypes';
import './Crew.scss';
import { caretDown, caretUp } from 'ionicons/icons';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';
import useLoader from '../../hooks/Shared/useLoader';

const Crew: React.FC = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');

  // Fetch crew data using useRxData
  const { result: crew = [], isFetching } = useRxData(
    'crew',
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

  return (
    <MainPagesLayout
      search
      searchText={searchText}
      setSearchText={setSearchText}
      title="CREW"
      isLoading={isFetching}
    >
      <IonContent color='tertiary'>
        {isFetching ? (
          useLoader()
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
                    onEdit={() => console.log('Edit')}
                    onDelete={() => console.log('Delete')}
                  />
                ))}
              </div>
            );
          })
        )}
      </IonContent>
    </MainPagesLayout>
  );
};

export default Crew;
