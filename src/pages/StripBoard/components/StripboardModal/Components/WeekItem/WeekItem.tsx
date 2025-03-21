import { memo, useCallback } from "react";
import { Section, SectionTotal } from "../../../../../../Shared/Components/organizers/Section/Section";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import { StripboardWeeks } from "../../../../../../Shared/types/stripboard.types";
import DayItem from "../DayItem/DayItem";


interface WeekItemProps {
  week: StripboardWeeks;
  updateStripboardHasScenes: (scenes: SceneDocType[], dayNumber: number, unitId: number) => void
}

const WeekItem: React.FC<WeekItemProps> = memo(({ week, updateStripboardHasScenes }) => {
  const handleUpdateScenes = useCallback(
    (scenes: SceneDocType[], dayNumber: number, unitId: number) => {
      updateStripboardHasScenes(scenes, dayNumber, unitId);
    },
    [updateStripboardHasScenes] // Se mantiene la misma referencia
  );

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
  }

  return (
    <Section
      key={`week-${week.weekNumber}`} 
      title={`WEEK ${week.weekNumber} FROM ${week.weekStartDate} TO ${week.weekEndDate}`} 
      open={true}
      totals={getTotalsInWeeks(week)}
    >
      {week.days.map((day) => (
        <DayItem key={day.dayNumber} day={day} updateStripboardHasScenes={handleUpdateScenes} />
      ))}
    </Section>
  );
});

export default WeekItem;