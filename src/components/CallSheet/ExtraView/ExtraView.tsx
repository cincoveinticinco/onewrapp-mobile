import React from 'react';
import GeneralTable, { Column } from '../../Shared/GeneralTable/GeneralTable';
import { ExtraCall } from '../../../interfaces/shootingTypes';

const columns: Column[] = [
  { key: 'extraName', title: 'Extra', textAlign: 'left' },
  { key: 'talentAgency', title: 'Talent/Agency' },
  { key: 'quantity', title: 'Quantity' },
  { key: 'callTime', title: 'Call', type: 'hour' },
  { key: 'onMakeUp', title: 'Makeup', type: 'hour' },
  { key: 'onWardrobe', title: 'Wardrobe', type: 'hour' },
  { key: 'readyToShoot', title: 'Ready', type: 'hour' },
  { key: 'arrived', title: 'Arrived', type: 'hour' },
  { key: 'wrap', title: 'Wrap', type: 'hour' },
  { key: 'notes', title: 'Notes' }
];

const ExtraView: React.FC<{ extraViewData: ExtraCall[], editMode: boolean }> = ({ extraViewData, editMode }) => {
  return (
    <GeneralTable columns={columns} data={extraViewData} editMode={editMode} />
  );
};

export default ExtraView;
