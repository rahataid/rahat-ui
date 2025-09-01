import { useGetIndividualLogs, usePagination } from "@rahat-ui/query";

import { UUID } from "crypto";
import CommonLogsTable from "./useIndividualCommonLogstable";
import useSmsLogsTableColumns from "./useSmsLogsTableColumns";
import { useMemo } from "react";

type VoiceLogsTabProps = {
  id: UUID;
};

export function SmsLogsTab({ id }: VoiceLogsTabProps) {
  const {
    pagination,
    filters,
    setFilters,
    setPagination,
  } = usePagination();

  const columns = useSmsLogsTableColumns()
  const { IndividualLogs: smslogs, isLoading, IndividualMeta: meta } = useGetIndividualLogs(
    id,
    "sms",
    { ...pagination, filters, enabled: !!id }
  );
  const data  = useMemo(() => {
      return (smslogs || []).filter(
        (log: any) => log.sessionStatus !== "Not Started"
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