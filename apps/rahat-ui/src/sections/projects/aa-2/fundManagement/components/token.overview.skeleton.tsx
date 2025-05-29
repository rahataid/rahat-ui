'use client';

import { Card } from '@rahat-ui/shadcn/src/components/ui/card';

export default function TokenOverviewSkeleton({ number }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-3">
      {number?.map((item) => (
        <Card className="border rounded-sm p-6 shadow-sm w-full" key={item}>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </Card>
      ))}
    </div>
  );
}
