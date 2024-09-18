import React from 'react';
import { PiTrashSimpleLight } from 'react-icons/pi';
import { VscEdit } from 'react-icons/vsc';
import { AdvanceCall } from '../../../interfaces/shooting.types';
import InputAlert from '../../../Layouts/InputAlert/InputAlert';
import EditionModal from '../../Shared/EditionModal/EditionModal';

interface AdvanceCallInfoProps {
  call: AdvanceCall;
  editMode: boolean;
  getHourMinutesFomISO: (iso: string, withAmPm?: boolean) => string;
  deleteAdvanceCall: (call: AdvanceCall) => void;
  editionInputs: any;
  handleEdition: any;
}

const AdvanceCallInfo: React.FC<AdvanceCallInfoProps> = ({
  call,
  editMode,
  getHourMinutesFomISO,
  deleteAdvanceCall,
  editionInputs,
  handleEdition,
}) => {
  const editionModalRef = React.useRef<HTMLIonModalElement>(null);
  const alertRef = React.useRef<any>(null);

  const formatDefaultValues = (call: AdvanceCall) => ({
    ...call,
    adv_call_time: getHourMinutesFomISO(call.adv_call_time),
  });

  const openEditModal = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };

  const openAlert = () => {
    alertRef.current?.present();
  };

  const departmentName = call.dep_name_eng?.toUpperCase() || call.dep_name_esp?.toUpperCase() || 'NO DEPARTMENT';

  return (
    <>
      <div className="ion-padding-start location-info-grid" style={{ width: '100%' }}>
        <InputAlert
          handleOk={() => deleteAdvanceCall(call)}
          header="Delete Advance Call"
          message={`Are you sure you want to delete the advance call for ${departmentName}?`}
          ref={alertRef}
          inputs={[]}
        />
        <h5 className="ion-flex ion-align-items-flex-start ion-justify-content-between">
          <b>{departmentName}</b>
        </h5>
        <div className="location-address">
          <p>{getHourMinutesFomISO(call.adv_call_time, true)}</p>
        </div>
        {editMode && (
          <div className="ion-flex-column location-buttons">
            <VscEdit className="edit-location" onClick={openEditModal} />
            <PiTrashSimpleLight className="delete-location" onClick={openAlert} />
          </div>
        )}
      </div>
      <EditionModal
        modalRef={editionModalRef}
        modalTrigger={`open-edit-advance-call-modal-${call.id}`}
        title="Edit Advance Call"
        formInputs={editionInputs}
        handleEdition={handleEdition}
        defaultFormValues={formatDefaultValues(call)}
        modalId={`edit-advance-call-modal-${call.id}`}
      />
    </>
  );
};

export default AdvanceCallInfo;
