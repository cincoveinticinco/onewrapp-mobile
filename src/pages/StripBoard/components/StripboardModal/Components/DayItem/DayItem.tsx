import React from 'react';
import { StripboardWeekDays } from '../../../../../../hooks/database/useStripboards/useStripboards';
import { SceneDocType } from '../../../../../../Shared/types/scenes.types';
import { Section, SectionTotal } from '../../../../../../Shared/Components/organizers/Section/Section';
import UnitItem from '../UnitItem/UnitItem';

interface DayItemProps {
  day: StripboardWeekDays;
  unitScenes: Record<string, SceneDocType[]>;
  updateUnitScenes: (unitId: number, scenes: SceneDocType[]) => void;
}

const DayItem: React.FC<DayItemProps> = ({ day, unitScenes, updateUnitScenes }) => {
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
          unitScenes={unitScenes} 
          updateUnitScenes={updateUnitScenes} 
        />
      ))}
    </Section>
  );
};

export default DayItem;