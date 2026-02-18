import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from './utils';
import { Flag, ArrowDown, AlertTriangle } from 'lucide-react';
import { GrievancePriority } from '@rahat-ui/query/lib/grievance/types/grievance';

type PriorityChipProps = {
  priority: string | GrievancePriority;
  className?: string;
  showIcon?: boolean;
};

// Priority levels with GitHub-inspired color scheme
const priorityColors = {
  // Low priority - Muted blue (less urgent)
  [GrievancePriority.LOW]: 'bg-[#F2F4F7] text-[#344054]',
  // Medium priority - Yellow (needs attention)
  [GrievancePriority.MEDIUM]: 'bg-[#FFFAEB] text-[#B54708]',
  // High priority - Orange (needs immediate attention)
  [GrievancePriority.HIGH]: 'bg-[#FEF3F2] text-[#B42318]',
  // Critical priority - Red (urgent action required)
  // Default - Gray for unknown states
  default: 'bg-gray-100 text-gray-800',
} as const;

const priorityIcons = {
  [GrievancePriority.LOW]: ArrowDown,
  [GrievancePriority.MEDIUM]: Flag,
  [GrievancePriority.HIGH]: AlertTriangle,
  default: Flag,
} as const;

const priorityLabels = {
  [GrievancePriority.LOW]: 'Low',
  [GrievancePriority.MEDIUM]: 'Medium',
  [GrievancePriority.HIGH]: 'High',
  default: 'N/A',
} as const;

export function PriorityChip({
  priority,
  className,
  showIcon = true,
}: PriorityChipProps) {
  const colorClass =
    priority && priority in priorityColors
      ? priorityColors[priority as keyof typeof priorityColors]
      : priorityColors.default;

  const displayText =
    priority && priority in priorityLabels
      ? priorityLabels[priority as keyof typeof priorityLabels]
      : priorityLabels.default;

  const IconComponent =
    priority && priority in priorityIcons
      ? priorityIcons[priority as keyof typeof priorityIcons]
      : priorityIcons.default;

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
