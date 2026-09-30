import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';
import { showToast } from 'libs/query/src/utils/custom-toast';

export const useGetBeneficiariesQr = (payload: {
  projectUuid: UUID;
  groupId: UUID;
  isSuccess?: boolean;
}) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiariesQr', payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: payload.projectUuid,
        data: {
          action: 'aaProject.beneficiary.getQrPdf',
          payload: {
            groupId: payload.groupId,
          },
        },
      });
      return mutate.data;
    },
    // keepPreviousData: true,
    enabled: !!payload.projectUuid && !!payload.groupId,
    staleTime: 1000,
    refetchInterval: (query) => {
      const data = query.state.data as { status?: string } | null;
      if (data?.status === 'processing') return 3000;
      return false;
    },
  });

  return query;
};

const SPONSORSHIP_POLL_INTERVAL = 5000;
const SPONSORSHIP_POLL_TIMEOUT = 2 * 60 * 1000;
// ponytail: module-level map (not component state) since refetchInterval runs outside React render
const sponsorshipPollStartedAt = new Map<string, number>();

export const useGetSponsorshipStatusForGroup = (payload: {
  projectUuid: UUID;
  groupUuid: UUID;
}) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['sponsorshipStatus', payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: payload.projectUuid,
        data: {
          action: 'aaProject.beneficiary.getSponsorshipStatusForGroup',
          payload: {
            groupUuid: payload.groupUuid,
          },
        },
      });
      return mutate.data;
    },
    enabled: !!payload.projectUuid && !!payload.groupUuid,
    staleTime: 1000,
    refetchInterval: (query) => {
      const data = query.state.data as {
        isStellarChain?: boolean;
        pending?: number;
      } | null;
      if (!data?.isStellarChain || !data.pending) {
        sponsorshipPollStartedAt.delete(payload.groupUuid);
        return false;
      }
      const startedAt = sponsorshipPollStartedAt.get(payload.groupUuid);
      if (startedAt === undefined) {
        sponsorshipPollStartedAt.set(payload.groupUuid, Date.now());
        return SPONSORSHIP_POLL_INTERVAL;
      }
      // ponytail: stop polling after 2min so a stuck pending count doesn't poll forever
      if (Date.now() - startedAt > SPONSORSHIP_POLL_TIMEOUT) return false;
      return SPONSORSHIP_POLL_INTERVAL;
    },
    refetchIntervalInBackground: false,
  });
};

export const useRetrySponsorshipForGroup = (projectUuid: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupUuid: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action: 'aaProject.beneficiary.retrySponsorshipForGroup',
          payload: { groupUuid },
        },
      });
      return mutate.data;
    },
    onSuccess: (_, groupUuid) => {
      sponsorshipPollStartedAt.delete(groupUuid);
      queryClient.invalidateQueries({
        queryKey: ['sponsorshipStatus', { projectUuid, groupUuid }],
      });
    },
    onError: (error: any) => {
      const rawMessage: string =
        error?.response?.data?.message ||
        error?.message ||
        t('FAILED_TO_RETRY_SPONSORSHIP');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['BENEFICIARIES_DASHBOARD_STATS'],
        rawMessage,
      );
      toast.error(errorMessage);
    },
  });
};

type GenerateQrPdfArgs = {
  groupId: UUID;
  includeOtp?: boolean;
  excludeUnphonedBeneficiaries?: boolean;
  pdfFields?: string[];
};

// Shared by useGenerateQrPdf and useRegenerateQrPdf -- both take the same
// payload shape and only differ in which backend action they call.
const useQrPdfMutation = (projectUuid: UUID, action: string) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      includeOtp = true,
      excludeUnphonedBeneficiaries = false,
      pdfFields = [],
    }: GenerateQrPdfArgs) => {
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action,
          payload: {
            groupId,
            includeOtp,
            excludeUnphonedBeneficiaries,
            pdfFields,
          },
        },
      });

      return mutate.data;
    },

    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({
        queryKey: ['beneficiariesQr', { projectUuid, groupId }],
      });
      toast.success(t('QR_GENERATED_SUCCESSFULLY'));
    },

    onError: (error: any) => {
      const rawMessage =
        error?.response?.data?.message || t('FAILED_TO_GENERATE_QR_PDF');

      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['BENEFICIARIES_DASHBOARD_STATS'],
        rawMessage,
      );
      toast.error(errorMessage);
    },
  });
};

export const useGenerateQrPdf = (projectUuid: UUID) =>
  useQrPdfMutation(projectUuid, 'aaProject.beneficiary.generateQrPdf');

export const useRegenerateQrPdf = (projectUuid: UUID) =>
  useQrPdfMutation(projectUuid, 'aaProject.beneficiary.regenerateQrPdf');
export type ExportBeneficiariesExcelArgs = {
  groupId: UUID;
  includeOtp?: boolean;
  excludeUnphonedBeneficiaries?: boolean;
  excelFields?: string[];
  pdfFields?: string[];
};

export const useExportBeneficiariesExcel = (projectUuid: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();

  return useMutation({
    mutationFn: async (
      args: UUID | ExportBeneficiariesExcelArgs,
    ): Promise<Array<Record<string, any>>> => {
      // Legacy callers pass a plain groupId; the Excel options dialog passes
      // the full filter object (same filters as QR: otp, unphoned, fields).
      const payload: ExportBeneficiariesExcelArgs =
        typeof args === 'string' ? { groupId: args } : args;
      const {
        groupId,
        includeOtp = true,
        excludeUnphonedBeneficiaries = false,
        excelFields = [],
        pdfFields = [],
      } = payload;
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action: 'aaProject.beneficiary.exportGroupExcel',
          payload: {
            groupId,
            includeOtp,
            excludeUnphonedBeneficiaries,
            excelFields: excelFields.length ? excelFields : pdfFields,
            pdfFields,
          },
        },
      });
      const data = mutate.data as unknown;
      // Backend returns an array; normalize in case of wrapper shape.
      if (Array.isArray(data)) return data;
      if (Array.isArray((data as any)?.data)) return (data as any).data;
      return [];
    },
    onError: (error: any) => {
      const rawMessage: string =
        error?.response?.data?.message || t('FAILED_TO_EXPORT_EXCEL');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['BENEFICIARIES_DASHBOARD_STATS'],
        rawMessage,
      );
      toast.error(errorMessage);
    },
  });
};
