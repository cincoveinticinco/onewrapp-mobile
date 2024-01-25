import DatabaseSchema from '../database_schema';

const projectSchema = {
  title: 'project schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    projName: {
      type: 'string',
    },
    season: {
      type: ['integer', 'null'],
    },
    projStatus: {
      type: 'string',
      enum: ['On Development', 'On Pre-production', 'On Production', 'On Wrapp', 'On Post-production', 'closed'],
    },
    projType: {
      type: 'string',
      enum: ['Scripted film', 'scripted series', 'Non Scripted film', 'Non Scripted series'],
    },
    prodCenter: {
      type: 'string',
    },
    episodes: {
      type: 'integer',
    },
    year: {
      type: 'integer',
    },
  },
  updatedAt: {
    type: 'string',
  },
  required: ['id', 'projName', 'projStatus', 'projType', 'prodCenter', 'episodes', 'year'],
};

const projectSchemaInput = {
  projects: {
    schema: projectSchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};

export default class ProjectsSchema extends DatabaseSchema {
  static schemaName = 'projects'

  constructor() {
    const { schemaName } = ProjectsSchema;
    const schemaInput = projectSchemaInput;
    super(schemaName, schemaInput);
  }
}

// LOS PROYECTOS QUE ESTEN EN DESARROLLO
// COLOR BLANCO
// PREPRODUCCION
// AMARILLO
// PRODUCCION
// AZUL
// ON WRAPP
// AZUL
// SI SON SERIES, APARECE EPISODIO SI NO SON SERIES APARECE EL ANIO
