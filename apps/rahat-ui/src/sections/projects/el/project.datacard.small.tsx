import { cn } from '@rahat-ui/shadcn/src';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { ImgProps } from 'next/dist/shared/lib/get-img-props';

type CardProps = {
  title: string;
  number: number;
  currency?: string;
  refresh?: VoidFunction;
  loading?: boolean;
  className?: any;
};

const SmallDataCard = ({
  title,
  number,
  currency,
  loading,
  className,
}: CardProps) => {
  return (
    <Card
      className={cn(
        'flex flex-col rounded justify-center border-none shadow',
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        {loading ? (
          <TableLoader />
        ) : (
          <CardTitle className="text-xl text-primary">
            <span className="text-xs text-muted-foreground">
              {currency || ' '}{' '}
            </span>
            {number || '-'}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default SmallDataCard;
