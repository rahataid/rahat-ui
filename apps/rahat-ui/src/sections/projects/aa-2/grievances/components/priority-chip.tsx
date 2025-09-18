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
  [GrievancePriority.LOW]: 'bg-blue-50 text-blue-800 border-blue-200',
  // Medium priority - Yellow (needs attention)
  [GrievancePriority.MEDIUM]: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  // High priority - Orange (needs immediate attention)
  [GrievancePriority.HIGH]: 'bg-orange-50 text-orange-800 border-orange-200',
  // Critical priority - Red (urgent action required)
  [GrievancePriority.CRITICAL]: 'bg-red-50 text-red-800 border-red-200',
  // Default - Gray for unknown states
  default: 'bg-gray-100 text-gray-800 border-gray-300',
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
