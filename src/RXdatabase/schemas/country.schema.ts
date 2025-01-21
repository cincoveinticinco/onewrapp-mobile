import { RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import DatabaseSchema from '../database_schema';
import { CountryDocType } from '../../interfaces/country.types';

const countrySchemaLiteral = {
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
      type: ['string', 'null'],
    },
    nameEsp: {
      type: ['string', 'null'],
    },
    code: {
      type: ['string', 'null'],
      maxLength: 10,
    },
    prefix: {
      type: ['string', 'null'],
      maxLength: 10,
    },
    updatedAt: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    createdAtBack: {
      type: 'string',
    }
  },
  required: ['id', 'nameEng', 'nameEsp', 'code', 'prefix', 'updatedAt'],
} as const;

export const countrySchemaTyped = toTypedRxJsonSchema(countrySchemaLiteral);

export const countrySchema: RxJsonSchema<CountryDocType> = countrySchemaTyped;

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
