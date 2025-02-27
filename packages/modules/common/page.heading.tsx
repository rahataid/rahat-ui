import React from 'react';

interface IProps {
  title: string;
  description: string;
  titleSize?: string;
}

export function Heading({ title, titleSize = '4xl', description }: IProps) {
  return (
    <div className="mb-4">
      <p className={`font-bold text-${titleSize}`}>{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
