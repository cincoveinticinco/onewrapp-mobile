import { RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import DatabaseSchema from '../database_schema';
import { UnitDocType } from '../../Shared/types/unitTypes.types';

const unitsSchemaLiteral = {
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
    createdAtBack: {
      type: ['string', 'null'],
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['projectId'],
} as const;

export const unitSchemaTyped = toTypedRxJsonSchema(unitsSchemaLiteral);

const unitsSchema: RxJsonSchema<UnitDocType> = unitsSchemaLiteral;

const unitSchemaInput = {
  units: {
    schema: unitsSchema,
    checkpointFields: [
      'id',
      'updatedAt',
      'previousProjectId',
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
