import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from './utils';
import { AlertCircle, Clock, CheckCircle, XCircle, Circle } from 'lucide-react';
import { GrievanceStatus } from '@rahat-ui/query/lib/grievance/types/grievance';

type StatusChipProps = {
  status: string | GrievanceStatus;
  className?: string;
  showIcon?: boolean;
};

// Using neutral styling for all statuses
const statusColors = {
  [GrievanceStatus.NEW]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceStatus.IN_PROGRESS]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceStatus.RESOLVED]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceStatus.CLOSED]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceStatus.REJECTED]: 'bg-gray-50 text-gray-800 border-gray-200',
  default: 'bg-gray-50 text-gray-800 border-gray-200',
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
  showIcon = true 
}: StatusChipProps) {
  const colorClass = status && status in statusColors 
    ? statusColors[status as keyof typeof statusColors] 
    : statusColors.default;
  
  const displayText = status && status in statusLabels 
    ? statusLabels[status as keyof typeof statusLabels] 
    : statusLabels.default;
    
  const IconComponent = status && status in statusIcons 
    ? statusIcons[status as keyof typeof statusIcons] 
    : statusIcons.default;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'inline-flex items-center gap-1',
        colorClass,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3 h-3" />}
      {displayText}
    </Badge>
  );
}
