import { RxDatabase } from "rxdb";

export interface DatabaseContextProps {
  oneWrapDb: RxDatabase | null;
  offlineScenes: any[];
  setStartReplication: (startReplication: boolean) => void;
  projectId: number | null;
  setProjectId: (projectId: any) => void;
  startReplication: boolean;
  isOnline: boolean;
  scenesAreLoading: boolean;
  viewTabs: boolean;
  setViewTabs: (viewTabs: boolean) => void;
  setScenesAreLoading: (scenesAreLoading: boolean) => void;
  projectsAreLoading: boolean;
  setProjectsAreLoading: (projectsAreLoading: boolean) => void;
  initializeShootingReplication: () => Promise<void>;
  initializeSceneReplication: () => Promise<void>;
  initializeParagraphReplication: () => Promise<void>;
  initializeUnitReplication: () => Promise<void>;
  initializeTalentsReplication: () => Promise<void>;
  isDatabaseReady: boolean;
  initialProjectReplication: () => Promise<void>;
  replicationPercentage: number;
  replicationStatus: string;
  initialReplicationFinished: boolean;
  projectsInfoIsOffline: {[key: string]: boolean};
  setProjectsInfoIsOffline: (projectsInfoIsOffline: {[key: string]: boolean}) => void;
  initializeProjectsUserReplication: () => Promise<void>;
  initializeAllReplications: () => Promise<void>;
  hardAppReset: () => void;
  hardResync: () => Promise<void>;
}