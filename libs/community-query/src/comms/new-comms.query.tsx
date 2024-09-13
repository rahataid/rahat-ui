import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../config';
import { useCommunicationService } from './comms.helpers';
import { useRSQuery } from '@rumsan/react-query';
import { getBeneficiaryCommsClient } from '@rahataid/community-tool-sdk/clients';
import Swal from 'sweetalert2';
import { Pagination } from '@rumsan/sdk/types';

export const useListAllTransports = () => {
  const newCommunicationService = useCommunicationService();
  const query = useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.COMMS_LIST_TRANSPORTS],
  });

  return query;
};

export const useListTransports = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.COMMS_LIST_TRANSPORTS],
      queryFn: () => commsClient.listTransport(),
    },
    queryClient,
  );
};

export const useCreateBeneficiaryComms = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);
  return useMutation({
    mutationFn: (payload: any) => commsClient.create(payload),
    mutationKey: [TAGS.CREATE_BENEFICIARY_COMMS],
    onSuccess: () => {
      Swal.fire('Created Successfully', '', 'success');
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_BENEFICIARIES_COMMS],
      });
    },
  });
};

export const useListBeneficiariesComms = (
  payload: Pagination & { [key: string]: string },
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_BENEFICIARIES_COMMS, payload],
      queryFn: () => commsClient.listBenefComms(payload),
    },
    queryClient,
  );
};

export const useLisBeneficiaryComm = (uuid: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_BENEFICIARY_COMM, uuid],
      queryFn: () => commsClient.listBenefCommsByID(uuid),
    },
    queryClient,
  );
};

export const useTriggerCommunication = (uuid: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);

  return useMutation({
    mutationFn: commsClient.triggerCommunication,
    mutationKey: [TAGS.TRIGGER_COMMUNICATION],
    onSuccess: () => {
      Swal.fire(' Triggred', '', 'success');

      queryClient.invalidateQueries({
        queryKey: [TAGS.COMMS_LOGS_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_BENEFICIARY_COMM, uuid],
      });
    },

    onError: (error: any) => {
      Swal.fire(error.response.data.message, '', 'error');
    },
  });
};

export const useListCommsLogsId = (
  uuid: string,
  payload: Pagination & { [key: string]: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);
  const pageData = {
    ...payload,
    page: payload.page,
    limit: payload.perPage,
  };
  const query = useQuery(
    {
      queryKey: [TAGS.COMMS_LOGS_ID, pageData],
      queryFn: () =>
        commsClient.listCommunicationLogsByCampignId(uuid, pageData),
      refetchOnMount: true,
    },
    queryClient,
  );

  return query;
};
