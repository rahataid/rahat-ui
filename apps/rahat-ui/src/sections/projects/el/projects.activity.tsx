import { cn } from '@rahat-ui/shadcn/src';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

type CardProps = {
  title: string;
  image?: string;
  className?: string;
  data?: any;
};

export default function Activities({ title, className, data }: CardProps) {
  return (
    <Card
      className={cn('border-none rounded shadow-sm h-full', className || '')}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 text-left">
        {' '}
        {/* Added text-left class */}
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Free</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Redeemed</p>{' '}
          </div>
          <div className="flex items-center justify-center gap-2 ">
            <div className="font-light text-sm flex flex-col items-start justify-between">
              <div>{data?.eyeVoucherBudget?.toString()}</div>
              <div>{data?.eyeVoucherAssigned?.toString()} </div>
              <div>{data?.eyeVoucherClaimed?.toString()}</div>
            </div>
            <div className="font-light text-sm flex flex-col items-start justify-between gap-1">
              <div className="text-xs text-muted-foreground">
                {data?.freeVoucherCurrency}{' '}
                {data?.eyeVoucherBudget?.toString() * data?.freeVoucherPrice}
              </div>
              <div className="text-xs text-muted-foreground">
                {data?.freeVoucherCurrency}{' '}
                {data?.eyeVoucherAssigned?.toString() * data?.freeVoucherPrice}
              </div>
              <div className="text-xs text-muted-foreground">
                {data?.freeVoucherCurrency}{' '}
                {data?.eyeVoucherClaimed?.toString() * data?.freeVoucherPrice}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Discount</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Redeemed</p>{' '}
          </div>
          <div className="flex items-center justify-center gap-2 ">
            <div className="font-light text-sm flex flex-col items-start justify-between">
              <div>{data?.referredVoucherBudget?.toString()}</div>
              <div>{data?.referredVoucherAssigned?.toString()} </div>
              <div>{data?.referredVoucherClaimed?.toString()}</div>
            </div>
            <div className="font-light text-sm flex flex-col items-start justify-between gap-1">
              <span className="text-xs  text-muted-foreground">
                {data?.referredVoucherCurrency}{' '}
                {data?.referredVoucherBudget?.toString() *
                  data?.referredVoucherPrice}
              </span>
              <span className="text-xs  text-muted-foreground">
                {data?.referredVoucherCurrency}{' '}
                {data?.referredVoucherAssigned?.toString() *
                  data?.referredVoucherPrice}
              </span>
              <span className="text-xs  text-muted-foreground">
                {data?.referredVoucherCurrency}{' '}
                {data?.referredVoucherClaimed?.toString() *
                  data?.referredVoucherPrice}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
