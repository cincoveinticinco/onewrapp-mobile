
export enum WorkerJobNameEnum {
  BreakDownScene = 'Breakdown report',
  Scene = 'Scene report',
}

export enum WorkerJobTypeEnum {
  PDF = 'Pdf'
}

export enum WorkerStatusTypeEnum {
  Complete = 'complete',
  Failed = 'failed'
}

export interface WorkerData {
  jobId: string;
  jobName: WorkerJobNameEnum;
  jobType: WorkerJobTypeEnum;
  productionId: string;
  status: WorkerStatusTypeEnum;
  url: string;
}