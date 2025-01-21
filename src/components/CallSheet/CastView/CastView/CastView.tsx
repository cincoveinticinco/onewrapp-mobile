import { normalizeString } from 'rxdb';
import GeneralTable from '../../../Shared/GeneralTable/GeneralTable';
import NoRegisters from '../../NoRegisters/NoRegisters';
import { castColumns } from './tables/cast.columns';
import { sortCast } from './utils/Cast.utils';
import AddCastCallModal from './modals/AddCastCallModal';
import { CastViewProps } from './types/Cast.types';
import { useEffect } from 'react';
import { pipe } from 'rxjs';

const CastView: React.FC<CastViewProps> = ({
  castData,
  addNewModalIsOpen,
  setIsOpen,
  editMode,
  addNewCastCall,
  castOptions,
  editCastCall,
  permissionType,
  searchText
}) => {

  const groupCastByTalent = (cast: any[]) => {

    const deepCopy = JSON.parse(JSON.stringify(cast));

    interface CastItem {
      name: string;
      cast: string;
    }

    const castGrouped = deepCopy.reduce((acc: CastItem[], castItem: CastItem) => {
      const talentName = castItem.name;
      const talentIndex = acc.findIndex((talent: CastItem) => talent.name === talentName);
      if (talentIndex === -1) {
      acc.push(castItem);
      } else {
      acc[talentIndex].cast = `${acc[talentIndex].cast}, ${castItem.cast}`;
      }
      return acc;
    }, [] as CastItem[])

    return castGrouped;
  }

  const validateCastExists:  (talentName: string, fieldKeyName: any) => boolean | string = (talentName: string, fieldKeyName: any) => {
    const talentExists = castData.some((talent) => normalizeString(talent.name) === normalizeString(talentName));
    if (talentExists && fieldKeyName === 'cast') return 'This talent already exists';
    return false;
  };

  if (addNewModalIsOpen) return <AddCastCallModal {
    ...{
      addNewModalIsOpen,
      setIsOpen,
      addNewCastCall,
      castOptions,
      validateCastExists
    }
  } />;

  if (!castData || castData.length === 0) {
    return <NoRegisters addNew={() => setIsOpen(true)} disabled={permissionType !== 1} />;
  }
  
  return (
    <>
      <GeneralTable
        columns={castColumns}
        data={pipe(
          sortCast,
          groupCastByTalent
        )(castData)}
        stickyColumnCount={1}
        editMode={editMode}
        editFunction={editCastCall}
        groupBy='category'
        searchText={searchText}
      />
    </>
  );
};

export default CastView;
