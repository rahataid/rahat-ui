import { cn } from '../../utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-800/20', className)}
      {...props}
    />
  );
}

export { Skeleton };
