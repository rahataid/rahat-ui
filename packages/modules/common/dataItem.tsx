import React from 'react';
import { Badge } from '../../../libs/shadcn/src/components/ui/badge';

interface DataItemProps {
  label: string;
  value: string | JSX.Element;
  isBadge?: boolean;
  badgeVariant?: 'secondary' | 'outline' | 'destructive';
}

const DataItem = ({
  label,
  value,
  isBadge = false,
  badgeVariant = 'secondary',
}: DataItemProps) => {
  return (
    <div>
      <h1 className="text-lg text-black">{label}</h1>
      {isBadge ? (
        <Badge
          variant={badgeVariant}
          className="text-sm text-muted-foreground font-medium"
        >
          {value}
        </Badge>
      ) : (
        <p className=" text-sm text-muted-foreground font-medium">{value}</p>
      )}
    </div>
  );
};

export default DataItem;
