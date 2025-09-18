import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from './utils';
import { Tag } from 'lucide-react';
import { GrievanceType } from '@rahat-ui/query/lib/grievance/types/grievance';

type TypeChipProps = {
  type: string | GrievanceType;
  className?: string;
  showIcon?: boolean;
};

// Using neutral styling for all types
const typeColors = {
  [GrievanceType.TECHNICAL]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceType.OPERATIONAL]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceType.FINANCIAL]: 'bg-gray-50 text-gray-800 border-gray-200',
  [GrievanceType.OTHER]: 'bg-gray-50 text-gray-800 border-gray-200',
  default: 'bg-gray-50 text-gray-800 border-gray-200',
} as const;

const typeLabels = {
  [GrievanceType.TECHNICAL]: 'Technical',
  [GrievanceType.OPERATIONAL]: 'Operational',
  [GrievanceType.FINANCIAL]: 'Financial',
  [GrievanceType.OTHER]: 'Other',
  default: 'N/A',
} as const;

export function TypeChip({ type, className, showIcon = true }: TypeChipProps) {
  const colorClass = type && type in typeColors 
    ? typeColors[type as keyof typeof typeColors] 
    : typeColors.default;
  
  const displayText = type && type in typeLabels 
    ? typeLabels[type as keyof typeof typeLabels] 
    : typeLabels.default;
  
  return (
    <Badge 
      variant="outline" 
      className={cn('inline-flex items-center gap-1', colorClass, className)}
    >
      {showIcon && <Tag className="w-3 h-3" />}
      {displayText}
    </Badge>
  );
}
