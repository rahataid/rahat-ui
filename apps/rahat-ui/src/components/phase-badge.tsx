import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { getPhaseColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
import { ReactNode } from 'react';

export function PhaseBadge({
  phase,
  children,
  className = '',
}: {
  phase?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Badge className={`${getPhaseColor(phase)} ${className}`}>{children}</Badge>
  );
}
