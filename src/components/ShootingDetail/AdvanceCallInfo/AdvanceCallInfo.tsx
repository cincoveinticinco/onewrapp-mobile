import React from 'react';
import { IonButton } from '@ionic/react';
import { VscEdit } from 'react-icons/vsc';
import DeleteButton from '../../Shared/DeleteButton/DeleteButton';
import EditionModal from '../../Shared/EditionModal/EditionModal';
import { AdvanceCall } from '../../../interfaces/shooting.types';

interface AdvanceCallInfoProps {
  call: any;
  editMode: boolean;
  getHourMinutesFomISO: (iso: string) => string;
  deleteAdvanceCall: (call: any) => void;
  editionInputs: any
  handleEdition: any
}

const AdvanceCallInfo: React.FC<AdvanceCallInfoProps> = ({
  call, editMode, getHourMinutesFomISO, deleteAdvanceCall, editionInputs, handleEdition,
}) => {
  const editionModalRef = React.useRef<HTMLIonModalElement>(null);

  const formatDefaultValues = (call: AdvanceCall) => ({
    ...call,
    adv_call_time: getHourMinutesFomISO(call.adv_call_time),
  });

  const EditModal = () => (
    <EditionModal
      modalRef={editionModalRef}
      title="Add New Advance Call"
      formInputs={editionInputs}
      handleEdition={handleEdition}
      defaultFormValues={{ ...formatDefaultValues(call) }}
      modalId={`${'add-new-advance-call-modal' + '-'}${call.id}`}
    />
  );

  const openModal = () => {
    if (editionModalRef.current) {
      editionModalRef.current.present();
    }
  };
  return (
    <>
      <div className="ion-padding-start">
        <p className="ion-flex ion-align-items-center ion-justify-content-between">
          <b>
            {call.dep_name_eng && call.dep_name_eng.toUpperCase() || call.dep_name_esp && call.dep_name_esp.toUpperCase() || 'NO DEPARTMENT'}
            :
            {' '}
          </b>
          {
            editMode
            && (
            <div>
              <IonButton fill="clear" slot="end" color="light" className="toolbar-button" onClick={() => openModal()}>
                <VscEdit className="toolbar-icon" style={{ color: 'var(--ion-color-primary)' }} />
              </IonButton>
              <DeleteButton onClick={() => deleteAdvanceCall(call)} />
            </div>
            )
          }
        </p>
        <p>{getHourMinutesFomISO(call.adv_call_time)}</p>
      </div>
      <EditModal />
    </>
  );
};

export default AdvanceCallInfo;
