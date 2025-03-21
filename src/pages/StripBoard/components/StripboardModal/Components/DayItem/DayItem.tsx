import React from 'react';
import { Section, SectionTotal } from '../../../../../../Shared/Components/organizers/Section/Section';
import UnitItem from '../UnitItem/UnitItem';
import { StripboardWeekDays } from '../../../../../../Shared/types/stripboard.types';
import { SceneDocType } from '../../../../../../Shared/types/scenes.types';

interface DayItemProps {
  day: StripboardWeekDays;
  updateStripboardHasScenes: (scenes: SceneDocType[], dayNumber: number, unitId: number) => void
}

const DayItem: React.FC<DayItemProps> = ({ day, updateStripboardHasScenes }) => {
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
      open={true}
      totals={getTotalsInDays(day)}
    >
      {day.units.map((unit, unitIndex) => (
        <UnitItem
          key={`unit-${unit.unitNumber}-${unitIndex}`} 
          unit={unit} 
          unitScenes={unit.scenes}
          dayNumber={day.dayNumber}
          updateStripboardHasScenes={updateStripboardHasScenes}
        />
      ))}
    </Section>
  );
};

export default DayItem;