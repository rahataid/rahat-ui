import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useLisBeneficiaryComm = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_BENEFICIARY_COMM],
      queryFn: () => commsClient.listBenefCommsByID,
    },
    queryClient,
  );
};

export const useTriggerCommunication = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getBeneficiaryCommsClient(rumsanService.client);
  return useMutation({
    mutationFn: commsClient.triggerCommunication,
    mutationKey: [TAGS.TRIGGER_COMMUNICATION],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_BENEFICIARIES_COMMS],
      });
    },
  });
};
