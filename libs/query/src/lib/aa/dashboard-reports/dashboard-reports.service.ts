'use client';
import { UUID } from 'crypto';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';

export interface DashboardReportFile {
  filename: string;
  mimeType: string;
  base64: string;
}

export type DashboardReportFormat = 'xlsx' | 'pdf';

/** A report offered by the backend, derived from enabled tabs + project data. */
export type DashboardReportSummary = {
  id: string;
  title: string;
  formats: DashboardReportFormat[];
};

/**
 * Ask the AA microservice which dashboard reports are available. The backend
 * owns the catalog, enabled-tab gating and availability checks.
 */
export const useListDashboardReports = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.dashboard.listReports', projectUUID],
    queryFn: async (): Promise<DashboardReportSummary[]> => {
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.jobs.dashboard.listReports',
          payload: {},
        },
      });
      const reports = response?.data?.reports;
      return Array.isArray(reports) ? reports : [];
    },
  });
};

/**
 * Ask the AA microservice to build a dashboard report file. The backend is the
 * source of truth: it derives the rows from stats, the caller only picks the
 * report and format.
 */
export const useExportDashboardReport = () => {
  const q = useProjectAction();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      reportId,
      format,
    }: {
      projectUUID: UUID;
      reportId: string;
      format: DashboardReportFormat;
    }) => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.jobs.dashboard.exportReport',
          payload: { reportId, format },
        },
      });
      return mutate.data as DashboardReportFile;
    },
  });
};
