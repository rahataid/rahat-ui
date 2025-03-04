import { cn } from 'libs/shadcn/src';
import React from 'react';

interface IProps {
  title: string;
  description: string;
  titleStyle?: string;
}

export function Heading({ title, titleStyle, description }: IProps) {
  return (
    <div className="mb-4">
      <p className={cn('font-bold text-4xl', titleStyle)}>{title}</p>
      <p className="text-sm/4 text-muted-foreground">{description}</p>
    </div>
  );
}
