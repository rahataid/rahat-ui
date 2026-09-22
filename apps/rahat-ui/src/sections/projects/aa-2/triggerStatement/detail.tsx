import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';

import {
  PROJECT_SETTINGS_KEYS,
  useDeleteTriggerStatement,
  useProjectInfo,
  useProjectSettingsStore,
  useProjectStore,
  useSingleTriggerStatement,
} from '@rahat-ui/query';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

import {
  Back,
  DeleteButton,
  EditButton,
  Heading,
  TableLoader,
} from 'apps/rahat-ui/src/common';

import {
  ActivateTriggerDialog,
  DocumentsSection,
  ForecastDataSection,
} from './components';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { AlertCircleIcon } from 'lucide-react';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';
import { useTranslations } from 'next-intl';
import { Can } from 'apps/rahat-ui/src/components/can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

export default function TriggerStatementDetail() {
  const formatDate = useDateFormat();
  const formatNum = useNumberFormat();
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const params = useParams();

  const id = params?.id as UUID;
  const triggerID = Number(params?.triggerID);
  const searchparams = useSearchParams();
  const type = searchparams?.get('type');
  const version = searchparams.get('version') === 'true' ? true : false;
  const triggerIdKey = version
    ? triggerID
    : window.location.href.split('/').slice(-1)[0];

  const {
    data: trigger,
    isLoading,
    error,
  } = useSingleTriggerStatement(id, triggerIdKey, version);
  const project = useProjectStore((p) => p.singleProject);
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { data: projectInfo, isLoading: isProjectInfoLoading } = useProjectInfo(
    id as UUID,
  );

  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
    t,
  );

  const phase = trigger?.phase?.name;
  const source = trigger?.source;
  const txnUrl = getExplorerUrl({
    chainSettings: settings?.[id]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
    target: 'tx',
    value: trigger?.transactionHash,
  });
  const removeTrigger = useDeleteTriggerStatement();

  const isEditDeleteDisabled = trigger?.isTriggered || trigger?.phase?.isActive;

  const getEditDeleteTip = () => {
    if (trigger?.isTriggered) {
      return t('CANNOT_MODIFY_TRIGGERED_TRIGGER');
    }
    if (trigger?.phase?.isActive) {
      return t('CANNOT_MODIFY_TRIGGER_ACTIVE_PHASE');
    }
    return '';
  };

  const versionType = type as string | undefined;

  const handleDelete = async () => {
    await removeTrigger.mutateAsync({
      projectUUID: id,
      triggerStatementPayload: { uuid: triggerIdKey as string },
    });
    router.push(
      `/projects/aa/${id}/trigger-statements/phase/${trigger?.phaseId}`,
    );
  };

  if (isLoading || isProjectInfoLoading) {
    return <TableLoader />;
  }

  if (error || !trigger) {
    return (
      <div className="p-4 w-full h-full">
        <Back path={`/projects/aa/${id}/trigger-statements`} />
        <div className="text-gray-400 flex justify-center items-center h-full w-full flex-col gap-3">
          <AlertCircleIcon size={70} />
          <p className="text-xl">
            {t('TRIGGER_DETAILS_NOT_AVAILABLE')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Back />
      <div className="flex justify-between items-center mb-4">
        <Heading
          title={t('TRIGGER_DETAILS')}
          description={t('DETAILED_VIEW_OF_THE_SELECTED_TRIGGER')}
          status={
            versionType
              ? `V${versionType}`
              : trigger?.isTriggered && t('TRIGGERED')
          }
          badgeClassName={`${
            versionType
              ? ''
              : trigger?.isTriggered
              ? 'text-red-500 bg-red-100'
              : 'text-green-500 bg-green-100'
          } text-xs`}
        />
        <div className="flex space-x-2">
          <Can action={ACTIONS.DELETE} subject={SUBJECTS.TRIGGER}>
            <TooltipWrapper
              tip={isEditDeleteDisabled ? getEditDeleteTip() : ''}
              disable={!isEditDeleteDisabled}
            >
              <DeleteButton
                className={`rounded flex gap-1 items-center text-sm font-medium ${
                  version && 'hidden'
                }`}
                name={t('TRIGGER')}
                label={t('DELETE')}
                handleContinueClick={handleDelete}
                disabled={isEditDeleteDisabled}
              />
            </TooltipWrapper>
          </Can>
          <Can action={ACTIONS.UPDATE} subject={SUBJECTS.TRIGGER}>
            <TooltipWrapper
              tip={isEditDeleteDisabled ? getEditDeleteTip() : ''}
              disable={!isEditDeleteDisabled}
            >
              <EditButton
                className={`rounded flex gap-1 items-center text-sm font-medium ${
                  version && 'hidden'
                }`}
                label={t('EDIT')}
                onFallback={() =>
                  router.push(
                    `/projects/aa/${id}/trigger-statements/${triggerIdKey}/edit`,
                  )
                }
                disabled={isEditDeleteDisabled}
              />
            </TooltipWrapper>
          </Can>
          <Can action={ACTIONS.ACTIVATE} subject={SUBJECTS.TRIGGER}>
            {source === 'MANUAL' &&
              !trigger?.phase?.isActive &&
              !trigger?.isTriggered && (
                <ActivateTriggerDialog
                  projectId={id}
                  triggerId={triggerIdKey as string}
                  version={version}
                  notes={trigger?.notes}
                />
              )}
          </Can>
        </div>
      </div>
      <div
        className={`grid ${
          source !== 'MANUAL' ? 'grid-cols-2' : 'grid-cols-1'
        } gap-4`}
      >
        <div className="p-4 border rounded-sm shadow">
          <Heading
            title={trigger?.title}
            titleStyle="text-lg/7"
            description={trigger?.description}
          />
          <div
            className={`grid ${
              trigger?.isTriggered ? 'grid-cols-8' : 'grid-cols-6'
            } text-sm/4 text-muted-foreground mt-6`}
          >
            <div>
              <p className="mb-1">{stationHeading}</p>
              <p>{trigger?.phase?.source?.riverBasin || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1">{t('PHASE')}</p>
              <Badge
                className={`${
                  trigger?.phase?.name === 'READINESS'
                    ? 'text-yellow-500 bg-yellow-100'
                    : 'text-red-500 bg-red-100'
                } text-xs`}
              >
                {trigger?.phase?.name || 'N/A'}
              </Badge>
            </div>
            <div>
              <p className="mb-1">{t('TRIGGER_TYPE')}</p>
              <Badge>{source === 'MANUAL' ? t('MANUAL') : t('AUTOMATED')}</Badge>
            </div>
            <div>
              <p className="mb-1">{t('TYPE')}</p>
              <Badge>{trigger?.isMandatory ? t('MANDATORY') : t('OPTIONAL')}</Badge>
            </div>

            {trigger?.transactionHash && (
              <div className="flex-1 min-w-0">
                <p className="mb-1">{t('TXHASH')}</p>
                <Link
                  href={txnUrl || '#'}
                  target="_blank"
                  className="block overflow-hidden text-ellipsis whitespace-nowrap text-blue-500 hover:underline"
                >
                  <TruncatedCell
                    text={trigger.transactionHash || 'N/A'}
                    maxLength={10}
                  />
                </Link>
              </div>
            )}
            {trigger?.createdBy && (
              <div>
                <p className="mb-1">{t('CREATED_BY')}</p>
                <p>{trigger?.createdBy}</p>
              </div>
            )}
            {trigger?.isTriggered && (
              <div>
                <p className="mb-1">{t('TRIGGERED_AT')}</p>
                <p>{formatDate(trigger?.triggeredAt)}</p>
              </div>
            )}
            {trigger?.triggeredBy && (
              <div>
                <p className="mb-1">{t('TRIGGERED_BY')}</p>
                <p>{trigger?.triggeredBy}</p>
              </div>
            )}
            {trigger?.leadTime && (
              <p className="text-muted-foreground text-sm/4">
                {t('LEAD_TIME')} : {formatNum(parseFloat(trigger.leadTime) || 0)}{' '}
                {/hours/i.test(trigger.leadTime) ? t('HOURS') : t('DAYS')}
              </p>
            )}
          </div>
        </div>
        {source !== 'MANUAL' &&
          Object.keys(trigger?.triggerStatement || {})?.length && (
            <ForecastDataSection
              phase={phase}
              source={source}
              triggerStatement={trigger?.triggerStatement}
            />
          )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {source === 'MANUAL' && trigger?.triggerDocuments?.length > 0 && (
          <DocumentsSection
            triggerDocuments={trigger?.triggerDocuments}
            date={trigger?.updatedAt}
          />
        )}

        {trigger?.notes && (
          <div className="p-4 border rounded-sm shadow">
            <Heading
              title={t('TRIGGER_NOTES')}
              titleStyle="text-lg/7"
              description=""
            />
            <div className="bg-gray-100 rounded-sm p-4">
              <p className="text-sm/4 mb-1">{trigger?.notes}</p>
              <p className="text-gray-500 text-sm/4">
                {formatDate(trigger?.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
