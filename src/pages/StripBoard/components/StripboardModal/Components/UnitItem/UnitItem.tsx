import { StripboardUnits } from "../../../../../../hooks/database/useStripboards/useStripboards";
import { Section, SectionTotal } from "../../../../../../Shared/Components/organizers/Section/Section";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import ScenesList from "../../../ScenesList/ScenesList";

interface UnitItemProps {
  unit: StripboardUnits;
  unitScenes: Record<string, SceneDocType[]>;
  updateUnitScenes: (unitId: number, scenes: SceneDocType[]) => void;
}

const INITIAL_LOAD_COUNT = 70;

const UnitItem: React.FC<UnitItemProps> = ({ unit, unitScenes, updateUnitScenes }) => {
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
      open={true}
      totals={getTotalsInUnits(unit)}
    >
      <ScenesList
        scenes={unitScenes[unit.unitId] || []}
        scenesToDisplay={INITIAL_LOAD_COUNT}
        setScenes={(scenes: SceneDocType[]) => updateUnitScenes(unit.unitId, scenes)}
        listId={`unit-${unit.unitId}`}
      />
    </Section>
  );
};

export default UnitItem;