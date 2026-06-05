import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { projWeekSchemaTyped } from "../../RXdatabase/schemas/projWeeks.schema";


export type ProjWeekDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof projWeekSchemaTyped>;