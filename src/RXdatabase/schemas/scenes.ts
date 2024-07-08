import DatabaseSchema from '../database_schema';
import {
  ProtectionTypeEnumArray,
  IntOrExtOptionEnumArray,
  DayOrNightOptionEnumArray,
  SceneTypeEnum,
} from '../../Ennums/ennums';
import environment from '../../../environment';

const sceneSchema = {
  title: 'scene schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    sceneId: {
      type: 'number'
    },
    projectId: {
      type: 'number',
    },
    episodeNumber: {
      type: 'string',
    },
    sceneNumber: {
      type: 'string',
    },
    sceneType: {
      type: 'string',
      enum: [SceneTypeEnum.SCENE, SceneTypeEnum.PROTECTION],
    },
    protectionType: {
      type: ['string', 'null'],
      enum: [
        ...ProtectionTypeEnumArray,
        null,
      ],
    },
    intOrExtOption: {
      type: ['string', 'null'],
      enum: [
        ...IntOrExtOptionEnumArray,
        null,
      ],
    },
    dayOrNightOption: {
      type: ['string', 'null'],
      enum: [
        ...DayOrNightOptionEnumArray,
        null,
      ],
    },
    locationName: {
      type: ['string', 'null'],
    },
    setName: {
      type: ['string', 'null'],
    },
    scriptDay: {
      type: ['string', 'null'],
    },
    year: {
      type: ['string', 'null'],
    },
    synopsis: {
      type: ['string', 'null'],
    },
    page: {
      type: ['string', 'null'],
    },
    pages: {
      type: ['number', 'null'],
    },
    estimatedSeconds: {
      type: ['integer', 'null'],
    },
    characters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryName: { type: ['string', 'null'] },
          characterName: { type: 'string' },
          characterNum: { type: ['string', 'null'] },
        },
      },
    },
    extras: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryName: { type: ['string', 'null'] },
          extraName: { type: 'string' },
        },
      },
    },
    elements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryName: { type: ['string', 'null'] },
          elementName: { type: 'string' },
        },
      },
    },
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: { type: ['string', 'null'] },
          note: { type: ['string', 'null'] },
          updatedAt: { type: ['string', 'null'] },
        },
      },
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['episodeNumber', 'sceneNumber', 'sceneType', 'setName', 'projectId'],
};

/// SI ES PELICULA EL NUMERO DE EPISODIOS ES 0

const sceneSchemaInput = {
  scenes: {
    schema: sceneSchema,
    checkpointFields: [
      'id',
      'updatedAt',
      'lastProjectId',
    ],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};

export default class ScenesSchema extends DatabaseSchema {
  static schemaName = 'scenes';

  static endpointPullName = environment.SCENES_ENDPOINT_PULL;

  static endpointPushName = environment.SCENES_ENDPOINT_PUSH;

  getEndpointPullName() {
    return ScenesSchema.endpointPullName;
  }

  getEndpointPushName() {
    return ScenesSchema.endpointPushName;
  }

  getSchemaName() {
    return ScenesSchema.schemaName;
  }

  constructor() {
    const { schemaName } = ScenesSchema;
    const schemaInput = sceneSchemaInput;
    super(schemaName, schemaInput);
  }
}

// IF PROTECTION, PROTECTION TYPE IS REQUIRED

// WHITE TEXT AND COLOR BLACK
