'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { CloudDownload } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  DashboardReportFormat,
  DashboardReportSummary,
  useExportDashboardReport,
  useListDashboardReports,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
type Props = {
  projectId: UUID;
};

// Backend IDs stay the source of truth; map them to translated labels so the
// dropdown options follow the selected locale.
const REPORT_TITLE_KEYS = {
  overview: 'PROJECT_OVERVIEW',
  'beneficiary-demographics': 'BENEFICIARY_DEMOGRAPHICS',
  'flood-survey-data': 'FLOOD_SURVEY_DATA',
  'heatwave-survey-data': 'HEATWAVE_SURVEY_DATA',
  'token-stats': 'TOKEN_STATS',
  'access-inclusion': 'ACCESS_&_INCLUSION',
  'communication-outreach': 'COMMUNICATION_OUTREACH',
  flood26Demographics: 'FLOOD_2026_HOUSEHOLD_DEMOGRAPHICS',
  flood26Livelihood: 'FLOOD_2026_LIVELIHOOD',
  flood26Housing: 'FLOOD_2026_HOUSING',
  flood26Exposure: 'FLOOD_2026_DISASTER_EXPOSURE',
  flood26Preparedness: 'FLOOD_2026_PREPAREDNESS',
} as const;

export default function DownloadReportDialog({ projectId }: Props) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const reportTitle = (report: DashboardReportSummary) => {
    const key = REPORT_TITLE_KEYS[report.id as keyof typeof REPORT_TITLE_KEYS];
    return key ? t(key) : report.title;
  };
  const [open, setOpen] = useState(false);
  const [reportId, setReportId] = useState('');
  const [format, setFormat] = useState<DashboardReportFormat>('xlsx');
  const exportReport = useExportDashboardReport();

  const { data: availableReports = [], isLoading } =
    useListDashboardReports(projectId);

  const selectedReport: DashboardReportSummary | undefined = useMemo(
    () =>
      availableReports.find((report) => report.id === reportId) ??
      availableReports[0],
    [availableReports, reportId],
  );

  const resetForm = () => {
    setReportId('');
    setFormat(availableReports[0]?.formats[0] ?? 'xlsx');
  };

  const handleDownload = async () => {
    if (!selectedReport) return;

    try {
      const file = await exportReport.mutateAsync({
        projectUUID: projectId,
        reportId: selectedReport.id,
        format,
      });

      const bytes = Uint8Array.from(atob(file.base64), (character) =>
        character.charCodeAt(0),
      );
      const blob = new Blob([bytes], {
        type: file.mimeType || 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setOpen(false);
      resetForm();
    } catch (error: any) {
      const code = error?.response?.data?.code;
      const message =
        code === 'DASHBOARD_REPORT_NO_DATA'
          ? t('NO_DATA_IN_REPORT')
          : error?.response?.data?.message ||
            error?.message ||
            t('DOWNLOAD_REPORT_FAILED');
      toast.error(message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="shadow-md text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
        >
          <CloudDownload size={16} className="mr-1" />
          {t('DOWNLOAD_REPORT')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('DOWNLOAD_REPORT')}</DialogTitle>
          <DialogDescription>
            {t('DOWNLOAD_REPORT_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{tg('LOADING')}</p>
        ) : availableReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('NO_REPORTS_AVAILABLE')}
          </p>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="dashboard-report">{t('SELECT_REPORT')}</Label>
              <Select
                value={selectedReport?.id}
                onValueChange={(value) => {
                  setReportId(value);
                  const next = availableReports.find((r) => r.id === value);
                  setFormat(next?.formats[0] ?? 'xlsx');
                }}
              >
                <SelectTrigger id="dashboard-report">
                  <SelectValue placeholder={t('SELECT_REPORT')} />
                </SelectTrigger>
                <SelectContent>
                  {availableReports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {reportTitle(report)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboard-report-format">
                {t('SELECT_FORMAT')}
              </Label>
              <Select
                value={format}
                onValueChange={(value) => setFormat(value as DashboardReportFormat)}
              >
                <SelectTrigger id="dashboard-report-format">
                  <SelectValue placeholder={t('SELECT_FORMAT')} />
                </SelectTrigger>
                <SelectContent>
                  {(selectedReport?.formats ?? []).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === 'xlsx' ? t('EXCEL_XLSX') : t('PDF_FILE')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {tg('CANCEL')}
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={!selectedReport || exportReport.isPending}
          >
            <CloudDownload
              size={16}
              className={`mr-1 ${exportReport.isPending ? 'animate-spin' : ''}`}
            />
            {t('DOWNLOAD_REPORT')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
