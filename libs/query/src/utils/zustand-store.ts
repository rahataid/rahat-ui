//store-tools
import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

interface ICreateStoreOptions<T, U> {
  persistOptions?: PersistOptions<T, U>;
  devtoolsEnabled?: boolean;
}

export function createStore<T extends object>(
  createState: StateCreator<T>,
  options?: ICreateStoreOptions<T, any>,
): UseBoundStore<StoreApi<T>> {
  let store = create(createState);

  if (options?.persistOptions) {
    store = create(persist(createState, options.persistOptions));
  }

  if (options?.devtoolsEnabled) {
    store = create(devtools(createState));
  }

  if (options?.devtoolsEnabled && options?.persistOptions) {
    store = create(devtools(persist(createState, options.persistOptions)));
  }

  return store;
}

//localpersiststorage, ps, you can use any storage you want, not just localstorage, but for this example, we will use localstorage

export const localPersistStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str);
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};
