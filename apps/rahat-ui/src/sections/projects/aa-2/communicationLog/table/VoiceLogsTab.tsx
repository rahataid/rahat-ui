import { useGetIndividualLogs, usePagination } from '@rahat-ui/query';
import useVoiceLogsTableColumns from './useVoiceLogsTableColumns';
import { UUID } from 'crypto';
import CommonLogsTable from './useIndividualCommonLogstable';
import { useMemo } from 'react';
import useIndividualCommonLogsTableColumns from './useIndividualCommonLogsTableColumns';

type VoiceLogsTabProps = {
  id: UUID;
};

export function VoiceLogsTab({ id }: VoiceLogsTabProps) {
  const { pagination, filters, setFilters, setPagination } = usePagination();

  const columns = useIndividualCommonLogsTableColumns('voice');
  const {
    IndividualLogs: voiceLogs,
    isLoading,
    IndividualMeta: meta,
  } = useGetIndividualLogs(id, 'voice', { ...pagination, filters });
  const data = useMemo(() => {
    return (voiceLogs || []).filter(
      (log: any) => log.sessionStatus !== 'Not Started',
    );
  }, [voiceLogs]);
  return (
    <CommonLogsTable
      data={data || []}
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      pagination={pagination}
      setPagination={setPagination}
      isLoading={isLoading ?? false}
      meta={meta}
    />
  );
}
