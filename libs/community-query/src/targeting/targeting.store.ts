import { create } from 'zustand';

type Store = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  targetUUID: string;
  setTargetUUID: (targetUUID: string) => void;
};

const initialState = {
  loading: false,
  targetUUID: '',
};

export const useCommunityTargetingStore = create<Store>((set) => ({
  ...initialState,
  setLoading: (loading: boolean) => set({ loading }),
  setTargetUUID: (targetUUID: string) => set({ targetUUID }),
}));
