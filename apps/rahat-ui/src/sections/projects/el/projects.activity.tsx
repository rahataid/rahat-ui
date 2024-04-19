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
    <Card className={cn('border-none shadow-sm h-full', className || '')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Free</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Reedemed</p>
          </div>
          <div className="space-y-1">
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.eyeVoucherBudget?.toString()}
              <span className="text-xs text-muted-foreground">
                {data?.freeVoucherCurrency}{' '}
                {data?.eyeVoucherBudget?.toString() * data?.freeVoucherPrice}
              </span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.eyeVoucherAssigned?.toString()}{' '}
              <span className="text-xs text-muted-foreground">
                {data?.freeVoucherCurrency}{' '}
                {data?.eyeVoucherAssigned?.toString() * data?.freeVoucherPrice}
              </span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.eyeVoucherClaimed?.toString()}
              <span className="text-xs text-muted-foreground">
                {data?.freeVoucherCurrency}{' '}
                {data?.eyeVoucherClaimed?.toString() * data?.freeVoucherPrice}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Discount</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Reedemed</p>
          </div>
          <div className="space-y-1">
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.referredVoucherBudget?.toString()}
              <span className="text-xs text-muted-foreground">
                {data?.referredVoucherCurrency}{' '}
                {data?.referredVoucherBudget?.toString() *
                  data?.referredVoucherPrice}
              </span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.referredVoucherAssigned?.toString()}{' '}
              <span className="text-xs text-muted-foreground">
                {data?.referredVoucherCurrency}{' '}
                {data?.referredVoucherAssigned?.toString() *
                  data?.referredVoucherPrice}
              </span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.referredVoucherClaimed?.toString()}
              <span className="text-xs text-muted-foreground">
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
