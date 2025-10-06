import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

export function PayoutSkeleton() {
  return (
    <div className="p-4">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="mb-4">
          <Skeleton className="h-4 w-16" />
        </div>

        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      {/* Radio Button Group Skeleton */}
      <div className="mb-8">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-16 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Beneficiary Group Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        {/* Payout Method Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
