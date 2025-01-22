import { ExtractDocumentTypeFromTypedRxJsonSchema } from 'rxdb';
import { ShootingSceneStatusEnum, ShootingStatusEnum } from '../ennums/ennums';
import { shootingSchemaTyped } from '../RXdatabase/schemas/shootings.schema';

export type ShootingDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof shootingSchemaTyped>;

export type ShootingScene = NonNullable<ShootingDocType['scenes']>[number];

export type ShootingBanner = NonNullable<ShootingDocType['banners']>[number];

export type AdvanceCall = NonNullable<ShootingDocType['advanceCalls']>[number];

export type LocationInfo = NonNullable<ShootingDocType['locations']>[number];

export type Meal = NonNullable<ShootingDocType['meals']>[number];

export type CastCalls = NonNullable<ShootingDocType['castCalls']>[number];

export type ExtraCall = NonNullable<ShootingDocType['extraCalls']>[number];

export type CrewCall = NonNullable<ShootingDocType['crewCalls']>[number];

export type PictureCar = NonNullable<ShootingDocType['pictureCars']>[number];

export type OtherCall = NonNullable<ShootingDocType['otherCalls']>[number];

export type Hospital = NonNullable<ShootingDocType['hospitals']>[number];

export type FormattedService = NonNullable<ShootingDocType['services']>[number];
