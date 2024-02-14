import DatabaseSchema from '../database_schema';

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
      type: 'string',
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
      enum: ['VOICE OFF', 'IMAGE', 'STOCK IMAGE', 'VIDEO', 'STOCK VIDEO', 'MULTIMEDIA', 'OTHER', null],
    },
    intOrExtOption: {
      type: ['string', 'null'],
      enum: ['INT', 'EXT', 'INT/EXT', 'EXT/INT', null],
    },
    dayOrNightOption: {
      type: ['string', 'null'],
      enum: ['day', 'night', 'sunset', 'sunrise', null],
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
      type: ['string', 'null'], // DIFERENT FROM THE MODEL
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
          categoryName: { type: 'string' },
          characterName: { type: 'string' },
          characterNum: { type: ['string', 'null'] }, /// DIFFERENT FROM MODEL
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

export default class ScenesSchema extends DatabaseSchema {
  static schemaName = 'scenes'

  constructor() {
    const { schemaName } = ScenesSchema;
    const schemaInput = sceneSchemaInput;
    super(schemaName, schemaInput);
  }
}
