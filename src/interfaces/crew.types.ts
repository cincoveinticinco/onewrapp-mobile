export interface Crew {
  id: string;
  depNameEng: string;
  depNameEsp: string;
  positionEsp: string;
  positionEng: string;
  projectId: number;
  fullName: string;
  email: string;
  phone: string;
  updatedAt: string;
  order: number;
  visibleOnCall: boolean;
  visibleOnHeader: boolean;
  onCall: boolean;
  dailyReportSignature: boolean;
  emergencyContact: boolean;
  unitIds: string;
  countryId: string;
}
