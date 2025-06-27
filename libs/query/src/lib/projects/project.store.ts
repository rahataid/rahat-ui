import { Project } from '@rahataid/sdk/project/project.types';
import { localStore, zustandStore } from '@rumsan/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { StoreApi, UseBoundStore } from 'zustand';

type ProjectState = {
  singleProject: FormattedResponse<Project>['data'] | null;
  projects: FormattedResponse<Project[]>['data'] | null;
  meta: FormattedResponse<Project>['response']['meta'];
};

type ProjectStateAction = {
  setSingleProject: (project: FormattedResponse<Project>['data']) => void;
  setProjects: (projects: FormattedResponse<Project[]>['data']) => void;
  resetProject: () => void;
  setMeta: (meta: any) => void;
};

type ProjectStore = ProjectState & ProjectStateAction;

const initialStore = {
  singleProject: null,
  projects: [],
};

export const useProjectStore: UseBoundStore<StoreApi<ProjectStore>> =
  zustandStore<ProjectStore>(
    (set) => ({
      ...initialStore,
      meta: {},
      setSingleProject: (project) => set({ singleProject: project }),
      setProjects: (projects) => set({ projects }),
      resetProject: () => set({ ...initialStore }),
      setMeta: (meta: FormattedResponse<Project>['response']['meta']) =>
        set({ meta }),
    }),
    {
      devtoolsEnabled: true,
    },
  );

const initialSettingsStore = {
  settings: null,
};

type ProjectSettingsState = {
  settings: Record<string, any> | null;
};

type ProjectSettingsStateAction = {
  setSettings: (settings: Record<string, any>) => void;
  resetSettings: () => void;
  // projectBasedSettings: (uuid: UUID | string) => void;
};

type ProjectSettingsStore = ProjectSettingsState & ProjectSettingsStateAction;

export const useProjectSettingsStore: UseBoundStore<
  StoreApi<ProjectSettingsStore>
> = zustandStore<ProjectSettingsStore>(
  (set) => ({
    ...initialSettingsStore,
    setSettings: (settings) =>
      set({
        settings,
      }),
    resetSettings: () => set({ ...initialSettingsStore }),
    // projectBasedSettings: (uuid: string) => {
    //   const settings = get().settings;
    //   const projectSettings = settings?.[uuid];
    //   if (projectSettings) return projectSettings;
    //   return null;
    //   // Fetch settings from api
    // },
    // Fetch settings from api
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'projectSettingsStore',
      storage: localStore,
    },
  },
);
