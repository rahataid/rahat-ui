import { zustandStore } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { StateStorage, createJSONStorage } from 'zustand/middleware';

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? '';
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    window.location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.delete(key);
    window.location.hash = searchParams.toString();
  },
};

type LocalAndUrlStore = {
  pagination: Pagination;
  filters: {
    [key: string]: string;
  };
  setPagination: (pagination: { page: number; perPage: number }) => void;
  setFilters: (filters: { [key: string]: string }) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
};

const storageOptions = {
  name: 'paginationStore',
  storage: createJSONStorage<LocalAndUrlStore>(() => hashStorage),
};

export const usePagination = zustandStore<LocalAndUrlStore>(
  (set) => ({
    pagination: {
      page: 1,
      perPage: 20,
    },
    filters: {
      orderBy: 'createdAt',
      orderType: 'desc',
    },
    setNextPage: () => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          page: state.pagination.page + 1,
        },
      }));
    },
    setPrevPage: () => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          page: state.pagination.page - 1,
        },
      }));
    },
    setPagination: (pagination: any) => set({ pagination }),
    setFilters: (filters: LocalAndUrlStore['filters']) => set({ filters }),
    resetPagination: () => set({ pagination: { page: 1, perPage: 10 } }),
    resetFilters: () => set({ filters: {} }),
  }),
  {
    persistOptions: storageOptions,
  }
);
