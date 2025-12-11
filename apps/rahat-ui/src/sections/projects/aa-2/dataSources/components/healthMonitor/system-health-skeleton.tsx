import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';

export function SystemHealthSkeleton() {
  return (
    <Card className="border shadow-sm rounded-sm mb-6">
      <CardContent className="flex flex-col space-y-3 p-4">
        <div className="flex flex-col w-full p-3 pt-0 gap-2">
          <div className="flex flex-row items-center gap-3">
            <div className="h-4 bg-muted rounded animate-pulse w-40" />
            <div className="h-6 bg-muted rounded animate-pulse w-20" />
            <div className="h-3.5 w-3.5 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row gap-3">
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-16" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-20" />
              </div>
            </div>
            <div className="h-3 bg-muted rounded animate-pulse w-32 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
