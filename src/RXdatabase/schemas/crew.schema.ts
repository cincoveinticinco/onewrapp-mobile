import { toTypedRxJsonSchema, RxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import DatabaseSchema from '../database_schema';
import { CrewDocType } from '../../Shared/types/crew.types';

const crewSchemaLiteral = {
  title: 'crew schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    depNameEng: {
      type: ['string', 'null'],
    },
    depNameEsp: {
      type: ['string', 'null'],
    },
    positionEsp: {
      type: ['string', 'null'],
    },
    positionEng: {
      type: ['string', 'null'],
    },
    projectId: {
      type: 'number',
    },
    fullName: {
      type: ['string', 'null'],
    },
    email: {
      type: ['string', 'null'],
      format: 'email',
    },
    phone: {
      type: ['string', 'null'],
    },
    updatedAt: {
      type: ['string', 'null'],
      format: 'date-time',
    },
    createdAt: {
      type: 'string',
    },
    createdAtBack: {
      type: ['string', 'null'],
      format: 'date-time',
    },
    order: {
      type: ['integer', 'null'],
    },
    visibleOnCall: {
      type: 'boolean',
    },
    visibleOnHeader: {
      type: 'boolean',
    },
    onCall: {
      type: 'boolean',
    },
    dailyReportSignature: {
      type: 'boolean',
    },
    emergencyContact: {
      type: 'boolean',
    },
    unitIds: {
      type: ['string', 'null'],
    },
    countryId: {
      type: ['string', 'null'],
    },
  },
  required: ['depNameEng', 'depNameEsp', 'positionEsp', 'positionEng', 'projectId', 'fullName', 'email', 'phone', 'updatedAt'],
} as const;

export const crewSchemaTyped = toTypedRxJsonSchema(crewSchemaLiteral);

export const crewSchema: RxJsonSchema<CrewDocType> = crewSchemaLiteral

const crewSchemaInput = {
  crew: {
    schema: crewSchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};

export default class CrewSchema extends DatabaseSchema {
  static schemaName = 'crew'

  static endpointPullName = environment.CREW_ENDPOINT_PULL;
  static endpointPushName = environment.CREW_ENDPOINT_PUSH;

  getEndpointPullName() {
    return CrewSchema.endpointPullName;
  }

  getEndpointPushName() {
    return CrewSchema.endpointPushName;
  }

  getSchemaName() {
    return CrewSchema.schemaName;
  }

  constructor() {
    const { schemaName } = CrewSchema;
    const schemaInput = crewSchemaInput;
    super(schemaName, schemaInput);
  }
}
