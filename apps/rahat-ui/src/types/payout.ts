export interface PayoutTransaction {
  type: string;
  mode: string;
  extras?: {
    paymentProviderName?: string;
  };
  hasFailedPayoutRequests: boolean;
  totalSuccessAmount: number;
  totalFailedPayoutRequests: number;
  isPayoutTriggered: boolean;
  isCompleted: boolean;
  beneficiaryGroupToken?: {
    title: string;
    status: string;
    numberOfTokens: number;
    isDisbursed: boolean;
    beneficiaryGroup?: {
      name: string;
      groupPurpose: string;
      _count?: {
        beneficiaries: number;
      };
    };
  };
}

export type PayoutOverviewProps = {
  payoutStats: {
    label: string;
    value: string | number;
    infoIcon?: boolean;
    infoTooltip?: string;
  }[];

  payouts: {
    data: PayoutTransaction[];
  };
  statsPayout: {
    payoutStats: {
      beneficiaries: number;
      totalCashDistribution: number;
    };
    payoutOverview: {
      payoutTypes: {
        FSP: number;
        VENDOR: number;
      };
      payoutStatus: {
        SUCCESS: number;
        FAILED: number;
      };
    };
  };
};
