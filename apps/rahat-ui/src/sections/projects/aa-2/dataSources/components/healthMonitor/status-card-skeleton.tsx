export function StatusCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-sm p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="flex gap-2 ml-4">
          <div className="h-6 bg-muted rounded w-16"></div>
          <div className="h-6 bg-muted rounded w-12"></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="flex-1 flex justify-between">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="flex-1 flex justify-between">
            <div className="h-4 bg-muted rounded w-28"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="flex-1 flex justify-between">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
