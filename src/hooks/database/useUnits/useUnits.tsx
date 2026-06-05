import { useRxData } from 'rxdb-hooks';
import { UnitDocType } from '../../../Shared/types/unitTypes.types';
import { SelectOptionsInterface } from '../../../Shared/Components/modals/EditionModal/EditionModal';
import { useMemo } from 'react';
import { useParams } from 'react-router';

const useUnits = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { result: units, isFetching: isFetchingUnits } = useRxData<UnitDocType>(
    'units',
    (collection) => collection.find({
      selector: {
        projectId: Number(projectId),
      }
    }).sort({ unitNumber: 'asc'})
  );

  const getUnitOptions = (units: UnitDocType[]): SelectOptionsInterface[] => 
    units.map((unit) => ({
      label: `UNIT-${unit?.unitNumber}-${(unit?.unitName?.toUpperCase() || unit?.unitNumber)}`,
      value: unit.id,
    }));

  const unitOptions = useMemo(() => getUnitOptions(units as any), [units]);

  const findUnitById = (unitId: string): UnitDocType | undefined => 
    units.map((u: any) => u._data).find((u: UnitDocType) => u.id === unitId);

  return {
    units,
    isFetchingUnits,
    unitOptions,
    findUnitById
  };
};

export default useUnits;