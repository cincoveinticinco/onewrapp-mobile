import environment from '../../../environment';
import DatabaseSchema from '../database_schema';

const serviceMatricesSchema = {
  title: 'service matrices schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    projectId: {
      type: 'number',
    },
    currencyId: {
      type: ['number', 'null'],
    },
    serviceDescription: {
      type: 'string',
    },
    serviceUnitCost: {
      type:[ 'string', 'null'],
    },
    quantityProjected: {
      type: 'number',
    },
    activated: {
      type: 'boolean',
    },
    closeMatrix: {
      type: 'boolean',
    },
    serviceMatricesSubTotal: {
      type: ['string', 'null'],
    },
    serviceMatricesAvailable: {
      type: ['string', 'null'],
    },
    prServiceTypeName: {
      type: ['string', 'null'],
    },
    providerId: {
      type: 'number',
    },
    providerName: {
      type: 'string',
    },
    providerDocument: {
      type: 'string',
    },
    bItemId: {
      type: ['number', 'null'],
    },
    descripcion: {
      type: ['string', 'null'],
    },
    accountItem: {
      type: ['string', 'null'],
    },
    fFormServicesId: {
      type: ['number', 'null'],
    },
    updatedAt: {
      type: 'string',
    },
    prServiceTypeId: {
      type: ['number', 'null'],
    },
    prServiceMatricesId: {
      type: ['number', 'null'],
    },
    _deleted: {
      type: 'boolean',
    },
    meta: {
      type: 'object',
      properties: {
        lwt: {
          type: 'number',
        },
      },
    },
  },
  required: ['id', 'projectId'],
};

const serviceMatricesSchemaInput = {
  service_matrices: {
    schema: serviceMatricesSchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: '_deleted', // Cambiado de 'deleted' a '_deleted'
  },
};

export default class ServiceMatricesSchema extends DatabaseSchema {
  static schemaName = 'service_matrices';

  static endpointPullName = environment.SERVICE_MATRICES_ENDPOINT_PULL;

  static endpointPushName = environment.SERVICE_MATRICES_ENDPOINT_PUSH;

  getEndpointPullName() {
    return ServiceMatricesSchema.endpointPullName;
  }

  getEndpointPushName() {
    return ServiceMatricesSchema.endpointPushName;
  }

  getSchemaName() {
    return ServiceMatricesSchema.schemaName;
  }

  constructor() {
    const { schemaName } = ServiceMatricesSchema;
    const schemaInput = serviceMatricesSchemaInput;
    super(schemaName, schemaInput);
  }
}