import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'app-storage',
      storage: localStorageAdapter,
    }
  )
);

export default useAppStore;
