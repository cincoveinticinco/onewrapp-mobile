import { FC } from 'react';
import OutlinePrimaryButton from '../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';

interface NoRegistersProps {
  addNew: () => void;
  disabled?: boolean;
}

const NoRegisters: FC<NoRegistersProps> = ({ addNew }, disabled) => (
  <div
    className="empty-table"
  >
    <OutlinePrimaryButton
      buttonName="Add New"
      onClick={() => addNew()}
      className="center-absolute"
    />
  </div>
);

export default NoRegisters;
