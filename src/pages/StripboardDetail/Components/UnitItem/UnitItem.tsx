import { useState } from "react";
import { Section, SectionTotal } from "../../../../Shared/Components/organizers/Section/Section";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import { StripboardUnits } from "../../../../Shared/types/stripboard.types";
import ScenesList from "../ScenesList/ScenesList";
interface UnitItemProps {
  unit: StripboardUnits;
  unitScenes: SceneDocType[];
  dayNumber: number;
}

const INITIAL_LOAD_COUNT = 10;

const UnitItem: React.FC<UnitItemProps> = ({ unit, unitScenes, dayNumber}) => {
  const [unitIsOpen, setUnitIsOpen] = useState(dayNumber === 1);

  const getTotalsInUnits = (unit: StripboardUnits): SectionTotal[] => {
    return [
      {
        name: 'Scenes',
        value: unit.totalScenes
      },
      {
        name: 'Protection',
        value: unit.totalProtection
      },
      {
        name: 'Pages',
        value: unit.totalPages.split(' ')[0],
        symbol: unit.totalPages.split(' ')[1]
      },
      {
        name: 'Time',
        value: unit.totalMinutes.split(':')[0],
        symbol: unit.totalMinutes.split(':')[1]
      }
    ];
  };

  return (
    <Section
      key={`unit-${unit.unitNumber}`}
      title={`UNIT ${unit.unitNumber}`}
      open={unitIsOpen}
      setOpen={setUnitIsOpen}
      totals={getTotalsInUnits(unit)}
    >
      <ScenesList
        scenes={unitScenes || []}
        scenesToDisplay={INITIAL_LOAD_COUNT}
        listId={`unit-${unit.unitId}`}
        dayNumber={dayNumber}
        unitId={unit.unitId}
      />
    </Section>
  );
};

export default UnitItem;