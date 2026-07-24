import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { LucideIcon, RefreshCcw } from 'lucide-react';
import TableLoader from './table.loader';
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

type CardProps = {
  title: string;
  number?: string;
  smallNumber?: string;
  className?: string;
  subtitle?: string;
  Icon?: LucideIcon;
  loading?: boolean;
  refresh?: VoidFunction;
  iconStyle?: string;
  numberClassName?: string;
  titleClassName?: string;
  cardHeaderClassName?: string;
  cardContentClassName?: string;
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
  iconStyle,
  numberClassName,
  titleClassName,
  cardHeaderClassName,
  cardContentClassName,
}: CardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col rounded-lg justify-center shadow-card hover:shadow-card-hover transition-shadow duration-200 bg-card',
        className,
      )}
    >
      <CardHeader className={cn('pb-2 p-4', cardHeaderClassName)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CardTitle
              className={cn(
                'text-base font-medium text-foreground',
                titleClassName,
              )}
            >
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
            <div
              className={cn(
                'bg-primary/10 rounded-lg h-8 w-8 flex items-center justify-center text-primary',
                iconStyle,
              )}
            >
              <Icon size={16} strokeWidth={2} />
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          'flex items-center justify-between',
          cardContentClassName,
        )}
      >
        <div>
          {loading ? (
            <TableLoader />
          ) : (
            <>
              {number && number?.length > 6 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'text-3xl font-semibold truncate w-52',
                          numberClassName ?? 'text-foreground',
                        )}
                      >
                        {number}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{number}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : Array.isArray(number) ? (
                <div
                  className={cn(
                    'text-3xl font-semibold truncate w-52',
                    numberClassName ?? 'text-foreground',
                  )}
                >
                  {number.reduce((sum, item) => sum + item.count, 0)}
                </div>
              ) : (
                <div
                  className={cn(
                    'text-3xl font-semibold truncate w-52',
                    numberClassName ?? 'text-foreground',
                  )}
                >
                  {number}
                </div>
              )}

              <div className="text-lg font-normal text-muted-foreground">
                {smallNumber}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
