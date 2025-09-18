import { SourceHealthData } from '@rahat-ui/query';
import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TriangleAlert,
} from 'lucide-react';

interface ApiStatusCardProps {
  data: SourceHealthData;
  className?: string;
}

export function StatusCard({ data, className }: ApiStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP':
        return 'text-green-500 bg-green-50 border-green-500';
      case 'DOWN':
        return 'text-red-500 bg-red-50 border-red-500';
      case 'DEGRADED':
        return 'text-red-500 bg-red-50 border-red-500';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-500 bg-red-50 border-red-500';
      case 'WARNING':
        return 'text-yellow-500 bg-yellow-50 border-yellow-500';
      case 'NORMAL':
        return 'text-green-500 bg-green-50 border-green-500';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getValidityColor = (validity: string) => {
    switch (validity) {
      case 'VALID':
        return 'text-green-500';
      case 'STALE':
        return 'text-yellow-500';
      case 'EXPIRED':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityFromData = (status: string, errors: any) => {
    if (status === 'DOWN') return 'CRITICAL';
    if (status === 'DEGRADED' || errors?.length > 0) return 'WARNING';
    return 'NORMAL';
  };

  const severity = getSeverityFromData(data.status, data.errors);

  return (
    <Card
      className={cn(
        'p-4 bg-card border-border hover:border-border/60 transition-colors rounded-sm',
        className,
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-card-foreground text-balance leading-tight">
              {data.name}
            </h3>
            <p className="text-sm text-primary  transition-colors truncate mt-1">
              {data.source_url}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              variant="outline"
              className={cn('text-xs font-medium', getSeverityColor(severity))}
            >
              {severity}
            </Badge>
            <Badge
              variant="outline"
              className={cn('text-xs font-medium', getStatusColor(data.status))}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {data.status}
            </Badge>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <Clock className="w-4 h-4" />
              <span>Last Checked</span>
            </div>
            <span className="text-sm text-card-foreground font-mono">
              {data.last_checked}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <Zap className="w-4 h-4" />
              <span>Response Time</span>
            </div>
            <span className="text-sm text-card-foreground font-mono">
              {data.response_time_ms ? `${data.response_time_ms}ms` : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <AlertTriangle className="w-4 h-4" />
              <span>Data Validity</span>
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                getValidityColor(data.validity),
              )}
            >
              {data.validity}
            </span>
          </div>
        </div>
      </div>

      {data?.errors && data?.errors?.length > 0 && (
        <div className=" border p-4 mt-4 rounded-sm bg-red-50 border-red-500 text-red-500">
          <div className="flex flex-row">
            <TriangleAlert />
            <div className="flex flex-col w-full p-3 pt-0">
              <div className="flex flex-row items-center">
                <span className="text-sm font-medium">
                  {data?.errors[0]?.code
                    .toLowerCase()
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
                <span className="text-xs ml-auto text-right">
                  {dateFormat(data?.errors[0]?.timestamp)}
                </span>
              </div>
              <span className="text-sm font-medium">
                {data?.errors[0]?.message}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
