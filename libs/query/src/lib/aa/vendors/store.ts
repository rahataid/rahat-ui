import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

const initialStore = {
  vendors: [],
  vendorDetails: {},
};

type AAVendorsState = {
  vendors: any;
  vendorDetails: any;
};

type AAVendorsStateAction = {
  setVendors: (vendors: any) => void;
  setVendorDetails: (vendorDetails: any) => void;
};

type AAVendorsStore = AAVendorsState & AAVendorsStateAction;

export const useAAVendorsStore: UseBoundStore<StoreApi<AAVendorsStore>> =
  zustandStore<AAVendorsStore>(
    (set) => ({
      ...initialStore,
      setVendors: (vendors: any) => set({ vendors }),
      setVendorDetails: (vendorDetails: any) => set({ vendorDetails }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'aaVendorsStore',
        storage: localStore,
      },
    },
  );
