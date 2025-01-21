import environment from '../../../environment';
import { ProjectStatusEnumArray, ProjectTypeEnumArray } from '../../ennums/ennums';
import DatabaseSchema from '../database_schema';

export interface Project {
  id: string;
  projName: string;
  season: number | null;
  projStatus: string;
  projType: string;
  episodes: number;
  year: number;
  updatedAt: string;
}

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
      enum: ProjectStatusEnumArray,
    },
    projType: {
      type: 'string',
      enum: ProjectTypeEnumArray,
    },
    episodes: {
      type: 'integer',
    },
    year: {
      type: 'integer',
    },
    companyId: {
      type: 'number',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'projName', 'projStatus', 'projType', 'episodes', 'year'],
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

  static endpointPullName = environment.PROJECTS_ENDPOINT_PULL;

  getEndpointPullName() {
    return ProjectsSchema.endpointPullName;
  }

  getSchemaName() {
    return ProjectsSchema.schemaName;
  }

  constructor() {
    const { schemaName } = ProjectsSchema;
    const schemaInput = projectSchemaInput;
    super(schemaName, schemaInput);
  }
}
