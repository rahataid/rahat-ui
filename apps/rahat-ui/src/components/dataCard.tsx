import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { LucideIcon, RefreshCcw } from 'lucide-react';
import TableLoader from './table.loader';

type CardProps = {
  title: string;
  number?: string;
  smallNumber?: string;
  className?: string;
  subtitle?: string;
  Icon?: LucideIcon;
  loading?: boolean;
  refresh?: VoidFunction;
};

export default function DataCard({
  title,
  number,
  smallNumber,
  className,
  Icon,
  loading,
  subtitle,
  refresh,
}: CardProps) {
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
            <CardTitle className="text-lg font-medium text-neutral-800 dark:text-white">
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
            <div className="bg-indigo-50 dark:bg-secondary rounded-full h-8 w-8 flex items-center justify-center">
              <Icon size={20} strokeWidth={2.5} className="text-primary " />
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          {loading ? (
            <TableLoader />
          ) : (
            <>
              <div className="text-4xl font-semibold text-primary">
                {number}
              </div>
              <div className="text-xl font-normal text-primary">
                {smallNumber}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
