import environment from '../../../environment';
import DatabaseSchema from '../database_schema';

export interface Talent {
  id: string;
  projectId: number;
  artisticName: string;
  name: string;
  lastName: string;
  castName: string;
  castCategoryId: number;
  castCategory: string;
}

const talentSchema = {
  title: 'talent schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    projectId: { 
      type: 'integer',
    },
    artisticName: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    castName: {
      type: 'string',
    },
    castCategoryId: {
      type: ['integer', 'null'],
    },
    castCategory: {
      type: ['string', 'null'],
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'name', 'lastName', 'castCategoryId', 'castCategory', 'projectId']
};

const talentSchemaInput = {
  talents: {
    schema: talentSchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};

export default class TalentsSchema extends DatabaseSchema {
  static schemaName = 'talents'

  static endpointPullName = environment.TALENTS_ENDPOINT_PULL;

  static endpointPushName = environment.TALENTS_ENDPOINT_PUSH;

  getEndpointPullName() {
    return TalentsSchema.endpointPullName;
  }

  getSchemaName() {
    return TalentsSchema.schemaName;
  }

  getEndpointPushName() {
    return TalentsSchema.endpointPushName;
  }

  constructor() {
    const { schemaName } = TalentsSchema;
    const schemaInput = talentSchemaInput;
    super(schemaName, schemaInput);
  }
}