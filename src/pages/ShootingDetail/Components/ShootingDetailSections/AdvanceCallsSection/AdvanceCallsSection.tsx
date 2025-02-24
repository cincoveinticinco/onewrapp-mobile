import OutlinePrimaryButton from '../../../../../Shared/Components/OutlinePrimaryButton/OutlinePrimaryButton';
import { Section } from '../../../../../Shared/Components/Section/Section';
import AdvanceCallInfo from '../../AdvanceCallInfo/AdvanceCallInfo';

interface AdvanceCallsSectionProps {
  advanceCalls: any[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: any;
  getHourMinutesFomISO: (isoString: string) => string;
  deleteAdvanceCall: (call: any) => void;
  advanceCallInputs: any;
  handleEditAdvanceCall: (call: any) => void;
  permissionType?: number | null;
}

export const AdvanceCallsSection: React.FC<AdvanceCallsSectionProps> = ({
  advanceCalls,
  open,
  setOpen,
  editMode,
  onAddClick,
  getHourMinutesFomISO,
  deleteAdvanceCall,
  advanceCallInputs,
  handleEditAdvanceCall,
  permissionType,
}) => 
{
  return (
    <Section
      title="Advance Calls"
      open={open}
      setOpen={setOpen}
      editMode={editMode}
      onAddClick={onAddClick}
      permissionType={permissionType}
    >
      {advanceCalls.length > 0 ? (
        advanceCalls.map((call) => (
          <AdvanceCallInfo
            key={call.id}
            call={call}
            editMode={editMode}
            getHourMinutesFomISO={getHourMinutesFomISO}
            deleteAdvanceCall={deleteAdvanceCall}
            editionInputs={advanceCallInputs}
            handleEdition={handleEditAdvanceCall}
          />
        ))
      ) : (
        <div className="ion-padding-start ion-flex ion-align-items-center ion-justify-content-center" style={{ height: '100%', width: '100%' }}>
          <OutlinePrimaryButton buttonName="ADD" onClick={onAddClick} disabled={permissionType !== 1} />
        </div>
      )}
    </Section>
  );
}
