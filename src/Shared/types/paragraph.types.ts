import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { sceneParagraphSchemaTyped } from "../../RXdatabase/schemas/paragraphs.schema";

export type SceneParagraphDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof sceneParagraphSchemaTyped>;