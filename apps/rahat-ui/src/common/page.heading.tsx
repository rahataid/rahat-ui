import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from 'libs/shadcn/src';
import React from 'react';

interface IProps {
  title: string;
  description: string;
  titleStyle?: string;
  status?: string;
  badgeClassName?: string;
}

export function Heading({
  title,
  titleStyle,
  description,
  status,
  badgeClassName,
}: IProps) {
  return (
    <div className="mb-4">
      <p
        className={cn(
          'font-bold mb-1',
          !titleStyle && 'text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl',
          titleStyle,
        )}
      >
        {title} {status && <Badge className={badgeClassName}>{status}</Badge>}
      </p>
      <p className="text-sm/4 text-muted-foreground">{description}</p>
    </div>
  );
}
