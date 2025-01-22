import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { talentSchemaTyped } from "../../RXdatabase/schemas/talents.schema";

export type TalentDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof talentSchemaTyped>;