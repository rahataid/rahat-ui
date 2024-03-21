import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { LucideIcon } from 'lucide-react';

type CardProps = {
  title: string;
  number: string;
  subTitle: string;
  className: string;
  Icon: LucideIcon;
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
        'flex flex-col justify-center border-none shadow',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <Icon
          size={20}
          strokeWidth={1.5}
          className="h-6 w-6 text-muted-foreground"
        />
      </CardHeader>
      <CardContent>
        <div className="text-4xl text-primary font-semibold">{number}</div>
        <p className="text-xs text-muted-foreground space-y-0 pt-2">
          {subTitle}
        </p>
      </CardContent>
    </Card>
  );
}
