import React from 'react';

interface IProps {
  title: string;
  description: string;
}

export function PageHeading({ title, description }: IProps) {
  return (
    <div className="mb-4">
      <p className="font-semibold text-4xl">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
