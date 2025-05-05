'use client';

import { Card } from '@rahat-ui/shadcn/src/components/ui/card';

export default function TokenOverviewSkeleton({ number }: any) {
  return (
    <div className="max-w-screen-lg pb-4">
      <div className="flex flex-row gap-4">
        {number?.map((item) => (
          <Card className="border rounded-sm p-6 shadow-sm w-full" key={item}>
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  );
}
