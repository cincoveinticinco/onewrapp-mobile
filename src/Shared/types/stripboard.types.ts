import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { stripboardSchemaTyped } from "../../RXdatabase/schemas/stripboard.schema";

export type StripboardDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof stripboardSchemaTyped>;