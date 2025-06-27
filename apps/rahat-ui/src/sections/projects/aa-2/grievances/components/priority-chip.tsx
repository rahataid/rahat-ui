import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from './utils';
import { Flag, ArrowDown, AlertTriangle } from 'lucide-react';
import { GrievancePriority } from '@rahat-ui/query/lib/grievance/types/grievance';

type PriorityChipProps = {
  priority: string | GrievancePriority;
  className?: string;
  showIcon?: boolean;
};

// Priority levels maintain their colors for visual hierarchy
const priorityColors = {
  [GrievancePriority.LOW]: 'bg-green-50 text-green-800 border-green-100',
  [GrievancePriority.MEDIUM]: 'bg-yellow-50 text-yellow-800 border-yellow-100',
  [GrievancePriority.HIGH]: 'bg-orange-50 text-orange-800 border-orange-100',
  [GrievancePriority.CRITICAL]: 'bg-red-50 text-red-800 border-red-100',
  default: 'bg-gray-50 text-gray-800 border-gray-200',
} as const;

const priorityIcons = {
  [GrievancePriority.LOW]: ArrowDown,
  [GrievancePriority.MEDIUM]: Flag,
  [GrievancePriority.HIGH]: AlertTriangle,
  [GrievancePriority.CRITICAL]: AlertTriangle,
  default: Flag,
} as const;

const priorityLabels = {
  [GrievancePriority.LOW]: 'Low',
  [GrievancePriority.MEDIUM]: 'Medium',
  [GrievancePriority.HIGH]: 'High',
  [GrievancePriority.CRITICAL]: 'Critical',
  default: 'N/A',
} as const;

export function PriorityChip({ 
  priority, 
  className,
  showIcon = true 
}: PriorityChipProps) {
  const colorClass = priority && priority in priorityColors 
    ? priorityColors[priority as keyof typeof priorityColors] 
    : priorityColors.default;
    
  const displayText = priority && priority in priorityLabels 
    ? priorityLabels[priority as keyof typeof priorityLabels] 
    : priorityLabels.default;
    
  const IconComponent = priority && priority in priorityIcons 
    ? priorityIcons[priority as keyof typeof priorityIcons] 
    : priorityIcons.default;
  
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
