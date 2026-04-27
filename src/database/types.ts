/**
 * Tipos compartidos para el módulo de base de datos
 */

import { RxDatabase } from 'rxdb';

export type DatabaseInstance = any; // Usar 'any' para evitar conflictos de tipos con RxDatabase

export interface ReplicationSelector {
  projectId?: number;
  createdAtBack?: { $exists: boolean };
  [key: string]: any;
}

export interface ReplicationConfig {
  projectId: number | null;
  isOnline: boolean;
  getToken: () => Promise<string>;
}

export interface ReplicationStep {
  name: string;
  startPercentage: number;
  endPercentage: number;
  function: () => Promise<void>;
}

export interface DeletedRecord {
  id: string;
  createdAt: string;
}

export interface ProjectsOfflineInfo {
  [projectId: string]: boolean;
}

export enum ReplicationStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface ReplicationProgress {
  percentage: number;
  status: string;
  currentStep?: string;
}

export interface DatabaseEventMap {
  'database:ready': DatabaseInstance;
  'database:error': Error;
  'replication:progress': ReplicationProgress;
  'replication:complete': { projectId: number };
  'replication:error': { error: Error; step?: string };
  'projects:loaded': any[];
  'scenes:loaded': any[];
  'projects:changed': any[];
  'scenes:changed': { scenes: any[]; projectId: number };
}

export type DatabaseEventType = keyof DatabaseEventMap;
export type DatabaseEventCallback<T extends DatabaseEventType> = (data: DatabaseEventMap[T]) => void;
