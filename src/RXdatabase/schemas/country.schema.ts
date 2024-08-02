import environment from '../../../environment';
import DatabaseSchema from '../database_schema';

const countrySchema = {
  title: 'country schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    nameEng: {
      type: 'string',
    },
    nameEsp: {
      type: 'string',
    },
    code: {
      type: 'string',
      maxLength: 10,
    },
    prefix: {
      type: 'string',
      maxLength: 10,
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'nameEng', 'nameEsp', 'code', 'prefix', 'updatedAt'],
};

const countrySchemaInput = {
  countries: {
    schema: countrySchema,
    checkpointFields: [
      'id',
      'updatedAt',
    ],
    deletedField: 'deleted',
    headerFields: ['Authorization'],
  },
};

export default class CountriesSchema extends DatabaseSchema {
  static schemaName = 'countries'

  static endpointPullName = environment.COUNTRIES_ENDPOINT_PULL;

  getEndpointPullName() {
    return CountriesSchema.endpointPullName;
  }

  getSchemaName() {
    return CountriesSchema.schemaName;
  }

  constructor() {
    const { schemaName } = CountriesSchema;
    const schemaInput = countrySchemaInput;
    super(schemaName, schemaInput);
  }
}
