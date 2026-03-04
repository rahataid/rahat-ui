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
  [GrievanceType.TECHNICAL]: 'bg-[#F2F4F7] text-[#344054]',
  [GrievanceType.NON_TECHNICAL]: 'bg-[#F2F4F7] text-[#344054]',
  [GrievanceType.OTHER]: 'bg-[#F2F4F7] text-[#344054]',
  default: 'bg-gray-100 text-gray-800',
} as const;

const typeLabels = {
  [GrievanceType.TECHNICAL]: 'Technical',
  [GrievanceType.NON_TECHNICAL]: 'Non-Technical',
  [GrievanceType.OTHER]: 'Other',
  default: 'N/A',
} as const;

export function TypeChip({ type, className, showIcon = true }: TypeChipProps) {
  const colorClass =
    type && type in typeColors
      ? typeColors[type as keyof typeof typeColors]
      : typeColors.default;

  const displayText =
    type && type in typeLabels
      ? typeLabels[type as keyof typeof typeLabels]
      : typeLabels.default;

  return (
    <Badge
      variant="default"
      className={cn('inline-flex items-center gap-1', colorClass, className)}
    >
      {showIcon && <Tag className="w-3 h-3" />}
      {displayText}
    </Badge>
  );
}
