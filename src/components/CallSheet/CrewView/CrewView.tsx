import React from 'react';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable'; 
import NoRegisters from '../NoRegisters/NoRegisters';

interface CrewCall {
  id: string;
  visible: boolean | null;
  unit: string | null;
  name: string | null;
  department: string | null;
  position: string | null;
  call: string | null;
  callPlace: string | null;
  wrap: string | null;
  onCall: boolean | null;
}

interface CrewViewProps {
  crewCalls: CrewCall[];
  editMode: boolean;
}

const CrewView: React.FC<CrewViewProps> = ({ crewCalls, editMode }) => {
  const columns: Column[] = [
    { key: 'name', title: 'Name', type: 'text', textAlign: 'left' },
    { key: 'visible', title: 'Visible', type: 'text' },
    { key: 'unit', title: 'Unit', type: 'text' },
    { key: 'departmentEng', title: 'Department', type: 'text' },
    { key: 'position', title: 'Position', type: 'text' },
    { key: 'call', title: 'Call', type: 'hour' },
    { key: 'callPlace', title: 'Call Place', type: 'text' },
    { key: 'wrap', title: 'Wrap', type: 'hour' },
    { key: 'onCall', title: 'On Call', type: 'text' },
  ];

  const formattedData = crewCalls.map(crew => ({
    ...crew,
    visible: crew.visible ? 'YES' : 'NO',
    onCall: crew.onCall ? 'YES' : 'NO',
  }));

  if(!crewCalls.length) return <NoRegisters addNew={() => {}} />;

  return (
    <GeneralTable
      columns={columns}
      data={formattedData}
      stickyColumnCount={1}
      editMode={editMode}
    />
  );
};

export default CrewView;