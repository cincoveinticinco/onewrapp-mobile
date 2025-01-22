import { ExtractDocumentTypeFromTypedRxJsonSchema, toTypedRxJsonSchema,  RxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import { ProjectStatusEnumArray, ProjectTypeEnumArray } from '../../Shared/ennums/ennums';
import DatabaseSchema from '../database_schema';

export const projectSchemaLiteral = {
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
    projAbreviation: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'projName', 'projStatus', 'projType', 'episodes', 'year'],
} as const;

const projectSchemaTyped = toTypedRxJsonSchema(projectSchemaLiteral);

export type ProjectDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof projectSchemaTyped>;
export const projectSchema: RxJsonSchema<ProjectDocType> = projectSchemaLiteral

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
