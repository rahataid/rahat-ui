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
      const res = await queryService.useBeneficiaryVoucher(beneficiary);
      return res;
    },
  });

  // const fetchVoucher = useCallback(async () => {
  // const res = await queryService.useBeneficiaryVoucher(beneficiary);
  //   if (res.error) {
  //     setError(res.error);
  //     setData([]);
  //   } else {
  //     setData(res);
  //   }
  // }, [beneficiary, queryService]);

  // useEffect(() => {
  //   fetchVoucher();
  // }, [fetchVoucher]);

  // return useMemo(
  //   () => ({
  //     data,
  //     error,
  //   }),
  //   [data, error],
  // );
};

export const useBeneficiaryTransaction = (address: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    enabled: address ? true : false,
    queryKey: ['beneficiary-transaction', address],
    queryFn: async () => {
      const res = await queryService.useBeneficiaryTransaction(address);
      const claimedAssigned = res?.claimAssigneds || [];
      const claimProcessed = res?.projectClaimProcesseds || [];
      const beneficiaryReferred = res?.beneficiaryReferreds || [];
      const newData = mapTransactions(
        claimedAssigned.concat(claimProcessed, beneficiaryReferred),
      );
      return newData;
    },
  });

  // const fetchData = useCallback(async () => {
  // const res = await queryService.useBeneficiaryTransaction(address);

  //   if (res.error) {
  //     setError(res.error);
  //     setData([]);
  //   } else {
  // const claimedAssigned = res?.claimAssigneds || [];
  // const claimProcessed = res?.projectClaimProcesseds || [];
  // const beneficiaryReferred = res?.beneficiaryReferreds || [];
  // const newData = mapTransactions(
  //   claimedAssigned.concat(claimProcessed, beneficiaryReferred),
  // );

  // setData(newData);
  //     setError(null);
  //   }
  // }, [address, queryService]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // return useMemo(
  //   () => ({
  //     data,
  //     error,
  //   }),
  //   [data, error],
  // );
};

export const useProjectTransaction = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ['project-trans'],
    queryFn: async () => {
      const res = await queryService.useProjectTransaction();
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

  // const fetchData = useCallback(async () => {
  //   const res = await queryService.useProjectTransaction();

  //   if (res.error) {
  //     setError(res.error);
  //     setData([]);
  //   } else {
  //     const transactionTypes = [
  //       'claimAssigneds',
  //       'projectClaimProcesseds',
  //       'beneficiaryReferreds',
  //       'beneficiaryAddeds',
  //       'claimCreateds',
  //       'tokenBudgetIncreases',
  //     ];
  //     const newData = transactionTypes.reduce((acc, type) => {
  //       const transactions = res?.data[type] || [];
  //       return acc.concat(transactions.map(formatTransaction));
  //     }, []);

  //     setData(newData);
  //     setError(null);
  //   }
  // }, [queryService]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // return { data, error };
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

  // const fetchBeneficiaries = useCallback(async () => {
  //   const res = await queryService.getTotalBeneficiary(projectAddress);
  //   if (res.error) {
  //     setError(res.error);
  //     setData([]);
  //   } else {
  //     setData(res);
  //     setError(null);
  //   }
  // }, [projectAddress, queryService]);

  // useEffect(() => {
  //   fetchBeneficiaries();
  // }, [fetchBeneficiaries]);

  // return useMemo(() => ({ data, error }), [data, error]);
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
  // const [data, setData] = useState<any>();
  // const [error, setError] = useState<string | null>(null);

  return useQuery({
    enabled: address ? true : false,
    queryKey: ['vendor-voucher', address],
    queryFn: async () => {
      const res = await queryService.useVendorVoucher(address);
      return res;
    },
  });

  // const fetchVoucher = useCallback(async () => {
  // const res = await queryService.useVendorVoucher(address);
  //   if (res.error) {
  //     setError(res.error);
  //     setData([]);
  //   } else {
  //     setData(res);
  //   }
  // }, [address, queryService]);

  // useEffect(() => {
  //   fetchVoucher();
  // }, [fetchVoucher]);

  // return useMemo(
  //   () => ({
  //     data,
  //     error,
  //   }),
  //   [data, error],
  // );
};
