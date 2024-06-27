'use client';
import { useRPSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { ProjectTransactions,VendorTransactions,BeneficiaryTransactions } from './graph.query';
import { useEffect } from 'react';
import { useRPProjectSubgraphStore } from './stores/rp-project.store';



export const useRPProjectTransactions = () => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useRPProjectSubgraphStore(
    (state) => state.setProjectDetails,
  );

  const query = useQuery(
    {
      queryKey: ['ProjectTransactions'],
      queryFn: async () => {
        console.log(`here`);
        const { data } = await subgraphClient.query(ProjectTransactions, {
          
        });
        return data;
      },
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectDetails(query.data);
    }
  }, [query, queryClient]);

  return query;
};

export const useRPBeneficiaryTransactions = (beneficiaryAddress: string) => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useRPProjectSubgraphStore(
    (state) => state.setProjectDetails,
  );

  const query = useQuery(
    {
      queryKey: ['beneficiaryTxn', beneficiaryAddress],
      queryFn: async () => {
        console.log(`here`);
        const { data } = await subgraphClient.query(BeneficiaryTransactions, {
          beneficiaryAddress,
        });
        return data;
      },
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectDetails(query.data);
    }
  }, [query, beneficiaryAddress, queryClient]);

  return query;
};


export const useRPVendorTransactions = (vendorAddress: string) => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useRPProjectSubgraphStore(
    (state) => state.setProjectDetails,
  );

  const query = useQuery(
    {
      queryKey: ['VendorTxn', vendorAddress],
      queryFn: async () => {
        console.log(`here`);
        const { data } = await subgraphClient.query(VendorTransactions, {
          vendorAddress,
        });
        return data;
      },
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectDetails(query.data);
    }
  }, [query, vendorAddress, queryClient]);

  return query;
};