'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { LucideIcon, RefreshCcw } from 'lucide-react';
import TableLoader from '../../components/table.loader';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// const handleFetch = async (source: string) => {
//   const response = await fetch(source);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch data from ${source}`);
//   }
//   const res = await response?.json();
//   return res?.data;
// };

type CardProps = {
  title: string;
  value: string;
  className?: string;
  subtitle?: string;
  Icon?: LucideIcon;
  loading?: boolean;
  reportProps: Record<string, any>;
};

export default function DataCard({
  title,
  value,
  className,
  Icon,
  loading,
  subtitle,
  reportProps,
}: CardProps) {
  // const fetchData = useQuery({
  //   queryKey: ['fetch-dynamic-report', title],
  //   queryFn: () => handleFetch(),
  // });

  return (
    <Card
      className={cn(
        'flex flex-col rounded justify-center border-none shadow bg-card',
        className,
      )}
    >
      <CardHeader className="pb-2 p-4">
        <div className="flex items-start justify-between ">
          <div className="flex items-center gap-3">
            <CardTitle className="text-md font-normal text-neutral-800 text-lg">
              {title}
            </CardTitle>
            {refresh && (
              <RefreshCcw
                size={14}
                strokeWidth={1.5}
                className="text-primary cursor-pointer"
                onClick={refresh}
              />
            )}
          </div>

          {Icon && (
            <div className="bg-indigo-50 rounded-full h-8 w-8 flex items-center justify-center">
              <Icon size={20} strokeWidth={1.5} className="text-primary " />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          {loading ? (
            <TableLoader />
          ) : (
            <>
              <div className="text-4xl font-semibold text-primary">{value}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
