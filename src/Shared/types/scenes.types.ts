import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { scenesShcemaTyped } from "../../RXdatabase/schemas/scenes.schema";

export type SceneDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof scenesShcemaTyped>;

export type Character = NonNullable<SceneDocType['characters']>[number];
export type Extra = NonNullable<SceneDocType['extras']>[number];
export type Element = NonNullable<SceneDocType['elements']>[number];
export type Note = NonNullable<SceneDocType['notes']>[number];