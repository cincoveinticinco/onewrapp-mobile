import { create }from 'zustand';
import { persist } from 'zustand/middleware';

const sessionStorageAdapter = {
  getItem: (name: string) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

interface ReplicationState {
  initialReplicationFinished: boolean;
  setInitialReplicationFinished: (value: boolean) => void;
}

const useReplicationStore = create<ReplicationState>()(
  persist(
    (set) => ({
      initialReplicationFinished: false,
      setInitialReplicationFinished: (value) => set({ initialReplicationFinished: value }),
    }),
    {
      name: 'replication-storage',
      storage: sessionStorageAdapter, // Usar el adaptador personalizado
    }
  )
);

export default useReplicationStore;
