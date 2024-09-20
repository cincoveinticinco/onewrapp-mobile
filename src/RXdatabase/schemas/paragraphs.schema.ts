import environment from '../../../environment';
import DatabaseSchema from '../database_schema';

const sceneParagraphSchema = {
  title: 'scene paragraph schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    sceneNumber: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    epNumber: {
      type: 'string',
    },
    projectId: {
      type: 'number',
    },
    maxParagraphVersion: {
      type: 'number',
    },
    sceneId: {
      type: 'string',
    },
    paragraphTypeId: {
      type: 'number',
    },
    content: {
      type: 'string',
    },
    position: {
      type: 'number',
    },
    version: {
      type: 'number',
    },
    type: {
      type: 'string',
    },
  },
  required: [
    'sceneNumber',
    'createdAt',
    'updatedAt',
    'epNumber',
    'projectId',
    'maxParagraphVersion',
    'sceneId',
    'paragraphTypeId',
    'content',
    'position',
    'version',
    'type',
  ],
};

const sceneParagraphSchemaInput = {
  paragraphs: {
    schema: sceneParagraphSchema,
    checkpointFields: ['id', 'updatedAt'],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};

export default class SceneParagraphSchema extends DatabaseSchema {
  static schemaName = 'paragraphs';

  static endpointPullName = environment.SCENE_PARAGRAPHS_ENDPOINT_PULL;

  static endpointPushName = environment.SCENE_PARAGRAPHS_ENDPOINT_PUSH;

  getEndpointPullName() {
    return SceneParagraphSchema.endpointPullName;
  }

  getEndpointPushName() {
    return SceneParagraphSchema.endpointPushName;
  }

  getSchemaName() {
    return SceneParagraphSchema.schemaName;
  }

  constructor() {
    const { schemaName } = SceneParagraphSchema;
    const schemaInput = sceneParagraphSchemaInput;
    super(schemaName, schemaInput);
  }
}

// scene_id . position
