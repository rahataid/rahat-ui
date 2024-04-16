import { cn } from '@rahat-ui/shadcn/src';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ImgProps } from 'next/dist/shared/lib/get-img-props';

type CardProps = {
  title: string;
  number: string;
  subTitle: string;
  className: string;
  refresh?: VoidFunction;
};

const SmallDataCard = ({ title, number, subTitle, className }: CardProps) => {
  return (
    <Card
      className={
        (cn('flex flex-col rounded-sm justify-center border-none shadow'),
        className)
      }
    >
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl text-primary">{number}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{subTitle}</div>
      </CardContent>
    </Card>
  );
};

export default SmallDataCard;
