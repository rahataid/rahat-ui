import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { LucideIcon, RefreshCcw } from 'lucide-react';

type CardProps = {
  title: string;
  number?: string;
  smallNumber?: string;
  subTitle: string;
  className: string;
  Icon?: LucideIcon;
  refresh?: VoidFunction;
};

export default function DataCard({
  title,
  number,
  smallNumber,
  subTitle,
  className,
  Icon,
  refresh,
}: CardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col rounded justify-center border-none shadow bg-card',
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between ">
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          <div>
            {Icon && (
              <Icon
                size={20}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="text-4xl font-semibold text-primary">{number}</div>
          <div className="text-xl font-normal text-primary">{smallNumber}</div>
          <div className="flex items-end gap-4">
            <p className="text-xs text-muted-foreground space-y-0 pt-2">
              {subTitle}
            </p>
            {refresh && (
              <RefreshCcw
                size={14}
                strokeWidth={1.5}
                className="text-primary cursor-pointer"
                onClick={refresh}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
