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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 text-left">
        <div className="space-y-4">
          {/* Free Voucher Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Free</p>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-sm text-muted-foreground">Assigned</p>
              <p className="text-sm text-muted-foreground">Redeemed</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="space-y-2 min-w-10 text-right">
                <p className="text-sm font-medium leading-none">Qty</p>
                <div className="text-xs text-muted-foreground">
                  {data?.eyeVoucherBudget?.toString() || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data?.eyeVoucherAssigned?.toString() || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data?.eyeVoucherClaimed?.toString() || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="min-w-10 text-right">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Amount</p>
                  <div className="text-xs text-muted-foreground">
                    {data?.freeVoucherCurrency}{' '}
                    {data?.eyeVoucherBudget?.toString() *
                      data?.freeVoucherPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data?.freeVoucherCurrency}{' '}
                    {data?.eyeVoucherAssigned?.toString() *
                      data?.freeVoucherPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data?.freeVoucherCurrency}{' '}
                    {data?.eyeVoucherClaimed?.toString() *
                      data?.freeVoucherPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Discount Voucher Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Discount</p>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-sm text-muted-foreground">Assigned</p>
              <p className="text-sm text-muted-foreground">Redeemed</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="min-w-10 text-right">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Qty</p>
                  <div className="text-xs text-muted-foreground">
                    {data?.referredVoucherBudget?.toString() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data?.referredVoucherAssigned?.toString() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data?.referredVoucherClaimed?.toString() || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="min-w-10 text-right">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Amount</p>
                  <div className="text-xs text-muted-foreground">
                    {data?.referredVoucherCurrency}{' '}
                    {data?.referredVoucherBudget?.toString() *
                      data?.referredVoucherPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data?.referredVoucherCurrency}{' '}
                    {data?.referredVoucherAssigned?.toString() *
                      data?.referredVoucherPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data?.referredVoucherCurrency}{' '}
                    {data?.referredVoucherClaimed?.toString() *
                      data?.referredVoucherPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
