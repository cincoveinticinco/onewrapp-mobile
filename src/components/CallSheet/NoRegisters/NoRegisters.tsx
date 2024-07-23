import React, { FC } from 'react';
import OutlinePrimaryButton from '../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';

interface NoRegistersProps {
  addNew: () => void;
}

const NoRegisters: FC<NoRegistersProps> = ({ addNew }) => {
  return (
    <div className="empty-table" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <OutlinePrimaryButton buttonName='Add New' onClick={() => addNew()} className=''/>
    </div>
  );
}

export default NoRegisters;