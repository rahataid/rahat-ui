export type PayoutOverviewProps = {
  payoutStats: {
    label: string;
    value: string | number;
    infoIcon?: boolean;
    infoTooltip?: string;
  }[];

  payouts: {
    data: {
      uuid: string;
      beneficiaryGroupToken: {
        beneficiaryGroup: {};
      };
    }[];
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
