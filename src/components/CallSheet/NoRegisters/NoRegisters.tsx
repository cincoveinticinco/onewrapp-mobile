import { FC } from 'react';
import OutlinePrimaryButton from '../../Shared/OutlinePrimaryButton/OutlinePrimaryButton';

interface NoRegistersProps {
  addNew: () => void;
  disabled?: boolean;
  name?: string;
}

const NoRegisters: FC<NoRegistersProps> = ({ addNew, name = "Add New" }, disabled) => (
  <div
    className="empty-table"
  >
    <OutlinePrimaryButton
      buttonName={name}
      onClick={() => addNew()}
      className="center-absolute"
    />
  </div>
);

export default NoRegisters;
