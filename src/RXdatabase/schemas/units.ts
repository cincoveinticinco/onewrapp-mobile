import environment from "../../../environment";
import DatabaseSchema from "../database_schema";

const unitsSchema = {
  title: 'unitsSchema',
  description: 'Schema for units collection',
  version: 0,
  type: 'object',
  properties: {
      id: {
          type: 'string',
          primary: true
      },
      projectId: {
          type: 'string'
      },
      projUnitNumber: {
          type: 'string'
      },
      projUnitName: {
          type: 'string'
      },
      createdAt: {
          type: 'string'
      },
      updatedAt: {
          type: 'string'
      }
  },
  indexes: ['projectId']
};

const unitSchemaInput = {
  units: {
    schema: unitsSchema,
    checkpointFields: [
      'id',
      'updatedAt',
      'lastProjectId'
    ],
    deletedField: 'deleted',
  }
}

export default class UnitsSchema extends DatabaseSchema {
  static schemaName = 'shootings';

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