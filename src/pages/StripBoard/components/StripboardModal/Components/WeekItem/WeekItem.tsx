import { StripboardWeeks } from "../../../../../../hooks/database/useStripboards/useStripboards";
import { Section, SectionTotal } from "../../../../../../Shared/Components/organizers/Section/Section";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import DayItem from "../DayItem/DayItem";


interface WeekItemProps {
  week: StripboardWeeks;
  unitScenes: Record<string, SceneDocType[]>;
  updateUnitScenes: (unitId: number, scenes: SceneDocType[]) => void;
}

const WeekItem: React.FC<WeekItemProps> = ({ week, unitScenes, updateUnitScenes }) => {
  const getTotalsInWeeks = (week: StripboardWeeks): SectionTotal[] => {
    return [
      {
        name: 'Scenes',
        value: week.totalScenes
      },
      {
        name: 'Protection',
        value: week.totalProtection
      },
      {
        name: 'Pages',
        value: week.totalPages.split(' ')[0],
        symbol: week.totalPages.split(' ')[1]
      },
      {
        name: 'Time',
        value: week.totalMinutes.split(':')[0],
        symbol: week.totalMinutes.split(':')[1]
      },
      {
        name: 'Units',
        value: week.totalUnits
      },
      {
        name: 'Days',
        value: week.totalDays
      }
    ];
  };

  return (
    <Section
      key={`week-${week.weekNumber}`} 
      title={`WEEK ${week.weekNumber} FROM ${week.weekStartDate} TO ${week.weekEndDate}`} 
      open={true}
      totals={getTotalsInWeeks(week)}
    >
      <>
        {week.days.map((day, dayIndex) => (
          <DayItem 
            key={`day-${day.dayNumber}-${dayIndex}`} 
            day={day} 
            unitScenes={unitScenes} 
            updateUnitScenes={updateUnitScenes} 
          />
        ))}
      </>
    </Section>
  );
};

export default WeekItem;