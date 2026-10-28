export function SystemHealthBannerSkeleton() {
  return (
    <div className="rounded border bg-gray-50 border-gray-200 p-4 animate-pulse">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-6 bg-muted rounded w-20" />
        </div>
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-3 bg-muted rounded w-20" />
      </div>
    </div>
  );
}
