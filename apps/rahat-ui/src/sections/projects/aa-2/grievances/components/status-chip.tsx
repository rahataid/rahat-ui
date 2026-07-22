import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from './utils';
import { useTranslations } from 'next-intl';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Circle,
  AlertTriangle,
} from 'lucide-react';
import { GrievanceStatus } from '@rahat-ui/query/lib/grievance/types/grievance';

type StatusChipProps = {
  status: string | GrievanceStatus;
  className?: string;
  showIcon?: boolean;
};

// GitHub-inspired color scheme for status chips with better contrast
const statusColors = {
  // New/Open - Light blue (GitHub's default for new/opened issues)
  [GrievanceStatus.NEW]: 'bg-[#F2F4F7] text-[#344054]',
  // In Progress - Dark blue (GitHub's in-progress color)
  [GrievanceStatus.IN_PROGRESS]: 'bg-[#EFF8FF] text-[#175CD3]',
  // Resolved - Purple (GitHub's merged/closed PR color)
  [GrievanceStatus.RESOLVED]: 'bg-[#FDF2FA] text-[#C11574]',
  // Closed - Green (GitHub's closed/merged color)
  [GrievanceStatus.CLOSED]: 'bg-[#ECFDF3] text-[#027A48]',
  // Rejected - Red (GitHub's closed/not-planned color)
  [GrievanceStatus.UNDER_REVIEW]: 'bg-[#FFFAEB] text-[#B54708]',
  // Default - Gray for unknown states
  default: 'bg-gray-100 text-gray-800',
} as const;

const statusIcons = {
  [GrievanceStatus.NEW]: Circle,
  [GrievanceStatus.IN_PROGRESS]: Clock,
  [GrievanceStatus.RESOLVED]: CheckCircle,
  [GrievanceStatus.CLOSED]: CheckCircle,
  [GrievanceStatus.UNDER_REVIEW]: AlertTriangle,
  default: AlertCircle,
} as const;

const statusLabels: Record<string, string> = {
  [GrievanceStatus.NEW]: 'NEW',
  [GrievanceStatus.IN_PROGRESS]: 'IN_PROGRESS',
  [GrievanceStatus.RESOLVED]: 'RESOLVED',
  [GrievanceStatus.CLOSED]: 'CLOSED',
  [GrievanceStatus.UNDER_REVIEW]: 'UNDER_REVIEW',
  default: 'N_A',
};

export function StatusChip({
  status,
  className,
  showIcon = true,
}: StatusChipProps) {
  const t = useTranslations('AA Project');

  const colorClass =
    status && status in statusColors
      ? statusColors[status as keyof typeof statusColors]
      : statusColors.default;

  const labelKey =
    status && status in statusLabels
      ? statusLabels[status as keyof typeof statusLabels]
      : statusLabels.default;
  const displayText = t(labelKey);

  const IconComponent =
    status && status in statusIcons
      ? statusIcons[status as keyof typeof statusIcons]
      : statusIcons.default;

  return (
    <Badge
      variant="default"
      className={cn('inline-flex items-center gap-1', colorClass, className)}
    >
      {showIcon && <IconComponent className="w-3 h-3" />}
      {displayText}
    </Badge>
  );
}
