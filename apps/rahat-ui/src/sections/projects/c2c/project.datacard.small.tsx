import { cn } from '@rahat-ui/shadcn/src';
import {
  Card,
  CardDescription,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { title } from 'process';

type CardProps = {
  title: string;
  number: string;
  subTitle: string;
  className: string;
  currency: string;
  refresh?: VoidFunction;
  loading: boolean;
};

const SmallDataCard = (props: CardProps) => {
  return (
    <Card
      className={cn(
        `flex flex-col rounded-sm justify-center border-none shadow`,
        props.className,
      )}
    >
      <CardHeader className="pb-2">
        <CardDescription>{props.title}</CardDescription>
        {props.loading ? (
          <TableLoader />
        ) : (
          <CardTitle className="text-xl text-primary">
            <span className="text-xs text-muted-foreground">
              {props.currency || ' '}
            </span>
            {props.number}
          </CardTitle>
        )}
      </CardHeader>
    </Card>
  );
};
