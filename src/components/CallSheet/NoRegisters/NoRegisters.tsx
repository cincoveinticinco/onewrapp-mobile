import React, { FC } from 'react';
import OutlinePrimaryButton from '../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';

interface NoRegistersProps {
  addNew: () => void;
  disabled?: boolean;
}

const NoRegisters: FC<NoRegistersProps> = ({ addNew }, disabled) => (
  <div
    className="empty-table"
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <OutlinePrimaryButton buttonName="Add New" onClick={() => addNew()} className="" disabled={
      disabled
    } />
  </div>
);

export default NoRegisters;
