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
  aiSuggestions: any[]; // AI suggestions separate from user mappings
  processedData: any[];
  rawData: any[];
  validBenef: any[];
  hasUUID: boolean;
  setCurrentScreen: (currentScreen: string) => void;
  setDuplicateData: (duplicateData: any[]) => void;
  setHasExistingMapping: (hasExistingMapping: boolean) => void;
  setInvalidFields: (invalidFields: any[]) => void;
  setImportId: (importId: string) => void;
  setImportSource: (importSource: string) => void;
  setKoboForms: (koboForms: []) => void;
  setLoading: (loading: boolean) => void;
  setMappings: (mappings: any[]) => void;
  setAiSuggestions: (aiSuggestions: any[]) => void; // Setter for AI suggestions
  setProcessedData: (processedData: any[]) => void;
  setRawData: (rawData: any[]) => void;
  setValidBenef: (validBenef: any[]) => void;
  setHasUUID: (hasUUID: boolean) => void;
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
  aiSuggestions: [], // Initialize AI suggestions as empty
  processedData: [],
  rawData: [],
  validBenef: [],
  hasUUID: false,
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
  setMappings: (mappings: any[]) => set({ mappings }),
  setAiSuggestions: (aiSuggestions: any[]) => set({ aiSuggestions }), // Add setter for AI suggestions
  setProcessedData: (processedData: any[]) => set({ processedData }),
  setRawData: (rawData: any[]) => set({ rawData }),
  setValidBenef: (validBenef: any[]) => set({ validBenef }),
  setHasUUID: (hasUUID: boolean) => set({ hasUUID }),
}));
