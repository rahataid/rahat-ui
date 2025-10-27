import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'libs/shadcn/src/components/ui/card';
import { cn } from 'libs/shadcn/src/utils';
import { Info, LucideIcon, RefreshCcw } from 'lucide-react';
import { TableLoader } from './table.loader';
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from 'libs/shadcn/src/components/ui/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

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
  badge?: boolean;
  infoIcon?: boolean;
  infoTooltip?: string;
};

export function DataCard({
  title,
  number,
  smallNumber,
  className,
  Icon,
  loading,
  subtitle,
  refresh,
  iconStyle,
  badge,
  infoIcon,
  infoTooltip,
}: CardProps) {
  return (
    <Card className={cn('flex flex-col rounded justify-center', className)}>
      <CardHeader className="pb-2 p-4">
        <div className="flex items-start justify-between ">
          <div className="flex items-center gap-3">
            <CardTitle
              className={`text-sm/6 font-semibold text-neutral-800 dark:text-white`}
            >
              {title}
            </CardTitle>
            {infoIcon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={16}
                      className="text-muted-foreground cursor-help hover:text-primary transition-colors"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {infoTooltip ||
                        'Additional information about this metric'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
                'bg-secondary rounded-full h-8 w-8 flex items-center justify-center text-primary',
                iconStyle,
              )}
            >
              <Icon size={20} strokeWidth={2} />
            </div>
          )}
        </div>
        {/* {subtitle && (
          <p className="text-sm text-muted-foreground p-0">{subtitle ?? ' '}</p>
        )} */}
        <p className="text-sm text-muted-foreground p-0 mt-0">
          {subtitle?.trim() !== '' ? subtitle : '\u00A0'}
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
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
                        // className="text-4xl font-semibold text-primary truncate w-52"
                        className={`${
                          title === 'Created By' ? 'text-xl ' : 'text-3xl'
                        } font-semibold text-primary truncate w-52`}
                      >
                        {number}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{number}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div
                  className={`${
                    title === 'Created By' ? 'text-xl' : 'text-3xl'
                  }  font-semibold text-primary truncate w-52`}
                >
                  {number}
                </div>
              )}

              {badge ? (
                <Badge>{smallNumber}</Badge>
              ) : (
                <div className="text-xl font-normal text-primary">
                  {smallNumber}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
