import { RxJsonSchema, toTypedRxJsonSchema } from "rxdb";
import { StripboardDocType } from "../../Shared/types/stripboard.types";
import DatabaseSchema from "../database_schema";
import environment from "../../../environment";

const stripboardSchemaLiteral = {
  title: 'stripboard schema',
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
    name: {
      type: 'string',
    },
    startDate: {
      type: 'string',
    },
    statusId: {
      type: 'number',
    },
    updatedAt: {
      type: 'string',
    }
  },
  required: ['id', 'projectId', 'name', 'startDate', 'statusId', 'updatedAt'],
} as const;

export const stripboardSchemaTyped = toTypedRxJsonSchema(stripboardSchemaLiteral);
export const stripboardSchema: RxJsonSchema<StripboardDocType> = stripboardSchemaTyped;

const stripboardSchemaInput = {
  stripboards: {
    schema: stripboardSchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: 'deleted',
  },
}

export default class StripboardSchema extends DatabaseSchema {
  static schemaName = 'stripboards';

  static endpointPullName = environment.STRIPBOARD_ENDPOINT_PULL;
  static endpointPushName = environment.STRIPBOARD_ENDPOINT_PUSH;

  getEndpointPullName() {
    return StripboardSchema.endpointPullName;
  }

  getSchemanAME() {
    return StripboardSchema.schemaName;
  }

  getEndpointPushName() {
    return StripboardSchema.endpointPushName;
  }

  constructor() {
    const { schemaName } = StripboardSchema;
    const schemaInput = stripboardSchemaInput;
    super(schemaName, schemaInput);
  }
}