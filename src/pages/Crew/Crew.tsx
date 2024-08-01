// Crew.tsx
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { IonContent, IonIcon } from '@ionic/react';
import DatabaseContext from '../../hooks/Shared/database';
import CrewCard from '../../components/Crew/CrewCard/CrewCard';
import sortArrayAlphabeticaly from '../../utils/sortArrayAlphabeticaly';
import { Crew as CrewInterface } from '../../interfaces/crewTypes';
import './Crew.scss';
import { caretDown, caretUp } from 'ionicons/icons';
import MainPagesLayout from '../../Layouts/MainPagesLayout/MainPagesLayout';

const Crew: React.FC = () => {
  const [crew, setCrew] = useState<CrewInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropDownOpen, setIsDropDownOpen] = useState<{ [key: string]: boolean }>({});
  const [searchText, setSearchText] = useState('');

  const { oneWrapDb } = useContext(DatabaseContext);

  const initializeCrew = async () => {
    try {
      const crew = await oneWrapDb?.crew.find().exec();
      const formattedCrew = crew?.map((c: any) => ({
        id: c._data.id,
        depNameEng: c._data.depNameEng,
        depNameEsp: c._data.depNameEsp,
        positionEsp: c._data.positionEsp,
        positionEng: c._data.positionEng,
        projectId: c._data.projectId,
        fullName: c._data.fullName,
        email: c._data.email,
        phone: c._data.phone,
        updatedAt: c._data.updatedAt,
        unitNumber: c._data.unitNumber,
        departmentId: c._data.departmentId,
      })) || [];
      setCrew(formattedCrew);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeCrew();
  }, []);

  const crewByDepartment = useMemo(() => {
    const departments: { [key: string]: CrewInterface[] } = {};
    crew.forEach(member => {
      const department = member.depNameEng || 'No Department';
      if (!departments[department]) {
        departments[department] = [];
      }
      departments[department].push(member);
    });
    return departments;
  }, [crew]);

  const sortedDepartments = useMemo(() => {
    return sortArrayAlphabeticaly(Object.keys(crewByDepartment));
  }, [crewByDepartment]);

  useEffect(() => {
    const initialDropDownState: { [key: string]: boolean } = {};
    sortedDepartments.forEach(department => {
      initialDropDownState[department] = true;
    });
    setIsDropDownOpen(initialDropDownState);
  }, [sortedDepartments]);

  return (
    <MainPagesLayout
      search
      searchText={searchText}
      setSearchText={setSearchText}
      title="CREW"
    >
      <IonContent color='tertiary'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          sortedDepartments.map(department => {
            const departmentMembers = crewByDepartment[department].filter(member => 
              member.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
              department.toLowerCase().includes(searchText.toLowerCase())
            );

            if (departmentMembers.length === 0) return null;

            return (
              <div key={department}>
                <h3
                  onClick={() => setIsDropDownOpen(prev => ({ ...prev, [department]: !prev[department] }))}
                  className='department-dropdown'
                >
                  {department} ({departmentMembers.length})
                  <IonIcon
                    color={isDropDownOpen[department] ? 'primary' : 'light'}
                    icon={isDropDownOpen[department] ? caretUp : caretDown} 
                  />
                </h3>
                {isDropDownOpen[department] && departmentMembers.map(member => (
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