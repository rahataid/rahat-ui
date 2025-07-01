import { StoreApi, UseBoundStore } from 'zustand';
import { createStore, localPersistStorage } from '../../utils/zustand-store';

type CampaignState = {
  campaign: any;
  totalTextCampaign: number;
  totalVoiceCampaign: number;
};

type CampaignStateAction = {
  setCampaign: (campaign: any) => void;
  setTotalTextCampaign: (totalTextCampaign: number) => void;
  setTotalVoiceCampaign: (totalVoiceCampaign: number) => void;
  clearCampaign: () => void;
};

type CampaignStore = CampaignState & CampaignStateAction;

export const useCampaignStore: UseBoundStore<StoreApi<CampaignStore>> =
  createStore<CampaignStore>(
    (set) => ({
      campaign: null,
      totalTextCampaign: 0,
      totalVoiceCampaign: 0,
      setCampaign: (campaign) => set({ campaign }),
      clearCampaign: () => set({ campaign: null }),
      setTotalTextCampaign: (totalTextCampaign: number) =>
        set({
          totalTextCampaign,
        }),
      setTotalVoiceCampaign: (totalVoiceCampaign: number) =>
        set({
          totalVoiceCampaign,
        }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'campaignStore',
        storage: localPersistStorage,
      },
    },
  );
