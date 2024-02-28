import { createStore, localPersistStorage } from '../../utils/zustand-store';

type CampaignState = {
  campaign: any;
  totalCampaign: number;
};

type CampaignStateAction = {
  setCampaign: (campaign: any) => void;
  setTotalCampaign: (totalCampaign: number) => void;
  clearCampaign: () => void;
};

type CampaignStore = CampaignState & CampaignStateAction;

export const useCampaignStore = createStore<CampaignStore>(
  (set) => ({
    campaign: null,
    totalCampaign: 0,
    setCampaign: (campaign) => set({ campaign }),
    clearCampaign: () => set({ campaign: null }),
    setTotalCampaign: (totalCampaign: number) =>
      set({
        totalCampaign,
      }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'campaignStore',
      storage: localPersistStorage,
    },
  }
);
