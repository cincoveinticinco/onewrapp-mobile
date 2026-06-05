import { ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";
import { stripboardSchemaTyped } from "../../RXdatabase/schemas/stripboard.schema";
import { SceneDocType } from "./scenes.types";

export type StripboardDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof stripboardSchemaTyped>;

export type StripboardHasScene = NonNullable<StripboardDocType['stripboardHasScenes']>

export interface StripboardUnits {
  unitId: number,
  unitNumber: string,
  totalScenes: number;
  totalProtection: number;
  totalMinutes: string;
  totalPages: string;
  scenes: SceneDocType[]
}

export interface StripboardWeekDays {
  dayNumber: number;
  totalScenes: number;
  totalProtection: number;
  totalMinutes: string;
  totalPages: string;
  units: StripboardUnits[];
}

export interface StripboardWeeks {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  totalScenes: number;
  totalProtection: number;
  totalMinutes: string;
  totalPages: string;
  totalUnits: number;
  totalDays: number;
  days: StripboardWeekDays[];
}

export type CombinedStripboardType = {
  id: string;
  name: string;
  startDate: string;
  statusId: number;
  statusString: string;
  projectId: number;
  stripboardHasScenes: any[];
  scenes: SceneDocType[];
  scenesNotIncluded: SceneDocType[];
  totalWeeks: number;
  totalScenes: number;
  totalDays: number;
  totalShootingDays: number;
  weeks: StripboardWeeks[];
};