import { DatabaseSchema } from '../database_schema';

export class ScenesSchema extends DatabaseSchema {
  static schemaName = 'scenes'

  constructor() {
    const { schemaName } = ScenesSchema;
    const schemaInput = sceneSchemaInput;
    super(schemaName, schemaInput);
  }
}

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
    projectId: {
      type: 'string',
    },
    episodeNumber: {
      type: 'integer',
    },
    sceneNumber: {
      type: 'string',
    },
    sceneType: {
      type: 'string',
      enum: ['scene', 'protection'],
    },
    protectionType: {
      type: ['string', 'null'],
      enum: ['voice Off', 'image', 'stock image', 'video', 'stock video', 'multimedia', 'other'],
    },
    intOrExtOption: {
      type: ['string', 'null'],
      enum: ['INT', 'EXT', 'INT/EXT', 'EXT/INT'],
    },
    dayOrNightOption: {
      type: ['string', 'null'],
      enum: ['day', 'night', 'sunset', 'sunrise'],
    },
    locationName: {
      type: ['string', 'null'],
    },
    setName: {
      type: 'string',
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
      type: 'integer',
    },
    pages: {
      type: 'number',
    },
    estimatedSeconds: {
      type: 'integer',
    },
    characters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryName: { type: 'string' }, // UNIQUE
          characterName: { type: 'string' },
          characterNum: { type: 'integer' },
        },
      },
    },
    extras: {
      type: 'array',
      iitems: {
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
          categoryName: { type: 'string' },
          elementName: { type: 'string' },
        },
      },
    },
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          note: { type: 'string' },
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
    ],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};
