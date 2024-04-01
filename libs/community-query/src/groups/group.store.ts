import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import { zustandStore } from '@rumsan/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';

type GroupState = {
  singleGroup: FormattedResponse<ListGroup>['data'] | null;
  groups: FormattedResponse<ListGroup[]>['data'] | null;
  meta: FormattedResponse<ListGroup>['response']['meta'];
};

type GroupStateAction = {
  setSingleGroup: (group: FormattedResponse<ListGroup>['data']) => void;
  setGroups: (groups: FormattedResponse<ListGroup[]>['data']) => void;
  resetGroup: () => void;
  setMeta: (meta: any) => void;
};

type GroupStore = GroupState & GroupStateAction;

const initialStore = {
  singleGroup: null,
  groups: [],
};

export const useCommunityGroupStore = zustandStore<GroupStore>(
  (set) => ({
    ...initialStore,
    meta: {},
    setSingleGroup: (group) => set({ singleGroup: group }),
    setGroups: (groups) => set({ groups }),
    resetGroup: () => set({ ...initialStore }),
    setMeta: (meta: FormattedResponse<ListGroup>['response']['meta']) =>
      set({ meta }),
  }),
  {
    devtoolsEnabled: true,
    // persistOptions: {
    //   name: 'beneficiaryStore',
    //   storage: localStore,
    // },
  },
);
