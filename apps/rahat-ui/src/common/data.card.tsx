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
  truncate?: boolean;
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
  truncate = true,
}: CardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col rounded-lg border justify-center',
        className,
      )}
    >
      <CardHeader className="p-3.5 pb-1.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle
              className={`text-xs/5 font-semibold text-neutral-800 dark:text-white`}
            >
              {title}
            </CardTitle>
            {infoIcon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={14}
                      className="text-muted-foreground cursor-help hover:text-primary transition-colors flex-shrink-0"
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
                className="text-primary cursor-pointer flex-shrink-0"
                onClick={refresh}
              />
            )}
          </div>

          {Icon && (
            <div
              className={cn(
                'bg-secondary rounded-full h-7 w-7 flex items-center justify-center text-primary flex-shrink-0',
                iconStyle,
              )}
            >
              <Icon size={16} strokeWidth={2} />
            </div>
          )}
        </div>
        {subtitle && subtitle.trim() !== '' && (
          <p className="text-xs text-muted-foreground p-0 mt-0.5">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-3.5 pt-0 flex items-center justify-between">
        <div>
          {loading ? (
            <TableLoader />
          ) : (
            <>
              {number && number?.length > 6 && truncate ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
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
                  } font-semibold text-primary ${
                    truncate ? 'truncate w-52' : ''
                  }`}
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
