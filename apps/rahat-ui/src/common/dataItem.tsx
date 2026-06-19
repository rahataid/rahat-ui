import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import React from 'react';

interface DataItemProps {
  label: string;
  value: string | JSX.Element;
  isBadge?: boolean;
  badgeVariant?: 'secondary' | 'outline' | 'destructive';
}

export const DataItem = ({
  label,
  value,
  isBadge = false,
  badgeVariant = 'secondary',
}: DataItemProps) => {
  return (
    <div>
      <h1 className="text-[clamp(12px,1.2vw,18px)] text-black">{label}</h1>
      {isBadge ? (
        <Badge
          variant={badgeVariant}
          className="text-[clamp(11px,1vw,14px)] text-muted-foreground font-medium"
        >
          {value}
        </Badge>
      ) : (
        <p className="text-[clamp(11px,1vw,14px)] text-muted-foreground font-medium">
          {value}
        </p>
      )}
    </div>
  );
};
