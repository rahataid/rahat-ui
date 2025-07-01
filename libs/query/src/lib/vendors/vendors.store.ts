import { Vendor } from '@rahataid/sdk/vendor/vendors.types';
import { zustandStore } from '@rumsan/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { StoreApi, UseBoundStore } from 'zustand';

type VendorState = {
  singleVendor: FormattedResponse<Vendor>['data'] | null;
  vendors: FormattedResponse<Vendor[]>['data'] | null;
  meta: FormattedResponse<Vendor>['response']['meta'];
};

type VendorStateAction = {
  setSingleVendor: (vendor: FormattedResponse<Vendor>['data']) => void;
  setVendors: (vendors: FormattedResponse<Vendor[]>['data']) => void;
  resetVendor: () => void;
  setMeta: (meta: any) => void;
};

type VendorStore = VendorState & VendorStateAction;

const initialStore = {
  singleVendor: null,
  vendors: [],
};

export const useVendorStore: UseBoundStore<StoreApi<VendorStore>> =
  zustandStore<VendorStore>(
    (set) => ({
      ...initialStore,
      meta: {},
      setSingleVendor: (vendor) => set({ singleVendor: vendor }),
      setVendors: (vendors) => set({ vendors }),
      resetVendor: () => set({ ...initialStore }),
      setMeta: (meta: FormattedResponse<Vendor>['response']['meta']) =>
        set({ meta }),
    }),
    {
      devtoolsEnabled: true,
    },
  );
