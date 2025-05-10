import { cn } from '@rahat-ui/shadcn/src';
import type { ReactNode } from 'react';
// import { cn } from '@/lib/utils';

interface MonitoringCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function MonitoringCard({
  title,
  children,
  className,
}: MonitoringCardProps) {
  return (
    <div className={cn(' p-4', className)}>
      <h3 className="text-base font-medium mb-2 pb-2 border-b text-wrap">
        {title}
      </h3>
      {children}
    </div>
  );
}
