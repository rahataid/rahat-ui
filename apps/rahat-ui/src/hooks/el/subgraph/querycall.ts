import { formatDate } from '../../../utils';
import { useGraphService } from '../../../providers/subgraph-provider';
import { useState, useMemo, useEffect, useCallback } from 'react';

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

export const useProjectVoucher = (projectAddress: string) => {
  const { queryService } = useGraphService();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVoucher = useCallback(async () => {
    const res = await queryService.useProjectVoucher(projectAddress);
    if (res.error) {
      setError(res.error);
      setData([]);
    } else {
      setData(res);
      setError(null);
    }
  }, [projectAddress, queryService]);

  useEffect(() => {
    fetchVoucher();
  }, [fetchVoucher]);

  return useMemo(() => ({ data, error }), [data, error]);
};

export const useBeneficaryVoucher = (beneficiary: string) => {
  const { queryService } = useGraphService();
  const [data, setData] = useState<any>();
  const [error, setError] = useState<string | null>(null);

  const fetchVoucher = useCallback(async () => {
    const res = await queryService.useBeneficiaryVoucher(beneficiary);
    if (res.error) {
      setError(res.error);
      setData([]);
    } else {
      setData(res);
    }
  }, [beneficiary, queryService]);

  useEffect(() => {
    fetchVoucher();
  }, [fetchVoucher]);

  return useMemo(
    () => ({
      data,
      error,
    }),
    [data, error],
  );
};

export const useBeneficiaryTransaction = (address: string) => {
  const { queryService } = useGraphService();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const res = await queryService.useBeneficiaryTransaction(address);

    if (res.error) {
      setError(res.error);
      setData([]);
    } else {
      const claimedAssigned = res?.claimAssigneds || [];
      const claimProcessed = res?.projectClaimProcesseds || [];
      const beneficiaryReferred = res?.beneficiaryReferreds || [];
      const newData = mapTransactions(
        claimedAssigned.concat(claimProcessed, beneficiaryReferred),
      );

      setData(newData);
      setError(null);
    }
  }, [address, queryService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({
      data,
      error,
    }),
    [data, error],
  );
};

export const useProjectTransaction = () => {
  const { queryService } = useGraphService();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const res = await queryService.useProjectTransaction();

    if (res.error) {
      setError(res.error);
      setData([]);
    } else {
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

      setData(newData);
      setError(null);
    }
  }, [queryService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error };
};

export const useBeneficiaryCount = (projectAddress: string) => {
  const { queryService } = useGraphService();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBeneficiaries = useCallback(async () => {
    const res = await queryService.getTotalBeneficiary(projectAddress);
    if (res.error) {
      setError(res.error);
      setData([]);
    } else {
      setData(res);
      setError(null);
    }
  }, [projectAddress, queryService]);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  return useMemo(() => ({ data, error }), [data, error]);
};
