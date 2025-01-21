import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { crewSchemaTyped } from "../RXdatabase/schemas/crew.schema";

export type CrewDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof crewSchemaTyped>;