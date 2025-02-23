import environment from '../../../environment';
import DatabaseSchema from '../database_schema';

const crewSchema = {
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
    unitNumber: {
      type: ['string', 'null'],
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
    unitName: {
      type: ['string', 'null'],
    },
    unitIds: {
      type: ['string', 'null'],
    },
    countryId: {
      type: ['string', 'null'],
    },
  },
  required: ['id', 'depNameEng', 'depNameEsp', 'positionEsp', 'positionEng', 'projectId', 'fullName', 'email', 'phone', 'updatedAt', 'unitNumber'],
};

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

  getEndpointPullName() {
    return CrewSchema.endpointPullName;
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
