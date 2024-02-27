import { cn } from '@rahat-ui/shadcn/src/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';

type CardProps = {
  title: string;
  number1: string;
  number2: string;
  subTitle1: string;
  subTitle2: string;
  className: string;
  //   icon: string;
};

export default function DataCard({
  title,
  number1,
  number2,
  subTitle1,
  subTitle2,
  className,
}: CardProps) {
  return (
    <Card className={cn('flex flex-col justify-center', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-semibold">{number1}</div>
          <p className="text-xs text-muted-foreground space-y-0 pt-2">
            {subTitle1}
          </p>
        </div>
        <div>
          <div className="text-4xl font-semibold">{number2}</div>
          <p className="text-xs text-muted-foreground space-y-0 pt-2">
            {subTitle2}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
