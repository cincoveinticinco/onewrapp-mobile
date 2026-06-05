import { RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import DatabaseSchema from '../database_schema';
import { ProjWeekDocType } from '../../Shared/types/projWeekTypes.types';

const projWeeksSchemaLiteral = {
  title: 'projWeeksSchema',
  description: 'Schema for proj_weeks collection',
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
    weekStart: {
      type: 'string',
    },
    weekEnd: {
      type: 'string',
    },
    dateStart: {
      type: ['string', 'null'],
    },
    dateEnd: {
      type: ['string', 'null'],
    },
    phase: {
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

export const projWeekSchemaTyped = toTypedRxJsonSchema(projWeeksSchemaLiteral);

const projWeeksSchema: RxJsonSchema<ProjWeekDocType> = projWeeksSchemaLiteral;

const projWeekSchemaInput = {
  proj_weeks: {
    schema: projWeeksSchema,
    checkpointFields: [
      'id',
      'updatedAt',
      'previousProjectId',
    ],
    deletedField: 'deleted',
  },
};

export default class ProjWeeksSchema extends DatabaseSchema {
  static schemaName = 'proj_weeks';

  static endpointPullName = environment.PROJ_WEEKS_ENDPOINT_PULL;

  getEndpointPullName() {
    return ProjWeeksSchema.endpointPullName;
  }

  getSchemaName() {
    return ProjWeeksSchema.schemaName;
  }

  constructor() {
    const { schemaName } = ProjWeeksSchema;
    const schemaInput = projWeekSchemaInput;
    super(schemaName, schemaInput);
  }
}