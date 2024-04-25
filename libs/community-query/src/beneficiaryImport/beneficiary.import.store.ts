import { create } from 'zustand';
import { BENEF_IMPORT_SCREENS } from '../constants';

type Store = {
  currentScreen: string;
  duplicateData: any[];
  hasExistingMapping: boolean;
  invalidFields: any[];
  importId: string;
  importSource: string;
  koboForms: any[];
  loading: boolean;
  mappings: any[];
  processedData: any[];
  rawData: any[];
  validBenef: any[];
  setCurrentScreen: (currentScreen: string) => void;
  setDuplicateData: (duplicateData: any[]) => void;
  setHasExistingMapping: (hasExistingMapping: boolean) => void;
  setInvalidFields: (invalidFields: any[]) => void;
  setImportId: (importId: string) => void;
  setImportSource: (importSource: string) => void;
  setKoboForms: (koboForms: []) => void;
  setLoading: (loading: boolean) => void;
  setMappings: (mappings: []) => void;
  setProcessedData: (processedData: []) => void;
  setRawData: (rawData: []) => void;
  setValidBenef: (validBenef: []) => void;
};

const initialState = {
  currentScreen: BENEF_IMPORT_SCREENS.SELECTION,
  duplicateData: [],
  hasExistingMapping: false,
  invalidFields: [],
  importId: '',
  importSource: '',
  koboForms: [],
  loading: false,
  mappings: [],
  processedData: [],
  rawData: [],
  validBenef: [],
};

export const useBeneficiaryImportStore = create<Store>((set) => ({
  ...initialState,
  setCurrentScreen: (currentScreen: string) => set({ currentScreen }),
  setDuplicateData: (duplicateData: any[]) => set({ duplicateData }),
  setHasExistingMapping: (hasExistingMapping: boolean) =>
    set({ hasExistingMapping }),
  setInvalidFields: (invalidFields: any[]) => set({ invalidFields }),
  setImportId: (importId: string) => set({ importId }),
  setImportSource: (importSource: string) => set({ importSource }),
  setKoboForms: (koboForms: []) => set({ koboForms }),
  setLoading: (loading: boolean) => set({ loading }),
  setMappings: (mappings: []) => set({ mappings }),
  setProcessedData: (processedData: []) => set({ processedData }),
  setRawData: (rawData: []) => set({ rawData }),
  setValidBenef: (validBenef: []) => set({ validBenef }),
}));
