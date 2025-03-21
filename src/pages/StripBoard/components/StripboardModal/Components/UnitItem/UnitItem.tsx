import { Section, SectionTotal } from "../../../../../../Shared/Components/organizers/Section/Section";
import { SceneDocType } from "../../../../../../Shared/types/scenes.types";
import { StripboardUnits } from "../../../../../../Shared/types/stripboard.types";
import ScenesList from "../../../ScenesList/ScenesList";
interface UnitItemProps {
  unit: StripboardUnits;
  unitScenes: SceneDocType[];
  dayNumber: number;
  updateStripboardHasScenes: (scenes: SceneDocType[], dayNumber: number, unitId: number) => void;
}

const INITIAL_LOAD_COUNT = 10;

const UnitItem: React.FC<UnitItemProps> = ({ unit, unitScenes, dayNumber, updateStripboardHasScenes}) => {

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
        scenes={unitScenes || []}
        scenesToDisplay={INITIAL_LOAD_COUNT}
        setScenes={(scenes: SceneDocType[]) => updateStripboardHasScenes(scenes, dayNumber, unit.unitId)}
        listId={`unit-${unit.unitId}`}
      />
    </Section>
  );
};

export default UnitItem;