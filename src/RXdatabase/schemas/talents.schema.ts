import { RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import DatabaseSchema from '../database_schema';
import { TalentDocType } from '../../Shared/types/talent.types';

const talentSchemaLiteral = {
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
    createdAt: {
      type: 'string',
    },
    createdAtBack: {
      type: ['string', 'null'],
    },
  },
  required: ['id', 'name', 'lastName', 'castCategoryId', 'castCategory', 'projectId'],
} as const;

export const talentSchemaTyped = toTypedRxJsonSchema(talentSchemaLiteral);
const talentSchema: RxJsonSchema<TalentDocType> = talentSchemaTyped;

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
