import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from './utils';
import { AlertCircle, Clock, CheckCircle, XCircle, Circle } from 'lucide-react';
import { GrievanceStatus } from '@rahat-ui/query/lib/grievance/types/grievance';

type StatusChipProps = {
  status: string | GrievanceStatus;
  className?: string;
  showIcon?: boolean;
};

// GitHub-inspired color scheme for status chips with better contrast
const statusColors = {
  // New/Open - Light blue (GitHub's default for new/opened issues)
  [GrievanceStatus.NEW]: 'bg-blue-50 text-blue-800 border-blue-200',
  // In Progress - Dark blue (GitHub's in-progress color)
  [GrievanceStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-300',
  // Resolved - Purple (GitHub's merged/closed PR color)
  [GrievanceStatus.RESOLVED]: 'bg-purple-50 text-purple-800 border-purple-200',
  // Closed - Green (GitHub's closed/merged color)
  [GrievanceStatus.CLOSED]: 'bg-green-50 text-green-800 border-green-200',
  // Rejected - Red (GitHub's closed/not-planned color)
  [GrievanceStatus.REJECTED]: 'bg-red-50 text-red-800 border-red-200',
  // Default - Gray for unknown states
  default: 'bg-gray-100 text-gray-800 border-gray-300',
} as const;

const statusIcons = {
  [GrievanceStatus.NEW]: Circle,
  [GrievanceStatus.IN_PROGRESS]: Clock,
  [GrievanceStatus.RESOLVED]: CheckCircle,
  [GrievanceStatus.CLOSED]: CheckCircle,
  [GrievanceStatus.REJECTED]: XCircle,
  default: AlertCircle,
} as const;

const statusLabels = {
  [GrievanceStatus.NEW]: 'New',
  [GrievanceStatus.IN_PROGRESS]: 'In Progress',
  [GrievanceStatus.RESOLVED]: 'Resolved',
  [GrievanceStatus.CLOSED]: 'Closed',
  [GrievanceStatus.REJECTED]: 'Rejected',
  default: 'N/A',
} as const;

export function StatusChip({
  status,
  className,
  showIcon = true,
}: StatusChipProps) {
  const colorClass =
    status && status in statusColors
      ? statusColors[status as keyof typeof statusColors]
      : statusColors.default;

  const displayText =
    status && status in statusLabels
      ? statusLabels[status as keyof typeof statusLabels]
      : statusLabels.default;

  const IconComponent =
    status && status in statusIcons
      ? statusIcons[status as keyof typeof statusIcons]
      : statusIcons.default;

  return (
    <Badge
      variant="outline"
      className={cn('inline-flex items-center gap-1', colorClass, className)}
    >
      {showIcon && <IconComponent className="w-3 h-3" />}
      {displayText}
    </Badge>
  );
}
