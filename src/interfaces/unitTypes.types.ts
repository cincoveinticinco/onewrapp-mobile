import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { unitSchemaTyped } from "../RXdatabase/schemas/units.schema";

export type UnitDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof unitSchemaTyped>;