import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { userSchemaTyped } from "../RXdatabase/schemas/user.schema";

export type UserDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof userSchemaTyped>;

export type Company = NonNullable<NonNullable<UserDocType['companies']>[0]>;

export type SecurePage = NonNullable<NonNullable<Company['securePages']>[0]>;

export type Project = NonNullable<NonNullable<Company['projects']>[0]>;
