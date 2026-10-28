import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import {
  useListAllTransports,
  useBeneficiariesGroups,
  useStakeholdersGroups,
  useGetCommunication,
  useUpdateCommunication,
  useUploadFile,
} from '@rahat-ui/query';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { BroadcastFormValues, CommunicationChannel } from '../types';
import { AudienceGroupOption } from '../components/target-audience-selector';
import { resolveTransportByChannel, resolveChannelByTransportId } from '../utils/communications.utils';

type TargetGroupRecord = {
  uuid?: string;
  id?: string;
  name?: string;
  _count?: { beneficiaries?: number; stakeholders?: number };
  groupedBeneficiaries?: unknown[];
  stakeholders?: unknown[];
  beneficiaries?: unknown[];
  [key: string]: unknown;
};

type TargetRecord = {
  groupId: string;
  groupType: 'BENEFICIARY' | 'STAKEHOLDERS';
  group?: TargetGroupRecord;
  sessionId?: string;
  status?: string;
};

type UseEditCommunicationProps = {
  projectId: UUID;
  commId: string;
  form: UseFormReturn<BroadcastFormValues>;
};

const toAudienceOptions = (
  groups: unknown[],
  countOf: (g: TargetGroupRecord) => number,
): AudienceGroupOption[] =>
  (Array.isArray(groups) ? groups : [])
    .map((g) => {
      const item = g as TargetGroupRecord;
      return {
        id: item?.uuid || item?.id || '',
        name: item?.name || '',
        count: countOf(item),
      };
    })
    .filter((g) => g.id && g.name);

export function useEditCommunication({
  projectId,
  commId,
  form,
}: UseEditCommunicationProps) {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const appTransports = useListAllTransports();
  const updateCommunication = useUpdateCommunication();
  const uploadFile = useUploadFile();
  const confirmDialog = useBoolean();
  const pendingUpdate = useRef<BroadcastFormValues | null>(null);
  const [transportsTimedOut, setTransportsTimedOut] = useState(false);
  const [isFormPopulated, setIsFormPopulated] = useState(false);
  const populatedCommIdRef = useRef<string | null>(null);

  const { data: communication, isLoading: isCommLoading } = useGetCommunication(
    projectId,
    commId,
  );

  const { data: beneficiaryGroupsData, isLoading: isLoadingBeneficiaries } = useBeneficiariesGroups(
    projectId,
    { page: 1, perPage: 100 },
  );
  const { data: stakeholderGroupsData, isLoading: isLoadingStakeholders } = useStakeholdersGroups(
    projectId,
    { page: 1, perPage: 100 },
  );

  const beneficiaryGroups = useMemo(() => {
    const rawData = (beneficiaryGroupsData as { data?: unknown[] })?.data ?? beneficiaryGroupsData;
    return toAudienceOptions(
      Array.isArray(rawData) ? rawData : [],
      (g) => g?._count?.beneficiaries ?? g?.groupedBeneficiaries?.length ?? 0,
    );
  }, [beneficiaryGroupsData]);

  const stakeholderGroups = useMemo(() => {
    const rawData = (stakeholderGroupsData as { data?: unknown[] })?.data ?? stakeholderGroupsData;
    return toAudienceOptions(
      Array.isArray(rawData) ? rawData : [],
      (g) => g?._count?.stakeholders ?? g?.stakeholders?.length ?? 0,
    );
  }, [stakeholderGroupsData]);

  const raw = (communication as { data?: Record<string, unknown> })?.data ?? communication;
  const targets: TargetRecord[] = useMemo(
    () => (Array.isArray(raw?.targets) ? (raw.targets as TargetRecord[]) : []),
    [raw?.targets],
  );

  const sessionIds = useMemo(() => {
    const ids: string[] = [];
    targets.forEach((target) => {
      if (target?.sessionId) ids.push(target.sessionId);
    });
    return [...new Set(ids)];
  }, [targets]);

  const isTriggered = useMemo(() => {
    const hasSessions = sessionIds.length > 0;
    const hasNonPending = targets.some(
      (tgt) => tgt?.status && tgt?.status !== 'PENDING' && tgt?.status !== 'NEW',
    );
    return hasSessions || hasNonPending;
  }, [targets, sessionIds]);

  const hasAudio = useMemo(() => {
    if (!raw?.audioURL) return false;
    if (typeof raw.audioURL === 'string') return raw.audioURL.trim().length > 0;
    if (typeof raw.audioURL === 'object') {
      const obj = raw.audioURL as { mediaURL?: string; url?: string; fileName?: string };
      return !!obj.mediaURL || !!obj.url || !!obj.fileName || Object.keys(obj).length > 0;
    }
    return false;
  }, [raw?.audioURL]);

  useEffect(() => {
    if (appTransports !== undefined || !raw?.transportId) return;
    const timer = setTimeout(() => {
      setTransportsTimedOut(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [appTransports, raw?.transportId]);

  const resolvedChannel = useMemo<CommunicationChannel | null>(() => {
    if (!raw?.uuid) return null;

    const rawChannel = raw?.channel ? String(raw.channel).toLowerCase().trim() : '';
    if (rawChannel === 'voice' || rawChannel === 'sms' || rawChannel === 'email') {
      return rawChannel as CommunicationChannel;
    }

    if (hasAudio) return 'voice';

    if (raw?.transportId) {
      if (appTransports === undefined && !transportsTimedOut) return null;
      const fromTransport = resolveChannelByTransportId(
        appTransports,
        raw.transportId as string,
        raw.audioURL as { mediaURL?: string; url?: string } | string | null,
      ).toLowerCase();
      if (fromTransport === 'voice' || fromTransport === 'sms' || fromTransport === 'email') {
        return fromTransport as CommunicationChannel;
      }
      return 'sms';
    }

    return 'sms';
  }, [raw?.uuid, raw?.channel, raw?.transportId, raw?.audioURL, hasAudio, appTransports, transportsTimedOut]);

  const getGroupDetails = useCallback(
    (groupId: string, groupType: string, targetGroupObj?: TargetGroupRecord) => {
      if (targetGroupObj?.name) {
        const count =
          targetGroupObj?._count?.beneficiaries ??
          targetGroupObj?._count?.stakeholders ??
          targetGroupObj?.beneficiaries?.length ??
          targetGroupObj?.stakeholders?.length ??
          0;
        return { name: targetGroupObj.name, count };
      }

      const isBeneficiary = groupType === 'BENEFICIARY';
      const groupsData = (isBeneficiary ? beneficiaryGroupsData : stakeholderGroupsData) as {
        data?: TargetGroupRecord[];
      };
      const rawList = Array.isArray(groupsData?.data)
        ? groupsData.data
        : Array.isArray(groupsData)
        ? (groupsData as TargetGroupRecord[])
        : [];

      const found = rawList.find((g) => g?.uuid === groupId || g?.id === groupId);
      if (found) {
        const count = isBeneficiary
          ? (found._count?.beneficiaries ?? found?.groupedBeneficiaries?.length ?? 0)
          : (found._count?.stakeholders ?? found?.stakeholders?.length ?? 0);
        return { name: found.name || groupId, count };
      }

      return {
        name: groupId || (isBeneficiary ? t('BENEFICIARY_GROUP') : t('STAKEHOLDER_GROUP')),
        count: 0,
      };
    },
    [beneficiaryGroupsData, stakeholderGroupsData, t],
  );

  const initialBeneficiaries: AudienceGroupOption[] = useMemo(() => {
    return targets
      .filter((tgt) => tgt?.groupType === 'BENEFICIARY')
      .map((tgt): AudienceGroupOption => {
        const info = getGroupDetails(tgt.groupId, tgt.groupType, tgt.group);
        return { id: tgt.groupId, name: info.name, count: info.count };
      });
  }, [targets, getGroupDetails]);

  const initialStakeholders: AudienceGroupOption[] = useMemo(() => {
    return targets
      .filter((tgt) => tgt?.groupType === 'STAKEHOLDERS')
      .map((tgt): AudienceGroupOption => {
        const info = getGroupDetails(tgt.groupId, tgt.groupType, tgt.group);
        return { id: tgt.groupId, name: info.name, count: info.count };
      });
  }, [targets, getGroupDetails]);

  const isWaitingForTransport =
    !!raw?.transportId && !hasAudio && !raw?.channel && appTransports === undefined && !transportsTimedOut;

  const isWaitingForGroups =
    targets.length > 0 && (isLoadingBeneficiaries || isLoadingStakeholders);

  useEffect(() => {
    if (
      raw?.uuid &&
      resolvedChannel &&
      !isWaitingForTransport &&
      !isWaitingForGroups &&
      populatedCommIdRef.current !== raw.uuid
    ) {
      populatedCommIdRef.current = raw.uuid as string;
      form.reset({
        title: (raw.title as string) || '',
        channel: resolvedChannel,
        subject: (raw.subject as string) || '',
        message: (raw.message as string) || '',
        beneficiaries: initialBeneficiaries,
        stakeholders: initialStakeholders,
        audioFile: (raw.audioURL as { fileName: string; mediaURL: string }) || undefined,
      });
      setIsFormPopulated(true);
    }
  }, [
    raw?.uuid,
    raw?.title,
    raw?.subject,
    raw?.message,
    raw?.audioURL,
    resolvedChannel,
    initialBeneficiaries,
    initialStakeholders,
    isWaitingForTransport,
    isWaitingForGroups,
    form,
  ]);

  const isLoading =
    isCommLoading ||
    !raw?.uuid ||
    !resolvedChannel ||
    isWaitingForTransport ||
    isWaitingForGroups ||
    !isFormPopulated;

  const detailsPath = `/projects/aa/${projectId}/communications/${commId}`;

  const onSubmit = (data: BroadcastFormValues) => {
    pendingUpdate.current = data;
    confirmDialog.onTrue();
  };

  const handleConfirmUpdate = async () => {
    const data = pendingUpdate.current;
    if (!data || !raw?.uuid) return;

    try {
      let audioURL: { fileName: string; mediaURL: string } | undefined;
      if (data.channel === 'voice' && data.audioFile) {
        if (typeof data.audioFile?.mediaURL === 'string') {
          audioURL = { fileName: data.audioFile.fileName, mediaURL: data.audioFile.mediaURL };
        } else {
          const file =
            data.audioFile instanceof File
              ? data.audioFile
              : new File([data.audioFile], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('file', file, file.name);
          const { data: uploaded } = await uploadFile.mutateAsync(formData);
          audioURL = { fileName: uploaded?.fileName, mediaURL: uploaded?.mediaURL };
        }
      }

      const updatePayload: Record<string, unknown> = {
        title: data.title,
        ...(data.channel !== 'voice' ? { message: data.message || null } : {}),
        ...(data.channel === 'email' ? { subject: data.subject || null } : {}),
        ...(data.channel === 'voice' && audioURL ? { audioURL } : {}),
      };

      if (!isTriggered) {
        updatePayload.targets = [
          ...(data.beneficiaries ?? []).map((g) => ({
            groupId: g.id,
            groupType: 'BENEFICIARY' as const,
          })),
          ...(data.stakeholders ?? []).map((g) => ({
            groupId: g.id,
            groupType: 'STAKEHOLDERS' as const,
          })),
        ];

        const selectedTransport = resolveTransportByChannel(appTransports, data.channel);
        if (selectedTransport?.cuid) {
          updatePayload.transportId = selectedTransport.cuid;
        }
      }

      await updateCommunication.mutateAsync({
        projectUUID: projectId,
        communicationUUID: raw.uuid as UUID,
        payload: updatePayload,
      });

      router.push(detailsPath);
    } catch {
      return;
    } finally {
      confirmDialog.onFalse();
      pendingUpdate.current = null;
    }
  };

  return {
    isLoading,
    isSubmitting: updateCommunication.isPending || uploadFile.isPending,
    isTriggered,
    beneficiaryGroups,
    stakeholderGroups,
    isLoadingGroups: isLoadingBeneficiaries || isLoadingStakeholders,
    initialBeneficiaries,
    initialStakeholders,
    detailsPath,
    confirmDialog,
    onSubmit,
    handleConfirmUpdate,
    uploadFile,
    appTransports,
  };
}
