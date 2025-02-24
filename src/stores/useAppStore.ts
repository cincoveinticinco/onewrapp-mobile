import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkerData, WorkerStatusTypeEnum } from '../Shared/types/workers.types';

const localStorageAdapter = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

interface AppState {
  projectId: string | null;
  setProjectId: (value: string | null) => void;
  scenesAreLoading: boolean;
  setScenesAreLoading: (value: boolean) => void;
  replicationStatus: string;
  setReplicationStatus: (value: string) => void;
  replicationPercentage: number;
  setReplicationPercentage: (value: number) => void;
  projectsAreOffline: boolean;
  setProjectsAreOffline: (value: boolean) => void;
  projectsInfoIsOffline: { [key: string]: boolean };
  setProjectsInfoIsOffline: (value: { [key: string]: boolean }) => void;
  qeueReportsOW: WorkerData[],
  addReportToQeue: (report: WorkerData) => void;
  removeReportFromQeue: (reportId: string) => void;
  updateReportInQeue: (reportId: string, status: WorkerStatusTypeEnum) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projectId: localStorage.getItem('projectId') || null,
      setProjectId: (value) => set({ projectId: value }),
      scenesAreLoading: true,
      setScenesAreLoading: (value) => set({ scenesAreLoading: value }),
      replicationStatus: '',
      setReplicationStatus: (value) => set({ replicationStatus: value }),
      replicationPercentage: 0,
      setReplicationPercentage: (value) => set({ replicationPercentage: value }),
      projectsAreOffline: localStorage.getItem('projectsAreOffline')
        ? JSON.parse(localStorage.getItem('projectsAreOffline') as string)
        : false,
      setProjectsAreOffline: (value) => set({ projectsAreOffline: value }),
      projectsInfoIsOffline: localStorage.getItem('projectsInfoIsOffline')
        ? JSON.parse(localStorage.getItem('projectsInfoIsOffline') as string)
        : {},
      setProjectsInfoIsOffline: (value) => set({ projectsInfoIsOffline: value }),
      qeueReportsOW: localStorage.getItem('qeueReportsOW')
        ? JSON.parse(localStorage.getItem('qeueReportsOW') as string)
        : [],
      addReportToQeue: (report) => {
        const updatedQeue = [...get().qeueReportsOW, report];
        localStorage.setItem('qeueReportsOW', JSON.stringify(updatedQeue));
        set({ qeueReportsOW: updatedQeue });
      },
      removeReportFromQeue: (reportId) => {
        const updatedQeue = get().qeueReportsOW.filter((report) => report.jobId !== reportId);
        localStorage.setItem('qeueReportsOW', JSON.stringify(updatedQeue));
        set({ qeueReportsOW: updatedQeue });
      },
      updateReportInQeue: (reportId, status: WorkerStatusTypeEnum) => {
        const updatedQeue = get().qeueReportsOW.map((report) => {
          if (report.jobId === reportId) {
            return { ...report, status };
          }
          return report;
        });
        localStorage.setItem('qeueReportsOW', JSON.stringify(updatedQeue));
        set({ qeueReportsOW: updatedQeue });
      },
    }),
    {
      name: 'app-storage',
      storage: localStorageAdapter,
    }
  )
);

export default useAppStore;
