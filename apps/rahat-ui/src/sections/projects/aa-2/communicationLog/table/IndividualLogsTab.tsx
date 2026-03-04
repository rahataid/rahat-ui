import { useGetIndividualLogs, usePagination } from '@rahat-ui/query';

import { UUID } from 'crypto';
import CommonLogsTable from './useIndividualCommonLogstable';

import { useMemo } from 'react';
import useIndividualCommonLogsTableColumns from './useIndividualCommonLogsTableColumns';

type CommonLogsTabProps = {
  id: UUID;
  subTab: 'sms' | 'email' | 'voice';
};

export function IndividualLogsTab({ id, subTab }: CommonLogsTabProps) {
  const { pagination, filters, setFilters, setPagination } = usePagination();

  const columns = useIndividualCommonLogsTableColumns(subTab);
  const {
    IndividualLogs: smslogs,
    isLoading,
    IndividualMeta: meta,
  } = useGetIndividualLogs(id, subTab, {
    ...pagination,
    filters,
    enabled: !!id,
  });
  const data = useMemo(() => {
    return (smslogs || []).filter(
      (log: any) => log.sessionStatus !== 'Not Started',
    );
  }, [smslogs]);

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
