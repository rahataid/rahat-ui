'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

export default function CommunicationsStatsSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {/* SMS Card */}
        <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total SMS Sent
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-7 w-12" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row">
            <div className="flex justify-center items-center">
              <Skeleton className="h-[260px] w-[260px] rounded-full" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col flex-wrap">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Card */}
        <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total Email Sent
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-7 w-12" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row">
            <div className="flex justify-center items-center">
              <Skeleton className="h-[260px] w-[260px] rounded-full" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col flex-wrap">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AVC Card */}
      <div className="w-full">
        <Card className="shadow-sm rounded-sm px-0 w-full flex flex-col">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total AVC Sent
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-7 w-12" />
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex justify-center items-center xl:items-start xl:justify-normal">
              <Skeleton className="h-[260px] w-[260px] rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col flex-wrap">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
