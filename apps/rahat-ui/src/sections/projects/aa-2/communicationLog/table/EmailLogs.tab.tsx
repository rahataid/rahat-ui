import { useGetIndividualLogs, usePagination } from "@rahat-ui/query";

import { UUID } from "crypto";
import CommonLogsTable from "./useIndividualCommonLogstable";

import useEmailLogsTableColumns from "./useEmailLogsTableColumns";
import { useMemo } from "react";

type VoiceLogsTabProps = {
  id: UUID;
};

export function EmailLogsTab({ id }: VoiceLogsTabProps) {
  const {
    pagination,
    filters,
    setFilters,
    setPagination,
  } = usePagination();
 
  const columns = useEmailLogsTableColumns()
  const { IndividualLogs: emailLogs, isLoading, IndividualMeta: meta } = useGetIndividualLogs(
    id,
    "email",
    { ...pagination, filters, enabled: !!id }
  );
    const data  = useMemo(() => {
      return (emailLogs || []).filter(
        (log: any) => log.sessionStatus !== "Not Started"
      );
    }, [emailLogs]);

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