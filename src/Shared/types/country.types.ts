import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { countrySchemaTyped } from "../../RXdatabase/schemas/country.schema";

export type CountryDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof countrySchemaTyped>;
