import { useParams } from "react-router";
import useWebWorker from "../../../../hooks/useWebWorker/useWebWorker";
import useAppStore from "../../../../stores/useAppStore";
import { useContext, useEffect, useState } from "react";
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonModal, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";
import DeleteButton from "../../../../Shared/Components/DeleteButton/DeleteButton";
import { arrowDownCircleOutline, downloadOutline, openOutline } from "ionicons/icons";
import ExportModal from "../ExportModal/ExportModal";
import DatabaseContext from "../../../../context/Database/Database.context";
import './ExportButton.scss';

const ExportButton: React.FC = () => {
  const { projectId } = useContext(DatabaseContext)
  const [workerParams, setWorkerParams] = useState<any>({
    groupBy: null,
    filterBy: null,
    filterIds: '',
    filterNames: [],
    lang: 'eng',
    projectId: projectId?.toString() || ''
  });
  const { loading, startWorker } = useWebWorker({
    initialParams: workerParams
  });

  const handleSubmit = (values: any) => {
    const updatedParams = {
      ...workerParams,
      projectId: projectId?.toString() || '',
      groupBy: values?.groupBy,
      filterBy: values?.filterBy,
      filterIds: values?.filterIds?.join(',') || '',
      filterNames: values?.filterNames || [],
    };
    setWorkerParams(updatedParams);
    startWorker(updatedParams);
  }

  const { qeueReportsOW, removeReportFromQeue } = useAppStore();
  
  const [reports, setReports] = useState<any[]>(qeueReportsOW);
  const [showReports, setShowReports] = useState<boolean>(false);
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);


  useEffect(() => {
    setReports(qeueReportsOW);
  }, [qeueReportsOW]);

  return (
    <>
      <IonButton
        fill="clear"
        color={reports.length > 0 ? 'success' : 'light'}
        className="ion-no-padding reset-filters-option ion-margin-end"
        onClick={reports.length > 0 ? () => setShowReports(!showReports) : () => setOpenExportModal(true)}
        disabled={loading}
        slot="end"
      >
        {loading ? (
          <IonSpinner name="circular" color='success' />
        ) : (
          <IonIcon slot="icon-only" icon={arrowDownCircleOutline} />
        )}
      </IonButton>
      <IonModal isOpen={showReports} onDidDismiss={() => setShowReports(false)} color='tertiary' className="general-modal-styles">
        <IonContent color='tertiary' className='ion-padding'>
          <IonHeader className="add-new-option-description" mode="ios" />
          <IonButton fill="clear" onClick={() => setShowReports(false)}>
            BACK
          </IonButton>
          <div className="reports-list">
            <h1 className="ion-padding reports-title">REPORTS</h1>
            {reports.map((report) => (
              <div key={report.jobId} className="report-item ion-flex ion-justify-content-between ion-padding-start" onClick={() => window.open(report.url, '_blank')} color='tertiary'>
                <p>{report.jobName?.toUpperCase()}</p>
                <div slot="end" className="ion-flex ion-align-items-center">
                  <IonButton  slot='end' fill="clear" color="primary" onClick={() => window.open(report.url, '_blank')} className="ion-no-padding">
                    <IonIcon icon={openOutline} /> 
                  </IonButton>
                  <DeleteButton 
                    slot='end'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeReportFromQeue(reports[0].jobId);
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="report-item ion-flex ion-justify-content-between report-item ion-padding-start" color='tertiary' style={reports.length > 0 ? {borderTop: 'none'} : undefined}>
              <p>EXPORT NEW</p>
              <IonButton
                fill="clear"
                color="light"
                onClick={() => setOpenExportModal(true)}
              >
                <IonIcon icon={arrowDownCircleOutline} />
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
      <ExportModal modalIsOpen={openExportModal} setModaIsOpen={setOpenExportModal} handleSubmit={(values) => handleSubmit(values)} />
    </>
  );
};

export default ExportButton;