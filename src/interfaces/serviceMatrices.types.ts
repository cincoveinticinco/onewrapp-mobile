import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { serviceMatricesSchemaTyped } from "../RXdatabase/schemas/serviceMatrices.schema";

export type ServiceMatricesDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof serviceMatricesSchemaTyped>;


