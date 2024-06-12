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
  className?: string;
  subtitle?: string;
  icon: LucideIcon;
  loading?: boolean;
  refresh?: VoidFunction;
};

export default function StatsDataCard({
  title,
  number,
  smallNumber,
  className,
  icon,
  subtitle,
}: CardProps) {
  const Icon = icon
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
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <>
            <div className="text-4xl font-semibold text-primary">
              {number}
            </div>
            <div className="text-xl font-normal text-primary">
              {smallNumber}
            </div>
          </>
        </div>
      </CardContent>
    </Card>
  );
}
