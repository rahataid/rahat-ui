import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { CircleAlert, ExternalLink, TriangleAlert } from 'lucide-react';
import { formatDateTime } from '../../../../utils';

const getStatusVariant = (status: string) => {
  if (status === BroadcastStatus.FAIL) return 'destructive';
  if (status === BroadcastStatus.SUCCESS) return 'success';
  if (status === BroadcastStatus.PENDING) return 'warning';
  return 'secondary';
};

// Only Twilio failures get a docs link.
const isTwilioDisposition = (disposition: any, message?: string) => {
  if (/twilio/i.test(message ?? '')) return true;

  const sid = String(
    disposition?.sid ?? disposition?.messageSid ?? disposition?.data?.sid ?? '',
  );
  if (/^(SM|MM)[0-9a-f]{32}$/i.test(sid)) return true;

  const accountSid = String(
    disposition?.accountSid ?? disposition?.account_sid ?? '',
  );
  if (/^AC[0-9a-f]{32}$/i.test(accountSid)) return true;

  const reference = String(disposition?.uri ?? disposition?.url ?? '');
  return /twilio\.com/i.test(reference);
};

const getTwilioErrorCode = (disposition: any, message?: string) => {
  if (!isTwilioDisposition(disposition, message)) return undefined;

  const raw =
    disposition?.errorCode ??
    disposition?.error_code ??
    disposition?.data?.errorCode ??
    disposition?.data?.error_code;

  if (raw !== undefined && raw !== null && /^\d{4,5}$/.test(String(raw))) {
    return String(raw);
  }

  const match = message?.match(/\b(\d{5})\b/);
  return match?.[1];
};

const twilioErrorDocsUrl = (code: string) =>
  `https://www.twilio.com/docs/api/errors/${code}`;

const toMessage = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
};

export default function useCommsLogsTableColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'audience',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audience
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row?.original?.address || '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </span>
      ),
      cell: ({ row }) => {
        const status = row?.original?.status;
        const disposition = row?.original?.disposition;

        const statusMessage = toMessage(
          disposition?.message ||
            disposition?.data?.message ||
            disposition?.error ||
            disposition?.reason,
        );

        if (status === 'FAIL') {
          const errorCode = getTwilioErrorCode(disposition, statusMessage);

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                  {errorCode ? (
                    <a
                      href={twilioErrorDocsUrl(errorCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View Twilio documentation for error ${errorCode}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TriangleAlert className="h-4 w-4 text-destructive" />
                    </a>
                  ) : (
                    <TriangleAlert className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <p className="text-sm">{statusMessage || 'Unknown error'}</p>
                {errorCode && (
                  <p className="mt-1 flex items-center gap-1 text-xs opacity-80">
                    <ExternalLink className="h-3 w-3" />
                    Click the icon for Twilio error {errorCode} docs
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        }

        if (status === 'SCHEDULED' && statusMessage) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                  <CircleAlert className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <p className="text-sm">{statusMessage}</p>
              </TooltipContent>
            </Tooltip>
          );
        }

        return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'attempts',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Attempts
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row?.original?.attempts ?? '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price
        </span>
      ),
      cell: ({ row }) => {
        let price = row?.original?.disposition?.price;
        if (typeof price === 'string' && price.startsWith('-')) {
          price = price.substring(1);
        }
        return (
          <span className="text-sm tabular-nums">
            {price !== undefined && price !== null && price !== ''
              ? price
              : '\u2014'}
          </span>
        );
      },
    },
    {
      accessorKey: 'lastAttempt',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Triggered At
        </span>
      ),
      cell: ({ row }) => {
        const date = (row?.original?.lastAttempt ||
          row?.original?.createdAt) as string | undefined;
        if (!date) return <span className="text-sm">\u2014</span>;
        const { dateStr, timeStr } = formatDateTime(date);
        const isFallback = !row?.original?.lastAttempt;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm tabular-nums whitespace-nowrap">
                {dateStr}
                <span className="text-muted-foreground ml-1">{timeStr}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {isFallback
                ? 'No send attempt yet \u2014 showing time queued'
                : 'Time the most recent send attempt was made'}
            </TooltipContent>
          </Tooltip>
        );
      },
    },
  ];
  return columns;
}
