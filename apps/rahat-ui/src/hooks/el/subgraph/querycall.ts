// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { formatDate } from '../../../utils';
import { useGraphService } from '../../../providers/subgraph-provider';
import { useQuery } from '@tanstack/react-query';

const formatTransaction = (trans: any) => ({
  beneficiary: trans.beneficiary || trans.referrerBeneficiaries || '-',
  vendor: trans.vendor || '',
  processedBy:
    trans.beneficiary ||
    trans.vendor ||
    trans.referrerVendor ||
    trans.claimer ||
    trans.beneficiaryAddress,
  topic: trans.eventType,
  timeStamp: formatDate(trans.blockTimestamp),
  transactionHash: trans.transactionHash,
  amount: '',
  voucherId: trans.tokenAddress || trans.token || '-',
  id: trans.transactionHash,
});

const mapTransactions = (transactions: any[]) =>
  transactions.map(formatTransaction);

export const useProjectVoucher = (
  projectAddress: string,
  freeToken: string,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    enabled: !!projectAddress,
    queryKey: ['project-vouchers', projectAddress, freeToken],
    queryFn: async () => {
      const res = await queryService.useProjectVoucher(projectAddress);
      const voucherdetails = res?.voucherDescriptiona?.reduce((acc, des) => {
        if (des.id?.toLowerCase() === freeToken.toLowerCase()) {
          return {
            ...acc,
            freeVoucherCurrency: des?.currency,
            freeVoucherPrice: des?.price,
            freeVoucherDescription: des?.description,
          };
        } else {
          return {
            ...acc,
            referredVoucherCurrency: des?.currency,
            referredVoucherPrice: des?.price,
            referredVoucherDescription: des?.description,
          };
        }
      }, {});
      return {
        ...res,
        ...voucherdetails,
      };
    },
  });
};

export const useBeneficaryVoucher = (beneficiary: string) => {
  const { queryService } = useGraphService();
  // const [data, setData] = useState<any>();
  // const [error, setError] = useState<string | null>(null);
  return useQuery({
    enabled: beneficiary ? true : false,
    queryKey: ['beneficiary-voucher', beneficiary],
    queryFn: async () => {
      const res = await queryService?.useBeneficiaryVoucher(beneficiary);
      return res;
    },
  });
};

export const useBeneficiaryTransaction = (address: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    enabled: address ? true : false,
    queryKey: ['beneficiary-transaction', address],
    queryFn: async () => {
      const res = await queryService?.useBeneficiaryTransaction(address);
      const claimedAssigned = res?.claimAssigneds || [];
      const claimProcessed = res?.projectClaimProcesseds || [];
      const beneficiaryReferred = res?.beneficiaryReferreds || [];
      const newData = mapTransactions(
        claimedAssigned.concat(claimProcessed, beneficiaryReferred),
      );
      return newData;
    },
  });
};

export const useProjectTransaction = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ['project-trans'],
    queryFn: async () => {
      const res = await queryService?.useProjectTransaction();
      const transactionTypes = [
        'claimAssigneds',
        'projectClaimProcesseds',
        'beneficiaryReferreds',
        'beneficiaryAddeds',
        'claimCreateds',
        'tokenBudgetIncreases',
      ];
      const newData = transactionTypes.reduce((acc, type) => {
        const transactions = res?.data[type] || [];
        return acc.concat(transactions.map(formatTransaction));
      }, []);

      return newData;
    },
  });
};

export const useBeneficiaryCount = (projectAddress: string) => {
  const { queryService } = useGraphService();
  return useQuery({
    enabled: projectAddress ? true : false,
    queryKey: ['beneficiary-count', projectAddress],
    queryFn: async () => {
      const res = await queryService.getTotalBeneficiary(projectAddress);
      return res;
    },
  });
};

export const useVendorTransaction = (address: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    enabled: address ? true : false,
    queryKey: ['vendor-vouchers', address],
    queryFn: async () => {
      const res = await queryService.useVendorTransaction(address);
      const claimedAssigned = res?.data?.claimCreateds || [];
      const claimProcessed = res?.data?.projectClaimProcesseds || [];
      const beneficiaryReferred = res?.data?.beneficiaryReferreds || [];
      const tokenRedeems = res?.data?.tokenRedeems || [];
      const newData = mapTransactions(
        claimedAssigned.concat(
          claimProcessed,
          beneficiaryReferred,
          tokenRedeems,
        ),
      );
      return {
        newData,
      };
    },
  });
};

export const useVendorVoucher = (address: string) => {
  const { queryService } = useGraphService();
  return useQuery({
    enabled: address ? true : false,
    queryKey: ['vendor-voucher', address],
    queryFn: async () => {
      const res = await queryService.useVendorVoucher(address);
      return res;
    },
  });
};

export const useAllVendorVoucher = () => {
  const {queryService} = useGraphService();

  return useQuery({
    queryKey: ['vendors-voucher'],
    queryFn: async () => {
      const res = await queryService.useAllVendorVoucher();
      return res;
    }
  })
}


export const useFreeVoucherHolder = () => {
  const { queryService } = useGraphService();
  return useQuery({
    queryKey: ['free-holder'],
    queryFn: async () => {
      const res = await queryService.getFreeVoucherOwners();
      return res;
    },
  });
};

export const useReferredVoucherHolder = () => {
  const { queryService } = useGraphService();
  return useQuery({
    queryKey: ['referred-holder'],
    queryFn: async () => {
      const res = await queryService.getDiscountVoucherOwners();
      return res;
    },
  });
};

export const useVoucherHolder = () => {
  const { queryService } = useGraphService();
  return useQuery({
    queryKey: ['voucher-holder'],
    queryFn: async () => {
      const res = await queryService.getVoucherOwners();
      return res;
    },
  });
};

export const useGetFreeVoucherTransaction = (tokenFree: string) => {
  const { queryService } = useGraphService();
  return useQuery({
    enabled: tokenFree ? true : false,
    queryKey: ['free-voucher-transactions'],
    queryFn: async () => {
      const res = await queryService.getEyeVoucherTransaction(tokenFree);
      return res;
    },
  });
};

export const useGetReferredVoucherTransaction = (tokenReferred: string) => {
  const { queryService } = useGraphService();
  return useQuery({
    enabled: tokenReferred ? true : false,
    queryKey: ['referred-voucher-transactions'],
    queryFn: async () => {
      const res = await queryService.getReferredVoucherTransaction(
        tokenReferred,
      );
      return res;
    },
  });
};

export const useGetBeneficiaryVouchers = () => {
  const { queryService } = useGraphService();
  return useQuery({
    queryKey: ['beneficiary-vouchers'],
    queryFn: async () => {
      const res = await queryService.useAllBeneficiariesVoucher();
      return res;
    },
  });
};

export const useVendorFilteredTransaction = (
  address: string,
  tokenAddress: string,
) => {
  const { queryService } = useGraphService();

  console.log(queryService);

  return useQuery({
    enabled: address ? true : false,
    queryKey: ['vendor-vouchers-filtered', address],
    queryFn: async () => {
      const res = await queryService?.useVendorFilteredTransaction(
        address,
        tokenAddress,
      );
      const claimedAssigned = res?.data?.claimCreateds || [];
      const claimProcessed = res?.data?.projectClaimProcesseds || [];
      const beneficiaryReferred = res?.data?.beneficiaryReferreds || [];
      const tokenRedeems = res?.data?.tokenRedeems || [];
      const newData = mapTransactions(
        claimedAssigned.concat(
          claimProcessed,
          beneficiaryReferred,
          tokenRedeems,
        ),
      );
      return {
        newData,
      };
    },
  });
};
