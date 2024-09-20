import environment from '../../../environment';
import DatabaseSchema from '../database_schema';

const unitsSchema = {
  title: 'unitsSchema',
  description: 'Schema for units collection',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      primary: true,
      maxLength: 250,
    },
    projectId: {
      type: 'number',
    },
    unitNumber: {
      type: 'number',
    },
    unitName: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['projectId'],
};

const unitSchemaInput = {
  units: {
    schema: unitsSchema,
    checkpointFields: [
      'id',
      'updatedAt',
      'lastProjectId',
    ],
    deletedField: 'deleted',
  },
};

export default class UnitsSchema extends DatabaseSchema {
  static schemaName = 'units';

  static endpointPullName = environment.UNITS_ENDPOINT_PULL;

  static endpointPushName = environment.UNITS_ENDPOINT_PUSH;

  getEndpointPullName() {
    return UnitsSchema.endpointPullName;
  }

  getEndpointPushName() {
    return UnitsSchema.endpointPushName;
  }

  getSchemaName() {
    return UnitsSchema.schemaName;
  }

  constructor() {
    const { schemaName } = UnitsSchema;
    const schemaInput = unitSchemaInput;
    super(schemaName, schemaInput);
  }
}
