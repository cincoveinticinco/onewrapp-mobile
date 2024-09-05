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
    project_id: {
      type: 'number',
    },
    currency_id: {
      type: 'number',
    },
    service_description: {
      type: 'string',
    },
    service_unit_cost: {
      type: 'number',
    },
    quantity_projected: {
      type: 'number',
    },
    activated: {
      type: 'boolean',
    },
    close_matrix: {
      type: 'boolean',
    },
    service_matrices_sub_total: {
      type: 'number',
    },
    service_matrices_available: {
      type: 'number',
    },
    pr_service_type_id: {
      type: 'number',
    },
    pr_service_type_name: {
      type: 'string',
    },
    provider_id: {
      type: 'number',
    },
    provider_name: {
      type: 'string',
    },
    provider_document: {
      type: 'string',
    },
    b_item_id: {
      type: 'number',
    },
    descripcion: {
      type: 'string',
    },
    account_item: {
      type: 'string',
    },
    f_form_services_id: {
      type: 'number',
    },
    created_at: {
      type: 'string',
    },
    updated_at: {
      type: 'string',
    },
  },
  required: ['id', 'project_id', 'currency_id'],
};

const serviceMatricesSchemaInput = {
  service_matrices: {
    schema: serviceMatricesSchema,
    checkpointFields: [
      'id',
      'updated_at',
    ],
    deletedField: 'deleted',
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
