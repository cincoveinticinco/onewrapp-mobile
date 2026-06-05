import React from 'react';
import { Section, SectionTotal } from '../../../../Shared/Components/organizers/Section/Section';
import UnitItem from '../UnitItem/UnitItem';
import { StripboardWeekDays } from '../../../../Shared/types/stripboard.types';
import { SceneDocType } from '../../../../Shared/types/scenes.types';

interface DayItemProps {
  day: StripboardWeekDays;
}

const DayItem: React.FC<DayItemProps> = ({ day,}) => {
  const [dayIsOpen, setDayIsOpen] = React.useState(true);

  const getTotalsInDays = (day: StripboardWeekDays): SectionTotal[] => {
    return [
      {
        name: 'Scenes',
        value: day.totalScenes
      },
      {
        name: 'Protection',
        value: day.totalProtection
      },
      {
        name: 'Pages',
        value: day.totalPages.split(' ')[0],
        symbol: day.totalPages.split(' ')[1]
      },
      {
        name: 'Time',
        value: day.totalMinutes.split(':')[0],
        symbol: day.totalMinutes.split(':')[1]
      }
    ];
  };

  return (
    <Section
      key={`day-${day.dayNumber}`} 
      title={`DAY ${day.dayNumber}`} 
      open={dayIsOpen}
      totals={getTotalsInDays(day)}
      setOpen={setDayIsOpen}
    >
      {day.units.map((unit, unitIndex) => (
        <UnitItem
          key={`unit-${unit.unitNumber}-${unitIndex}`} 
          unit={unit} 
          unitScenes={unit.scenes}
          dayNumber={day.dayNumber}
        />
      ))}
    </Section>
  );
};

export default DayItem;