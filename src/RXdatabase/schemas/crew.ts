import environment from "../../../environment";
import DatabaseSchema from "../database_schema";

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
      type: 'string',
    },
    depNameEsp: {
      type: 'string',
    },
    positionEsp: {
      type: 'string',
    },
    positionEng: {
      type: 'string',
    },
    projectId: {
      type: 'number',
    },
    fullName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
    unitNumber: {
      type: 'integer',
    },
    departmentId: {
      type: 'number',
    },
  },
  required: ['id', 'depNameEng', 'depNameEsp', 'positionEsp', 'positionEng', 'projectId', 'fullName', 'email', 'phone', 'updatedAt', 'unitNumber', 'departmentId'],
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
