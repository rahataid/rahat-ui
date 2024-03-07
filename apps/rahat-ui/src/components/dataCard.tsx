import { cn } from '@rahat-ui/shadcn/src/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

type CardProps = {
  title: string;
  number1: string;
  number2: string;
  subTitle1: string;
  subTitle2: string;
  className: string;
  Icon: LucideIcon;
};

export default function DataCard({
  title,
  number1,
  number2,
  subTitle1,
  subTitle2,
  className,
  Icon,
}: CardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col justify-center border-none shadow',
        className
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
      <CardContent className="flex items-center justify-between">
        <div className="">
          <div className="text-4xl font-semibold">{number1}</div>
          <p className="text-xs text-muted-foreground space-y-0 pt-2">
            {subTitle1}
          </p>
        </div>
        <div className="">
          <div className="text-4xl font-semibold">{number2}</div>
          <p className="text-xs text-muted-foreground space-y-0 pt-2">
            {subTitle2}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
