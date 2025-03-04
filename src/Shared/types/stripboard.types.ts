import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { stripboardSchemaTyped } from "../../RXdatabase/schemas/stripboard.schema";

export type StripboardDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof stripboardSchemaTyped>;

export type StripboardHasScene = NonNullable<StripboardDocType['stripboardHasScenes']>