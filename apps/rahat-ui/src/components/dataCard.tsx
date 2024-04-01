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
  number: string;
  subTitle: string;
  className: string;
  Icon?: LucideIcon;
};

export default function DataCard({
  title,
  number,
  subTitle,
  className,
  Icon,
}: CardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col rounded justify-center border-none shadow',
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
          <div className="flex items-end gap-4">
            <p className="text-xs text-muted-foreground space-y-0 pt-2">
              {subTitle}
            </p>
            <RefreshCcw
              size={14}
              strokeWidth={1.5}
              className="text-primary cursor-pointer"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
