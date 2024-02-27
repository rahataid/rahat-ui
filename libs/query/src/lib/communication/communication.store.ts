import { createStore, localPersistStorage } from '../../utils/zustand-store';

type CampaignState = {
  campaign: any;
};

type CampaignStateAction = {
  setCampaign: (campaign: any) => void;
  clearCampaign: () => void;
};

type CampaignStore = CampaignState & CampaignStateAction;

export const useCampaignStore = createStore<CampaignStore>(
  (set) => ({
    campaign: null,
    setCampaign: (campaign) => set({ campaign }),
    clearCampaign: () => set({ campaign: null }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'campaignStore',
      storage: localPersistStorage,
    },
  }
);
