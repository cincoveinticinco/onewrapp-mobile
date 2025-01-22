import { RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import DatabaseSchema from '../database_schema';
import { UserDocType } from '../../interfaces/user.types';

const userSchemaLiteral = {
  title: 'userSchema',
  description: 'Schema for user collection',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      primary: true,
      maxLength: 250,
    },
    sessionEndsAt: {
      type: 'string',
    },
    userName: {
      type: 'string',
    },
    userEmail: {
      type: 'string',
    },
    sessionToken: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    companies: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          roleId: { type: ['number', 'null'] },
          userTypeId: { type: 'number' },
          liteView: { type: 'boolean' },
          companyName: { type: 'string' },
          securePages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                access: { type: ['number', 'null'] },
                id: { type: 'number' },
                page: { type: ['string', 'null'] },
                parentId: { type: ['number', 'null'] },
              },
            },
          },
          projects: {
            type: ['array', 'null'],
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                roleId: { type: 'number' },
                securePages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      access: { type: ['number', 'null' ]},
                      id: { type: 'number' },
                      page: { type: ['string', 'null'] },
                      parentId: { type: ['number', 'null'] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['id', 'sessionEndsAt', 'sessionToken', 'companies'],
} as const;

export const userSchemaTyped = toTypedRxJsonSchema(userSchemaLiteral);
const userSchema: RxJsonSchema<UserDocType> = userSchemaTyped;

const userSchemaInput = {
  user: {
    schema: userSchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: 'deleted',
  },
};

export default class UserSchema extends DatabaseSchema {
  static schemaName = 'user';

  static endpointPullName = environment.USER_ENDPOINT_PULL;

  getEndpointPullName() {
    return UserSchema.endpointPullName;
  }

  getSchemaName() {
    return UserSchema.schemaName;
  }

  constructor() {
    const { schemaName } = UserSchema;
    const schemaInput = userSchemaInput;
    super(schemaName, schemaInput);
  }
}
