import { IonButton } from '@ionic/react';
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { VscEdit, VscSave } from 'react-icons/vsc';
import { useParams } from 'react-router';
import { RxDocument } from 'rxdb';
import { useRxData } from 'rxdb-hooks';
import DatabaseContext from '../../../../context/Database.context';
import useErrorToast from '../../../../hooks/Shared/useErrorToast';
import useLoader from '../../../../hooks/Shared/useLoader';
import useSuccessToast from '../../../../hooks/Shared/useSuccessToast';
import { ServiceMatrices } from '../../../../interfaces/serviceMatrices.types';
import { Shooting } from '../../../../interfaces/shooting.types';
import DropDownButton from '../../../Shared/DropDownButton/DropDownButton';
import GeneralTable, { Column } from '../../../Shared/GeneralTable/GeneralTable';

interface ServiceDraft {
  id: string;
  serviceDescription: string;
  providerName: string;
  providerId: number;
  quantity: number | null;
  unitCost: number;
  totalCost: string | null;
  observations: string | null;
  tax: number | null;
  retention: number | null;
  aiuUtility: number | null;
  aiuPercent: number | null;
  aiuValue: number | null;
  files: number;
}

const ProductionReportView: React.FC = () => {
  const { shootingId } = useParams<{ shootingId: string }>();
  const { oneWrapDb } = useContext(DatabaseContext);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [groupedServices, setGroupedServices] = useState<{ [key: string]: { prServiceTypeName: string, services: ServiceDraft[] } }>({});

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const { result: serviceMatrices, isFetching }: {
    result: ServiceMatrices[];
    isFetching: boolean;
  } = useRxData(
    'service_matrices',
    (collection) => collection.find(),
  );

  const { result: [shooting], isFetching: isShootingFetching }: {
    result: RxDocument<Shooting>[];
    isFetching: boolean;
  } = useRxData(
    'shootings',
    (collection) => collection.find({
      selector: {
        id: {
          $eq: shootingId,
        },
      },
    }),
  );

  // LAS MATRICES SON SOLO BORRADORES DE SERVICIOS, NO SON SERVICIOS EN SI
  // CUANDO SE CREA UNA MATRIZ EN LA APLICACIÓN WEB, ESTA MATRIZ PUEDE SER UTILIZADA PARA CREAR UN SERVICIO Y SUS VALORES SE IRÁN COMO PLANTILLA PARA CREAR EL SERVICIO
  // LA IDEA DE ESTE COMPONENTE ES QUE SE MUESTREN LOS SERVICIOS PRECREADOS CON ALGUNOS DATOS VACIOS PARA EL SHOOTING EN CUESTIÓN, POR LO QUE ALGUNOS DATOS ESTARÁN VACÍOS
  // NO SIRVE DE NADA GUARDAR UN SERVICIO VACIO, POR LO QUE LA LÓGICA DE SERVICIOS VACIÓS SOLO SE CREA DESDE EL FRONTEND
  // SI ALGUNO DE LOS SERVICIOS VACÍOS SE GUARDA CON DATOS EN RXDB, SOLO EN ESE CASO, SE DEBERÍA GUARDAR EN EL BACKEND

  // TAMBIEN EXISTE LA POSIBILIDAD DE QUE YA HAYA CREADO UN SERVICIO A PARTIR DE UNA MATRIZ, POR LO QUE NO SE DEBERÍA CREAR UN SERVICIO VACÍO
  // LA FORMA EN LA QUE ESTAMOS ASOCIANDO LAS MATRICES CON LOS SERVICIOS ES QUE SI, AL CREAR UN SERVICIO VACIO A PARTIR DE UNA MATRIZ SE ENCUENTRA UN SERVICIO CREADO CON LA MISMA DESCRIPCIÓN Y EL MISMO PROVEEDOR QUIERE DECIR QUE YA SE CREÓ UN SERVICIO ANTES A PARTIR DE ESA MATRIZ Y QUE TIENE DATOS QUE SON RELEVANTES, POR LO QUE NO ES NECESARIO CREAR UNO VACÍO

  const getServiceDraftFromMatrix = (matrix: any): ServiceDraft => {
    const service = shooting?.services?.find((service: any) => service.description === matrix.serviceDescription);
    const totalCost = parseInt(service?.unitCost ?? '') * parseInt(service?.quantity ?? '');
    const totalCostAsCurrency = totalCost && totalCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

    return {
      id: matrix.id,
      serviceDescription: matrix.serviceDescription,
      providerName: matrix.providerName,
      providerId: matrix.providerId,
      quantity: parseInt(service?.quantity ?? '') || null,
      unitCost: matrix.serviceUnitCost,
      totalCost: totalCostAsCurrency || null,
      observations: service?.observations || null,
      tax: null,
      retention: null,
      aiuUtility: null,
      aiuPercent: null,
      aiuValue: null,
      files: 0,
    };
  };

  const groupedServiceDrafts = useMemo(() => serviceMatrices.reduce((acc: any, matrix) => {
    const key: any = matrix.prServiceTypeId;
    if (!acc[key]) {
      acc[key] = {
        prServiceTypeName: matrix.prServiceTypeName,
        totalSection: 0,
        services: [],
      };
    }
    const serviceDraft = getServiceDraftFromMatrix(matrix);
    acc[key].services.push(serviceDraft);

    // Calculate totalSection
    acc[key].totalSection = acc[key].services.reduce((total: number, service: ServiceDraft) => {
      const serviceTotalCost = service.quantity && service.unitCost
        ? service.quantity * service.unitCost
        : 0;
      return total + serviceTotalCost;
    }, 0);

    return acc;
  }, {} as { [key: string]: { prServiceTypeName: string, totalSection: number, services: ServiceDraft[] } }), [serviceMatrices, shooting]);

  useEffect(() => {
    setGroupedServices(groupedServiceDrafts);

    const initialSections = Object.keys(groupedServiceDrafts).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    const initialEditModes = Object.keys(groupedServiceDrafts).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as { [key: string]: boolean });

    setOpenSections(initialSections);
    setEditModes(initialEditModes);
  }, [groupedServiceDrafts]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleEditMode = (id: string) => {
    setEditModes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const saveSection = async (id: string) => {
    try {
      // GET THE SERVICES FROM THE GROUPED SERVICES
      const shootingInstance: any = await oneWrapDb?.shootings.findOne(shootingId).exec().then((doc: any) => doc._data);
      const { services } = groupedServices[id];

      const shootingCopy: any = {
        ...shootingInstance,
        updatedAt: new Date().toISOString(),
      };

      // Create a new array with the updated services
      const updatedServices = services.map((service: ServiceDraft) => {
        const existingService = shootingInstance.services.find(
          (s: any) => s.description === service.serviceDescription
            && s.providerName === service.providerName,
        );

        if (existingService) {
          if (service.quantity !== null && service.unitCost !== null) {
            return {
              ...existingService,
              quantity: service.quantity.toString(),
              unitCost: service.unitCost.toString(),
              observations: service.observations || '',
            };
          }
        } else {
          if (service.quantity !== null && service.unitCost !== null) {
            return {
              description: service.serviceDescription,
              providerName: service.providerName,
              providerId: service.providerId,
              prServiceTypeId: parseInt(id),
              quantity: service.quantity.toString(),
              unitCost: service.unitCost.toString(),
              tax: null,
              retention: null,
              aiuUtility: null,
              aiuPercent: null,
              aiuValue: null,
              totalCost: null,
              files: 0,
              observations: service.observations || '',
            };
          }
          return null;
        }
      }).filter(Boolean);

      const filteredServices = shootingCopy.services.filter((service: any) => service.prServiceTypeId !== parseInt(id));
      shootingCopy.services = [...filteredServices, ...updatedServices];

      // Serialize and deserialize the object before saving
      const shootingCopyJson = JSON.stringify(shootingCopy);
      const shootingCopyDeserialized = JSON.parse(shootingCopyJson);
      await oneWrapDb?.shootings.upsert(shootingCopyDeserialized);

      setEditModes((prev) => ({
        ...prev,
        [id]: false,
      }));

      successToast('Section saved successfully');
    } catch (error) {
      errorToast('Error saving section');

      throw error;
    } finally {
      toggleEditMode(id);
    }
  };

  const serviceTableColumns: Column[] = [
    {
      key: 'serviceDescription',
      title: 'Description',
      type: 'text',
      sticky: true,
    },
    {
      key: 'providerName',
      title: 'Provider',
      type: 'text',
    },
    {
      key: 'quantity',
      title: 'Quantity',
      type: 'number',
      editable: true,
    },
    {
      key: 'unitCost',
      title: 'Unit Cost',
      type: 'currency',
      editable: true,
    },
    {
      key: 'totalCost',
      title: 'Total Cost',
      type: 'number',
    },
    {
      key: 'observations',
      title: 'Observations',
      type: 'text',
      editable: true,
    },
  ];

  if (isFetching || isShootingFetching) {
    return useLoader();
  }

  const editService = (groupIndex: keyof ServiceDraft, rowIndex: number, rowKey: keyof any, rowValue: any, type: any) => {
    const copy = { ...groupedServiceDrafts };
    copy[groupIndex].services[rowIndex][rowKey] = rowValue;
    setGroupedServices(copy);
  };

  const renderEditSaveButton = (prServiceTypeId: string) => (
    editModes[prServiceTypeId] ? (
      <IonButton
        fill="clear"
        slot="end"
        color="light"
        className="toolbar-button"
        onClick={() => saveSection(prServiceTypeId)}
      >
        <VscSave
          className="toolbar-icon"
          style={{ color: 'var(--ion-color-primary)' }}
        />
      </IonButton>
    ) : (
      <IonButton
        fill="clear"
        slot="end"
        color="light"
        className="toolbar-button"
        onClick={() => toggleEditMode(prServiceTypeId)}
      >
        <VscEdit
          className="toolbar-icon"
          style={{ color: 'var(--ion-color-light)' }}
        />
      </IonButton>
    )
  );

  if (isFetching || isShootingFetching) {
    return useLoader();
  }

  return (
    <>
      {Object.entries(groupedServices).map(([prServiceTypeId, group]: any) => (
        <React.Fragment key={prServiceTypeId}>
          <div
            className="ion-flex ion-justify-content-between ion-padding-start"
            style={{
              border: '1px solid black',
              backgroundColor: 'var(--ion-color-tertiary-shade)',
            }}
            onClick={() => toggleSection(prServiceTypeId)}
          >
            <p style={{ fontSize: '18px' }}><b>{group.prServiceTypeName.toUpperCase()}</b></p>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
              }}
            >
              <div
                className="total-label"
                style={
                  {
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 10px',
                    height: '100%',
                  }
                }
              >
                <p
                  className="ion-no-margin"
                  style={{ paddingBottom: '5px' }}
                >
                  {group.totalSection.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </p>
                <small><b>TOTAL COST</b></small>
              </div>
              {renderEditSaveButton(prServiceTypeId)}
              <DropDownButton open={openSections[prServiceTypeId]} />
            </div>
          </div>
          {openSections[prServiceTypeId] && (
            <GeneralTable
              columns={serviceTableColumns}
              data={group.services}
              editFunction={(rowIndex, rowKey, rowValue, type) => editService(prServiceTypeId, rowIndex, rowKey, rowValue, type)}
              editMode={editModes[prServiceTypeId] || false}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ProductionReportView;
