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
  className: string;
  Icon?: LucideIcon;
  refresh?: VoidFunction;
};

export default function DataCard({
  title,
  number,
  smallNumber,
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
          <div className="flex items-center gap-3">
            <CardTitle className="text-md font-medium">{title}</CardTitle>
            {refresh && (
              <RefreshCcw
                size={14}
                strokeWidth={1.5}
                className="text-primary cursor-pointer"
                onClick={refresh}
              />
            )}
          </div>
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
          <div className="flex items-end gap-4"></div>
        </div>
      </CardContent>
    </Card>
  );
}
